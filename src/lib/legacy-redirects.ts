/**
 * 301 de las URLs antiguas a las de la Fase 2 (decisiones tarea #8, plan de la Fase 2).
 *
 * Fuente única de las redirecciones:
 * - scripts/prerender.mjs escribe con `toNginxMap` el archivo dist/redirects.map, que nginx
 *   incluye en `map $uri $legacy_redirect` (nginx.conf). Un solo salto, siempre hacia una URL con
 *   prefijo de idioma, conservando la query.
 * - El cliente usa `resolveLegacyPath` como respaldo cuando no hay nginx delante (vite dev).
 *
 * Reglas (rutas sin idioma y sin barra inicial):
 *   cursos-empresas                → cursos
 *   curso-empresa/curso-<slug>     → cursos/<slug>     (los 61 temas de src/data/cursos-seo.ts)
 *   curso-empresa/<otro>           → cursos
 *   Experiencia-y-Respaldo (sin distinguir mayúsculas) → acreditaciones
 *   especialidades/sap-pm          → sap-pm
 *   noticias/<blog>/<slug>         → noticias/<slug>   (incluye noticias/noticias/<slug>)
 *   curso(s)/ea-*                  → cursos/categoria/<área> según el tag de Shopify (build);
 *                                    PRE-CONTRATO, RECERTIFICACIONES y los desconocidos → cursos
 *   curso/curso-<slug>             → cursos/<slug>
 *   curso/<otro>                   → cursos
 *
 * Cada regla vale con prefijo (/es, /en, /pt → mismo idioma), sin prefijo (→ /es) y con barra
 * final. Los patrones son regex compatibles con PCRE (nginx) y JS: sin barras invertidas, sin
 * llaves ni punto y coma (se escriben entre comillas en el .map).
 */
import { cursosSeo } from '../data/cursos-seo';
import { getLocaleFromPath, stripLocaleFromPath } from './locale-routing';
import { fallbackLanguage, supportedLanguages } from './translations';

export interface LegacyRedirect {
  /** Ruta antigua sin idioma ni barra inicial. Con `regex`, un patrón (sin ^ ni $). */
  from: string;
  /** Ruta nueva sin idioma ni barra inicial. Con `regex`, puede usar las capturas $1, $2… de `from`. */
  to: string;
  regex?: boolean;
  caseInsensitive?: boolean;
}

/** Producto `ea-*` del ecommerce apagado: handle y área del catálogo (null → índice /cursos). */
export interface EaProductArea {
  handle: string;
  areaSlug: string | null;
}

const LOCALE_GROUP = `(${supportedLanguages.join('|')})`;

/** Exactas: tienen prioridad sobre las regex (en nginx y en `resolveLegacyPath`). */
const exactRules = (eaProducts: EaProductArea[]): LegacyRedirect[] => [
  ...cursosSeo.flatMap((curso) => [
    { from: `curso-empresa/curso-${curso.slug}`, to: `cursos/${curso.slug}` },
    { from: `curso/curso-${curso.slug}`, to: `cursos/${curso.slug}` },
  ]),
  ...eaProducts.flatMap(({ handle, areaSlug }) => {
    const to = areaSlug ? `cursos/categoria/${areaSlug}` : 'cursos';
    return [
      { from: `curso/${handle}`, to },
      { from: `cursos/${handle}`, to },
    ];
  }),
];

/** Patrones y respaldos de las exactas (handles fuera del build). El orden importa. */
const regexRules: LegacyRedirect[] = [
  { from: 'cursos-empresas', to: 'cursos', regex: true },
  { from: 'curso-empresa/[^/]+', to: 'cursos', regex: true },
  { from: 'experiencia-y-respaldo', to: 'acreditaciones', regex: true, caseInsensitive: true },
  { from: 'especialidades/sap-pm', to: 'sap-pm', regex: true },
  { from: 'noticias/[^/]+/([^/]+)', to: 'noticias/$1', regex: true },
  { from: 'curso/[^/]+', to: 'cursos', regex: true },
  { from: 'cursos/ea-[^/]+', to: 'cursos', regex: true },
];

export const getLegacyRedirects = (eaProducts: EaProductArea[] = []): LegacyRedirect[] => [
  ...exactRules(eaProducts),
  ...regexRules,
];

/** Sube en 1 el número de cada captura ($1 → $2…): con prefijo, la captura 1 es el idioma. */
const shiftCaptures = (to: string) => to.replace(/\$(\d)/g, (_, n: string) => `$${Number(n) + 1}`);

/** Líneas de `map $uri $legacy_redirect { … }` para nginx (exactas primero, luego regex en orden). */
export const toNginxMap = (redirects: LegacyRedirect[]): string => {
  const lines: string[] = [];
  const exact = redirects.filter((rule) => !rule.regex);
  const regex = redirects.filter((rule) => rule.regex);

  for (const rule of exact) {
    for (const locale of supportedLanguages) {
      lines.push(`"/${locale}/${rule.from}" "/${locale}/${rule.to}";`);
      lines.push(`"/${locale}/${rule.from}/" "/${locale}/${rule.to}";`);
    }
    lines.push(`"/${rule.from}" "/${fallbackLanguage}/${rule.to}";`);
    lines.push(`"/${rule.from}/" "/${fallbackLanguage}/${rule.to}";`);
  }

  for (const rule of regex) {
    const op = rule.caseInsensitive ? '~*' : '~';
    lines.push(`"${op}^/${LOCALE_GROUP}/${rule.from}/?$" "/$1/${shiftCaptures(rule.to)}";`);
    lines.push(`"${op}^/${rule.from}/?$" "/${fallbackLanguage}/${rule.to}";`);
  }

  return [
    '# Generado por scripts/prerender.mjs desde src/lib/legacy-redirects.ts. No editar a mano.',
    '# nginx.conf: map $uri $legacy_redirect { include /etc/nginx/redirects.map; }',
    ...lines,
    '',
  ].join('\n');
};

/**
 * Destino nuevo (con idioma) de un pathname antiguo, o null si no es una ruta antigua.
 * En el cliente no hay datos de Shopify: los `ea-*` van al índice /cursos.
 */
export const resolveLegacyPath = (pathname: string, eaProducts: EaProductArea[] = []): string | null => {
  const locale = getLocaleFromPath(pathname) ?? fallbackLanguage;
  const path = stripLocaleFromPath(pathname).replace(/^\/+|\/+$/g, '');

  for (const rule of getLegacyRedirects(eaProducts)) {
    if (!rule.regex) {
      if (rule.from === path) return `/${locale}/${rule.to}`;
      continue;
    }
    const match = new RegExp(`^${rule.from}$`, rule.caseInsensitive ? 'i' : '').exec(path);
    if (match) {
      return `/${locale}/${rule.to.replace(/\$(\d)/g, (_, n: string) => match[Number(n)] ?? '')}`;
    }
  }

  return null;
};
