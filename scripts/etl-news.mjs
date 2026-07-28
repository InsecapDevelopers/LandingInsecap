/**
 * ETL: news-export/articles.json (crudo de Shopify) -> news-export/noticias.json (modelo interno).
 *
 * Descarta lo que no aplica al sistema nuevo (shopify_id, blog_handle, tags, excerpt vacío)
 * y deriva lo que Shopify no entregaba (subtítulo, alt de portada, galería, tiempo de lectura).
 *
 * Uso: node scripts/etl-news.mjs [--report]
 */
import fs from 'node:fs';
import path from 'node:path';

const IN = path.join(process.cwd(), 'news-export/articles.json');
const OUT = path.join(process.cwd(), 'news-export/noticias.json');
const REPORT_ONLY = process.argv.includes('--report');

const SUBTITULO_MAX = 300;

const stripHtml = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    // quitar etiquetas inline (<strong>, <span>) deja espacios sueltos antes de la puntuación
    .replace(/\s+([,.;:!?%)])/g, '$1')
    .replace(/([(¿¡])\s+/g, '$1')
    .trim();

/** Primer bloque de texto real del cuerpo, sin importar la etiqueta (p, h3, div, span…). */
const derivarSubtitulo = (html) => {
  const bloques = html.split(/<\/(?:p|h[1-6]|div|li|section|article)>/i);
  let texto = '';
  for (const b of bloques) {
    const t = stripHtml(b);
    if (t.length >= 40) { texto = t; break; }
  }
  if (!texto) texto = stripHtml(html);
  if (texto.length <= SUBTITULO_MAX) return texto || null;
  // corta en el límite de palabra más cercano, sin partir una palabra
  const corte = texto.slice(0, SUBTITULO_MAX);
  return corte.slice(0, corte.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '') + '…';
};

/** Slug seguro para URL: sin emoji ni caracteres fuera de [a-z0-9-]. Sin truncar: cortar
 *  a un largo fijo parte palabras y rompe la URL heredada sin ganancia (la columna es VARCHAR(255)). */
const normalizarSlug = (slug) =>
  slug
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const extraerImagenes = (html) =>
  [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);

// Etiquetas que sobreviven; el resto se desenvuelve conservando su texto.
const TAGS_OK = new Set(['p', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'br', 'hr', 'img', 'iframe', 'a', 'blockquote']);
// Atributos que sobreviven, por etiqueta. Todo lo demás (class, style, data-*) se descarta:
// el HTML traía 143 `color` inline y clases de otros editores que rompen el diseño del sitio.
const ATTRS_OK = { img: ['src', 'alt'], a: ['href', 'title'], iframe: ['src', 'title', 'allow', 'allowfullscreen'] };

const limpiarHtml = (html) => {
  let out = html.replace(/<!--[\s\S]*?-->/g, '');

  out = out.replace(/<\/?([a-z][a-z0-9]*)([^>]*)>/gi, (etiqueta, nombre, attrs) => {
    const tag = nombre.toLowerCase();
    if (!TAGS_OK.has(tag)) return ''; // desenvuelve: se va la etiqueta, queda el contenido
    if (etiqueta.startsWith('</')) return `</${tag}>`;

    const permitidos = ATTRS_OK[tag] || [];
    // `val` es undefined en atributos booleanos (allowfullscreen), que se re-emiten sin valor
    const conservados = [...attrs.matchAll(/([a-z-]+)(?:\s*=\s*["']([^"']*)["'])?/gi)]
      .filter(([, nom]) => permitidos.includes(nom.toLowerCase()))
      .map(([, nom, val]) => (val === undefined ? ` ${nom.toLowerCase()}` : ` ${nom.toLowerCase()}="${val}"`))
      .join('');
    const cierre = ['br', 'hr', 'img'].includes(tag) ? ' /' : '';
    return `<${tag}${conservados}${cierre}>`;
  });

  return out
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, '') // párrafos que quedaron vacíos al desenvolver
    .replace(/(?:\s*<br\s*\/?>\s*){3,}/gi, '<br /><br />')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Self-check del limpiador: `node scripts/etl-news.mjs --test`
if (process.argv.includes('--test')) {
  const { strictEqual: eq, ok } = await import('node:assert');
  eq(limpiarHtml('<p class="isSelectedEnd"><span>Hola</span> <strong><span>mundo</span></strong></p>'),
     '<p>Hola <strong>mundo</strong></p>');
  eq(limpiarHtml('<p><span style="color:#ff0000">rojo</span></p>'), '<p>rojo</p>');
  eq(limpiarHtml('<div class="flex"><p>uno</p></div>'), '<p>uno</p>');
  eq(limpiarHtml('<p>a</p><p>&nbsp;</p><p>b</p>'), '<p>a</p><p>b</p>');
  eq(limpiarHtml('<img src="/x.jpg" alt="Foto" class="w-full">'), '<img src="/x.jpg" alt="Foto" />');
  eq(limpiarHtml('<iframe src="https://youtube.com/embed/1" allowfullscreen></iframe>'),
     '<iframe src="https://youtube.com/embed/1" allowfullscreen></iframe>');
  eq(limpiarHtml('<script>alert(1)</script>'), 'alert(1)'); // etiqueta fuera de la whitelist
  eq(derivarSubtitulo('<h3>Un titular con suficiente largo para servir de bajada</h3><p>resto</p>'),
     'Un titular con suficiente largo para servir de bajada'); // no depende de <p>
  ok(derivarSubtitulo('<p>' + 'palabra '.repeat(80) + '</p>').endsWith('…'));
  eq(normalizarSlug('para-nosotros-🎙️-podcast'), 'para-nosotros-podcast');
  console.log('OK: 10 asserts');
  process.exit(0);
}

const articles = JSON.parse(fs.readFileSync(IN, 'utf8'));
const noticias = [];
const avisos = [];
const slugsVistos = new Set();

for (const a of articles) {
  const slug = normalizarSlug(a.slug);
  if (slug !== a.slug) avisos.push(`slug normalizado: "${a.slug}" -> "${slug}"`);
  if (slugsVistos.has(slug)) {
    avisos.push(`SLUG DUPLICADO tras normalizar, se omite: "${slug}"`);
    continue;
  }
  slugsVistos.add(slug);

  const contenidoHtml = limpiarHtml(a.content_html);
  const textoPlano = stripHtml(contenidoHtml);
  const imagenes = extraerImagenes(contenidoHtml);

  if (!a.cover_image) avisos.push(`sin portada: ${slug}`);
  if (textoPlano.length < 200) avisos.push(`cuerpo muy corto (${textoPlano.length} chars): ${slug}`);

  noticias.push({
    slug,
    titulo: a.title.trim(),
    subtitulo: derivarSubtitulo(contenidoHtml),
    contenido_html: contenidoHtml,
    imagen_portada: a.cover_image,
    imagenes,                    // galería del cuerpo, para preview/lightbox
    autor: a.author || null,
    publicado_en: a.published_at,
    // soft delete: null = publicada. Los artículos ocultos en Shopify entran ya "eliminados".
    softDelete: a.visible === false ? a.published_at : null,
  });
}

noticias.sort((x, y) => y.publicado_en.localeCompare(x.publicado_en));

// ---- informe ----
const n = noticias.length;
const conSub = noticias.filter((x) => x.subtitulo).length;
const conPortada = noticias.filter((x) => x.imagen_portada).length;
console.log(`Entrada:  ${articles.length} artículos`);
console.log(`Salida:   ${n} noticias`);
console.log(`Descartado del origen: shopify_id, blog_handle, tags ("Noticia" en todos), excerpt (vacío en todos), updated_at (null), cover_image_alt`);
console.log(`Derivado:  subtítulo ${conSub}/${n} · galería`);
console.log(`Portadas:  ${conPortada}/${n}`);
const bytesAntes = articles.reduce((s, x) => s + x.content_html.length, 0);
const bytesDespues = noticias.reduce((s, x) => s + x.contenido_html.length, 0);
console.log(`HTML:      ${(bytesAntes / 1024).toFixed(0)} KB → ${(bytesDespues / 1024).toFixed(0)} KB (-${Math.round((1 - bytesDespues / bytesAntes) * 100)}%) · quitados class/style/span sin atributos`);
console.log(`Ocultas (soft delete): ${noticias.filter((x) => x.softDelete).length}/${n}`);
console.log(`Imágenes en cuerpo: ${noticias.reduce((s, x) => s + x.imagenes.length, 0)}`);
console.log(`Autores:   ${[...new Set(noticias.map((x) => x.autor))].join(', ')}`);
console.log(`Rango:     ${noticias[n - 1].publicado_en.slice(0, 10)} → ${noticias[0].publicado_en.slice(0, 10)}`);
if (avisos.length) {
  console.log(`\nAvisos (${avisos.length}):`);
  avisos.forEach((m) => console.log('  -', m));
}

if (REPORT_ONLY) {
  console.log('\n--report: no se escribió nada.');
} else {
  fs.writeFileSync(OUT, JSON.stringify(noticias, null, 2));
  console.log(`\nListo: ${OUT}`);
}
