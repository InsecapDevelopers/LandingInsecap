/**
 * Tour virtual de las sedes (/tour-virtual). Cada estación es una secuencia de fotogramas WebP en
 * public/images/tour/<sede>/<clave>/NN.webp que el scroll recorre en un canvas; los genera
 * scripts/tour-frames.sh desde los videos originales (tramos sin personas a la vista).
 *
 * Los nombres de las estaciones salen de la señalética que se ve en los videos.
 * TODO: INSECAP debe validar nombres y descripciones antes de indexar la página (seo-routes.ts).
 */
import type { SedeSlug } from './sedes';

export interface TourSecuencia {
  /** Carpeta bajo /images/tour/<sede>/. */
  clave: string;
  /** Cantidad de fotogramas (01.webp … NN.webp). */
  frames: number;
  width: number;
  height: number;
}

export interface TourEstacion extends TourSecuencia {
  nombre: string;
  /** Segunda línea del título, en tono más suave. */
  acento: string;
  descripcion: string;
  nivel: 'Primer nivel' | 'Segundo nivel';
  /** 'inmersiva': video a pantalla completa sobre fondo oscuro. 'tarjeta': video en tarjeta sobre fondo claro. */
  vista: 'inmersiva' | 'tarjeta';
}

export interface Tour {
  sede: SedeSlug;
  /** Secuencia del encabezado: la llegada a la sede. */
  acceso: TourSecuencia;
  estaciones: TourEstacion[];
}

const H = { width: 1280, height: 720 };

export const TOUR_CALAMA: Tour = {
  sede: 'calama',
  acceso: { clave: 'acceso', frames: 28, ...H },
  estaciones: [
    {
      clave: 'recepcion',
      frames: 32,
      ...H,
      nombre: 'Recepción',
      acento: 'El punto de partida.',
      descripcion: 'El hall de entrada, con el mesón de atención y la escalera que lleva a las salas del segundo nivel.',
      nivel: 'Primer nivel',
      vista: 'inmersiva',
    },
    {
      clave: 'taller',
      frames: 48,
      ...H,
      nombre: 'Taller Mecánico',
      acento: 'Aprender haciendo.',
      descripcion: 'Una sala amplia con mesones de trabajo y tableros de práctica montados en el muro.',
      nivel: 'Primer nivel',
      vista: 'tarjeta',
    },
    {
      clave: 'patio',
      frames: 46,
      ...H,
      nombre: 'Patio central',
      acento: 'El corazón de la sede.',
      descripcion: 'El espacio común del primer nivel, con mesas y sillas, al que dan las salas y los talleres.',
      nivel: 'Primer nivel',
      vista: 'inmersiva',
    },
    {
      clave: 'bloqueo',
      frames: 40,
      width: 720,
      height: 1280,
      nombre: 'Aislación y Bloqueo',
      acento: 'Tablero de entrenamiento.',
      descripcion: 'Un tablero con dispositivos de bloqueo y un circuito de práctica para ejercitar el procedimiento paso a paso.',
      nivel: 'Primer nivel',
      vista: 'tarjeta',
    },
    {
      clave: 'practica',
      frames: 38,
      ...H,
      nombre: 'Zona de práctica',
      acento: 'Del aula al terreno.',
      descripcion: 'Un galpón con estaciones de trabajo, herramientas y equipos de protección personal, demarcado para los ejercicios prácticos.',
      nivel: 'Primer nivel',
      vista: 'inmersiva',
    },
    {
      clave: 'clases',
      frames: 32,
      ...H,
      nombre: 'Sala N° 3',
      acento: 'Salas de clases.',
      descripcion: 'Una de las salas de clases del segundo nivel, con sillas universitarias y rotafolio.',
      nivel: 'Segundo nivel',
      vista: 'tarjeta',
    },
    {
      clave: 'computacion',
      frames: 64,
      ...H,
      nombre: 'Sala N° 6',
      acento: 'Computación.',
      descripcion: 'Puestos con computador a lo largo de los ventanales, para los cursos que se trabajan frente a la pantalla.',
      nivel: 'Segundo nivel',
      vista: 'inmersiva',
    },
    {
      clave: 'simulacion',
      frames: 64,
      ...H,
      nombre: 'Sala de Simulación',
      acento: 'Nuevos espacios para el aprendizaje.',
      descripcion: 'Una cabina con asiento de operador y pantallas envolventes para practicar la operación de equipos.',
      nivel: 'Segundo nivel',
      vista: 'inmersiva',
    },
  ],
};

/** Sedes con tour publicado. */
export const TOURS: Partial<Record<SedeSlug, Tour>> = { calama: TOUR_CALAMA };

export const tourFrameSrc = (sede: SedeSlug, clave: string, frame: number) =>
  `/images/tour/${sede}/${clave}/${String(frame + 1).padStart(2, '0')}.webp`;
