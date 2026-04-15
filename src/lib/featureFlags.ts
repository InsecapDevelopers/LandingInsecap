/**
 * Feature flags centralizados.
 * Controlan la activación de funcionalidades opcionales del sitio.
 *
 * Para activar el e-commerce, definir en el archivo .env:
 *   VITE_ECOMMERCE_ENABLED=true
 *
 * En producción sin e-commerce, definir:
 *   VITE_ECOMMERCE_ENABLED=false
 */

/**
 * Habilita el flujo completo de compra:
 * - Carrito de compras en el header
 * - Precio por curso en las cards y detalle
 * - Botón "Agregar al carrito"
 */
export const isEcommerceEnabled: boolean =
  import.meta.env.VITE_ECOMMERCE_ENABLED === 'true';

/**
 * Alterna la fuente de cursos entre JSON estatico y Shopify.
 * true: usar JSON local.
 * false: usar flujo actual Shopify.
 */
export const isLecturaJSONEnabled: boolean =
  import.meta.env.VITE_LECTURA_JSON === 'true';

/**
 * Habilita el catalogo B2B (empresas) en rutas dedicadas.
 */
export const isB2bCatalogEnabled: boolean =
  import.meta.env.VITE_B2B_CATALOG_ENABLED === 'true';

/**
 * Habilita o deshabilita toda la experiencia de simuladores:
 * - Seccion de simuladores en Home
 * - Ruta /simuladores
 */
export const isSimulatorsEnabled: boolean =
  import.meta.env.VITE_SIMULATORS_ENABLED === 'true';
