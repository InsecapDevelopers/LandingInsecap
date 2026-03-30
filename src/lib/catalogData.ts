import thematicCatalog from '../../shopify_thematic_intermediate.json';

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
}

export interface CatalogSelections {
  modalidad: string;
  horas: string;
  estandar: string;
}

export type SelectorKey = keyof CatalogSelections;

export interface SelectorOptions {
  modalidades: string[];
  horas: string[];
  estandares: string[];
}

export interface JsonCatalogAvailabilitySummary {
  modalidades: string[];
  horas: string[];
  estandares: string[];
}

const EMPTY_SELECTIONS: CatalogSelections = {
  modalidad: '',
  horas: '',
  estandar: '',
};

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

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

export const getJsonCatalogCategories = (): Array<{ label: string; count: number }> => {
  const counter = new Map<string, number>();
  parsedCatalog.forEach((topic) => {
    counter.set(topic.categoria, (counter.get(topic.categoria) ?? 0) + 1);
  });

  return Array.from(counter.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }));
};

const scoreTopic = (topic: JsonCatalogTopic, query: string): number => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return 0;
  }

  const normalizedTitle = normalizeText(topic.tema);
  const normalizedCategory = normalizeText(topic.categoria);
  const normalizedHandle = normalizeText(topic.handle.replace(/-/g, ' '));
  const titleTokens = normalizedTitle.split(/\s+/);
  const queryTokens = normalizedQuery.split(/\s+/);

  let score = 0;

  if (normalizedTitle === normalizedQuery) {
    score += 120;
  }
  if (normalizedTitle.startsWith(normalizedQuery)) {
    score += 70;
  }
  if (normalizedTitle.includes(normalizedQuery)) {
    score += 45;
  }
  if (normalizedHandle.includes(normalizedQuery)) {
    score += 25;
  }
  if (normalizedCategory.includes(normalizedQuery)) {
    score += 10;
  }

  queryTokens.forEach((token) => {
    if (titleTokens.some((titleToken) => titleToken === token)) {
      score += 18;
      return;
    }
    if (titleTokens.some((titleToken) => titleToken.startsWith(token))) {
      score += 10;
      return;
    }
    if (normalizedTitle.includes(token)) {
      score += 6;
    }
  });

  return score;
};

export const semanticSearchJsonTopics = (
  topics: JsonCatalogTopic[],
  query: string
): JsonCatalogTopic[] => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return topics;
  }

  return topics
    .map((topic) => ({ topic, score: scoreTopic(topic, normalizedQuery) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.topic.tema.localeCompare(b.topic.tema, 'es', { sensitivity: 'base' });
    })
    .map((entry) => entry.topic);
};

const matchesSelections = (
  combination: JsonCombination,
  selections: CatalogSelections,
  excludeKey?: SelectorKey
): boolean => {
  const modalidadMatch =
    excludeKey === 'modalidad' || !selections.modalidad || combination.modalidad === selections.modalidad;

  const horasMatch =
    excludeKey === 'horas' ||
    !selections.horas ||
    String(combination.horas ?? 'cotizar') === selections.horas;

  const estandarMatch =
    excludeKey === 'estandar' || !selections.estandar || combination.estandar === selections.estandar;

  return modalidadMatch && horasMatch && estandarMatch;
};

export const getSelectorOptions = (
  topic: JsonCatalogTopic,
  selections: CatalogSelections = EMPTY_SELECTIONS
): SelectorOptions => {
  const modalidades = uniqueSorted(
    topic.combinaciones
      .filter((combination) => matchesSelections(combination, selections, 'modalidad'))
      .map((combination) => combination.modalidad)
  );

  const horas = uniqueSorted(
    topic.combinaciones
      .filter((combination) => matchesSelections(combination, selections, 'horas'))
      .map((combination) => String(combination.horas ?? 'cotizar'))
  );

  const estandares = uniqueSorted(
    topic.combinaciones
      .filter((combination) => matchesSelections(combination, selections, 'estandar'))
      .map((combination) => combination.estandar)
  );

  return {
    modalidades,
    horas,
    estandares,
  };
};

export const hasValidCombination = (
  topic: JsonCatalogTopic,
  selections: CatalogSelections = EMPTY_SELECTIONS
): boolean => topic.combinaciones.some((combination) => matchesSelections(combination, selections));

export const getInitialSelections = (): CatalogSelections => ({ ...EMPTY_SELECTIONS });

export const getTopicAvailabilitySummary = (
  topic: JsonCatalogTopic
): JsonCatalogAvailabilitySummary => ({
  modalidades: uniqueSorted(topic.combinaciones.map((combination) => combination.modalidad)),
  horas: uniqueSorted(topic.combinaciones.map((combination) => String(combination.horas ?? 'cotizar'))),
  estandares: uniqueSorted(topic.combinaciones.map((combination) => combination.estandar)),
});

export const getRelatedJsonTopics = (
  topic: JsonCatalogTopic,
  limit: number = 4
): JsonCatalogTopic[] =>
  parsedCatalog
    .filter(
      (candidate) =>
        candidate.categoria === topic.categoria && candidate.handle !== topic.handle
    )
    .sort((a, b) => a.tema.localeCompare(b.tema, 'es', { sensitivity: 'base' }))
    .slice(0, limit);

export const formatHoursLabel = (value: string): string =>
  value === 'cotizar' ? 'Cotizar' : `${value} horas`;
