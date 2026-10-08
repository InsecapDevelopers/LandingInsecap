/**
 * Catálogo de cursos de la web: 61 temas agrupados a partir de los cursos vigentes de DB_SGC
 * (sin recertificaciones ni precontratos). Cómo se arma y se actualiza: docs/catalogo-cursos.md.
 */
import thematicCatalog from '../data/cursos.json';

export interface JsonCombination {
  modalidad: string;
  horas: number | null;
  estandar: string;
}

export interface JsonCatalogTopic {
  tema: string;
  handle: string;
  categoria: string;
  cursos_fuente: number;
  modalidades: string[];
  estandares: string[];
  combinaciones: JsonCombination[];
  /** Foto del curso en Spaces (repositorio/catalogo-web/); null: la tarjeta muestra el ícono. */
  imagen: string | null;
  /** Algún curso vigente del tema tiene código SENCE en DB_SGC (R11.codigoSence). */
  sence: boolean;
}

const uniqueSorted = (items: string[]): string[] =>
  Array.from(new Set(items.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, 'es', { sensitivity: 'base' })
  );

const sanitizeHours = (hours: number | null): number | null => {
  if (typeof hours !== 'number' || Number.isNaN(hours) || hours <= 0) {
    return null;
  }
  return hours;
};

const dedupeCombinations = (combinations: JsonCombination[]): JsonCombination[] => {
  const map = new Map<string, JsonCombination>();
  combinations.forEach((combination) => {
    const key = `${combination.modalidad}|${combination.horas ?? 'cotizar'}|${combination.estandar}`;
    if (!map.has(key)) {
      map.set(key, combination);
    }
  });
  return Array.from(map.values());
};

const parsedCatalog: JsonCatalogTopic[] = (thematicCatalog as JsonCatalogTopic[]).map((topic) => {
  const sanitizedCombinations = dedupeCombinations(
    topic.combinaciones.map((combination) => ({
      modalidad: combination.modalidad,
      horas: sanitizeHours(combination.horas),
      estandar: combination.estandar,
    }))
  );

  const modalidades = uniqueSorted(sanitizedCombinations.map((c) => c.modalidad));
  const estandares = uniqueSorted(sanitizedCombinations.map((c) => c.estandar));

  return {
    ...topic,
    combinaciones: sanitizedCombinations,
    modalidades,
    estandares,
  };
});

export const getJsonCatalogTopics = (): JsonCatalogTopic[] => parsedCatalog;

export const getJsonCatalogByHandle = (handle: string): JsonCatalogTopic | null => {
  const found = parsedCatalog.find((topic) => topic.handle === handle);
  return found ?? null;
};
