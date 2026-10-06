/**
 * Imágenes responsivas (Fase 6, Core Web Vitals). Funciones puras: el prerender (Node) y el
 * cliente calculan el mismo src/srcset, así la hidratación no cambia atributos.
 *
 * - Shopify CDN (cdn.shopify.com/s/files/…): redimensiona con `width=` y negocia WebP según el
 *   Accept del navegador, así que basta con pedir el ancho de render.
 * - DigitalOcean Spaces (fotos de noticias del TMS) no redimensiona: se usa la URL tal cual.
 * - Locales recomprimidas en public/images/…: `<base>-<ancho>.webp` (ver localImage).
 */

const SHOPIFY_FILES = /^https:\/\/cdn\.shopify\.com\/s\/files\//;

export const isShopifyImage = (url: string): boolean => SHOPIFY_FILES.test(url);

/** URL de Shopify con `width=<ancho>` (reemplaza el que traiga); otras URLs quedan igual. */
export const shopifyImage = (url: string, width: number): string => {
  if (!isShopifyImage(url)) return url;
  const clean = url.replace(/([?&])width=\d+&?/, '$1').replace(/[?&]$/, '');
  return `${clean}${clean.includes('?') ? '&' : '?'}width=${width}`;
};

/**
 * Logo de Shopify que se muestra a un alto fijo (h-16, h-20…): lo pide al doble de ese alto (pantallas
 * 2x), sin pasar del ancho original.
 */
export const shopifyImageForHeight = (url: string, width: number, height: number, renderHeight: number): string =>
  shopifyImage(url, Math.min(width, Math.round((2 * renderHeight * width) / height)));

export interface ResponsiveImage {
  src: string;
  srcSet?: string;
  sizes?: string;
}

/**
 * src + srcset + sizes para una imagen de Shopify. `widths` en px reales (no CSS), de menor a
 * mayor; el src es el ancho más cercano a `fallback` (por defecto, el mayor). Si la URL no es de
 * Shopify devuelve solo el src.
 */
export const responsiveImage = (
  url: string,
  widths: readonly number[],
  sizes: string,
  fallback = widths[widths.length - 1],
): ResponsiveImage => {
  if (!isShopifyImage(url)) return { src: url };
  return {
    src: shopifyImage(url, fallback),
    srcSet: widths.map((w) => `${shopifyImage(url, w)} ${w}w`).join(', '),
    sizes,
  };
};

/**
 * Imagen local recomprimida en varios anchos: `<base>-<ancho>.webp` en public/. `base` va sin
 * ancho ni extensión (p. ej. '/images/cursos-abiertos/confinados').
 */
export const localImage = (base: string, widths: readonly number[], sizes: string): ResponsiveImage => ({
  src: `${base}-${widths[widths.length - 1]}.webp`,
  srcSet: widths.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
  sizes,
});

/**
 * `fetchpriority="high"` para la imagen LCP: React 18 no conoce la prop `fetchPriority` (avisa y
 * la escribe con mayúsculas), así que se pasa en minúsculas con spread. scripts/prerender.mjs
 * busca este atributo para inyectar el <link rel="preload"> de la imagen.
 */
export const HIGH_PRIORITY = { fetchpriority: 'high' } as Record<string, string>;
