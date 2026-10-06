import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import type { CSSProperties } from 'react';
import { DiaTextReveal } from '@/components/ui/dia-text-reveal';
import { isOpenCourseOfferEnabled } from '@/lib/featureFlags';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { HIGH_PRIORITY, localImage } from '@/lib/images';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { getRespuestaHome } from '@/data/respuestas';

// ponytail: pega aquí la URL del .mp4 (Shopify CDN o /public). Vacío => solo poster.
const VIDEO_SRC = 'https://cdn.shopify.com/videos/c/o/v/24efdc373f8f4f5c8ebebbce1ecdb1e7.mp4';
// ponytail: el CDN sirve tanto .mp4 como .webp animado; el tag correcto depende de la extensión.
const IS_VIDEO = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(VIDEO_SRC);

/* Poster = imagen LCP de la home (Fase 6): WebP local en public/images/hero (fachada de Calama,
   recomprimida desde Shopify Cascada-fachada-y-letrero-scaled.jpg con `cwebp -q 60 -m 6 -resize
   <ancho> 0`), con fetchpriority=high y el preload que inyecta scripts/prerender.mjs. Mismo origen:
   no abre una conexión a cdn.shopify.com antes del LCP. Cubre una caja de 120% del alto de pantalla
   (object-cover). En vertical el ancho real sería ~165vh; se pide 70vh a propósito: va bajo capas
   oscuras y en un móvil 412×823 @1,75x basta el de 1080 px (~45 KB; con 75vh el redondeo pedía 1280). */
const POSTER_WIDTH = 4262;
const POSTER_HEIGHT = 3118;
const POSTER_IMG = localImage(
  '/images/hero/sede-calama-fachada-18c9b2b0',
  [640, 828, 1080, 1280, 1600, 1920],
  '(max-aspect-ratio: 1/1) 70vh, 100vw',
);
const MEDIA_FILTER = { filter: 'contrast(1.08) saturate(1.18) brightness(1.02)' };

/** El mp4 (~3–12 MB) o el .webp animado: solo en escritorio, sin Save-Data ni reduced-motion. */
const canPlayHeroVideo = () => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia('(min-width: 1024px)').matches && !connection?.saveData;
};

type HeroPhrase = {
  h1: string;
  h2: string;
  prefix: string;
  words: string[];
  suffix: string;
};

const VideoHero = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { locale } = useLocalizedPath();

  // El video se monta después de hidratar (el HTML prerenderizado solo trae el poster).
  const [playVideo, setPlayVideo] = useState(false);
  useEffect(() => {
    setPlayVideo(Boolean(VIDEO_SRC) && !reduceMotion && canPlayHeroVideo());
  }, [reduceMotion]);

  // Frase de valor: "Capacitación que fortalece tu operación" + rotatorio "Preparando tu equipo para…"
  const heroPhrase = useMemo(() => {
    const phrases = t('hero.phrases', { returnObjects: true }) as HeroPhrase[];
    return phrases[1] ?? phrases[0];
  }, [i18n.resolvedLanguage, t]);

  // últimas 2 palabras del H1 en gradiente
  const h1Words = heroPhrase.h1.split(' ');
  const h1Head = h1Words.slice(0, -2).join(' ');
  const h1Tail = h1Words.slice(-2).join(' ');

  // barrido DiaTextReveal primero, shine permanente después
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 2400); // 0.4s delay + 1.8s sweep + margen
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-dvh overflow-hidden flex items-center justify-center bg-blue-950"
    >
      {/* ── Media de fondo (video o poster) ── */}
      <motion.div style={{ y: reduceMotion ? 0 : mediaY }} className="absolute inset-0 -top-[10%] h-[120%]">
        <img
          {...POSTER_IMG}
          {...HIGH_PRIORITY}
          alt=""
          width={POSTER_WIDTH}
          height={POSTER_HEIGHT}
          className="absolute inset-0 w-full h-full object-cover"
          style={MEDIA_FILTER}
        />
        {playVideo && (IS_VIDEO ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            style={MEDIA_FILTER}
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : (
          <img src={VIDEO_SRC} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ))}
      </motion.div>

      {/* ── Capas de color: oscuro arriba, se aclara hacia el empalme ── */}
      <div className="absolute inset-0 bg-blue-950/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-blue-950/70" />

      {/* ── Contenido ── */}
      <motion.div
        style={{ y: reduceMotion ? 0 : contentY, opacity: reduceMotion ? 1 : contentOpacity }}
        className="relative z-10 container mx-auto px-8 text-center pb-24"
      >
        {/* initial={false}: el H1 y la píldora están sobre el pliegue y deben verse en el HTML
            prerenderizado (LCP y bots sin JS), no aparecer con opacity 0 hasta hidratar. */}
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
        >
          {h1Head}
          <br />
          {revealed || reduceMotion ? (
            <span
              className={`text-transparent bg-clip-text whitespace-nowrap ${reduceMotion ? '' : 'animate-shine'}`}
              style={
                {
                  backgroundImage:
                    'linear-gradient(110deg, #38bdf8 40%, #7dd3fc 50%, #38bdf8 60%)',
                  backgroundSize: '250% 100%',
                  '--duration': '6s',
                } as CSSProperties
              }
            >
              {h1Tail}
            </span>
          ) : (
            <DiaTextReveal
              text={h1Tail}
              colors={['#0284c7', '#38bdf8', '#e0f7ff', '#22d3ee', '#0ea5e9']}
              textColor="#38bdf8"
              duration={1.8}
              delay={0.4}
              className="whitespace-nowrap font-bold"
            />
          )}
        </motion.h1>

        {/* Pill "A lo largo de todo Chile" bajo el título */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
          className="mt-8 flex justify-center"
        >
          <span className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white/95 text-sm sm:text-base font-semibold tracking-wide">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              {!reduceMotion && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            <MapPin className="w-4 h-4 text-sky-300" aria-hidden="true" />
            {t('hero.reach')}
          </span>
        </motion.div>

        {/* Párrafo de respuesta (Fase 8): qué es INSECAP en 40–60 palabras, con entidades explícitas
            y la cifra 2025 con su fecha. Va en el HTML prerenderizado, sin animación de entrada. */}
        <p
          data-respuesta="home"
          className="mt-8 mx-auto max-w-3xl text-sm sm:text-base leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
        >
          {getRespuestaHome(locale)}
        </p>
      </motion.div>

      {/* ── Empalme con el Hero claro: ondas suaves cyan → indigo → fondo claro ── */}
      <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
        <svg
          className="block w-full h-[100px] sm:h-[150px]"
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0,80 C240,30 480,110 720,70 C960,30 1200,100 1440,55 L1440,150 L0,150 Z"
            fill="#38BDF8"
            opacity="0.4"
          />
          <path
            d="M0,105 C300,55 600,125 900,85 C1120,58 1320,105 1440,80 L1440,150 L0,150 Z"
            fill="#818cf8"
            opacity="0.35"
          />
          <path
            d="M0,125 C320,85 720,140 1080,105 C1260,88 1380,115 1440,100 L1440,150 L0,150 Z"
            fill="hsl(210, 20%, 98%)"
          />
        </svg>
      </div>

      {/* ── Indicador de scroll (une visualmente ambas secciones) ── */}
      <motion.a
        href={isOpenCourseOfferEnabled ? '#curso-abierto' : '#cursos-destacados'}
        aria-label={
          isOpenCourseOfferEnabled
            ? t('videoHero.offerScroll')
            : t('videoHero.scroll')
        }
        onClick={(e) => {
          e.preventDefault();
          const target = isOpenCourseOfferEnabled
            ? document.getElementById('curso-abierto')
            : ref.current?.nextElementSibling;
          target?.scrollIntoView({ behavior: 'smooth' });
        }}
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        style={{ x: '-50%' }}
        className="group absolute bottom-8 sm:bottom-11 left-1/2 z-30 flex flex-col items-center gap-2.5"
      >
        {isOpenCourseOfferEnabled && (
          <span className="px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-insecap-blue text-xs sm:text-sm font-semibold whitespace-nowrap">
            {t('videoHero.offerScroll')}
          </span>
        )}
        <span className="w-16 h-16 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-50 transition-colors">
          <ChevronDown className="w-7 h-7" />
        </span>
      </motion.a>
    </section>
  );
};

export default VideoHero;
