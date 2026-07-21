import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import type { CSSProperties } from 'react';
import { DiaTextReveal } from '@/components/ui/dia-text-reveal';
import { isOpenCourseOfferEnabled } from '@/lib/featureFlags';
import { useTranslation } from 'react-i18next';

// ponytail: pega aquí la URL del .mp4 (Shopify CDN o /public). Vacío => solo poster.
const VIDEO_SRC = 'https://cdn.shopify.com/videos/c/o/v/24efdc373f8f4f5c8ebebbce1ecdb1e7.mp4';
const POSTER =
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Banner-Nosotros-Web-16-anos-scaled.jpg?v=1776093986';

// ponytail: el CDN sirve tanto .mp4 como .webp animado; el tag correcto depende de la extensión.
const IS_VIDEO = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(VIDEO_SRC);

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
        {IS_VIDEO ? (
          <video
            className="w-full h-full object-cover"
            style={{ filter: 'contrast(1.08) saturate(1.18) brightness(1.02)' }}
            src={VIDEO_SRC}
            poster={POSTER}
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : (
          <img
            src={VIDEO_SRC || POSTER}
            alt=""
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        )}
      </motion.div>

      {/* ── Capas de color: oscuro arriba, se aclara hacia el empalme ── */}
      <div className="absolute inset-0 bg-blue-950/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-blue-950/70" />

      {/* ── Contenido ── */}
      <motion.div
        style={{ y: reduceMotion ? 0 : contentY, opacity: reduceMotion ? 1 : contentOpacity }}
        className="relative z-10 container mx-auto px-8 text-center pb-24"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
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
              className="whitespace-nowrap font-extrabold"
            />
          )}
        </motion.h1>

        {/* Pill "A lo largo de todo Chile" bajo el título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
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
            ? t('videoHero.offerScroll', 'Click para inscribirte en el nuevo curso')
            : t('videoHero.scroll', 'Bajar al contenido')
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
            {t('videoHero.offerScroll', '¡Click para inscribirte en el nuevo curso!')}
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
