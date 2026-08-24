import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, GraduationCap, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WordRotate } from '@/components/ui/word-rotate';
import { getYearsOfExperience } from '@/lib/insecapUtils';

const CAPIN_IMG = '/CapinMov.webp';

const HERO_IMAGES = [
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_111938161.png?v=1772461187',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Cascada-fachada-y-letrero-scaled.jpg?v=1776094124',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sede-Antofagasta-web.jpg?v=1773345628',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112057871.png?v=1772461266',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112143481.png?v=1772461310',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112230765.png?v=1772461356',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112259390.png?v=1772461385',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112344017.png?v=1772461433',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112418054.png?v=1772461465',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112454997.png?v=1772461500',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/GHorquilla3675_web.jpg?v=1773345899',
];

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
  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentImg((p) => (p + 1) % HERO_IMAGES.length), 5000);
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
          {/* ─── IZQUIERDA: texto ─── */}
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <motion.p
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="inline-flex items-center gap-2.5 mb-5 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-insecap-cyan"
            >
              <span className="w-8 h-1 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" aria-hidden="true" />
              {t('hero.eyebrow')}
            </motion.p>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-[clamp(1.9rem,6.5vw,3rem)] font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-6"
            >
              {rotatePhrase.prefix}
              {/* línea reservada: la palabra rota sin mover el resto del layout */}
              <span className="block min-h-[1.35em]">
                <WordRotate
                  as="span"
                  words={rotatePhrase.words}
                  duration={2500}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-400 inline-block whitespace-nowrap max-w-full"
                />
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-slate-600 text-base sm:text-lg leading-relaxed mb-9"
            >
              {heroPhrase.h2}
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#cursos-destacados"
                onClick={(e) => { e.preventDefault(); scrollTo('cursos-destacados'); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white shadow-lg shadow-sky-500/30 transition-shadow hover:shadow-xl hover:shadow-sky-500/40"
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #38BDF8 100%)' }}
              >
                {t('hero.ctaCourses')}
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#contacto"
                onClick={(e) => { e.preventDefault(); scrollTo('contacto'); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-slate-700 border-2 border-slate-300 hover:border-sky-500 hover:text-sky-600 transition-colors bg-white/70 backdrop-blur-sm"
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
              className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] bg-slate-200"
              role="img"
              aria-label="Instalaciones y actividades de INSECAP"
            >
              {HERO_IMAGES.map((img, idx) => (
                <motion.div
                  key={img}
                  initial={false}
                  animate={{
                    opacity: currentImg === idx ? 1 : 0,
                    scale: currentImg === idx ? 1 : 1.05,
                  }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${img}')` }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" aria-hidden="true" />
            </div>

            {/* chips de stats */}
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -left-4 sm:-left-8 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border border-white"
            >
              <span className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-sky-600" />
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
                <Clock className="w-5 h-5 text-indigo-600" />
              </span>
              <span className="text-left">
                <span className="block text-slate-900 font-bold text-sm leading-none">{getYearsOfExperience()} años</span>
                <span className="block text-slate-500 text-xs mt-1">{t('hero.stats.experience')}</span>
              </span>
            </motion.div>

            {/* Capín asomado */}
            <img
              src={CAPIN_IMG}
              alt="Capín — mascota de Insecap"
              className="absolute -bottom-8 -left-6 sm:-left-14 w-32 sm:w-40 drop-shadow-2xl pointer-events-none"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
