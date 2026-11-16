/**
 * Check del esquema del formulario de derechos (derechosDatos.ts). Sin runner de tests en el proyecto:
 *   npx esbuild src/lib/derechosDatos.check.ts --bundle --platform=node --format=esm \
 *     --alias:@=./src --outfile=/tmp/d.mjs && node /tmp/d.mjs
 * Los RUN son placeholders evidentes (11.111.111-1, 22.222.222-2), no de personas reales.
 */
import assert from 'node:assert';
import {
  calcularDv, camposFormulario, esRunValido, normalizarRun, validarSolicitud, LIMITES,
  type SolicitudDerechos,
} from './derechosDatos';

// RUN: dígito verificador módulo 11, con y sin formato
assert.equal(calcularDv('11111111'), '1');
assert.equal(calcularDv('22222222'), '2');
assert.ok(esRunValido('11.111.111-1'));
assert.ok(esRunValido('111111111'));
assert.ok(esRunValido('22222222-2'));
assert.ok(!esRunValido('11.111.111-2'), 'DV incorrecto');
assert.ok(!esRunValido('12345'), 'muy corto');
assert.ok(!esRunValido('123.456.789-0'), 'muy largo');
assert.ok(!esRunValido('abc'), 'basura');
assert.ok(!esRunValido(''), 'vacío');
// DV K: el cuerpo 10000013 da K
assert.equal(calcularDv('10000013'), 'K');
assert.ok(esRunValido('10.000.013-k'), 'K minúscula');
assert.equal(normalizarRun('11.111.111-1'), '11111111-1');

const buena: SolicitudDerechos = {
  derechos: ['acceso', 'supresion'],
  nombreCompleto: 'Persona De Prueba',
  run: '11.111.111-1',
  correo: 'titular@example.com',
  telefono: '',
  esRepresentante: false,
  nombreRepresentante: '',
  descripcion: 'Quiero saber qué datos míos tienen y que los eliminen.',
  adjunto: null,
  aceptaPolitica: true,
};

// Caso bueno
assert.deepEqual(validarSolicitud(buena), {});
assert.deepEqual(validarSolicitud({
  ...buena,
  telefono: '+56 9 0000 0000',
  esRepresentante: true,
  nombreRepresentante: 'Representante De Prueba',
  adjunto: { name: 'cedula.PDF', size: 1024, type: 'application/pdf' },
}), {});
assert.deepEqual(validarSolicitud({ ...buena, adjunto: { name: 'foto.jpg', size: 2048, type: '' } }), {});

// Casos malos
assert.equal(validarSolicitud({ ...buena, derechos: [] }).derechos, 'requerido');
assert.equal(validarSolicitud({ ...buena, derechos: ['otro' as never] }).derechos, 'invalido');
assert.equal(validarSolicitud({ ...buena, nombreCompleto: '  ' }).nombreCompleto, 'requerido');
assert.equal(validarSolicitud({ ...buena, nombreCompleto: 'x'.repeat(LIMITES.nombre + 1) }).nombreCompleto, 'largo');
assert.equal(validarSolicitud({ ...buena, run: '' }).run, 'requerido');
assert.equal(validarSolicitud({ ...buena, run: '11.111.111-2' }).run, 'invalido');
assert.equal(validarSolicitud({ ...buena, correo: 'sin-arroba' }).correo, 'invalido');
assert.equal(validarSolicitud({ ...buena, correo: '' }).correo, 'requerido');
assert.equal(validarSolicitud({ ...buena, telefono: 'llámame' }).telefono, 'invalido');
assert.equal(validarSolicitud({ ...buena, esRepresentante: true }).nombreRepresentante, 'requerido');
assert.equal(validarSolicitud({ ...buena, descripcion: '' }).descripcion, 'requerido');
assert.equal(validarSolicitud({ ...buena, descripcion: 'corto' }).descripcion, 'corto');
assert.equal(validarSolicitud({ ...buena, descripcion: 'x'.repeat(LIMITES.descripcion + 1) }).descripcion, 'largo');
assert.equal(validarSolicitud({ ...buena, adjunto: { name: 'cv.docx', size: 10, type: 'application/msword' } }).adjunto, 'tipoArchivo');
assert.equal(validarSolicitud({ ...buena, adjunto: { name: 'x.png', size: 10, type: 'application/pdf' } }).adjunto, undefined);
assert.equal(validarSolicitud({ ...buena, adjunto: { name: 'x.exe', size: 10, type: 'image/png' } }).adjunto, 'tipoArchivo');
assert.equal(validarSolicitud({ ...buena, adjunto: { name: 'x.png', size: LIMITES.adjuntoBytes + 1, type: 'image/png' } }).adjunto, 'pesoArchivo');
assert.equal(validarSolicitud({ ...buena, adjunto: { name: 'x.png', size: 0, type: 'image/png' } }).adjunto, 'pesoArchivo');
assert.equal(validarSolicitud({ ...buena, aceptaPolitica: false }).aceptaPolitica, 'requerido');

// Multipart: nombres exactos del contrato
const campos = camposFormulario(buena, { idioma: 'es', sitioWeb: '', tiempoLlenadoMs: 12345.6 });
assert.deepEqual(campos.map(([k]) => k), [
  'Derechos[0]', 'Derechos[1]', 'NombreCompleto', 'Run', 'Correo', 'EsRepresentante',
  'Descripcion', 'AceptaPolitica', 'Idioma', 'SitioWeb', 'TiempoLlenadoMs',
]);
assert.deepEqual(Object.fromEntries(campos), {
  'Derechos[0]': 'acceso', 'Derechos[1]': 'supresion', NombreCompleto: 'Persona De Prueba',
  Run: '11111111-1', Correo: 'titular@example.com', EsRepresentante: 'false',
  Descripcion: buena.descripcion, AceptaPolitica: 'true', Idioma: 'es', SitioWeb: '', TiempoLlenadoMs: '12346',
});
const conRep = Object.fromEntries(camposFormulario(
  { ...buena, esRepresentante: true, nombreRepresentante: ' Rep ', telefono: '+56 9 0000 0000' },
  { idioma: 'en', sitioWeb: '', tiempoLlenadoMs: 5000 },
));
assert.equal(conRep.NombreRepresentante, 'Rep');
assert.equal(conRep.Telefono, '+56 9 0000 0000');

console.log('derechosDatos.check: OK');
