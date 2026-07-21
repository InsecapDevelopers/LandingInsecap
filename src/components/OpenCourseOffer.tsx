import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/hooks/use-localized-path';

// ponytail: contenido de la oferta editable aquí; conectar a Shopify cuando exista flujo real.
const OFFER = {
  title: 'Operación Segura de',
  titleHighlight: 'Grúa Horquilla',
  description:
    'Curso presencial con práctica en equipos reales y certificación SENCE. Dirigido a operadores y personal de bodega que necesitan acreditar competencias para faena.',
  image:
    'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/GHorquilla3675_web.jpg?v=1773345899',
  details: [
    { icon: Calendar, text: 'Inicio 10 de agosto · 24 horas cronológicas' },
    { icon: MapPin, text: 'Sede Calama · también en modalidad cerrada para empresas' },
    { icon: Users, text: 'Cupos limitados · certificación incluida' },
  ],
  href: '/cursos',
};

/* Rolling text: cada carácter converge al centro con el scroll (adaptado de Skiper31 CharacterV1) */
const RollingChar = ({
  char,
  index,
  centerIndex,
  progress,
}: {
  char: string;
  index: number;
  centerIndex: number;
  progress: MotionValue<number>;
}) => {
  const distance = index - centerIndex;
  const x = useTransform(progress, [0, 0.5], [distance * 40, 0]);
  const rotateX = useTransform(progress, [0, 0.5], [distance * 40, 0]);
  const opacity = useTransform(progress, [0, 0.4], [0.2, 1]);

  return (
    <motion.span
      className={char === ' ' ? 'inline-block w-3 sm:w-4' : 'inline-block'}
      style={{ x, rotateX, opacity }}
    >
      {char}
    </motion.span>
  );
};

const OpenCourseOffer = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const text = t('openOffer.rolling', 'Curso abierto');
  const characters = text.toUpperCase().split('');
  const centerIndex = Math.floor(characters.length / 2);

  // card: entra como en StickyCard002 (scale 0.7 / rotación 5° → 1 / 0°)
  const cardScale = useTransform(scrollYProgress, [0.15, 0.7], [0.7, 1]);
  const cardRotate = useTransform(scrollYProgress, [0.15, 0.7], [5, 0]);

  return (
    <section ref={sectionRef} id="curso-abierto" className="relative py-20 md:py-28 overflow-hidden">
      {/* ── Rolling text ── */}
      <div
        className="text-center text-[clamp(1.8rem,6vw,4rem)] font-extrabold uppercase tracking-tight text-insecap-blue mb-12 md:mb-16 px-4"
        style={{ perspective: '500px' }}
        aria-label={text}
      >
        {reduceMotion
          ? text.toUpperCase()
          : characters.map((char, index) => (
              <RollingChar
                key={index}
                char={char}
                index={index}
                centerIndex={centerIndex}
                progress={scrollYProgress}
              />
            ))}
      </div>

      {/* ── Imagen cuadrada + contenido (estilo sección DUA) ── */}
      <div className="container mx-auto px-8 md:px-16 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Izquierda: card cuadrada grande */}
          <motion.div
            style={reduceMotion ? undefined : { scale: cardScale, rotate: cardRotate }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={OFFER.image}
                alt={`${OFFER.title} ${OFFER.titleHighlight}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 to-transparent" />
              <span className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-insecap-cyan text-white text-xs font-bold uppercase tracking-wider">
                {t('openOffer.badge', 'Cupos disponibles')}
              </span>
            </div>
          </motion.div>

          {/* Derecha: texto editable */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
              {t('openOffer.eyebrow', 'Inscripciones abiertas')}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight">
              {OFFER.title} <span className="text-blue-600">{OFFER.titleHighlight}</span>
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full" />

            <p className="text-gray-600 text-lg leading-relaxed">{OFFER.description}</p>

            <div className="grid gap-4 mt-2">
              {OFFER.details.map(({ icon: Icon, text: detail }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:bg-slate-100"
                >
                  <Icon className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="text-slate-800 font-semibold">{detail}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link
                to={localizedPath(OFFER.href)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white shadow-lg shadow-sky-500/30 transition-all hover:shadow-xl hover:shadow-sky-500/40 hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #38BDF8 100%)' }}
              >
                {t('openOffer.cta', 'Inscríbete aquí')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenCourseOffer;
