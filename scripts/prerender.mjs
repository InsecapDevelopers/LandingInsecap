/**
 * Prerender del sitio: escribe un HTML completo por ruta e idioma para que buscadores y bots
 * de IA (que no ejecutan JS) vean el contenido. El cliente después hidrata con hydrateRoot.
 *
 * Uso (lo corre `npm run build` después de los dos `vite build`):
 *   node scripts/prerender.mjs
 *
 * Entrada:
 *   dist/index.html                 plantilla del build de cliente (marcadores <!--app-head-->,
 *                                   <!--app-html--> y <!--splash-tagline-->)
 *   dist-ssr/entry-server.js        build SSR de src/entry-server.tsx
 *
 * Salida:
 *   dist/<locale>/<ruta>/index.html una página por ruta de src/lib/seo-routes.ts en es, en y pt
 *   dist/404.html                   página de error (nginx: error_page 404)
 *   dist/_shell.html                shell vacío con noindex para rutas dinámicas fuera del build
 *   dist/index.html                 se reemplaza por el mismo shell (no queda la plantilla cruda)
 *   dist/redirects.map              301 de las URLs antiguas (src/lib/legacy-redirects.ts) para
 *                                   `map $uri $legacy_redirect` de nginx.conf. El Dockerfile lo
 *                                   mueve a /etc/nginx/redirects.map (no se publica como archivo).
 *   dist/_report/urls.csv           URL, robots, title, description y H1 de cada página (entregable
 *                                   de la Fase 3 para revisar metadatos). No se publica: el
 *                                   Dockerfile lo borra.
 *
 * Datos: las rutas dinámicas (noticias y fichas B2B) salen de `listDynamicPaths` y cada página
 * precarga sus datos con `prefetchRoute` (mismas queryFn que el cliente, src/lib/queries.ts).
 * El estado de react-query viaja en window.__RQ__ con `<` escapado.
 *
 * JSON-LD (Fase 4): el <head> de cada página trae un solo <script type="application/ld+json"> con
 * @graph (global #org/#website + nodos de la página + BreadcrumbList), que arma `render` en
 * src/entry-server.tsx con mergeJsonLdScripts (src/lib/jsonld.ts).
 *
 * Falla (exit 1) si alguna ruta lanza un error de render, si falla una petición a Shopify (productos
 * `ea-*` del mapa de 301) o al TMS Plus, o si no se cumplen las guardas (mínimo de temas B2B y de noticias, entry-server.tsx).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-server.js');

const HEAD_MARK = '<!--app-head-->';
const HTML_MARK = '<!--app-html-->';
const TAGLINE_MARK = '<!--splash-tagline-->';
const ROOT_DIV = `<div id="root">${HTML_MARK}</div>`;

const templatePath = path.join(DIST, 'index.html');
const template = fs.readFileSync(templatePath, 'utf8');

for (const mark of [HEAD_MARK, ROOT_DIV, TAGLINE_MARK]) {
  if (!template.includes(mark)) {
    console.error(`[prerender] La plantilla dist/index.html no tiene ${mark}`);
    process.exit(1);
  }
}

const ssr = await import(pathToFileURL(SSR_ENTRY).href);

/** JSON seguro dentro de <script>: sin `<` (evita </script> y <!--) ni separadores de línea de JS. */
const serializeState = (state) =>
  JSON.stringify(state)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

const buildPage = ({ head, html, htmlAttributes, dehydratedState, locale }) => {
  const rqScript = dehydratedState && dehydratedState.queries.length > 0
    ? `<script>window.__RQ__=${serializeState(dehydratedState)}</script>`
    : '';

  let page = template
    .replace(HEAD_MARK, () => head)
    .replace(ROOT_DIV, () => `<div id="root">${html}</div>${rqScript}`)
    .replace(TAGLINE_MARK, () => ssr.getSplashTagline(locale));

  if (htmlAttributes) {
    page = page.replace(/<html[^>]*>/, () => `<html ${htmlAttributes}>`);
  }

  return page;
};

/** Texto plano de un fragmento HTML del prerender (sin etiquetas, entidades básicas decodificadas). */
const plainText = (html) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const metaContent = (page, name) =>
  plainText((page.match(new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]*)"`, 'i')) || [])[1] ?? '');

/** Fila del reporte urls.csv para una página renderizada. */
const reportRow = (url, page) => ({
  url,
  robots: metaContent(page, 'robots'),
  title: plainText((page.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] ?? ''),
  description: metaContent(page, 'description'),
  h1: plainText((page.match(/<h1[\s>][\s\S]*?<\/h1>/i) || [''])[0]),
});

const csvCell = (value) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

const writeFile = (relativePath, content) => {
  const target = path.join(DIST, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
};

/** URLs a prerenderizar: rutas estáticas de la tabla y, para las dinámicas, las que entregue el SSR. */
const collectUrls = async () => {
  const urls = [];

  for (const locale of ssr.seoLocales) {
    for (const route of ssr.seoRoutes) {
      if (!route.prerender) continue;

      if (ssr.isDynamicSeoRoute(route)) {
        const paths = await ssr.listDynamicPaths(route, locale);
        for (const url of paths) urls.push({ url, locale });
      } else {
        urls.push({ url: ssr.buildSeoRouteUrl(route, locale), locale });
      }
    }
  }

  return urls;
};

const renderUrl = async (url, locale) => {
  const queryClient = ssr.createQueryClient({ server: true });
  await ssr.prefetchRoute(url, queryClient);
  const result = await ssr.render(url, queryClient);

  if (result.errors.length > 0) {
    throw new Error(`${url}: ${result.errors.map((error) => (error && error.stack) || String(error)).join('\n')}`);
  }

  return buildPage({ ...result, locale });
};

const started = Date.now();
const failures = [];
let urls;
try {
  urls = await collectUrls();
} catch (error) {
  console.error(`[prerender] No se pudieron obtener las rutas dinámicas: ${(error && error.message) || error}`);
  process.exit(1);
}

const report = [];
for (const { url, locale } of urls) {
  try {
    const page = await renderUrl(url, locale);
    writeFile(path.join(url.slice(1), 'index.html'), page);
    report.push(reportRow(url, page));
  } catch (error) {
    failures.push(error);
  }
}

// Reporte de metadatos (Fase 3): una fila por página, ordenado por URL.
const REPORT_COLUMNS = ['url', 'robots', 'title', 'description', 'h1'];
writeFile(
  path.join('_report', 'urls.csv'),
  `${[REPORT_COLUMNS.join(','), ...report
    .sort((a, b) => a.url.localeCompare(b.url))
    .map((row) => REPORT_COLUMNS.map((column) => csvCell(row[column])).join(','))].join('\n')}\n`,
);

// 404 real: cualquier ruta que no existe cae en <NotFound /> con robots noindex.
try {
  writeFile('404.html', await renderUrl('/es/__404__', 'es'));
} catch (error) {
  failures.push(error);
}

// 301 de las URLs antiguas en un solo salto (Fase 2). Sin el mapa, nginx no arranca: falla el build.
let redirectsCount = 0;
try {
  const { map, count } = await ssr.buildRedirectsMap();
  writeFile('redirects.map', map);
  redirectsCount = count;
} catch (error) {
  failures.push(new Error(`redirects.map: ${(error && error.message) || error}`));
}

// Shell para rutas dinámicas que no estaban en el build (noticia nueva, URL de Ads a un ea-*):
// 200 + noindex, render en el cliente.
const shell = buildPage({
  head: '<meta name="robots" content="noindex, follow" />\n    <title>INSECAP</title>',
  html: '',
  htmlAttributes: '',
  dehydratedState: null,
  locale: 'es',
});
writeFile('_shell.html', shell);
fs.writeFileSync(templatePath, shell);

if (failures.length > 0) {
  for (const error of failures) console.error(`[prerender] ${error.message}`);
  console.error(`[prerender] ${failures.length} ruta(s) con error.`);
  process.exit(1);
}

console.log(`[prerender] ${urls.length} páginas + 404.html + _shell.html + redirects.map (${redirectsCount} reglas) + _report/urls.csv en ${((Date.now() - started) / 1000).toFixed(1)} s`);
