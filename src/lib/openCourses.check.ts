/**
 * Check del filtro por fecha de los cursos abiertos. Sin runner de tests en el proyecto:
 *   npx esbuild src/lib/openCourses.check.ts --bundle --platform=node --format=esm \
 *     --alias:@=./src --outfile=/tmp/c.mjs && node /tmp/c.mjs
 */
import assert from 'node:assert';
import {
  OPEN_COURSES,
  getUpcomingBatches,
  coursesForMonth,
  getSessionsWithoutCalendar,
  getSessionCity,
  matchMonthParam,
} from './openCourses';

const RealDate = Date;
const at = (iso: string) => {
  // @ts-expect-error reemplazo temporal para simular "hoy"
  globalThis.Date = class extends RealDate {
    constructor(...a: unknown[]) {
      super(...((a.length ? a : [iso]) as []));
    }
    static now() {
      return new RealDate(iso).getTime();
    }
  };
  const r = getUpcomingBatches(OPEN_COURSES);
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
assert.deepStrictEqual(r.courses.map((c) => c.titleHighlight), ['Altura Física', 'Confinados']);

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
const sel = getSessionsWithoutCalendar();
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
assert.strictEqual(getSessionCity('-28'), 'Santiago');
assert.strictEqual(getSessionCity('-27'), 'Calama');
assert.strictEqual(getSessionCity('-20'), undefined);
assert.strictEqual(getSessionCity(undefined), undefined);

// El backend agrupa en el R08 por este código y rechaza lo que no empiece en "WEB-":
// un curso nuevo sin código volvería a no generar interesados.
for (const curso of OPEN_COURSES) {
  assert.ok(curso.webCode.startsWith('WEB-'), `${curso.titleHighlight}: webCode inválido`);
  assert.ok(curso.webCode.length <= 50);
}
assert.strictEqual(new Set(OPEN_COURSES.map((c) => c.webCode)).size, OPEN_COURSES.length);
assert.ok(sel.every((s) => s.codigoCursoWeb?.startsWith('WEB-')));

console.log('openCourses: OK');
