/**
 * IndexNow (Fase 9, tarea #8): avisa a Bing, Yandex, Seznam, Naver… (api.indexnow.org reparte a
 * todos) qué URLs cambiaron en el último deploy, para que las vuelvan a rastrear sin esperar.
 *
 * Cambiada = <loc> nueva, <loc> con <lastmod> distinto o <loc> que ya no está en el sitemap
 * (IndexNow también sirve para avisar de URLs que ahora dan 404 o 301). Se compara el sitemap del
 * build nuevo con el que estaba publicado ANTES del deploy, por eso son dos pasos en deploy.yml:
 *
 *   node scripts/indexnow.mjs snapshot <origen> <dir>   # copia sitemap-index.xml y sus hijos
 *   node scripts/indexnow.mjs submit <dir-nuevo> <dir-publicado> [--dry-run]
 *
 * <origen> es una URL (https://insecap.cl, http://localhost:8080) o un directorio (dist/).
 * Si el sitemap publicado no existe o no es XML (primer deploy, sitio caído), se avisan todas las
 * URLs del nuevo. Máximo 10.000 URLs por aviso (límite de IndexNow).
 *
 * La clave es el único public/<32 hex>.txt del repo; se publica en https://insecap.cl/<clave>.txt.
 * Antes del POST se espera (hasta ~90 s) a que esa URL devuelva la clave, porque el buscador la
 * verifica. Sale con 1 si algo falla: en deploy.yml el paso es continue-on-error y no rompe el deploy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://insecap.cl';
const HOST = new URL(SITE).host;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10_000;
const INDEX = 'sitemap-index.xml';

const log = (...args) => console.log('[indexnow]', ...args);

const findKey = () => {
  const keys = fs.readdirSync(path.join(ROOT, 'public')).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  if (keys.length !== 1) throw new Error(`se esperaba un public/<32 hex>.txt y hay ${keys.length}`);
  const key = keys[0].slice(0, -4);
  const content = fs.readFileSync(path.join(ROOT, 'public', keys[0]), 'utf8').trim();
  if (content !== key) throw new Error(`public/${keys[0]} no contiene su propia clave`);
  return key;
};

/** Texto de <origen>/<nombre> (URL o directorio); null si no existe. */
const readSource = async (source, name) => {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(`${source.replace(/\/$/, '')}/${name}`, { signal: AbortSignal.timeout(20_000) });
    return res.ok ? res.text() : null;
  }
  const file = path.join(source, name);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
};

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

/** Nombres de los sitemaps hijos que declara el índice (solo los de insecap.cl). */
const childNames = (indexXml) =>
  locs(indexXml).filter((u) => u.startsWith(`${SITE}/`)).map((u) => u.slice(SITE.length + 1));

/** Map<loc, lastmod> de todos los sitemaps de un directorio; vacío si no hay un índice válido. */
const readUrls = (dir) => {
  const urls = new Map();
  const index = path.join(dir, INDEX);
  if (!fs.existsSync(index)) return urls;
  for (const name of childNames(fs.readFileSync(index, 'utf8'))) {
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) continue;
    for (const [, block] of fs.readFileSync(file, 'utf8').matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1].trim();
      if (loc) urls.set(loc, block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1].trim() ?? '');
    }
  }
  return urls;
};

const snapshot = async (source, dir) => {
  fs.mkdirSync(dir, { recursive: true });
  const index = await readSource(source, INDEX).catch(() => null);
  // El sitio antiguo (SPA) responde index.html con 200 a cualquier ruta: eso no es un sitemap.
  if (!index || !index.includes('<sitemapindex')) {
    log(`${source}/${INDEX} no existe o no es un índice de sitemaps: se avisarán todas las URLs.`);
    return;
  }
  fs.writeFileSync(path.join(dir, INDEX), index);
  for (const name of childNames(index)) {
    const xml = await readSource(source, name).catch(() => null);
    if (xml?.includes('<urlset')) fs.writeFileSync(path.join(dir, name), xml);
    else log(`no se pudo leer ${name} de ${source}`);
  }
  log(`sitemaps de ${source} guardados en ${dir}`);
};

const waitForKey = async (key) => {
  const url = `${SITE}/${key}.txt`;
  for (let i = 0; i < 18; i++) {
    const body = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10_000) })
      .then((r) => (r.ok ? r.text() : ''))
      .catch(() => '');
    if (body.trim() === key) return true;
    await new Promise((r) => setTimeout(r, 5_000));
  }
  return false;
};

const submit = async (newDir, oldDir, dryRun) => {
  const key = findKey();
  const next = readUrls(newDir);
  if (next.size === 0) throw new Error(`${newDir} no tiene sitemaps con URLs`);
  const prev = readUrls(oldDir);

  const changed = [...next].filter(([loc, lastmod]) => prev.get(loc) !== lastmod).map(([loc]) => loc);
  const removed = [...prev.keys()].filter((loc) => !next.has(loc));
  const urlList = [...changed, ...removed].filter((u) => new URL(u).host === HOST);
  log(`${next.size} URLs en el sitemap nuevo, ${prev.size} en el publicado: ${changed.length} nuevas o con lastmod distinto, ${removed.length} retiradas.`);

  if (urlList.length === 0) {
    log('sin cambios: no se avisa.');
    return;
  }
  if (urlList.length > MAX_URLS) log(`${urlList.length} URLs: se avisan solo las primeras ${MAX_URLS}.`);
  const body = { host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList: urlList.slice(0, MAX_URLS) };

  if (dryRun) {
    log(`--dry-run: no se envía. Primeras URLs:\n  ${body.urlList.slice(0, 20).join('\n  ')}`);
    return;
  }
  if (!(await waitForKey(key))) throw new Error(`${body.keyLocation} no devuelve la clave: no se avisa`);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  // 200 OK y 202 Accepted (clave aún en verificación) son éxito; 400/403/422/429 no.
  log(`IndexNow ${res.status} (${body.urlList.length} URLs)`);
  if (res.status !== 200 && res.status !== 202) throw new Error(`respuesta ${res.status}: ${await res.text().catch(() => '')}`);
};

const [cmd, a, b] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
try {
  if (cmd === 'snapshot' && a && b) await snapshot(a, b);
  else if (cmd === 'submit' && a && b) await submit(a, b, process.argv.includes('--dry-run'));
  else {
    console.error('Uso: node scripts/indexnow.mjs snapshot <origen> <dir> | submit <dir-nuevo> <dir-publicado> [--dry-run]');
    process.exit(2);
  }
} catch (err) {
  console.error('[indexnow] error:', err.message);
  process.exit(1);
}
