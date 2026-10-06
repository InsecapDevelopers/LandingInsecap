/**
 * Contrato del HTML prerenderizado: corre al final de `npm run build` y lo hace fallar si una
 * página no cumple lo que necesitan buscadores y bots de IA sin ejecutar JS (Fase 1, tarea #8).
 *
 * Uso:
 *   node scripts/check-dist.mjs
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
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
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

for (const { file, locale } of pages) {
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

checkNoindex('404.html');
const shell = checkNoindex('_shell.html');
if (shell && !shell.includes('<div id="root"></div>')) fail('_shell.html', '#root no está vacío');

if (failures.length > 0) {
  console.error(`[check-dist] ${failures.length} falla(s) en ${pages.length} páginas:`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}

console.log(`[check-dist] OK: ${pages.length} páginas, 404.html y _shell.html`);
