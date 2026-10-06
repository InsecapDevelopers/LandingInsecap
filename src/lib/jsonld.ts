/**
 * JSON-LD del sitio (Fases 1 y 4, tarea #8): un grafo schema.org con @id estables.
 *
 * - Global, en todas las páginas (RouteMeta, AppShell.tsx): la organización (#org) y el sitio (#website).
 * - Por página, con el prop `jsonLd` de <SEO>: Course + FAQPage en las fichas, la sede (#place),
 *   FAQPage en /preguntas-frecuentes y NewsArticle en las noticias. BreadcrumbList lo emite
 *   PageHero junto al breadcrumb visible.
 * - El prerender (entry-server.tsx → mergeJsonLdScripts) junta todos los bloques de la página en un
 *   solo <script type="application/ld+json"> con @graph. scripts/check-dist.mjs valida que parsee,
 *   que cada @id referenciado exista y que no lleve "TODO" ni "Por confirmar".
 *
 * Las entidades (curso, sede, noticia) usan la URL /es como @id en los tres idiomas: el contenido
 * de datos solo existe en español (decisión 1.3) y es la misma entidad. El BreadcrumbList usa la
 * URL de la página.
 *
 * No inventar datos: lo que falta se omite (sin offers, geo, horarios ni código SENCE) y queda
 * como TODO aquí o en src/data.
 */
import { SITE_URL } from './locale-routing';
import type { ShopifyArticle } from './shopify';
import type { CursoSeo, Faq } from '../data/cursos-seo';
import type { Sede } from '../data/sedes';

export const ORG_ID = `${SITE_URL}/#org`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

// TODO: logo SVG oficial en el dominio de INSECAP (sección 4, punto 10). Mientras tanto, el
// isotipo PNG que ya sirve el sitio (637×728).
const LOGO = { url: `${SITE_URL}/isotipos/Insecap_Logo-09.png`, width: 637, height: 728 };

export type JsonLdNode = Record<string, unknown>;

const ref = (id: string) => ({ '@id': id });

/** URL absoluta de una ruta del sitio. */
const absolute = (path: string) => `${SITE_URL}${path}`;

const credential = (name: string, extra: JsonLdNode = {}) => ({
  '@type': 'EducationalOccupationalCredential',
  name,
  ...extra,
});

const organization: JsonLdNode = {
  '@type': 'EducationalOrganization',
  '@id': ORG_ID,
  name: 'INSECAP Capacitación',
  alternateName: 'INSECAP',
  url: `${SITE_URL}/es`,
  logo: { '@type': 'ImageObject', ...LOGO },
  // TODO: confirmar el año de fundación. El contexto de negocio dice "OTEC chilena desde 2009" y
  // src/lib/insecapUtils.ts usa FOUNDING_YEAR = 1991; se publica 2009 hasta que INSECAP lo confirme.
  foundingDate: '2009',
  description:
    'OTEC chilena acreditada por SENCE que capacita en seguridad, cumplimiento normativo y continuidad operacional, sobre todo para la gran minería.',
  email: 'contacto@insecap.cl',
  telephone: '+56 55 292 6431',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'La Cascada 1513',
    addressLocality: 'Calama',
    addressRegion: 'Región de Antofagasta',
    addressCountry: 'CL',
  },
  areaServed: { '@type': 'Country', name: 'Chile' },
  knowsAbout: [
    'Capacitación en seguridad laboral',
    'Prevención de riesgos en minería',
    'Trabajo en altura',
    'Manejo defensivo 4x4 en alta montaña',
    'Aislación y bloqueo (LOTO)',
    'Espacios confinados',
    'Manejo seguro de sustancias peligrosas',
    'Armado de andamios',
    'Operación de grúa horquilla',
    'Riesgos eléctricos NFPA 70E',
    'Primeros auxilios',
    'SAP S/4HANA PM',
  ],
  hasCredential: [
    credential('OTEC acreditada por SENCE, Resolución N° 12208', {
      credentialCategory: 'Acreditación',
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Servicio Nacional de Capacitación y Empleo (SENCE)',
        url: 'https://sence.gob.cl',
      },
    }),
    credential('NCh 2728:2015', { credentialCategory: 'Certificación' }),
    credential('ISO 9001:2015', { credentialCategory: 'Certificación' }),
    // Solo como texto: sin una entidad verificable que enlazar.
    credential('OTEC acreditada por Codelco', { credentialCategory: 'Acreditación' }),
    credential('Sello del Consejo de Competencias Mineras (CCM)', { credentialCategory: 'Sello' }),
  ],
  memberOf: [
    { '@type': 'Organization', name: 'Cámara de Comercio de Santiago (CCS)' },
    { '@type': 'Organization', name: 'SICEP' },
  ],
  // Solo perfiles confirmados en el contexto de negocio.
  // TODO: agregar LinkedIn, Facebook y TikTok cuando INSECAP confirme las URL oficiales
  // (el Footer enlaza facebook.com/insecap y linkedin.com/company/insecap sin verificar, y TikTok
  // sin perfil). TODO: confirmar que x.com/insecap es la cuenta oficial (sección 4, punto 9).
  sameAs: [
    'https://www.instagram.com/insecapcapacitacion/',
    'https://x.com/insecap',
  ],
};

const website: JsonLdNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: 'INSECAP Capacitación',
  publisher: ref(ORG_ID),
  inLanguage: ['es-CL', 'en', 'pt'],
};

// ---------- Grafo y serialización ----------

/** Aplana bloques JSON-LD (nodo, arreglo o {@context, @graph}) en nodos sin @context. */
const flattenJsonLd = (input: unknown): JsonLdNode[] => {
  if (Array.isArray(input)) return input.flatMap(flattenJsonLd);
  if (!input || typeof input !== 'object') return [];
  const { '@context': _context, '@graph': graph, ...node } = input as JsonLdNode;
  if (Array.isArray(graph)) return graph.flatMap(flattenJsonLd);
  return Object.keys(node).length > 0 ? [node] : [];
};

/** Un solo grafo: los nodos con el mismo @id se combinan (el último gana en cada propiedad). */
export const toJsonLdGraph = (input: unknown) => {
  const byId = new Map<string, JsonLdNode>();
  const nodes: JsonLdNode[] = [];
  for (const node of flattenJsonLd(input)) {
    const id = node['@id'];
    const existing = typeof id === 'string' ? byId.get(id) : undefined;
    if (existing) {
      Object.assign(existing, node);
      continue;
    }
    const copy = { ...node };
    if (typeof id === 'string') byId.set(id, copy);
    nodes.push(copy);
  }
  return { '@context': 'https://schema.org', '@graph': nodes };
};

/** JSON seguro dentro de <script>: sin `<` (evita </script> y <!--) ni separadores de línea de JS. */
export const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

/** Grafo global serializado (#org y #website), seguro dentro de <script>. */
export const siteJsonLd = serializeJsonLd(toJsonLdGraph([organization, website]));

const LD_JSON_SCRIPT = /<script\b[^>]*\btype="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;

/**
 * Prerender: junta los <script type="application/ld+json"> que emitió react-helmet-async (global,
 * página y breadcrumb) en uno solo con @graph. Lleva data-rh para que Helmet lo reemplace al
 * hidratar en vez de duplicarlo. Lanza si un bloque no es JSON válido (el build falla).
 */
export const mergeJsonLdScripts = (scriptsHtml: string): string => {
  const blocks = [...scriptsHtml.matchAll(LD_JSON_SCRIPT)].map(([, json]) => JSON.parse(json));
  const rest = scriptsHtml.replace(LD_JSON_SCRIPT, '').trim();
  if (blocks.length === 0) return rest;
  const merged = `<script data-rh="true" type="application/ld+json">${serializeJsonLd(toJsonLdGraph(blocks))}</script>`;
  return rest ? `${rest}\n    ${merged}` : merged;
};

// ---------- Fechas ----------

const SANTIAGO = 'America/Santiago';

/** Desfase de America/Santiago en minutos para un instante UTC (−180 en verano, −240 en invierno). */
const santiagoOffsetMinutes = (utcMs: number): number => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SANTIAGO,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const wallAsUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return Math.round((wallAsUtc - Math.floor(utcMs / 1000) * 1000) / 60000);
};

const formatOffset = (minutes: number) => {
  const abs = Math.abs(minutes);
  return `${minutes < 0 ? '-' : '+'}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
};

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Fecha ISO 8601 con el desfase de America/Santiago (decisión 1.6). `publicadoEn` del TMS Plus
 * llega sin zona horaria y se interpreta como hora de Chile (TODO: confirmarlo con TMS Plus).
 * Si ya trae zona, se expresa en hora de Chile. Una fecha sin hora queda igual.
 */
export const toSantiagoIso = (value: string): string => {
  const trimmed = value.trim();
  const naive = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/);
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  if (naive) {
    const [, y, mo, d, h, mi, s = '00'] = naive;
    const wallMs = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s);
    // El desfase depende del instante: se estima con la hora local y se corrige si cruza un cambio de horario.
    let offset = santiagoOffsetMinutes(wallMs);
    offset = santiagoOffsetMinutes(wallMs - offset * 60000);
    return `${y}-${mo}-${d}T${h}:${mi}:${s}${formatOffset(offset)}`;
  }

  const utcMs = Date.parse(trimmed);
  if (Number.isNaN(utcMs)) return trimmed;
  const offset = santiagoOffsetMinutes(utcMs);
  const wall = new Date(Math.floor(utcMs / 1000) * 1000 + offset * 60000);
  return `${wall.getUTCFullYear()}-${pad(wall.getUTCMonth() + 1)}-${pad(wall.getUTCDate())}T${pad(wall.getUTCHours())}:${pad(wall.getUTCMinutes())}:${pad(wall.getUTCSeconds())}${formatOffset(offset)}`;
};

// ---------- Nodos por página ----------

export interface BreadcrumbJsonLdItem {
  name: string;
  /** Ruta con idioma (/es/cursos). Sin path: el elemento se omite, salvo el último (página actual). */
  path?: string;
}

/** BreadcrumbList del breadcrumb visible; el último elemento es la página actual (`currentPath`). */
export const buildBreadcrumbJsonLd = (items: BreadcrumbJsonLdItem[], currentPath: string): JsonLdNode => {
  const listed = items
    .map((item, index) => (index === items.length - 1 ? { ...item, path: currentPath } : item))
    .filter((item): item is Required<BreadcrumbJsonLdItem> => Boolean(item.path));

  return {
    '@type': 'BreadcrumbList',
    '@id': `${absolute(currentPath)}#breadcrumb`,
    itemListElement: listed.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
};

export const sedePlaceId = (slug: string) => absolute(`/es/sedes/${slug}#place`);

/** Sede física: NAP de src/data/sedes.ts. geo y horario solo si existen (hoy son TODO). */
export const buildSedeJsonLd = (sede: Sede): JsonLdNode => ({
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': sedePlaceId(sede.slug),
  name: `INSECAP ${sede.nombre}`,
  url: absolute(`/es/sedes/${sede.slug}`),
  image: LOGO.url,
  telephone: sede.telefonoE164,
  email: sede.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: sede.direccion,
    addressLocality: sede.ciudad,
    addressRegion: sede.region,
    addressCountry: 'CL',
  },
  ...(sede.geo ? { geo: { '@type': 'GeoCoordinates', latitude: sede.geo.lat, longitude: sede.geo.lng } } : {}),
  // TODO: openingHoursSpecification cuando exista el horario estructurado de cada sede
  // (sección 4, punto 5). Hoy `horario` es null en todas.
  parentOrganization: ref(ORG_ID),
});

/** Modalidad del catálogo → courseMode de schema.org. Una modalidad nueva hace fallar el build. */
const COURSE_MODE: Record<string, string> = {
  presencial: 'onsite',
  'e-learning sincrónico': 'online',
  'e-learning asincrónico': 'online',
  semipresencial: 'blended',
};

const courseModeOf = (modalidad: string): string => {
  const mode = COURSE_MODE[modalidad.toLowerCase()];
  if (!mode) throw new Error(`[jsonld] Modalidad sin courseMode: "${modalidad}" (agregarla en COURSE_MODE)`);
  return mode;
};

export const courseId = (slug: string) => absolute(`/es/cursos/${slug}#course`);
export const courseFaqId = (slug: string) => absolute(`/es/cursos/${slug}#faq`);

/**
 * Course de una ficha: una CourseInstance por modalidad y carga horaria real del catálogo
 * (courseWorkload ISO 8601), sin las combinaciones dudosas. Sin offers (ecommerce apagado) y sin
 * código SENCE ni certificado mientras sean TODO.
 */
export const buildCourseJsonLd = (curso: CursoSeo, description: string): JsonLdNode => {
  const { tema } = curso;
  const dudosa = (modalidad: string, horas: number) =>
    curso.horasDudosas.some((item) => item.modalidad === modalidad && item.horas === horas);

  const instances = tema.modalidades.flatMap((modalidad) => {
    const courseMode = courseModeOf(modalidad);
    const horas = Array.from(new Set(
      tema.combinaciones
        .filter((c) => c.modalidad === modalidad && c.horas !== null && !dudosa(modalidad, c.horas))
        .map((c) => c.horas as number),
    )).sort((a, b) => a - b);
    const base = { '@type': 'CourseInstance', name: `${tema.tema}: ${modalidad}`, courseMode, inLanguage: 'es' };
    return horas.length > 0
      ? horas.map((h) => ({ ...base, name: `${tema.tema}: ${modalidad}, ${h} horas`, courseWorkload: `PT${h}H` }))
      : [base];
  });

  return {
    '@type': 'Course',
    '@id': courseId(curso.slug),
    name: `Curso de ${tema.tema}`,
    description,
    url: absolute(`/es/cursos/${curso.slug}`),
    provider: ref(ORG_ID),
    inLanguage: 'es',
    ...(curso.codigoSence ? { courseCode: curso.codigoSence } : {}),
    ...(curso.certificado
      ? { educationalCredentialAwarded: { '@type': 'EducationalOccupationalCredential', name: curso.certificado } }
      : {}),
    ...(curso.aprendizajes ? { teaches: curso.aprendizajes } : {}),
    hasCourseInstance: instances,
  };
};

/**
 * FAQPage solo con preguntas que tienen respuesta real: sin las pendientes (null) ni las que
 * dependen de datos por confirmar. null si no queda ninguna.
 */
export const buildFaqJsonLd = (faq: Faq[], id: string): JsonLdNode | null => {
  const answered = faq.filter((item) => item.respuesta && !item.porVerificar);
  if (answered.length === 0) return null;
  return {
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: answered.map((item) => ({
      '@type': 'Question',
      name: item.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: item.respuesta },
    })),
  };
};

/** Autor de una noticia: la persona que entrega el API o, si no viene, la organización. */
export const articleAuthor = (article: ShopifyArticle) =>
  article.authorV2?.name ? { '@type': 'Person', name: article.authorV2.name } : ref(ORG_ID);

/** NewsArticle de una noticia del TMS Plus, con fechas en hora de Chile y el autor del API. */
export const buildNewsArticleJsonLd = (article: ShopifyArticle, description: string): JsonLdNode => {
  const url = absolute(`/es/noticias/${article.handle}`);
  return {
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    headline: article.title,
    description,
    ...(article.image?.url ? { image: [article.image.url] } : {}),
    datePublished: toSantiagoIso(article.publishedAt),
    dateModified: toSantiagoIso(article.updatedAt ?? article.publishedAt),
    author: articleAuthor(article),
    publisher: ref(ORG_ID),
    mainEntityOfPage: url,
    url,
    isPartOf: ref(WEBSITE_ID),
    inLanguage: 'es-CL',
  };
};
