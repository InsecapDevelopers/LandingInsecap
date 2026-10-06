/**
 * Contrato del HTML prerenderizado: corre al final de `npm run build` y lo hace fallar si una
 * página no cumple lo que necesitan buscadores y bots de IA sin ejecutar JS (Fase 1, tarea #8).
 *
 * Uso:
 *   node scripts/check-dist.mjs                       # todo (lo corre npm run build)
 *   node scripts/check-dist.mjs --no-redirect-chains  # solo redirecciones y enlaces internos
 *
 * Por página (dist/<locale>/…/index.html):
 *   - sin marcadores de plantilla sin reemplazar
 *   - <html lang> del idioma de la ruta (es-CL, en, pt)
 *   - un <title> y un <meta name="robots">
 *   - exactamente un <h1>
 *   - al menos un <a href="/…"> interno
 *   - exactamente un <script type="application/ld+json"> (ver JSON-LD, Fase 4)
 *   - sin fallbacks de render en cliente (<!--$!-->) que dejaría un error de SSR
 *   - #__RQ__ (bloque type="application/json") sin `<` crudo
 * Además: más de 800 palabras visibles en /es, y 404.html y _shell.html con noindex.
 *
 * Metadatos (Fase 3), en todas las páginas:
 *   - title de 60 caracteres o menos y description de 140–155
 *   - una <link rel="canonical"> absoluta y autorreferente (https://insecap.cl/<locale>/…)
 *   - sin <meta name="keywords">
 *   - una og:image absoluta; og:image:width/height/type solo con la imagen por defecto y con
 *     sus valores (1200×630 image/png): una imagen propia (noticias) no hereda los de la defecto
 *   - las páginas noindex no llevan hreflang
 * HTML semántico (Fase 3), en todas las páginas:
 *   - un <main>, y al menos un <header> y un <footer>
 *   - <address> con enlaces tel: y mailto: (NAP de src/data/sedes.ts en el Footer)
 *   - todo <img> con atributo alt (alt="" solo en imágenes decorativas)
 *   - todo <a href> con nombre accesible (texto, aria-label o alt de su imagen) y sin textos
 *     sueltos como "ver más", "aquí" o "click aquí"
 *   - en cursos, categorías, sedes y noticias: breadcrumb visible (<nav aria-label><ol>) con la
 *     página actual marcada con aria-current="page"
 * Entre las páginas indexables:
 *   - sin titles ni descriptions duplicados
 *   - hreflang recíproco: incluye la propia página, cada alternativa existe, se indexa y enlaza
 *     de vuelta, y x-default apunta a la versión /es
 *
 * JSON-LD (Fase 4), en todas las páginas:
 *   - un solo bloque que parsea como {"@context":"https://schema.org","@graph":[…]} con #org y #website
 *   - cada {"@id"} referenciado existe en el grafo de la página o en el global (el de /es)
 *   - sin "TODO" ni "Por confirmar" dentro del JSON-LD
 *   - estructura mínima por tipo: Course (name, description, provider, hasCourseInstance con
 *     courseMode onsite/online/blended y courseWorkload ISO 8601), BreadcrumbList (posiciones 1..n
 *     con name e item absolutos), FAQPage (Question con acceptedAnswer.text), NewsArticle
 *     (headline, author, fechas con desfase horario), sede (PostalAddress, telephone, parentOrganization)
 *   - por ruta: Course en fichas, #place en sedes, FAQPage en preguntas-frecuentes, NewsArticle en
 *     noticias y BreadcrumbList en toda página con breadcrumb visible
 * Archivos para crawlers y agentes (Fase 5, src/lib/crawler-files.ts):
 *   - robots.txt con `User-agent: *` + Allow /, Disallow /api/, un bloque con los bots de IA y la
 *     línea Sitemap; nunca `Disallow: /`
 *   - sitemap-index.xml lista sitemap-es.xml (/es) y sitemap-intl.xml (/en y /pt)
 *   - cada <loc> existe en dist/ y es indexable (robots index + canonical a sí misma), sin
 *     duplicados, con <lastmod> W3C no futuro y el mismo hreflang que la página; y toda página
 *     indexable está en algún sitemap
 *   - llms.txt con H1, blockquote y las secciones Cursos/Sedes/Información/Optional; cada enlace
 *     a insecap.cl es una página indexable del build. llms-full.txt con H1 y solo URLs indexables
 *   - sin .well-known/ai-catalog.json (debe dar 404)
 * Imágenes y fuentes (Fase 6, Core Web Vitals):
 *   - ninguna imagen o video de dist/ pasa de 200 KB (recomprimir a WebP/AVIF al tamaño de render)
 *   - Montserrat: solo woff2 en dist/assets, 8 archivos o menos (latin + latin-ext, 400–700)
 *   - cada página precarga la fuente (scripts/prerender.mjs) y no carga Google Fonts
 * JavaScript y terceros (Fase 6, etapa 2):
 *   - sin fallbacks de Suspense en el HTML (<!--$?-->, <!--$!-->, <template id="B:…">): las páginas
 *     con React.lazy deben salir completas (onAllReady en src/entry-server.tsx)
 *   - el bundle de la app no va como <script type="module" src> (bloquearía el LCP en Lighthouse):
 *     lo inserta el loader de prerender.mjs después del primer paint
 *   - GTM, gtag, Meta Pixel y Clarity no van como <script src> en el HTML (los inserta el cargador
 *     diferido de index.html)
 * Seguridad (Fase 7, scripts/csp.mjs):
 *   - dist/csp.conf existe y trae el hash sha256 de cada <script> inline ejecutable de todas las
 *     páginas, 404.html y _shell.html (si no, el CSP reportaría o, en enforce, bloquearía el script)
 *   - sin manejadores de eventos en atributos (onclick="…") ni enlaces javascript:, que el CSP
 *     sin 'unsafe-inline' tampoco permite
 * Contenido citable (Fase 8):
 *   - párrafos de respuesta (data-respuesta) de 40–60 palabras; obligatorios en home, nosotros,
 *     cada sede (es, en y pt) y cada ficha indexable
 *   - cada ficha indexable: 3 o más enlaces a /es/cursos/… y un enlace a su categoría
 *   - el teléfono de la casa matriz (+56 55 292 6431) en /es, /es/contacto y /es/sedes/calama
 * Redirecciones (dist/redirects.map, Fase 2):
 *   - cada línea es `"origen" "destino";` (exacta) o `"~^…" "destino";` (regex)
 *   - sin cadenas: ningún destino es a su vez un origen
 *   - todo destino lleva prefijo de idioma y, si no depende de una captura, existe en dist/ (200)
 *   - ningún <a href> interno del dist apunta a un origen de redirección, a una ruta sin prefijo
 *     de idioma o con barra final (todas serían 301), ni a una página que no está en el build
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { inlineScripts, scriptHash } from './csp.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ONLY_REDIRECTS = process.argv.includes('--no-redirect-chains');
const MIN_WORDS_HOME_ES = 800;
const HTML_LANG = { es: 'es-CL', en: 'en', pt: 'pt' };
// Mismos valores que src/lib/seo-text.ts y SITE_URL de src/lib/locale-routing.ts.
const SITE_URL = 'https://insecap.cl';
const TITLE_MAX = 60;
const DESCRIPTION_MIN = 140;
const DESCRIPTION_MAX = 155;
const DEFAULT_OG_IMAGE = { url: `${SITE_URL}/og/insecap-default-1200x630.png`, width: '1200', height: '630', type: 'image/png' };

const failures = [];
const fail = (file, message) => failures.push(`${file}: ${message}`);

const count = (html, regex) => (html.match(regex) || []).length;

const visibleWords = (html) => {
  const body = html.slice(html.search(/<body[\s>]/i));
  return body
    .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
};

const decodeEntities = (text) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

/** Atributos de una etiqueta (`<link rel="…" hrefLang="…">`), con nombres en minúscula. */
const tagAttributes = (tag) =>
  Object.fromEntries([...tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)].map(([, name, value]) => [name.toLowerCase(), decodeEntities(value)]));

const findTags = (html, regex) => [...html.matchAll(regex)].map(([tag]) => tagAttributes(tag));

/** Texto visible de un fragmento HTML: sin etiquetas ni entidades, con espacios normalizados. */
const plainText = (fragment) => decodeEntities(fragment.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
/** Textos de enlace que no dicen adónde llevan (Fase 3). */
const GENERIC_LINK_TEXT = /^(ver más|ver mas|leer más|leer mas|más|mas|aquí|aqui|click aquí|click aqui|clic aquí|haz click aquí|see more|read more|more|here|click here|ver mais|leia mais|aqui|clique aqui)$/i;
/** Rutas que deben mostrar breadcrumb visible (Fase 3). */
const BREADCRUMB_PATH = /^\/(es|en|pt)\/(cursos|sedes|noticias)(\/|$)/;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name === 'index.html' ? [full] : [];
  });

// El shell no trae HTML que pintar: carga el bundle directo, sin esperar el primer paint (Fase 6).
if (!ONLY_REDIRECTS && fs.existsSync(path.join(DIST, '_shell.html'))
  && !/<script type="module" crossorigin src="\/assets\/index-[\w-]+\.js"><\/script>/.test(fs.readFileSync(path.join(DIST, '_shell.html'), 'utf8'))) {
  fail('_shell.html', 'sin <script type="module"> directo (el shell se renderiza en el cliente)');
}

const checkNoindex = (relative) => {
  const file = path.join(DIST, relative);
  if (!fs.existsSync(file)) {
    fail(relative, 'no existe');
    return null;
  }
  const html = fs.readFileSync(file, 'utf8');
  if (!/<meta[^>]+name="robots"[^>]+content="noindex/i.test(html)) fail(relative, 'falta robots noindex');
  return html;
};

// ---------- JSON-LD (Fase 4) ----------

const ORG_ID = `${SITE_URL}/#org`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LD_JSON = /<script\b[^>]*\btype="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
const ISO_DURATION = /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/;
const DATE_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)$/;
const COURSE_MODES = new Set(['onsite', 'online', 'blended']);

const typesOf = (node) => [].concat(node['@type'] ?? []);
const isRef = (value) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 1 && typeof value['@id'] === 'string';

/** Recorre un valor JSON-LD: `visit(objeto)` para cada objeto anidado. */
const walkJson = (value, visit) => {
  if (Array.isArray(value)) value.forEach((item) => walkJson(item, visit));
  else if (value && typeof value === 'object') {
    visit(value);
    Object.values(value).forEach((item) => walkJson(item, visit));
  }
};

/** @id definidos (objetos con más propiedades que @id) y referencias ({"@id"} solo). */
const collectIds = (graph) => {
  const defined = new Set();
  const refs = new Set();
  walkJson(graph, (node) => {
    if (typeof node['@id'] !== 'string') return;
    if (isRef(node)) refs.add(node['@id']);
    else defined.add(node['@id']);
  });
  return { defined, refs };
};

/** Grafo global: el de /es (debe traer #org y #website). Se llena al revisar las páginas. */
let globalIds = null;
const readGraph = (html) => {
  const blocks = [...html.matchAll(LD_JSON)].map(([, json]) => json);
  if (blocks.length !== 1) return { error: `${blocks.length} <script type="application/ld+json"> (se espera 1 con @graph)` };
  try {
    const data = JSON.parse(blocks[0]);
    if (data['@context'] !== 'https://schema.org' || !Array.isArray(data['@graph'])) return { error: 'JSON-LD sin @context schema.org o sin @graph' };
    return { raw: blocks[0], graph: data['@graph'] };
  } catch (error) {
    return { error: `JSON-LD que no parsea: ${error.message}` };
  }
};

const requireProps = (relative, node, props) => {
  for (const prop of props) {
    const value = node[prop];
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      fail(relative, `JSON-LD ${typesOf(node).join('/')} ${node['@id'] ?? ''} sin ${prop}`);
    }
  }
};

/** Estructura mínima por tipo (schema.org y lo que piden los rich results de Google). */
const checkNodeStructure = (relative, node) => {
  const types = typesOf(node);
  if (types.includes('Course')) {
    requireProps(relative, node, ['name', 'description', 'provider', 'hasCourseInstance']);
    for (const instance of [].concat(node.hasCourseInstance ?? [])) {
      if (!COURSE_MODES.has(instance.courseMode)) fail(relative, `CourseInstance con courseMode "${instance.courseMode}"`);
      if (instance.courseWorkload !== undefined && !ISO_DURATION.test(instance.courseWorkload)) {
        fail(relative, `CourseInstance con courseWorkload "${instance.courseWorkload}" (no es ISO 8601)`);
      }
    }
  }
  if (types.includes('BreadcrumbList')) {
    const items = node.itemListElement ?? [];
    if (items.length < 2) fail(relative, `BreadcrumbList con ${items.length} elementos`);
    items.forEach((item, index) => {
      if (item.position !== index + 1 || !item.name || !/^https:\/\/insecap\.cl\//.test(item.item ?? '')) {
        fail(relative, `BreadcrumbList: elemento ${index + 1} inválido (${JSON.stringify(item)})`);
      }
    });
  }
  if (types.includes('FAQPage')) {
    const questions = node.mainEntity ?? [];
    if (questions.length === 0) fail(relative, 'FAQPage sin preguntas');
    for (const question of questions) {
      if (!typesOf(question).includes('Question') || !question.name || !question.acceptedAnswer?.text) {
        fail(relative, `FAQPage: pregunta sin name o sin acceptedAnswer.text (${question.name ?? '?'})`);
      }
    }
  }
  if (types.includes('NewsArticle')) {
    requireProps(relative, node, ['headline', 'datePublished', 'dateModified', 'author', 'publisher']);
    for (const field of ['datePublished', 'dateModified']) {
      if (node[field] && !DATE_WITH_OFFSET.test(node[field])) fail(relative, `NewsArticle ${field} "${node[field]}" sin desfase horario`);
    }
  }
  if (types.includes('LocalBusiness')) {
    requireProps(relative, node, ['name', 'address', 'telephone', 'parentOrganization']);
    requireProps(relative, node.address ?? {}, ['streetAddress', 'addressLocality', 'addressCountry']);
  }
};

const checkJsonLd = (relative, html) => {
  const { error, raw, graph } = readGraph(html);
  if (error) {
    fail(relative, error);
    return;
  }
  // "TODO" en mayúsculas (el español usa "todo", p. ej. "sobre todo"); "por confirmar" en cualquier forma.
  if (/TODO/.test(raw) || /por confirmar/i.test(raw)) fail(relative, 'JSON-LD con "TODO" o "Por confirmar"');

  const { defined, refs } = collectIds(graph);
  for (const id of [ORG_ID, WEBSITE_ID]) if (!defined.has(id)) fail(relative, `JSON-LD sin ${id}`);
  for (const id of refs) {
    if (!defined.has(id) && !globalIds?.has(id)) fail(relative, `JSON-LD referencia ${id}, que no está en el grafo`);
  }
  graph.forEach((node) => walkJson(node, (child) => checkNodeStructure(relative, child)));

  const urlPath = `/${path.dirname(relative).split(path.sep).join('/')}`;
  const has = (predicate) => graph.some(predicate);
  const hasType = (type) => has((node) => typesOf(node).includes(type));
  const ficha = urlPath.match(/^\/(es|en|pt)\/cursos\/(?!categoria\/)([^/]+)$/);
  if (ficha && !hasType('Course')) fail(relative, 'ficha sin Course en el JSON-LD');
  const sede = urlPath.match(/^\/(es|en|pt)\/sedes\/([^/]+)$/);
  if (sede && !defined.has(`${SITE_URL}/es/sedes/${sede[2]}#place`)) fail(relative, `sede sin ${SITE_URL}/es/sedes/${sede[2]}#place`);
  if (/^\/(es|en|pt)\/preguntas-frecuentes$/.test(urlPath) && !hasType('FAQPage')) fail(relative, 'sin FAQPage');
  if (/^\/(es|en|pt)\/noticias\/[^/]+$/.test(urlPath) && !hasType('NewsArticle')) fail(relative, 'noticia sin NewsArticle');
  if (/<nav\b[^>]*\saria-label="[^"]+"[^>]*>\s*<ol[\s>]/i.test(html) && !hasType('BreadcrumbList')) {
    fail(relative, 'breadcrumb visible sin BreadcrumbList en el JSON-LD');
  }
};

// ---------- Contenido citable (Fase 8) ----------

const RESPUESTA_MIN = 40;
const RESPUESTA_MAX = 60;
/** Páginas que abren con un párrafo de respuesta (data-respuesta): home, nosotros y sedes en los tres idiomas. */
const RESPUESTA_PATH = /^\/(es|en|pt)(\/nosotros|\/sedes\/[^/]+)?$/;
// NAP único: mismo valor que la casa matriz de src/data/sedes.ts.
const CASA_MATRIZ_TEL = '+56 55 292 6431';
const NAP_PAGES = ['/es', '/es/contacto', '/es/sedes/calama'];
const napSeen = new Set();
const MIN_LINKS_FICHA = 3;

/**
 * - todo párrafo data-respuesta tiene 40–60 palabras, y home, nosotros, cada sede y cada ficha
 *   indexable tienen uno
 * - cada ficha indexable enlaza al menos 3 veces a /es/cursos/… y a su categoría (la del BreadcrumbList)
 * - el teléfono de la casa matriz aparece en /es, /es/contacto y /es/sedes/calama
 */
const checkContenidoCitable = (relative, urlPath, html, indexable) => {
  const respuestas = [...html.matchAll(/<p\b[^>]*\sdata-respuesta="[^"]*"[^>]*>([\s\S]*?)<\/p>/gi)].map(([, inner]) => plainText(inner));
  for (const respuesta of respuestas) {
    const words = respuesta.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
    if (words < RESPUESTA_MIN || words > RESPUESTA_MAX) fail(relative, `párrafo de respuesta de ${words} palabras (se esperan ${RESPUESTA_MIN}–${RESPUESTA_MAX})`);
  }
  const ficha = /^\/es\/cursos\/(?!categoria\/)[^/]+$/.test(urlPath) && indexable;
  if ((RESPUESTA_PATH.test(urlPath) || ficha) && respuestas.length === 0) fail(relative, 'sin párrafo de respuesta (data-respuesta)');

  if (ficha) {
    const links = count(html, /<a\s[^>]*href="\/es\/cursos\/[^"]+"/gi);
    if (links < MIN_LINKS_FICHA) fail(relative, `${links} enlaces a /es/cursos/… (se esperan ${MIN_LINKS_FICHA} o más)`);
    const { graph = [] } = readGraph(html);
    let categoria = null;
    graph.forEach((node) => walkJson(node, (child) => {
      if (typeof child.item === 'string' && child.item.startsWith(`${SITE_URL}/es/cursos/categoria/`)) categoria = child.item.slice(SITE_URL.length);
    }));
    if (!categoria) fail(relative, 'ficha sin categoría en el BreadcrumbList');
    else if (!html.includes(`href="${categoria}"`)) fail(relative, `ficha sin enlace a su categoría ${categoria}`);
  }

  if (NAP_PAGES.includes(urlPath) && html.includes(CASA_MATRIZ_TEL)) napSeen.add(urlPath);
};

if (!fs.existsSync(DIST)) {
  console.error('[check-dist] No existe dist/. Corre `npm run build`.');
  process.exit(1);
}

const pages = Object.keys(HTML_LANG)
  .filter((locale) => fs.existsSync(path.join(DIST, locale)))
  .flatMap((locale) => walk(path.join(DIST, locale)).map((file) => ({ file, locale })));

if (pages.length === 0) fail('dist', 'no hay páginas prerenderizadas en dist/{es,en,pt}');

const homeEs = path.join(DIST, 'es', 'index.html');
if (fs.existsSync(homeEs)) {
  const { graph } = readGraph(fs.readFileSync(homeEs, 'utf8'));
  if (graph) globalIds = collectIds(graph).defined;
}

/** Páginas indexables por URL absoluta: para duplicados y reciprocidad del hreflang. */
const indexablePages = new Map();

for (const { file, locale } of ONLY_REDIRECTS ? [] : pages) {
  const relative = path.relative(DIST, file);
  const html = fs.readFileSync(file, 'utf8');

  if (/<!--(app-head|app-html|splash-tagline)-->/.test(html)) fail(relative, 'quedan marcadores de plantilla');

  const lang = (html.match(/<html[^>]*\slang="([^"]*)"/i) || [])[1];
  if (lang !== HTML_LANG[locale]) fail(relative, `<html lang="${lang ?? ''}">, se esperaba "${HTML_LANG[locale]}"`);

  const titles = count(html, /<title[\s>]/gi);
  if (titles !== 1) fail(relative, `${titles} <title>`);

  const robots = count(html, /<meta[^>]+name="robots"/gi);
  if (robots !== 1) fail(relative, `${robots} <meta name="robots">`);

  const h1 = count(html, /<h1[\s>]/gi);
  if (h1 !== 1) fail(relative, `${h1} <h1> (se espera 1)`);

  const links = count(html, /<a\s[^>]*href="\/[^/"]/gi);
  if (links === 0) fail(relative, 'sin enlaces internos <a href="/…">');

  checkJsonLd(relative, html);

  if (html.includes('<!--$!-->')) fail(relative, 'contiene un fallback de render en cliente (<!--$!-->): error de SSR');

  // ---------- HTML semántico (Fase 3) ----------
  const mains = count(html, /<main[\s>]/gi);
  if (mains !== 1) fail(relative, `${mains} <main> (se espera 1)`);
  if (count(html, /<header[\s>]/gi) === 0) fail(relative, 'sin <header>');
  if (count(html, /<footer[\s>]/gi) === 0) fail(relative, 'sin <footer>');

  const addresses = [...html.matchAll(/<address[\s>][\s\S]*?<\/address>/gi)].map(([block]) => block);
  if (!addresses.some((block) => /href="tel:\+56\d{8,9}"/.test(block))) fail(relative, 'sin <address> con enlace tel:+56…');
  if (!addresses.some((block) => /href="mailto:[^"@]+@insecap\.cl"/.test(block))) fail(relative, 'sin <address> con enlace mailto:');

  const imgsWithoutAlt = findTags(html, /<img\b[^>]*>/gi).filter((img) => img.alt === undefined).length;
  if (imgsWithoutAlt > 0) fail(relative, `${imgsWithoutAlt} <img> sin atributo alt`);

  for (const [, attrs, inner] of html.matchAll(/<a\b([^>]*\shref="[^"]*"[^>]*)>([\s\S]*?)<\/a>/gi)) {
    const ariaLabel = tagAttributes(`<a ${attrs}>`)['aria-label'];
    const imgAlts = findTags(inner, /<img\b[^>]*>/gi).map((img) => img.alt ?? '').join(' ').trim();
    const text = plainText(inner);
    const name = (ariaLabel ?? '').trim() || text || imgAlts;
    const href = tagAttributes(`<a ${attrs}>`).href;
    if (!name) fail(relative, `enlace sin texto ni aria-label: ${href}`);
    else if (!ariaLabel && GENERIC_LINK_TEXT.test(text)) fail(relative, `enlace con texto genérico "${text}": ${href}`);
  }

  const rq = html.match(/<script type="application\/json" id="__RQ__">([\s\S]*?)<\/script>/);
  if (rq && rq[1].includes('<')) fail(relative, '#__RQ__ con "<" sin escapar');

  if (relative === path.join('es', 'index.html')) {
    const words = visibleWords(html);
    if (words <= MIN_WORDS_HOME_ES) fail(relative, `${words} palabras visibles (se esperan más de ${MIN_WORDS_HOME_ES})`);
  }

  // ---------- Metadatos (Fase 3) ----------
  const urlPath = `/${path.dirname(relative).split(path.sep).join('/')}`;
  const selfUrl = `${SITE_URL}${urlPath}`;

  if (BREADCRUMB_PATH.test(urlPath)) {
    const breadcrumb = html.match(/<nav\b[^>]*\saria-label="[^"]+"[^>]*>\s*<ol[\s>][\s\S]*?<\/nav>/i);
    if (!breadcrumb) fail(relative, 'sin breadcrumb visible (<nav aria-label><ol>)');
    else if (!breadcrumb[0].includes('aria-current="page"')) fail(relative, 'breadcrumb sin aria-current="page"');
  }

  const title = decodeEntities((html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] ?? '').trim();
  if (title.length > TITLE_MAX) fail(relative, `title de ${title.length} caracteres (máximo ${TITLE_MAX}): "${title}"`);

  const description = findTags(html, /<meta[^>]+name="description"[^>]*>/gi)[0]?.content ?? '';
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    fail(relative, `description de ${description.length} caracteres (se esperan ${DESCRIPTION_MIN}–${DESCRIPTION_MAX})`);
  }

  if (/<meta[^>]+name="keywords"/i.test(html)) fail(relative, 'tiene <meta name="keywords">');

  const ogImage = (property) => findTags(html, new RegExp(`<meta[^>]+property="${property}"[^>]*>`, 'gi')).map((tag) => tag.content);
  const [ogImages, ogWidth, ogHeight, ogType] = ['og:image', 'og:image:width', 'og:image:height', 'og:image:type'].map(ogImage);
  if (ogImages.length !== 1 || !/^https:\/\//.test(ogImages[0])) fail(relative, `${ogImages.length} og:image (se espera 1 absoluta)`);
  else if (ogImages[0] === DEFAULT_OG_IMAGE.url) {
    const size = `${ogWidth.join(',')}×${ogHeight.join(',')} ${ogType.join(',')}`;
    if (size !== `${DEFAULT_OG_IMAGE.width}×${DEFAULT_OG_IMAGE.height} ${DEFAULT_OG_IMAGE.type}`) fail(relative, `og:image por defecto con tamaño/tipo "${size}"`);
  } else if (ogWidth.length + ogHeight.length + ogType.length > 0) {
    fail(relative, `og:image propia (${ogImages[0]}) con og:image:width/height/type de otra imagen`);
  }

  const canonicals = findTags(html, /<link[^>]+rel="canonical"[^>]*>/gi);
  if (canonicals.length !== 1) fail(relative, `${canonicals.length} <link rel="canonical"> (se espera 1)`);
  else if (canonicals[0].href !== selfUrl) fail(relative, `canonical ${canonicals[0].href}, se esperaba ${selfUrl}`);

  const alternates = findTags(html, /<link[^>]+rel="alternate"[^>]*hreflang="[^"]*"[^>]*>/gi)
    .map((link) => ({ hreflang: link.hreflang, href: link.href }));
  const indexable = /^index/i.test(findTags(html, /<meta[^>]+name="robots"[^>]*>/gi)[0]?.content ?? '');
  if (!indexable && alternates.length > 0) fail(relative, 'página noindex con hreflang');
  if (indexable) indexablePages.set(selfUrl, { relative, locale, title, description, alternates });

  checkContenidoCitable(relative, urlPath, html, indexable);
}

for (const urlPath of NAP_PAGES) {
  if (!ONLY_REDIRECTS && !napSeen.has(urlPath)) fail(urlPath, `sin el teléfono de la casa matriz ${CASA_MATRIZ_TEL} (o la página no existe)`);
}

// Duplicados y hreflang recíproco entre páginas indexables.
const findDuplicates = (field) => {
  const seen = new Map();
  for (const page of indexablePages.values()) {
    const key = page[field].toLowerCase();
    if (seen.has(key)) fail(page.relative, `${field} duplicado con ${seen.get(key)}: "${page[field]}"`);
    else seen.set(key, page.relative);
  }
};
findDuplicates('title');
findDuplicates('description');

for (const [selfUrl, page] of indexablePages) {
  const { relative, locale, alternates } = page;
  if (alternates.length === 0) continue;

  const own = alternates.find((alternate) => alternate.href === selfUrl && alternate.hreflang !== 'x-default');
  if (!own || own.hreflang.toLowerCase() !== HTML_LANG[locale].toLowerCase()) {
    fail(relative, `el hreflang no incluye la propia página como ${HTML_LANG[locale]}`);
  }

  for (const { hreflang, href } of alternates) {
    if (hreflang === 'x-default') {
      if (!/^https:\/\/insecap\.cl\/es(\/|$)/.test(href)) fail(relative, `x-default ${href} no apunta a /es`);
      if (!alternates.some((alternate) => alternate.href === href && alternate.hreflang === HTML_LANG.es)) {
        fail(relative, `x-default ${href} no coincide con la alternativa ${HTML_LANG.es}`);
      }
      continue;
    }
    const target = indexablePages.get(href);
    if (!target) {
      fail(relative, `hreflang ${hreflang} → ${href}, que no existe o no se indexa`);
    } else if (!target.alternates.some((alternate) => alternate.href === selfUrl && alternate.hreflang !== 'x-default')) {
      fail(relative, `hreflang no recíproco: ${href} no enlaza de vuelta a ${selfUrl}`);
    }
  }
}

if (!ONLY_REDIRECTS) {
  checkNoindex('404.html');
  checkNoindex('404-en.html');
  checkNoindex('404-pt.html');
  const shell = checkNoindex('_shell.html');
  if (shell && !shell.includes('<div id="root"></div>')) fail('_shell.html', '#root no está vacío');
}

// ---------- Redirecciones (dist/redirects.map) y enlaces internos ----------

const LOCALE_PATH = /^\/(es|en|pt)(\/|$)/;
const pageExists = (urlPath) => fs.existsSync(path.join(DIST, urlPath.slice(1), 'index.html'));

const parseRedirects = (text) =>
  text.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#')).flatMap((line) => {
    const match = line.match(/^"([^"]+)"\s+"([^"]+)";$/);
    if (!match) {
      fail('redirects.map', `línea inválida: ${line}`);
      return [];
    }
    const [, from, to] = match;
    if (!from.startsWith('~')) return [{ from, to }];
    const caseInsensitive = from.startsWith('~*');
    const source = from.slice(caseInsensitive ? 2 : 1);
    return [{ from, to, source, regex: new RegExp(source, caseInsensitive ? 'i' : '') }];
  });

const mapFile = path.join(DIST, 'redirects.map');
const redirects = fs.existsSync(mapFile) ? parseRedirects(fs.readFileSync(mapFile, 'utf8')) : [];
if (!fs.existsSync(mapFile)) fail('redirects.map', 'no existe (lo genera scripts/prerender.mjs)');

const exactOrigins = new Set(redirects.filter((rule) => !rule.regex).map((rule) => rule.from));
const regexOrigins = redirects.filter((rule) => rule.regex);
const isRedirectOrigin = (urlPath) =>
  exactOrigins.has(urlPath) || regexOrigins.some((rule) => rule.regex.test(urlPath));

/** Destino de ejemplo: la captura del idioma pasa a `es`; las demás, a un valor ficticio. */
const DUMMY = 'ejemplo-de-captura';
const sampleDestination = (rule) => {
  if (!rule.regex) return rule.to;
  const groups = [...rule.source.matchAll(/\(([^)]*)\)/g)].map((group) => group[1]);
  return rule.to.replace(/\$(\d)/g, (_, n) => (groups[Number(n) - 1] === 'es|en|pt' ? 'es' : DUMMY));
};

let chains = 0;
for (const rule of redirects) {
  const destination = sampleDestination(rule);
  if (isRedirectOrigin(destination)) {
    chains += 1;
    fail('redirects.map', `cadena: ${rule.from} → ${destination}, que también redirige`);
  }
  if (!LOCALE_PATH.test(destination) || destination.endsWith('/')) {
    fail('redirects.map', `destino sin prefijo de idioma o con barra final: ${rule.from} → ${destination}`);
  }
  if (!destination.includes(DUMMY) && !pageExists(destination)) {
    fail('redirects.map', `destino que no está en el build: ${rule.from} → ${destination}`);
  }
}

// Enlaces internos: deben ir directo a una página del build (sin pasar por un 301).
const htmlFiles = [...pages.map(({ file }) => file), path.join(DIST, '404.html'), path.join(DIST, '404-en.html'), path.join(DIST, '404-pt.html')].filter((file) => fs.existsSync(file));
const badLinks = new Map();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [, href] of html.matchAll(/<a\s[^>]*?href="(\/[^"]*)"/gi)) {
    if (href.startsWith('//')) continue;
    const urlPath = href.replace(/[?#].*$/, '') || '/';
    if (/\.[a-z0-9]+$/i.test(urlPath) || badLinks.has(urlPath)) continue;

    let problem = null;
    if (isRedirectOrigin(urlPath)) problem = `origen de redirección (301 a ${redirects.find((rule) => rule.from === urlPath || rule.regex?.test(urlPath)).to})`;
    else if (!LOCALE_PATH.test(urlPath)) problem = 'sin prefijo de idioma (301 a /es)';
    else if (urlPath.endsWith('/')) problem = 'con barra final (301)';
    else if (!pageExists(urlPath)) problem = 'no está en el build';
    if (problem) badLinks.set(urlPath, `${problem}; p. ej. en ${path.relative(DIST, file)}`);
  }
}
for (const [urlPath, message] of badLinks) fail('enlace interno', `${urlPath}: ${message}`);

// ---------- Archivos para crawlers y agentes (Fase 5) ----------

/** Mismos bots que AI_BOTS de src/lib/crawler-files.ts. */
const AI_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot'];
const SITEMAP_INDEX = 'sitemap-index.xml';
/** Sitemap → idiomas que puede contener. */
const SITEMAPS = { 'sitemap-es.xml': /^\/es(\/|$)/, 'sitemap-intl.xml': /^\/(en|pt)(\/|$)/ };
const W3C_DATETIME = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?([+-]\d{2}:\d{2}|Z))?$/;
const LLMS_SECTIONS = ['Cursos', 'Sedes', 'Información', 'Optional'];
/** Páginas que llms-full.txt debe traer (las fichas indexables se revisan aparte). */
const LLMS_FULL_REQUIRED = ['/es', '/es/nosotros', '/es/acreditaciones', '/es/preguntas-frecuentes', '/es/sedes/calama'];

const readDist = (name) => {
  const file = path.join(DIST, name);
  if (!fs.existsSync(file)) {
    fail(name, 'no existe (lo genera scripts/prerender.mjs)');
    return null;
  }
  return fs.readFileSync(file, 'utf8');
};

if (!ONLY_REDIRECTS) {
  const robotsTxt = readDist('robots.txt');
  if (robotsTxt) {
    const lines = robotsTxt.split('\n').map((line) => line.trim());
    for (const required of ['User-agent: *', 'Allow: /', 'Disallow: /api/', `Sitemap: ${SITE_URL}/${SITEMAP_INDEX}`]) {
      if (!lines.includes(required)) fail('robots.txt', `falta "${required}"`);
    }
    for (const bot of AI_BOTS) if (!lines.includes(`User-agent: ${bot}`)) fail('robots.txt', `falta el bloque de ${bot}`);
    if (lines.some((line) => /^Disallow:\s*\/\s*$/i.test(line))) fail('robots.txt', 'tiene "Disallow: /"');
  }

  const sitemapIndex = readDist(SITEMAP_INDEX);
  if (sitemapIndex) {
    const listed = [...sitemapIndex.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, loc]) => loc);
    for (const name of Object.keys(SITEMAPS)) {
      if (!listed.includes(`${SITE_URL}/${name}`)) fail(SITEMAP_INDEX, `no lista ${SITE_URL}/${name}`);
    }
  }

  const inSitemap = new Set();
  const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
  for (const [name, localePattern] of Object.entries(SITEMAPS)) {
    const xml = readDist(name);
    if (!xml) continue;
    for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = (block.match(/<loc>([^<]*)<\/loc>/) || [])[1] ?? '';
      const urlPath = loc.startsWith(`${SITE_URL}/`) ? loc.slice(SITE_URL.length) : '';
      if (!localePattern.test(urlPath)) {
        fail(name, `<loc> que no corresponde a este sitemap: ${loc}`);
        continue;
      }
      if (inSitemap.has(loc)) fail(name, `<loc> duplicada: ${loc}`);
      inSitemap.add(loc);
      if (!pageExists(urlPath)) {
        fail(name, `${loc} no está en dist/ (no respondería 200)`);
        continue;
      }
      const page = indexablePages.get(loc);
      if (!page) {
        fail(name, `${loc} no es indexable (noindex o canonical a otra URL)`);
        continue;
      }
      const lastmod = (block.match(/<lastmod>([^<]*)<\/lastmod>/) || [])[1];
      if (lastmod !== undefined && (!W3C_DATETIME.test(lastmod) || Date.parse(lastmod) > tomorrow)) {
        fail(name, `${loc} con <lastmod> inválido o en el futuro: ${lastmod}`);
      }
      const key = (alternates) => alternates.map(({ hreflang, href }) => `${hreflang} ${href}`).sort().join(' | ');
      const sitemapAlternates = findTags(block, /<xhtml:link\b[^>]*>/gi).map((link) => ({ hreflang: link.hreflang, href: link.href }));
      if (key(sitemapAlternates) !== key(page.alternates)) {
        fail(name, `${loc}: hreflang del sitemap (${key(sitemapAlternates)}) distinto al de la página (${key(page.alternates)})`);
      }
    }
  }
  for (const [selfUrl, page] of indexablePages) {
    if (!inSitemap.has(selfUrl)) fail(page.relative, `indexable y fuera de los sitemaps (${selfUrl})`);
  }

  const llms = readDist('llms.txt');
  if (llms) {
    if (!/^# \S/.test(llms)) fail('llms.txt', 'no empieza con un H1 ("# …")');
    if (!/^> \S/m.test(llms)) fail('llms.txt', 'sin blockquote de resumen ("> …")');
    for (const section of LLMS_SECTIONS) if (!llms.includes(`\n## ${section}\n`)) fail('llms.txt', `sin la sección "## ${section}"`);
    const links = [...llms.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map(([, href]) => href);
    if (links.length === 0) fail('llms.txt', 'sin enlaces Markdown');
    for (const href of links) {
      if (!indexablePages.has(href)) fail('llms.txt', `${href} no es una página indexable del build`);
    }
    for (const line of llms.split('\n').filter((item) => item.startsWith('- ['))) {
      if (!/^- \[[^\]]+\]\(https:\/\/insecap\.cl\/[^)]*\): \S/.test(line)) fail('llms.txt', `enlace sin descripción: ${line}`);
    }
  }

  const llmsFull = readDist('llms-full.txt');
  if (llmsFull) {
    if (!/^# \S/.test(llmsFull)) fail('llms-full.txt', 'no empieza con un H1 ("# …")');
    const urls = [...llmsFull.matchAll(/^URL: (\S+)$/gm)].map(([, url]) => url);
    for (const url of urls) if (!indexablePages.has(url)) fail('llms-full.txt', `${url} no es una página indexable del build`);
    for (const urlPath of LLMS_FULL_REQUIRED) {
      if (!urls.includes(`${SITE_URL}${urlPath}`)) fail('llms-full.txt', `no trae ${urlPath}`);
    }
    const fichas = [...indexablePages.keys()].filter((url) => /^https:\/\/insecap\.cl\/es\/cursos\/(?!categoria\/)[^/]+$/.test(url));
    for (const ficha of fichas) if (!urls.includes(ficha)) fail('llms-full.txt', `no trae la ficha indexable ${ficha}`);
  }

  if (fs.existsSync(path.join(DIST, '.well-known', 'ai-catalog.json'))) {
    fail('.well-known/ai-catalog.json', 'no debe existir: sin recursos ARD reales, debe responder 404 (Fase 5)');
  }

  // Fase 6: peso de imágenes y fuentes.
  const MAX_MEDIA_KB = 200;
  const allFiles = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory() ? allFiles(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
  for (const file of allFiles(DIST)) {
    if (!/\.(jpe?g|png|webp|avif|gif|svg|mp4|webm)$/i.test(file)) continue;
    const kb = Math.round(fs.statSync(file).size / 1024);
    if (kb > MAX_MEDIA_KB) {
      fail(path.relative(DIST, file), `pesa ${kb} KB (máximo ${MAX_MEDIA_KB}): recomprimir a WebP/AVIF al tamaño de render`);
    }
  }
  const fontFiles = fs.readdirSync(path.join(DIST, 'assets')).filter((name) => /\.(woff2?|ttf|otf|eot)$/i.test(name));
  const woff2 = fontFiles.filter((name) => name.endsWith('.woff2'));
  if (woff2.length > 8) fail('assets', `${woff2.length} woff2 (máximo 8: Montserrat latin + latin-ext, 400–700)`);
  for (const name of fontFiles.filter((item) => !item.endsWith('.woff2'))) fail(`assets/${name}`, 'fuente que no es woff2');
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const relative = path.relative(DIST, file);
    if (/fonts\.(googleapis|gstatic)\.com/.test(html)) fail(relative, 'carga Google Fonts (Montserrat va autoalojada)');
    if (!/<link rel="preload" href="\/assets\/montserrat-latin-700-normal-[^"]+\.woff2" as="font"/.test(html)) {
      fail(relative, 'sin preload de Montserrat 700');
    }
    if (/<!--\$[?!]-->|<template id="B:/.test(html)) fail(relative, 'fallback de Suspense en el HTML (React.lazy sin resolver en el prerender)');
    if (/<script[^>]*type="module"[^>]*\ssrc=/.test(html)) fail(relative, '<script type="module" src> en el HTML (el bundle va con el loader diferido de prerender.mjs)');
    if (!/s\.src='\/assets\/index-[\w-]+\.js'/.test(html)) fail(relative, 'sin el loader diferido del bundle de la app');
    if (/<script[^>]*\ssrc="https:\/\/(www\.googletagmanager\.com|connect\.facebook\.net|www\.clarity\.ms)/.test(html)) {
      fail(relative, 'tercero como <script src> en el HTML (va diferido, index.html)');
    }
  }

  // Fase 7: cada script inline tiene su hash en el CSP; sin handlers en atributos ni javascript:.
  const cspFile = path.join(DIST, 'csp.conf');
  const csp = fs.existsSync(cspFile) ? fs.readFileSync(cspFile, 'utf8') : '';
  if (!csp) fail('csp.conf', 'no existe (lo genera scripts/prerender.mjs)');
  else if (!/^add_header Content-Security-Policy-Report-Only "[^"]+" always;$/m.test(csp)) fail('csp.conf', 'sin add_header Content-Security-Policy-Report-Only');
  for (const file of [...htmlFiles, path.join(DIST, '_shell.html')].filter((item) => fs.existsSync(item))) {
    const html = fs.readFileSync(file, 'utf8');
    const relative = path.relative(DIST, file);
    for (const body of inlineScripts(html)) {
      const hash = scriptHash(body);
      if (csp && !csp.includes(hash)) fail(relative, `script inline sin su hash en csp.conf (${hash}): ${body.trim().slice(0, 60)}…`);
    }
    const handler = html.match(/<[a-z][^>]*\son[a-z]+="[^"]*"/i);
    if (handler) fail(relative, `manejador de eventos en un atributo (CSP): ${handler[0].slice(0, 80)}`);
    if (/href="javascript:/i.test(html)) fail(relative, 'enlace javascript: (CSP)');
  }
}

if (failures.length > 0) {
  console.error(`[check-dist] ${failures.length} falla(s) en ${pages.length} páginas:`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}

const redirectsSummary = `redirects.map: ${redirects.length} entradas, ${chains} cadenas; enlaces internos sin 301`;
console.log(ONLY_REDIRECTS
  ? `[check-dist] OK: ${redirectsSummary} (${htmlFiles.length} páginas)`
  : `[check-dist] OK: ${pages.length} páginas, 404.html y _shell.html; ${redirectsSummary}; robots.txt, sitemaps y llms.txt; imágenes ≤200 KB, Montserrat woff2 con preload, sin fallbacks de Suspense y JS/terceros diferidos; scripts inline con hash en csp.conf`);
