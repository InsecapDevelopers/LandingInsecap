/**
 * Prerender del sitio: escribe un HTML completo por ruta e idioma para que buscadores y bots
 * de IA (que no ejecutan JS) vean el contenido. El cliente después hidrata con hydrateRoot.
 *
 * Uso (lo corre `npm run build` después de los dos `vite build`):
 *   node scripts/prerender.mjs
 *
 * Entrada:
 *   dist/index.html                 plantilla del build de cliente (marcadores <!--app-preload-->,
 *                                   <!--app-head-->, <!--app-html--> y <!--splash-tagline-->)
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
 *   dist/csp.conf                   Content-Security-Policy-Report-Only (Fase 7, scripts/csp.mjs) con
 *                                   los hashes sha256 de todos los scripts inline del build. El
 *                                   Dockerfile lo copia a /etc/nginx/snippets/csp.conf (no se publica).
 *   dist/_report/urls.csv           URL, robots, title, description y H1 de cada página (entregable
 *                                   de la Fase 3 para revisar metadatos). No se publica: el
 *                                   Dockerfile lo borra.
 *   dist/robots.txt                 Fase 5 (src/lib/crawler-files.ts): Allow a todos + bloque para
 *   dist/sitemap-index.xml          bots de IA; sitemaps con las URLs indexables (canonical 200,
 *   dist/sitemap-es.xml             hreflang y lastmod real); llms.txt y llms-full.txt desde el
 *   dist/sitemap-intl.xml           mismo HTML renderizado. El lastmod de las páginas estáticas
 *   dist/llms.txt                   sale del último commit de sus archivos fuente
 *   dist/llms-full.txt              (scripts/source-lastmod.mjs: git o .source-lastmod.json).
 *
 * Datos: las rutas dinámicas (noticias, fichas de curso, categorías y sedes) salen de `listDynamicPaths` y cada página
 * precarga sus datos con `prefetchRoute` (mismas queryFn que el cliente, src/lib/queries.ts).
 * El estado de react-query viaja en <script type="application/json" id="__RQ__"> con `<` escapado:
 * es un bloque de datos (no se ejecuta), así que no necesita hash en el CSP aunque cambie por página.
 *
 * Preload (Fase 6): en <!--app-preload-->, justo después de charset y viewport, Montserrat latin
 * 400 y 700 (woff2 con hash en dist/assets) y la imagen LCP de la página: el primer <img> con
 * fetchpriority="high" del HTML renderizado (VideoHero, PageHero), con su mismo srcset y sizes.
 *
 * JSON-LD (Fase 4): el <head> de cada página trae un solo <script type="application/ld+json"> con
 * @graph (global #org/#website + nodos de la página + BreadcrumbList), que arma `render` en
 * src/entry-server.tsx con mergeJsonLdScripts (src/lib/jsonld.ts).
 *
 * Falla (exit 1) si alguna ruta lanza un error de render, si falla una petición al TMS Plus o si no
 * se cumple la guarda de noticias (mínimo de noticias, entry-server.tsx).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { loadEnv } from 'vite';

import { buildCspConf, inlineScripts, scriptHash } from './csp.mjs';
import { loadSourceLastmods } from './source-lastmod.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-server.js');

const PRELOAD_MARK = '<!--app-preload-->';
const HEAD_MARK = '<!--app-head-->';
const HTML_MARK = '<!--app-html-->';
const TAGLINE_MARK = '<!--splash-tagline-->';
const ROOT_DIV = `<div id="root">${HTML_MARK}</div>`;

const templatePath = path.join(DIST, 'index.html');
/**
 * Fase 6: el bundle de la app (el <script type="module"> que inserta Vite) no hace falta para la
 * primera pintura, porque el HTML llega completo. Se pide recién después del primer contentful paint
 * (PerformanceObserver de `paint`; sin soporte, después del primer frame con requestAnimationFrame),
 * con un tope de 3 s por si no hay pintura (pestaña en segundo plano). Así no le quita ancho de banda
 * al CSS, a las fuentes ni a la imagen LCP, e hidrata apenas termina de bajar. Con el <script> en el
 * HTML, Lighthouse lo contaba dentro del LCP: en /es el LCP simulado bajaba de 3,6 s a 2,2 s sin él.
 * Este script inline entra al CSP por su hash (dist/csp.conf); su texto cambia con el hash del bundle.
 * El shell (_shell.html, sin HTML que pintar) conserva el <script type="module"> directo: ahí el
 * primer contentful paint lo hace el propio JS.
 */
const ENTRY_SCRIPT = /<script type="module" crossorigin src="(\/assets\/index-[\w-]+\.js)"><\/script>/;
const rawTemplate = fs.readFileSync(templatePath, 'utf8');
const [entryTag, entrySrc] = rawTemplate.match(ENTRY_SCRIPT) ?? [];
if (!entrySrc) {
  console.error('[prerender] La plantilla dist/index.html no tiene el <script type="module"> de la app');
  process.exit(1);
}
const deferredEntry = `<script>(function(){var d=0,P=window.PerformanceObserver;function go(){if(d)return;d=1;var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src='${entrySrc}';document.head.appendChild(s)}if(P&&P.supportedEntryTypes&&P.supportedEntryTypes.indexOf('paint')>=0){new P(function(l,o){if(l.getEntriesByName('first-contentful-paint').length){o.disconnect();setTimeout(go)}}).observe({type:'paint',buffered:true});setTimeout(go,3000)}else requestAnimationFrame(function(){setTimeout(go)})})()</script>`;
const template = rawTemplate.replace(ENTRY_SCRIPT, () => deferredEntry);

for (const mark of [PRELOAD_MARK, HEAD_MARK, ROOT_DIV, TAGLINE_MARK]) {
  if (!template.includes(mark)) {
    console.error(`[prerender] La plantilla dist/index.html no tiene ${mark}`);
    process.exit(1);
  }
}

const ssr = await import(pathToFileURL(SSR_ENTRY).href);

/** Preload de Montserrat latin 400 y 700 (src/index.css): el texto de la primera vista. */
const assetFiles = fs.readdirSync(path.join(DIST, 'assets'));
const fontPreloads = ['400', '700'].map((weight) => {
  const file = assetFiles.find((name) => new RegExp(`^montserrat-latin-${weight}-normal-[\\w-]+\\.woff2$`).test(name));
  if (!file) {
    console.error(`[prerender] No está dist/assets/montserrat-latin-${weight}-normal-*.woff2 (src/index.css)`);
    process.exit(1);
  }
  return `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`;
}).join('\n    ');

/** Preload de la imagen LCP: el primer <img fetchpriority="high"> del HTML, con su srcset/sizes. */
const lcpImagePreload = (html) => {
  const img = html.match(/<img\b[^>]*\bfetchpriority="high"[^>]*>/)?.[0];
  if (!img) return '';
  // Sin distinguir mayúsculas: React escribe `srcSet` en el HTML del servidor.
  const attr = (name) => img.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1];
  const src = attr('src');
  if (!src) return '';
  const srcset = attr('srcset');
  const sizes = attr('sizes');
  return `<link rel="preload" as="image" href="${src}"${srcset ? ` imagesrcset="${srcset}"` : ''}${sizes ? ` imagesizes="${sizes}"` : ''} fetchpriority="high" />`;
};

/** JSON seguro dentro de <script>: sin `<` (evita </script> y <!--) ni separadores de línea. */
const serializeState = (state) =>
  JSON.stringify(state)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

/** Hashes sha256 de los scripts inline de todas las páginas escritas (CSP, Fase 7). */
const cspHashes = new Set();

const buildPage = ({ head, html, htmlAttributes, dehydratedState, locale }) => {
  const rqScript = dehydratedState && dehydratedState.queries.length > 0
    ? `<script type="application/json" id="__RQ__">${serializeState(dehydratedState)}</script>`
    : '';

  const preload = [fontPreloads, lcpImagePreload(html)].filter(Boolean).join('\n    ');
  let page = (html ? template : template.replace(deferredEntry, () => entryTag))
    .replace(PRELOAD_MARK, () => preload)
    .replace(HEAD_MARK, () => head)
    .replace(ROOT_DIV, () => `<div id="root">${html}</div>${rqScript}`)
    .replace(TAGLINE_MARK, () => ssr.getSplashTagline(locale));

  if (htmlAttributes) {
    page = page.replace(/<html[^>]*>/, () => `<html ${htmlAttributes}>`);
  }

  for (const body of inlineScripts(page)) cspHashes.add(scriptHash(body));
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
/** HTML de cada página para los archivos de crawlers (Fase 5). */
const rendered = [];
for (const { url, locale } of urls) {
  try {
    const page = await renderUrl(url, locale);
    writeFile(path.join(url.slice(1), 'index.html'), page);
    report.push(reportRow(url, page));
    rendered.push({ url, html: page });
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

// Archivos para crawlers y agentes (Fase 5): robots.txt, sitemaps, llms.txt y llms-full.txt.
// Lanza (y el build falla) si una página contradice a seo-routes.ts o si falta PAGE_SOURCES.
let crawlerSummary = '';
try {
  const missingSources = ssr.listPageSourceFiles().filter((file) => !fs.existsSync(path.join(ROOT, file)));
  if (missingSources.length > 0) {
    throw new Error(`PAGE_SOURCES (src/lib/crawler-files.ts) con archivos que no existen: ${missingSources.join(', ')}`);
  }
  const { dates, origin } = loadSourceLastmods();
  if (!origin) {
    console.warn('[prerender] Sin git con historia ni .source-lastmod.json: las páginas estáticas salen sin <lastmod>.');
  }
  const crawler = ssr.buildCrawlerFiles(rendered, (file) => dates[file] ?? null);
  for (const [name, content] of Object.entries(crawler.files)) writeFile(name, content);
  if (crawler.withoutLastmod.length > 0) {
    console.warn(`[prerender] ${crawler.withoutLastmod.length} URL(s) del sitemap sin <lastmod>: ${crawler.withoutLastmod.slice(0, 5).join(', ')}${crawler.withoutLastmod.length > 5 ? '…' : ''}`);
  }
  crawlerSummary = ` + robots.txt, sitemaps (${crawler.urls} URLs, lastmod de ${origin ?? 'ninguna fuente'}), llms.txt y llms-full.txt`;
} catch (error) {
  failures.push(new Error(`archivos para crawlers: ${(error && error.message) || error}`));
}
rendered.length = 0;

// 404 real: cualquier ruta que no existe cae en <NotFound /> con robots noindex.
try {
  writeFile('404.html', await renderUrl('/es/__404__', 'es'));
  // Una 404 por idioma: el cliente hidrata con el locale de la URL, así que /en/x necesita la 404 en inglés.
  for (const locale of ['en', 'pt']) {
    writeFile(`404-${locale}.html`, await renderUrl(`/${locale}/__404__`, locale));
  }
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

// CSP (Fase 7): un solo juego de hashes para todo el sitio. Hoy son 3 (splash, terceros y el loader
// del bundle) más el <script type="module"> del shell, que es externo y no suma. Si aparecen más,
// es que algún componente escribe un <script> inline por página: conviene revisarlo.
writeFile('csp.conf', buildCspConf(cspHashes, loadEnv('production', ROOT, 'VITE_')));

if (failures.length > 0) {
  for (const error of failures) console.error(`[prerender] ${error.message}`);
  console.error(`[prerender] ${failures.length} ruta(s) con error.`);
  process.exit(1);
}

console.log(`[prerender] ${urls.length} páginas + 404.html + _shell.html + redirects.map (${redirectsCount} reglas) + csp.conf (${cspHashes.size} hashes) + _report/urls.csv${crawlerSummary} en ${((Date.now() - started) / 1000).toFixed(1)} s`);
