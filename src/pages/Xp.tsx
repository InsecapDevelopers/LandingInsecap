import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Calendar,
  Building2
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/use-scroll-animation';
import { getYearsOfExperience } from '@/lib/insecapUtils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ShineBorder } from '@/components/ui/shine-border';
import { WarpBackground } from '@/components/ui/warp-background';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const ExperienciaYRespaldo = () => {
  const { locale } = useLocalizedPath();
  // Contadores animados para la card de estadísticas
  const YEARS_TARGET = getYearsOfExperience();
  const CLIENTS_TARGET = 1900;
  const [yearsCount, setYearsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);

  // Animaciones para cada sección
  const introHeader = useScrollAnimation({ threshold: 0.2 });
  const introText = useScrollAnimation({ threshold: 0.15 });
  const introCard = useScrollAnimation({ threshold: 0.15 });

  // Efecto de contador animado cuando la card entra en viewport
  useEffect(() => {
    if (!introCard.isVisible) return;
    const duration = 1800;
    const fps = 60;
    const interval = 1000 / fps;
    const yearsSteps = Math.ceil(duration / interval);
    const clientsSteps = Math.ceil(duration / interval);
    let yearsFrame = 0;
    let clientsFrame = 0;

    const yearsTimer = setInterval(() => {
      yearsFrame++;
      const progress = Math.min(yearsFrame / yearsSteps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setYearsCount(Math.round(eased * YEARS_TARGET));
      if (yearsFrame >= yearsSteps) clearInterval(yearsTimer);
    }, interval);

    const clientsTimer = setInterval(() => {
      clientsFrame++;
      const progress = Math.min(clientsFrame / clientsSteps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setClientsCount(Math.round(eased * CLIENTS_TARGET));
      if (clientsFrame >= clientsSteps) clearInterval(clientsTimer);
    }, interval);

    return () => {
      clearInterval(yearsTimer);
      clearInterval(clientsTimer);
    };
  }, [introCard.isVisible, YEARS_TARGET, CLIENTS_TARGET]);

  const certHeader = useScrollAnimation({ threshold: 0.2 });
  const certGrid = useStaggerAnimation({ threshold: 0.1 });

  const valHeader = useScrollAnimation({ threshold: 0.2 });
  const valGrid = useStaggerAnimation({ threshold: 0.1 });

  const logosSection = useScrollAnimation({ threshold: 0.2 });
  const ctaSection = useScrollAnimation({ threshold: 0.2 });

  const content = {
    es: {
      title: 'Experiencia y Respaldo', subtitle: 'Reconocimientos y Certificaciones', about: 'Nosotros', track: 'Nuestra Trayectoria', heading1: 'La Experiencia no se Improvisa:', heading2: 'se Demuestra', intro1: 'En la industria en general, la capacitación no es un requisito: es un factor crítico para la seguridad, la continuidad operacional y la productividad. En INSECAP Capacitación entendemos esa realidad y trabajamos con un enfoque técnico, riguroso y alineado a los estándares que exige el mundo laboral.', intro2: 'Nuestra trayectoria se ha construido en terreno, formando competencias clave para operaciones seguras y eficientes. Hemos acompañado a empresas de distintos sectores, con mayor predominancia en la Gran Minería, en el desarrollo de habilidades técnicas, cumplimiento normativo y fortalecimiento de equipos de trabajo.', intro3: 'Cada programa formativo que implementamos responde a necesidades reales de la industria, con relatores especializados, metodologías prácticas y una ejecución orientada a resultados medibles.', growth: 'Crecimiento Sostenido', growthSub: 'Nuestra trayectoria en cifras', years: 'Años de Experiencia', clients: 'Clientes Atendidos', updated: `Datos actualizados al ${new Date().getFullYear()}`, certTag: 'Respaldo Institucional', certTitle: 'Certificaciones y Membresías', certText: 'Estas certificaciones y registros nos permiten crecer y posicionarnos en la industria con un excelente servicio, garantizando la calidad y cumplimiento normativo.', strengthsTag: 'Nuestras Fortalezas', strengthsTitle: 'Valores Técnicos Agregados', strengthsText: 'Factores diferenciadores que nos permiten crecer y posicionarnos en la industria, ofreciendo un servicio de excelencia que va más allá de la capacitación tradicional.', ctaTitle: '¿Necesitas un Socio Estratégico en Capacitación?', ctaText: 'En INSECAP, la experiencia no se improvisa: se demuestra. Contáctanos y conoce cómo podemos apoyar el desarrollo de tu equipo de trabajo.', ctaButton: 'Contáctanos Hoy',
      growthDescPre: 'Nuestro crecimiento sostenido refleja la confianza que la industria deposita en ',
      growthDescStrong: 'INSECAP como socio estratégico en capacitación',
      certs: [
        { title: 'Registro SENCE', description: 'Contamos con registro vigente ante el Servicio Nacional de Capacitación y Empleo (SENCE), habilitándonos para impartir capacitación con franquicia tributaria a lo largo del país.', badge: 'N° Resolución: 12208' },
        { title: 'Norma NCh2728:2015', description: 'Certificación anual que acredita el cumplimiento de los requisitos para operar como Organismo Técnico de Capacitación (OTEC), garantizando calidad en nuestros servicios formativos.', badge: 'Certificación Vigente' },
        { title: 'ISO 9001:2015', description: 'Certificación anual de la Norma Internacional que rige nuestros procesos en cuanto a servicios de calidad y mejora continua, asegurando estándares de clase mundial.', badge: 'Certificación Vigente' },
        { title: 'Cámara de Comercio de Santiago (CCS)', description: 'Como miembros de la CCS, estamos habilitados para postular a requerimientos y necesidades de capacitación de un gran sector de empresas de la industria en general.', badge: 'Miembro Activo' },
        { title: 'SICEP', description: 'Somos miembros de SICEP, lo cual nos habilita para postular a requerimientos y necesidades de capacitación de un gran sector de empresas de la industria en general.', badge: 'Miembro Activo' },
        { title: 'OTEC Acreditada por Codelco', description: 'Contamos con la acreditación de Codelco como OTEC calificada, lo que nos permite entregar servicios de capacitación alineados a los estándares de la principal empresa minera del país.', badge: 'Acreditación Vigente' },
        { title: 'Consejo de Competencias Mineras (CCM)', description: 'Cumplimos con los estándares del Consejo de Competencias Mineras, validando que nuestros programas formativos están alineados con las competencias requeridas por la industria minera.', badge: 'Sello Vigente' },
      ],
      strengths: [
        { title: 'Metodología de Enseñanza', description: 'Metodologías de enseñanza innovadoras y efectivas, diseñadas para maximizar el aprendizaje en entornos industriales y operacionales, con enfoque práctico y orientadas a la transferencia de competencias al puesto de trabajo.' },
        { title: 'Software de Administración y Control', description: 'Potente software de administración y control que permite gestionar eficientemente todos los procesos de capacitación, desde la planificación hasta el seguimiento de resultados, garantizando trazabilidad y transparencia.' },
        { title: 'Autoservicio para Clientes', description: 'Plataforma de autoservicio que permite a nuestros clientes acceder a información, gestionar inscripciones y realizar seguimiento de sus programas de capacitación de forma autónoma y en tiempo real.' },
        { title: 'Equipamiento de Última Tecnología', description: 'Equipamiento práctico de última tecnología, construido bajo los estándares solicitados por los mandantes, permitiendo entrenamientos realistas y alineados a las condiciones operacionales reales de la industria.' },
        { title: 'Diseñadores Curriculares e Instruccionales', description: 'Contamos con diseñadores curriculares y diseñadores instruccionales con experiencia en Andragogía, garantizando que cada programa formativo esté diseñado para el aprendizaje efectivo del adulto profesional.' },
        { title: 'Sello CCM', description: 'Obtención del sello CCM, un reconocimiento que valida nuestro compromiso con la excelencia en capacitación y nos distingue como un referente confiable en la formación de capital humano para la industria.' },
      ],
    },
    en: {
      title: 'Experience and Trust', subtitle: 'Recognition and Certifications', about: 'About us', track: 'Our Track Record', heading1: 'Experience is not improvised:', heading2: 'it is demonstrated', intro1: 'Across industry, training is not merely a requirement: it is a critical factor for safety, operational continuity and productivity. At INSECAP Training we understand that reality and work with a technical, rigorous approach aligned with the standards required by the labor market.', intro2: 'Our track record has been built in the field, developing key competencies for safe and efficient operations. We have supported companies across sectors, especially in large-scale mining, with technical upskilling, regulatory compliance and team strengthening.', intro3: 'Every training program we implement responds to real industry needs, with specialized instructors, practical methodologies and execution focused on measurable results.', growth: 'Sustained Growth', growthSub: 'Our journey in figures', years: 'Years of Experience', clients: 'Clients Served', updated: `Data updated to ${new Date().getFullYear()}`, certTag: 'Institutional Support', certTitle: 'Certifications and Memberships', certText: 'These certifications and registrations allow us to grow and position ourselves in the industry with excellent service, ensuring quality and regulatory compliance.', strengthsTag: 'Our Strengths', strengthsTitle: 'Technical Added Value', strengthsText: 'Differentiating factors that allow us to grow and stand out in the industry, delivering excellence beyond traditional training.', ctaTitle: 'Need a Strategic Training Partner?', ctaText: 'At INSECAP, experience is not improvised: it is demonstrated. Contact us and find out how we can support your team development.', ctaButton: 'Contact Us Today',
      growthDescPre: 'Our sustained growth reflects the trust the industry places in ',
      growthDescStrong: 'INSECAP as a strategic training partner',
      certs: [
        { title: 'SENCE Registration', description: 'We hold a valid registration with the National Training and Employment Service (SENCE), enabling us to deliver training with tax incentives throughout the country.', badge: 'N° Resolución: 12208' },
        { title: 'NCh2728:2015 Standard', description: 'Annual certification that accredits compliance with the requirements to operate as a Technical Training Organization (OTEC), ensuring quality in our training services.', badge: 'Valid Certification' },
        { title: 'ISO 9001:2015', description: 'Annual certification of the International Standard governing our processes in terms of quality services and continuous improvement, ensuring world-class standards.', badge: 'Valid Certification' },
        { title: 'Santiago Chamber of Commerce (CCS)', description: 'As members of the CCS, we are enabled to apply for training requirements and needs of a large segment of companies across industry.', badge: 'Active Member' },
        { title: 'SICEP', description: 'We are members of SICEP, which enables us to apply for training requirements and needs of a large segment of companies across industry.', badge: 'Active Member' },
        { title: 'Codelco Accredited OTEC', description: 'We hold Codelco accreditation as a qualified OTEC, enabling us to deliver training services aligned with the standards of the country\'s leading mining company.', badge: 'Valid Accreditation' },
        { title: 'Mining Competencies Council (CCM)', description: 'We comply with the standards of the Mining Competencies Council, validating that our training programs are aligned with the competencies required by the mining industry.', badge: 'Valid Seal' },
      ],
      strengths: [
        { title: 'Teaching Methodology', description: 'Innovative and effective teaching methodologies, designed to maximize learning in industrial and operational environments, with a practical focus and oriented toward competency transfer in the workplace.' },
        { title: 'Administration and Control Software', description: 'Powerful administration and control software that efficiently manages all training processes, from planning to results tracking, ensuring traceability and transparency.' },
        { title: 'Client Self-Service', description: 'Self-service platform that allows our clients to access information, manage enrollments and track their training programs independently and in real time.' },
        { title: 'State-of-the-Art Equipment', description: 'State-of-the-art practical equipment built to the standards required by clients, enabling realistic training aligned with real operational conditions in the industry.' },
        { title: 'Curricular and Instructional Designers', description: 'We have curricular designers and instructional designers with expertise in Andragogy, ensuring that each training program is designed for effective adult professional learning.' },
        { title: 'CCM Seal', description: 'Achievement of the CCM seal, a recognition that validates our commitment to excellence in training and distinguishes us as a reliable reference in human capital development for industry.' },
      ],
    },
    pt: {
      title: 'Experiencia e Respaldo', subtitle: 'Reconhecimentos e Certificacoes', about: 'Sobre nos', track: 'Nossa Trajetoria', heading1: 'A experiencia nao se improvisa:', heading2: 'ela se comprova', intro1: 'Na industria em geral, a capacitacao nao e apenas um requisito: e um fator critico para seguranca, continuidade operacional e produtividade. Na INSECAP Capacitacao entendemos essa realidade e trabalhamos com um enfoque tecnico, rigoroso e alinhado aos padroes exigidos pelo mercado.', intro2: 'Nossa trajetoria foi construida em campo, formando competencias chave para operacoes seguras e eficientes. Acompanhamos empresas de diferentes setores, com forte presenca na grande mineracao, no desenvolvimento de habilidades tecnicas, cumprimento normativo e fortalecimento de equipes.', intro3: 'Cada programa formativo que implementamos responde a necessidades reais da industria, com facilitadores especializados, metodologias praticas e execucao orientada a resultados mensuraveis.', growth: 'Crescimento Sustentado', growthSub: 'Nossa trajetoria em numeros', years: 'Anos de Experiencia', clients: 'Clientes Atendidos', updated: `Dados atualizados em ${new Date().getFullYear()}`, certTag: 'Respaldo Institucional', certTitle: 'Certificacoes e Associacoes', certText: 'Estas certificacoes e registros nos permitem crescer e nos posicionar na industria com excelente servico, garantindo qualidade e conformidade regulatoria.', strengthsTag: 'Nossos Diferenciais', strengthsTitle: 'Valores Tecnicos Agregados', strengthsText: 'Fatores diferenciadores que nos permitem crescer e nos posicionar na industria, oferecendo um servico de excelencia que vai alem da capacitacao tradicional.', ctaTitle: 'Precisa de um Parceiro Estrategico em Capacitacao?', ctaText: 'Na INSECAP, a experiencia nao se improvisa: se comprova. Fale conosco e saiba como podemos apoiar o desenvolvimento da sua equipe.', ctaButton: 'Fale Conosco Hoje',
      growthDescPre: 'Nosso crescimento sustentado reflete a confiança que a indústria deposita na ',
      growthDescStrong: 'INSECAP como parceiro estratégico em capacitação',
      certs: [
        { title: 'Registro SENCE', description: 'Possuímos registro vigente junto ao Serviço Nacional de Capacitação e Emprego (SENCE), habilitando-nos a oferecer capacitação com incentivo fiscal em todo o país.', badge: 'N° Resolução: 12208' },
        { title: 'Norma NCh2728:2015', description: 'Certificação anual que acredita o cumprimento dos requisitos para operar como Organismo Técnico de Capacitação (OTEC), garantindo qualidade em nossos serviços formativos.', badge: 'Certificação Vigente' },
        { title: 'ISO 9001:2015', description: 'Certificação anual da Norma Internacional que rege nossos processos em termos de serviços de qualidade e melhoria contínua, assegurando padrões de classe mundial.', badge: 'Certificação Vigente' },
        { title: 'Câmara de Comércio de Santiago (CCS)', description: 'Como membros da CCS, estamos habilitados a candidatar-nos a requisitos e necessidades de capacitação de um grande setor de empresas da indústria em geral.', badge: 'Membro Ativo' },
        { title: 'SICEP', description: 'Somos membros do SICEP, o que nos habilita a candidatar-nos a requisitos e necessidades de capacitação de um grande setor de empresas da indústria em geral.', badge: 'Membro Ativo' },
        { title: 'OTEC Acreditada pela Codelco', description: 'Contamos com a acreditação da Codelco como OTEC qualificada, permitindo entregar serviços de capacitação alinhados aos padrões da principal empresa de mineração do país.', badge: 'Acreditação Vigente' },
        { title: 'Conselho de Competências Mineiras (CCM)', description: 'Cumprimos com os padrões do Conselho de Competências Mineiras, validando que nossos programas formativos estão alinhados com as competências exigidas pela indústria de mineração.', badge: 'Selo Vigente' },
      ],
      strengths: [
        { title: 'Metodologia de Ensino', description: 'Metodologias de ensino inovadoras e eficazes, projetadas para maximizar o aprendizado em ambientes industriais e operacionais, com foco prático e orientadas à transferência de competências ao posto de trabalho.' },
        { title: 'Software de Administração e Controle', description: 'Poderoso software de administração e controle que gerencia com eficiência todos os processos de capacitação, desde o planejamento até o acompanhamento de resultados, garantindo rastreabilidade e transparência.' },
        { title: 'Autoatendimento para Clientes', description: 'Plataforma de autoatendimento que permite aos nossos clientes acessar informações, gerenciar inscrições e acompanhar seus programas de capacitação de forma autônoma e em tempo real.' },
        { title: 'Equipamentos de Última Tecnologia', description: 'Equipamentos práticos de última tecnologia, construídos sob os padrões exigidos pelos clientes, permitindo treinamentos realistas e alinhados às condições operacionais reais da indústria.' },
        { title: 'Designers Curriculares e Instrucionais', description: 'Contamos com designers curriculares e instrucionais com experiência em Andragogia, garantindo que cada programa formativo seja projetado para o aprendizado efetivo do adulto profissional.' },
        { title: 'Selo CCM', description: 'Obtenção do Selo CCM, um reconhecimento que valida nosso compromisso com a excelência em capacitação e nos distingue como referência confiável no desenvolvimento de capital humano para a indústria.' },
      ],
    },
  }[locale];

  // Datos visuales fijos de certificaciones (logos/iconos)
  const certVisuals = [
    { logo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logosence_png.png?v=1772478498', logoAlt: 'Logo SENCE', iconType: 'logo' as const, badgeColor: 'blue' as const },
    { logo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logo_slogan.svg?v=1772193702', logoAlt: 'Certificadora NCh2728', iconType: 'logo' as const, badgeColor: 'green' as const },
    { logo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-02-27_085941459.png?v=1772193585', logoAlt: 'Certificadora ISO 9001', iconType: 'logo' as const, badgeColor: 'green' as const },
    { logo: '/logos/CCS.png', logoAlt: 'Logo CCS', iconType: 'logo' as const, badgeColor: 'blue' as const },
    { logo: '/logos/SICEP.png', logoAlt: 'Logo SICEP', iconType: 'logo' as const, badgeColor: 'blue' as const },
    { logo: '/logos/Sello Acreditado Codelco Color.png', logoAlt: 'Sello Acreditado Codelco', iconType: 'logo' as const, badgeColor: 'green' as const },
    { logo: '/logos/Sello CCM Color.png', logoAlt: 'Sello CCM', iconType: 'logo' as const, badgeColor: 'green' as const },
  ];
  const certificaciones = certVisuals.map((visual, i) => ({
    ...visual,
    title: content.certs[i].title,
    description: content.certs[i].description,
    badge: { text: content.certs[i].badge, color: visual.badgeColor },
  }));

  // Datos de valores técnicos
  const strengthIcons = [
    <BookOpen className="w-7 h-7 text-secondary" />,
    <Monitor className="w-7 h-7 text-secondary" />,
    <Cpu className="w-7 h-7 text-secondary" />,
    <Wrench className="w-7 h-7 text-secondary" />,
    <GraduationCap className="w-7 h-7 text-secondary" />,
    <Award className="w-7 h-7 text-secondary" />,
  ];
  const valoresTecnicos = strengthIcons.map((icon, i) => ({
    icon,
    title: content.strengths[i].title,
    description: content.strengths[i].description,
    highlight: i === 5,
  }));

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={content.title}
        description={content.certText}
        url="/Experiencia-y-Respaldo"
        type="website"
        keywords={[
          'experiencia INSECAP',
          'certificaciones OTEC',
          'SENCE',
          'ISO 9001',
          'NCh 2728',
          locale === 'en' ? 'mining training' : locale === 'pt' ? 'capacitacao mineracao' : 'capacitación minería',
          locale === 'en' ? 'professional training Chile' : locale === 'pt' ? 'formacao profissional Chile' : 'formación profesional Chile'
        ]}
      />
      <Header />

      <main>
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[
            { label: content.about, href: "/nosotros" },
            { label: content.title }
          ]}
        />

        {/* =====================================================
            SECCIÓN 1: INTRODUCCIÓN 
        ===================================================== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
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
                  {content.track}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6">
                  {content.heading1} <span className="text-blue-600">{content.heading2}</span>
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
                  <p className="text-slate-600 text-lg leading-relaxed text-justify">{content.intro1}</p>
                  <p className="text-slate-600 text-lg leading-relaxed text-justify">{content.intro2}</p>
                  <p className="text-slate-600 text-lg leading-relaxed text-justify">{content.intro3}</p>
                </div>

                {/* Card visual lateral animado */}
                <div
                  ref={introCard.ref}
                  className={`relative transition-all duration-700 ease-out delay-400 ${introCard.isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-12'
                    }`}
                >
                  {/* Fondo decorativo exterior */}
                  <div className="absolute -inset-3 bg-gradient-to-br from-blue-600/20 to-indigo-600/10 rounded-[2.5rem] blur-2xl"></div>

                  <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-[2rem] p-8 text-white overflow-hidden shadow-2xl">
                    {/* Destellos decorativos */}
                    <div className="absolute top-0 right-0 w-56 h-56 bg-blue-400 rounded-full blur-[120px] opacity-15 -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400 rounded-full blur-[100px] opacity-10 -ml-16 -mb-16 pointer-events-none"></div>

                    <div className="relative z-10">
                      {/* Header de la card */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="bg-white/15 backdrop-blur-sm p-2.5 rounded-xl border border-white/20">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-blue-200 font-bold uppercase tracking-widest text-xs block">{content.growth}</span>
                          <span className="text-white/60 text-xs">{content.growthSub}</span>
                        </div>
                      </div>

                      {/* Descripción */}
                      <p className="text-blue-100/90 text-base leading-relaxed mb-7">
                        {content.growthDescPre}<strong className="text-white">{content.growthDescStrong}</strong>.
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Años de Experiencia */}
                        <div className="group bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-5 transition-all duration-300">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-blue-400/30 p-1.5 rounded-lg">
                              <Calendar className="w-3.5 h-3.5 text-blue-200" />
                            </div>
                          </div>
                          <div className="text-4xl font-extrabold text-white tabular-nums leading-none mb-1">
                            {yearsCount}
                            <span className="text-blue-300 text-2xl">+</span>
                          </div>
                          <div className="text-blue-200 text-xs font-medium uppercase tracking-wider mt-2">{content.years}</div>
                        </div>

                        {/* Clientes */}
                        <div className="group bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-5 transition-all duration-300">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="bg-indigo-400/30 p-1.5 rounded-lg">
                              <Building2 className="w-3.5 h-3.5 text-indigo-200" />
                            </div>
                          </div>
                          <div className="text-4xl font-extrabold text-white tabular-nums leading-none mb-1">
                            +{clientsCount.toLocaleString('es-CL')}
                          </div>
                          <div className="text-blue-200 text-xs font-medium uppercase tracking-wider mt-2">{content.clients}</div>
                        </div>
                      </div>

                      {/* Separador y nota al pie */}
                      <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white/50 text-xs">{content.updated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strip de logos de membresías */}
              <div
                ref={logosSection.ref}
                className={`mt-16 pt-10 border-t border-slate-100 transition-all duration-700 ease-out ${
                  logosSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <p className="text-center text-slate-400 text-xs font-semibold uppercase tracking-widest mb-8">Respaldados por</p>
                <div className="flex flex-wrap items-center justify-center gap-10">
                  <img src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logosence_png.png?v=1772478498" alt="Logo SENCE" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                  <img src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logo_slogan.svg?v=1772193702" alt="Certificadora NCh2728" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                  <img src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-02-27_085941459.png?v=1772193585" alt="ISO 9001" className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                  <img src="/logos/CCS.png" alt="Logo CCS" className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                  <img src="/logos/SICEP.png" alt="Logo SICEP" className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECCIÓN 2: CERTIFICACIONES Y REGISTROS
        ===================================================== */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
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
                  {content.certTag}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6">
                  {content.certTitle}
                </h2>
                <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                  {content.certText}
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
                          className="h-20 w-auto object-contain"
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
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
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
                  {content.strengthsTag}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6">
                  {content.strengthsTitle}
                </h2>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  {content.strengthsText}
                </p>
              </div>

              {/* Carousel de valores técnicos */}
              <div
                ref={valGrid.ref}
                className={`transition-all duration-700 ease-out ${valGrid.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <Carousel
                  opts={{ align: 'start', loop: true }}
                  plugins={[Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {valoresTecnicos.map((valor, index) => {
                        const palettes = [
                          { from: 'from-white', to: 'to-blue-50/60', accent: 'bg-blue-600', ring: 'ring-blue-100', shine: ['#2563eb', '#93c5fd', '#bfdbfe'] as [string, string, string], iconBg: 'bg-blue-600/8', iconHover: 'group-hover:bg-blue-600/15', top: 'from-blue-600 to-blue-400', shadow: 'hover:shadow-blue-100/60' },
                          { from: 'from-white', to: 'to-sky-50/60', accent: 'bg-sky-500', ring: 'ring-sky-100', shine: ['#0284c7', '#7dd3fc', '#bae6fd'] as [string, string, string], iconBg: 'bg-sky-500/8', iconHover: 'group-hover:bg-sky-500/15', top: 'from-sky-500 to-cyan-400', shadow: 'hover:shadow-sky-100/60' },
                          { from: 'from-white', to: 'to-indigo-50/60', accent: 'bg-indigo-600', ring: 'ring-indigo-100', shine: ['#4338ca', '#a5b4fc', '#c7d2fe'] as [string, string, string], iconBg: 'bg-indigo-600/8', iconHover: 'group-hover:bg-indigo-600/15', top: 'from-indigo-600 to-blue-400', shadow: 'hover:shadow-indigo-100/60' },
                          { from: 'from-white', to: 'to-cyan-50/60', accent: 'bg-cyan-600', ring: 'ring-cyan-100', shine: ['#0891b2', '#67e8f9', '#a5f3fc'] as [string, string, string], iconBg: 'bg-cyan-600/8', iconHover: 'group-hover:bg-cyan-600/15', top: 'from-cyan-600 to-sky-400', shadow: 'hover:shadow-cyan-100/60' },
                          { from: 'from-white', to: 'to-blue-50/60', accent: 'bg-blue-500', ring: 'ring-blue-100', shine: ['#3b82f6', '#93c5fd', '#dbeafe'] as [string, string, string], iconBg: 'bg-blue-500/8', iconHover: 'group-hover:bg-blue-500/15', top: 'from-blue-500 to-cyan-400', shadow: 'hover:shadow-blue-100/60' },
                          { from: 'from-white', to: 'to-sky-50/60', accent: 'bg-sky-600', ring: 'ring-sky-100', shine: ['#0369a1', '#38bdf8', '#bae6fd'] as [string, string, string], iconBg: 'bg-sky-600/8', iconHover: 'group-hover:bg-sky-600/15', top: 'from-sky-600 to-blue-400', shadow: 'hover:shadow-sky-100/60' },
                        ];
                        const p = palettes[index % palettes.length];
                        return (
                          <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <WarpBackground
                              className={`h-full rounded-3xl border-0 p-0 bg-gradient-to-br ${p.from} ${p.to} shadow-md ${p.shadow} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden`}
                              beamsPerSide={2}
                              beamSize={8}
                              beamDuration={4}
                              beamDelayMax={2}
                              gridColor="rgba(0,0,0,0.06)"
                            >
                              <div className="relative flex flex-col h-full p-8">
                              {/* Franja superior de color */}
                              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${p.top} rounded-t-3xl`} />
                              {/* Orbe decorativo de fondo */}
                              <div className={`pointer-events-none absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${p.accent} opacity-10 blur-2xl`} />
                              {valor.highlight && (
                                <div className="absolute top-4 right-4">
                                  <Sparkles className="w-5 h-5 text-yellow-500 drop-shadow" />
                                </div>
                              )}
                              <div className={`${p.iconBg} ${p.iconHover} p-3 rounded-xl w-fit mb-6 transition-colors ring-1 ${p.ring}`}>
                                {valor.icon}
                              </div>
                              <h3 className="text-xl font-bold text-blue-950 mb-3">{valor.title}</h3>
                              <p className="text-gray-600 text-sm leading-relaxed flex-1 text-justify">{valor.description}</p>
                              </div>
                            </WarpBackground>
                          </CarouselItem>
                        );
                      })}
                  </CarouselContent>
                  <div className="flex justify-center gap-3 mt-8">
                    <CarouselPrevious className="static translate-y-0 bg-white border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors" />
                    <CarouselNext className="static translate-y-0 bg-white border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors" />
                  </div>
                </Carousel>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECCIÓN 4: CTA
        ===================================================== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            <div className="max-w-4xl mx-auto">
              {/* CTA animado */}
              <div
                ref={ctaSection.ref}
                className={`text-center transition-all duration-700 ease-out delay-200 ${ctaSection.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
              >
                <h2 className="text-3xl font-bold text-blue-950 mb-6">{content.ctaTitle}</h2>
                <p className="text-slate-600 mb-8 text-lg max-w-2xl mx-auto">
                  {content.ctaText}
                </p>
                <a
                  href="#contacto"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl ${ctaSection.isVisible
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-90'
                    }`}
                  style={{
                    transitionDelay: ctaSection.isVisible ? '400ms' : '0ms',
                    transitionDuration: '500ms',
                  }}
                >
                  {content.ctaButton}
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
