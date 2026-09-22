// ponytail: catálogo estático de cursos abiertos. La oferta cambia una vez al mes y se
// edita aquí; conectar a la API de calendarizaciones cuando exista el flujo real.
//
// Fuente única para la sección de la home (OpenCourseOffer) y la página de catálogo
// (OpenCoursesCatalog): antes cada una tenía su copia de las fechas y se desincronizaban.

export interface OpenCourseSession {
  /** id de calendarización del TMS; preselecciona la fecha en el formulario.
   *  Negativo = sin calendarización todavía (ver CURSOS_SIN_CALENDARIZACION del formulario). */
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
  note?: Record<string, string>;
  batches: OpenCourseBatch[];
}

const IMG = 'https://storageisecap.sfo2.digitaloceanspaces.com/noticias/';
const CALAMA = 'Calama · La Cascada 1513';

export const OPEN_COURSES: OpenCourse[] = [
  {
    title: 'Trabajo en',
    titleHighlight: 'Altura Física',
    description:
      'Curso presencial con práctica en torres de entrenamiento y equipos reales. Dirigido a trabajadores que realizan labores sobre nivel y necesitan acreditar competencias para faena.',
    duration: '8 horas',
    modalityId: '1',
    modality: 'Presencial',
    location: CALAMA,
    batches: [
      {
        month: 'Septiembre 2026',
        image: `${IMG}fd2e0110-4a81-4300-96b6-7182af43300a.jpeg`,
        sessions: [
          { id: '-10', date: '2026-09-01', label: '01-09-2026' },
          { id: '-11', date: '2026-09-08', label: '08-09-2026' },
          { id: '-12', date: '2026-09-22', label: '22-09-2026' },
        ],
      },
      {
        month: 'Octubre 2026',
        image: `${IMG}altura-fisica-presencial-calama-octubre-051216ec.jpeg`,
        sessions: [
          { id: '-20', date: '2026-10-06', label: '06-10-2026' },
          { id: '-21', date: '2026-10-15', label: '15-10-2026' },
          { id: '-22', date: '2026-10-27', label: '27-10-2026' },
        ],
      },
    ],
  },
  {
    title: 'Técnicas de',
    titleHighlight: 'Aislación y Bloqueo',
    description:
      'Curso presencial sobre procedimientos LOTO con simulador de bloqueo eléctrico. Dirigido a personal de mantenimiento y operaciones que interviene equipos energizados.',
    duration: '5,54 horas',
    modalityId: '1',
    modality: 'Presencial',
    location: CALAMA,
    batches: [
      {
        month: 'Septiembre 2026',
        image: `${IMG}eca834f1-d559-4c72-9b1d-49e8539cb04c.jpeg`,
        sessions: [
          { id: '-13', date: '2026-09-03', label: '03-09-2026' },
          { id: '-14', date: '2026-09-10', label: '10-09-2026' },
          { id: '-15', date: '2026-09-24', label: '24-09-2026' },
        ],
      },
    ],
  },
  {
    title: 'Espacios',
    titleHighlight: 'Confinados',
    description:
      'Curso presencial con práctica en rescate y control de atmósferas peligrosas. Dirigido a trabajadores que ingresan a espacios confinados y a quienes supervisan la maniobra.',
    duration: '8 horas',
    modalityId: '1',
    modality: 'Presencial',
    location: CALAMA,
    batches: [
      {
        month: 'Septiembre 2026',
        image: `${IMG}27bda1db-b09b-4276-8435-a3b2b2989bf8.jpeg`,
        sessions: [
          { id: '-16', date: '2026-09-04', label: '04-09-2026' },
          { id: '-17', date: '2026-09-11', label: '11-09-2026' },
          { id: '-18', date: '2026-09-25', label: '25-09-2026' },
        ],
      },
      {
        month: 'Octubre 2026',
        image: `${IMG}confinados-calama-octubre-38a30e69.jpeg`,
        sessions: [
          { id: '-23', date: '2026-10-08', label: '08-10-2026' },
          { id: '-24', date: '2026-10-20', label: '20-10-2026' },
          { id: '-25', date: '2026-10-29', label: '29-10-2026' },
        ],
      },
    ],
  },
  {
    title: 'SAP PM:',
    titleHighlight: 'Gestión de Mantenimiento',
    description:
      'Curso sincrónico sobre el módulo PM de SAP S/4 HANA: avisos, órdenes de trabajo, planes preventivos e indicadores. Dirigido a personal de mantenimiento y planificación que opera el sistema.',
    duration: '24 horas',
    modalityId: '2',
    modality: 'Sincrónico',
    note: {
      es: 'La fecha indicada corresponde al primer día (viernes, 4 hrs). Las 24 hrs se distribuyen en viernes de 4 hrs y sábados de 8 hrs; los días siguientes se acuerdan con el facilitador en la primera sesión.',
      en: 'The date shown is the first day (Friday, 4 hrs). The 24 hrs are split into 4-hr Fridays and 8-hr Saturdays; remaining days are agreed with the instructor in the first session.',
      pt: 'A data indicada corresponde ao primeiro dia (sexta-feira, 4 hrs). As 24 hrs sao distribuidas em sextas de 4 hrs e sabados de 8 hrs; os demais dias sao acordados com o instrutor na primeira sessao.',
    },
    batches: [
      {
        month: 'Octubre 2026',
        image: `${IMG}sap-s4-hana-modulo-pm-jpg-76db2b0c.jpeg`,
        sessions: [{ id: '-26', date: '2026-10-01', label: '01-10-2026' }],
      },
    ],
  },
  {
    title: 'Formación de',
    titleHighlight: 'Guardia de Seguridad',
    description:
      'Curso OS10 blended para quienes buscan desempeñarse como guardia de seguridad: marco legal, procedimientos de control y prevención de riesgos, con los contenidos exigidos por Carabineros para la acreditación. Combina sesiones en línea con jornadas presenciales.',
    duration: '90 horas',
    // Blended: el backend no tiene esa modalidad (ModalidadContacto = Presencial | Online),
    // así que la solicitud viaja como presencial y la sede elegida va en el texto del curso.
    modalityId: '1',
    modality: 'Blended',
    location: 'Calama y/o Santiago',
    // 90 hrs no caben en un día: la fecha del afiche es el inicio, no la jornada completa.
    note: {
      es: 'La fecha indicada corresponde al inicio del curso. Las 90 hrs del OS10 se distribuyen en varias jornadas; el calendario se acuerda con el facilitador en la primera sesión.',
      en: 'The date shown is the course start. The 90 hrs are spread over several sessions; the schedule is agreed with the instructor in the first session.',
      pt: 'A data indicada corresponde ao inicio do curso. As 90 hrs sao distribuidas em varias jornadas; o calendario e acordado com o instrutor na primeira sessao.',
    },
    batches: [
      {
        month: 'Octubre 2026',
        image: `${IMG}formacion-guardia-seguridad-edit-octubre-jpg-88c7c408.jpeg`,
        // Una fecha por sede: el postulante elige dónde la cursa al inscribirse.
        sessions: [
          { id: '-27', date: '2026-10-01', label: '01-10-2026', city: 'Calama' },
          { id: '-28', date: '2026-10-01', label: '01-10-2026', city: 'Santiago' },
        ],
      },
    ],
  },
];

/** Compara contra el día de hoy a medianoche: una fecha de hoy sigue siendo vigente. */
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Tandas con al menos una fecha por ocurrir, en orden cronológico. Lo ya pasado desaparece
 * solo: en octubre las fechas de septiembre no se muestran, sin tener que editar el archivo.
 */
export function getUpcomingBatches(courses: OpenCourse[] = OPEN_COURSES) {
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
 * Las fechas vigentes sin calendarización en el TMS (id negativo), aplanadas para el select
 * del formulario. Se deriva del mismo catálogo que las vistas: una fecha editada arriba no
 * puede quedar desincronizada acá abajo.
 */
export function getSessionsWithoutCalendar() {
  return getUpcomingBatches().courses.flatMap((course) =>
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
export function getSessionCity(sessionId: string | undefined) {
  if (!sessionId) return undefined;
  for (const course of OPEN_COURSES) {
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
