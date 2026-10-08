/**
 * Contenido SEO de las fichas /cursos/:slug (decisiones tarea #8, Fase 2). Solo lo importan las
 * páginas de cursos: lo liviano que usa el bundle principal está en cursos-base.ts.
 *
 * - Un tema por cada uno de los 61 de src/data/cursos.json (catálogo de DB_SGC, ver docs/catalogo-cursos.md).
 * - `slug` = URL pública de la ficha (SLUG_A_TEMA en cursos-base.ts); coincide con los handles antiguos
 *   sin `curso-`, así las URLs ya publicadas redirigen 1:1 (legacy-redirects.ts).
 * - Horas, modalidades, estándares y SENCE salen del JSON; objetivo, aprendizajes, normativa y el
 *   enfoque del párrafo de respuesta, de las fichas R11 (src/data/cursos-contenido.json).
 * - Toda ficha tiene párrafo de respuesta (buildRespuesta) y es indexable, salvo los temas de relleno
 *   (NOINDEX_SLUGS).
 */
import { getJsonCatalogTopics, type JsonCatalogTopic } from '../lib/catalogData';
import contenidoCursos from './cursos-contenido.json';
import { formatHora, NOINDEX_SLUGS, SLUG_A_TEMA } from './cursos-base';

export { CURSO_SLUGS, formatHora, isCursoSeoIndexable, PENDIENTE } from './cursos-base';
import { fitDescription } from '../lib/seo-text';



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
  /** Párrafo de respuesta de 40–60 palabras, armado con los datos del tema (buildRespuesta). */
  respuesta: string;
  objetivo: string | null;
  aprendizajes: string[] | null;
  /** Normas citadas en las fichas R11 del tema; null: ninguna (la ficha no muestra la sección). */
  normativa: Normativa[] | null;
  /** Nota sobre horas dudosas del JSON (sección 4, punto 2). */
  horasPorVerificar: string | null;
  /** Combinaciones modalidad/horas dudosas: se muestran con la nota, pero no van al JSON-LD (Fase 4). */
  horasDudosas: HoraCombinacion[];
  faq: Faq[];
  indexable: boolean;
}



/** Contenido de cada tema sacado de las fichas R11 de DB_SGC (docs/catalogo-cursos.md). */
interface ContenidoCurso {
  /** Qué enseña: completa "<tema> es un curso de INSECAP …, que <enfoque>". */
  enfoque: string;
  objetivo: string | null;
  aprendizajes: string[];
  /** Solo normas citadas en las fichas de los cursos del tema. */
  normativa: Normativa[];
}
const CONTENIDO = contenidoCursos as Record<string, ContenidoCurso>;

const contarPalabras = (texto: string) => texto.split(/\s+/).filter((palabra) => /[\p{L}\p{N}]/u.test(palabra)).length;

/**
 * Párrafo de respuesta (40–60 palabras con INSECAP, OTEC, ciudad y acreditaciones; lo exige
 * scripts/check-dist.mjs). Se arma con los datos del catálogo para que no se desfase cuando cambien
 * horas o estándares: prueba de la variante más completa a la más corta y se queda con la primera
 * que cae en el rango. Lanza en el build si ninguna cabe.
 */
const buildRespuesta = (tema: JsonCatalogTopic, enfoque: string, masDemandado: boolean): string => {
  const sujeto = masDemandado ? 'uno de los cursos más demandados de INSECAP' : 'un curso de INSECAP';
  const intro = `${tema.tema} es ${sujeto}, OTEC de Calama acreditada por SENCE y Codelco, que ${enfoque}.`;
  const rango = getRangoHorasDesde(tema);
  const dictado = `Se dicta para empresas en modalidad ${listar(tema.modalidades)}${rango ? `, ${rango.charAt(0).toLowerCase()}${rango.slice(1)}` : ''}`;
  const estandares = getEstandaresVisibles(tema).filter((estandar) => estandar !== 'Genérico').slice(0, 3);
  const conEstandar = estandares.length > 0 ? `, en versión genérica o con estándar ${listarNombres(estandares)}` : '';
  const cierre = ', y se cotiza según la modalidad, la carga horaria y el estándar';
  const variantes = [conEstandar + cierre, conEstandar, cierre, ''].map((resto) => `${intro} ${dictado}${resto}.`);
  const respuesta = variantes.find((texto) => contarPalabras(texto) >= 40 && contarPalabras(texto) <= 60);
  if (!respuesta) {
    throw new Error(`[cursos-seo] ${tema.handle}: ningún párrafo de respuesta queda entre 40 y 60 palabras (${variantes.map(contarPalabras).join(', ')})`);
  }
  return respuesta;
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
  // TODO: "Otros" agrupa cursos muy distintos y no se pudo contrastar con DB_SGC (docs/catalogo-cursos.md).
  'seguridad-y-prevencion-otros': { nota: 'Las horas de este grupo de cursos están por confirmar.' },
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
  return min === max ? `${formatHora(min)} horas` : `${formatHora(min)} a ${formatHora(max)} horas`;
};

/** "Desde 4,5 hasta 44 horas", "8 horas" o null si no hay horas en el JSON (ficha del curso). */
export const getRangoHorasDesde = (tema: JsonCatalogTopic): string | null => {
  const horas = tema.combinaciones
    .map((combinacion) => combinacion.horas)
    .filter((value): value is number => value !== null);
  if (horas.length === 0) return null;
  const min = Math.min(...horas);
  const max = Math.max(...horas);
  return min === max ? `${formatHora(min)} horas` : `Desde ${formatHora(min)} hasta ${formatHora(max)} horas`;
};

/** "a, b y c" */
export const listarNombres = (items: string[]): string =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;

const listar = (items: string[]): string => listarNombres(items.map((item) => item.toLowerCase()));

/** FAQ desde datos del JSON (modalidades, horas, estándares). La de SENCE queda pendiente. */
const buildFaq = (tema: JsonCatalogTopic, horasDudosas: boolean): Faq[] => {
  const nombre = tema.tema;
  const horas = getHorasPorModalidad(tema)
    .filter((item) => item.horas.length > 0)
    .map((item) => `${item.modalidad.toLowerCase()}: ${item.horas.map(formatHora).join('; ')} horas`);
  const estandares = getEstandaresVisibles(tema).filter((estandar) => estandar !== 'Genérico');
  const rango = getRangoHorasDesde(tema);

  return [
    {
      pregunta: `¿En qué modalidades se dicta el curso de ${nombre}?`,
      respuesta: `INSECAP dicta ${nombre} para empresas en modalidad ${listar(tema.modalidades)}.`,
    },
    {
      pregunta: `¿Cuántas horas dura el curso de ${nombre}?`,
      respuesta: rango
        ? `${rango}, según la modalidad y el estándar que requiera la empresa (${horas.join('; ')}).`
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
      // tema.sence: algún curso vigente del tema tiene código SENCE en DB_SGC.
      pregunta: `¿El curso de ${nombre} se puede usar con franquicia SENCE?`,
      respuesta: tema.sence
        ? `Sí. INSECAP es OTEC acreditada por SENCE y ${nombre} tiene versiones con código SENCE, que la empresa puede imputar a la franquicia tributaria.`
        : `El uso de la franquicia SENCE para ${nombre} está sujeto a cotización: se revisa con la empresa según la versión del curso que necesite.`,
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
      throw new Error(`[cursos-seo] El tema ${temaHandle} (${slug}) no existe en src/data/cursos.json`);
    }
    const contenido = CONTENIDO[temaHandle];
    if (!contenido) throw new Error(`[cursos-seo] ${temaHandle} no tiene contenido en src/data/cursos-contenido.json`);
    const respuesta = buildRespuesta(tema, contenido.enfoque, CURSOS_MAS_DEMANDADOS.includes(slug));
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
      objetivo: contenido.objetivo,
      aprendizajes: contenido.aprendizajes.length > 0 ? contenido.aprendizajes : null,
      normativa: contenido.normativa.length > 0 ? contenido.normativa : null,
      horasPorVerificar: porVerificar?.nota ?? null,
      horasDudosas,
      faq: buildFaq(tema, horasDudosas.length > 0),
      indexable: !NOINDEX_SLUGS.has(slug),
    };
  })
  .sort((a, b) => a.tema.tema.localeCompare(b.tema.tema, 'es', { sensitivity: 'base' }));

const cursosPorSlug = new Map(cursosSeo.map((curso) => [curso.slug, curso]));

export const getCursoSeo = (slug: string | undefined): CursoSeo | null =>
  (slug ? cursosPorSlug.get(slug) : undefined) ?? null;

/** false para slugs desconocidos (p. ej. productos `ea-*` que caen en /cursos/:slug). */

export const getCursoArea = (slug: string | undefined): CursoArea | null =>
  cursoAreas.find((area) => area.slug === slug) ?? null;

export const getCursosByArea = (areaSlug: string): CursoSeo[] =>
  cursosSeo.filter((curso) => curso.area.slug === areaSlug);

/**
 * Cursos relacionados (Fase 8: cada ficha enlaza a 3): primero los de la misma área y, si no
 * alcanzan, los de otras áreas; en cada grupo, primero los indexables (los que tienen contenido real).
 */
export const getRelatedCursos = (curso: CursoSeo, limit = 3): CursoSeo[] => {
  const porIndexable = (a: CursoSeo, b: CursoSeo) => Number(b.indexable) - Number(a.indexable);
  const otros = cursosSeo.filter((candidato) => candidato.slug !== curso.slug);
  return [
    ...otros.filter((candidato) => candidato.area.slug === curso.area.slug).sort(porIndexable),
    ...otros.filter((candidato) => candidato.area.slug !== curso.area.slug).sort(porIndexable),
  ].slice(0, limit);
};

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
