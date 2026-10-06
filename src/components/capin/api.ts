// Chat de la burbuja con Capin (CAPIN/RAG-service, ChatCapin RQ-CHAT-23). El navegador llama a
// Capin directo, sin TMS: `POST /chat` sin API key es el modo público, que solo conoce el nombre y
// las horas de los cursos vigentes. Mismo stream NDJSON que la burbuja del TMS
// (tmsFrontend/features/capin/api.ts), con el contrato público.

/** Máximo de mensajes de historial que acepta el modo público de Capin. */
export const MAX_HISTORIAL = 12;
/** Largo máximo de una pregunta en el modo público. */
export const MAX_PREGUNTA = 1000;

export interface CursoPublico {
  curso: string;
  horas: number | null;
}

/** El comercial de turno: a quién escribirle para cotizar (solo datos de trabajo). */
export interface ComercialTurno {
  nombre: string;
  correo: string | null;
  telefono: string | null;
}

/** Una consulta que hizo Capin (llega en vivo). */
export interface PasoCapin {
  id: number;
  descripcion: string;
  estado: 'EN_CURSO' | 'OK' | 'ERROR';
  resultados?: number | null;
  muestra?: string[];
  ms?: number;
}

export type EventoChat =
  | ({ tipo: 'paso' } & PasoCapin)
  | {
      tipo: 'fin';
      estado: 'OK' | 'TIMEOUT' | 'ERROR' | 'SIN_CUPO' | 'CANCELADA';
      respuesta: string | null;
      cursos: CursoPublico[];
      pasos: PasoCapin[];
      comercial?: ComercialTurno | null;
    };

export interface MensajeChat {
  rol: 'user' | 'assistant';
  texto: string;
  cursos?: CursoPublico[];
  comercial?: ComercialTurno | null;
  /** Aviso de error: se muestra pero no viaja como historial. */
  error?: boolean;
}

/** Error con un mensaje listo para mostrar. */
export class ErrorCapin extends Error {}

// En dev el proxy de Vite (/capin → CAPIN_PROXY_TARGET) evita CORS; en prod va a la URL de Capin.
const urlChat = () =>
  import.meta.env.PROD ? `${import.meta.env.VITE_CAPIN_API_URL}/chat` : '/capin/chat';

/** Separa las líneas completas de un buffer NDJSON; lo que queda sin salto espera al próximo trozo. */
export function separarLineas(buffer: string): { lineas: string[]; resto: string } {
  const partes = buffer.split('\n');
  const resto = partes.pop() ?? '';
  return { lineas: partes.map((l) => l.trim()).filter(Boolean), resto };
}

/** El historial que acepta Capin: sin avisos de error, los últimos 12 y empezando por una pregunta. */
export function historial(mensajes: MensajeChat[]): { rol: string; texto: string }[] {
  const validos = mensajes.filter((m) => !m.error).slice(-MAX_HISTORIAL);
  const desde = validos.findIndex((m) => m.rol === 'user');
  return (desde < 0 ? [] : validos.slice(desde)).map(({ rol, texto }) => ({ rol, texto }));
}

export async function preguntar(
  mensajes: MensajeChat[],
  onEvento: (e: EventoChat) => void,
  textos: { limite: string; sinConexion: string },
  signal?: AbortSignal,
) {
  const r = await fetch(urlChat(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ mensajes: historial(mensajes) }),
    signal,
  });
  if (r.status === 429) throw new ErrorCapin(textos.limite);
  if (!r.ok || !r.body) throw new ErrorCapin(textos.sinConexion);

  const lector = r.body.pipeThrough(new TextDecoderStream()).getReader();
  let pendiente = '';
  for (;;) {
    const { value, done } = await lector.read();
    if (done) break;
    const { lineas, resto } = separarLineas(pendiente + value);
    pendiente = resto;
    lineas.forEach((l) => onEvento(JSON.parse(l) as EventoChat));
  }
  if (pendiente.trim()) onEvento(JSON.parse(pendiente) as EventoChat);
}
