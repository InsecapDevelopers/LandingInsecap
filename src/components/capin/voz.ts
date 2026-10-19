// Texto de una respuesta de Capin → frases para leer en voz alta (vista /forede). Sin dependencias,
// para probarlo con `node --test src/components/capin/voz.test.ts`.

/** Largo máximo de una frase que acepta `/tts` de Capin. */
export const MAX_FRASE = 400;
/** Por debajo de esto una frase se junta con la siguiente: menos pedidos y una entonación más natural. */
const MIN_FRASE = 60;

/** Cómo se lee una línea: sin viñetas ni enlaces, y "· 8 h" como "de 8 horas". */
const paraLeer = (linea: string): string =>
  linea
    .replace(/https?:\/\/\S+/g, '')
    .replace(/^\s*[-•*]\s+/, '')
    .replace(/\s*·\s*([\d.,]+)\s*h\b/g, (_m, horas: string) => `, de ${horas} ${horas === '1' ? 'hora' : 'horas'}`)
    .replace(/\s+/g, ' ')
    .trim();

/** Corta un texto largo en trozos de a lo más `max` caracteres, por comas o espacios. */
const cortar = (texto: string, max: number): string[] => {
  const trozos: string[] = [];
  let resto = texto;
  while (resto.length > max) {
    const corte = Math.max(resto.lastIndexOf(', ', max), resto.lastIndexOf(' ', max));
    const i = corte > max / 2 ? corte + 1 : max;
    trozos.push(resto.slice(0, i).trim());
    resto = resto.slice(i).trim();
  }
  if (resto) trozos.push(resto);
  return trozos;
};

/**
 * Frases en el orden en que se leen. Cada línea termina en punto (las de una lista también), las
 * oraciones se separan en . ! ? y las muy cortas se juntan con la siguiente.
 */
export function frasesParaVoz(texto: string): string[] {
  const oraciones = texto
    .split('\n')
    .map(paraLeer)
    .filter(Boolean)
    .map((linea) => (/[.!?…:]$/.test(linea) ? linea : `${linea}.`))
    .flatMap((linea) => linea.split(/(?<=[.!?…])\s+/))
    .flatMap((oracion) => cortar(oracion, MAX_FRASE));

  const frases: string[] = [];
  for (const oracion of oraciones) {
    const ultima = frases[frases.length - 1];
    if (ultima && ultima.length < MIN_FRASE && ultima.length + oracion.length + 1 <= MAX_FRASE) {
      frases[frases.length - 1] = `${ultima} ${oracion}`;
    } else {
      frases.push(oracion);
    }
  }
  return frases;
}
