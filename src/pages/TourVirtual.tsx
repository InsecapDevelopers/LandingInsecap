import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { getSedeBySlug, getSedeMapsUrl, sedes, type Sede, type SedeSlug } from '@/data/sedes';
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

const suavizar = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

/**
 * Secuencia de fotogramas que avanza con `progress` (0 a 1). El HTML lleva el primer fotograma como
 * <img> (póster, sin JS y para bots); el canvas lo tapa cuando cargan los demás, que se piden al
 * acercarse la sección. Entre dos fotogramas se hace un fundido para que el avance se vea continuo.
 */
const Secuencia = ({ sede, secuencia, progress, alt, prioridad = false }: {
  sede: SedeSlug;
  secuencia: TourSecuencia;
  progress: MotionValue<number>;
  alt: string;
  prioridad?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagenes = useRef<Array<HTMLImageElement | undefined>>([]);
  const paso = useRef(1);

  const dibujar = (p: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const s = paso.current;
    const f = Math.min(1, Math.max(0, p)) * Math.floor((secuencia.frames - 1) / s);
    const i = Math.floor(f);
    const actual = imagenes.current[i * s];
    if (!actual?.complete || !actual.naturalWidth) return;
    ctx.globalAlpha = 1;
    ctx.drawImage(actual, 0, 0, canvas.width, canvas.height);
    // Fundido solo en el tercio central del paso: quieto en casi cualquier punto, el cuadro se ve nítido.
    const mezcla = suavizar((f - i - 0.35) / 0.3);
    const siguiente = imagenes.current[(i + 1) * s];
    if (mezcla > 0 && siguiente?.complete && siguiente.naturalWidth) {
      ctx.globalAlpha = mezcla;
      ctx.drawImage(siguiente, 0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    // Con ahorro de datos queda solo el póster.
    if (!canvas || conexion?.saveData) return;
    // ponytail: en móvil se carga uno de cada dos fotogramas; si hace falta más ahorro, generar un juego a 640 px.
    paso.current = window.matchMedia('(max-width: 767px)').matches ? 2 : 1;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      for (let i = 0; i < secuencia.frames; i += paso.current) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => dibujar(progress.get());
        img.src = tourFrameSrc(sede, secuencia.clave, i);
        imagenes.current[i] = img;
      }
    }, { rootMargin: '150% 0px' });
    observer.observe(canvas);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sede, secuencia]);

  useMotionValueEvent(progress, 'change', dibujar);

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
          <nav aria-label="Migas de pan" className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            <ol className="flex gap-2">
              <li><Link to={localizedPath('/')} className="hover:text-white">Inicio</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">Tour virtual</li>
            </ol>
          </nav>
          <h1 className="text-[clamp(3rem,11vw,10rem)] font-bold leading-[0.92] tracking-tight text-white [text-shadow:0_4px_40px_rgba(6,13,36,0.55)]">
            <motion.span style={{ x: linea1 }} className="block">Tour virtual</motion.span>
            <motion.span style={{ x: linea2 }} className="mt-2 block text-[0.45em] font-normal leading-tight text-white/75">
              {sede.nombre}.
            </motion.span>
          </h1>
        </motion.div>

        <motion.div style={{ opacity: pista }} className="absolute bottom-8 left-6 z-10 max-w-[38vw] text-white md:left-14 lg:left-20">
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

const Palabra = ({ progress, desde, hasta, children }: { progress: MotionValue<number>; desde: number; hasta: number; children: string }) => {
  const opacity = useTransform(progress, [desde, hasta], [0.25, 1]);
  return <motion.span style={{ opacity }}>{children} </motion.span>;
};

/** Párrafo de respuesta: las palabras se encienden una a una al avanzar el scroll. */
const TourIntro = ({ sede }: { sede: Sede }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] });
  const p = useSuave(scrollYProgress);
  const palabras = `INSECAP es una OTEC fundada en 2009, con casa matriz en ${sede.direccion}, ${sede.ciudad}. Este recorrido muestra sus instalaciones por dentro: recepción, salas de clases, sala de computación, sala de simulación y talleres de práctica, los espacios donde las personas se capacitan.`.split(' ');

  return (
    <section ref={ref} className="px-6 py-[16svh] md:px-14 lg:px-20">
      <p data-respuesta="tour" className="mx-auto max-w-6xl text-left text-[clamp(1.5rem,3.6vw,3.25rem)] font-semibold leading-[1.15] tracking-tight text-white">
        {palabras.map((palabra, i) => (
          <Palabra key={i} progress={p} desde={i / palabras.length} hasta={(i + 1) / palabras.length}>{palabra}</Palabra>
        ))}
      </p>
    </section>
  );
};

/** Cinta con los nombres de las estaciones; se desplaza con el scroll, no con el tiempo. */
const TourCinta = ({ items }: { items: string[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(useSuave(scrollYProgress), [0, 1], ['2%', '-55%']);

  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden border-y border-white/10 py-8">
      <motion.p
        style={{ x }}
        className="flex w-max items-center gap-8 whitespace-nowrap text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.4)]"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            {item}
            <span className="text-[0.4em] text-insecap-cyan [-webkit-text-stroke:0]">✦</span>
          </span>
        ))}
      </motion.p>
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
  const alto = 260 + estacion.frames;
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
                className="absolute right-[4vw] top-[14svh] text-[36vw] font-bold leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.4)] lg:text-[22vw]"
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
      <SEO
        url="/tour-virtual"
        jsonLd={[buildBreadcrumbJsonLd([{ name: 'Inicio', path: localizedPath('/') }, { name: 'Tour virtual' }], localizedPath('/tour-virtual'))]}
      />
      <Header />

      <main lang={locale === 'es' ? undefined : 'es'}>
        <TourHero sede={sede} />
        <TourIntro sede={sede} />
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
