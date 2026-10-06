/**
 * Contenido citable (Fase 8, tarea #8): párrafos de respuesta de 40–60 palabras con entidades
 * explícitas (INSECAP, OTEC, ciudad y acreditaciones) al inicio de Home, Nosotros y cada sede, en
 * es, en y pt; las cifras 2025 con su fecha visible, y las listas comparables (acreditaciones y
 * modalidades) de la tabla "INSECAP en datos".
 *
 * Solo datos del contexto de negocio de la tarea #8 y de src/data/sedes.ts (NAP único).
 * scripts/check-dist.mjs cuenta las palabras de cada párrafo
 * (atributo data-respuesta).
 */
import type { AppLanguage } from '../lib/translations';
import { getCasaMatriz, sedes, type Sede } from './sedes';

/** Cifras 2025 del contexto de negocio (se muestran siempre con "al 2025"). */
export const CIFRAS = {
  anio: 2025,
  personasCapacitadas: 53432,
  facilitadores: 507,
  horas: 1840173,
  cursosDisenados: 2315,
} as const;

/** Formato de miles del idioma (es y pt: 53.432; en: 53,432). */
// Sin toLocaleString: en es, CLDR no agrupa los números de 4 cifras (2315) y el resultado
// depende del ICU de Node y del navegador (riesgo de hydration mismatch).
export const formatCifra = (value: number, locale: AppLanguage): string =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/g, locale === 'en' ? ',' : '.');

/** Acreditaciones y membresías del contexto de negocio, por idioma. */
export const ACREDITACIONES: Record<AppLanguage, { nombre: string; detalle: string }[]> = {
  es: [
    { nombre: 'SENCE', detalle: 'OTEC acreditada, Resolución N° 12208 vigente' },
    { nombre: 'NCh 2728:2015', detalle: 'Norma chilena para organismos técnicos de capacitación' },
    { nombre: 'ISO 9001:2015', detalle: 'Sistema de gestión de calidad' },
    { nombre: 'Codelco', detalle: 'OTEC acreditada por Codelco' },
    { nombre: 'Consejo de Competencias Mineras (CCM)', detalle: 'Sello CCM' },
    { nombre: 'CCS y SICEP', detalle: 'Miembro de la Cámara de Comercio de Santiago y de SICEP' },
  ],
  en: [
    { nombre: 'SENCE', detalle: 'Accredited OTEC, Resolution No. 12208 in force' },
    { nombre: 'NCh 2728:2015', detalle: 'Chilean standard for technical training bodies' },
    { nombre: 'ISO 9001:2015', detalle: 'Quality management system' },
    { nombre: 'Codelco', detalle: 'OTEC accredited by Codelco' },
    { nombre: 'Mining Skills Council (CCM)', detalle: 'CCM seal' },
    { nombre: 'CCS and SICEP', detalle: 'Member of the Santiago Chamber of Commerce and SICEP' },
  ],
  pt: [
    { nombre: 'SENCE', detalle: 'OTEC credenciada, Resolução N° 12208 vigente' },
    { nombre: 'NCh 2728:2015', detalle: 'Norma chilena para organismos técnicos de capacitação' },
    { nombre: 'ISO 9001:2015', detalle: 'Sistema de gestão da qualidade' },
    { nombre: 'Codelco', detalle: 'OTEC credenciada pela Codelco' },
    { nombre: 'Conselho de Competências Mineiras (CCM)', detalle: 'Selo CCM' },
    { nombre: 'CCS e SICEP', detalle: 'Membro da Câmara de Comércio de Santiago e do SICEP' },
  ],
};

/** Modalidades del contexto de negocio, por idioma. */
export const MODALIDADES: Record<AppLanguage, string[]> = {
  es: ['Presencial', 'E-learning sincrónico', 'E-learning asincrónico', 'Recertificación'],
  en: ['On-site', 'Synchronous e-learning', 'Asynchronous e-learning', 'Recertification'],
  pt: ['Presencial', 'E-learning síncrono', 'E-learning assíncrono', 'Recertificação'],
};

const ciudadesSinCasaMatriz = () => sedes.filter((sede) => !sede.casaMatriz).map((sede) => sede.ciudad);

const listar = (items: string[], y: string) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${y} ${items[items.length - 1]}`;

/** Párrafo de respuesta de la home. */
export const getRespuestaHome = (locale: AppLanguage): string => {
  const matriz = getCasaMatriz().ciudad;
  const personas = formatCifra(CIFRAS.personasCapacitadas, locale);
  switch (locale) {
    case 'en':
      return `INSECAP is a Chilean OTEC (accredited technical training body) headquartered in ${matriz}, with offices in ${listar(ciudadesSinCasaMatriz(), 'and')}. It is accredited by SENCE (Resolution No. 12208) and Codelco, and certified under NCh 2728:2015 and ISO 9001:2015. It trains people in safety, compliance and equipment operation for large-scale mining: as of ${CIFRAS.anio}, over ${personas} people trained.`;
    case 'pt':
      return `A INSECAP é uma OTEC (organismo técnico de capacitação) chilena com matriz em ${matriz} e unidades em ${listar(ciudadesSinCasaMatriz(), 'e')}. É credenciada pelo SENCE (Resolução N° 12208) e pela Codelco, e certificada nas normas NCh 2728:2015 e ISO 9001:2015. Capacita em segurança, conformidade normativa e operação de equipamentos para a grande mineração: até ${CIFRAS.anio}, mais de ${personas} pessoas capacitadas.`;
    default:
      return `INSECAP es una OTEC (Organismo Técnico de Capacitación) chilena con casa matriz en ${matriz} y sedes en ${listar(ciudadesSinCasaMatriz(), 'y')}. Está acreditada por SENCE (Resolución N° 12208) y por Codelco, y certificada en NCh 2728:2015 e ISO 9001:2015. Capacita en seguridad, cumplimiento normativo y operación de equipos para la gran minería: al ${CIFRAS.anio}, más de ${personas} personas capacitadas.`;
  }
};

/** Párrafo de respuesta de /nosotros. */
export const getRespuestaNosotros = (locale: AppLanguage): string => {
  const matriz = getCasaMatriz().ciudad;
  const facilitadores = formatCifra(CIFRAS.facilitadores, locale);
  const cursos = formatCifra(CIFRAS.cursosDisenados, locale);
  switch (locale) {
    case 'en':
      return `INSECAP is a Chilean OTEC (accredited technical training body) headquartered in ${matriz}, focused on safety and regulatory compliance for large-scale mining. It is accredited by SENCE and Codelco, certified under NCh 2728:2015 and ISO 9001:2015, and holds the Mining Skills Council (CCM) seal. As of ${CIFRAS.anio}, it has over ${facilitadores} facilitators and ${cursos} courses designed.`;
    case 'pt':
      return `A INSECAP é uma OTEC (organismo técnico de capacitação) chilena com matriz em ${matriz}, focada em segurança e conformidade normativa para a grande mineração. É credenciada pelo SENCE e pela Codelco, certificada nas normas NCh 2728:2015 e ISO 9001:2015 e com selo do Conselho de Competências Mineiras (CCM). Até ${CIFRAS.anio}, soma mais de ${facilitadores} facilitadores e ${cursos} cursos desenvolvidos.`;
    default:
      return `INSECAP es una OTEC (Organismo Técnico de Capacitación) chilena con casa matriz en ${matriz}, especializada en seguridad y cumplimiento normativo para la gran minería. Está acreditada por SENCE y Codelco, certificada en NCh 2728:2015 e ISO 9001:2015 y con el sello del Consejo de Competencias Mineras (CCM). Al ${CIFRAS.anio} suma más de ${facilitadores} facilitadores y facilitadoras y ${cursos} cursos diseñados.`;
  }
};

/** Párrafo de respuesta de una sede (/sedes/:sede), con su NAP. */
export const getRespuestaSede = (sede: Sede, locale: AppLanguage): string => {
  const lugar = `${sede.direccion}, ${sede.ciudad}, ${sede.region}`;
  switch (locale) {
    case 'en':
      return `INSECAP's ${sede.ciudad} ${sede.casaMatriz ? 'head office' : 'office'} is located at ${lugar}, Chile. INSECAP is a Chilean OTEC (accredited technical training body) accredited by SENCE (Resolution No. 12208) and Codelco, providing safety, regulatory compliance and operational continuity training, especially for large-scale mining. Phone: ${sede.telefono}.`;
    case 'pt':
      return `A ${sede.casaMatriz ? 'matriz' : 'unidade'} da INSECAP em ${sede.ciudad} fica em ${lugar}, Chile. A INSECAP é uma OTEC (organismo técnico de capacitação) chilena credenciada pelo SENCE (Resolução N° 12208) e pela Codelco, que capacita em segurança, conformidade normativa e continuidade operacional, sobretudo para a grande mineração. Telefone: ${sede.telefono}.`;
    default:
      return `${sede.nombre} de INSECAP está en ${lugar}.${sede.casaMatriz ? ' Es la casa matriz de INSECAP.' : ''} INSECAP es una OTEC chilena acreditada por SENCE (Resolución N° 12208) y por Codelco, que capacita en seguridad, cumplimiento normativo y continuidad operacional, sobre todo para la gran minería. Teléfono ${sede.telefono}.`;
  }
};

/** Palabras de un párrafo (mismo criterio que scripts/check-dist.mjs). */
export const contarPalabras = (text: string): number =>
  text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
