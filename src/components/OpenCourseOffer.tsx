import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

// ponytail: contenido de las ofertas editable aquí; conectar a la API de cursos abiertos
// cuando exista el flujo real.
const OFFERS = [
  {
    title: 'Trabajo en',
    titleHighlight: 'Altura Física',
    description:
      'Curso presencial con práctica en torres de entrenamiento y equipos reales. Dirigido a trabajadores que realizan labores sobre nivel y necesitan acreditar competencias para faena.',
    image:
      'https://storageisecap.sfo2.digitaloceanspaces.com/noticias/f7ae80b8-69c6-4cd3-b60e-22c98c401da9.jpeg',
    // Las fechas son datos, no una frase: se listan una por línea para poder escanearlas.
    // id = calendarización de la API (/api/contacto/cursos-particulares); preselecciona la fecha en el form
    sessions: [
      { id: '456', label: '03-08-2026 al 04-08-2026' },
      { id: '457', label: '10-08-2026 al 11-08-2026' },
      { id: '458', label: '17-08-2026 al 18-08-2026' },
      { id: '459', label: '24-08-2026 al 24-08-2026' },
    ],
    details: [
      { icon: MapPin, text: 'Sede Calama · La Cascada 1513' },
      { icon: Users, text: 'Cupos limitados · certificación incluida' },
    ],
  },
  {
    title: 'Técnicas de',
    titleHighlight: 'Aislación y Bloqueo',
    description:
      'Curso presencial sobre procedimientos LOTO con simulador de bloqueo eléctrico. Dirigido a personal de mantenimiento y operaciones que interviene equipos energizados.',
    image:
      'https://storageisecap.sfo2.digitaloceanspaces.com/noticias/f7834dae-418d-40fb-bff5-fc60720f0db1.jpeg',
    sessions: [
      { id: '460', label: '04-08-2026 al 04-08-2026' },
      { id: '461', label: '11-08-2026 al 11-08-2026' },
      { id: '462', label: '18-08-2026 al 18-08-2026' },
      { id: '463', label: '25-08-2026 al 25-08-2026' },
    ],
    details: [
      { icon: MapPin, text: 'Sede Calama · La Cascada 1513' },
      { icon: Users, text: 'Cupos limitados · certificación incluida' },
    ],
  },
  {
    title: 'Espacios',
    titleHighlight: 'Confinados',
    description:
      'Curso presencial con práctica en rescate y control de atmósferas peligrosas. Dirigido a trabajadores que ingresan a espacios confinados y a quienes supervisan la maniobra.',
    image:
      'https://storageisecap.sfo2.digitaloceanspaces.com/noticias/0c86ecc5-7301-495c-a23e-cae1bf549914.jpeg',
    sessions: [
      { id: '464', label: '06-08-2026 al 06-08-2026' },
      { id: '465', label: '13-08-2026 al 13-08-2026' },
      { id: '466', label: '20-08-2026 al 20-08-2026' },
      { id: '467', label: '27-08-2026 al 27-08-2026' },
    ],
    details: [
      { icon: MapPin, text: 'Sede Calama · La Cascada 1513' },
      { icon: Users, text: 'Cupos limitados · certificación incluida' },
    ],
  },
];

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

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

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

      {/* ── Tabs: un botón por curso, para saltar directo al que interesa ── */}
      <div
        role="tablist"
        aria-label={t('openOffer.tablist', 'Cursos abiertos disponibles')}
        className="container mx-auto px-8 md:px-16 lg:px-20 mb-12 md:mb-14 flex flex-wrap justify-center gap-3"
      >
        {OFFERS.map((offer, i) => (
          <button
            key={offer.titleHighlight}
            role="tab"
            id={`curso-tab-${i}`}
            aria-selected={current === i}
            aria-controls={`curso-panel-${i}`}
            onClick={() => api?.scrollTo(i)}
            className={`px-5 py-3 rounded-full text-sm font-semibold transition-all ${
              current === i
                ? 'bg-insecap-blue text-white shadow-lg shadow-insecap-blue/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {offer.title} {offer.titleHighlight}
          </button>
        ))}
      </div>

      {/* ── Carrusel: imagen cuadrada + contenido (estilo sección DUA) ── */}
      <div className="container mx-auto px-8 md:px-16 lg:px-20">
        <Carousel opts={{ loop: true }} setApi={setApi} className="w-full">
          <CarouselContent>
            {OFFERS.map((offer, slide) => (
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
                        alt={`Afiche del curso ${offer.title} ${offer.titleHighlight}, agosto 2026, sede Calama, modalidad presencial`}
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
                          <span className="text-slate-800 font-semibold">Agosto 2026</span>
                          <span className="text-slate-500 text-sm">
                            {t('openOffer.modality', 'Modalidad presencial (seleccione la fecha)')}
                          </span>
                        </div>
                      </div>
                      {/* Cada fecha es una fila-botón: borde y fondo propios para que se lea
                          como pulsable sin necesidad de pasar el cursor por encima. */}
                      <ul className="flex flex-col gap-2 mt-4">
                        {offer.sessions.map((fecha) => (
                          <li key={fecha.id}>
                            <Link
                              to={`${localizedPath(OFFER_HREF)}?fecha=${fecha.id}`}
                              aria-label={`Inscribirse en ${offer.title} ${offer.titleHighlight}, ${fecha.label}`}
                              className="group flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium tabular-nums transition-all duration-150 hover:border-blue-500 hover:text-insecap-blue active:scale-[0.98] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
                            >
                              {fecha.label}
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
                    </div>

                    <div className="grid gap-4">
                      {offer.details.map(({ icon: Icon, text: detail }, i) => (
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
                        to={localizedPath(OFFER_HREF)}
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
          {OFFERS.map((offer, i) => (
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
