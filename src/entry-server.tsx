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
import { isB2bCatalogEnabled } from "./lib/featureFlags";
import {
  b2bTopicsQuery,
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
export const MIN_B2B_TOPICS = 50;
export const MIN_NEWS = 1;

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

const loadB2bTopics = async () => {
  const topics = await buildCache.fetchQuery(b2bTopicsQuery());
  if (topics.length < MIN_B2B_TOPICS) {
    throw new Error(`[guarda] Shopify devolvió ${topics.length} temas B2B (mínimo ${MIN_B2B_TOPICS}).`);
  }
  return topics;
};

/**
 * Rutas concretas de una ruta con parámetros: una por noticia y una por ficha B2B, en cada idioma
 * (en /en y /pt salen con noindex según seo-routes). Lanza si falla una guarda o una petición.
 */
export async function listDynamicPaths(route: SeoRoute, locale: AppLanguage): Promise<string[]> {
  switch (route.path) {
    case "noticias/:blogHandle/:articleHandle": {
      const articles = await loadAllNews();
      return articles.map((article) => `/${locale}/noticias/${article.blog.handle}/${article.handle}`);
    }
    case "curso-empresa/:handle": {
      if (!isB2bCatalogEnabled) return [];
      const topics = await loadB2bTopics();
      return topics.map((topic) => `/${locale}/curso-empresa/${topic.handle}`);
    }
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

  const article = match("/noticias/:blogHandle/:articleHandle");
  if (article) {
    await prefetchShared(queryClient, newsArticleQuery(article.params.articleHandle ?? ""));
    return;
  }

  if (isB2bCatalogEnabled && (match("/cursos-empresas") || match("/curso-empresa/:handle"))) {
    await loadB2bTopics();
    await prefetchShared(queryClient, b2bTopicsQuery());
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
        resolve(Buffer.concat(chunks).toString("utf8"));
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
