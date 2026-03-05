import { useState } from 'react';
import { Home, ChevronRight, Mail, Phone, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHero from '@/components/PageHero';

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
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/NatalieG-1-600x657.jpg?v=1768566222'
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
        role: 'LIDER DE DISEÑO DE CURSOS',
        email: 'lherrera@insecap.cl',
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Lili.webp?v=1769089386'
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
        photo: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/NicoA_543c82f6-186b-4bbb-90bf-acc011a13e5b.webp?v=1769089936'
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

// Componente de tarjeta de miembro
const MemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <Card className="p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl rounded-[25px] border-0 shadow-[0_8px_20px_rgba(0,0,0,0.12)] bg-[hsl(var(--insecap-blue))] text-white">
      <Avatar className="w-[180px] h-[180px] mb-5 border-4 border-white shadow-xl">
        <AvatarImage src={member.photo} alt={member.name} className="object-cover" />
        <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-[hsl(var(--insecap-cyan))] to-[hsl(var(--insecap-blue-light))] text-white">
          {getInitials(member.name)}
        </AvatarFallback>
      </Avatar>
      <h3 className="text-xl font-bold text-white mb-2 leading-tight font-['Montserrat']">
        {member.name}
      </h3>
      <p className="text-sm text-white/90 mb-4 font-medium font-['Montserrat'] tracking-wide">
        {member.role}
      </p>
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="inline-flex items-center gap-2 bg-[hsl(var(--insecap-cyan))] hover:bg-[hsl(var(--insecap-blue-light))] text-white px-5 py-2.5 rounded-full font-['Montserrat'] font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <Mail className="w-4 h-4" />
          {member.email}
        </a>
      )}
    </Card>
  );
};

const OurTeam = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de envío del formulario
    console.log('Formulario enviado:', formData);
    alert('Gracias por contactarnos. Nos comunicaremos contigo pronto.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <PageHero
          title="Nuestro Equipo"
          subtitle="Nosotros"
          breadcrumbs={[{ label: "Nuestro Equipo" }]}
        />
        <div className="container mx-auto px-8 md:px-14 lg:px-16">

          {/* Sección Introductoria - Equipo Destacado */}
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-[hsl(var(--insecap-blue))] mb-2">Equipo Insecap</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Creciendo Juntos</h2>
            <div className="w-48 h-1.5 mx-auto mb-6 bg-gradient-to-r from-[hsl(var(--insecap-blue))] via-[hsl(var(--insecap-cyan))] to-[hsl(var(--insecap-blue-light))] rounded-full shadow-md"></div>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Equipo multidisciplinario encargado de dar soluciones de calidad
            </p>


          </div>

          {/* Texto Descriptivo */}
          <div className="bg-white rounded-[25px] shadow-[0_0_20px_rgba(0,0,0,0.08)] p-8 md:p-12 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--insecap-blue))] mb-3">
              ¡Bienvenidos a Insecap!
            </h2>
            <div className="w-40 h-1.5 mb-6 bg-gradient-to-r from-[hsl(var(--insecap-blue))] via-[hsl(var(--insecap-cyan))] to-[hsl(var(--insecap-blue-light))] rounded-full shadow-md"></div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Somos una empresa de capacitación especializada en brindar soluciones integrales a la industria minera,
                con un enfoque en el desarrollo del capital humano. En Insecap contamos con un equipo multidisciplinario
                de expertos altamente capacitados en diversas áreas, lo que nos permite ofrecer programas de capacitación
                personalizados y adaptados a las necesidades específicas de nuestros clientes.
              </p>
              <p>
                En la industria minera, la formación y el desarrollo del capital humano son fundamentales para garantizar
                un desempeño seguro y eficiente en las operaciones. En Insecap entendemos esta necesidad y, por lo tanto,
                nos enfocamos en brindar soluciones efectivas y personalizadas a nuestros clientes.
              </p>
              <p>
                Nuestro equipo está conformado por profesionales con amplia experiencia en áreas como la ingeniería, la
                seguridad y salud ocupacional, la gestión de recursos humanos, entre otras. Gracias a esta diversidad de
                conocimientos y habilidades, podemos ofrecer programas de capacitación que abarcan desde la formación
                técnica y especializada hasta habilidades blandas y liderazgo.
              </p>
            </div>
          </div>

          {/* Título de Secciones de Equipo */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--insecap-blue))] mb-4">
              Equipo Insecap
            </h2>
            <div className="w-48 h-1.5 mx-auto bg-gradient-to-r from-[hsl(var(--insecap-blue))] via-[hsl(var(--insecap-cyan))] to-[hsl(var(--insecap-blue-light))] rounded-full shadow-md"></div>
          </div>

          {/* Gerencia Destacada */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
            {teamByArea[0].members.map((member, index) => (
              <MemberCard key={index} member={member} />
            ))}
          </div>

          {/* Secciones por Área (sin Gerencia ya que está arriba) */}
          <div className="space-y-16">
            {teamByArea.slice(1).map((area, areaIndex) => (
              <div key={areaIndex}>
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-[hsl(var(--insecap-blue))] mb-3">
                    {area.area}
                  </h3>
                  <div className="w-96 h-1.5 bg-gradient-to-r from-[hsl(var(--insecap-blue))] via-[hsl(var(--insecap-cyan))] to-[hsl(var(--insecap-blue-light))] rounded-full shadow-md"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {area.members.map((member, memberIndex) => (
                    <MemberCard key={memberIndex} member={member} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OurTeam;
