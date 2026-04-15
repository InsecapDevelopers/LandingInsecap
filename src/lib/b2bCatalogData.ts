import b2bCatalog from '@/data/b2bCatalog.json';
import { storefrontApiRequest } from '@/lib/shopify';

export interface B2bCombination {
  modalidad: string;
  horas: number | null;
  estandar: string;
}

export interface B2bCatalogTopic {
  tema: string;
  handle: string;
  categoria: string;
  image?: {
    url: string;
    altText: string | null;
  };
  cursos_fuente: number;
  modalidades: string[];
  estandares: string[];
  combinaciones: B2bCombination[];
}

type ShopifyB2bProductNode = {
  title: string;
  handle: string;
  productType: string;
  tags: string[];
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  variants: {
    edges: Array<{
      node: {
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
};

const STOREFRONT_B2B_PRODUCTS_QUERY = `
  query GetB2bProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          title
          handle
          productType
          tags
          featuredImage {
            url
            altText
          }
          variants(first: 20) {
            edges {
              node {
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

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

const parseHoursValue = (value: string | null | undefined): number | null => {
  if (!value) {
    return null;
  }

  const match = String(value).match(/\d+(?:[.,]\d+)?/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[0].replace(',', '.'));
  return sanitizeHours(Number.isFinite(parsed) ? parsed : null);
};

const dedupeCombinations = (combinations: B2bCombination[]): B2bCombination[] => {
  const map = new Map<string, B2bCombination>();
  combinations.forEach((combination) => {
    const key = `${combination.modalidad}|${combination.horas ?? 'cotizar'}|${combination.estandar}`;
    if (!map.has(key)) {
      map.set(key, combination);
    }
  });
  return Array.from(map.values());
};

const parsePrefixedTag = (tags: string[], prefix: string): string | null => {
  const tag = tags.find((item) => normalizeText(item).startsWith(`${prefix}:`));
  if (!tag) {
    return null;
  }

  const parts = tag.split(':');
  return parts.length > 1 ? parts.slice(1).join(':').trim() : null;
};

const toCombinationFromVariant = (
  selectedOptions: Array<{ name: string; value: string }> | undefined,
  fallbackTags: string[]
): B2bCombination => {
  const modalidadOption = selectedOptions?.find((option) => normalizeText(option.name).includes('modalidad'));
  const horasOption = selectedOptions?.find((option) => normalizeText(option.name).includes('hora'));
  const estandarOption = selectedOptions?.find((option) => normalizeText(option.name).includes('estandar'));

  return {
    modalidad:
      modalidadOption?.value ||
      parsePrefixedTag(fallbackTags, 'modalidad') ||
      'Por definir',
    horas:
      parseHoursValue(horasOption?.value) ??
      parseHoursValue(parsePrefixedTag(fallbackTags, 'horas')),
    estandar:
      estandarOption?.value ||
      parsePrefixedTag(fallbackTags, 'estandar') ||
      'General',
  };
};

const finalizeTopic = (topic: B2bCatalogTopic): B2bCatalogTopic => {
  const sanitizedCombinations = dedupeCombinations(
    (topic.combinaciones ?? []).map((combination) => ({
      modalidad: combination.modalidad,
      horas: sanitizeHours(combination.horas),
      estandar: combination.estandar,
    }))
  );

  return {
    ...topic,
    cursos_fuente:
      typeof topic.cursos_fuente === 'number' && topic.cursos_fuente > 0
        ? topic.cursos_fuente
        : Math.max(1, sanitizedCombinations.length),
    combinaciones: sanitizedCombinations,
    modalidades: uniqueSorted(sanitizedCombinations.map((c) => c.modalidad)),
    estandares: uniqueSorted(sanitizedCombinations.map((c) => c.estandar)),
  };
};

const getLocalCatalog = (): B2bCatalogTopic[] =>
  (b2bCatalog as B2bCatalogTopic[]).map((topic) => finalizeTopic(topic));

const getShopifyQuery = (): string =>
  import.meta.env.VITE_B2B_SHOPIFY_QUERY || 'tag:b2b';

let cachedCatalog: B2bCatalogTopic[] | null = null;
let loadPromise: Promise<B2bCatalogTopic[]> | null = null;

const buildTopicsFromShopifyProducts = (products: ShopifyB2bProductNode[]): B2bCatalogTopic[] => {
  const grouped = new Map<string, B2bCatalogTopic>();

  products.forEach((product) => {
    const tema = parsePrefixedTag(product.tags, 'tema') || product.title;
    const categoria =
      parsePrefixedTag(product.tags, 'categoria') ||
      parsePrefixedTag(product.tags, 'category') ||
      product.productType ||
      'Sin categoria';

    const groupHandle = parsePrefixedTag(product.tags, 'tema-handle') || product.handle;

    const combinationsFromVariants = product.variants.edges.map((variantEdge) =>
      toCombinationFromVariant(variantEdge.node.selectedOptions, product.tags)
    );

    const combinations =
      combinationsFromVariants.length > 0
        ? combinationsFromVariants
        : [toCombinationFromVariant(undefined, product.tags)];

    const existing = grouped.get(groupHandle);
    if (!existing) {
      grouped.set(
        groupHandle,
        finalizeTopic({
          tema,
          handle: groupHandle,
          categoria,
          image: product.featuredImage
            ? {
                url: product.featuredImage.url,
                altText: product.featuredImage.altText,
              }
            : undefined,
          cursos_fuente: 1,
          modalidades: [],
          estandares: [],
          combinaciones: combinations,
        })
      );
      return;
    }

    existing.cursos_fuente += 1;
    if (!existing.image && product.featuredImage) {
      existing.image = {
        url: product.featuredImage.url,
        altText: product.featuredImage.altText,
      };
    }
    existing.combinaciones.push(...combinations);
    grouped.set(groupHandle, finalizeTopic(existing));
  });

  return Array.from(grouped.values()).sort((a, b) =>
    a.tema.localeCompare(b.tema, 'es', { sensitivity: 'base' })
  );
};

export const loadB2bCatalogTopics = async (): Promise<B2bCatalogTopic[]> => {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      const data = await storefrontApiRequest(STOREFRONT_B2B_PRODUCTS_QUERY, {
        first: 250,
        query: getShopifyQuery(),
      });

      const edges = (data?.data?.products?.edges ?? []) as Array<{ node: ShopifyB2bProductNode }>;
      const products = edges.map((edge) => edge.node);

      if (products.length > 0) {
        cachedCatalog = buildTopicsFromShopifyProducts(products);
        return cachedCatalog;
      }
    } catch (error) {
      console.error('Error loading B2B catalog from Shopify. Using local fallback.', error);
    }

    cachedCatalog = getLocalCatalog();
    return cachedCatalog;
  })();

  try {
    return await loadPromise;
  } finally {
    loadPromise = null;
  }
};

export const findB2bCatalogByHandle = async (
  handle: string
): Promise<B2bCatalogTopic | null> => {
  const topics = await loadB2bCatalogTopics();
  return topics.find((topic) => topic.handle === handle) ?? null;
};

export const getB2bCatalogCategoriesFromTopics = (
  topics: B2bCatalogTopic[]
): Array<{ label: string; count: number }> => {
  const counter = new Map<string, number>();
  topics.forEach((topic) => {
    counter.set(topic.categoria, (counter.get(topic.categoria) ?? 0) + 1);
  });

  return Array.from(counter.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }));
};

const scoreTopic = (topic: B2bCatalogTopic, query: string): number => {
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

  if (normalizedTitle === normalizedQuery) score += 120;
  if (normalizedTitle.startsWith(normalizedQuery)) score += 70;
  if (normalizedTitle.includes(normalizedQuery)) score += 45;
  if (normalizedHandle.includes(normalizedQuery)) score += 25;
  if (normalizedCategory.includes(normalizedQuery)) score += 10;

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

export const semanticSearchB2bTopics = (
  topics: B2bCatalogTopic[],
  query: string
): B2bCatalogTopic[] => {
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

export const getB2bTopicAvailabilitySummary = (topic: B2bCatalogTopic) => ({
  modalidades: uniqueSorted(topic.combinaciones.map((combination) => combination.modalidad)),
  horas: uniqueSorted(topic.combinaciones.map((combination) => String(combination.horas ?? 'cotizar'))),
  estandares: uniqueSorted(topic.combinaciones.map((combination) => combination.estandar)),
});

export const getRelatedB2bTopics = (
  topics: B2bCatalogTopic[],
  topic: B2bCatalogTopic,
  limit: number = 6
): B2bCatalogTopic[] =>
  topics
    .filter((candidate) => candidate.categoria === topic.categoria && candidate.handle !== topic.handle)
    .sort((a, b) => a.tema.localeCompare(b.tema, 'es', { sensitivity: 'base' }))
    .slice(0, limit);

export const formatB2bHoursLabel = (value: string): string =>
  value === 'cotizar' ? 'Cotizar' : `${value} horas`;
