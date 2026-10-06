import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WordRotate } from '@/components/ui/word-rotate';
import { getYearsOfExperience } from '@/lib/insecapUtils';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { localImage } from '@/lib/images';

// Capín estático (Fase 6): el .webp animado pesaba 5,9 MB. 320 px = 2x del ancho de render (w-40).
const CAPIN_IMG = '/images/capin/capin-saludo-320.webp';

/* Fotos de la tarjeta (Fase 6): WebP locales en public/images/hero, en el mismo orden que las
   originales de Shopify (imagen_2026-03-02_111938161.png, Cascada-fachada-y-letrero-scaled.jpg,
   Sede-Antofagasta-web.jpg, imagen_2026-03-02_112057871…112454997.png, GHorquilla3675_web.jpg).
   Eran fotos sin transparencia guardadas como PNG (~90 KB a 640 px); con
   `cwebp -q 70 -m 6 -resize <ancho> 0` quedan en 16–48 KB y no abren otra conexión cerca del LCP. */
const HERO_IMAGES = [
  '/images/hero/imagen-2026-03-02-111938161-d2a62cc4',
  '/images/hero/cascada-fachada-y-letrero-af634769',
  '/images/hero/sede-antofagasta-web-8c8ce7d7',
  '/images/hero/imagen-2026-03-02-112057871-c08175ba',
  '/images/hero/imagen-2026-03-02-112143481-47a0ef80',
  '/images/hero/imagen-2026-03-02-112230765-f2386630',
  '/images/hero/imagen-2026-03-02-112259390-0b0732a8',
  '/images/hero/imagen-2026-03-02-112344017-92a40906',
  '/images/hero/imagen-2026-03-02-112418054-5e222aa3',
  '/images/hero/imagen-2026-03-02-112454997-5e9258e1',
  '/images/hero/ghorquilla3675-web-4525052d',
];

/* Tarjeta 4:3 de hasta 560 px (bajo el pliegue): srcset con el ancho de render. */
const HERO_IMAGE_SIZES = '(min-width: 640px) 560px, calc(100vw - 4rem)';
const heroImage = (base: string) => localImage(base, [400, 640, 828, 1120], HERO_IMAGE_SIZES);

/* ——— animation helpers ——— */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const Hero = () => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();

  type HeroPhrase = {
    h1: string;
    h2: string;
    prefix: string;
    words: string[];
    suffix: string;
  };

  // ponytail: h1/h2 de la frase 3; el rotatorio es "Preparando tu equipo para…" (frase 2).
  const { heroPhrase, rotatePhrase } = useMemo(() => {
    const phrases = t('hero.phrases', { returnObjects: true }) as HeroPhrase[];
    return { heroPhrase: phrases[2] ?? phrases[0], rotatePhrase: phrases[1] ?? phrases[0] };
  }, [i18n.resolvedLanguage, t]);

  // carrusel con fade en la tarjeta de imagen
  // prevImg: la que sale; queda montada debajo durante el fundido (null antes del primer cambio).
  // preloadNext: la siguiente no se monta en la carga (Fase 6, presupuesto de peso <1,5 MB): el primer
  // tick solo la precarga y el cambio llega en el segundo; desde ahí siempre hay una precargada.
  const [{ currentImg, prevImg, preloadNext }, setSlides] = useState<{
    currentImg: number;
    prevImg: number | null;
    preloadNext: boolean;
  }>({
    currentImg: 0,
    prevImg: null,
    preloadNext: false,
  });
  useEffect(() => {
    const timer = setInterval(
      () => setSlides((s) => (s.preloadNext
        ? { currentImg: (s.currentImg + 1) % HERO_IMAGES.length, prevImg: s.currentImg, preloadNext: true }
        : { ...s, preloadNext: true })),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative w-full bg-transparent">
      {/* ── Fondo: retícula de puntos suave ── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none text-slate-300"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="hero-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>

      {/* formas geométricas flotantes */}
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -14, 0], rotate: [12, 20, 12] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-[6%] w-10 h-10 border-[3px] border-sky-400/50 rounded-lg rotate-12 pointer-events-none hidden md:block"
        aria-hidden="true"
      />
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-32 right-[8%] w-6 h-6 rounded-full border-[3px] border-indigo-400/50 pointer-events-none hidden md:block"
        aria-hidden="true"
      />

      {/* ── Contenido ── */}
      <div className="container mx-auto px-8 sm:px-14 lg:px-16 relative z-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
          {/* ─── IZQUIERDA: texto ───
              initial={false}: el texto se ve en el HTML prerenderizado (sin JS y antes de hidratar). */}
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial={false}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="inline-flex items-center gap-2.5 mb-5 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-insecap-cyan-ink"
            >
              <span className="w-8 h-1 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" aria-hidden="true" />
              {t('hero.eyebrow')}
            </motion.p>

            {/* h2: el único H1 de la home es el de VideoHero. */}
            <motion.h2
              custom={1}
              variants={fadeUp}
              initial={false}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-[clamp(1.9rem,6.5vw,3rem)] font-bold text-slate-900 leading-[1.15] tracking-tight mb-6"
            >
              {rotatePhrase.prefix}
              {/* línea reservada: la palabra rota sin mover el resto del layout */}
              <span className="block min-h-[1.35em]">
                <WordRotate
                  as="span"
                  words={rotatePhrase.words}
                  duration={2500}
                  className="text-insecap-cyan-ink inline-block whitespace-nowrap max-w-full"
                />
              </span>
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial={false}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-slate-600 text-base sm:text-lg leading-relaxed mb-9"
            >
              {heroPhrase.h2}
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial={false}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#cursos-destacados"
                onClick={(e) => { e.preventDefault(); scrollTo('cursos-destacados'); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white bg-insecap-blue hover:bg-[#3547B1] shadow-lg shadow-insecap-blue/30 transition-[background-color,box-shadow] hover:shadow-xl hover:shadow-insecap-blue/40"
              >
                {t('hero.ctaCourses')}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </motion.a>
              <motion.a
                href="#contacto"
                onClick={(e) => { e.preventDefault(); scrollTo('contacto'); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-slate-700 border-2 border-slate-300 hover:border-insecap-cyan-ink hover:text-insecap-cyan-ink transition-colors bg-white/70 backdrop-blur-sm"
              >
                {t('hero.ctaContact')}
              </motion.a>
            </motion.div>
          </div>

          {/* ─── DERECHA: tarjeta de imagen + chips flotantes + Capín ─── */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mx-auto w-full max-w-[560px]"
          >
            {/* marco de gradiente desplazado detrás */}
            <div
              className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-sky-400 via-cyan-300 to-indigo-400 -rotate-2 opacity-70"
              aria-hidden="true"
            />
            <div
              className="relative isolate rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] bg-slate-200"
              role="img"
              aria-label={t('hero.imagesLabel')}
            >
              {/* Solo se montan la anterior (queda debajo mientras la actual hace el fundido), la
                  actual y la siguiente (precargada con opacity 0), no las 11. `isolate` encierra sus
                  z-index para que no tapen los chips ni a Capín. */}
              {HERO_IMAGES.map((img, idx) => {
                const isCurrent = idx === currentImg;
                const isNext = preloadNext && idx === (currentImg + 1) % HERO_IMAGES.length;
                const isPrev = idx === prevImg;
                if (!isCurrent && !isNext && !isPrev) return null;
                return (
                  <motion.img
                    key={img}
                    {...heroImage(img)}
                    alt=""
                    width={1600}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    initial={false}
                    animate={{
                      opacity: isNext ? 0 : 1,
                      scale: isCurrent ? 1 : 1.05,
                    }}
                    transition={{ duration: 1.4, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ zIndex: isCurrent ? 2 : isPrev ? 1 : 0 }}
                  />
                );
              })}
              <div className="absolute inset-0 z-[3] bg-gradient-to-t from-slate-900/30 to-transparent" aria-hidden="true" />
            </div>

            {/* chips de stats */}
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -left-4 sm:-left-8 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border border-white"
            >
              <span className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-sky-600" aria-hidden="true" />
              </span>
              <span className="text-left">
                <span className="block text-slate-900 font-bold text-sm leading-none">2.3K+</span>
                <span className="block text-slate-500 text-xs mt-1">{t('hero.stats.coursesDelivered')}</span>
              </span>
            </motion.div>
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              className="absolute -bottom-5 right-2 sm:-right-6 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border border-white"
            >
              <span className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" aria-hidden="true" />
              </span>
              <span className="text-left">
                <span className="block text-slate-900 font-bold text-sm leading-none">{t('hero.years', { count: getYearsOfExperience() })}</span>
                <span className="block text-slate-500 text-xs mt-1">{t('hero.stats.experience')}</span>
              </span>
            </motion.div>

            {/* Capín asomado */}
            <img
              src={CAPIN_IMG}
              alt=""
              aria-hidden="true"
              width={320}
              height={569}
              loading="lazy"
              decoding="async"
              className="absolute -bottom-8 -left-6 sm:-left-14 w-32 sm:w-40 h-auto drop-shadow-2xl pointer-events-none"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
