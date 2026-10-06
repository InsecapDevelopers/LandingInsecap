/**
 * Sedes físicas de INSECAP: NAP (nombre, dirección, teléfono) único del sitio (decisiones tarea #8,
 * 1.6 y Fase 8). Fuente: contexto de negocio de la tarea #8. Lo usan /sedes/:sede, Footer,
 * ContactCTA, Contacto, NotFound y chile-map; en la Fase 4, el JSON-LD de cada sede (`/es/sedes/<slug>#place`).
 *
 * No inventar datos: lo que falta queda en null con su TODO (sección 4, punto 5).
 */
import { fitDescription } from '../lib/seo-text';

export type SedeSlug = 'calama' | 'antofagasta' | 'santiago' | 'vallenar';

export interface Sede {
  slug: SedeSlug;
  /** Nombre visible de la sede. */
  nombre: string;
  ciudad: string;
  region: string;
  direccion: string;
  /** Teléfono tal como se muestra. */
  telefono: string;
  /** Teléfono en formato E.164 para `tel:`. */
  telefonoE164: string;
  email: string;
  casaMatriz: boolean;
  /** TODO: horario de atención de cada sede (sección 4, punto 5). */
  horario: string | null;
  /** TODO: coordenadas reales de cada sede (sección 4, punto 5). */
  geo: { lat: number; lng: number } | null;
}

export const CONTACT_EMAIL = 'contacto@insecap.cl';

/** Cobertura de los cursos e-learning, según el contexto de negocio. */
export const COBERTURA_VIRTUAL = 'de Arica a Concepción';

// TODO: confirmar el NAP exacto de cada sede con INSECAP (sección 4, punto 5). Footer, ContactCTA,
// Contacto, NotFound, chile-map, /sedes/:sede, el JSON-LD (#org y #place), las descriptions de
// contacto (SEO.tsx), los párrafos de respuesta (respuestas.ts), openCourses y Clientes leen de
// aquí: un cambio se propaga a todo el sitio (Fase 8, NAP único).
export const sedes: Sede[] = [
  {
    slug: 'calama',
    nombre: 'Casa Matriz Calama',
    ciudad: 'Calama',
    region: 'Región de Antofagasta',
    direccion: 'La Cascada 1513',
    telefono: '+56 55 292 6431',
    telefonoE164: '+56552926431',
    email: CONTACT_EMAIL,
    casaMatriz: true,
    horario: null,
    geo: null,
  },
  {
    slug: 'antofagasta',
    nombre: 'Sede Antofagasta',
    ciudad: 'Antofagasta',
    region: 'Región de Antofagasta',
    direccion: 'Copiapó 956',
    telefono: '+56 55 294 8575',
    telefonoE164: '+56552948575',
    email: CONTACT_EMAIL,
    casaMatriz: false,
    horario: null,
    geo: null,
  },
  {
    slug: 'santiago',
    nombre: 'Sede Santiago',
    ciudad: 'Santiago',
    region: 'Región Metropolitana',
    direccion: 'Valenzuela Castillo 1063',
    telefono: '+56 9 8819 8254',
    telefonoE164: '+56988198254',
    email: CONTACT_EMAIL,
    casaMatriz: false,
    horario: null,
    geo: null,
  },
  {
    slug: 'vallenar',
    nombre: 'Sede Vallenar',
    ciudad: 'Vallenar',
    region: 'Región de Atacama',
    // TODO: confirmar la dirección y el mapa de Vallenar (sección 4, punto 5).
    direccion: 'Río del Tránsito 1546, Villa Vista Hermosa',
    telefono: '+56 9 9715 7034',
    telefonoE164: '+56997157034',
    email: CONTACT_EMAIL,
    casaMatriz: false,
    horario: null,
    geo: null,
  },
];

/** Casa matriz (Calama): teléfono y dirección de la organización en JSON-LD, Contacto y descriptions. */
export const getCasaMatriz = (): Sede => sedes.find((sede) => sede.casaMatriz) ?? sedes[0];

export const getSedeBySlug = (slug: string | undefined): Sede | null =>
  sedes.find((sede) => sede.slug === slug) ?? null;

/** Búsqueda en Google Maps por dirección (no son coordenadas: esas siguen como TODO). */
export const getSedeMapsUrl = (sede: Sede): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`INSECAP ${sede.direccion}, ${sede.ciudad}, Chile`)}`;

/** Title (keyword, sin marca) y description (140–155) de /sedes/:sede (Fase 3), con el NAP. */
export const getSedeSeoMeta = (sede: Sede) => ({
  title: `OTEC en ${sede.ciudad}: cursos y capacitación`,
  description: fitDescription(
    `${sede.nombre} de INSECAP en ${sede.direccion}, ${sede.ciudad}. Teléfono ${sede.telefono}. Cursos de seguridad y operación de equipos.`,
    ['INSECAP, OTEC acreditada por SENCE.', 'OTEC acreditada por SENCE.', 'Cotiza con INSECAP.'],
  ),
});
