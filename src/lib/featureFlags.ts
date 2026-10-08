/**
 * Feature flags centralizados.
 * Controlan la activación de funcionalidades opcionales del sitio (VITE_* en el .env).
 */

/**
 * Habilita o deshabilita toda la experiencia de simuladores:
 * - Seccion de simuladores en Home
 * - Ruta /simuladores
 */
export const isSimulatorsEnabled: boolean =
  import.meta.env.VITE_SIMULATORS_ENABLED === 'true';

/**
 * Muestra la seccion "Curso Abierto" (rolling text + card de oferta) en Home.
 * Activar solo cuando exista una oferta vigente.
 */
export const isOpenCourseOfferEnabled: boolean =
  import.meta.env.VITE_OPEN_COURSE_OFFER === 'true';

/**
 * Burbuja de Capin (chat de cursos) en todo el sitio. Llama directo al RAG-service de Capin en
 * modo público (VITE_CAPIN_API_URL): activar cuando esa versión de Capin esté desplegada.
 */
export const isCapinChatEnabled: boolean =
  import.meta.env.VITE_CAPIN_CHAT_ENABLED === 'true';
