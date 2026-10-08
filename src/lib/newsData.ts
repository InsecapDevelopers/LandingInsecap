/**
 * Capa de datos del módulo de Noticias (sistema interno).
 *
 * Devuelve `NewsArticle`, la forma que consumen Blog, ArticleDetail, NewsSlider y BlogArticles
 * (heredada del antiguo blog, de ahí `authorV2` y `blog.handle`).
 *
 * La API responde camelCase (serializador global del backend); las claves de paginación
 * sí son snake_case.
 */
export interface NewsArticle {
  id: string;
  title: string;
  handle: string;
  publishedAt: string;
  /** Fecha de la última edición; undefined si nunca se editó. */
  updatedAt?: string;
  excerpt: string | null;
  contentHtml: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  authorV2: {
    name: string;
  } | null;
  blog: {
    handle: string;
  };
}

/**
 * Fecha de una noticia, igual en el prerender y en el navegador (sin depender de la zona
 * horaria del equipo, que rompería la hidratación). `publicadoEn` llega sin zona horaria:
 * se muestra tal cual viene (TODO: confirmar con TMS Plus que es hora de Chile).
 * Si trae desfase, se muestra en America/Santiago.
 */
export function formatArticleDate(dateString: string, locale: string = 'es-CL'): string {
  const value = dateString.replace(/(\.\d{3})\d+/, '$1');
  const isNaiveDateTime = /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(value);
  const hasOffset = /(Z|[+-]\d{2}:?\d{2})$/i.test(value);

  return new Date(isNaiveDateTime ? `${value}Z` : value).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: hasOffset ? 'America/Santiago' : 'UTC',
  });
}

// El módulo vive en el TMS Plus. En dev se usa ruta relativa y el proxy de Vite
// (vite.config.ts → TMS_PLUS_PROXY_TARGET) la reenvía server-side, evitando CORS;
// en producción se arma la URL completa. Mismo patrón que OpenCourseRequestForm.
const NEWS_PATH = '/api/publica/noticias';
const newsUrl = (suffix = '') => {
  const baseUrl = (import.meta.env.VITE_TMS_PLUS_API_URL || '').replace(/\/+$/, '');
  return `${import.meta.env.PROD ? baseUrl : ''}${NEWS_PATH}${suffix}`;
};

interface ApiNoticia {
  id: number;
  slug: string;
  titulo: string;
  subtitulo: string | null;
  imagenPortada: string | null;
  autor: string | null;
  publicadoEn: string;
  oculto?: boolean;
  // solo en el detalle
  contenidoHtml?: string;
  imagenes?: string[];
  actualizadoEn?: string | null;
}

interface ApiListado {
  data: ApiNoticia[];
  total: number;
  page: number;
  per_page: number;
}

const toArticle = (n: ApiNoticia): NewsArticle => ({
  id: n.slug,
  title: n.titulo,
  handle: n.slug,
  publishedAt: n.publicadoEn,
  updatedAt: n.actualizadoEn ?? undefined,
  excerpt: n.subtitulo,
  contentHtml: n.contenidoHtml ?? '',
  // el backend no guarda alt de portada; el título es el mejor texto alternativo disponible
  image: n.imagenPortada ? { url: n.imagenPortada, altText: n.titulo } : null,
  authorV2: n.autor ? { name: n.autor } : null,
  blog: { handle: 'noticias' },
});

export async function fetchNews(
  page = 1,
  perPage = 9
): Promise<{ articles: NewsArticle[]; total: number }> {
  const res = await fetch(newsUrl(`?page=${page}&per_page=${perPage}`));
  if (!res.ok) throw new Error(`Error al cargar noticias: ${res.status}`);
  const json: ApiListado = await res.json();
  return { articles: json.data.map(toArticle), total: json.total };
}

export async function fetchNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const res = await fetch(newsUrl(`/${encodeURIComponent(slug)}`));
  if (res.status === 404) return null; // no existe, oculta o eliminada
  if (!res.ok) throw new Error(`Error al cargar la noticia: ${res.status}`);
  return toArticle(await res.json());
}

/** Todas las noticias publicadas (lista, sin cuerpo), paginando de a 50. La usa el prerender
 *  para generar una página por noticia; lanza si alguna página falla. */
export async function fetchAllNews(perPage = 50): Promise<NewsArticle[]> {
  const first = await fetchNews(1, perPage);
  const articles = [...first.articles];
  const pages = Math.ceil(first.total / perPage);

  for (let page = 2; page <= pages; page++) {
    const { articles: pageArticles } = await fetchNews(page, perPage);
    articles.push(...pageArticles);
  }

  return articles;
}
