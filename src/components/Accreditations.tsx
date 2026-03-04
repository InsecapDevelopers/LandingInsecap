import { Award, CheckCircle, Shield, FileCheck } from 'lucide-react';

const accreditations = [
  {
    icon: Award,
    title: 'SENCE',
    description: 'Organismo Técnico de Capacitación acreditado ante SENCE',
  },
  {
    icon: Shield,
    title: 'NCh 2728',
    description: 'Certificados bajo Norma Chilena 2728 de calidad',
  },
  {
    icon: FileCheck,
    title: 'ISO 9001',
    description: 'Sistema de gestión de calidad certificado',
  },
  {
    icon: CheckCircle,
    title: '+15 Años',
    description: 'De experiencia formando profesionales en Chile',
  },
];

const stats = [
  { value: '50.000+', label: 'Alumnos capacitados' },
  { value: '500+', label: 'Cursos disponibles' },
  { value: '150+', label: 'Empresas confían en nosotros' },
  { value: '98%', label: 'Satisfacción de alumnos' },
];

const Accreditations = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Accreditations */}
        <div className="bg-primary rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Respaldo y Calidad
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mt-2">
              Nuestras Acreditaciones
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accreditations.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.title}
                  className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-primary-foreground/15 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/70">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accreditations;
