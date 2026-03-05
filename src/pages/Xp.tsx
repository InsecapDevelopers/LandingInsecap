import React from 'react';
import {
  Award,
  BookOpen,
  Monitor,
  Wrench,
  GraduationCap,
  BadgeCheck,
  Handshake,
  CheckCircle2,
  TrendingUp,
  Target,
  Users,
  Cpu,
  Sparkles
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/use-scroll-animation';

const ExperienciaYRespaldo = () => {
  // Animaciones para cada sección
  const introHeader = useScrollAnimation({ threshold: 0.2 });
  const introText = useScrollAnimation({ threshold: 0.15 });
  const introCard = useScrollAnimation({ threshold: 0.15 });

  const certHeader = useScrollAnimation({ threshold: 0.2 });
  const certGrid = useStaggerAnimation({ threshold: 0.1 });

  const valHeader = useScrollAnimation({ threshold: 0.2 });
  const valGrid = useStaggerAnimation({ threshold: 0.1 });

  const logosSection = useScrollAnimation({ threshold: 0.2 });
  const ctaSection = useScrollAnimation({ threshold: 0.2 });

  // Datos de certificaciones para el grid
  const certificaciones = [
    {
      logo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logosence_png.png?v=1772478498',
      logoAlt: 'Logo SENCE',
      iconType: 'logo' as const,
      title: 'Registro SENCE',
      description: 'Contamos con registro vigente ante el Servicio Nacional de Capacitación y Empleo (SENCE), habilitándonos para impartir capacitación con franquicia tributaria a lo largo del país.',
      badge: { text: 'N° Resolución: 12208', color: 'blue' as const },
    },
    {
      logo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logo_slogan.svg?v=1772193702',
      logoAlt: 'Certificadora NCh2728',
      iconType: 'logo' as const,
      title: 'Norma NCh2728:2015',
      description: 'Certificación anual que acredita el cumplimiento de los requisitos para operar como Organismo Técnico de Capacitación (OTEC), garantizando calidad en nuestros servicios formativos.',
      badge: { text: 'Certificación Vigente', color: 'green' as const },
    },
    {
      logo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-02-27_085941459.png?v=1772193585',
      logoAlt: 'Certificadora ISO 9001',
      iconType: 'logo' as const,
      title: 'ISO 9001:2015',
      description: 'Certificación anual de la Norma Internacional que rige nuestros procesos en cuanto a servicios de calidad y mejora continua, asegurando estándares de clase mundial.',
      badge: { text: 'Certificación Vigente', color: 'green' as const },
    },
    {
      icon: <Handshake className="w-7 h-7 text-white" />,
      iconType: 'icon' as const,
      title: 'Cámara de Comercio de Santiago (CCS)',
      description: 'Como miembros de la CCS, estamos habilitados para postular a requerimientos y necesidades de capacitación de un gran sector de empresas de la industria en general.',
      badge: { text: 'Miembro Activo', color: 'blue' as const },
    },
    {
      icon: <Award className="w-7 h-7 text-white" />,
      iconType: 'icon' as const,
      title: 'SICEP',
      description: 'Somos miembros de SICEP, lo cual nos habilita para postular a requerimientos y necesidades de capacitación de un gran sector de empresas de la industria en general.',
      badge: { text: 'Miembro Activo', color: 'blue' as const },
    },
  ];

  // Datos de valores técnicos
  const valoresTecnicos = [
    {
      icon: <BookOpen className="w-7 h-7 text-secondary" />,
      title: 'Metodología de Enseñanza',
      description: 'Metodologías de enseñanza innovadoras y efectivas, diseñadas para maximizar el aprendizaje en entornos industriales y operacionales, con enfoque práctico y orientadas a la transferencia de competencias al puesto de trabajo.',
    },
    {
      icon: <Monitor className="w-7 h-7 text-secondary" />,
      title: 'Software de Administración y Control',
      description: 'Potente software de administración y control que permite gestionar eficientemente todos los procesos de capacitación, desde la planificación hasta el seguimiento de resultados, garantizando trazabilidad y transparencia.',
    },
    {
      icon: <Cpu className="w-7 h-7 text-secondary" />,
      title: 'Autoservicio para Clientes',
      description: 'Plataforma de autoservicio que permite a nuestros clientes acceder a información, gestionar inscripciones y realizar seguimiento de sus programas de capacitación de forma autónoma y en tiempo real.',
    },
    {
      icon: <Wrench className="w-7 h-7 text-secondary" />,
      title: 'Equipamiento de Última Tecnología',
      description: 'Equipamiento práctico de última tecnología, construido bajo los estándares solicitados por los mandantes, permitiendo entrenamientos realistas y alineados a las condiciones operacionales reales de la industria.',
    },
    {
      icon: <GraduationCap className="w-7 h-7 text-secondary" />,
      title: 'Diseñadores Curriculares e Instruccionales',
      description: 'Contamos con diseñadores curriculares y diseñadores instruccionales con experiencia en Andragogía, garantizando que cada programa formativo esté diseñado para el aprendizaje efectivo del adulto profesional.',
    },
    {
      icon: <Award className="w-7 h-7 text-secondary" />,
      title: 'Sello CCM',
      description: 'Obtención del sello CCM, un reconocimiento que valida nuestro compromiso con la excelencia en capacitación y nos distingue como un referente confiable en la formación de capital humano para la industria.',
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Experiencia y Respaldo"
        description="Conoce la trayectoria, certificaciones y valores técnicos que respaldan a INSECAP Capacitación como socio estratégico en formación profesional."
        url="/Experiencia-y-Respaldo"
        type="website"
        keywords={[
          'experiencia INSECAP',
          'certificaciones OTEC',
          'SENCE',
          'ISO 9001',
          'NCh 2728',
          'capacitación minería',
          'formación profesional Chile'
        ]}
      />
      <Header />

      <main>
        <PageHero
          title="Experiencia y Respaldo"
          subtitle="Reconocimientos y Certificaciones"
          breadcrumbs={[
            { label: "Nosotros", href: "/nosotros" },
            { label: "Experiencia y Respaldo" }
          ]}
        />

        {/* =====================================================
            SECCIÓN 1: INTRODUCCIÓN 
        ===================================================== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Encabezado animado */}
              <div
                ref={introHeader.ref}
                className={`text-center mb-16 transition-all duration-700 ease-out ${introHeader.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
              >
                <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-4 block">
                  Nuestra Trayectoria
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6">
                  La Experiencia no se Improvisa: <span className="text-blue-600">se Demuestra</span>
                </h2>
                <div className={`h-1 bg-blue-600 mx-auto rounded-full transition-all duration-1000 delay-300 ease-out ${introHeader.isVisible ? 'w-20' : 'w-0'
                  }`}></div>
              </div>

              {/* Contenido de la intro */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div
                  ref={introText.ref}
                  className={`space-y-6 transition-all duration-700 ease-out delay-200 ${introText.isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-12'
                    }`}
                >
                  <p className="text-slate-600 text-lg leading-relaxed">
                    En la industria en general, la capacitación no es un requisito: es un <strong className="text-blue-950">factor crítico
                      para la seguridad, la continuidad operacional y la productividad</strong>. En INSECAP
                    Capacitación entendemos esa realidad y trabajamos con un enfoque técnico,
                    riguroso y alineado a los estándares que exige el mundo laboral.
                  </p>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Nuestra trayectoria se ha construido en terreno, formando competencias clave
                    para operaciones seguras y eficientes. Hemos acompañado a empresas de
                    distintos sectores, con mayor predominancia en la <strong className="text-blue-950">Gran Minería</strong>, en el
                    desarrollo de habilidades técnicas, cumplimiento normativo y fortalecimiento de
                    equipos de trabajo.
                  </p>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Cada programa formativo que implementamos responde a necesidades reales de
                    la industria, con relatores especializados, metodologías prácticas y una ejecución
                    orientada a <strong className="text-blue-950">resultados medibles</strong>.
                  </p>
                </div>

                {/* Card visual lateral animado */}
                <div
                  ref={introCard.ref}
                  className={`relative transition-all duration-700 ease-out delay-400 ${introCard.isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-12'
                    }`}
                >
                  <div className="bg-primary rounded-[2rem] p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-300 rounded-full blur-[100px] opacity-20 -mr-24 -mt-24"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-white/20 p-3 rounded-xl">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-blue-200 font-bold uppercase tracking-wider text-sm">Crecimiento Sostenido</span>
                      </div>
                      <p className="text-blue-100 text-lg leading-relaxed mb-8">
                        Hoy, nuestro crecimiento sostenido refleja la confianza que las empresas mineras
                        y en general de la industria depositan en <strong className="text-white">INSECAP como socio estratégico</strong> en
                        capacitación.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-white mb-1">16</div>
                          <div className="text-blue-200 text-sm">Años de Experiencia</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-white mb-1">100+</div>
                          <div className="text-blue-200 text-sm">Empresas Atendidas</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECCIÓN 2: CERTIFICACIONES Y REGISTROS
        ===================================================== */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Encabezado animado */}
              <div
                ref={certHeader.ref}
                className={`text-center mb-16 transition-all duration-700 ease-out ${certHeader.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
              >
                <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-4 block">
                  Respaldo Institucional
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6">
                  Certificaciones y Membresías
                </h2>
                <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                  Estas certificaciones y registros nos permiten crecer y posicionarnos en la industria
                  con un excelente servicio, garantizando la calidad y cumplimiento normativo.
                </p>
              </div>

              {/* Grid de certificaciones con stagger */}
              <div ref={certGrid.ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificaciones.map((cert, index) => (
                  <div
                    key={index}
                    className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 group ${certGrid.isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-10 scale-95'
                      }`}
                    style={{
                      transitionDelay: certGrid.isVisible ? certGrid.getDelay(index, 120) : '0ms'
                    }}
                  >
                    {cert.iconType === 'icon' ? (
                      <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        {cert.icon}
                      </div>
                    ) : (
                      <div className="mb-6 flex items-center justify-start">
                        <img
                          src={cert.logo}
                          alt={cert.logoAlt}
                          className="h-14 w-auto object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-blue-950 mb-3">{cert.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{cert.description}</p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${cert.badge.color === 'green'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-blue-50 text-blue-700'
                      }`}>
                      {cert.badge.color === 'green' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <BadgeCheck className="w-4 h-4" />
                      )}
                      <span>{cert.badge.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECCIÓN 3: VALORES TÉCNICOS AGREGADOS
        ===================================================== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Encabezado animado */}
              <div
                ref={valHeader.ref}
                className={`text-center mb-16 transition-all duration-700 ease-out ${valHeader.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
              >
                <span className="text-secondary font-semibold uppercase tracking-wider text-sm mb-4 block">
                  Nuestras Fortalezas
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6">
                  Valores Técnicos Agregados
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  Factores diferenciadores que nos permiten crecer y posicionarnos en la industria,
                  ofreciendo un servicio de excelencia que va más allá de la capacitación tradicional.
                </p>
              </div>

              {/* Grid de valores con stagger */}
              <div ref={valGrid.ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {valoresTecnicos.map((valor, index) => (
                  <div
                    key={index}
                    className={`bg-slate-50 border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-500 group relative ${valGrid.isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-10 scale-95'
                      }`}
                    style={{
                      transitionDelay: valGrid.isVisible ? valGrid.getDelay(index, 120) : '0ms'
                    }}
                  >
                    {valor.highlight && (
                      <div className="absolute top-4 right-4">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                      </div>
                    )}
                    <div className="bg-secondary/10 p-3 rounded-xl w-fit mb-6 group-hover:bg-secondary/20 transition-colors">
                      {valor.icon}
                    </div>
                    <h3 className="text-xl font-bold text-blue-950 mb-3">{valor.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{valor.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECCIÓN 4: RESUMEN VISUAL / CTA
        ===================================================== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Franja visual de logos de respaldo */}
              <div
                ref={logosSection.ref}
                className={`transition-all duration-700 ease-out ${logosSection.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-blue-950 mb-4">Respaldados por los Mejores Estándares</h2>
                  <p className="text-slate-600 text-lg">
                    Cada certificación y membresía refuerza nuestro compromiso con la calidad y excelencia.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-8 mb-16 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  {[
                    { type: 'img', src: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logo_slogan.svg?v=1772193702', alt: 'Certificadora NCh2728', label: 'NCh2728:2015' },
                    { type: 'img', src: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-02-27_085941459.png?v=1772193585', alt: 'Certificadora ISO 9001', label: 'ISO 9001:2015' },
                    { type: 'img', src: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logosence_png.png?v=1772478498', alt: 'Logo SENCE', label: 'SENCE' },
                    { type: 'icon', icon: <Handshake className="w-6 h-6 text-white" />, label: 'CCS' },
                    { type: 'icon', icon: <Award className="w-6 h-6 text-white" />, label: 'SICEP' },
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <div className="w-px h-12 bg-slate-200 hidden md:block"></div>}
                      <div
                        className={`flex flex-col items-center gap-2 p-4 transition-all duration-500 ${logosSection.isVisible
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-75'
                          }`}
                        style={{
                          transitionDelay: logosSection.isVisible ? `${(index + 1) * 150}ms` : '0ms'
                        }}
                      >
                        {item.type === 'img' ? (
                          <img src={item.src} alt={item.alt} className="h-12 w-auto object-contain" />
                        ) : (
                          <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                            {item.icon}
                          </div>
                        )}
                        <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* CTA animado */}
              <div
                ref={ctaSection.ref}
                className={`text-center transition-all duration-700 ease-out delay-200 ${ctaSection.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
              >
                <h2 className="text-3xl font-bold text-blue-950 mb-6">¿Necesitas un Socio Estratégico en Capacitación?</h2>
                <p className="text-slate-600 mb-8 text-lg max-w-2xl mx-auto">
                  En INSECAP, la experiencia no se improvisa: se demuestra. Contáctanos y conoce cómo
                  podemos apoyar el desarrollo de tu equipo de trabajo.
                </p>
                <a
                  href="/contacto"
                  className={`inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl ${ctaSection.isVisible
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-90'
                    }`}
                  style={{
                    transitionDelay: ctaSection.isVisible ? '400ms' : '0ms',
                    transitionDuration: '500ms',
                  }}
                >
                  Contáctanos Hoy
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ExperienciaYRespaldo;
