import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Info, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { coursesForMonth, getUpcomingBatches, matchMonthParam } from '@/lib/openCourses';

const OFFER_HREF = '/formulario/cursos-abiertos';

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

  const text = t('openOffer.rolling', 'Cursos abiertos');
  const characters = text.toUpperCase().split('');
  const centerIndex = Math.floor(characters.length / 2);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  // Lo ya dictado se descarta solo: en octubre las fechas de septiembre no aparecen.
  const { courses, months } = useMemo(() => getUpcomingBatches(), []);
  // ?mes=octubre abre la home con esa tanda ya elegida (enlaces de campaña).
  const [searchParams] = useSearchParams();
  const [mes, setMes] = useState(matchMonthParam(searchParams.get('mes'), months) ?? months[0]);
  const offers = coursesForMonth(mes ?? '', courses);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  // card: entra como en StickyCard002 (scale 0.7 / rotación 5° → 1 / 0°)
  const cardScale = useTransform(scrollYProgress, [0.15, 0.7], [0.7, 1]);
  const cardRotate = useTransform(scrollYProgress, [0.15, 0.7], [5, 0]);

  // Sin tandas vigentes la sección entera sobra: mejor nada que un carrusel vacío.
  // Va después de los hooks para no alterar su orden entre renders.
  if (!offers.length) return null;

  return (
    <section
      ref={sectionRef}
      id="curso-abierto"
      // Superficie propia: sin un fondo distinto la onda separadora no contrasta contra
      // el blanco de la sección anterior y no se lee como corte entre bloques.
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-sky-50 via-indigo-50/60 to-white"
    >
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

      {/* ── Filtro de tanda: solo aparece si hay más de un mes con fechas vigentes ── */}
      {months.length > 1 && (
        <div
          role="group"
          aria-label={t('openOffer.monthFilter', 'Mes de la programación')}
          className="flex justify-center gap-2 mb-8 px-4"
        >
          {months.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mes === m}
              onClick={() => {
                setMes(m);
                setCurrent(0);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider border-2 transition-all duration-150 active:scale-95 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                mes === m
                  ? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'border-slate-300 bg-transparent text-slate-600 hover:border-sky-400 hover:text-sky-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* ── Tabs: un botón por curso, para saltar directo al que interesa ── */}
      <div
        role="tablist"
        aria-label={t('openOffer.tablist', 'Cursos abiertos disponibles')}
        className="container mx-auto px-8 md:px-16 lg:px-20 mb-12 md:mb-14 flex flex-wrap justify-center gap-3"
      >
        {offers.map((offer, i) => (
          <button
            key={offer.titleHighlight}
            role="tab"
            id={`curso-tab-${i}`}
            aria-selected={current === i}
            aria-controls={`curso-panel-${i}`}
            onClick={() => api?.scrollTo(i)}
            className={`px-7 py-4 md:px-9 md:py-5 rounded-full text-base md:text-lg font-semibold transition-all duration-150 active:scale-95 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insecap-blue focus-visible:ring-offset-2 ${
              current === i
                ? 'bg-insecap-blue text-white shadow-lg shadow-insecap-blue/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {offer.title} {offer.titleHighlight}
          </button>
        ))}
      </div>

      {/* ── Carrusel: imagen cuadrada + contenido (estilo sección DUA) ── */}
      <div className="container mx-auto px-8 md:px-16 lg:px-20">
        {/* key={mes}: al cambiar de tanda el carrusel se remonta y vuelve al primer curso */}
        <Carousel key={mes} opts={{ loop: true }} setApi={setApi} className="w-full">
          <CarouselContent>
            {offers.map((offer, slide) => (
              <CarouselItem
                key={offer.titleHighlight}
                id={`curso-panel-${slide}`}
                aria-labelledby={`curso-tab-${slide}`}
              >
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                  {/* Izquierda: card cuadrada grande */}
                  <motion.div
                    style={reduceMotion ? undefined : { scale: cardScale, rotate: cardRotate }}
                    className="w-full lg:w-1/2"
                  >
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={offer.image}
                        alt={`Afiche del curso ${offer.title} ${offer.titleHighlight}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading={slide === 0 ? 'eager' : 'lazy'}
                      />
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
                      {offer.title} <span className="text-blue-600">{offer.titleHighlight}</span>
                    </h2>
                    <div className="w-24 h-2 bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full" />

                    <p className="text-gray-600 text-lg leading-relaxed">{offer.description}</p>

                    {/* Fechas: una sesión por línea, con cifras tabulares para que alineen */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="text-slate-800 font-semibold">{mes}</span>
                          <span className="text-slate-500 text-sm">
                            {t('openOffer.modalityLabel', 'Modalidad')} {offer.modality.toLowerCase()}
                          </span>
                        </div>
                      </div>
                      {/* Cada fecha es una fila-botón: borde y fondo propios para que se lea
                          como pulsable sin necesidad de pasar el cursor por encima. */}
                      <ul className="flex flex-col gap-2 mt-4">
                        {offer.sessions.map((fecha) => (
                          <li key={fecha.id}>
                            <Link
                              to={`${localizedPath(OFFER_HREF)}?fecha=${fecha.id}&modalidad=${offer.modalityId}`}
                              aria-label={`Inscribirse en ${offer.title} ${offer.titleHighlight}, ${fecha.label}${fecha.city ? `, sede ${fecha.city}` : ''}`}
                              className="group flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium tabular-nums transition-all duration-150 hover:border-blue-500 hover:text-insecap-blue active:scale-[0.98] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
                            >
                              <span>
                                {fecha.label}
                                {fecha.city && (
                                  <span className="ml-2 text-slate-500 font-normal">{fecha.city}</span>
                                )}
                              </span>
                              <span className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold shrink-0">
                                <span className="hidden sm:inline opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                  {t('openOffer.enroll', 'Inscribirse')}
                                </span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {offer.note && (
                        <p className="mt-4 flex gap-2 text-sm leading-relaxed text-slate-500">
                          <Info className="mt-0.5 w-4 h-4 shrink-0 text-blue-600" />
                          <span>{offer.note.es}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4">
                      {[
                        { icon: Clock, text: `${offer.duration} cronológicas` },
                        ...(offer.location ? [{ icon: MapPin, text: offer.location }] : []),
                        { icon: Users, text: 'Cupos limitados' },
                      ].map(({ icon: Icon, text: detail }, i) => (
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
                        to={`${localizedPath(OFFER_HREF)}?fecha=${offer.sessions[0].id}&modalidad=${offer.modalityId}`}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white shadow-lg shadow-sky-500/30 transition-transform duration-100 ease-out hover:scale-105 active:scale-90 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                        style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #38BDF8 100%)' }}
                      >
                        {t('openOffer.cta', 'Inscríbete aquí')}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controles: ocultos en móvil, donde el gesto de swipe ya funciona */}
          <CarouselPrevious className="hidden lg:flex -left-4 xl:-left-12" />
          <CarouselNext className="hidden lg:flex -right-4 xl:-right-12" />
        </Carousel>

        {/* Indicadores: refuerzan la posición al deslizar en móvil; en escritorio mandan los tabs */}
        <div className="flex lg:hidden justify-center gap-2 mt-10" aria-hidden="true">
          {offers.map((offer, i) => (
            <span
              key={offer.titleHighlight}
              className={`h-2.5 rounded-full transition-all ${
                current === i ? 'w-8 bg-blue-600' : 'w-2.5 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpenCourseOffer;
