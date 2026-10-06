/**
 * Entrada del render en el servidor. La usa scripts/prerender.mjs en el build
 * (`vite build --ssr src/entry-server.tsx --outDir dist-ssr`); no corre en producción.
 */
import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { matchPath } from "react-router-dom";
import {
  dehydrate,
  type DehydratedState,
  type FetchQueryOptions,
  type QueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import type { HelmetServerState } from "react-helmet-async";
import { AppShell, createQueryClient, routerFuture } from "./AppShell";
import i18n from "./lib/i18n";
import { getLocaleFromPath, stripLocaleFromPath } from "./lib/locale-routing";
import { storefrontApiRequest } from "./lib/shopify";
import { getLegacyRedirects, toNginxMap, type EaProductArea } from "./lib/legacy-redirects";
import {
  NEWS_PER_PAGE,
  NEWS_SLIDER_COUNT,
  newsAllQuery,
  newsArticleQuery,
  newsListQuery,
} from "./lib/queries";
import {
  buildSeoRouteUrl,
  isDynamicSeoRoute,
  isSeoRouteIndexable,
  seoLocales,
  seoRoutes,
  type SeoRoute,
} from "./lib/seo-routes";
import { fallbackLanguage, type AppLanguage } from "./lib/translations";
import { cursoAreas, cursosSeo, slugify } from "./data/cursos-seo";
import { sedes } from "./data/sedes";

export { createQueryClient, seoLocales, seoRoutes, isSeoRouteIndexable, buildSeoRouteUrl, isDynamicSeoRoute };

export interface RenderResult {
  html: string;
  /** Tags para el <head> (title, meta, link, script ld+json…) generados por react-helmet-async. */
  head: string;
  /** Atributos del <html> (lang). */
  htmlAttributes: string;
  dehydratedState: DehydratedState;
  /** Errores de render: el prerender falla si hay alguno (React dejaría un fallback de cliente en el HTML). */
  errors: unknown[];
}

/**
 * Guardas del build (decisión 1.6): si Shopify o el TMS Plus fallan o devuelven menos datos de lo
 * esperable, el build falla y en producción sigue la imagen anterior.
 */
export const MIN_NEWS = 1;
/** Productos `ea-*` para el mapa de 301 (hoy 142). Menos de esto indica una consulta rota. */
export const MIN_EA_PRODUCTS = 1;

/**
 * Caché del build: cada dato remoto se pide una sola vez aunque lo usen varias páginas e idiomas.
 * Cada render recibe su propio QueryClient con solo lo que usa (así __RQ__ no arrastra todo).
 * Con retry:false y fetchQuery, una petición fallida lanza y el prerender termina con exit 1.
 */
const buildCache = createQueryClient({ server: true });

const prefetchShared = async <TData, TKey extends QueryKey>(
  queryClient: QueryClient,
  options: FetchQueryOptions<TData, Error, TData, TKey>,
) => {
  const data: TData = await buildCache.fetchQuery(options);
  queryClient.setQueryData<TData>(options.queryKey, data);
};

/** Ejecuta `task` sobre cada elemento con a lo más `limit` en paralelo (no satura la API del TMS Plus). */
const runPool = async <T,>(items: T[], limit: number, task: (item: T) => Promise<unknown>) => {
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      await task(items[next++]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
};

const loadAllNews = async () => {
  const articles = await buildCache.fetchQuery(newsAllQuery());
  if (articles.length < MIN_NEWS) {
    throw new Error(`[guarda] El TMS Plus devolvió ${articles.length} noticias (mínimo ${MIN_NEWS}).`);
  }
  // Calienta el detalle de todas las noticias una vez, en paralelo, para los tres idiomas.
  await runPool(articles, 6, (article) => buildCache.fetchQuery(newsArticleQuery(article.handle)));
  return articles;
};

const EA_PRODUCTS_QUERY = `
  query EaProducts($after: String) {
    products(first: 250, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges { node { handle tags } }
    }
  }
`;

/**
 * Handles `ea-*` de Shopify (ecommerce apagado) con el área del catálogo según su tag
 * (SEGURIDAD Y PREVENCIÓN DE RIESGOS → seguridad-y-prevencion-de-riesgos…). PRE-CONTRATO,
 * RECERTIFICACIONES y los productos sin tag de área quedan en null (→ /cursos).
 * TODO: tabla `ea-*` → tema para redirigir a la ficha exacta (sección 4, punto 4).
 */
const loadEaProducts = async (): Promise<EaProductArea[]> => {
  const areaSlugs = new Set(cursoAreas.map((area) => area.slug));
  const products: EaProductArea[] = [];
  let after: string | null = null;

  do {
    const { data } = await storefrontApiRequest(EA_PRODUCTS_QUERY, { after });
    for (const { node } of data.products.edges as Array<{ node: { handle: string; tags: string[] } }>) {
      if (!node.handle.startsWith("ea-")) continue;
      const areaSlug = node.tags.map(slugify).find((slug) => areaSlugs.has(slug)) ?? null;
      products.push({ handle: node.handle, areaSlug });
    }
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);

  if (products.length < MIN_EA_PRODUCTS) {
    throw new Error(`[guarda] Shopify devolvió ${products.length} productos ea-* (mínimo ${MIN_EA_PRODUCTS}).`);
  }
  return products.sort((a, b) => a.handle.localeCompare(b.handle));
};

/** Contenido de dist/redirects.map (nginx). Lanza si falla Shopify: el build se detiene. */
export async function buildRedirectsMap(): Promise<{ map: string; count: number }> {
  const redirects = getLegacyRedirects(await loadEaProducts());
  return { map: toNginxMap(redirects), count: redirects.length };
}

/**
 * Rutas concretas de una ruta con parámetros: una por noticia, ficha, categoría y sede, en cada idioma
 * (en /en y /pt salen con noindex según seo-routes). Lanza si falla una guarda o una petición.
 */
export async function listDynamicPaths(route: SeoRoute, locale: AppLanguage): Promise<string[]> {
  switch (route.path) {
    case "noticias/:slug": {
      const articles = await loadAllNews();
      return articles.map((article) => `/${locale}/noticias/${article.handle}`);
    }
    // Datos locales (src/data): fichas, categorías y sedes.
    case "cursos/:slug":
      return cursosSeo.map((curso) => `/${locale}/cursos/${curso.slug}`);
    case "cursos/categoria/:area":
      return cursoAreas.map((area) => `/${locale}/cursos/categoria/${area.slug}`);
    case "sedes/:sede":
      return sedes.map((sede) => `/${locale}/sedes/${sede.slug}`);
    default:
      throw new Error(`[prerender] Ruta dinámica sin listDynamicPaths: ${route.path}`);
  }
}

/**
 * Precarga en el QueryClient del render los datos que la ruta necesita para que el HTML salga
 * completo. Usa las mismas opciones (queryKey/queryFn) que los useQuery de los componentes.
 */
export async function prefetchRoute(url: string, queryClient: QueryClient): Promise<void> {
  const path = stripLocaleFromPath(url);
  const match = (pattern: string) => matchPath({ path: pattern, end: true }, path);

  if (match("/")) {
    await prefetchShared(queryClient, newsListQuery(1, NEWS_SLIDER_COUNT));
    return;
  }

  if (match("/noticias")) {
    await prefetchShared(queryClient, newsListQuery(1, NEWS_PER_PAGE));
    return;
  }

  const article = match("/noticias/:slug");
  if (article) {
    await prefetchShared(queryClient, newsArticleQuery(article.params.slug ?? ""));
  }
}

export function getSplashTagline(locale: AppLanguage): string {
  return i18n.getFixedT(locale)("splash.tagline");
}

export async function render(url: string, queryClient: QueryClient = createQueryClient({ server: true })): Promise<RenderResult> {
  await i18n.changeLanguage(getLocaleFromPath(url) ?? fallbackLanguage);

  const helmetContext: { helmet?: HelmetServerState } = {};
  const errors: unknown[] = [];

  const html = await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        callback();
      },
      final(callback) {
        // React 18.3 deja un byte NUL de más cuando un carácter multibyte (p. ej. "¿") cae en el
        // borde de su búfer de 2048 bytes: el texto queda intacto, pero grep trata el HTML como
        // binario. Un NUL nunca es válido en HTML, así que se quita.
        resolve(Buffer.concat(chunks).toString("utf8").split("\u0000").join(""));
        callback();
      },
    });

    const stream = renderToPipeableStream(
      <StaticRouter location={url} future={routerFuture}>
        <AppShell queryClient={queryClient} helmetContext={helmetContext} />
      </StaticRouter>,
      {
        // onAllReady y no onShellReady: espera a todo Suspense (React.lazy) para no dejar fallbacks en el HTML.
        onAllReady() {
          stream.pipe(sink);
        },
        onShellError: reject,
        onError(error) {
          errors.push(error);
        },
      },
    );
  });

  const { helmet } = helmetContext;
  const head = helmet
    ? [helmet.title, helmet.meta, helmet.link, helmet.script, helmet.style, helmet.noscript, helmet.base]
      .map((part) => part.toString())
      .filter(Boolean)
      .join("\n    ")
    : "";

  return {
    html,
    head,
    htmlAttributes: helmet ? helmet.htmlAttributes.toString() : "",
    dehydratedState: dehydrate(queryClient),
    errors,
  };
}
