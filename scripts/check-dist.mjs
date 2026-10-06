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
 *   - al menos un <script type="application/ld+json">
 *   - sin fallbacks de render en cliente (<!--$!-->) que dejaría un error de SSR
 *   - window.__RQ__ sin `<` crudo
 * Además: más de 800 palabras visibles en /es, y 404.html y _shell.html con noindex.
 *
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

if (!fs.existsSync(DIST)) {
  console.error('[check-dist] No existe dist/. Corre `npm run build`.');
  process.exit(1);
}

const pages = Object.keys(HTML_LANG)
  .filter((locale) => fs.existsSync(path.join(DIST, locale)))
  .flatMap((locale) => walk(path.join(DIST, locale)).map((file) => ({ file, locale })));

if (pages.length === 0) fail('dist', 'no hay páginas prerenderizadas en dist/{es,en,pt}');

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

  const ldJson = count(html, /<script[^>]+type="application\/ld\+json"/gi);
  if (ldJson === 0) fail(relative, 'sin JSON-LD');

  if (html.includes('<!--$!-->')) fail(relative, 'contiene un fallback de render en cliente (<!--$!-->): error de SSR');

  const rq = html.match(/<script>window\.__RQ__=([\s\S]*?)<\/script>/);
  if (rq && rq[1].includes('<')) fail(relative, 'window.__RQ__ con "<" sin escapar');

  if (relative === path.join('es', 'index.html')) {
    const words = visibleWords(html);
    if (words <= MIN_WORDS_HOME_ES) fail(relative, `${words} palabras visibles (se esperan más de ${MIN_WORDS_HOME_ES})`);
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
