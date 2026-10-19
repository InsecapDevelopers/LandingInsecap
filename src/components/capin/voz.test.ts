// node --test src/components/capin/voz.test.ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { frasesParaVoz, MAX_FRASE } from './voz.ts';

test('lista de cursos: sin viñetas y con las horas en palabras', () => {
  const frases = frasesParaVoz('Tenemos estos cursos:\n- Trabajo en Altura · 8 h\n- Rigger · 1 h');
  assert.equal(frases.join(' '), 'Tenemos estos cursos: Trabajo en Altura, de 8 horas. Rigger, de 1 hora.');
});

test('separa oraciones y junta las muy cortas', () => {
  const largo = 'Te ayudo a encontrar cursos de INSECAP y te digo cuántas horas dura cada uno de ellos.';
  const frases = frasesParaVoz(`¡Hola! Soy Capín. ${largo} ¿Qué buscas?`);
  assert.equal(frases[0].startsWith('¡Hola! Soy Capín.'), true);
  assert.equal(frases.at(-1)?.endsWith('¿Qué buscas?'), true);
});

test('sin enlaces y ninguna frase pasa del máximo de /tts', () => {
  const frases = frasesParaVoz(`Escríbele a https://wa.me/56900000000 hoy. ${'palabra '.repeat(150)}`);
  assert.equal(frases.some((f) => f.includes('http')), false);
  assert.equal(frases.every((f) => f.length <= MAX_FRASE), true);
});
