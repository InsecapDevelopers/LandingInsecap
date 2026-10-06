import { Phone, Mail, MapPin } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { CONTACT_EMAIL, sedes } from '@/data/sedes';

// El formulario va al pie de todas las páginas: en su propio chunk (Fase 6), fuera de la carga inicial.
// El prerender lo deja en el HTML; en el cliente hidrata cuando llega el chunk.
const OpenCourseRequestForm = lazy(() => import('@/components/OpenCourseRequestForm'));

const ContactCTA = () => {
  const { t } = useTranslation();

  return (
    <section id="contacto" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-muted">
        <div className="absolute inset-0 opacity-5">
        </div>
      </div>

      <div className="container mx-auto px-8 md:px-14 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <span className="text-insecap-cyan-ink font-medium text-sm uppercase tracking-wider">
              {t('contactCTA.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              {t('contactCTA.title')}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {t('contactCTA.description')}
            </p>

            {/* Contact Info: NAP único desde src/data/sedes.ts */}
            <address className="space-y-4 not-italic">

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-secondary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground leading-none mb-1">{t('contactCTA.email')}</p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-foreground hover:text-insecap-cyan-ink transition-colors leading-none">{CONTACT_EMAIL}</a>
                </div>
              </div>

              {sedes.map((sede) => (
                <div key={sede.slug} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-secondary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t(`contactCTA.branches.${sede.slug}`)}</p>
                    <p className="text-sm text-muted-foreground">{sede.direccion}, {sede.ciudad}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
                      <a href={`tel:${sede.telefonoE164}`} className="text-sm text-muted-foreground hover:text-insecap-cyan-ink transition-colors">{sede.telefono}</a>
                    </div>
                  </div>
                </div>
              ))}
            </address>
          </div>

          {/* Form */}
          <div className="w-full bg-white/5 py-12 border-b border-primary-foreground/10">
            <div className="container mx-auto px-8 md:px-14 lg:px-16 text-center">
              <h3 className="font-bold text-2xl mb-8 text-insecap-cyan-ink">{t('contactCTA.stayInTouch')}</h3>
              <div className="max-w-xl mx-auto rounded-2xl shadow-2xl bg-white p-8 text-left">
                <Suspense fallback={null}>
                  <OpenCourseRequestForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
