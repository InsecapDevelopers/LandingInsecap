/**
 * Capa de datos del módulo de Noticias (sistema interno).
 *
 * Reemplaza el blog de Shopify. Devuelve `ShopifyArticle` para no reescribir los componentes
 * que ya consumen esa forma (Blog, ArticleDetail, NewsSlider, BlogArticles).
 * El nombre del tipo es herencia de Shopify; la fuente ya no lo es.
 *
 * La API responde camelCase (serializador global del backend); las claves de paginación
 * sí son snake_case.
 */
import type { ShopifyArticle } from './shopify';

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

const toArticle = (n: ApiNoticia): ShopifyArticle => ({
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
): Promise<{ articles: ShopifyArticle[]; total: number }> {
  const res = await fetch(newsUrl(`?page=${page}&per_page=${perPage}`));
  if (!res.ok) throw new Error(`Error al cargar noticias: ${res.status}`);
  const json: ApiListado = await res.json();
  return { articles: json.data.map(toArticle), total: json.total };
}

export async function fetchNewsBySlug(slug: string): Promise<ShopifyArticle | null> {
  const res = await fetch(newsUrl(`/${encodeURIComponent(slug)}`));
  if (res.status === 404) return null; // no existe, oculta o eliminada
  if (!res.ok) throw new Error(`Error al cargar la noticia: ${res.status}`);
  return toArticle(await res.json());
}
