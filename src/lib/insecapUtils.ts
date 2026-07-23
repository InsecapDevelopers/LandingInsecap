/**
 * Utilidades globales de INSECAP.
 * Centraliza constantes y cálculos relacionados con la identidad de la empresa.
 */

/** Año de fundación de INSECAP. Confirmar con el equipo si cambia. */
export const FOUNDING_YEAR = 1991;

/**
 * Año de inicio operacional de INSECAP para el conteo de "años de experiencia".
 * El aniversario se celebra cada 1 de agosto: hasta el 31 de julio del año en curso
 * el contador permanece en currentYear - OPERATIONAL_START_YEAR - 1; a partir del
 * 1 de agosto sube a currentYear - OPERATIONAL_START_YEAR.
 */
export const OPERATIONAL_START_YEAR = 2009;

/**
 * Retorna los años de experiencia de INSECAP calculados dinámicamente.
 * El contador se incrementa cada 1 de agosto.
 */
export const getYearsOfExperience = (): number => {
  const now = new Date();
  const currentYear = now.getFullYear();
  // Aniversario: 1 de agosto (mes 7 en base 0)
  const anniversary = new Date(currentYear, 7, 1);
  return now >= anniversary
    ? currentYear - OPERATIONAL_START_YEAR
    : currentYear - OPERATIONAL_START_YEAR - 1;
};

/** Formatea un RUT chileno mientras se escribe: 12.345.678-9. */
export const formatRut = (rut: string): string => {
  let cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();

  if (cleanRut.length > 9) {
    cleanRut = cleanRut.slice(0, 9);
  }

  if (cleanRut.length === 0) return '';
  if (cleanRut.length <= 1) return cleanRut;

  const dv = cleanRut.slice(-1);
  const body = cleanRut.slice(0, -1);

  let formattedBody = '';
  for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
    formattedBody = body.charAt(i) + formattedBody;
    if ((j + 1) % 3 === 0 && i !== 0) {
      formattedBody = '.' + formattedBody;
    }
  }

  return `${formattedBody}-${dv}`;
};
