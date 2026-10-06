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
}

/**
 * PT se publica con `noindex,follow` hasta corregir las tildes de los textos (decisión 1.3).
 * TODO: Fase 3 lo pasa a true.
 */
export const PT_INDEXABLE = false;

const ALL: Record<AppLanguage, boolean> = { es: true, en: true, pt: true };
const ES_ONLY: Record<AppLanguage, boolean> = { es: true, en: false, pt: false };

const institucional = (path: string): SeoRoute => ({
  path,
  kind: 'institucional',
  translated: ALL,
  indexable: true,
  prerender: true,
});

const datos = (path: string, prerender = true): SeoRoute => ({
  path,
  kind: 'datos',
  translated: ES_ONLY,
  indexable: true,
  prerender,
});

export const seoRoutes: SeoRoute[] = [
  institucional(''),
  institucional('nosotros'),
  institucional('nuestro-equipo'),
  institucional('equipo-honor'),
  institucional('Experiencia-y-Respaldo'),
  institucional('especialidades/sap-pm'),
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

  datos('cursos-empresas'),
  datos('curso-empresa/:handle'),
  datos('noticias'),
  datos('noticias/:blogHandle/:articleHandle'),
  // Productos `ea-*` del ecommerce apagado: render en el cliente desde el shell (Fase 2 los redirige).
  datos('curso/:handle', false),
  datos('cursos/:handle', false),

  {
    path: 'formulario/cursos-abiertos',
    kind: 'utilidad',
    translated: ALL,
    indexable: false,
    prerender: true,
  },
];

export const isDynamicSeoRoute = (route: SeoRoute) => route.path.includes(':');

/** Busca la entrada de la tabla para un pathname con prefijo de idioma (`/es/nosotros`). */
export const findSeoRoute = (pathname: string): SeoRoute | undefined => {
  if (!getLocaleFromPath(pathname)) {
    return undefined;
  }

  const path = stripLocaleFromPath(pathname);
  return seoRoutes.find((route) => matchPath({ path: `/${route.path}`, end: true }, path));
};

export const isSeoRouteIndexable = (route: SeoRoute, locale: AppLanguage): boolean =>
  route.indexable && route.translated[locale] && (locale !== 'pt' || PT_INDEXABLE);

/** Valor de `<meta name="robots">` para un pathname. Rutas fuera de la tabla (404): noindex. */
export const getRobotsForPath = (pathname: string): string => {
  const locale = getLocaleFromPath(pathname);
  const route = findSeoRoute(pathname);

  if (!locale || !route || !isSeoRouteIndexable(route, locale)) {
    return 'noindex, follow';
  }

  return 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
};

/** URL con prefijo de idioma para una ruta estática de la tabla. */
export const buildSeoRouteUrl = (route: SeoRoute, locale: AppLanguage) =>
  route.path ? `/${locale}/${route.path}` : `/${locale}`;

export const seoLocales = supportedLanguages;
