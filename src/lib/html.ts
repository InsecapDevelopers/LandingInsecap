/**
 * Utilidades de HTML puras (sin DOM): funcionan igual en el navegador y en el prerender (Node),
 * así el texto que sale en el HTML del build es el mismo que calcula el cliente al hidratar.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  aacute: 'á',
  eacute: 'é',
  iacute: 'í',
  oacute: 'ó',
  uacute: 'ú',
  Aacute: 'Á',
  Eacute: 'É',
  Iacute: 'Í',
  Oacute: 'Ó',
  Uacute: 'Ú',
  ntilde: 'ñ',
  Ntilde: 'Ñ',
  uuml: 'ü',
  Uuml: 'Ü',
  ccedil: 'ç',
  atilde: 'ã',
  otilde: 'õ',
  acirc: 'â',
  ecirc: 'ê',
  ocirc: 'ô',
  iexcl: '¡',
  iquest: '¿',
  laquo: '«',
  raquo: '»',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  deg: '°',
  ordm: 'º',
  ordf: 'ª',
  middot: '·',
  bull: '•',
};

/** Decodifica entidades HTML con nombre (las de NAMED_ENTITIES) y numéricas (`&#233;`, `&#xE9;`). */
export const decodeHtmlEntities = (text: string): string =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const codePoint = entity[1] === 'x' || entity[1] === 'X'
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10);
      return Number.isFinite(codePoint) && codePoint > 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : match;
    }
    return NAMED_ENTITIES[entity] ?? match;
  });

/**
 * Texto plano de un fragmento HTML: quita script/style y etiquetas, decodifica entidades y
 * colapsa espacios. Los cierres de bloque (p, li, h1…) y los <br> se vuelven espacio para que
 * no se peguen las palabras de párrafos distintos.
 */
export const stripHtml = (html: string): string =>
  decodeHtmlEntities(
    html
      .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6]|tr|td|th|blockquote|section|article)\s*>/gi, ' ')
      .replace(/<[^>]*>/g, ''),
  )
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Agrega `alt` a los <img> de un fragmento HTML que no lo traen (cuerpo de las noticias del TMS).
 * Los que ya tienen alt (incluso vacío) no se tocan. Puro: el prerender y el cliente producen el
 * mismo HTML, sin desfase al hidratar.
 */
export const withImageAlts = (html: string, altFor: (index: number) => string): string => {
  let index = 0;
  return html.replace(/<img\b([^>]*?)(\s*\/?)>/gi, (tag, attrs: string, end: string) => {
    if (/\salt\s*=/i.test(attrs)) return tag;
    index += 1;
    const alt = altFor(index).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `<img${attrs} alt="${alt}"${end}>`;
  });
};
