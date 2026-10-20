// Cursos abiertos: se cargan en el TMS Plus (Gestión Página Web > Cursos Abiertos) y la web los
// lee de /api/publica/cursos-abiertos. Fuente única para la home (OpenCourseOffer), el catálogo
// (OpenCoursesCatalog) y el formulario de inscripción.

export interface OpenCourseSession {
  /** id de calendarización del TMS; preselecciona la fecha en el formulario.
   *  Empieza con "-" = sin calendarización todavía (ver getSessionsWithoutCalendar). */
  id: string;
  /** Fecha de inicio en ISO, para ordenar y descartar las que ya pasaron. */
  date: string;
  label: string;
  /** Sede de esta fecha, cuando el curso se dicta en más de una ciudad. */
  city?: string;
}

export interface OpenCourseBatch {
  /** Etiqueta de la tanda, tal como se muestra ("Octubre 2026"). */
  month: string;
  /** Afiche: URL de Spaces, o ruta local sin ancho ni extensión (los que venían en el código; ver posterImage). */
  image: string;
  sessions: OpenCourseSession[];
}

export interface OpenCourse {
  /** Título partido en dos para que la home destaque la segunda mitad. */
  title: string;
  titleHighlight: string;
  description: string;
  duration: string;
  /**
   * Modalidad que viaja al formulario como ?modalidad=: el backend solo acepta
   * Presencial (1) u Online (2) — ModalidadContacto no tiene un valor para blended,
   * así que un curso blended se envía como presencial y la ciudad concreta viaja en
   * el texto del curso (cursoInteres).
   */
  modalityId: '1' | '2';
  /** Etiqueta visible; puede decir "Blended" aunque modalityId sea '1'. */
  modality: string;
  location?: string;
  /**
   * Código con que el R08 agrupa las solicitudes de este curso mientras la fecha no tenga
   * calendarización: viaja en las observaciones del interesado, sin crear ningún curso en la
   * base. Debe empezar con "WEB-".
   */
  webCode: string;
  note?: Record<string, string>;
  batches: OpenCourseBatch[];
}

export interface ApiCursoAbierto {
  id: number;
  titulo: string;
  tituloDestacado: string;
  codigoWeb: string;
  descripcion: string;
  duracion: string;
  modalidad: string;
  modalidadId: '1' | '2';
  ubicacion: string | null;
  nota: string | null;
  tandas: { mes: string; imagen: string; fechas: { fecha: string; ciudad: string | null; idCalendarizacion: number | null }[] }[];
}

/**
 * Sin calendarización la fecha no tiene id en el TMS: se arma uno negativo y estable (curso + fecha +
 * sede) para el ?fecha= del formulario.
 */
const sessionId = (cursoId: number, f: ApiCursoAbierto['tandas'][number]['fechas'][number]) =>
  f.idCalendarizacion ? String(f.idCalendarizacion) : `-${cursoId}-${f.fecha}${f.ciudad ? `-${f.ciudad.replace(/\W+/g, '')}` : ''}`;

export const toOpenCourse = (c: ApiCursoAbierto): OpenCourse => ({
  title: c.titulo,
  titleHighlight: c.tituloDestacado,
  webCode: c.codigoWeb,
  description: c.descripcion,
  duration: c.duracion,
  modalityId: c.modalidadId,
  modality: c.modalidad,
  location: c.ubicacion ?? undefined,
  // ponytail: la aclaración se carga solo en español; la misma va en los tres idiomas, como la descripción.
  note: c.nota ? { es: c.nota, en: c.nota, pt: c.nota } : undefined,
  batches: c.tandas.map((t) => ({
    month: t.mes,
    image: t.imagen,
    sessions: t.fechas.map((f) => ({
      id: sessionId(c.id, f),
      date: f.fecha,
      label: f.fecha.split('-').reverse().join('-'),
      city: f.ciudad ?? undefined,
    })),
  })),
});

/**
 * Cursos abiertos del TMS Plus (Gestión Página Web > Cursos Abiertos). En dev va por el proxy de
 * Vite, como las noticias. Lanza si falla: el prerender prefiere cortarse a publicar la sección vacía.
 */
export async function fetchOpenCourses(): Promise<OpenCourse[]> {
  const base = (import.meta.env.VITE_TMS_PLUS_API_URL || '').replace(/\/+$/, '');
  const res = await fetch(`${import.meta.env.PROD ? base : ''}/api/publica/cursos-abiertos`);
  if (!res.ok) throw new Error(`Error al cargar los cursos abiertos: ${res.status}`);
  return ((await res.json()) as ApiCursoAbierto[]).map(toOpenCourse);
}

/**
 * Compara contra el día de hoy a medianoche: una fecha de hoy sigue siendo vigente.
 * En el build "hoy" es la fecha del build (__BUILD_DATE__, vite.config.ts), igual en el
 * prerender y en el navegador: así la hidratación no cambia la lista. El cron diario del deploy
 * la renueva. En dev (y en openCourses.check.ts) no existe y se usa el reloj.
 */
const startOfToday = () => {
  if (typeof __BUILD_DATE__ === 'string') {
    return new Date(`${__BUILD_DATE__}T00:00:00`);
  }
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Tandas con al menos una fecha por ocurrir, en orden cronológico. Lo ya pasado desaparece
 * solo: en octubre las fechas de septiembre no se muestran, sin tener que editar el archivo.
 */
export function getUpcomingBatches(courses: OpenCourse[]) {
  const today = startOfToday();
  const months = new Map<string, { month: string; first: number }>();

  const withUpcoming = courses.flatMap((course) => {
    const batches = course.batches
      .map((batch) => ({
        ...batch,
        sessions: batch.sessions.filter((s) => new Date(`${s.date}T00:00:00`) >= today),
      }))
      .filter((batch) => batch.sessions.length > 0);

    for (const batch of batches) {
      const first = new Date(`${batch.sessions[0].date}T00:00:00`).getTime();
      const seen = months.get(batch.month);
      if (!seen || first < seen.first) months.set(batch.month, { month: batch.month, first });
    }

    return batches.length ? [{ ...course, batches }] : [];
  });

  const monthLabels = [...months.values()].sort((a, b) => a.first - b.first).map((m) => m.month);
  return { courses: withUpcoming, months: monthLabels };
}

/**
 * Las fechas vigentes sin calendarización en el TMS (id que empieza con "-"), aplanadas para el
 * select del formulario. Se deriva del mismo catálogo que las vistas: no pueden desincronizarse.
 */
export function getSessionsWithoutCalendar(courses: OpenCourse[]) {
  return getUpcomingBatches(courses).courses.flatMap((course) =>
    course.batches.flatMap((batch) =>
      batch.sessions
        .filter((s) => s.id.startsWith('-'))
        .map((s) => ({
          id: s.id,
          modalidad: course.modalityId,
          // La sede va en el nombre: es lo único que llega al comercial cuando la fecha
          // no tiene calendarización y el curso viaja como texto libre.
          nombreCurso: `${course.title} ${course.titleHighlight}${s.city ? ` · ${s.city}` : ''}`,
          fecha: s.label,
          ciudad: s.city,
          codigoCursoWeb: course.webCode,
          nota: course.note,
        })),
    ),
  );
}

/**
 * Resuelve el ?mes= de la URL a una de las tandas vigentes, para que una campaña pueda
 * enlazar directo a un mes ("?mes=octubre"). Tolera mayúsculas, tildes y el año opcional
 * ("Octubre", "octubre-2026"); si no calza con ninguna tanda devuelve undefined y la
 * página cae en la primera, en vez de quedar vacía.
 */
export function matchMonthParam(param: string | null | undefined, months: string[]) {
  if (!param) return undefined;
  const normalize = (v: string) =>
    v
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  const wanted = normalize(param);
  return months.find((m) => {
    const full = normalize(m); // "octubre2026"
    return full === wanted || normalize(m.split(' ')[0]) === wanted;
  });
}

/**
 * Ciudad de una fecha del catálogo, cuando la trae. Sirve para preseleccionar la ciudad del
 * formulario según la sede elegida en un curso que se dicta en más de una.
 */
export function getSessionCity(courses: OpenCourse[], sessionId: string | undefined) {
  if (!sessionId) return undefined;
  for (const course of courses) {
    for (const batch of course.batches) {
      const session = batch.sessions.find((s) => s.id === sessionId);
      if (session) return session.city;
    }
  }
  return undefined;
}

/** Los cursos que dictan la tanda pedida, con esa tanda ya resuelta (imagen y fechas). */
export function coursesForMonth(month: string, courses: OpenCourse[]) {
  return courses.flatMap((course) => {
    const batch = course.batches.find((b) => b.month === month);
    return batch ? [{ ...course, image: batch.image, sessions: batch.sessions }] : [];
  });
}
