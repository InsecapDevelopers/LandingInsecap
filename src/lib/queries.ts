/**
 * Consultas de react-query compartidas por el cliente y el prerender (decisiones tarea #8, 1.6).
 *
 * Los componentes llaman `useQuery(xxxQuery(...))` y src/entry-server.tsx precarga las mismas
 * opciones antes de renderizar cada ruta. Como la queryKey es la misma, el estado viaja en
 * `window.__RQ__` y el cliente hidrata sin volver a pedir los datos.
 * Una ruta nueva con datos remotos se agrega aquí y en `prefetchRoute` (entry-server.tsx).
 */
import { queryOptions } from '@tanstack/react-query';

import { fetchB2bCatalogTopics } from './b2bCatalogData';
import { fetchAllNews, fetchNews, fetchNewsBySlug } from './newsData';

/** Noticias por página en /noticias (Blog). */
export const NEWS_PER_PAGE = 12;
/** Noticias del bloque de la home (NewsSlider). */
export const NEWS_SLIDER_COUNT = 4;

export const queryKeys = {
  newsList: (page: number, perPage: number) => ['news', 'list', page, perPage] as const,
  newsAll: () => ['news', 'all'] as const,
  newsArticle: (slug: string) => ['news', 'article', slug] as const,
  b2bTopics: () => ['b2b', 'topics'] as const,
};

export const newsListQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: queryKeys.newsList(page, perPage),
    queryFn: () => fetchNews(page, perPage),
  });

/** Todas las noticias (sin cuerpo). Solo la usa el prerender para listar las rutas de detalle. */
export const newsAllQuery = () =>
  queryOptions({
    queryKey: queryKeys.newsAll(),
    queryFn: () => fetchAllNews(),
  });

/** Detalle de una noticia; `null` si no existe o está oculta. */
export const newsArticleQuery = (slug: string) =>
  queryOptions({
    queryKey: queryKeys.newsArticle(slug),
    queryFn: () => fetchNewsBySlug(slug),
  });

/** Catálogo B2B completo: lo usan el catálogo (/cursos-empresas) y cada ficha (/curso-empresa/:handle). */
export const b2bTopicsQuery = () =>
  queryOptions({
    queryKey: queryKeys.b2bTopics(),
    queryFn: fetchB2bCatalogTopics,
  });
