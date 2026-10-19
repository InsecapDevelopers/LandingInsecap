import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eraser, Maximize, Mic, MicOff, Send, Square, Volume2, VolumeX } from 'lucide-react';
import SEO from '@/components/SEO';
import { CONTACT_EMAIL, getCasaMatriz } from '@/data/sedes';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import {
  ErrorCapin, MAX_PREGUNTA, preguntar, vozDe, whatsappUrl,
  type ComercialTurno, type CursoPublico, type MensajeChat, type PasoCapin,
} from '@/components/capin/api';
import { frasesParaVoz } from '@/components/capin/voz';
import '@/components/capin/capin.css';
import './forede.css';

/**
 * /forede: Capin a pantalla completa para eventos (oculta: sin enlaces, noindex). Se le pregunta
 * por micrófono o teclado y lee la respuesta con la voz de ElevenLabs (`/tts` de Capin), frase por
 * frase: cada frase aparece en pantalla cuando empieza a sonar. Sin voz disponible sigue en texto.
 */

const SUGERENCIAS = [
  '¿Qué cursos de trabajo en altura tienen?',
  'Cursos para operar grúa horquilla',
  '¿Tienen cursos de primeros auxilios?',
  '¿Con quién puedo cotizar un curso?',
];

const TEXTOS = {
  limite: 'Hiciste muchas preguntas seguidas: espera unos minutos y vuelve a intentarlo.',
  sinConexion: 'No pude conectarme con Capín. Intenta de nuevo en unos minutos.',
  noDisponible: 'Capín no está disponible en este momento. Intenta de nuevo en unos minutos.',
};

/** En un evento la pantalla queda sola: tras este tiempo sin actividad vuelve al inicio. */
const REINICIO_MS = 2 * 60 * 1000;

type Estado = 'listo' | 'escuchando' | 'pensando' | 'hablando';

interface Mensaje extends MensajeChat {
  /** Respuesta partida en frases; `leidas` cuántas se muestran (las que ya empezaron a sonar). */
  frases?: string[];
  leidas?: number;
}

// Web Speech API (Chrome/Edge): reconocimiento de voz del navegador, sin costo.
interface Reconocimiento {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type ConstructorReconocimiento = new () => Reconocimiento;
const reconocimientoDisponible = (): ConstructorReconocimiento | null => {
  const w = window as unknown as Record<string, ConstructorReconocimiento | undefined>;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

const aplicarPaso = (pasos: PasoCapin[], p: PasoCapin) => {
  const i = pasos.findIndex((x) => x.id === p.id);
  return i < 0 ? [...pasos, p] : pasos.map((x, j) => (j === i ? p : x));
};

const horas = (h: number | null) => (h === null ? 'A cotizar' : `${String(h).replace('.', ',')} h`);

export default function Forede() {
  const { localizedPath } = useLocalizedPath();
  const matriz = getCasaMatriz();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [pasos, setPasos] = useState<PasoCapin[] | null>(null);
  const [estado, setEstado] = useState<Estado>('listo');
  const [conVoz, setConVoz] = useState(true);
  const [micDisponible, setMicDisponible] = useState(false);

  const abort = useRef<AbortController | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const analizador = useRef<AnalyserNode | null>(null);
  const capin = useRef<HTMLDivElement>(null);
  const reconocedor = useRef<Reconocimiento | null>(null);
  const final = useRef<HTMLDivElement>(null);
  const conVozRef = useRef(conVoz);
  conVozRef.current = conVoz;

  // Lo que depende del navegador se lee después de montar (render determinista para el prerender).
  useEffect(() => setMicDisponible(reconocimientoDisponible() !== null), []);

  useEffect(() => {
    final.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [mensajes, pasos]);

  /** Audio y analizador se crean en el primer gesto (los navegadores bloquean el audio antes). */
  const prepararAudio = useCallback(() => {
    if (audio.current) return;
    audio.current = new Audio();
    try {
      const ctx = new AudioContext();
      const nodo = ctx.createAnalyser();
      nodo.fftSize = 256;
      ctx.createMediaElementSource(audio.current).connect(nodo);
      nodo.connect(ctx.destination);
      analizador.current = nodo;
    } catch {
      /* sin Web Audio: Capin habla igual, sin el halo que sigue el volumen */
    }
  }, []);

  // El halo de Capin sigue el volumen de la voz mientras habla.
  useEffect(() => {
    if (estado !== 'hablando' || !analizador.current) {
      capin.current?.style.setProperty('--nivel', '0');
      return;
    }
    const datos = new Uint8Array(analizador.current.frequencyBinCount);
    let id = 0;
    const medir = () => {
      analizador.current?.getByteFrequencyData(datos);
      const promedio = datos.reduce((s, v) => s + v, 0) / datos.length / 255;
      capin.current?.style.setProperty('--nivel', Math.min(1, promedio * 2.2).toFixed(3));
      id = requestAnimationFrame(medir);
    };
    medir();
    return () => cancelAnimationFrame(id);
  }, [estado]);

  const callar = useCallback(() => {
    abort.current?.abort();
    audio.current?.pause();
  }, []);

  /** Reproduce un audio y espera a que termine (o a que se corte la conversación). */
  const reproducir = (blob: Blob, signal: AbortSignal) =>
    new Promise<void>((resolver) => {
      const reproductor = audio.current;
      if (!reproductor || signal.aborted) return resolver();
      const url = URL.createObjectURL(blob);
      const fin = () => {
        reproductor.removeEventListener('ended', fin);
        reproductor.removeEventListener('error', fin);
        signal.removeEventListener('abort', fin);
        URL.revokeObjectURL(url);
        resolver();
      };
      reproductor.addEventListener('ended', fin);
      reproductor.addEventListener('error', fin);
      signal.addEventListener('abort', fin);
      reproductor.src = url;
      reproductor.play().catch(fin);
    });

  /** Lee la respuesta frase por frase: pide la siguiente mientras suena la actual. */
  const leer = async (indice: number, frases: string[], signal: AbortSignal) => {
    const mostrar = (n: number) =>
      setMensajes((ms) => ms.map((m, i) => (i === indice ? { ...m, leidas: n } : m)));
    if (!conVozRef.current) return mostrar(frases.length);

    const pedidos: Promise<Blob | null>[] = [];
    const pedir = (i: number) => (pedidos[i] ??= vozDe(frases[i], signal));
    setEstado('hablando');
    for (let i = 0; i < frases.length && !signal.aborted; i++) {
      if (i + 1 < frases.length) void pedir(i + 1);
      const blob = await pedir(i);
      if (!blob || !conVozRef.current) break; // sin voz: se muestra el resto de una vez
      mostrar(i + 1);
      await reproducir(blob, signal);
    }
    mostrar(frases.length);
  };

  const enviar = async (pregunta: string) => {
    const limpia = pregunta.trim().slice(0, MAX_PREGUNTA);
    if (!limpia || estado === 'pensando') return;
    prepararAudio();
    callar();
    reconocedor.current?.stop();
    const control = new AbortController();
    abort.current = control;

    const historial: Mensaje[] = [...mensajes, { rol: 'user', texto: limpia }];
    setMensajes(historial);
    setTexto('');
    setPasos([]);
    setEstado('pensando');
    try {
      let respuesta: { texto: string; cursos: CursoPublico[]; comercial: ComercialTurno | null } | null = null;
      await preguntar(
        historial,
        (e) => {
          if (e.tipo === 'paso') setPasos((ps) => aplicarPaso(ps ?? [], e));
          else if (e.estado === 'OK' && e.respuesta) {
            respuesta = { texto: e.respuesta, cursos: e.cursos, comercial: e.comercial ?? null };
          } else if (e.estado !== 'CANCELADA') {
            throw new ErrorCapin(TEXTOS.noDisponible);
          }
        },
        TEXTOS,
        control.signal,
      );
      setPasos(null);
      if (!respuesta) throw new ErrorCapin(TEXTOS.noDisponible);
      const { texto: t, cursos, comercial } = respuesta;
      const frases = frasesParaVoz(t);
      const indice = historial.length;
      setMensajes([...historial, { rol: 'assistant', texto: t, cursos, comercial, frases, leidas: 0 }]);
      await leer(indice, frases, control.signal);
    } catch (e) {
      setPasos(null);
      if (!control.signal.aborted) {
        const aviso = e instanceof ErrorCapin ? e.message : TEXTOS.sinConexion;
        setMensajes([...historial, { rol: 'assistant', texto: aviso, error: true }]);
      }
    } finally {
      if (abort.current === control) setEstado('listo');
    }
  };

  const escuchar = () => {
    const Constructor = reconocimientoDisponible();
    if (!Constructor) return;
    if (estado === 'escuchando') return reconocedor.current?.stop();
    prepararAudio();
    callar();
    const r = new Constructor();
    r.lang = 'es-CL';
    r.interimResults = true;
    r.continuous = false;
    let dicho = '';
    r.onresult = (e) => {
      dicho = Array.from(e.results).map((x) => x[0].transcript).join('');
      setTexto(dicho);
    };
    r.onerror = () => setEstado('listo');
    r.onend = () => {
      reconocedor.current = null;
      setEstado((s) => (s === 'escuchando' ? 'listo' : s));
      if (dicho.trim()) void enviar(dicho); // al terminar de hablar, se envía solo
    };
    reconocedor.current = r;
    setEstado('escuchando');
    r.start();
  };

  const nueva = useCallback(() => {
    callar();
    reconocedor.current?.stop();
    setMensajes([]);
    setPasos(null);
    setTexto('');
    setEstado('listo');
  }, [callar]);

  // Sin actividad durante un rato, vuelve al inicio para la siguiente persona.
  useEffect(() => {
    if (mensajes.length === 0 || estado !== 'listo') return;
    const id = setTimeout(nueva, REINICIO_MS);
    return () => clearTimeout(id);
  }, [mensajes, texto, estado, nueva]);

  useEffect(() => () => callar(), [callar]);

  const pantallaCompleta = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  };

  const estadoTexto: Record<Estado, string> = {
    listo: mensajes.length ? '¿Algo más? Pregúntame otra cosa' : 'Pregúntame por un curso',
    escuchando: 'Te escucho…',
    pensando: 'Buscando…',
    hablando: 'Hablando…',
  };

  const control = 'flex h-12 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white';

  return (
    <div className="forede-fondo capin-root fixed inset-0 flex flex-col overflow-hidden text-white">
      <SEO url="/forede" />

      <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-5 lg:px-10">
        {/* INSECAP y FOREDE: WebP locales (sobre el pliegue), a 2x de su alto en pantalla. */}
        <div className="flex items-center gap-5 lg:gap-8">
          <img src="/images/insecap-logo.webp" alt="INSECAP" width={480} height={151} className="h-12 w-auto lg:h-16" />
          <span aria-hidden className="h-12 w-px bg-white/30 lg:h-16" />
          <img src="/images/forede-logo.webp" alt="FOREDE" width={453} height={160} className="h-12 w-auto lg:h-16" />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { setConVoz((v) => !v); if (conVoz) audio.current?.pause(); }} className={control} aria-pressed={conVoz}>
            {conVoz ? <Volume2 className="h-5 w-5" aria-hidden="true" /> : <VolumeX className="h-5 w-5" aria-hidden="true" />}
            {conVoz ? 'Voz activada' : 'Voz apagada'}
          </button>
          <button type="button" onClick={nueva} disabled={mensajes.length === 0} className={`${control} disabled:opacity-40`}>
            <Eraser className="h-5 w-5" aria-hidden="true" /> Limpiar
          </button>
          <button type="button" onClick={pantallaCompleta} className={control} aria-label="Pantalla completa" title="Pantalla completa">
            <Maximize className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-6 px-6 pb-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:px-10">
        {/* Capin */}
        <section className="flex flex-col items-center justify-center text-center" aria-label="Capín">
          <div ref={capin} data-estado={estado} className="forede-capin relative">
            <span aria-hidden className="forede-halo absolute inset-[8%] rounded-full bg-[hsl(var(--insecap-cyan)/0.45)] blur-3xl" />
            <img
              src="/images/capin/capin-saludo-320.webp"
              alt="Capín, la mascota de INSECAP, saludando"
              width={320}
              height={569}
              className="relative h-[clamp(14rem,48vh,32rem)] w-auto drop-shadow-2xl"
            />
          </div>
          <h1 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight">Pregúntale a Capín</h1>
          <p className="mt-2 text-lg text-white/80 lg:text-xl" aria-live="polite">
            {estadoTexto[estado]}
          </p>
        </section>

        {/* Conversación */}
        <section aria-label="Conversación con Capín" className="flex min-h-0 flex-col">
          <div role="log" aria-live="polite" className="flex-1 space-y-5 overflow-y-auto pr-2 pt-4">
            {mensajes.length === 0 && (
              <div className="flex h-full flex-col justify-center gap-4">
                <p className="text-2xl font-semibold leading-snug text-white/90">
                  Te ayudo a encontrar cursos de INSECAP y te digo cuántas horas dura cada uno.
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {SUGERENCIAS.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => void enviar(s)}
                        className="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-left text-lg font-medium transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mensajes.map((m, i) =>
              m.rol === 'user' ? (
                <p key={i} className="capin-aparece ml-auto w-fit max-w-[85%] rounded-3xl rounded-br-md bg-[hsl(var(--insecap-blue))] px-5 py-3 text-xl">
                  {m.texto}
                </p>
              ) : (
                <div key={i} className="capin-aparece max-w-[95%] space-y-4">
                  <div className={`rounded-3xl rounded-bl-md px-6 py-5 text-xl leading-relaxed lg:text-2xl ${m.error ? 'border border-amber-300/50 bg-amber-200/15 text-amber-50' : 'bg-white text-slate-900 shadow-xl'}`}>
                    {m.frases
                      ? m.frases.slice(0, m.leidas ?? m.frases.length).map((f, j) => (
                          <span key={j} className="forede-frase">{f} </span>
                        ))
                      : m.texto}
                  </div>
                  {/* Cursos y comercial aparecen cuando terminó de leer. */}
                  {m.frases && (m.leidas ?? 0) >= m.frases.length && (
                    <>
                      {!!m.cursos?.length && (
                        <ul className="grid gap-3 sm:grid-cols-2">
                          {m.cursos.map((c) => (
                            <li key={c.curso} className="forede-frase flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
                              <span className="text-base font-semibold leading-snug">{c.curso}</span>
                              <span className="shrink-0 rounded-full bg-[hsl(var(--insecap-cyan-ink))] px-3 py-1 text-sm font-semibold">{horas(c.horas)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {m.comercial && <Comercial c={m.comercial} />}
                    </>
                  )}
                </div>
              ),
            )}

            {pasos && (
              <ul className="capin-aparece space-y-2" aria-label="Lo que está haciendo Capín">
                {pasos.length === 0 && <li className="text-lg text-white/70">Entendiendo tu pregunta…</li>}
                {pasos.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 text-lg text-white/80">
                    <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${p.estado === 'EN_CURSO' ? 'animate-pulse bg-[hsl(var(--insecap-cyan))]' : p.estado === 'OK' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {p.descripcion}
                  </li>
                ))}
              </ul>
            )}
            <div ref={final} />
          </div>

          <form
            className="mt-4 flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              void enviar(texto);
            }}
          >
            {micDisponible && (
              <button
                type="button"
                onClick={escuchar}
                data-escuchando={estado === 'escuchando'}
                aria-pressed={estado === 'escuchando'}
                aria-label={estado === 'escuchando' ? 'Dejar de escuchar' : 'Hablarle a Capín'}
                className="forede-mic relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--insecap-cyan-ink))] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 motion-reduce:transform-none"
              >
                {estado === 'escuchando' ? <MicOff className="h-7 w-7" aria-hidden="true" /> : <Mic className="h-7 w-7" aria-hidden="true" />}
              </button>
            )}
            <label htmlFor="forede-pregunta" className="sr-only">Tu pregunta para Capín</label>
            <input
              id="forede-pregunta"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={MAX_PREGUNTA}
              placeholder={micDisponible ? 'Habla o escribe qué curso buscas…' : 'Escribe qué curso buscas…'}
              autoComplete="off"
              className="h-16 min-w-0 flex-1 rounded-full border border-white/20 bg-white px-6 text-lg text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[hsl(var(--insecap-cyan)/0.6)]"
            />
            {estado === 'pensando' || estado === 'hablando' ? (
              <button type="button" onClick={() => { callar(); setPasos(null); setEstado('listo'); }} aria-label="Detener" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60">
                <Square className="h-6 w-6" aria-hidden="true" />
              </button>
            ) : (
              <button type="submit" disabled={!texto.trim()} aria-label="Enviar" className="capin-sobre-color flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-lg disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60">
                <Send className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
          </form>
        </section>
      </main>

      {/* Contacto de INSECAP (NAP de src/data/sedes.ts): también lo exige check-dist en toda página. */}
      <footer className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-6 pb-3 text-sm text-white/75">
        <address className="flex flex-wrap justify-center gap-x-6 gap-y-1 not-italic">
          <span>INSECAP · {matriz.direccion}, {matriz.ciudad}</span>
          <a href={`tel:${matriz.telefonoE164}`} className="hover:text-white">{matriz.telefono}</a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">{CONTACT_EMAIL}</a>
        </address>
        <Link to={localizedPath('/')} className="hover:text-white">Sitio de INSECAP</Link>
      </footer>
    </div>
  );
}

/** El comercial de turno: correo y teléfono, que abre WhatsApp si es celular. */
function Comercial({ c }: { c: ComercialTurno }) {
  const wa = c.telefono ? whatsappUrl(c.telefono) : null;
  return (
    <div className="forede-frase rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15">
      <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Comercial de turno</p>
      <p className="mt-1 text-xl font-semibold">{c.nombre}</p>
      <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-lg text-white/90">
        {c.correo && <a href={`mailto:${c.correo}`} className="underline-offset-4 hover:underline">{c.correo}</a>}
        {c.telefono && (wa ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
            WhatsApp {c.telefono}
          </a>
        ) : (
          <a href={`tel:${c.telefono.replace(/[^\d+]/g, '')}`} className="underline-offset-4 hover:underline">{c.telefono}</a>
        ))}
      </p>
    </div>
  );
}
