import React, { useEffect, useRef, useState } from 'react';
import { Target, Eye, CheckCircle2, Award, ShieldCheck, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { ShineBorder } from '@/components/ui/shine-border';
import { useLocalizedPath } from '@/hooks/use-localized-path';

/**
 * Hook de parallax correcto.
 * - `wrapRef` se adjunta al contenedor EXTERIOR (no se transforma → medición limpia).
 * - `offset` se aplica como translateY al elemento INTERIOR.
 * Así no hay bucle de retroalimentación entre getBoundingClientRect y el transform.
 */
function useParallax(speed = 0.18) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const calc = () => {
      const rect = el.getBoundingClientRect();
      // distancia del centro del elemento al centro del viewport
      const dist = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(dist * speed);
    };

    window.addEventListener('scroll', calc, { passive: true });
    window.addEventListener('resize', calc, { passive: true });
    calc();
    return () => {
      window.removeEventListener('scroll', calc);
      window.removeEventListener('resize', calc);
    };
  }, [speed]);

  return { wrapRef, offset };
}

const QualityPolicy = () => {
  const { locale } = useLocalizedPath();
  const visionCard   = useScrollAnimation({ threshold: 0.2 });
  const missionCard  = useScrollAnimation({ threshold: 0.2 });
  const policyHeader = useScrollAnimation({ threshold: 0.2 });
  const policyText   = useScrollAnimation({ threshold: 0.15 });
  const policyObjectives = useScrollAnimation({ threshold: 0.15 });

  // Parallax refs (wrapRef = medición exterior, offset = transform interior)
  const visionParallax   = useParallax(0.12);
  const missionParallax  = useParallax(0.18);
  const bannerParallax   = useParallax(0.2);
  const orb1Parallax     = useParallax(0.18);
  const orb2Parallax     = useParallax(0.24);

  const content = {
    es: {
      title: 'Politica de Calidad',
      subtitle: 'Nuestro Compromiso',
      breadcrumb: 'Politica de Calidad',
      vision: 'Vision',
      visionText: '"Ser una empresa lider en servicios de capacitacion en el pais, siendo referentes por la calidad de competencias otorgadas a cada alumno. Asimismo, que los clientes identifiquen a INSECAP como socio estrategico, en la formacion de capital humano."',
      mission: 'Mision',
      missionText: '"Entregar soluciones de capacitacion con metodologias de vanguardia, asegurando el aprendizaje efectivo en las Personas, con atencion en las necesidades del mercado para enfrentar los desafios en favor del crecimiento y sustentabilidad de cada cliente. Lo anterior, se materializa en el marco de la eficiencia y eficacia en pos de la mejora continua de INSECAP Capacitacion."',
      excellence: 'Excelencia en Formacion',
      excellenceText: 'Insecap Capacitacion, es un Organismo Tecnico de Capacitacion, dedicado a brindar Servicios de Formacion de excelencia, a empresas Privadas, Publicas y Particulares, mediante diversas metodologias de aprendizaje efectivo.',
      paragraph: 'Otorgando capacitacion de calidad, orientada a satisfacer plenamente las necesidades y demandas de los Clientes, contando para ello, con experiencia en el rubro, material y equipamiento idoneo, como tambien relatores calificados y competentes, agregando valor a todas las actividades de Capacitacion.',
      certification: 'Certificacion Vigente',
      norm: 'Norma NCh 2728',
      objectivesTitle: 'Objetivos de Calidad',
      objectives: [
        { title: 'Satisfaccion Total', description: 'Entregar servicios de formacion de calidad, ocupandose de la satisfaccion total de los Clientes.' },
        { title: 'Mejora Continua', description: 'Mejorar continuamente la eficacia de nuestro Sistema de Gestion de Calidad y cumplir requisitos legales.' },
        { title: 'Idoneidad de Recursos', description: 'Mantener niveles optimos en recursos humanos, equipamiento y materiales utilizados.' },
      ],
    },
    en: {
      title: 'Quality Policy',
      subtitle: 'Our Commitment',
      breadcrumb: 'Quality Policy',
      vision: 'Vision',
      visionText: '"To be a leading training services company in the country, recognized for the quality of the competencies delivered to every learner. Likewise, for clients to identify INSECAP as a strategic partner in human capital development."',
      mission: 'Mission',
      missionText: '"To deliver training solutions with state-of-the-art methodologies, ensuring effective learning for people, with close attention to market needs in order to face challenges in favor of each client\'s growth and sustainability. This is achieved within a framework of efficiency and effectiveness, always pursuing INSECAP Training\'s continuous improvement."',
      excellence: 'Excellence in Training',
      excellenceText: 'Insecap Training is a certified training organization dedicated to delivering excellent learning services to private companies, public institutions and individuals through diverse effective learning methodologies.',
      paragraph: 'We deliver quality training focused on fully meeting client needs and demands, supported by experience in the field, suitable materials and equipment, and qualified, competent instructors who add value to every training activity.',
      certification: 'Current Certification',
      norm: 'NCh 2728 Standard',
      objectivesTitle: 'Quality Objectives',
      objectives: [
        { title: 'Total Satisfaction', description: 'Deliver quality training services focused on full customer satisfaction.' },
        { title: 'Continuous Improvement', description: 'Continuously improve the effectiveness of our Quality Management System and comply with legal requirements.' },
        { title: 'Resource Suitability', description: 'Maintain optimal levels in human resources, equipment and learning materials.' },
      ],
    },
    pt: {
      title: 'Politica da Qualidade',
      subtitle: 'Nosso Compromisso',
      breadcrumb: 'Politica da Qualidade',
      vision: 'Visao',
      visionText: '"Ser uma empresa lider em servicos de capacitacao no pais, reconhecida pela qualidade das competencias entregues a cada aluno. Da mesma forma, que os clientes identifiquem a INSECAP como parceira estrategica na formacao de capital humano."',
      mission: 'Missao',
      missionText: '"Entregar solucoes de capacitacao com metodologias de vanguarda, assegurando aprendizagem efetiva para as pessoas, com atencao as necessidades do mercado para enfrentar desafios em favor do crescimento e da sustentabilidade de cada cliente. Isso se concretiza dentro de um marco de eficiencia e eficacia em busca da melhoria continua da INSECAP Capacitacao."',
      excellence: 'Excelencia em Formacao',
      excellenceText: 'A Insecap Capacitacao e um Organismo Tecnico de Capacitacao dedicado a oferecer servicos de formacao de excelencia para empresas privadas, instituicoes publicas e pessoas, por meio de diversas metodologias de aprendizagem efetiva.',
      paragraph: 'Oferecemos capacitacao de qualidade, orientada a satisfazer plenamente as necessidades e demandas dos clientes, contando para isso com experiencia no setor, material e equipamentos adequados, alem de instrutores qualificados e competentes que agregam valor a todas as atividades formativas.',
      certification: 'Certificacao Vigente',
      norm: 'Norma NCh 2728',
      objectivesTitle: 'Objetivos da Qualidade',
      objectives: [
        { title: 'Satisfacao Total', description: 'Entregar servicos de formacao de qualidade, buscando a satisfacao total dos clientes.' },
        { title: 'Melhoria Continua', description: 'Melhorar continuamente a eficacia do nosso Sistema de Gestao da Qualidade e cumprir os requisitos legais.' },
        { title: 'Adequacao de Recursos', description: 'Manter niveis ideais de recursos humanos, equipamentos e materiais utilizados.' },
      ],
    },
  }[locale];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: content.breadcrumb }]}
        />

        {/* Vision & Mission */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            <div className="grid md:grid-cols-2 gap-12">

              {/* Visión */}
              <div
                ref={visionCard.ref}
                className={`transition-all duration-700 ease-out ${visionCard.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
              >
                {/* wrapRef: medición sin transform */}
                <div ref={visionParallax.wrapRef} className="h-full">
                  {/* inner: recibe el translateY */}
                  <div
                    style={{ transform: `translateY(${visionParallax.offset}px)`, willChange: 'transform' }}
                    className="relative bg-white rounded-[2rem] shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden p-10 h-full"
                  >
                    <ShineBorder shineColor={['#2563eb', '#93c5fd', '#1d4ed8']} borderWidth={2} duration={10} />
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-blue-950 mb-4">{content.vision}</h2>
                    <div className="w-12 h-1 bg-blue-600 rounded-full mb-6"></div>
                    <p className="text-slate-600 text-lg leading-relaxed italic">{content.visionText}</p>
                  </div>
                </div>
              </div>

              {/* Misión */}
              <div
                ref={missionCard.ref}
                className={`transition-all duration-700 ease-out delay-200 ${missionCard.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              >
                {/* wrapRef: medición sin transform */}
                <div ref={missionParallax.wrapRef} className="h-full">
                  <div
                    style={{ transform: `translateY(${missionParallax.offset}px)`, willChange: 'transform' }}
                    className="relative bg-white rounded-[2rem] shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden p-10 h-full"
                  >
                    <ShineBorder shineColor={['#4f46e5', '#818cf8', '#2563eb']} borderWidth={2} duration={12} />
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-blue-950 mb-4">{content.mission}</h2>
                    <div className="w-12 h-1 bg-indigo-600 rounded-full mb-6"></div>
                    <p className="text-slate-600 text-lg leading-relaxed italic">{content.missionText}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Banner Excelencia en Formación */}
        <section className="py-24 text-white overflow-hidden relative">
          {/* Imagen de fondo con parallax */}
          <div ref={bannerParallax.wrapRef} className="absolute inset-0 pointer-events-none" style={{ top: '-15%', bottom: '-15%' }}>
            <img
              src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Quienes-Somos-Collage-01-2400x1356.jpg?v=1776094555"
              alt=""
              aria-hidden="true"
              style={{ transform: `translateY(${bannerParallax.offset}px)`, willChange: 'transform' }}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Overlay degradado azul oscuro → primario */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/85 to-primary/75 pointer-events-none" />
          {/* Segundo degradado vertical para profundidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-blue-950/30 pointer-events-none" />

          {/* Orbe 1 — parallax rápido */}
          <div ref={orb1Parallax.wrapRef} className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] -mr-56 -mt-56">
            <div
              style={{ transform: `translateY(${orb1Parallax.offset}px)`, willChange: 'transform' }}
              className="w-full h-full bg-blue-300 rounded-full blur-[160px] opacity-20"
            />
          </div>
          {/* Orbe 2 — parallax más rápido */}
          <div ref={orb2Parallax.wrapRef} className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] -ml-40 -mb-40">
            <div
              style={{ transform: `translateY(${orb2Parallax.offset}px)`, willChange: 'transform' }}
              className="w-full h-full bg-indigo-400 rounded-full blur-[140px] opacity-15"
            />
          </div>

          {/* Contenido — z-10 para estar sobre la imagen */}
          <div>
            <div
              className="container mx-auto px-8 md:px-14 lg:px-16 relative z-10"
            >
            <div
              ref={policyHeader.ref}
              className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-700 ease-out ${policyHeader.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8">{content.excellence}</h2>
              <p className="text-blue-100 text-xl leading-relaxed">
                {content.excellenceText}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div
                ref={policyText.ref}
                className={`space-y-6 transition-all duration-700 ease-out ${policyText.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
              >
                <p className="text-blue-100 text-lg leading-relaxed text-justify">{content.paragraph}</p>
                <div className="pt-4">
                  <div className="relative inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-blue-300/50 bg-gradient-to-r from-blue-500/30 to-indigo-500/20 backdrop-blur-sm shadow-lg shadow-blue-900/30 hover:from-blue-400/40 hover:to-indigo-400/30 transition-all duration-300 group">
                    <div className="bg-gradient-to-br from-blue-400 to-indigo-400 p-1.5 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-blue-300 uppercase tracking-widest font-medium">{content.certification}</span>
                      <span className="font-bold text-white uppercase tracking-wider text-sm">{content.norm}</span>
                    </div>
                    {/* Shine izquierda */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-300 to-blue-500 rounded-l-xl opacity-80" />
                  </div>
                </div>
              </div>

              <div
                ref={policyObjectives.ref}
                className={`relative overflow-hidden bg-gradient-to-br from-blue-900/60 to-indigo-900/40 backdrop-blur-md border border-white/25 p-8 rounded-3xl shadow-2xl shadow-blue-950/50 transition-all duration-700 ease-out delay-200 ${policyObjectives.isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95'}`}
              >
                {/* Acento decorativo esquina */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl -ml-6 -mb-6 pointer-events-none" />
                {/* Línea superior decorativa */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
                <h3 className="text-2xl font-extrabold mb-7 text-white tracking-tight relative z-10">
                  {content.objectivesTitle}
                </h3>
                <ul className="space-y-5 relative z-10">
                  <li className="flex gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-200">
                    <div className="bg-gradient-to-br from-blue-400/40 to-blue-600/30 p-2.5 rounded-xl h-fit shrink-0 border border-blue-300/30">
                      <ShieldCheck className="w-5 h-5 text-blue-200" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-white">{content.objectives[0].title}</h4>
                      <p className="text-blue-200/80 text-sm leading-relaxed">{content.objectives[0].description}</p>
                    </div>
                  </li>
                  <li className="flex gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-200">
                    <div className="bg-gradient-to-br from-indigo-400/40 to-indigo-600/30 p-2.5 rounded-xl h-fit shrink-0 border border-indigo-300/30">
                      <TrendingUp className="w-5 h-5 text-indigo-200" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-white">{content.objectives[1].title}</h4>
                      <p className="text-blue-200/80 text-sm leading-relaxed">{content.objectives[1].description}</p>
                    </div>
                  </li>
                  <li className="flex gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-200">
                    <div className="bg-gradient-to-br from-sky-400/40 to-sky-600/30 p-2.5 rounded-xl h-fit shrink-0 border border-sky-300/30">
                      <CheckCircle2 className="w-5 h-5 text-sky-200" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-white">{content.objectives[2].title}</h4>
                      <p className="text-blue-200/80 text-sm leading-relaxed">{content.objectives[2].description}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          </div>{/* /bannerParallax.wrapRef */}
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default QualityPolicy;
