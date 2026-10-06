/**
 * Reglas de title y description (decisiones tarea #8, Fase 3). Funciones puras: dan el mismo
 * resultado en el prerender (Node) y en el cliente al hidratar.
 *
 * - title: keyword primero y marca al final (`<keyword> | INSECAP`), 60 caracteres o menos.
 * - description: 140–155 caracteres. Si el texto base es corto se completa con frases fijas del
 *   idioma (`seo.fillers` en translations.ts); si es largo se corta en una frase o palabra.
 *
 * scripts/check-dist.mjs repite estos límites como contrato del build.
 */
import { resources, type AppLanguage } from './translations';

export const SEO_BRAND = 'INSECAP';
export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 140;
export const DESCRIPTION_MAX = 155;

/** Imagen social por defecto, servida desde el dominio (public/og/).
 *  TODO: imágenes 1200×630 por sección (cursos, sedes, SAP, simuladores…), sección 4, punto 10. */
export const DEFAULT_OG_IMAGE = {
  path: '/og/insecap-default-1200x630.png',
  width: 1200,
  height: 630,
  type: 'image/png',
};

const TITLE_SEPARATOR = ' | ';

/** Palabras que no deben quedar al final de un texto recortado (es, en, pt). */
const TRAILING_WORD = /\s+(de|del|la|las|el|los|y|e|o|u|en|a|al|con|por|para|su|sus|un|una|que|sobre|the|of|and|for|to|in|with|on|at|da|do|das|dos|em|no|na|nos|nas|com|um|uma)$/i;
const TRAILING_PUNCTUATION = /[\s,;:–—\-(/]+$/;
/** Última palabra que abre comillas o paréntesis sin cerrarlos (`podcast "Hablemos`). */
const TRAILING_OPEN_QUOTE = /\s+["“«(][^\s"”»)]*$/;

/** Colapsa espacios y quita los que quedan antes de la puntuación ("Fama ," → "Fama,"). */
export const cleanSeoText = (text: string): string =>
  text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?)»”])/g, '$1')
    .trim();

/** Corta en la última palabra completa que cabe en `max` y limpia el final. */
const cutAtWord = (text: string, max: number): string => {
  if (text.length <= max) return text;
  let cut = text.slice(0, max + 1);
  cut = cut.slice(0, Math.max(cut.lastIndexOf(' '), 0)) || text.slice(0, max);
  let previous;
  do {
    previous = cut;
    cut = cut.replace(TRAILING_OPEN_QUOTE, '').replace(TRAILING_PUNCTUATION, '').replace(TRAILING_WORD, '');
  } while (cut !== previous);
  return cut;
};

/** `<keyword> | INSECAP`, recortando la keyword en una palabra si no cabe en 60. */
export const buildSeoTitle = (keyword?: string | null): string => {
  const suffix = `${TITLE_SEPARATOR}${SEO_BRAND}`;
  const max = TITLE_MAX - suffix.length;
  let text = keyword ? cleanSeoText(keyword) : '';
  if (!text) return SEO_BRAND;
  // Si hay que recortar y la keyword empieza con la marca ("INSECAP reconoce…"), se quita del
  // inicio: ya va al final y así cabe más texto propio (evita titles duplicados al recortar).
  const withoutBrand = text.replace(new RegExp(`^${SEO_BRAND}\\b[\\s:,–-]*`, 'i'), '');
  if (text.length > max && withoutBrand && withoutBrand !== text) {
    text = `${withoutBrand[0].toUpperCase()}${withoutBrand.slice(1)}`;
  }
  return `${cutAtWord(text, max)}${suffix}`;
};

const endsSentence = (text: string) => /[.!?…]$/.test(text);

const appendSentence = (text: string, sentence: string) =>
  text ? `${text}${endsSentence(text) ? '' : '.'} ${sentence}` : sentence;

/** Corta un texto largo a 155: en el fin de una frase si queda en rango; si no, en una palabra con "…". */
const truncateDescription = (text: string): string => {
  if (text.length <= DESCRIPTION_MAX) return text;
  const window = text.slice(0, DESCRIPTION_MAX);
  for (let index = window.length - 1; index >= DESCRIPTION_MIN - 1; index -= 1) {
    if (/[.!?]/.test(window[index]) && text[index + 1] === ' ') {
      return window.slice(0, index + 1);
    }
  }
  return `${cutAtWord(text, DESCRIPTION_MAX - 1)}…`;
};

/**
 * Description de 140–155 caracteres a partir de un texto base y frases de relleno.
 * - Texto de 140 o más: sus frases completas, en orden, mientras quepan en 155; si así no llega
 *   a 140, el texto cortado en una frase o palabra.
 * - Texto más corto: se le suman los rellenos que quepan (en orden, saltando los que no entran);
 *   si aun así no llega, todo junto cortado con "…".
 */
export const fitDescription = (text: string | null | undefined, fillers: readonly string[] = []): string => {
  const base = cleanSeoText(text ?? '');

  if (base.length >= DESCRIPTION_MIN) {
    let description = '';
    for (const sentence of base.split(/(?<=[.!?])\s+/)) {
      const next = appendSentence(description, sentence);
      if (next.length > DESCRIPTION_MAX) break;
      description = next;
    }
    return description.length >= DESCRIPTION_MIN ? description : truncateDescription(base);
  }

  let description = base;
  for (const filler of fillers) {
    if (description.length >= DESCRIPTION_MIN) break;
    if (description.includes(filler)) continue;
    const next = appendSentence(description, filler);
    if (next.length <= DESCRIPTION_MAX) description = next;
  }
  if (description.length >= DESCRIPTION_MIN) return description;

  return truncateDescription(fillers.reduce((all, filler) => (all.includes(filler) ? all : appendSentence(all, filler)), base));
};

interface SeoPageText {
  title: string;
  description: string;
}

type SeoDictionary = {
  fillers: readonly string[];
  imageAlt: string;
  pages: Record<string, SeoPageText>;
};

const seoDictionary = (locale: AppLanguage) =>
  (resources[locale].translation as unknown as { seo: SeoDictionary }).seo;

/** Frases de relleno del idioma para completar descriptions cortas. */
export const getSeoFillers = (locale: AppLanguage): readonly string[] => seoDictionary(locale).fillers;

export const getSeoImageAlt = (locale: AppLanguage): string => seoDictionary(locale).imageAlt;

/**
 * Title y description escritos a mano para una página (`seo.pages.<clave>` en translations.ts).
 * Sin respaldo a otro idioma: una clave que falta en en o pt devuelve null (no se duplica el
 * texto de es). `{{param}}` se reemplaza con `params`.
 */
export const getSeoPageText = (
  locale: AppLanguage,
  key: string,
  params: Record<string, string | number> = {},
): SeoPageText | null => {
  const text = seoDictionary(locale).pages[key];
  if (!text) return null;
  const fill = (value: string) => value.replace(/\{\{(\w+)\}\}/g, (match, name: string) => String(params[name] ?? match));
  return { title: fill(text.title), description: fill(text.description) };
};
