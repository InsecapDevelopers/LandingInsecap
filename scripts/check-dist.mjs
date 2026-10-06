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
 *   - window.__RQ__ sin `<` crudo
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

  const rq = html.match(/<script>window\.__RQ__=([\s\S]*?)<\/script>/);
  if (rq && rq[1].includes('<')) fail(relative, 'window.__RQ__ con "<" sin escapar');

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
const htmlFiles = [...pages.map(({ file }) => file), path.join(DIST, '404.html')].filter((file) => fs.existsSync(file));
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

if (failures.length > 0) {
  console.error(`[check-dist] ${failures.length} falla(s) en ${pages.length} páginas:`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}

const redirectsSummary = `redirects.map: ${redirects.length} entradas, ${chains} cadenas; enlaces internos sin 301`;
console.log(ONLY_REDIRECTS
  ? `[check-dist] OK: ${redirectsSummary} (${htmlFiles.length} páginas)`
  : `[check-dist] OK: ${pages.length} páginas, 404.html y _shell.html; ${redirectsSummary}`);
