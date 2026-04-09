import { useTranslation } from 'react-i18next';
import { Award, CheckCircle, Shield, FileCheck } from 'lucide-react';

const backingLogos = [
  { src: '/logos/CCS.png', alt: 'Cámara de Comercio de Santiago' },
  { src: '/logos/SICEP.png', alt: 'SICEP' },
  { src: '/logos/Sello Acreditado Codelco Color.png', alt: 'OTEC Acreditada por Codelco' },
  { src: '/logos/Sello CCM Color.png', alt: 'Consejo de Competencias Mineras' },
];

const Accreditations = () => {
  const { t } = useTranslation();

  const accreditations = [
    { icon: Award,       title: 'SENCE',    description: t('accreditations.items.sence') },
    { icon: Shield,      title: 'NCh 2728', description: t('accreditations.items.nch2728') },
    { icon: FileCheck,   title: 'ISO 9001', description: t('accreditations.items.iso9001') },
    { icon: CheckCircle, title: '+15 Años', description: t('accreditations.items.plus15years') },
  ];

  const stats = [
    { value: '53.432+', label: t('accreditations.stats.trainedStudents') },
    { value: '2.315+',  label: t('accreditations.stats.availableCourses') },
    { value: '150+',    label: t('accreditations.stats.trustedCompanies') },
    { value: '98%',     label: t('accreditations.stats.studentSatisfaction') },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
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
              {t('accreditations.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mt-2">
              {t('accreditations.title')}
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

          {/* Logos de respaldo */}
          <div className="mt-12 pt-10 border-t border-primary-foreground/15">
            <p className="text-center text-sm text-primary-foreground/60 uppercase tracking-wider mb-8">
              Experiencia y Respaldo
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {backingLogos.map((logo) => (
                <div key={logo.alt} className="flex items-center justify-center">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-16 md:h-20 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accreditations;
