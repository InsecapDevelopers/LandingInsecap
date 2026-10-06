import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Clock,
  FileText,
  LineChart,
  Minus,
  Monitor,
  Pickaxe,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { ClientTypeSwitch } from '@/components/ClientTypeSwitch';
import OpenCourseRequestForm from '@/components/OpenCourseRequestForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import SapEntorno from '@/components/SapEntorno';
import { SAP_COURSES, SAP_ENV_SHOTS, SAP_HREF, SAP_LOGO, SAP_ROLE_ROUTES, SAP_TOTAL_HOURS } from '@/lib/sapCatalog';

// Paleta propia de esta página (no toca los tokens globales del sitio).
// navy #101D42 · cobalto #284FD8 · cian #08B8EC (solo sobre fondo oscuro) · claro #F5F8FC
// Fondo del formulario: WebP de 1600 px en public/ (el PNG de origen, 2171×724, pesaba 1,9 MB).
const FORM_BG = '/images/sap/sap-footer-5338a92a-1600.webp';

const wrap = 'mx-auto w-full max-w-[1200px] px-5 sm:px-8';
const eyebrow = 'text-xs font-semibold uppercase tracking-[0.2em]';
const h2 = 'text-[clamp(1.6rem,3.6vw,2.4rem)] font-bold leading-tight tracking-tight';
const focusDark = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08B8EC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101D42]';
const focusLight = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#284FD8] focus-visible:ring-offset-2';
const btnPrimary = 'group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#284FD8] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#284FD8]/30 transition-colors duration-150 hover:bg-[#1E3FB8] active:scale-[0.98] motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-50';

const NEED_ICONS = [Settings2, Users, BarChart3];
const STEP_ICONS = [Search, FileText, Monitor, LineChart];

const SapSpecialty = () => {
  const { localizedPath, locale } = useLocalizedPath();
  // ?ruta=tecnico (o =completa) llega desde el banner de la home con la ruta ya cargada.
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState<string[]>(() => {
    const ruta = searchParams.get('ruta');
    if (ruta === 'completa') return SAP_COURSES.map((course) => course.id);
    return SAP_ROLE_ROUTES.find((route) => route.id === ruta)?.courses ?? [];
  });

  const c = {
    es: {
      badge: 'Insecap Minerals',
      eyebrow: 'Especialidad SAP S/4HANA · Módulo PM',
      h1: 'SAP a medida',
      h1Highlight: 'de tu empresa.',
      lead: 'Formamos a tu equipo de mantenimiento en SAP PM sobre tus propios procesos, equipos y criterios. Del aviso al análisis, en 9 cursos que combinas según lo que necesites.',
      ctaProgram: 'Arma tu programa',
      ctaDiagnosis: 'Agenda un diagnóstico',
      micro: 'Antes de proponer cursos, horas o fechas, revisamos cómo usa hoy tu equipo SAP PM.',
      stats: [
        { value: String(SAP_COURSES.length), label: 'cursos modulares' },
        { value: `${SAP_TOTAL_HOURS} h`, label: 'de ruta completa' },
        { value: String(SAP_ROLE_ROUTES.length), label: 'rutas por rol' },
      ],
      mock: { label: 'Ubicaciones técnicas', safe: 'Práctica sin tocar tu sistema productivo' },
      needEyebrow: 'El problema que resolvemos',
      needTitle: 'Tu empresa ya tiene SAP. ¿Tu equipo lo usa igual en todas las áreas?',
      needs: [
        { title: 'Uso del sistema', text: 'Avisos y OT con ubicación técnica, síntoma y causa, para poder analizar después qué falló.' },
        { title: 'Procesos alineados', text: 'Los trabajos terminados en terreno se cierran también en el sistema y no engordan el pendiente.' },
        { title: 'Decisiones con datos', text: 'Disponibilidad, MTBF y cumplimiento del programa calculados sobre datos de entrada confiables.' },
      ],
      howEyebrow: 'Cómo trabajamos',
      howTitle: 'Un programa construido sobre tu operación.',
      steps: [
        { title: 'Diagnóstico', text: 'Revisamos con tus jefaturas cómo se registra hoy el trabajo y dónde se pierde información.' },
        { title: 'Diseño a medida', text: 'Elegimos cursos, horas y casos según tus procesos, roles y nomenclatura.' },
        { title: 'Formación práctica', text: 'Tu equipo recorre el ciclo completo en SAP Insecap Minerals, paso a paso y con un relator.' },
        { title: 'Evaluación y reporte', text: 'Medimos lo aprendido por participante y te entregamos un informe para decidir los siguientes pasos.' },
      ],
      catalogEyebrow: 'Especialidad SAP S/4HANA · Módulo PM',
      catalogTitle: 'Arma el programa de tu equipo.',
      catalogLead: 'Parte por una ruta según el rol o agrega los cursos uno a uno. Cada curso funciona solo o dentro del programa.',
      routesLabel: 'Rutas sugeridas por rol',
      fullRoute: `Ruta completa (${SAP_TOTAL_HOURS} h)`,
      clear: 'Limpiar',
      hours: 'horas',
      add: 'Agregar',
      remove: 'Quitar',
      programTitle: 'Tu programa',
      courses: 'cursos',
      empty: 'Aún no agregas cursos. Elige una ruta o suma los que tu equipo necesita y verás las horas totales al instante.',
      quote: 'Solicitar propuesta',
      quoteNote: 'El valor depende de la modalidad, la sede y el número de participantes. Consulta por franquicia tributaria SENCE.',
      seeProgram: 'Ver tu programa',
      faqEyebrow: 'Preguntas frecuentes',
      faqTitle: 'Lo que suelen preguntarnos',
      faqs: [
        { q: '¿La práctica se hace en nuestro SAP?', a: 'No. Se hace en SAP Insecap Minerals, nuestro entorno propio. Tu sistema productivo no se toca.' },
        { q: '¿Hay que tomar los 9 cursos?', a: `No. Puedes armar un programa con los cursos que necesites o tomar la ruta completa de ${SAP_TOTAL_HOURS} h.` },
        { q: '¿En qué se diferencia del curso abierto de SAP PM?', a: 'El curso abierto es una inscripción individual con fecha fija. La especialidad es un programa para tu equipo, diseñado tras un diagnóstico y con los cursos que elijas.' },
        { q: '¿Se puede usar la franquicia tributaria SENCE?', a: 'Consúltanos. Lo revisamos según el curso, la modalidad y tu empresa.' },
      ],
      openCourseLink: 'Ver cursos abiertos',
      closingTitle: 'Tu SAP ya está pagado. Haz que rinda.',
      closingLead: 'Agenda un diagnóstico y armamos contigo, curso a curso, el programa que tu equipo necesita.',
      formTitle: 'Solicita un diagnóstico',
      formProgram: 'Programa seleccionado',
      formNone: 'Sin cursos seleccionados: te ayudamos a elegirlos en el diagnóstico.',
      interestPrefix: 'Especialidad SAP PM',
      trademark: 'SAP y SAP S/4HANA son marcas registradas de SAP SE en Alemania y otros países. Insecap no está afiliado a SAP SE.',
    },
    en: {
      badge: 'Insecap Minerals',
      eyebrow: 'SAP S/4HANA PM Module Specialization',
      h1: 'SAP tailored',
      h1Highlight: 'to your company.',
      lead: 'We train your maintenance team in SAP PM on your own processes, equipment and criteria. From notification to analysis, in 9 courses you combine as needed.',
      ctaProgram: 'Build your program',
      ctaDiagnosis: 'Book a diagnosis',
      micro: 'Before proposing courses, hours or dates, we review how your team uses SAP PM today.',
      stats: [
        { value: String(SAP_COURSES.length), label: 'modular courses' },
        { value: `${SAP_TOTAL_HOURS} h`, label: 'full path' },
        { value: String(SAP_ROLE_ROUTES.length), label: 'role-based paths' },
      ],
      mock: { label: 'Functional locations', safe: 'Practice without touching your production system' },
      needEyebrow: 'The problem we solve',
      needTitle: 'Your company already runs SAP. Does your team use it the same way in every area?',
      needs: [
        { title: 'System use', text: 'Notifications and orders with functional location, symptom and cause, so failures can be analyzed later.' },
        { title: 'Aligned processes', text: 'Jobs finished in the field are closed in the system too, instead of inflating the backlog.' },
        { title: 'Data-driven decisions', text: 'Availability, MTBF and schedule compliance calculated on reliable input data.' },
      ],
      howEyebrow: 'How we work',
      howTitle: 'A program built on your operation.',
      steps: [
        { title: 'Diagnosis', text: 'We review with your leads how work is recorded today and where information is lost.' },
        { title: 'Tailored design', text: 'We pick courses, hours and cases based on your processes, roles and naming.' },
        { title: 'Hands-on training', text: 'Your team walks the full cycle in SAP Insecap Minerals, step by step, with an instructor.' },
        { title: 'Assessment and report', text: 'We measure each participant’s learning and deliver a report to plan next steps.' },
      ],
      catalogEyebrow: 'SAP S/4HANA PM Module Specialization',
      catalogTitle: 'Build your team’s program.',
      catalogLead: 'Start from a role-based path or add courses one by one. Each course works alone or within the program.',
      routesLabel: 'Suggested paths by role',
      fullRoute: `Full path (${SAP_TOTAL_HOURS} h)`,
      clear: 'Clear',
      hours: 'hours',
      add: 'Add',
      remove: 'Remove',
      programTitle: 'Your program',
      courses: 'courses',
      empty: 'No courses added yet. Pick a path or add the ones your team needs and see total hours instantly.',
      quote: 'Request a proposal',
      quoteNote: 'Price depends on modality, campus and number of participants. Ask about SENCE tax benefits.',
      seeProgram: 'See your program',
      faqEyebrow: 'FAQ',
      faqTitle: 'What people usually ask us',
      faqs: [
        { q: 'Is practice done on our SAP?', a: 'No. It is done on SAP Insecap Minerals, our own environment. Your production system is never touched.' },
        { q: 'Do we have to take all 9 courses?', a: `No. You can build a program with the courses you need or take the full ${SAP_TOTAL_HOURS} h path.` },
        { q: 'How is it different from the open SAP PM course?', a: 'The open course is individual enrollment on a fixed date. The specialization is a program for your team, designed after a diagnosis with the courses you choose.' },
        { q: 'Can we use SENCE tax benefits?', a: 'Ask us. We review it by course, modality and company.' },
      ],
      openCourseLink: 'See open courses',
      closingTitle: 'Your SAP is already paid for. Make it pay off.',
      closingLead: 'Book a diagnosis and we will build, course by course, the program your team needs.',
      formTitle: 'Request a diagnosis',
      formProgram: 'Selected program',
      formNone: 'No courses selected: we will help you choose them during the diagnosis.',
      interestPrefix: 'Especialidad SAP PM',
      trademark: 'SAP and SAP S/4HANA are registered trademarks of SAP SE in Germany and other countries. Insecap is not affiliated with SAP SE.',
    },
    pt: {
      badge: 'Insecap Minerals',
      eyebrow: 'Especialização SAP S/4HANA · Módulo PM',
      h1: 'SAP sob medida',
      h1Highlight: 'para sua empresa.',
      lead: 'Formamos sua equipe de manutenção em SAP PM sobre seus próprios processos, equipamentos e critérios. Da nota à análise, em 9 cursos que você combina conforme a necessidade.',
      ctaProgram: 'Monte seu programa',
      ctaDiagnosis: 'Agende um diagnóstico',
      micro: 'Antes de propor cursos, horas ou datas, revisamos como sua equipe usa o SAP PM hoje.',
      stats: [
        { value: String(SAP_COURSES.length), label: 'cursos modulares' },
        { value: `${SAP_TOTAL_HOURS} h`, label: 'de trilha completa' },
        { value: String(SAP_ROLE_ROUTES.length), label: 'trilhas por função' },
      ],
      mock: { label: 'Locais de instalação', safe: 'Prática sem tocar seu sistema produtivo' },
      needEyebrow: 'O problema que resolvemos',
      needTitle: 'Sua empresa já tem SAP. Sua equipe o usa igual em todas as áreas?',
      needs: [
        { title: 'Uso do sistema', text: 'Notas e ordens com local de instalação, sintoma e causa, para depois analisar o que falhou.' },
        { title: 'Processos alinhados', text: 'Trabalhos concluídos em campo também são encerrados no sistema e não inflam o backlog.' },
        { title: 'Decisões com dados', text: 'Disponibilidade, MTBF e cumprimento do programa calculados sobre dados de entrada confiáveis.' },
      ],
      howEyebrow: 'Como trabalhamos',
      howTitle: 'Um programa construído sobre sua operação.',
      steps: [
        { title: 'Diagnóstico', text: 'Revisamos com suas lideranças como o trabalho é registrado hoje e onde a informação se perde.' },
        { title: 'Desenho sob medida', text: 'Escolhemos cursos, horas e casos conforme seus processos, funções e nomenclatura.' },
        { title: 'Formação prática', text: 'Sua equipe percorre o ciclo completo no SAP Insecap Minerals, passo a passo e com um instrutor.' },
        { title: 'Avaliação e relatório', text: 'Medimos o aprendizado de cada participante e entregamos um relatório para decidir os próximos passos.' },
      ],
      catalogEyebrow: 'Especialização SAP S/4HANA · Módulo PM',
      catalogTitle: 'Monte o programa da sua equipe.',
      catalogLead: 'Comece por uma trilha por função ou adicione os cursos um a um. Cada curso funciona sozinho ou dentro do programa.',
      routesLabel: 'Trilhas sugeridas por função',
      fullRoute: `Trilha completa (${SAP_TOTAL_HOURS} h)`,
      clear: 'Limpar',
      hours: 'horas',
      add: 'Adicionar',
      remove: 'Remover',
      programTitle: 'Seu programa',
      courses: 'cursos',
      empty: 'Você ainda não adicionou cursos. Escolha uma trilha ou some os que sua equipe precisa e veja o total de horas na hora.',
      quote: 'Solicitar proposta',
      quoteNote: 'O valor depende da modalidade, da unidade e do número de participantes. Consulte sobre a franquia tributária SENCE.',
      seeProgram: 'Ver seu programa',
      faqEyebrow: 'Perguntas frequentes',
      faqTitle: 'O que costumam nos perguntar',
      faqs: [
        { q: 'A prática é feita no nosso SAP?', a: 'Não. É feita no SAP Insecap Minerals, nosso ambiente próprio. Seu sistema produtivo não é tocado.' },
        { q: 'É preciso fazer os 9 cursos?', a: `Não. Você pode montar um programa com os cursos que precisa ou fazer a trilha completa de ${SAP_TOTAL_HOURS} h.` },
        { q: 'Qual a diferença para o curso aberto de SAP PM?', a: 'O curso aberto é uma inscrição individual com data fixa. A especialização é um programa para sua equipe, desenhado após um diagnóstico e com os cursos que você escolher.' },
        { q: 'É possível usar a franquia tributária SENCE?', a: 'Consulte-nos. Avaliamos conforme o curso, a modalidade e sua empresa.' },
      ],
      openCourseLink: 'Ver cursos abertos',
      closingTitle: 'Seu SAP já está pago. Faça ele render.',
      closingLead: 'Agende um diagnóstico e montamos com você, curso a curso, o programa que sua equipe precisa.',
      formTitle: 'Solicite um diagnóstico',
      formProgram: 'Programa selecionado',
      formNone: 'Sem cursos selecionados: ajudamos você a escolhê-los no diagnóstico.',
      interestPrefix: 'Especialidad SAP PM',
      trademark: 'SAP e SAP S/4HANA são marcas registradas da SAP SE na Alemanha e em outros países. A Insecap não é afiliada à SAP SE.',
    },
  }[locale];

  const chosen = SAP_COURSES.filter((course) => selected.includes(course.id));
  const chosenHours = chosen.reduce((sum, course) => sum + course.hours, 0);
  // Viaja en español al TMS: lo lee el equipo comercial, no quien llena el formulario.
  const cursoInteres = chosen.length
    ? `${c.interestPrefix} (${chosen.length} cursos, ${chosenHours} h): ${chosen.map((course) => course.short).join(', ')}`
    : c.interestPrefix;
  // Una ruta se marca activa solo si la selección coincide exactamente con ella.
  const sameSelection = (ids: string[]) => ids.length === selected.length && ids.every((id) => selected.includes(id));
  const isFullRoute = selected.length === SAP_COURSES.length;

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="min-h-screen bg-white">
      <SEO
        url={SAP_HREF}
        type="website"
      />
      <Header />

      {/* [&_p]:text-left: el justificado global abre ríos en las tarjetas angostas de esta página */}
      <main className="text-[#101D42] [&_p]:text-left">
        {/* 1. HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#101D42] via-[#16296B] to-[#284FD8] pb-20 pt-32 text-white md:pb-24 md:pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:22px_22px]"
          />
          <div className={`${wrap} relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-10`}>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <img src={SAP_LOGO} alt="SAP" width={1280} height={634} className="h-9 w-auto md:h-10" />
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]">
                  <Pickaxe className="h-3.5 w-3.5 text-[#08B8EC]" aria-hidden="true" />
                  {c.badge}
                </span>
              </div>
              <p className={`${eyebrow} mt-5 text-white/75`}>{c.eyebrow}</p>
              <h1 className="mt-3 text-[clamp(2.3rem,6vw,3.9rem)] font-bold leading-[1.05] tracking-tight">
                {c.h1}
                <span className="block text-[#08B8EC]">{c.h1Highlight}</span>
              </h1>
              <p className="mt-5 max-w-[34rem] text-base leading-relaxed text-white/80 md:text-lg">{c.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#catalogo" className={`${btnPrimary} ${focusDark}`}>
                  {c.ctaProgram}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </a>
                <a
                  href="#cotizar"
                  className={`inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/60 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10 ${focusDark}`}
                >
                  {c.ctaDiagnosis}
                </a>
              </div>
              <p className="mt-4 max-w-md text-sm text-white/60">{c.micro}</p>

              <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-white/15">
                {c.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse justify-end px-4 first:pl-0">
                    <dt className="mt-1 text-xs leading-snug text-white/70">{stat.label}</dt>
                    <dd className="whitespace-nowrap text-2xl font-bold tabular-nums sm:text-3xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0B1533] shadow-2xl shadow-black/30">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                  <span className="text-xs font-semibold tracking-wide text-white/85">SAP Insecap Minerals</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">{c.mock.label}</span>
                </div>
                {/* Ampliada a la tabla (código + denominación): a tamaño completo no se lee en el hero */}
                <div className="aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={SAP_ENV_SHOTS[0].src}
                    alt={SAP_ENV_SHOTS[0].alt[locale]}
                    width={SAP_ENV_SHOTS[0].w}
                    height={SAP_ENV_SHOTS[0].h}
                    className="h-auto w-[160%] max-w-none"
                  />
                </div>
              </div>
              <figcaption className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white lg:absolute lg:-bottom-5 lg:left-6 lg:mt-0 lg:border-[#08B8EC]/50 lg:bg-[#101D42]">
                <ShieldCheck className="h-4 w-4 text-[#08B8EC]" aria-hidden="true" />
                {c.mock.safe}
              </figcaption>
            </figure>
          </div>
        </section>

        {/* flow-root: el mb-8 del switch no se escapa del contenedor (dejaba una franja blanca) */}
        <div className="flow-root bg-[#F5F8FC] pt-8">
          <ClientTypeSwitch activeMode="sap" />
        </div>

        {/* 2. NECESIDAD */}
        <section className="bg-[#F5F8FC] pb-16 pt-10 md:pb-20 md:pt-14">
          <div className={wrap}>
            <p className={`${eyebrow} text-[#284FD8]`}>{c.needEyebrow}</p>
            <h2 className={`${h2} mt-3 max-w-3xl`}>{c.needTitle}</h2>
            <ul className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
              {c.needs.map((need, i) => {
                const Icon = NEED_ICONS[i];
                return (
                  <li
                    key={need.title}
                    className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-6px_rgba(16,29,66,0.12)] md:p-7"
                  >
                    {/* Franja superior cobalto → cian: marca la tarjeta sin sumar sombra */}
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#284FD8] to-[#08B8EC]" />
                    <span className="grid h-12 w-12 place-items-center rounded-xl border border-[#284FD8]/15 bg-[#284FD8]/10">
                      <Icon className="h-6 w-6 text-[#284FD8]" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold">{need.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{need.text}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* 3. METODOLOGÍA */}
        <section className="bg-[#101D42] py-16 text-white md:py-20">
          <div className={wrap}>
            <div className="border-b border-white/10 pb-10">
              <p className={`${eyebrow} text-[#08B8EC]`}>{c.howEyebrow}</p>
              <h2 className={`${h2} mt-3`}>{c.howTitle}</h2>
            </div>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {c.steps.map((step, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <li key={step.title}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-[#08B8EC] text-sm font-bold tabular-nums text-[#08B8EC]">
                        {i + 1}
                      </span>
                      <Icon className="h-6 w-6 text-white/85" aria-hidden="true" />
                      {i < c.steps.length - 1 && (
                        <ChevronRight className="ml-auto hidden h-5 w-5 text-white/30 lg:block" aria-hidden="true" />
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{step.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* 3b. ENTORNO SAP INSECAP MINERALS — capturas reales (compartido con el home) */}
        <div className="bg-[#F5F8FC] py-16 md:py-20">
          <div className={wrap}>
            <SapEntorno />
          </div>
        </div>

        {/* 4. SELECCIÓN DE CURSOS — sección principal */}
        <section id="catalogo" className="scroll-mt-20 bg-white py-16 md:py-20">
          <div className={wrap}>
            <p className={`${eyebrow} text-[#284FD8]`}>{c.catalogEyebrow}</p>
            <h2 className={`${h2} mt-3 text-[clamp(1.8rem,4vw,2.75rem)]`}>{c.catalogTitle}</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{c.catalogLead}</p>

            <div className="mt-8" role="group" aria-label={c.routesLabel}>
              <p className="mb-3 text-sm font-semibold">{c.routesLabel}</p>
              <div className="flex flex-wrap gap-2">
                {SAP_ROLE_ROUTES.map((route) => {
                  const active = sameSelection(route.courses);
                  return (
                    <button
                      key={route.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelected(route.courses)}
                      className={`min-h-[44px] rounded-full border px-5 text-sm font-semibold transition-colors ${focusLight} ${
                        active
                          ? 'border-[#284FD8] bg-[#284FD8] text-white shadow-md shadow-[#284FD8]/25'
                          : 'border-slate-200 bg-white text-[#101D42] hover:border-[#284FD8] hover:text-[#284FD8]'
                      }`}
                    >
                      {route.label[locale]}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-pressed={isFullRoute}
                  onClick={() => setSelected(SAP_COURSES.map((course) => course.id))}
                  className={`min-h-[44px] rounded-full border px-5 text-sm font-semibold transition-colors ${focusLight} ${
                    isFullRoute
                      ? 'border-[#101D42] bg-[#101D42] text-white'
                      : 'border-[#101D42]/30 bg-white text-[#101D42] hover:border-[#101D42]'
                  }`}
                >
                  {c.fullRoute}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  disabled={!selected.length}
                  className={`min-h-[44px] rounded-full px-4 text-sm font-semibold text-slate-600 underline-offset-4 transition-colors hover:text-[#101D42] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:no-underline ${focusLight}`}
                >
                  {c.clear}
                </button>
              </div>
            </div>

            {/* Móvil/tablet: resumen en línea, sin elementos fijos que tapen contenido */}
            <p className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#101D42]/5 px-4 py-3 text-sm lg:hidden" aria-live="polite">
              <span className="font-semibold tabular-nums">
                {chosen.length} {c.courses} · {chosenHours} {c.hours}
              </span>
              <a href="#tu-programa" className={`font-semibold text-[#284FD8] hover:underline ${focusLight}`}>
                {c.seeProgram}
              </a>
            </p>

            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_19rem]">
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {SAP_COURSES.map((course, i) => {
                  const isOn = selected.includes(course.id);
                  return (
                    <li
                      key={course.id}
                      className={`flex flex-col rounded-2xl border-2 p-5 transition-colors ${
                        isOn ? 'border-[#284FD8] bg-[#284FD8]/[0.03] shadow-[0_6px_24px_-8px_rgba(40,79,216,0.35)]' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#284FD8] text-sm font-bold tabular-nums text-white">{i + 1}</span>
                        <span className="rounded-full bg-[#284FD8]/10 px-3 py-1 text-xs font-semibold text-[#284FD8]">{course.axis[locale]}</span>
                      </div>
                      <h3 className="mt-4 text-base font-bold leading-snug">{course.title[locale]}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{course.description[locale]}</p>
                      <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-200 pt-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#284FD8]">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          {course.hours} {c.hours}
                        </span>
                        <button
                          type="button"
                          aria-pressed={isOn}
                          aria-label={`${isOn ? c.remove : c.add}: ${course.title[locale]}`}
                          onClick={() => toggle(course.id)}
                          className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-2 px-4 text-sm font-semibold transition-colors active:scale-95 motion-reduce:transform-none ${focusLight} ${
                            isOn ? 'border-[#284FD8] bg-[#284FD8] text-white hover:bg-[#1E3FB8]' : 'border-[#284FD8]/40 text-[#284FD8] hover:border-[#284FD8]'
                          }`}
                        >
                          {isOn ? <Minus className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                          {isOn ? c.remove : c.add}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <aside
                id="tu-programa"
                aria-labelledby="tu-programa-title"
                className="scroll-mt-24 rounded-2xl bg-[#101D42] p-6 text-white shadow-xl lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
              >
                <h3 id="tu-programa-title" className="text-lg font-bold">{c.programTitle}</h3>
                <div className="mt-4 flex gap-8" aria-live="polite">
                  <div>
                    <span className="block text-4xl font-bold tabular-nums">{chosen.length}</span>
                    <span className="text-xs text-white/70">{c.courses}</span>
                  </div>
                  <div>
                    <span className="block text-4xl font-bold tabular-nums">{chosenHours}</span>
                    <span className="text-xs text-white/70">{c.hours}</span>
                  </div>
                </div>
                {chosen.length ? (
                  <ul className="mt-5 space-y-2">
                    {chosen.map((course) => (
                      <li key={course.id} className="flex items-start gap-2 rounded-xl bg-white/[0.06] py-2 pl-3 pr-1 text-sm">
                        <span className="flex-1 leading-snug text-white/90">{course.title[locale]}</span>
                        <button
                          type="button"
                          onClick={() => toggle(course.id)}
                          aria-label={`${c.remove}: ${course.title[locale]}`}
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white ${focusDark}`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm leading-relaxed text-white/70">{c.empty}</p>
                )}
                <a href="#cotizar" className={`${btnPrimary} ${focusDark} mt-6 w-full`}>
                  {c.quote}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </a>
                <p className="mt-4 text-xs leading-relaxed text-white/60">{c.quoteNote}</p>
              </aside>
            </div>
          </div>
        </section>

        {/* 7. FAQ — Radix Accordion: teclado y aria-expanded incluidos */}
        <section className="bg-white py-16 md:py-20">
          <div className={`${wrap} max-w-[880px]`}>
            <p className={`${eyebrow} text-[#284FD8]`}>{c.faqEyebrow}</p>
            <h2 className={`${h2} mt-3`}>{c.faqTitle}</h2>
            <Accordion type="single" collapsible className="mt-8 space-y-3">
              {c.faqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`faq-${i}`} className="rounded-2xl border border-slate-200 bg-white px-5">
                  <AccordionTrigger className={`min-h-[56px] gap-4 text-left font-semibold hover:no-underline [&>svg]:text-[#284FD8] ${focusLight}`}>
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-600">
                    {faq.a}
                    {i === 2 && (
                      <>
                        {' '}
                        <Link to={localizedPath('/cursos-abiertos')} className={`font-semibold text-[#284FD8] hover:underline ${focusLight}`}>
                          {c.openCourseLink}
                        </Link>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 8. FORMULARIO FINAL sobre la faena de fondo */}
        <section
          id="cotizar"
          className="relative scroll-mt-20 bg-[#101D42] bg-cover bg-[position:30%_center] py-16 text-white md:py-24 lg:bg-left"
          style={{ backgroundImage: `url('${FORM_BG}')` }}
        >
          {/* Capa oscura: más densa a la derecha (formulario) y en móvil, donde el texto va sobre la foto */}
          <div aria-hidden="true" className="absolute inset-0 bg-[#101D42]/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#101D42]/55 lg:via-[#101D42]/45 lg:to-[#101D42]/85" />
          <div className={`${wrap} relative grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14`}>
            <div>
              <h2 className="text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-tight tracking-tight">{c.closingTitle}</h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-white/85">{c.closingLead}</p>
              <div className="mt-8 max-w-md rounded-2xl border border-white/20 bg-[#101D42]/60 p-5 backdrop-blur-sm">
                <p className={`${eyebrow} text-[#08B8EC]`}>{c.formProgram}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  {chosen.length
                    ? `${chosen.length} ${c.courses} · ${chosenHours} ${c.hours}: ${chosen.map((course) => course.title[locale]).join(' · ')}`
                    : c.formNone}
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-2xl md:p-8">
              <h3 className="mb-6 text-xl font-bold text-[#101D42]">{c.formTitle}</h3>
              <OpenCourseRequestForm fixedTipoContactado="2" cursoInteres={cursoInteres} />
            </div>
          </div>
          <p className={`${wrap} relative mt-12 text-xs text-white/60`}>{c.trademark}</p>
        </section>
      </main>

      <Footer showContact={false} />
    </div>
  );
};

export default SapSpecialty;
