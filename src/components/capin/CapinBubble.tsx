import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowRight, CheckCircle2, Loader2, Mail, Phone, Search, Send, Sparkles, Square, SquarePen, UserRound, X,
} from 'lucide-react';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import {
  ErrorCapin, MAX_PREGUNTA, preguntar, type ComercialTurno, type EventoChat, type MensajeChat, type PasoCapin,
} from './api';
import './capin.css';

/**
 * Burbuja de Capin en insecap.cl: el chat de la burbuja del TMS (tmsFrontend/features/capin),
 * en su modo público. Capin solo conoce el nombre y las horas de los cursos vigentes (ChatCapin
 * RQ-CHAT-23); para lo demás invita a cotizar en Contacto.
 */

const CLAVE = 'capin-web-chat'; // conversación de esta pestaña (sessionStorage)

const TEXTOS = {
  es: {
    abrir: 'Hablar con Capín, el asistente de cursos',
    titulo: 'Capín IA',
    enLinea: 'En línea',
    trabajando: 'Buscando…',
    nueva: 'Nueva conversación',
    cerrar: 'Cerrar el chat',
    hola: 'Hola, soy Capín',
    intro: 'Te ayudo a encontrar cursos de INSECAP y te digo cuántas horas dura cada uno.',
    sugerencias: ['Cursos de trabajo en altura', '¿Qué cursos de soldadura tienen?', 'Cursos de menos de 8 horas'],
    placeholder: 'Escribe qué curso buscas…',
    respondiendo: 'Capín está respondiendo…',
    pregunta: 'Tu pregunta',
    enviar: 'Enviar',
    detener: 'Detener',
    detenida: 'Consulta detenida.',
    estaTrabajando: 'Capín está trabajando',
    pensando: 'Entendiendo tu pregunta',
    redactando: 'Revisando lo encontrado',
    sinResultados: 'Sin resultados',
    cursos: (n: number) => `${n} curso${n === 1 ? '' : 's'}`,
    fallo: 'No se pudo consultar; Capín siguió con lo demás.',
    cotizar: '¿Te interesa? Cotiza con nuestro equipo',
    deTurno: 'Comercial de turno',
    limite: 'Hiciste muchas preguntas seguidas: espera unos minutos y vuelve a intentarlo.',
    sinConexion: 'No pude conectarme con Capín. Intenta de nuevo en unos minutos.',
    incompleta: 'La respuesta llegó incompleta: intenta de nuevo.',
    noDisponible: 'Capín no está disponible en este momento: intenta de nuevo en unos minutos o escríbenos en Contacto.',
    lento: 'Capín tardó demasiado en responder: intenta con una pregunta más corta.',
  },
  en: {
    abrir: 'Chat with Capín, the course assistant',
    titulo: 'Capín AI',
    enLinea: 'Online',
    trabajando: 'Searching…',
    nueva: 'New conversation',
    cerrar: 'Close chat',
    hola: "Hi, I'm Capín",
    intro: 'I help you find INSECAP courses and tell you how many hours each one lasts.',
    sugerencias: ['Working at heights courses', 'What welding courses do you have?', 'Courses under 8 hours'],
    placeholder: 'Type the course you are looking for…',
    respondiendo: 'Capín is answering…',
    pregunta: 'Your question',
    enviar: 'Send',
    detener: 'Stop',
    detenida: 'Query stopped.',
    estaTrabajando: 'Capín is working',
    pensando: 'Understanding your question',
    redactando: 'Reviewing what it found',
    sinResultados: 'No results',
    cursos: (n: number) => `${n} course${n === 1 ? '' : 's'}`,
    fallo: 'Could not search; Capín moved on.',
    cotizar: 'Interested? Get a quote from our team',
    deTurno: 'Sales rep on duty',
    limite: 'Too many questions in a row: please wait a few minutes and try again.',
    sinConexion: 'Could not reach Capín. Please try again in a few minutes.',
    incompleta: 'The answer arrived incomplete: please try again.',
    noDisponible: 'Capín is not available right now: try again in a few minutes or write to us in Contact.',
    lento: 'Capín took too long to answer: try a shorter question.',
  },
  pt: {
    abrir: 'Conversar com Capín, o assistente de cursos',
    titulo: 'Capín IA',
    enLinea: 'Online',
    trabajando: 'Buscando…',
    nueva: 'Nova conversa',
    cerrar: 'Fechar o chat',
    hola: 'Olá, sou o Capín',
    intro: 'Ajudo você a encontrar cursos da INSECAP e digo quantas horas dura cada um.',
    sugerencias: ['Cursos de trabalho em altura', 'Que cursos de soldagem vocês têm?', 'Cursos com menos de 8 horas'],
    placeholder: 'Escreva o curso que procura…',
    respondiendo: 'Capín está respondendo…',
    pregunta: 'Sua pergunta',
    enviar: 'Enviar',
    detener: 'Parar',
    detenida: 'Consulta interrompida.',
    estaTrabajando: 'Capín está trabalhando',
    pensando: 'Entendendo sua pergunta',
    redactando: 'Revisando o que encontrou',
    sinResultados: 'Sem resultados',
    cursos: (n: number) => `${n} curso${n === 1 ? '' : 's'}`,
    fallo: 'Não foi possível consultar; Capín seguiu com o resto.',
    cotizar: 'Tem interesse? Peça uma cotação à nossa equipe',
    deTurno: 'Comercial de plantão',
    limite: 'Muitas perguntas seguidas: aguarde alguns minutos e tente de novo.',
    sinConexion: 'Não consegui me conectar ao Capín. Tente novamente em alguns minutos.',
    incompleta: 'A resposta chegou incompleta: tente novamente.',
    noDisponible: 'Capín não está disponível agora: tente em alguns minutos ou escreva para nós em Contato.',
    lento: 'Capín demorou demais para responder: tente uma pergunta mais curta.',
  },
};

type Textos = (typeof TEXTOS)['es'];

const leer = (): MensajeChat[] => {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE) ?? '[]') as MensajeChat[];
  } catch {
    return [];
  }
};

const segundos = (ms: number) => `${(ms / 1000).toLocaleString('es-CL', { maximumFractionDigits: 1 })} s`;

/** Reemplaza el paso con el mismo id (EN_CURSO → OK/ERROR) o lo agrega. */
const aplicarPaso = (pasos: PasoCapin[], p: PasoCapin) => {
  const i = pasos.findIndex((x) => x.id === p.id);
  return i < 0 ? [...pasos, p] : pasos.map((x, j) => (j === i ? p : x));
};

export default function CapinBubble() {
  const { locale } = useLocalizedPath();
  const t = TEXTOS[locale];
  const [abierto, setAbierto] = useState(false);
  const lanzador = useRef<HTMLButtonElement>(null);

  // Escape cierra el chat y el foco vuelve al botón que lo abrió.
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [abierto]);
  const cerrar = () => {
    setAbierto(false);
    requestAnimationFrame(() => lanzador.current?.focus());
  };

  return (
    <div className="capin-root fixed bottom-6 [&_p]:text-left right-6 z-[60] flex flex-col items-end print:hidden sm:bottom-8 sm:right-8">
      {abierto ? (
        <ChatCapin t={t} onCerrar={cerrar} />
      ) : (
        <button
          ref={lanzador}
          type="button"
          onClick={() => setAbierto(true)}
          aria-label={t.abrir}
          title={t.abrir}
          className="capin-burbuja-entra capin-gradient group relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-[hsl(var(--capin-primary)/0.35)] hover:scale-105 active:scale-95 motion-reduce:transform-none"
        >
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white">
            <img src="/images/capin/capin-mitad.webp" alt="" width={36} height={47} className="h-10 w-auto object-contain" />
          </span>
          <span aria-hidden className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
        </button>
      )}
    </div>
  );
}

function ChatCapin({ t, onCerrar }: { t: Textos; onCerrar: () => void }) {
  const { localizedPath } = useLocalizedPath();
  const [mensajes, setMensajes] = useState<MensajeChat[]>(leer);
  const [texto, setTexto] = useState('');
  const [pasos, setPasos] = useState<PasoCapin[] | null>(null); // null = no hay pregunta en curso
  const [inicio, setInicio] = useState(0);
  const [ahora, setAhora] = useState(0);
  const abort = useRef<AbortController | null>(null);
  const fin = useRef<HTMLDivElement>(null);
  const ultimo = useRef<HTMLDivElement>(null);
  const entrada = useRef<HTMLTextAreaElement>(null);
  const enviando = pasos !== null;

  useEffect(() => {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(mensajes));
    } catch { /* sin almacenamiento: la conversación vive mientras el chat esté abierto */ }
  }, [mensajes]);
  // Mientras Capin trabaja se sigue el avance; al llegar la respuesta se muestra su comienzo.
  useEffect(() => {
    if (!enviando && mensajes.at(-1)?.rol === 'assistant') ultimo.current?.scrollIntoView({ block: 'start' });
    else fin.current?.scrollIntoView({ block: 'end' });
  }, [mensajes, enviando, pasos]);
  useEffect(() => {
    if (!enviando) return;
    const id = setInterval(() => setAhora(Date.now()), 200);
    return () => clearInterval(id);
  }, [enviando]);
  // Cerrar el chat cancela la pregunta en curso.
  useEffect(() => () => abort.current?.abort(), []);
  // El cuadro de la pregunta crece con el texto hasta 6 líneas.
  useLayoutEffect(() => {
    const el = entrada.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight + 2, 152)}px`;
  }, [texto]);

  const responder = (m: MensajeChat) => setMensajes((ms) => [...ms, m]);

  const enviar = async (pregunta: string) => {
    const limpia = pregunta.trim().slice(0, MAX_PREGUNTA);
    if (!limpia || enviando) return;
    const conPregunta: MensajeChat[] = [...mensajes, { rol: 'user', texto: limpia }];
    setMensajes(conPregunta);
    setTexto('');
    const ctl = new AbortController();
    abort.current = ctl;
    setInicio(Date.now());
    setAhora(Date.now());
    setPasos([]);
    let final: Extract<EventoChat, { tipo: 'fin' }> | null = null;
    try {
      await preguntar(
        conPregunta,
        (e) => {
          if (e.tipo === 'paso') {
            const { tipo: _, ...paso } = e;
            setPasos((p) => aplicarPaso(p ?? [], paso));
          } else if (e.tipo === 'fin') final = e;
        },
        t,
        ctl.signal,
      );
      const f = final as Extract<EventoChat, { tipo: 'fin' }> | null;
      if (f?.estado === 'OK' && f.respuesta)
        responder({ rol: 'assistant', texto: f.respuesta, cursos: f.cursos, comercial: f.comercial });
      else
        responder({
          rol: 'assistant',
          error: true,
          texto: !f ? t.incompleta : f.estado === 'TIMEOUT' ? t.lento : t.noDisponible,
        });
    } catch (err) {
      if (!ctl.signal.aborted)
        responder({ rol: 'assistant', error: true, texto: err instanceof ErrorCapin ? err.message : t.sinConexion });
    } finally {
      if (!ctl.signal.aborted) setPasos(null);
    }
  };

  const detener = () => {
    abort.current?.abort();
    setPasos(null);
    responder({ rol: 'assistant', texto: t.detenida, error: true });
  };

  const nueva = () => {
    abort.current?.abort();
    setPasos(null);
    setMensajes([]);
    entrada.current?.focus();
  };

  return (
    <section
      aria-label={t.titulo}
      className="capin-panel-entra capin-shadow-chat relative flex h-[min(36rem,calc(100dvh-3rem))] w-[min(25rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-[hsl(var(--capin-border))] bg-white text-left"
    >
      <header className="capin-gradient flex items-center gap-2.5 px-3 py-3 text-white shadow-[inset_0_-1px_0_rgb(255_255_255/0.15)]">
        <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-md ring-2 ring-white/40">
          <img src="/images/capin/capin-mitad.webp" alt="" width={25} height={32} className="h-8 w-auto object-contain" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold leading-5 tracking-tight">{t.titulo}</h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/90">
            <span
              aria-hidden
              className={`h-2 w-2 shrink-0 rounded-full ring-2 ${enviando ? 'bg-amber-300 ring-amber-300/30 motion-safe:animate-pulse' : 'bg-emerald-300 ring-emerald-300/30'}`}
            />
            <span className="truncate">{enviando ? t.trabajando : t.enLinea}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={nueva}
          disabled={mensajes.length === 0}
          aria-label={t.nueva}
          title={t.nueva}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 hover:bg-white/15 hover:text-white disabled:pointer-events-none disabled:opacity-35"
        >
          <SquarePen className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onCerrar}
          aria-label={t.cerrar}
          title={t.cerrar}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 hover:bg-white/15 hover:text-white"
        >
          <X className="h-[1.125rem] w-[1.125rem]" />
        </button>
      </header>

      <div className="flex flex-1 flex-col space-y-3 overflow-y-auto overflow-x-hidden p-3 text-sm" role="log" aria-label={t.titulo}>
        {mensajes.length === 0 && !enviando && (
          <div className="capin-aparece my-auto flex flex-col items-center px-4 py-6 text-center">
            <div className="relative">
              <span aria-hidden className="absolute inset-x-0 bottom-0 top-8 rounded-full bg-[hsl(var(--capin-accent)/0.2)] blur-2xl" />
              <img src="/images/capin/capin.webp" alt="" width={86} height={112} className="relative h-28 w-auto object-contain" />
            </div>
            <p className="mt-3 text-base font-semibold text-slate-800">{t.hola}</p>
            <p className="mt-1 max-w-[18rem] text-[hsl(var(--capin-muted-foreground))]">{t.intro}</p>
            <ul className="mt-5 flex w-full max-w-[18rem] flex-col gap-2">
              {t.sugerencias.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => enviar(s)}
                    className="flex min-h-10 w-full items-center gap-2.5 rounded-xl border border-[hsl(var(--capin-border))] px-3 text-left text-slate-700 hover:border-[hsl(var(--capin-primary)/0.5)] hover:bg-[hsl(var(--capin-primary)/0.05)]"
                  >
                    <Search className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--capin-primary))]" aria-hidden />
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {mensajes.map((m, i) => (
          <div
            key={i}
            ref={i === mensajes.length - 1 ? ultimo : undefined}
            className={`capin-aparece scroll-mt-2 ${m.rol === 'user' ? 'flex flex-col items-end' : 'grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 gap-y-1.5 [&>*:not(:first-child)]:col-start-2'}`}
          >
            {m.rol === 'assistant' && <AvatarCapin />}
            <p
              className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-left leading-relaxed [overflow-wrap:anywhere] ${
                m.rol === 'user'
                  ? 'rounded-br-sm bg-[hsl(var(--capin-primary))] text-white'
                  : m.error
                    ? 'rounded-bl-sm border border-amber-300 bg-amber-50 text-amber-900'
                    : 'rounded-bl-sm border border-[hsl(var(--capin-border))] text-slate-800'
              }`}
            >
              {m.error && <AlertTriangle className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]" aria-hidden />}
              {m.texto}
            </p>
            {m.comercial && <TarjetaComercial c={m.comercial} etiqueta={t.deTurno} />}
            {/* Lo que Capin no sabe (precios, fechas, contenidos) lo ve el equipo comercial. */}
            {!!m.cursos?.length && !m.comercial && (
              <Link
                to={localizedPath('/contacto')}
                onClick={onCerrar}
                className="group flex w-fit items-center gap-1 text-xs font-semibold text-[hsl(var(--capin-primary))] hover:underline"
              >
                {t.cotizar}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden />
              </Link>
            )}
          </div>
        ))}

        {enviando && (
          <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2">
            <AvatarCapin />
            <Trabajando t={t} pasos={pasos} transcurrido={ahora - inicio} />
          </div>
        )}
        <div ref={fin} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(texto);
        }}
        className="flex items-end gap-2 border-t border-[hsl(var(--capin-border))] p-2"
      >
        <textarea
          ref={entrada}
          autoFocus
          rows={1}
          value={texto}
          maxLength={MAX_PREGUNTA}
          onChange={(e) => setTexto(e.target.value)}
          // Enter envía; Shift+Enter hace un salto de línea.
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              enviar(texto);
            }
          }}
          placeholder={enviando ? t.respondiendo : t.placeholder}
          aria-label={t.pregunta}
          className="min-h-[2.75rem] flex-1 resize-none rounded-lg border border-[hsl(var(--capin-border))] px-3 py-2.5 text-base outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--capin-primary)/0.4)] sm:text-sm"
        />
        {enviando ? (
          <button
            type="button"
            onClick={detener}
            aria-label={t.detener}
            title={t.detener}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-600 text-white hover:bg-slate-700"
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!texto.trim()}
            aria-label={t.enviar}
            title={t.enviar}
            className="capin-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </form>
    </section>
  );
}

/** Contacto del comercial de turno, con enlaces para escribirle o llamarlo. */
function TarjetaComercial({ c, etiqueta }: { c: ComercialTurno; etiqueta: string }) {
  const enlace = 'flex min-h-9 items-center gap-1.5 text-xs text-[hsl(var(--capin-primary))] hover:underline [overflow-wrap:anywhere]';
  return (
    <div className="max-w-[90%] rounded-xl border border-[hsl(var(--capin-primary)/0.25)] bg-[hsl(var(--capin-primary)/0.04)] px-3 py-2">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--capin-muted-foreground))]">
        <UserRound className="h-3.5 w-3.5" aria-hidden /> {etiqueta}
      </p>
      <p className="mt-1 font-semibold text-slate-800">{c.nombre}</p>
      {c.correo && (
        <a href={`mailto:${c.correo}`} className={enlace}>
          <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden /> {c.correo}
        </a>
      )}
      {c.telefono && (
        <a href={`tel:${c.telefono.replace(/[^\d+]/g, '')}`} className={enlace}>
          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden /> {c.telefono}
        </a>
      )}
    </div>
  );
}

function AvatarCapin() {
  return (
    <span aria-hidden className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[hsl(var(--capin-primary)/0.08)] ring-1 ring-[hsl(var(--capin-primary)/0.15)]">
      <img src="/images/capin/capin-mitad.webp" alt="" width={19} height={24} className="h-6 w-auto object-contain" />
    </span>
  );
}

/** Tarjeta en vivo: qué está consultando Capin ahora, con lo que va encontrando. */
function Trabajando({ t, pasos, transcurrido }: { t: Textos; pasos: PasoCapin[]; transcurrido: number }) {
  const hayEnCurso = pasos.some((p) => p.estado === 'EN_CURSO');
  const fase = pasos.length === 0 ? t.pensando : t.redactando;
  const actual = pasos.find((p) => p.estado === 'EN_CURSO')?.descripcion ?? fase;
  return (
    <div className="capin-aparece space-y-2 rounded-2xl rounded-bl-sm border border-[hsl(var(--capin-primary)/0.25)] bg-[hsl(var(--capin-primary)/0.03)] p-3">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-[hsl(var(--capin-primary))]">
          <Sparkles className="h-3.5 w-3.5 motion-safe:animate-pulse" aria-hidden />
          {t.estaTrabajando}
        </span>
        <span className="tabular-nums text-[hsl(var(--capin-muted-foreground))]">{segundos(Math.max(0, transcurrido))}</span>
      </div>
      <p className="sr-only" role="status">{actual}</p>
      <ol className="space-y-2">
        {pasos.map((p) => (
          <li key={p.id} className="capin-aparece flex gap-2">
            <span className="mt-0.5 shrink-0" aria-hidden>
              {p.estado === 'EN_CURSO' ? <Loader2 className="h-4 w-4 text-[hsl(var(--capin-primary))] motion-safe:animate-spin" />
                : p.estado === 'ERROR' ? <AlertTriangle className="h-4 w-4 text-amber-600" />
                : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`break-words text-slate-700 [overflow-wrap:anywhere] ${p.estado === 'EN_CURSO' ? 'capin-brillo' : ''}`}>{p.descripcion}</p>
              {p.estado !== 'EN_CURSO' && (
                <p className="mt-0.5 text-xs text-[hsl(var(--capin-muted-foreground))]">
                  {p.estado === 'ERROR' ? t.fallo : p.resultados ? t.cursos(p.resultados) : t.sinResultados}
                </p>
              )}
              {!!p.muestra?.length && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {p.muestra.map((m) => (
                    <span key={m} title={m} className="max-w-full truncate rounded-md border border-[hsl(var(--capin-border))] bg-white px-1.5 py-0.5 text-xs text-slate-600">
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
        {!hayEnCurso && (
          <li className="flex items-center gap-2 text-[hsl(var(--capin-muted-foreground))]">
            <Loader2 className="h-4 w-4 shrink-0 text-[hsl(var(--capin-primary))] motion-safe:animate-spin" aria-hidden />
            <span className="capin-brillo">{fase}…</span>
          </li>
        )}
      </ol>
    </div>
  );
}
