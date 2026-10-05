/**
 * Check de la captura de atribución. Sin runner de tests en el proyecto:
 *   npx esbuild src/lib/attribution.check.ts --bundle --platform=node --format=esm \
 *     --alias:@=./src --outfile=/tmp/a.mjs && node /tmp/a.mjs
 */
import assert from 'node:assert';
import { nextAttribution, toPayload, isoWithOffset, type Attribution } from './attribution';

const SITE = 'insecap.cl';
const now = new Date('2026-10-05T12:12:44Z');
const later = (days: number) => new Date(now.getTime() + days * 86_400_000);

// 1. Clic pagado: guarda los parámetros, la página de entrada sin query y expira en 90 días
const paid = nextAttribution(null, '?gclid=TEST123&utm_source=google&utm_medium=cpc&utm_campaign=Prueba',
  '/es/curso-empresa/curso-rigger', 'https://www.google.com/', SITE, now)!;
assert.equal(paid.gclid, 'TEST123');
assert.equal(paid.utmCampaign, 'Prueba');
assert.equal(paid.utmTerm, null);
assert.equal(paid.landingPage, '/es/curso-empresa/curso-rigger');
assert.equal(paid.referrer, 'https://www.google.com/');
assert.equal(new Date(paid.expira).getTime(), later(90).getTime());

// 2. Navegación interna sin parámetros: se conserva el mismo registro
assert.equal(nextAttribution(paid, '', '/es/contacto', 'https://www.google.com/', SITE, later(1)), paid);

// 3. Visita orgánica posterior no pisa el clic pagado vigente
assert.equal(nextAttribution(paid, '', '/es', 'https://www.bing.com/', SITE, later(10)), paid);

// 4. Último clic gana y no mezcla campos viejos
const second = nextAttribution(paid, '?gbraid=G2', '/es/especialidades/sap-pm', '', SITE, later(5))!;
assert.equal(second.gbraid, 'G2');
assert.equal(second.gclid, null);
assert.equal(second.utmSource, null);
assert.equal(second.referrer, null);

// 5. Orgánico sin registro previo: solo referrer, landingPage y primeraVisita
const organic = nextAttribution(null, '', '/es/cursos-abiertos', 'https://www.google.cl/', SITE, now)!;
assert.equal(organic.gclid, null);
assert.equal(organic.referrer, 'https://www.google.cl/');

// 6. Directo o referrer del propio sitio: nada
assert.equal(nextAttribution(null, '', '/es', '', SITE, now), null);
assert.equal(nextAttribution(null, '', '/es/contacto', 'https://www.insecap.cl/es', SITE, now), null);

// 7. Vencido: se borra; y si la visita trae parámetros, se reemplaza
assert.equal(nextAttribution(paid, '', '/es', '', SITE, later(91)), null);
assert.equal(nextAttribution(paid, '?utm_source=meta', '/es', '', SITE, later(91))!.utmSource, 'meta');

// 8. Payload: sin `expira` y recortado
const long = { ...paid, gclid: 'x'.repeat(300), referrer: 'r'.repeat(1200) } as Attribution;
const payload = toPayload(long);
assert.equal('expira' in payload, false);
assert.equal(payload.gclid!.length, 255);
assert.equal(payload.referrer!.length, 1000);

// 9. Fecha con zona horaria
assert.match(isoWithOffset(now), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);

console.log('attribution.check: OK');
