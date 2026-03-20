import { Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PageHero from '@/components/PageHero';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/use-scroll-animation';
import { Meteors } from '@/components/ui/meteors';
import { useLocalizedPath } from '@/hooks/use-localized-path';

// Tipos
interface TeamMember {
  name: string;
  role: string;
  email?: string;
  photo?: string;
}

interface TeamArea {
  area: string;
  members: TeamMember[];
}

// Datos del equipo de Insecap (extraídos del sitio oficial)
const teamByArea: TeamArea[] = [
  {
    area: 'Gerencia',
    members: [
      {
        name: 'Marcela Riquelme Robles',
        role: 'GERENTE DE OPERACIONES',
        email: 'mriquelme@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Marcela_Riquelme.webp?v=1769089386'
      },
      {
        name: 'Santiago Henriquez Romero',
        role: 'GERENTE GENERAL',
        email: 'shenriquez@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Santiago_Henriquez.webp?v=1769089386'
      },
    ]
  },
  {
    area: 'Área Comercial',
    members: [
      {
        name: 'Karen Riquelme Robles',
        role: 'ASESOR COMERCIAL',
        email: 'Kriquelme@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Karen_Riquelme.webp?v=1769089386'
      },
      {
        name: 'Claudio Hervera Rojas',
        role: 'ASESOR COMERCIAL',
        email: 'chervera@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Claudio_Hervera_Rojas.webp?v=1769089386'
      },
      {
        name: 'Michel Carvajal Carvacho',
        role: 'ASESOR COMERCIAL',
        email: 'mcarvajal@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Michel_Carvajal_COMP.webp?v=1769089936'
      },
      {
        name: 'Paola Rojas Medina',
        role: 'ASESOR COMERCIAL',
        email: 'projas@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Paola_Rojas_COMP.webp?v=1769089936'
      },
      {
        name: 'Suilly Lisboa Miranda',
        role: 'ASESOR COMERCIAL',
        email: 'slisboa@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Suilly.webp?v=1769089386'
      },
      {
        name: 'Natalie Galván Sierra',
        role: 'ASESOR COMERCIAL',
        email: 'ngalvan@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/NatalieGalvanv2-ezgif.com-video-to-webp-converter.webp?v=1773344345'
      },
    ]
  },
  {
    area: 'RRHH & FINANZAS',
    members: [
      {
        name: 'Rodrigo Delgado Cepeda',
        role: 'GESTOR DE PERSONAS',
        email: 'rdelgado@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Rodrigo_Delgado.webp?v=1769089386'
      },
      {
        name: 'Javiera Montiel Riquelme',
        role: 'CONTROL DE CALIDAD Y FINANZAS',
        email: 'jmontiel@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Javiera_Montiel.webp?v=1769089386'
      },
      {
        name: 'Karla Rojas Palomino',
        role: 'FACTURACIÓN',
        email: 'krojas@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Karla.webp?v=1769089386'
      },
    ]
  },
  {
    area: 'Calidad y Servicio & Área Técnica',
    members: [
      {
        name: 'Liliana Herrera Altamirano',
        role: 'LIDER DE DESARRLLO DE CURSOS',
        email: 'lherrera@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Lili.webp?v=1769089386'
      },
      {
        name: 'Viviana Zepeda Santibañez',
        role: 'LIDER DE DISEÑO DE CURSOS',
        email: 'vzepeda@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Viviana_b5905a1a-d870-49a9-a502-f747011f3395.webp?v=1773348370',
      },
      {
        name: 'César Velásquez Mata',
        role: 'JEFE DE CALIDAD Y SERVICIOS',
        email: 'cvelasquez@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Cesar_COMP.webp?v=1769089936'
      },
      {
        name: 'Franco Picón Viza',
        role: 'DISEÑADOR CURRICULAR',
        email: 'fpicon@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Franco.webp?v=1769089386'
      },
      {
        name: 'Eduardo Ramírez Pizarro',
        role: 'DISEÑADOR CURRICULAR',
        email: 'eramirez@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Eduardo_Ramirez_COMP.webp?v=1769089936'
      },
      {
        name: 'Jorge Muñoz',
        role: 'TUTOR DE DESARROLLO DE FACILITADORES',
        email: 'jmunoz@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Jorge.webp?v=1769089386'
      },
      {
        name: 'Marian Brito Mata',
        role: 'DISEÑADORA EDITORIAL',
        email: 'mbrito@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Marian_COMP.webp?v=1769089936'
      },
      {
        name: 'Jeisy Aravena Ortiz',
        role: 'DISEÑADORA EDITORIAL',
        email: 'jaravena@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Jeisy_Aravena_2025.webp?v=1769089936'
      },
    ]
  },
  {
    area: 'Servicio Presencial',
    members: [
      {
        name: 'Francisco José Arguinzones Carvajal',
        role: 'COORDINACIÓN LOGÍSTICA',
        email: 'farguinzones@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Francisco.webp?v=1769089386'
      },
      {
        name: 'Paola Delgado García',
        role: 'GESTIÓN POST CURSO',
        email: 'pdelgado@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/paola_delgado.webp?v=1769089386'
      },
      {
        name: 'Andrea Araneda Arevena',
        role: 'COORDINACIÓN LOGÍSTICA',
        email: 'aaraneda@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/AndreaAranedaAravena.webp?v=1769089386'
      },
      {
        name: 'Yilia Molina Rivera',
        role: 'GESTIÓN POST CURSO',
        email: 'ymolina@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Yilia_ORIGINAL.webp?v=1769089937'
      },
      {
        name: 'Nicolás Aguilar Monardes',
        role: 'COORDINACIÓN LOGÍSTICA',
        email: 'naguilar@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/NicoA_543c82f6-186b-4bbb-90bf-acc011a13e5b.webp?v=1773348098'
      },
    ]
  },
  {
    area: 'Mantención',
    members: [
      {
        name: 'Dilia Villegas Martínez',
        role: 'RECEPCIÓN',
        email: 'dvillegas@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Dilia_COMP.webp?v=1769089936'
      },
      {
        name: 'Lucy Condorcett Anza',
        role: 'MANTENCIÓN',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Lucy_Condorcet._con_Fondomp4.webp?v=1769090189'
      },
      {
        name: 'Ana Rojas Chung',
        role: 'MANTENCIÓN',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Ana_Rojas.webp?v=1769089386'
      },
      {
        name: 'Ana Avalos Paz',
        role: 'MANTENCIÓN',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Ana_Avalos_v2_ultraliviano.webp?v=1770235241'
      },
      {
        name: 'Karen Viatela Montoya',
        role: 'MANTENCIÓN',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Karen_Viatela_4c04986b-8cdf-4129-8c28-d9eb07f437aa.webp?v=1773343569'
      },
    ]
  },
  {
    area: 'Publicidad y Marketing',
    members: [
      {
        name: 'Mauricio Barrera Bravo',
        role: 'DISEÑADOR GRÁFICO',
        email: 'mbarrera@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Mau.webp?v=1769089386'
      },
    ]
  },
  {
    area: 'Servicio E-learning',
    members: [
      {
        name: 'Vanessa Castillo Suárez',
        role: 'SUPERVISORA DE CONEXIONES ONLINE',
        email: 'vcastillo@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Vanessa_Castillo_504ef7de-a946-4084-bb93-59209111834d.webp?v=1769089936'
      },
    ]
  },
  {
    area: 'Informática',
    members: [
      {
        name: 'Luis Fernández Veroiza',
        role: 'ESPECIALISTA PROGRAMADOR',
        email: 'lfernandez@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Luis.webp?v=1769089386'
      },
      {
        name: 'Wilson Carvajal Rozas',
        role: 'ENCARGADO TICA',
        email: 'wcarvajal@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Wilson_Carvajal_v2.webp?v=1769089386'
      },
      {
        name: 'Ernes Fuenzalida',
        role: 'DESARROLLADOR',
        email: 'efuenzalida@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Ernes_Fuenzalida.webp?v=1769089386'
      },
    ]
  },
];

// Función para obtener iniciales del nombre
const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Componente de tarjeta de miembro — glassmorphism + reveal overlay
const MemberCard = ({ member, delay = 0, contactLabel }: { member: TeamMember; delay?: number; contactLabel: string }) => {
  return (
    <div
      className="group relative rounded-3xl overflow-hidden cursor-default"
      style={{
        animationDelay: `${delay}ms`,
        background: 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)',
        boxShadow: '0 4px 24px rgba(72,92,199,0.10)',
        transition: 'transform 350ms cubic-bezier(.22,.68,0,1.1), box-shadow 350ms ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px) scale(1.02)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(72,92,199,0.22)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(72,92,199,0.10)';
      }}
    >
      {/* Borde gradiente superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00B8DE] via-[#485CC7] to-[#00B8DE] z-10" />

      {/* Foto */}
      <div className="relative w-full aspect-[3/3.4] overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50">
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage
            src={member.photo}
            alt={member.name}
            className="object-cover object-top w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <AvatarFallback className="w-full h-full rounded-none text-5xl font-bold bg-gradient-to-br from-[#485CC7] to-[#00B8DE] text-white">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        {/* Overlay gradiente hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a6b]/80 via-[#0c1a6b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-4">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-[#485CC7] px-4 py-2 rounded-full font-semibold text-xs transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Mail className="w-3.5 h-3.5" />
              {contactLabel}
            </a>
          )}
        </div>
      </div>

      {/* Info inferior */}
      <div className="px-5 py-4">
        <h3 className="font-bold text-[#0c1a6b] text-base leading-tight mb-1">
          {member.name}
        </h3>
        <p className="text-xs font-semibold text-[#485CC7] tracking-wide uppercase">
          {member.role}
        </p>
      </div>
    </div>
  );
};

// Sub-componente por área con scroll animation propio
const AreaSection = ({ area, contactLabel }: { area: TeamArea; contactLabel: string }) => {
  const anim = useStaggerAnimation({ threshold: 0.12 });
  const headerAnim = useScrollAnimation({ threshold: 0.2 });
  return (
    <div>
      <div
        ref={headerAnim.ref}
        className={`flex items-center gap-4 mb-8 transition-all duration-600 ease-out ${headerAnim.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
      >
        <h3 className="text-2xl font-bold text-[#0c1a6b] whitespace-nowrap">{area.area}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-[#485CC7]/50 to-transparent" />
      </div>
      <div ref={anim.ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {area.members.map((member, i) => (
          <div
            key={i}
            className={`transition-all duration-500 ease-out ${anim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: anim.isVisible ? `${i * 80}ms` : '0ms' }}
          >
            <MemberCard member={member} contactLabel={contactLabel} />
          </div>
        ))}
      </div>
    </div>
  );
};

const OurTeam = () => {
  const { locale } = useLocalizedPath();
  const introAnim    = useScrollAnimation({ threshold: 0.2 });
  const descAnim     = useScrollAnimation({ threshold: 0.15 });
  const gerenciaAnim = useStaggerAnimation({ threshold: 0.15 });

  const content = {
    es: {
      title: 'Nuestro Equipo', subtitle: 'Nosotros', breadcrumb: 'Nuestro Equipo', label: 'Equipo Insecap', growing: 'Creciendo Juntos', intro: 'Equipo multidisciplinario encargado de dar soluciones de calidad', welcome: 'Bienvenidos a Insecap!', paragraph1: 'Somos una empresa de capacitacion especializada en brindar soluciones integrales a la industria minera, con un enfoque en el desarrollo del capital humano. Contamos con un equipo multidisciplinario de expertos altamente capacitados en diversas areas, lo que nos permite ofrecer programas personalizados y adaptados a las necesidades de cada cliente.', paragraph2: 'Nuestro equipo esta conformado por profesionales con amplia experiencia en ingenieria, seguridad y salud ocupacional, gestion de recursos humanos y mas. Esa diversidad nos permite abarcar desde formacion tecnica especializada hasta habilidades blandas y liderazgo.', team: 'Equipo Insecap', management: 'Gerencia', contact: 'Contactar'
    },
    en: {
      title: 'Our Team', subtitle: 'About us', breadcrumb: 'Our Team', label: 'Insecap Team', growing: 'Growing Together', intro: 'A multidisciplinary team focused on delivering quality solutions', welcome: 'Welcome to Insecap!', paragraph1: 'We are a training company specialized in delivering comprehensive solutions to the mining industry, with a strong focus on human capital development. Our multidisciplinary team of experts allows us to offer tailored programs adapted to each client\'s needs.', paragraph2: 'Our team is made up of professionals with broad experience in engineering, occupational health and safety, human resources management and more. That diversity allows us to cover everything from specialized technical training to soft skills and leadership.', team: 'Insecap Team', management: 'Management', contact: 'Contact'
    },
    pt: {
      title: 'Nossa Equipe', subtitle: 'Sobre nos', breadcrumb: 'Nossa Equipe', label: 'Equipe Insecap', growing: 'Crescendo Juntos', intro: 'Equipe multidisciplinar responsavel por entregar solucoes de qualidade', welcome: 'Bem-vindos a Insecap!', paragraph1: 'Somos uma empresa de capacitacao especializada em oferecer solucoes integrais para a industria mineradora, com foco no desenvolvimento do capital humano. Contamos com uma equipe multidisciplinar de especialistas altamente capacitados, o que nos permite oferecer programas personalizados e adaptados as necessidades de cada cliente.', paragraph2: 'Nossa equipe e formada por profissionais com ampla experiencia em engenharia, seguranca e saude ocupacional, gestao de recursos humanos e muito mais. Essa diversidade nos permite abranger desde formacao tecnica especializada ate habilidades interpessoais e lideranca.', team: 'Equipe Insecap', management: 'Gerencia', contact: 'Contato'
    },
  }[locale];

  const localizedAreas: Record<string, string> = {
    Gerencia: content.management,
    'Área Comercial': locale === 'en' ? 'Commercial Area' : locale === 'pt' ? 'Area Comercial' : 'Area Comercial',
    'RRHH & FINANZAS': locale === 'en' ? 'HR & Finance' : locale === 'pt' ? 'RH e Financas' : 'RRHH y Finanzas',
    'Calidad y Servicio & Área Técnica': locale === 'en' ? 'Quality, Service & Technical Area' : locale === 'pt' ? 'Qualidade, Servico e Area Tecnica' : 'Calidad y Servicio y Area Tecnica',
    'Servicio Presencial': locale === 'en' ? 'On-site Service' : locale === 'pt' ? 'Servico Presencial' : 'Servicio Presencial',
    'Mantención': locale === 'en' ? 'Maintenance' : locale === 'pt' ? 'Manutencao' : 'Mantencion',
    'Publicidad y Marketing': locale === 'en' ? 'Advertising and Marketing' : locale === 'pt' ? 'Publicidade e Marketing' : 'Publicidad y Marketing',
    'Servicio E-learning': locale === 'en' ? 'E-learning Service' : locale === 'pt' ? 'Servico E-learning' : 'Servicio E-learning',
    Informática: locale === 'en' ? 'IT' : locale === 'pt' ? 'Informatica' : 'Informatica',
  };

  const displayAreas = teamByArea.map((area) => ({
    ...area,
    area: localizedAreas[area.area] ?? area.area,
  }));

  return (
    <div className="min-h-screen bg-[#f7f9ff]">
      <Header />

      <main>
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: content.breadcrumb }]}
        />

        <div className="container mx-auto px-8 md:px-14 lg:px-16">

          {/* Hero intro */}
          <div
            ref={introAnim.ref}
            className={`py-20 text-center transition-all duration-700 ease-out ${introAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <span className="inline-block text-sm font-semibold text-[#485CC7] uppercase tracking-widest mb-3">{content.label}</span>
            <h2 className="text-5xl md:text-6xl font-bold text-[#0c1a6b] mb-4">{content.growing}</h2>
            <div className="w-24 h-1.5 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00B8DE] to-[#485CC7]" />
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              {content.intro}
            </p>
          </div>

          {/* Card descripción con meteoros */}
          <div
            ref={descAnim.ref}
            className={`relative rounded-[2rem] overflow-hidden p-10 md:p-14 mb-20 text-white transition-all duration-700 ease-out ${descAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ background: 'linear-gradient(135deg, #0c1a6b 0%, #1a3a8f 50%, #0e7bb5 100%)' }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-300 rounded-full blur-[130px] opacity-20 -mr-24 -mt-24 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-400 rounded-full blur-[100px] opacity-15 -ml-20 -mb-20 pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none"
              style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }}
            />
            <Meteors number={12} />
            <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{content.welcome}</h2>
                <div className="w-16 h-1 rounded-full bg-[#00B8DE] mb-6" />
                <div className="space-y-4 text-white/80 leading-relaxed text-[0.97rem] text-justify">
                  <p>{content.paragraph1}</p>
                  <p>{content.paragraph2}</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center shrink-0">
                <img
                  src="/isotipos/Insecap_Logo-09.png"
                  alt="Insecap isotipo"
                  className="w-48 xl:w-56 opacity-90 drop-shadow-[0_0_32px_rgba(0,184,222,0.35)] select-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Título sección equipo */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0c1a6b] mb-3">{content.team}</h2>
            <div className="w-24 h-1.5 mx-auto rounded-full bg-gradient-to-r from-[#00B8DE] to-[#485CC7]" />
          </div>

          {/* Gerencia destacada */}
          <div ref={gerenciaAnim.ref} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl font-bold text-[#0c1a6b]">{content.management}</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-[#485CC7]/50 to-transparent" />
            </div>
            <div className="grid sm:grid-cols-2 max-w-2xl mx-auto gap-6">
              {displayAreas[0].members.map((member, i) => (
                <div
                  key={i}
                  className={`transition-all duration-500 ease-out ${gerenciaAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: gerenciaAnim.isVisible ? `${i * 120}ms` : '0ms' }}
                >
                  <MemberCard member={member} contactLabel={content.contact} />
                </div>
              ))}
            </div>
          </div>

          {/* Resto de áreas */}
          <div className="space-y-16 pb-24">
            {displayAreas.slice(1).map((area) => (
              <AreaSection key={area.area} area={area} contactLabel={content.contact} />
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OurTeam;
