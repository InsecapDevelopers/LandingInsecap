/**
 * Contenido SEO de las fichas /cursos/:slug (decisiones tarea #8, Fase 2).
 *
 * - Un tema por cada uno de los 61 de shopify_thematic_intermediate.json.
 * - `slug` = handle B2B de Shopify sin el prefijo `curso-` (curso-trabajo-en-altura → trabajo-en-altura).
 * - Horas, modalidades y estándares salen del JSON (combinaciones), no se escriben a mano.
 * - Lo que no tenemos (código SENCE, requisitos, certificado, vigencia, sedes, objetivo y
 *   aprendizajes) queda en null y la ficha lo muestra como pendiente.
 *   TODO: completar por curso con INSECAP (sección 4, punto 1).
 * - Riesgo 13 (fichas delgadas): una ficha es indexable solo si tiene párrafo de respuesta real,
 *   escrito desde datos verificados (contexto de negocio + JSON). Las demás salen con noindex.
 */
import { getJsonCatalogTopics, type JsonCatalogTopic } from '../lib/catalogData';
import { fitDescription } from '../lib/seo-text';
import type { SedeSlug } from './sedes';

/** Fecha de la última revisión de este archivo (se muestra como "Última actualización"). */
export const CURSOS_SEO_ACTUALIZADO = '2026-10-06';

/** Texto visible para datos que faltan. TODO: cada uno se completa con INSECAP (sección 4). */
export const PENDIENTE = 'Por confirmar';

export interface Normativa {
  nombre: string;
  descripcion: string;
}

export interface Faq {
  pregunta: string;
  /** null: respuesta pendiente de validar con INSECAP. */
  respuesta: string | null;
  /** La respuesta incluye datos por confirmar (p. ej. horas dudosas): se muestra, pero no va al JSON-LD. */
  porVerificar?: boolean;
}

export interface CursoArea {
  slug: string;
  nombre: string;
}

export interface HoraCombinacion {
  modalidad: string;
  horas: number;
}

export interface HorasModalidad {
  modalidad: string;
  /** Horas distintas, ordenadas. Vacío si la combinación no trae horas (se cotiza). */
  horas: number[];
}

export interface CursoSeo {
  slug: string;
  tema: JsonCatalogTopic;
  area: CursoArea;
  /** Párrafo de respuesta de 40–60 palabras. null: TODO (y la ficha queda noindex). */
  respuesta: string | null;
  codigoSence: string | null;
  requisitos: string | null;
  certificado: string | null;
  vigencia: string | null;
  sedes: SedeSlug[] | null;
  objetivo: string | null;
  aprendizajes: string[] | null;
  /** Solo normativa chilena vigente y segura; null: TODO. */
  normativa: Normativa[] | null;
  /** Nota sobre horas dudosas del JSON (sección 4, punto 2). */
  horasPorVerificar: string | null;
  /** Combinaciones modalidad/horas dudosas: se muestran con la nota, pero no van al JSON-LD (Fase 4). */
  horasDudosas: HoraCombinacion[];
  faq: Faq[];
  ultimaActualizacion: string;
  indexable: boolean;
}

/** slug (handle B2B sin `curso-`) → handle del tema en shopify_thematic_intermediate.json. */
const SLUG_A_TEMA: Record<string, string> = {
  'aislacion-y-bloqueo-loto': 'aislacion-bloqueo',
  'alta-tension': 'alta-tension',
  'atencion-al-cliente-y-ventas': 'atencion-cliente-ventas',
  autocad: 'autocad',
  'baja-tension': 'baja-tension',
  'bienestar-y-salud-mental': 'bienestar-salud-mental',
  'bodega-logistica-y-abastecimiento': 'gestion-bodega-logistica',
  'bombas-y-compresores': 'bombas-compresores',
  'computacion-e-informatica-general': 'computacion-general',
  'comunicacion-y-trabajo-en-equipo': 'comunicacion-trabajo-equipo',
  'electricidad-industrial': 'electricidad-general',
  'electronica-e-instrumentacion': 'electronica-instrumentacion',
  'equipos-de-proteccion-personal-epp': 'epp-proteccion-personal',
  'ergonomia-y-trastornos-musculoesqueleticos': 'ergonomia-trastornos',
  'espacios-confinados': 'espacios-confinados',
  'explosivos-y-tronadura': 'explosivos-tronadura',
  'formacion-de-instructores-y-relatores': 'formacion-instructores',
  'gases-y-atmosferas-peligrosas': 'gases-atmosferas-peligrosas',
  'gestion-de-calidad-e-iso': 'calidad-iso',
  'gestion-de-proyectos': 'gestion-proyectos',
  'hidraulica-y-neumatica': 'hidraulica-neumatica',
  'incendio-y-emergencias': 'incendio-emergencias',
  'instalaciones-sanitarias-y-agua': 'agua-sanitaria',
  'instrumentos-de-medicion-y-metrologia': 'instrumentos-medicion',
  'izaje-y-cargas-suspendidas': 'izaje-cargas-suspendidas',
  'lean-manufacturing-5s-y-mejora-continua': 'lean-5s-mejora-continua',
  'liderazgo-y-supervision': 'liderazgo',
  'lubricacion-industrial': 'lubricacion',
  'manejo-defensivo-y-conduccion-segura': 'manejo-defensivo',
  'mantenimiento-mecanico': 'mantenimiento-mecanico',
  'mecanica-general-e-industrial': 'mecanica-general',
  'medioambiente-y-sustentabilidad': 'medioambiente',
  'microsoft-excel': 'excel',
  'microsoft-office-word-powerpoint': 'office-word-powerpoint',
  'montaje-y-uso-de-andamios': 'andamios',
  'operacion-de-bulldozer-y-tractores': 'bulldozer',
  'operacion-de-camion': 'camion-general',
  'operacion-de-camion-de-extraccion-y-especial': 'camion-especial',
  'operacion-de-cargador-frontal': 'cargador-frontal',
  'operacion-de-equipos-menores-y-herramientas': 'equipos-menores',
  'operacion-de-grua-horquilla-y-apilador': 'grua-horquilla',
  'operacion-de-grua-pluma': 'grua-pluma',
  'operacion-de-grua-puente': 'grua-puente',
  'operacion-de-grua-torre': 'grua-torre',
  'operacion-de-motoniveladora': 'motoniveladora',
  'operacion-de-motosierra-y-silvicultura': 'motosierra',
  'operacion-de-plataforma-elevadora-tijera-boom': 'plataforma-elevadora',
  'operacion-de-retroexcavadora': 'retroexcavadora',
  'prevencion-de-riesgos-generales': 'prevencion-riesgos-generales',
  'primeros-auxilios': 'primeros-auxilios',
  'procesos-mineros': 'mineria-procesos',
  sap: 'sap',
  'seguridad-y-prevencion-otros': 'seguridad-prevencion-otros',
  'soldadura-industrial': 'soldadura',
  'tableros-y-distribucion-electrica': 'tableros-electricos',
  'tecnicas-de-rescate': 'rescate',
  'termografia-industrial': 'termografia',
  topografia: 'topografia',
  'trabajo-en-altura': 'trabajo-en-altura',
  'trabajos-en-caliente': 'trabajos-en-caliente',
  'ventilacion-en-mineria-subterranea': 'ventilacion-minera',
};

/** Temas de relleno: noindex aunque algún día tengan párrafo (decisión Fase 2). */
const NOINDEX_SLUGS = new Set(['seguridad-y-prevencion-otros', 'computacion-e-informatica-general']);

/**
 * Párrafos de respuesta (40–60 palabras). Solo para los cursos más demandados del contexto de
 * negocio que tienen tema propio; cada dato sale del contexto (acreditaciones) o del JSON
 * (modalidades, horas y estándares). TODO: los 54 temas restantes (sección 4, punto 1).
 */
const RESPUESTAS: Record<string, string> = {
  'trabajo-en-altura':
    'Trabajo en Altura es uno de los cursos más demandados de INSECAP, OTEC acreditada por SENCE y por Codelco. Se dicta para empresas en modalidad presencial, e-learning sincrónico y e-learning asincrónico, desde 2 horas, en versión genérica o con el estándar de compañías mineras como Codelco, Minera Escondida, Collahuasi, BHP Spence y Antofagasta Minerals.',
  'manejo-defensivo-y-conduccion-segura':
    'Manejo Defensivo y Conducción Segura es una de las áreas más demandadas de INSECAP, OTEC acreditada por SENCE y por Codelco. Se dicta para empresas en modalidad presencial, e-learning sincrónico y e-learning asincrónico, con cargas de 2 a 40 horas, en versión genérica o con estándar Codelco, y se cotiza según la modalidad, la carga horaria y el estándar.',
  'aislacion-y-bloqueo-loto':
    'Aislación y Bloqueo (LOTO) es uno de los cursos más demandados de INSECAP, OTEC acreditada por SENCE y por Codelco. Se dicta para empresas en modalidad presencial, e-learning sincrónico y e-learning asincrónico, con cargas de 4 a 8 horas, en versión genérica o con estándar Codelco, y se cotiza según la modalidad, la carga horaria y el estándar.',
  'espacios-confinados':
    'Espacios Confinados es uno de los cursos más demandados de INSECAP, OTEC acreditada por SENCE y por Codelco. Se dicta para empresas en modalidad presencial, e-learning sincrónico y e-learning asincrónico, con cargas de 4 a 16 horas, en versión genérica o con el estándar de Codelco, Minera Escondida o BHP Spence, y se cotiza para cada empresa.',
  'montaje-y-uso-de-andamios':
    'Montaje y Uso de Andamios es uno de los cursos más demandados de INSECAP, OTEC acreditada por SENCE y por Codelco. Se dicta para empresas en modalidad presencial, e-learning sincrónico y e-learning asincrónico, con cargas de 4 a 16 horas, en versión genérica o con el estándar de Codelco, Collahuasi o Minera Escondida, y se cotiza para cada empresa.',
  'operacion-de-grua-horquilla-y-apilador':
    'Operación de Grúa Horquilla y Apilador es una de las áreas más demandadas de INSECAP, que también dicta la recertificación de operadores. Como OTEC acreditada por SENCE y por Codelco, ofrece el curso a empresas en modalidad presencial, e-learning sincrónico y e-learning asincrónico, desde 2 horas, en versión genérica o con estándar Codelco.',
  'primeros-auxilios':
    'Primeros Auxilios es uno de los cursos más demandados de INSECAP, OTEC acreditada por SENCE y por Codelco. Se dicta para empresas en modalidad presencial, e-learning sincrónico y e-learning asincrónico, con cargas de 4 a 16 horas, y se cotiza según la modalidad, la carga horaria y las necesidades de cada organización.',
};

/**
 * Cursos más demandados del contexto de negocio que tienen tema propio en el catálogo.
 * TODO: Sustancias Peligrosas y Riesgos Eléctricos NFPA 70E no tienen tema propio (sección 4, punto 3).
 */
export const CURSOS_MAS_DEMANDADOS = [
  'trabajo-en-altura',
  'manejo-defensivo-y-conduccion-segura',
  'aislacion-y-bloqueo-loto',
  'espacios-confinados',
  'montaje-y-uso-de-andamios',
  'operacion-de-grua-horquilla-y-apilador',
  'primeros-auxilios',
];

/**
 * Horas del JSON que hay que verificar con INSECAP (sección 4, punto 2). `combinaciones`: las
 * dudosas; si no se indica, todas las horas del tema lo son.
 */
const HORAS_POR_VERIFICAR: Record<string, { nota: string; combinaciones?: HoraCombinacion[] }> = {
  // TODO: verificar la combinación e-learning asincrónico de 150 h.
  'trabajo-en-altura': {
    nota: 'La combinación e-learning asincrónico de 150 horas está por confirmar.',
    combinaciones: [{ modalidad: 'E-learning Asincrónico', horas: 150 }],
  },
  // TODO: las horas del JSON y las de Shopify no coinciden en estos temas.
  'seguridad-y-prevencion-otros': { nota: 'Las horas del catálogo y las de la tienda no coinciden: por confirmar.' },
  'comunicacion-y-trabajo-en-equipo': { nota: 'Las horas del catálogo y las de la tienda no coinciden: por confirmar.' },
};

// Normativa chilena vigente, citada solo como marco general (no como contenido del curso).
// TODO: normativa específica de cada curso validada por INSECAP (sección 4, punto 1).
const LEY_16744: Normativa = {
  nombre: 'Ley 16.744',
  descripcion: 'Seguro social obligatorio contra riesgos de accidentes del trabajo y enfermedades profesionales.',
};
const DS_44_2024: Normativa = {
  nombre: 'DS 44/2024, Ministerio del Trabajo y Previsión Social',
  descripcion: 'Reglamento sobre gestión preventiva de los riesgos laborales para un entorno de trabajo seguro y saludable.',
};
const DS_594: Normativa = {
  nombre: 'DS 594/1999, Ministerio de Salud',
  descripcion: 'Reglamento sobre condiciones sanitarias y ambientales básicas en los lugares de trabajo.',
};
const DS_132: Normativa = {
  nombre: 'DS 132/2002, Ministerio de Minería',
  descripcion: 'Reglamento de Seguridad Minera.',
};
const LEY_18290: Normativa = {
  nombre: 'Ley 18.290',
  descripcion: 'Ley de Tránsito.',
};
const LEY_17798: Normativa = {
  nombre: 'Ley 17.798',
  descripcion: 'Ley sobre control de armas, que también regula los explosivos.',
};

const AREA_SEGURIDAD = 'Seguridad y Prevención de Riesgos';
const NORMATIVA_SEGURIDAD = [LEY_16744, DS_44_2024, DS_594];

const NORMATIVA_POR_SLUG: Record<string, Normativa[]> = {
  'manejo-defensivo-y-conduccion-segura': [...NORMATIVA_SEGURIDAD, LEY_18290],
  'explosivos-y-tronadura': [...NORMATIVA_SEGURIDAD, LEY_17798, DS_132],
  'procesos-mineros': [DS_132],
  'ventilacion-en-mineria-subterranea': [DS_132],
};

export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const ESTANDAR_SIN_ESPECIFICAR = 'Estándar (sin especificar)';

/** Estándares para mostrar (sin el valor de relleno "Estándar (sin especificar)"). */
export const getEstandaresVisibles = (tema: JsonCatalogTopic): string[] =>
  tema.estandares.filter((estandar) => estandar !== ESTANDAR_SIN_ESPECIFICAR);

/** Horas por modalidad desde las combinaciones del JSON. */
export const getHorasPorModalidad = (tema: JsonCatalogTopic): HorasModalidad[] =>
  tema.modalidades.map((modalidad) => ({
    modalidad,
    horas: Array.from(
      new Set(
        tema.combinaciones
          .filter((combinacion) => combinacion.modalidad === modalidad && combinacion.horas !== null)
          .map((combinacion) => combinacion.horas as number),
      ),
    ).sort((a, b) => a - b),
  }));

/** "4 a 16 horas", "8 horas" o null si no hay horas en el JSON. */
export const getRangoHoras = (tema: JsonCatalogTopic): string | null => {
  const horas = tema.combinaciones
    .map((combinacion) => combinacion.horas)
    .filter((value): value is number => value !== null);
  if (horas.length === 0) return null;
  const min = Math.min(...horas);
  const max = Math.max(...horas);
  return min === max ? `${min} horas` : `${min} a ${max} horas`;
};

export const formatHoras = (horas: number[]): string =>
  horas.length === 0 ? 'A cotizar' : `${horas.join(', ')} h`;

/** "a, b y c" */
export const listarNombres = (items: string[]): string =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;

const listar = (items: string[]): string => listarNombres(items.map((item) => item.toLowerCase()));

/** FAQ desde datos del JSON (modalidades, horas, estándares). La de SENCE queda pendiente. */
const buildFaq = (tema: JsonCatalogTopic, horasDudosas: boolean): Faq[] => {
  const nombre = tema.tema;
  const horas = getHorasPorModalidad(tema)
    .filter((item) => item.horas.length > 0)
    .map((item) => `${item.modalidad.toLowerCase()}: ${item.horas.join(', ')} horas`);
  const estandares = getEstandaresVisibles(tema).filter((estandar) => estandar !== 'Genérico');

  return [
    {
      pregunta: `¿En qué modalidades se dicta el curso de ${nombre}?`,
      respuesta: `INSECAP dicta ${nombre} para empresas en modalidad ${listar(tema.modalidades)}.`,
    },
    {
      pregunta: `¿Cuántas horas dura el curso de ${nombre}?`,
      respuesta: horas.length > 0
        ? `Depende de la modalidad y del estándar requerido. Cargas disponibles: ${horas.join('; ')}.`
        : null,
      porVerificar: horasDudosas,
    },
    {
      // TODO: confirmar que todos los estándares del JSON se pueden publicar (p. ej. "Piloto DUA").
      pregunta: `¿Hay versiones de ${nombre} según el estándar de cada cliente?`,
      respuesta: estandares.length > 0
        ? `Sí. Además de la versión genérica, hay versiones con estándar ${listarNombres(estandares)}.`
        : `Hoy se ofrece en versión genérica, que se adapta a los lineamientos de cada empresa al cotizar.`,
    },
    {
      // TODO: código SENCE por curso (sección 4, punto 1).
      pregunta: `¿El curso de ${nombre} se puede usar con franquicia SENCE?`,
      respuesta: null,
    },
  ];
};

const temasPorHandle = new Map(getJsonCatalogTopics().map((tema) => [tema.handle, tema]));

export const cursoAreas: CursoArea[] = Array.from(new Set(getJsonCatalogTopics().map((tema) => tema.categoria)))
  .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
  .map((nombre) => ({ slug: slugify(nombre), nombre }));

const areaPorNombre = new Map(cursoAreas.map((area) => [area.nombre, area]));

export const cursosSeo: CursoSeo[] = Object.entries(SLUG_A_TEMA)
  .map(([slug, temaHandle]) => {
    const tema = temasPorHandle.get(temaHandle);
    if (!tema) {
      throw new Error(`[cursos-seo] El tema ${temaHandle} (${slug}) no existe en shopify_thematic_intermediate.json`);
    }
    const respuesta = RESPUESTAS[slug] ?? null;
    const porVerificar = HORAS_POR_VERIFICAR[slug];
    const horasDudosas = porVerificar
      ? porVerificar.combinaciones ?? getHorasPorModalidad(tema)
        .flatMap((item) => item.horas.map((horas) => ({ modalidad: item.modalidad, horas })))
      : [];
    for (const dudosa of horasDudosas) {
      if (!tema.combinaciones.some((c) => c.modalidad === dudosa.modalidad && c.horas === dudosa.horas)) {
        throw new Error(`[cursos-seo] ${slug}: la combinación dudosa ${dudosa.modalidad} ${dudosa.horas} h no está en el JSON`);
      }
    }

    return {
      slug,
      tema,
      area: areaPorNombre.get(tema.categoria) as CursoArea,
      respuesta,
      codigoSence: null,
      requisitos: null,
      certificado: null,
      vigencia: null,
      sedes: null,
      objetivo: null,
      aprendizajes: null,
      normativa: NORMATIVA_POR_SLUG[slug] ?? (tema.categoria === AREA_SEGURIDAD ? NORMATIVA_SEGURIDAD : null),
      horasPorVerificar: porVerificar?.nota ?? null,
      horasDudosas,
      faq: buildFaq(tema, horasDudosas.length > 0),
      ultimaActualizacion: CURSOS_SEO_ACTUALIZADO,
      indexable: respuesta !== null && !NOINDEX_SLUGS.has(slug),
    };
  })
  .sort((a, b) => a.tema.tema.localeCompare(b.tema.tema, 'es', { sensitivity: 'base' }));

const cursosPorSlug = new Map(cursosSeo.map((curso) => [curso.slug, curso]));

export const getCursoSeo = (slug: string | undefined): CursoSeo | null =>
  (slug ? cursosPorSlug.get(slug) : undefined) ?? null;

/** false para slugs desconocidos (p. ej. productos `ea-*` que caen en /cursos/:slug). */
export const isCursoSeoIndexable = (slug: string | undefined): boolean => getCursoSeo(slug)?.indexable ?? false;

export const getCursoArea = (slug: string | undefined): CursoArea | null =>
  cursoAreas.find((area) => area.slug === slug) ?? null;

export const getCursosByArea = (areaSlug: string): CursoSeo[] =>
  cursosSeo.filter((curso) => curso.area.slug === areaSlug);

/** Cursos de la misma área, primero los indexables (los que tienen contenido real). */
export const getRelatedCursos = (curso: CursoSeo, limit = 3): CursoSeo[] =>
  getCursosByArea(curso.area.slug)
    .filter((candidato) => candidato.slug !== curso.slug)
    .sort((a, b) => Number(b.indexable) - Number(a.indexable))
    .slice(0, limit);

/** Modalidades de los cursos de un área, en minúscula y orden alfabético. */
export const getModalidadesArea = (cursos: CursoSeo[]): string[] =>
  Array.from(new Set(cursos.flatMap((curso) => curso.tema.modalidades)))
    .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
    .map((modalidad) => modalidad.toLowerCase());

/**
 * Cierres de la description de fichas y categorías, del más largo al más corto: fitDescription
 * usa los que caben para quedar en 140–155 (en es también en /en y /pt, porque el contenido de
 * estas páginas está en español).
 */
const CIERRES_DESCRIPTION = [
  'Cotiza con INSECAP, OTEC acreditada por SENCE y por Codelco.',
  'Cotiza con INSECAP, OTEC acreditada por SENCE.',
  'Cotiza con INSECAP, OTEC SENCE.',
  'Cotiza con INSECAP.',
  'OTEC SENCE.',
];

/**
 * Title (keyword, sin marca) y description (140–155) de una ficha (Fase 3). SEO.tsx agrega
 * " | INSECAP" al title. Solo con datos del JSON y del contexto de negocio.
 */
export const getCursoSeoMeta = (curso: CursoSeo) => {
  const rango = getRangoHoras(curso.tema);
  return {
    title: `Curso de ${curso.tema.tema}`,
    description: fitDescription(
      `Curso de ${curso.tema.tema} para empresas en Chile, en modalidad ${listar(curso.tema.modalidades)}${rango ? `, de ${rango}` : ''}.`,
      CIERRES_DESCRIPTION,
    ),
  };
};

/** Title y description de una categoría (/cursos/categoria/:area). */
export const getAreaSeoMeta = (area: CursoArea) => {
  const cursos = getCursosByArea(area.slug);
  return {
    title: `Cursos de ${area.nombre}`,
    description: fitDescription(
      `${cursos.length} cursos de ${area.nombre} para empresas en Chile, en modalidad ${listarNombres(getModalidadesArea(cursos))}.`,
      CIERRES_DESCRIPTION,
    ),
  };
};
