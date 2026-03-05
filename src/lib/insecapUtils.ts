/**
 * Utilidades globales de INSECAP.
 * Centraliza constantes y cálculos relacionados con la identidad de la empresa.
 */

/** Año de fundación de INSECAP. Confirmar con el equipo si cambia. */
export const FOUNDING_YEAR = 1991;

/**
 * Retorna los años de experiencia de INSECAP calculados dinámicamente
 * a partir del año de fundación y el año actual.
 */
export const getYearsOfExperience = (): number =>
  new Date().getFullYear() - FOUNDING_YEAR;
