/**
 * Fecha del último commit de cada archivo fuente (equivale a `git log -1 --format=%cI -- <archivo>`):
 * es el <lastmod> de las páginas estáticas en los sitemaps (Fase 5, tarea #8).
 *
 * El build de Docker no tiene .git (ni git), así que en CI se calcula antes del `docker build`:
 *   node scripts/source-lastmod.mjs --write   # escribe .source-lastmod.json (necesita historia completa)
 * y prerender.mjs lo lee dentro del contenedor. Fuera de Docker, prerender.mjs usa git directo.
 *
 * Un clon superficial (fetch-depth 1) daría a todos los archivos la fecha del último commit, que
 * no es real: en ese caso no se usa git (y --write falla).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SOURCE_LASTMOD_FILE = path.join(ROOT, '.source-lastmod.json');
/** Rutas de las que se guarda la fecha (las de PAGE_SOURCES en src/lib/crawler-files.ts están aquí). */
const PATHS = ['src', 'shopify_thematic_intermediate.json'];

const git = (args) => execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });

/** { archivo: fecha ISO 8601 del último commit } desde git, o null si no hay git con historia completa. */
export const readGitLastmods = () => {
  try {
    if (git(['rev-parse', '--is-shallow-repository']).trim() !== 'false') return null;
    // Un solo recorrido de la historia: la primera vez que aparece un archivo es su último commit.
    const log = git(['log', '--format=%x00%cI', '--name-only', '--', ...PATHS]);
    const dates = {};
    for (const entry of log.split('\0').slice(1)) {
      const [date, ...files] = entry.split('\n').map((line) => line.trim()).filter(Boolean);
      for (const file of files) if (!(file in dates)) dates[file] = date;
    }
    return dates;
  } catch {
    return null;
  }
};

/**
 * Fechas para el prerender: git si está disponible; si no, .source-lastmod.json (CI → Docker).
 * `origin` dice de dónde salieron ('git', 'archivo' o null si no hay fechas).
 */
export const loadSourceLastmods = () => {
  const fromGit = readGitLastmods();
  if (fromGit) return { dates: fromGit, origin: 'git' };
  if (fs.existsSync(SOURCE_LASTMOD_FILE)) {
    return { dates: JSON.parse(fs.readFileSync(SOURCE_LASTMOD_FILE, 'utf8')), origin: path.basename(SOURCE_LASTMOD_FILE) };
  }
  return { dates: {}, origin: null };
};

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes('--write')) {
  const dates = readGitLastmods();
  if (!dates) {
    console.error('[source-lastmod] Se necesita git con la historia completa (actions/checkout con fetch-depth: 0).');
    process.exit(1);
  }
  fs.writeFileSync(SOURCE_LASTMOD_FILE, `${JSON.stringify(dates, null, 2)}\n`);
  console.log(`[source-lastmod] ${Object.keys(dates).length} archivos → ${path.basename(SOURCE_LASTMOD_FILE)}`);
}
