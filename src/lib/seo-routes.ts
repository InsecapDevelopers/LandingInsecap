/**
 * Tabla única de rutas públicas por idioma (decisiones tarea #8, sección 1.3).
 *
 * De aquí salen el `robots` de cada página, la lista de rutas a prerenderizar y, en fases
 * siguientes, el hreflang, el sitemap y llms.txt. Una ruta nueva se agrega aquí y en
 * `routeDefinitions` (AppShell.tsx).
 *
 * - institucional: contenido traducido; se indexa en los idiomas con `translated` en true.
 * - datos: cursos, fichas, noticias… Hoy solo existen en español: en /en y /pt se
 *   prerenderizan con `noindex,follow` y sin hreflang.
 * - utilidad: formularios y similares; nunca se indexan.
 */
import { matchPath } from 'react-router-dom';

import { isCursoSeoIndexable } from '../data/cursos-seo';
import { isSimulatorsEnabled } from './featureFlags';
import { getLocaleFromPath, stripLocaleFromPath } from './locale-routing';
import { supportedLanguages, type AppLanguage } from './translations';

export type SeoRouteKind = 'institucional' | 'datos' | 'utilidad';

export interface SeoRoute {
  /** Ruta sin prefijo de idioma, en el formato de react-router. '' es la home. */
  path: string;
  kind: SeoRouteKind;
  /** Idiomas con traducción real del contenido. */
  translated: Record<AppLanguage, boolean>;
  /** false: noindex en todos los idiomas (formularios, rutas de relleno…). */
  indexable: boolean;
  /**
   * false: no se prerenderiza; nginx sirve `_shell.html` (200 + noindex) y renderiza el cliente.
   * Las rutas con parámetros se prerenderizan con las rutas que entregue `listDynamicPaths`.
   */
  prerender: boolean;
  /**
   * Indexabilidad por URL concreta en rutas con parámetros (p. ej. fichas sin párrafo de
   * respuesta real, riesgo 13). Se suma a `indexable`.
   */
  isIndexablePath?: (params: Record<string, string | undefined>) => boolean;
}

/**
 * PT institucional se indexa desde la Fase 3, con las tildes corregidas y los textos de JSX en los
 * diccionarios (decisión 1.3). En false vuelve a `noindex,follow` y sale del hreflang.
 * TODO: revisión nativa del portugués (sección 4, punto 8).
 */
export const PT_INDEXABLE = true;

const ALL: Record<AppLanguage, boolean> = { es: true, en: true, pt: true };
const ES_ONLY: Record<AppLanguage, boolean> = { es: true, en: false, pt: false };

const institucional = (path: string): SeoRoute => ({
  path,
  kind: 'institucional',
  translated: ALL,
  indexable: true,
  prerender: true,
});

const datos = (path: string, prerender = true, extra: Partial<SeoRoute> = {}): SeoRoute => ({
  path,
  kind: 'datos',
  translated: ES_ONLY,
  indexable: true,
  prerender,
  ...extra,
});

export const seoRoutes: SeoRoute[] = [
  institucional(''),
  institucional('nosotros'),
  institucional('nuestro-equipo'),
  institucional('equipo-honor'),
  institucional('acreditaciones'),
  institucional('sap-pm'),
  ...(isSimulatorsEnabled
    ? [
      institucional('simuladores'),
      institucional('simuladores/modelos'),
      institucional('simuladores/extintores'),
    ]
    : []),
  institucional('nuestros-clientes'),
  institucional('contacto'),
  institucional('relator-trabaja-con-nosotros'),
  institucional('politica-calidad'),
  institucional('politica-de-privacidad'),
  institucional('cursos-abiertos'),

  // Fase 2: índice, categorías y fichas de los 61 temas (src/data/cursos-seo.ts). En /cursos/:slug
  // solo se indexan las fichas con párrafo de respuesta real.
  // Las URLs antiguas (cursos-empresas, curso-empresa/…, curso/…, Experiencia-y-Respaldo,
  // especialidades/sap-pm, noticias/<blog>/<slug>) son 301 de nginx: src/lib/legacy-redirects.ts.
  datos('cursos'),
  datos('cursos/categoria/:area'),
  datos('cursos/:slug', true, { isIndexablePath: ({ slug }) => isCursoSeoIndexable(slug) }),
  datos('sedes/:sede'),
  // TODO: indexable cuando INSECAP valide el contenido (sección 4, punto 6).
  datos('franquicia-sence', true, { indexable: false }),
  datos('preguntas-frecuentes'),
  datos('noticias'),
  datos('noticias/:slug'),

  {
    path: 'formulario/cursos-abiertos',
    kind: 'utilidad',
    translated: ALL,
    indexable: false,
    prerender: true,
  },
];

export const isDynamicSeoRoute = (route: SeoRoute) => route.path.includes(':');

/**
 * Clave de `seo.pages` (translations.ts) con el title y la description escritos a mano de una
 * ruta estática: su propio path ('inicio' para la home). Las rutas con parámetros los arman
 * desde sus datos (cursos-seo.ts, sedes.ts, noticias) y no tienen clave.
 */
export const getSeoPageKey = (route: SeoRoute): string | null =>
  isDynamicSeoRoute(route) ? null : route.path || 'inicio';

/**
 * Busca la entrada de la tabla para un pathname con prefijo de idioma (`/es/nosotros`).
 * Las rutas estáticas ganan a las con parámetros (`cursos/categoria/:area` antes que `cursos/:slug`).
 */
export const matchSeoRoute = (pathname: string) => {
  if (!getLocaleFromPath(pathname)) {
    return undefined;
  }

  const path = stripLocaleFromPath(pathname);
  for (const route of [...seoRoutes].sort((a, b) => Number(isDynamicSeoRoute(a)) - Number(isDynamicSeoRoute(b)))) {
    const match = matchPath({ path: `/${route.path}`, end: true }, path);
    if (match) return { route, params: match.params };
  }
  return undefined;
};

export const findSeoRoute = (pathname: string): SeoRoute | undefined => matchSeoRoute(pathname)?.route;

/**
 * Si la ruta se indexa en un idioma. Con `pathname`, aplica además `isIndexablePath` de la URL
 * concreta (fichas de cursos).
 */
export const isSeoRouteIndexable = (route: SeoRoute, locale: AppLanguage, pathname?: string): boolean => {
  if (!route.indexable || !route.translated[locale] || (locale === 'pt' && !PT_INDEXABLE)) {
    return false;
  }
  if (!route.isIndexablePath) {
    return true;
  }
  const params = pathname ? matchSeoRoute(pathname)?.params : undefined;
  return params ? route.isIndexablePath(params) : false;
};

/** Valor de `<meta name="robots">` para un pathname. Rutas fuera de la tabla (404): noindex. */
export const getRobotsForPath = (pathname: string): string => {
  const locale = getLocaleFromPath(pathname);
  const route = findSeoRoute(pathname);

  if (!locale || !route || !isSeoRouteIndexable(route, locale, pathname)) {
    return 'noindex, follow';
  }

  return 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
};

/** URL con prefijo de idioma para una ruta estática de la tabla. */
export const buildSeoRouteUrl = (route: SeoRoute, locale: AppLanguage) =>
  route.path ? `/${locale}/${route.path}` : `/${locale}`;

export const seoLocales = supportedLanguages;
