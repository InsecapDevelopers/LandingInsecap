/**
 * Imágenes responsivas (Fase 6, Core Web Vitals). Funciones puras: el prerender (Node) y el
 * cliente calculan el mismo src/srcset, así la hidratación no cambia atributos.
 *
 * - DigitalOcean Spaces (repositorio de imágenes del TMS) no redimensiona: cada foto se sube ya en
 *   WebP al ancho de render y ≤ 200 KB, y se usa la URL tal cual.
 * - Locales recomprimidas en public/images/…: `<base>-<ancho>.webp` (ver localImage), para la
 *   imagen LCP y lo que va sobre el pliegue.
 */

export interface ResponsiveImage {
  src: string;
  srcSet?: string;
  sizes?: string;
}

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
