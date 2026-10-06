import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, MapPin, Pickaxe, ShieldCheck } from 'lucide-react';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { SAP_COURSES, SAP_HREF, SAP_LOGO, SAP_ROLE_ROUTES, SAP_TOTAL_HOURS } from '@/lib/sapCatalog';
import SapEntorno from '@/components/SapEntorno';
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars';

const hoursOf = (ids: string[]) =>
  SAP_COURSES.filter((c) => ids.includes(c.id)).reduce((sum, c) => sum + c.hours, 0);

/**
 * Sección de la especialidad SAP PM (Insecap Minerals) en la home.
 * Va justo bajo los sellos Codelco/CCM: la acreditación minera respalda la promesa.
 * Tarjeta redondeada dentro del gradiente de la home, así no corta la página (Wave Rule).
 * Las rutas por rol abren la landing con esa ruta ya cargada (?ruta=…#catalogo).
 */
const SapMineralsBanner = () => {
  const { localizedPath, locale } = useLocalizedPath();
  const reduceMotion = useReducedMotion();
  const landing = localizedPath(SAP_HREF);

  const content = {
    es: {
      badge: 'Insecap Minerals',
      kicker: 'Especialidad SAP S/4HANA · Módulo PM',
      title: 'Ya tienes SAP PM.',
      titleHighlight: 'Falta que tu equipo lo domine.',
      body: 'Formamos a tu equipo de mantenimiento sobre los procesos de tu operación, del aviso al análisis, con práctica en nuestra plataforma propia SAP Insecap Minerals.',
      ctaPrimary: 'Conoce la especialidad',
      ctaSecondary: 'Agenda un diagnóstico',
      trust: ['Práctica sin tocar tu sistema productivo', 'Calama · Antofagasta · Online en vivo'],
      stats: [
        { value: String(SAP_COURSES.length), label: 'cursos modulares' },
        { value: `${SAP_TOTAL_HOURS} h`, label: 'ruta completa' },
        { value: String(SAP_ROLE_ROUTES.length), label: 'rutas por rol' },
      ],
      pickerTitle: 'Arma el programa de tu equipo',
      pickerLead: '¿Quién se capacita? Parte por una ruta sugerida.',
      courses: 'cursos',
      fullRoute: 'Ruta completa',
      seeAll: 'Ver los 9 cursos y armar a medida',
      cycleTitle: 'Del aviso al análisis',
      cycle: ['Identificación', 'Planificación', 'Programación', 'Ejecución', 'Cierre', 'Análisis'],
    },
    en: {
      badge: 'Insecap Minerals',
      kicker: 'SAP S/4HANA PM Module Specialization',
      title: 'You already have SAP PM.',
      titleHighlight: 'Now your team needs to master it.',
      body: 'We train your maintenance team on your operation’s own processes, from notification to analysis, with hands-on practice on our own SAP Insecap Minerals platform.',
      ctaPrimary: 'Explore the specialization',
      ctaSecondary: 'Book a diagnosis',
      trust: ['Practice without touching your production system', 'Calama · Antofagasta · Live online'],
      stats: [
        { value: String(SAP_COURSES.length), label: 'modular courses' },
        { value: `${SAP_TOTAL_HOURS} h`, label: 'full path' },
        { value: String(SAP_ROLE_ROUTES.length), label: 'role-based paths' },
      ],
      pickerTitle: 'Build your team’s program',
      pickerLead: 'Who is being trained? Start from a suggested path.',
      courses: 'courses',
      fullRoute: 'Full path',
      seeAll: 'See all 9 courses and build your own',
      cycleTitle: 'From notification to analysis',
      cycle: ['Identification', 'Planning', 'Scheduling', 'Execution', 'Close-out', 'Analysis'],
    },
    pt: {
      badge: 'Insecap Minerals',
      kicker: 'Especialização SAP S/4HANA · Módulo PM',
      title: 'Você já tem SAP PM.',
      titleHighlight: 'Falta sua equipe dominá-lo.',
      body: 'Formamos sua equipe de manutenção sobre os processos da sua operação, da nota à análise, com prática na nossa plataforma própria SAP Insecap Minerals.',
      ctaPrimary: 'Conheça a especialização',
      ctaSecondary: 'Agende um diagnóstico',
      trust: ['Prática sem tocar seu sistema produtivo', 'Calama · Antofagasta · Online ao vivo'],
      stats: [
        { value: String(SAP_COURSES.length), label: 'cursos modulares' },
        { value: `${SAP_TOTAL_HOURS} h`, label: 'trilha completa' },
        { value: String(SAP_ROLE_ROUTES.length), label: 'trilhas por função' },
      ],
      pickerTitle: 'Monte o programa da sua equipe',
      pickerLead: 'Quem será treinado? Comece por uma trilha sugerida.',
      courses: 'cursos',
      fullRoute: 'Trilha completa',
      seeAll: 'Ver os 9 cursos e montar sob medida',
      cycleTitle: 'Da nota à análise',
      cycle: ['Identificação', 'Planejamento', 'Programação', 'Execução', 'Encerramento', 'Análise'],
    },
  }[locale];

  const routes = [
    ...SAP_ROLE_ROUTES.map((r) => ({ id: r.id, label: r.label[locale], ids: r.courses })),
    { id: 'completa', label: content.fullRoute, ids: SAP_COURSES.map((c) => c.id) },
  ];

  return (
    <section aria-labelledby="sap-banner-title" className="relative z-20 pb-16 pt-4 [&_p]:text-left">
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-[2rem] shadow-2xl"
        >
          {/* Una sola superficie: mensaje + rutas, entorno con capturas y ciclo, sobre un cielo de estrellas que sigue al puntero */}
          <StarsBackground
            starColor="rgba(186, 230, 253, 0.85)"
            factor={0.03}
            pointerEvents={false}
            className="rounded-[2rem] bg-gradient-to-br from-[#0D1C3F] via-[#1B2A6B] to-insecap-blue"
          >
          {/* Halo cian arriba a la derecha: da profundidad sin competir con las estrellas */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />

          <div className="relative grid gap-12 px-6 py-12 sm:px-10 md:py-16 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:px-14 lg:py-20">
            {/* Mensaje */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <img src={SAP_LOGO} alt="SAP" width={1280} height={634} loading="lazy" className="h-9 w-auto md:h-10" />
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  <Pickaxe className="h-4 w-4 text-sky-300" aria-hidden="true" />
                  {content.badge}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200/90">{content.kicker}</span>
              </div>

              <h2
                id="sap-banner-title"
                className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-white"
              >
                {content.title}{' '}
                <span className="bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent">
                  {content.titleHighlight}
                </span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">{content.body}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={landing}
                  className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-insecap-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-insecap-blue/30 transition-all duration-150 hover:scale-[1.04] hover:bg-[#3547B1] hover:shadow-insecap-blue/50 active:scale-95 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1C3F]"
                >
                  {content.ctaPrimary}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  to={`${landing}#cotizar`}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/40 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-sky-300 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                >
                  {content.ctaSecondary}
                </Link>
              </div>

              <ul className="mt-6 flex flex-col gap-2 text-sm text-white/75 sm:flex-row sm:gap-6">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                  {content.trust[0]}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                  {content.trust[1]}
                </li>
              </ul>

              <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-white/15 pt-8 lg:mt-12">
                {content.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse justify-end">
                    <dt className="mt-1 text-xs leading-snug text-white/70 sm:text-sm">{stat.label}</dt>
                    <dd className="whitespace-nowrap text-2xl font-bold tabular-nums text-white sm:text-3xl md:text-4xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Selector de rutas: la vitrina es el propio catálogo, no una imagen */}
            <div className="flex flex-col rounded-3xl bg-white p-6 text-[#0D1C3F] shadow-2xl sm:p-7 lg:self-center">
              <h3 className="text-lg font-bold">{content.pickerTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{content.pickerLead}</p>
              <ul className="mt-5 space-y-2">
                {routes.map((route) => {
                  const isFull = route.id === 'completa';
                  return (
                    <li key={route.id}>
                      <Link
                        to={`${landing}?ruta=${route.id}#catalogo`}
                        className={`group flex min-h-[56px] flex-col items-start justify-between gap-1 rounded-2xl sm:flex-row sm:items-center sm:gap-3 border px-4 py-3 transition-all duration-150 hover:-translate-y-0.5 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insecap-blue focus-visible:ring-offset-2 ${
                          isFull
                            ? 'border-insecap-blue bg-insecap-blue text-white hover:shadow-lg hover:shadow-insecap-blue/30'
                            : 'border-slate-200 bg-slate-50 hover:border-insecap-blue hover:bg-white hover:shadow-card'
                        }`}
                      >
                        <span className="text-sm font-semibold leading-snug">{route.label}</span>
                        <span className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto">
                          <span className={`text-xs tabular-nums ${isFull ? 'text-white/85' : 'text-muted-foreground'}`}>
                            {route.ids.length} {content.courses} · {hoursOf(route.ids)} h
                          </span>
                          <ArrowUpRight
                            className={`h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${isFull ? 'text-white' : 'text-insecap-blue'}`}
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                to={`${landing}#catalogo`}
                className="group mt-auto inline-flex min-h-[44px] items-center gap-2 pt-5 text-sm font-semibold text-insecap-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insecap-blue"
              >
                {content.seeAll}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Entorno SAP Insecap Minerals: la prueba concreta de lo "a medida" */}
          <div className="relative px-6 pb-12 sm:px-10 md:pb-16 lg:px-14 lg:pb-20">
            <SapEntorno embedded />
          </div>

          {/* Ciclo del trabajo: muestra el alcance de la especialidad de un vistazo */}
          <div className="relative border-t border-white/10 bg-[#0D1C3F]/40 px-6 py-6 sm:px-10 lg:px-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">{content.cycleTitle}</p>
            <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
              {content.cycle.map((stage, i) => (
                <li key={stage} className="flex items-center gap-2 text-sm font-medium text-white/85">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-sky-300/50 text-xs font-bold tabular-nums text-sky-200">
                    {i + 1}
                  </span>
                  {stage}
                </li>
              ))}
            </ol>
          </div>
          </StarsBackground>
        </motion.div>
      </div>
    </section>
  );
};

export default SapMineralsBanner;
