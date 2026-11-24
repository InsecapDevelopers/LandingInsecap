import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { getSedeBySlug, getSedeMapsEmbedUrl, getSedeMapsUrl, sedes, type Sede, type SedeSlug } from '@/data/sedes';
import { TOUR_CALAMA, tourFrameSrc, type TourEstacion, type TourSecuencia } from '@/data/tour-virtual';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { HIGH_PRIORITY } from '@/lib/images';
import { buildBreadcrumbJsonLd } from '@/lib/jsonld';

const INK = '#0D1C3F';
const dosDigitos = (n: number) => String(n).padStart(2, '0');

/** Inercia tipo scroll suave: las animaciones siguen al scroll con un resorte, sin tocar el scroll nativo. */
const useSuave = (value: MotionValue<number>) => {
  const reducir = useReducedMotion();
  const resorte = useSpring(value, { stiffness: 120, damping: 30, mass: 0.35, restDelta: 0.0005 });
  return reducir ? value : resorte;
};

/** Orden de descarga de gruesa a fina (uno de cada 16, luego de cada 8…): el recorrido completo se puede scrollear desde el inicio y gana detalle a medida que llegan los demás. */
const ordenDeCarga = (frames: number, paso: number) => {
  const orden: number[] = [];
  const pedidos = new Set<number>();
  for (const salto of [16, 8, 4, 2, 1].filter((salto) => salto >= paso)) {
    for (let i = 0; i < frames; i += salto) {
      if (!pedidos.has(i)) { pedidos.add(i); orden.push(i); }
    }
  }
  if (!pedidos.has(frames - 1)) orden.push(frames - 1);
  return orden;
};

/**
 * Secuencia de fotogramas que avanza con `progress` (0 a 1). El HTML lleva el primer fotograma como
 * <img> (póster, sin JS y para bots); el canvas lo tapa cuando cargan los demás, que se piden al
 * acercarse la sección. Se dibuja un fundido continuo entre los dos fotogramas listos más cercanos,
 * así el avance no salta aunque falten cuadros por descargar.
 */
const Secuencia = ({ sede, secuencia, progress, alt, prioridad = false }: {
  sede: SedeSlug;
  secuencia: TourSecuencia;
  progress: MotionValue<number>;
  alt: string;
  prioridad?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const listos = useRef<Array<HTMLImageElement | undefined>>([]);
  const pendiente = useRef(0);

  const dibujar = () => {
    pendiente.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const f = Math.min(1, Math.max(0, progress.get())) * (secuencia.frames - 1);
    let a = Math.floor(f);
    while (a >= 0 && !listos.current[a]) a--;
    let b = Math.ceil(f);
    while (b < secuencia.frames && !listos.current[b]) b++;
    const antes = listos.current[a];
    const despues = listos.current[b];
    if (!antes && !despues) return;
    ctx.globalAlpha = 1;
    ctx.drawImage((antes ?? despues)!, 0, 0, canvas.width, canvas.height);
    if (antes && despues && b > a) {
      ctx.globalAlpha = (f - a) / (b - a);
      ctx.drawImage(despues, 0, 0, canvas.width, canvas.height);
    }
  };
  // Un dibujo por cuadro de pantalla, aunque el scroll y las descargas avisen más seguido.
  const pedirDibujo = () => {
    if (!pendiente.current) pendiente.current = requestAnimationFrame(dibujar);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    // Con ahorro de datos queda solo el póster.
    if (!canvas || conexion?.saveData) return;
    // ponytail: en móvil se carga uno de cada dos fotogramas (7,5 por segundo de video); si hace falta más ahorro, generar un juego a 640 px.
    const paso = window.matchMedia('(max-width: 767px)').matches ? 2 : 1;
    let activo = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      for (const i of ordenDeCarga(secuencia.frames, paso)) {
        const img = new Image();
        img.src = tourFrameSrc(sede, secuencia.clave, i);
        // Se marca listo ya decodificado: dibujarlo en el scroll no bloquea el hilo principal.
        img.decode().then(() => {
          if (!activo) return;
          listos.current[i] = img;
          pedirDibujo();
        }).catch(() => {});
      }
    }, { rootMargin: '150% 0px' });
    observer.observe(canvas);
    return () => {
      activo = false;
      observer.disconnect();
      cancelAnimationFrame(pendiente.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sede, secuencia]);

  useMotionValueEvent(progress, 'change', pedirDibujo);

  return (
    <>
      <img
        src={tourFrameSrc(sede, secuencia.clave, 0)}
        alt={alt}
        width={secuencia.width}
        height={secuencia.height}
        {...(prioridad ? HIGH_PRIORITY : { loading: 'lazy' as const })}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <canvas
        ref={canvasRef}
        width={secuencia.width}
        height={secuencia.height}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </>
  );
};

/** Encabezado: el video de la llegada parte como tarjeta y crece hasta llenar la pantalla; el título se abre en dos. */
const TourHero = ({ sede }: { sede: Sede }) => {
  const ref = useRef<HTMLElement>(null);
  const { localizedPath } = useLocalizedPath();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSuave(scrollYProgress);
  const escala = useTransform(p, [0, 0.6], [0.6, 1]);
  const radio = useTransform(p, [0, 0.6], [40, 0]);
  const velo = useTransform(p, [0, 0.6, 1], [0.1, 0.3, 0.7]);
  const linea1 = useTransform(p, [0, 1], ['0%', '-22%']);
  const linea2 = useTransform(p, [0, 1], ['0%', '22%']);
  const tituloOpacidad = useTransform(p, [0.5, 0.85], [1, 0]);
  const pista = useTransform(p, [0, 0.15], [1, 0]);

  return (
    <section ref={ref} className="relative h-[220svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{ scale: escala, borderRadius: radio }}
          className="absolute inset-0 origin-bottom overflow-hidden md:origin-bottom-right"
        >
          <Secuencia sede={sede.slug} secuencia={TOUR_CALAMA.acceso} progress={p} prioridad alt={`Fachada y acceso de la ${sede.nombre} de INSECAP`} />
          <motion.div style={{ opacity: velo }} className="absolute inset-0 bg-[#060d24]" />
        </motion.div>

        <motion.div style={{ opacity: tituloOpacidad }} className="relative z-10 px-6 pt-28 md:px-14 md:pt-32 lg:px-20">
          <nav aria-label="Migas de pan" style={{ '--d': '2.05s' } as React.CSSProperties} className="tour-entra mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            <ol className="flex gap-2">
              <li><Link to={localizedPath('/')} className="hover:text-white">Inicio</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">Tour virtual</li>
            </ol>
          </nav>
          {/* La sombra va como filtro del h1: las líneas recortan su contenido (overflow) para la entrada. */}
          <h1 className="text-[clamp(3rem,11vw,10rem)] font-bold leading-[0.92] tracking-tight text-white [filter:drop-shadow(0_4px_24px_rgba(6,13,36,0.55))]">
            <motion.span style={{ x: linea1 }} className="block overflow-hidden pb-[0.06em]">
              <span style={{ '--d': '1.7s' } as React.CSSProperties} className="tour-linea">Tour virtual</span>
            </motion.span>
            <motion.span style={{ x: linea2 }} className="mt-2 block overflow-hidden pb-[0.08em] text-[0.45em] font-normal leading-tight text-white/75">
              <span style={{ '--d': '1.85s' } as React.CSSProperties} className="tour-linea">{sede.nombre}.</span>
            </motion.span>
          </h1>
        </motion.div>

        <motion.div style={{ opacity: pista, '--d': '2.2s' } as unknown as React.CSSProperties} className="tour-entra absolute bottom-8 left-6 z-10 max-w-[38vw] text-white md:left-14 lg:left-20">
          <p className="hidden items-start gap-2 text-sm text-white/80 md:flex">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-insecap-cyan" aria-hidden="true" />
            {sede.direccion}, {sede.ciudad}
          </p>
          <p className="mt-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/40">
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </span>
            Desliza para entrar
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const FRASE: [string, string] = ['Espacios para aprender,', 'creciendo juntos.'];
// Degradado de la segunda línea, letra a letra: índigo claro a cian (texto sobre fondo oscuro, no al revés).
const DESDE = [0x70, 0x80, 0xdb];
const HASTA = [0x00, 0xb8, 0xde];
const colorEn = (t: number) => `rgb(${DESDE.map((c, k) => Math.round(c + (HASTA[k] - c) * t)).join(',')})`;

/** Una letra que sube desde abajo, girada y desenfocada, en su tramo del scroll [desde, hasta]. */
const Letra = ({ progress, desde, hasta, giro, color, children }: {
  progress: MotionValue<number>;
  desde: number;
  hasta: number;
  giro: number;
  color?: string;
  children: string;
}) => {
  const y = useTransform(progress, [desde, hasta], ['0.75em', '0em']);
  const rotate = useTransform(progress, [desde, hasta], [giro, 0]);
  const opacity = useTransform(progress, [desde, hasta], [0, 1]);
  const filter = useTransform(progress, [desde, hasta], ['blur(12px)', 'blur(0px)']);
  return <motion.span style={{ y, rotate, opacity, filter, color }} className="inline-block origin-bottom-left">{children}</motion.span>;
};

/** Línea partida en letras (las palabras no se cortan) que entran en cascada dentro del tramo [desde, hasta]. */
const LineaEnLetras = ({ texto, progress, desde, hasta, giro, degradado = false }: {
  texto: string;
  progress: MotionValue<number>;
  desde: number;
  hasta: number;
  giro: number;
  degradado?: boolean;
}) => {
  const total = texto.replace(/ /g, '').length;
  const tramo = (hasta - desde) * 0.45;
  let n = 0;
  return (
    <span className="block">
      {texto.split(' ').map((palabra, w) => (
        <span key={w}>
          {w > 0 && ' '}
          <span className="inline-block whitespace-nowrap">
            {[...palabra].map((letra) => {
              const i = n++;
              const inicio = desde + ((hasta - desde - tramo) * i) / Math.max(1, total - 1);
              return (
                <Letra key={i} progress={progress} desde={inicio} hasta={inicio + tramo} giro={giro} color={degradado ? colorEn(i / Math.max(1, total - 1)) : undefined}>
                  {letra}
                </Letra>
              );
            })}
          </span>
        </span>
      ))}
    </span>
  );
};

/**
 * La frase de la página, al estilo de los titulares de ekiclub: primera línea firme y segunda en
 * cursiva con degradado. Queda fija mientras sus letras se arman con el scroll; después aparece el
 * párrafo de respuesta (entidades para buscadores e IA) y una línea que se dibuja bajo la frase.
 */
const TourFrase = ({ sede }: { sede: Sede }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const p = useSuave(scrollYProgress);
  const trazo = useTransform(p, [0.66, 0.8], [0, 1]);
  const bajadaOpacidad = useTransform(p, [0.72, 0.86], [0, 1]);
  const bajadaY = useTransform(p, [0.72, 0.86], [28, 0]);
  const bajadaFiltro = useTransform(p, [0.72, 0.86], ['blur(10px)', 'blur(0px)']);

  return (
    <section ref={ref} className="relative h-[230svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center px-6 md:px-14 lg:px-20">
        <h2
          aria-label={FRASE.join(' ')}
          className="text-[clamp(2.75rem,8.5vw,8rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white"
        >
          <span aria-hidden="true">
            <LineaEnLetras texto={FRASE[0]} progress={p} desde={0.18} hasta={0.48} giro={8} />
            {/* Montserrat no tiene cursiva autoalojada: el navegador la inclina (sin fuentes nuevas). */}
            <span className="relative inline-block pb-[0.12em] pr-[0.12em] font-normal italic tracking-[-0.02em]">
              <LineaEnLetras texto={FRASE[1]} progress={p} desde={0.4} hasta={0.7} giro={-10} degradado />
              <motion.span
                style={{ scaleX: trazo }}
                className="absolute bottom-0 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-[#7080DB] to-insecap-cyan"
              />
            </span>
          </span>
        </h2>
        <motion.p
          data-respuesta="tour"
          style={{ opacity: bajadaOpacidad, y: bajadaY, filter: bajadaFiltro }}
          className="mt-10 max-w-2xl text-left text-base text-white/75 md:text-lg"
        >
          INSECAP es una OTEC fundada en 2009, acreditada por SENCE y certificada en NCh 2728:2015, con casa matriz en
          {' '}{sede.direccion}, {sede.ciudad}. Recorre por dentro la recepción, las salas de clases, la sala de computación,
          la sala de simulación y los talleres de práctica.
        </motion.p>
      </div>
    </section>
  );
};

/**
 * Intro de la página, como la de ekiclub: capa a pantalla completa con el logo que se revela, sube
 * "Tour virtual" letra a letra y el logo vuela a su lugar en el header mientras el fondo se apaga.
 * Es CSS puro (src/index.css, .tour-intro): corre sin JS, no gatea el render y el contenido sigue en
 * el HTML para bots. JS solo mide el header para que el vuelo aterrice justo sobre el logo real.
 */
const TourIntroCapa = () => {
  const capaRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const medir = () => {
      const destino = document.querySelector('[data-logo-destino]')?.getBoundingClientRect();
      const origen = logoRef.current?.getBoundingClientRect();
      if (!destino || !origen || !capaRef.current || !origen.width) return;
      capaRef.current.style.setProperty('--vuelo-x', `${destino.left - origen.left}px`);
      capaRef.current.style.setProperty('--vuelo-y', `${destino.top - origen.top}px`);
      capaRef.current.style.setProperty('--vuelo-s', String(destino.width / origen.width));
    };
    medir();
    // Otra vez justo antes del vuelo (1,2 s): el header ya se acomodó.
    const id = window.setTimeout(medir, 1150);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div ref={capaRef} className="tour-intro" aria-hidden="true">
      <div className="tour-intro-fondo" />
      <div className="tour-intro-centro">
        <img ref={logoRef} src="/images/insecap-logo.webp" alt="" width={480} height={151} className="tour-intro-logo" />
        <p className="tour-intro-texto">
          {[...'Tour virtual'].map((letra, i) => (
            <span key={i} style={{ '--d': `${0.55 + i * 0.035}s` } as React.CSSProperties}>{letra === ' ' ? '\u00a0' : letra}</span>
          ))}
        </p>
      </div>
    </div>
  );
};

const envolver = (min: number, max: number, v: number) => {
  const rango = max - min;
  return ((((v - min) % rango) + rango) % rango) + min;
};

/**
 * Una fila de la cinta: avanza sola y el scroll la acelera, le invierte el sentido según hacia dónde
 * se scrollea y la inclina según la velocidad. Lleva dos copias iguales del contenido, así que
 * moverla de 0 a -50 % y volver a empezar no se nota. Solo se anima mientras está a la vista.
 */
const FilaCinta = ({ items, velocidad, className }: { items: string[]; velocidad: number; className: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reducir = useReducedMotion();
  const visible = useInView(ref, { margin: '20% 0px' });
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocidadScroll = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const impulso = useTransform(velocidadScroll, [0, 1000], [0, 4], { clamp: false });
  const inclinacion = useTransform(velocidadScroll, [-2500, 2500], [14, -14]);
  const giroEstrella = useTransform(scrollY, (y) => y * 0.25);
  const x = useTransform(base, (v) => `${envolver(-50, 0, v)}%`);
  const sentido = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reducir || !visible) return;
    const f = impulso.get();
    if (f < 0) sentido.current = -1;
    else if (f > 0) sentido.current = 1;
    const paso = sentido.current * velocidad * (delta / 1000);
    base.set(base.get() + paso * (1 + Math.abs(f)));
  });

  const copia = (clave: string) => (
    <span key={clave} className="flex shrink-0 items-center gap-[0.4em] pr-[0.4em]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-[0.4em]">
          {item}
          <motion.span style={{ rotate: giroEstrella }} className="inline-block text-[0.45em] not-italic text-insecap-cyan">✦</motion.span>
        </span>
      ))}
    </span>
  );

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ x, skewX: inclinacion }} className={`flex w-max whitespace-nowrap ${className}`}>
        {copia('a')}
        {copia('b')}
      </motion.div>
    </div>
  );
};

/**
 * Cinta con los nombres de las estaciones, en dos filas que van en sentidos opuestos: la de arriba
 * en blanco y grande, la de abajo en cursiva más tenue. La banda se endereza y crece al pasar por
 * la pantalla y se desvanece en los bordes.
 */
const TourCinta = ({ items }: { items: string[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const p = useSuave(scrollYProgress);
  const rotate = useTransform(p, [0, 1], [-4, 3]);
  const scale = useTransform(p, [0, 0.5, 1], [0.94, 1, 0.97]);

  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden py-16">
      <motion.div
        style={{ rotate, scale }}
        className="-mx-[5%] flex flex-col gap-2 border-y border-white/15 py-7 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      >
        <FilaCinta
          items={items}
          velocidad={-1.6}
          className="text-[clamp(2.75rem,7.5vw,6.5rem)] font-bold uppercase leading-[1.08] tracking-tight text-white"
        />
        <FilaCinta
          items={[...items].reverse()}
          velocidad={1.2}
          className="text-[clamp(1.5rem,3.6vw,3rem)] font-normal italic leading-[1.15] text-white/50"
        />
      </motion.div>
    </div>
  );
};

/**
 * Una estación del recorrido: panel fijo a pantalla completa. Su contenedor mide más que la pantalla
 * (más largo mientras más fotogramas tiene) y el siguiente se monta 100svh encima, así que cada
 * panel entra tapando al anterior, que se achica y se oscurece (pila de tarjetas).
 */
const Estacion = ({ sede, estacion, index, total, onVisible }: {
  sede: Sede;
  estacion: TourEstacion;
  index: number;
  total: number;
  onVisible: (index: number, visible: boolean) => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  // Largo de scroll según la duración del tramo (15 fotogramas por segundo de video).
  const alto = 260 + Math.round(estacion.frames * 0.4);
  // Tramos del avance: hasta `a` el panel entra desde abajo; desde `b` lo tapa el siguiente.
  const a = 100 / alto;
  const b = (alto - 100) / alto;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const q = useSuave(scrollYProgress);
  const avance = useTransform(q, [a * 0.4, b + (1 - b) * 0.4], [0, 1]);
  const pilaEscala = useTransform(q, [b, 1], [1, 0.9]);
  const pilaSombra = useTransform(q, [b, 1], [0, 0.6]);
  const numeroY = useTransform(q, [0, 1], ['40%', '-40%']);
  const textoY = useTransform(q, [a * 0.45, a], [90, 0]);
  const textoOpacidad = useTransform(q, [a * 0.45, a], [0, 1]);
  const zoom = useTransform(q, [0, b], [1.25, 1]);
  const recorte = useTransform(q, [a * 0.3, a], ['inset(16% 12% 16% 12% round 32px)', 'inset(0% 0% 0% 0% round 32px)']);
  const giro = useTransform(q, [a * 0.3, a], [index % 2 ? -5 : 5, 0]);
  const tarjetaY = useTransform(q, [a, b], ['5%', '-5%']);

  useMotionValueEvent(scrollYProgress, 'change', (v) => onVisible(index, v > a * 0.5 && v < (b + 1) / 2));

  const numero = dosDigitos(index + 1);
  const vertical = estacion.height > estacion.width;
  const oscura = estacion.vista === 'inmersiva';
  const alt = `${estacion.nombre} de la ${sede.nombre} de INSECAP`;
  const titulo = (
    <>
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${oscura ? 'text-insecap-cyan' : 'text-insecap-cyan-ink'}`}>
        {estacion.nivel} · {numero}/{dosDigitos(total)}
      </p>
      <h2 className={`mt-3 text-[clamp(2.5rem,6.5vw,6rem)] font-bold leading-[0.95] tracking-tight ${oscura ? 'text-white' : 'text-[#0D1C3F]'}`}>
        {estacion.nombre}
        <span className={`mt-2 block text-[0.45em] font-normal leading-tight ${oscura ? 'text-white/70' : 'text-[#0D1C3F]/60'}`}>{estacion.acento}</span>
      </h2>
      <p className={`mt-5 max-w-xl text-left text-base md:text-lg ${oscura ? 'text-white/85' : 'text-[#0D1C3F]/80'}`}>{estacion.descripcion}</p>
    </>
  );

  return (
    <li ref={ref} id={`estacion-${estacion.clave}`} style={{ height: `${alto}svh`, zIndex: index + 1 }} className="relative -mt-[100svh] first:mt-0">
      <div className="sticky top-0 h-[100svh]">
        <motion.div
          style={{ scale: pilaEscala }}
          className={`relative h-full origin-top overflow-hidden rounded-t-[32px] shadow-[0_-24px_60px_rgba(4,10,30,0.45)] ${oscura ? 'bg-[#060d24]' : 'bg-[#F3F5F7]'}`}
        >
          {oscura ? (
            <>
              <motion.div style={{ scale: zoom }} className="absolute inset-0">
                <Secuencia sede={sede.slug} secuencia={estacion} progress={avance} alt={alt} />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#060d24]/90 via-[#060d24]/20 to-[#060d24]/50" />
              <motion.span
                aria-hidden="true"
                style={{ y: numeroY }}
                // Relleno cian translúcido (vidrio) en vez de -webkit-text-stroke: en Montserrat Bold el
                // trazo dibuja los contornos internos que se superponen (el 3 y el 1 salían con rayas).
                // drop-shadow sigue la silueta del glifo, así el borde queda limpio.
                className="absolute right-[4vw] top-[14svh] bg-gradient-to-b from-[#00B8DE]/50 via-[#7FDBEF]/25 to-white/10 bg-clip-text text-[36vw] font-bold leading-none text-transparent [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.6))_drop-shadow(0_10px_40px_rgba(0,184,222,0.3))] lg:text-[22vw]"
              >
                {numero}
              </motion.span>
              <motion.div style={{ y: textoY, opacity: textoOpacidad }} className="absolute inset-x-0 bottom-0 p-6 pb-28 md:p-14 lg:p-20">
                {titulo}
              </motion.div>
            </>
          ) : (
            <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] gap-6 px-6 pb-28 pt-24 md:px-14 md:pb-10 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-14 lg:px-20 lg:pt-28">
              <motion.div
                style={{ clipPath: recorte, rotate: giro, y: tarjetaY }}
                className={`relative min-h-0 overflow-hidden rounded-[32px] ${vertical ? 'mx-auto aspect-[9/16] h-full lg:col-span-5 lg:h-[76svh]' : 'h-full lg:col-span-7 lg:h-[68svh]'} ${index % 2 ? 'lg:order-2' : ''}`}
              >
                <Secuencia sede={sede.slug} secuencia={estacion} progress={avance} alt={alt} />
              </motion.div>
              <div className={`relative ${vertical ? 'lg:col-span-7' : 'lg:col-span-5'}`}>
                <motion.span
                  aria-hidden="true"
                  style={{ y: numeroY }}
                  className="pointer-events-none absolute -top-[0.55em] right-0 text-[30vw] font-bold leading-none text-[#0D1C3F]/[0.07] lg:-left-[0.08em] lg:right-auto lg:text-[20vw]"
                >
                  {numero}
                </motion.span>
                <motion.div style={{ y: textoY, opacity: textoOpacidad }} className="relative">
                  {titulo}
                </motion.div>
              </div>
            </div>
          )}
          <motion.div style={{ opacity: pilaSombra }} className="pointer-events-none absolute inset-0 bg-[#060d24]" />
        </motion.div>
      </div>
    </li>
  );
};

/** Riel de progreso (escritorio): un punto por estación y contador; aparece mientras se recorre el tour. */
const TourRiel = ({ estaciones, activa }: { estaciones: TourEstacion[]; activa: number | null }) => (
  <nav
    aria-label="Estaciones del tour"
    className={`fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1 rounded-full bg-[#0D1C3F]/85 px-1.5 py-3 ring-1 ring-white/15 backdrop-blur transition-opacity duration-500 lg:flex ${activa === null ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
  >
    <ol className="flex flex-col items-center gap-1">
      {estaciones.map((estacion, i) => (
        <li key={estacion.clave}>
          <a
            href={`#estacion-${estacion.clave}`}
            aria-label={`Ir a ${estacion.nombre}`}
            aria-current={activa === i ? 'step' : undefined}
            tabIndex={activa === null ? -1 : undefined}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById(`estacion-${estacion.clave}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative grid h-6 w-6 place-items-center"
          >
            <span className={`rounded-full transition-all duration-300 ${activa === i ? 'h-3 w-3 bg-insecap-cyan' : 'h-1.5 w-1.5 bg-white/50 group-hover:bg-white'}`} />
            <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded-full bg-[#0D1C3F] px-3 py-1 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {estacion.nombre}
            </span>
          </a>
        </li>
      ))}
    </ol>
    <p aria-hidden="true" className="mt-1 text-xs font-semibold tabular-nums text-white/80">
      {dosDigitos((activa ?? 0) + 1)}/{dosDigitos(estaciones.length)}
    </p>
  </nav>
);

/** Cierre: sube tapando la última estación, con el NAP de la sede (src/data/sedes.ts). */
const TourCierre = ({ sede, zIndex }: { sede: Sede; zIndex: number }) => {
  const ref = useRef<HTMLElement>(null);
  const { localizedPath } = useLocalizedPath();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const p = useSuave(scrollYProgress);
  const fondoX = useTransform(p, [0, 1], ['10%', '-30%']);
  const tituloY = useTransform(p, [0, 0.8], [120, 0]);

  return (
    <section
      ref={ref}
      style={{ zIndex }}
      className="relative -mt-[100svh] flex min-h-[100svh] flex-col justify-center overflow-hidden rounded-t-[32px] bg-gradient-to-br from-[#233076] to-[#0D1C3F] px-6 py-28 text-white shadow-[0_-24px_60px_rgba(4,10,30,0.45)] md:px-14 lg:px-20"
    >
      <motion.p
        aria-hidden="true"
        style={{ x: fondoX }}
        className="pointer-events-none absolute left-0 top-[12svh] whitespace-nowrap text-[28vw] font-bold uppercase leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.12)]"
      >
        {sede.ciudad} · INSECAP
      </motion.p>
      <motion.div style={{ y: tituloY }} className="relative">
        <h2 className="text-[clamp(2.5rem,8vw,7.5rem)] font-bold leading-[0.95] tracking-tight">
          Te esperamos
          <span className="block font-normal text-white/70">en {sede.ciudad}.</span>
        </h2>
        <address className="mt-10 grid gap-4 text-base not-italic md:grid-cols-3 md:text-lg">
          <p className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-insecap-cyan" aria-hidden="true" />
            <span>{sede.direccion}, {sede.ciudad}, {sede.region}</span>
          </p>
          <p className="flex items-center gap-3">
            <Phone className="h-5 w-5 shrink-0 text-insecap-cyan" aria-hidden="true" />
            <a href={`tel:${sede.telefonoE164}`} className="hover:underline">{sede.telefono}</a>
          </p>
          <p className="flex items-center gap-3">
            <Mail className="h-5 w-5 shrink-0 text-insecap-cyan" aria-hidden="true" />
            <a href={`mailto:${sede.email}`} className="hover:underline">{sede.email}</a>
          </p>
        </address>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={getSedeMapsUrl(sede)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#0D1C3F] transition-transform hover:scale-105"
          >
            Cómo llegar a la sede de {sede.ciudad}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <Link
            to={localizedPath(`/sedes/${sede.slug}`)}
            className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-semibold transition-colors hover:bg-white/10"
          >
            Datos de la {sede.nombre}
          </Link>
          <Link
            to={localizedPath('/contacto')}
            className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-semibold transition-colors hover:bg-white/10"
          >
            Contactar a INSECAP
          </Link>
        </div>
        <nav aria-label="Otras sedes" className="mt-12 border-t border-white/15 pt-6">
          <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/80">
            {sedes.filter((otra) => otra.slug !== sede.slug).map((otra) => (
              <li key={otra.slug}>
                <Link to={localizedPath(`/sedes/${otra.slug}`)} className="hover:text-white hover:underline">
                  {otra.nombre}: {otra.direccion}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 h-[340px] overflow-hidden rounded-2xl border border-white/15 shadow-[0_24px_60px_rgba(4,10,30,0.45)] md:h-[420px]">
          <iframe
            title={`Mapa de la ${sede.nombre}: ${sede.direccion}, ${sede.ciudad}`}
            src={getSedeMapsEmbedUrl(sede)}
            className="h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </motion.div>
    </section>
  );
};

/** Tour virtual de las sedes (/tour-virtual): hoy, el recorrido de la Casa Matriz Calama. */
const TourVirtual = () => {
  const { locale, localizedPath } = useLocalizedPath();
  const sede = getSedeBySlug(TOUR_CALAMA.sede)!;
  const { estaciones } = TOUR_CALAMA;
  const [activa, setActiva] = useState<number | null>(null);
  const onVisible = (index: number, visible: boolean) =>
    setActiva((previa) => (visible ? index : previa === index ? null : previa));

  return (
    <div style={{ backgroundColor: INK }}>
      <TourIntroCapa />
      <SEO
        url="/tour-virtual"
        jsonLd={[buildBreadcrumbJsonLd([{ name: 'Inicio', path: localizedPath('/') }, { name: 'Tour virtual' }], localizedPath('/tour-virtual'))]}
      />
      <Header />

      <main lang={locale === 'es' ? undefined : 'es'}>
        <TourHero sede={sede} />
        <TourFrase sede={sede} />
        <TourCinta items={estaciones.map((estacion) => estacion.nombre)} />
        <ol className="relative mt-[12svh]">
          {estaciones.map((estacion, index) => (
            <Estacion key={estacion.clave} sede={sede} estacion={estacion} index={index} total={estaciones.length} onVisible={onVisible} />
          ))}
        </ol>
        <TourCierre sede={sede} zIndex={estaciones.length + 1} />
      </main>

      <TourRiel estaciones={estaciones} activa={activa} />
      <Footer />
    </div>
  );
};

export default TourVirtual;
