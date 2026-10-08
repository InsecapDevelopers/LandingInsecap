/**
 * Content-Security-Policy del sitio (Tarea #8, Fase 7). La usan scripts/prerender.mjs, que escribe
 * dist/csp.conf, y scripts/check-dist.mjs, que verifica que cada script inline tenga su hash.
 *
 * Un nginx estático no puede emitir nonces, así que los scripts inline se permiten por su hash
 * sha256: el splash y el cargador de terceros de index.html, y el loader diferido del bundle que
 * agrega prerender.mjs. El estado de react-query (#__RQ__) y el JSON-LD son bloques de datos
 * (type="application/json" / "application/ld+json"): no se ejecutan y el CSP no los mira.
 *
 * Orígenes: los que el sitio pide de verdad, medidos con Chrome headless en /es, /en, /pt y
 * contacto (scripts/check-hydration.mjs con CSP=1), más los de código que no corre en esas páginas
 * (iframes de mapas y del muro de la fama, Capin). Fotos del sitio: Spaces (repositorio del TMS).
 * Si GTM-MPJBBMF agrega una etiqueta nueva (HTML personalizado o un píxel), aparece en los reportes
 * de /csp-report y hay que sumarla aquí (sección 4, punto 12 del registro de decisiones).
 */
import crypto from 'node:crypto';

/** Scripts que el navegador ejecuta: sin src y sin type, o con un type de JavaScript. */
const EXECUTABLE_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module']);

/**
 * Contenido de cada <script> inline ejecutable del HTML, en orden. Sin los comentarios HTML antes:
 * el de index.html sobre los terceros menciona "<script>" y se tomaría como inicio de un script.
 */
export const inlineScripts = (html) =>
  [...html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, attrs]) => !/\ssrc=/i.test(attrs))
    .filter(([, attrs]) => EXECUTABLE_TYPES.has((attrs.match(/\stype="([^"]*)"/i)?.[1] ?? '').toLowerCase()))
    .map(([, , body]) => body);

/** Fuente CSP de un script inline: 'sha256-…' del texto exacto entre las etiquetas (UTF-8). */
export const scriptHash = (body) => `'sha256-${crypto.createHash('sha256').update(body, 'utf8').digest('base64')}'`;

const origin = (url) => {
  try {
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
};

/** Google Ads y GA (gtag AW-817100949 y lo que traiga GTM-MPJBBMF). */
const GOOGLE = [
  'https://www.googletagmanager.com',
  'https://www.google-analytics.com',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
  'https://www.googleadservices.com',
  'https://googleads.g.doubleclick.net',
  'https://*.doubleclick.net',
  'https://www.google.com',
  'https://www.google.cl',
];
const META = ['https://connect.facebook.net', 'https://www.facebook.com'];
const CLARITY = ['https://*.clarity.ms', 'https://c.bing.com'];
const STORAGE = ['https://storageisecap.sfo2.digitaloceanspaces.com'];

/**
 * Política completa como texto de cabecera. `env` son las VITE_* del build: las APIs del TMS
 * (VITE_TMS_PLUS_API_URL) y Capin (VITE_CAPIN_API_URL) entran por su origen,
 * además de los de producción conocidos.
 */
export const buildCsp = (hashes, env = {}) => {
  const apis = [
    'https://api-plus.insecap.cl',
    'https://tms.insecap.cl',
    origin(env.VITE_TMS_PLUS_API_URL),
    // Capin (VITE_CAPIN_API_URL, p. ej. https://rag.insecap.cl): entra cuando la variable está definida en CI.
    origin(env.VITE_CAPIN_API_URL),
  ];
  const list = (...items) => [...new Set(items.flat().filter(Boolean))].join(' ');

  return [
    `default-src 'self'`,
    // 'report-sample': el reporte trae los primeros caracteres del script bloqueado.
    `script-src ${list("'self'", "'report-sample'", [...hashes].sort(), GOOGLE, META, CLARITY)}`,
    // React y framer-motion escriben style="…" en línea; los hashes no cubren atributos.
    `style-src 'self' 'unsafe-inline'`,
    `img-src ${list("'self'", 'data:', 'blob:', STORAGE, GOOGLE, META, CLARITY)}`,
    `font-src 'self' data:`,
    `media-src ${list("'self'", STORAGE)}`,
    `connect-src ${list("'self'", apis, GOOGLE, META, CLARITY)}`,
    // Mapas de AboutUs, muro de la fama del TMS (HonorTeam) y los iframes de conversión de Google/Meta.
    `frame-src ${list("'self'", 'https://maps.google.com', GOOGLE, META, apis)}`,
    `worker-src 'self' blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    // frame-ancestors no aplica en Report-Only: va en enforce en snippets/security-headers.conf.
    `report-uri /csp-report`,
  ].join('; ');
};

/**
 * Snippet de nginx con la política en Report-Only. scripts/prerender.mjs lo escribe en
 * dist/csp.conf y el Dockerfile lo copia a /etc/nginx/snippets/csp.conf (no se publica).
 */
export const buildCspConf = (hashes, env = {}) => `# Generado por scripts/prerender.mjs (scripts/csp.mjs). No editar a mano.
# Content-Security-Policy en Report-Only: el navegador no bloquea nada, solo reporta a /csp-report
# (nginx.conf lo registra en el log del contenedor: docker logs <contenedor> | grep csp-report).
# TODO(2026-10-20): tras 2 semanas de observación en producción sin reportes legítimos, cambiar la
# cabecera a Content-Security-Policy (enforce) en scripts/csp.mjs (Fase 7, riesgo 9 del registro).
add_header Content-Security-Policy-Report-Only "${buildCsp(hashes, env)}" always;
`;
