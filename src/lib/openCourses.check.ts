/**
 * Check del filtro por fecha de los cursos abiertos. Sin runner de tests en el proyecto:
 *   npx esbuild src/lib/openCourses.check.ts --bundle --platform=node --format=esm \
 *     --alias:@=./src --outfile=/tmp/c.mjs && node /tmp/c.mjs
 */
import assert from 'node:assert';
import {
  toOpenCourse,
  getUpcomingBatches,
  coursesForMonth,
  getSessionsWithoutCalendar,
  getSessionCity,
  matchMonthParam,
  type ApiCursoAbierto,
} from './openCourses';

// La oferta de septiembre-octubre 2026 tal como la entrega /api/publica/cursos-abiertos.
const API: ApiCursoAbierto[] = [
  {
    id: 1,
    titulo: "Trabajo en",
    tituloDestacado: "Altura Física",
    codigoWeb: "WEB-ALTURA",
    descripcion: "Curso presencial con práctica en torres de entrenamiento y equipos reales. Dirigido a trabajadores que realizan labores sobre nivel y necesitan acreditar competencias para faena.",
    duracion: "8 horas",
    modalidad: "Presencial",
    modalidadId: "1",
    ubicacion: "Calama · La Cascada 1513",
    nota: null,
    tandas: [
      {
        mes: "Septiembre 2026",
        imagen: "/images/cursos-abiertos/fd2e0110-4a81-4300-96b6-7182af43300a",
        fechas: [
          {
            fecha: "2026-09-01",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-09-08",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-09-22",
            ciudad: null,
            idCalendarizacion: null
          }
        ]
      },
      {
        mes: "Octubre 2026",
        imagen: "/images/cursos-abiertos/altura-fisica-presencial-calama-octubre-051216ec",
        fechas: [
          {
            fecha: "2026-10-06",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-10-15",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-10-27",
            ciudad: null,
            idCalendarizacion: null
          }
        ]
      }
    ]
  },
  {
    id: 2,
    titulo: "Técnicas de",
    tituloDestacado: "Aislación y Bloqueo",
    codigoWeb: "WEB-AISLACION",
    descripcion: "Curso presencial sobre procedimientos LOTO con simulador de bloqueo eléctrico. Dirigido a personal de mantenimiento y operaciones que interviene equipos energizados.",
    duracion: "5,54 horas",
    modalidad: "Presencial",
    modalidadId: "1",
    ubicacion: "Calama · La Cascada 1513",
    nota: null,
    tandas: [
      {
        mes: "Septiembre 2026",
        imagen: "/images/cursos-abiertos/eca834f1-d559-4c72-9b1d-49e8539cb04c",
        fechas: [
          {
            fecha: "2026-09-03",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-09-10",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-09-24",
            ciudad: null,
            idCalendarizacion: null
          }
        ]
      }
    ]
  },
  {
    id: 3,
    titulo: "Espacios",
    tituloDestacado: "Confinados",
    codigoWeb: "WEB-CONFINADOS",
    descripcion: "Curso presencial con práctica en rescate y control de atmósferas peligrosas. Dirigido a trabajadores que ingresan a espacios confinados y a quienes supervisan la maniobra.",
    duracion: "8 horas",
    modalidad: "Presencial",
    modalidadId: "1",
    ubicacion: "Calama · La Cascada 1513",
    nota: null,
    tandas: [
      {
        mes: "Septiembre 2026",
        imagen: "/images/cursos-abiertos/27bda1db-b09b-4276-8435-a3b2b2989bf8",
        fechas: [
          {
            fecha: "2026-09-04",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-09-11",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-09-25",
            ciudad: null,
            idCalendarizacion: null
          }
        ]
      },
      {
        mes: "Octubre 2026",
        imagen: "/images/cursos-abiertos/confinados-calama-octubre-38a30e69",
        fechas: [
          {
            fecha: "2026-10-08",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-10-20",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-10-29",
            ciudad: null,
            idCalendarizacion: null
          }
        ]
      }
    ]
  },
  {
    id: 4,
    titulo: "Manejo de",
    tituloDestacado: "Sustancias Peligrosas",
    codigoWeb: "WEB-SUSTANCIAS",
    descripcion: "Curso presencial sobre almacenamiento, transporte y manipulación de sustancias peligrosas: clasificación, hojas de datos de seguridad y respuesta ante derrames. Dirigido a quienes operan con productos químicos en faena.",
    duracion: "8 horas",
    modalidad: "Presencial",
    modalidadId: "1",
    ubicacion: "Calama · La Cascada 1513",
    nota: null,
    tandas: [
      {
        mes: "Octubre 2026",
        imagen: "/images/cursos-abiertos/sustancias-peligrosas-calama-62d4c6f9",
        fechas: [
          {
            fecha: "2026-10-13",
            ciudad: null,
            idCalendarizacion: null
          },
          {
            fecha: "2026-10-22",
            ciudad: null,
            idCalendarizacion: null
          }
        ]
      }
    ]
  },
  {
    id: 5,
    titulo: "SAP PM:",
    tituloDestacado: "Gestión de Mantenimiento",
    codigoWeb: "WEB-SAP-PM",
    descripcion: "Curso sincrónico sobre el módulo PM de SAP S/4 HANA: avisos, órdenes de trabajo, planes preventivos e indicadores. Dirigido a personal de mantenimiento y planificación que opera el sistema.",
    duracion: "24 horas",
    modalidad: "Sincrónico",
    modalidadId: "2",
    ubicacion: null,
    nota: "La fecha indicada corresponde al primer día (viernes, 4 hrs). Las 24 hrs se distribuyen en viernes de 4 hrs y sábados de 8 hrs; los días siguientes se acuerdan con el facilitador en la primera sesión.",
    tandas: [
      {
        mes: "Octubre 2026",
        imagen: "/images/cursos-abiertos/sap-s4-hana-modulo-pm-jpg-76db2b0c",
        fechas: [
          {
            fecha: "2026-10-01",
            ciudad: null,
            idCalendarizacion: null
          }
        ]
      }
    ]
  },
  {
    id: 6,
    titulo: "Formación de",
    tituloDestacado: "Guardia de Seguridad",
    codigoWeb: "WEB-OS10",
    descripcion: "Curso OS10 blended para quienes buscan desempeñarse como guardia de seguridad: marco legal, procedimientos de control y prevención de riesgos, con los contenidos exigidos por Carabineros para la acreditación. Combina sesiones en línea con jornadas presenciales.",
    duracion: "90 horas",
    modalidad: "Blended",
    modalidadId: "1",
    ubicacion: "Calama y/o Santiago",
    nota: "La fecha indicada corresponde al inicio del curso. Las 90 hrs del OS10 se distribuyen en varias jornadas; el calendario se acuerda con el facilitador en la primera sesión.",
    tandas: [
      {
        mes: "Octubre 2026",
        imagen: "/images/cursos-abiertos/formacion-guardia-seguridad-edit-octubre-jpg-88c7c408",
        fechas: [
          {
            fecha: "2026-10-01",
            ciudad: "Calama",
            idCalendarizacion: null
          },
          {
            fecha: "2026-10-01",
            ciudad: "Santiago",
            idCalendarizacion: null
          }
        ]
      }
    ]
  }
];
const OPEN_COURSES = API.map(toOpenCourse);

const RealDate = Date;
const at = <T = ReturnType<typeof getUpcomingBatches>>(
  iso: string,
  fn: () => T = () => getUpcomingBatches(OPEN_COURSES) as T,
) => {
  // @ts-expect-error reemplazo temporal para simular "hoy"
  globalThis.Date = class extends RealDate {
    constructor(...a: unknown[]) {
      super(...((a.length ? a : [iso]) as []));
    }
    static now() {
      return new RealDate(iso).getTime();
    }
  };
  const r = fn();
  globalThis.Date = RealDate;
  return r;
};

// Antes de todo: ambas tandas, la más próxima primero
let r = at('2026-08-20T10:00:00');
assert.deepStrictEqual(r.months, ['Septiembre 2026', 'Octubre 2026']);

// A mitad de septiembre caen las fechas pasadas, no el mes entero
r = at('2026-09-12T10:00:00');
const altura = r.courses.find((c) => c.titleHighlight === 'Altura Física')!;
assert.deepStrictEqual(altura.batches[0].sessions.map((s) => s.label), ['22-09-2026']);

// En octubre septiembre desaparece, y con él los cursos que solo se dictaban ese mes
r = at('2026-10-02T10:00:00');
assert.deepStrictEqual(r.months, ['Octubre 2026']);
assert.ok(!r.courses.some((c) => c.titleHighlight === 'Aislación y Bloqueo'));
assert.deepStrictEqual(r.courses.map((c) => c.titleHighlight), [
  'Altura Física',
  'Confinados',
  'Sustancias Peligrosas',
]);

// El día mismo de la fecha sigue vigente
r = at('2026-10-01T23:00:00');
assert.ok(r.courses.some((c) => c.titleHighlight === 'Gestión de Mantenimiento'));

// coursesForMonth resuelve el afiche de la tanda, no el del curso
r = at('2026-09-12T10:00:00');
for (const curso of coursesForMonth('Octubre 2026', r.courses)) {
  const tanda = curso.batches.find((b) => b.month === 'Octubre 2026')!;
  assert.strictEqual(curso.image, tanda.image);
}

// Todo pasado: sin cursos ni tandas, la sección no debe reventar
assert.deepStrictEqual(at('2027-01-01T10:00:00'), { courses: [], months: [] });

// El select del formulario no puede repetir ids ni perder la modalidad del curso
const sel = at('2026-08-20T10:00:00', () => getSessionsWithoutCalendar(OPEN_COURSES));
assert.strictEqual(new Set(sel.map((s) => s.id)).size, sel.length);
assert.ok(sel.filter((s) => s.nombreCurso.includes('SAP')).every((s) => s.modalidad === '2'));

// El backend solo acepta Presencial (1) u Online (2): ninguna fecha puede mandar otra cosa
assert.ok(sel.every((s) => s.modalidad === '1' || s.modalidad === '2'));

// Blended: dos fechas el mismo día, distinguibles solo por la sede que viaja en el nombre
const guardia = sel.filter((s) => s.nombreCurso.includes('Guardia'));
assert.strictEqual(guardia.length, 2);
assert.deepStrictEqual(
  guardia.map((s) => s.nombreCurso.split(' · ')[1]),
  ['Calama', 'Santiago'],
);
assert.ok(guardia.every((s) => s.modalidad === '1'));

// ?mes= de una campaña: tolera tildes, mayúsculas y el año; lo que no calza no filtra nada
const meses = ['Septiembre 2026', 'Octubre 2026'];
assert.strictEqual(matchMonthParam('octubre', meses), 'Octubre 2026');
assert.strictEqual(matchMonthParam('Octubre', meses), 'Octubre 2026');
assert.strictEqual(matchMonthParam('octubre-2026', meses), 'Octubre 2026');
assert.strictEqual(matchMonthParam('septiembre', meses), 'Septiembre 2026');
assert.strictEqual(matchMonthParam('diciembre', meses), undefined);
assert.strictEqual(matchMonthParam(null, meses), undefined);

// La ciudad sale de la fecha: el OS10 en Santiago no puede preseleccionar Calama
assert.strictEqual(getSessionCity(OPEN_COURSES, '-6-2026-10-01-Santiago'), 'Santiago');
assert.strictEqual(getSessionCity(OPEN_COURSES, '-6-2026-10-01-Calama'), 'Calama');
assert.strictEqual(getSessionCity(OPEN_COURSES, '-1-2026-10-06'), undefined);
assert.strictEqual(getSessionCity(OPEN_COURSES, undefined), undefined);

// Una fecha con calendarización en el TMS viaja con su id real y sale del select de texto libre
const conR02 = toOpenCourse({ ...API[0], tandas: [{ ...API[0].tandas[1], fechas: [{ fecha: '2026-10-06', ciudad: null, idCalendarizacion: 468 }] }] });
assert.strictEqual(conR02.batches[0].sessions[0].id, '468');
assert.strictEqual(conR02.batches[0].sessions[0].label, '06-10-2026');

// El backend agrupa en el R08 por este código y rechaza lo que no empiece en "WEB-":
// un curso nuevo sin código volvería a no generar interesados.
for (const curso of OPEN_COURSES) {
  assert.ok(curso.webCode.startsWith('WEB-'), `${curso.titleHighlight}: webCode inválido`);
  assert.ok(curso.webCode.length <= 50);
}
assert.strictEqual(new Set(OPEN_COURSES.map((c) => c.webCode)).size, OPEN_COURSES.length);
assert.ok(sel.every((s) => s.codigoCursoWeb?.startsWith('WEB-')));

console.log('openCourses: OK');
