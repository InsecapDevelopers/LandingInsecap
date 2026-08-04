/**
 * ETL: b2b-export/products.json (crudo de Shopify) -> b2b-export/cursos.json (modelo interno).
 *
 * Descarta lo que no aplica al sistema nuevo (shopify_id, vendor, tags de plomería,
 * precios en 0) y normaliza lo que sí sirve: categoría, y las combinaciones
 * modalidad × estándar × horas que hoy viven como variantes de Shopify.
 *
 * Uso: node scripts/etl-b2b.mjs [--report] [--test]
 */
import fs from 'node:fs';
import path from 'node:path';

const IN = path.join(process.cwd(), 'b2b-export/products.json');
const OUT = path.join(process.cwd(), 'b2b-export/cursos.json');
const REPORT_ONLY = process.argv.includes('--report');

// Tags de plomería de Shopify: no describen el curso, solo lo enrutaban en la tienda.
const TAGS_DESCARTADOS = new Set(['b2b', 'cotizacion', 'empresa']);

const stripHtml = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();

/** Horas a número; "A definir" y variantes no numéricas quedan en null. */
const parseHoras = (valor) => {
  const n = Number(String(valor).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const slugify = (valor) =>
  String(valor || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Clave estable para deduplicar combinaciones idénticas entre variantes. */
const claveCombo = (c) => `${c.modalidad}|${c.estandar}|${c.horas ?? 'x'}`;

// Self-check: node scripts/etl-b2b.mjs --test
if (process.argv.includes('--test')) {
  const { strictEqual: eq, deepStrictEqual: deq } = await import('node:assert');
  eq(parseHoras('8'), 8);
  eq(parseHoras('A definir'), null);
  eq(parseHoras('0'), null);
  eq(slugify('Seguridad y Prevención de Riesgos'), 'seguridad-y-prevencion-de-riesgos');
  eq(stripHtml('<p>Curso de <b>AutoCAD</b> , útil</p>'), 'Curso de AutoCAD, útil');
  deq(
    [...new Map([['a', 1], ['a', 2]])].length,
    1,
    'el Map deduplica por clave'
  );
  eq(claveCombo({ modalidad: 'Presencial', estandar: 'Codelco', horas: 8 }), 'Presencial|Codelco|8');
  eq(claveCombo({ modalidad: 'Presencial', estandar: 'Codelco', horas: null }), 'Presencial|Codelco|x');
  console.log('OK: 8 asserts');
  process.exit(0);
}

const productos = JSON.parse(fs.readFileSync(IN, 'utf8'));
const cursos = [];
const avisos = [];
const slugsVistos = new Set();

for (const p of productos) {
  if (slugsVistos.has(p.slug)) {
    avisos.push(`SLUG DUPLICADO, se omite: ${p.slug}`);
    continue;
  }
  slugsVistos.add(p.slug);

  // Las variantes de Shopify son en realidad combinaciones de dictado.
  const combinaciones = [
    ...new Map(
      p.variantes
        .map((v) => ({
          modalidad: v.opciones['Modalidad'] || null,
          estandar: v.opciones['Estándar'] || null,
          horas: parseHoras(v.opciones['Horas']),
        }))
        .filter((c) => c.modalidad || c.estandar || c.horas)
        .map((c) => [claveCombo(c), c])
    ).values(),
  ];

  const categoria = p.categoria?.trim() || null;
  if (!categoria) avisos.push(`sin categoría: ${p.slug}`);
  if (!p.imagen) avisos.push(`sin imagen: ${p.slug}`);
  if (!combinaciones.length) avisos.push(`sin combinaciones de dictado: ${p.slug}`);

  cursos.push({
    slug: p.slug,
    titulo: p.titulo.trim(),
    descripcion: stripHtml(p.descripcion_html) || null,
    categoria,
    categoria_slug: categoria ? slugify(categoria) : null,
    imagen: p.imagen,
    modalidades: [...new Set(combinaciones.map((c) => c.modalidad).filter(Boolean))],
    estandares: [...new Set(combinaciones.map((c) => c.estandar).filter(Boolean))],
    combinaciones,
    visible: true,
  });
}

cursos.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' }));

// ---- informe ----
const n = cursos.length;
const combos = cursos.reduce((s, c) => s + c.combinaciones.length, 0);
const combosOrigen = productos.reduce((s, p) => s + p.variantes.length, 0);
console.log(`Entrada:  ${productos.length} productos · ${combosOrigen} variantes`);
console.log(`Salida:   ${n} cursos · ${combos} combinaciones (${combosOrigen - combos} duplicadas descartadas)`);
console.log(`Descartado del origen: shopify_id, vendor ("Tu Empresa" en todos), precios (0 en todos), tags de plomería (${[...TAGS_DESCARTADOS].join(', ')}), colecciones (duplican la categoría)`);
console.log(`Categorías: ${new Set(cursos.map((c) => c.categoria)).size}`);
console.log(`Con imagen: ${cursos.filter((c) => c.imagen).length}/${n}`);
console.log(`Modalidades: ${[...new Set(cursos.flatMap((c) => c.modalidades))].join(', ')}`);
console.log(`Estándares:  ${new Set(cursos.flatMap((c) => c.estandares)).size} distintos`);
console.log(`Horas sin definir: ${cursos.flatMap((c) => c.combinaciones).filter((c) => c.horas === null).length} combinaciones`);
if (avisos.length) {
  console.log(`\nAvisos (${avisos.length}):`);
  avisos.slice(0, 8).forEach((m) => console.log('  -', m));
  if (avisos.length > 8) console.log(`  … y ${avisos.length - 8} más`);
}

if (REPORT_ONLY) {
  console.log('\n--report: no se escribió nada.');
} else {
  fs.writeFileSync(OUT, JSON.stringify(cursos, null, 2));
  console.log(`\nListo: ${OUT}`);
}
