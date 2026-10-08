import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useLocalizedPath } from '@/hooks/use-localized-path';

// Mismo chunk que el formulario del pie (ContactCTA). El prerender espera onAllReady, así que sale en el HTML.
const OpenCourseRequestForm = lazy(() => import('@/components/OpenCourseRequestForm'));

/**
 * /contacto: solo el formulario. Sedes, teléfonos y correo (NAP de src/data/sedes.ts) van en el
 * footer de esta misma página y en /sedes/:sede.
 */
const Contact = () => {
  const { locale } = useLocalizedPath();

  const content = {
    es: { title: 'Contacto', subtitle: 'Estamos a tu servicio', breadcrumb: 'Contacto' },
    en: { title: 'Contact', subtitle: 'We are here to help', breadcrumb: 'Contact' },
    pt: { title: 'Contato', subtitle: 'Estamos ao seu dispor', breadcrumb: 'Contato' },
  }[locale];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <SEO url="/contacto" />

      <main className="pb-20">
        <PageHero title={content.title} subtitle={content.subtitle} breadcrumbs={[{ label: content.breadcrumb }]} />

        <div className="container mx-auto -mt-8 px-8 md:px-14 lg:px-16 relative z-10">
          <div className="mx-auto max-w-2xl rounded-2xl bg-card p-6 shadow-xl md:p-10">
            <Suspense fallback={null}>
              <OpenCourseRequestForm />
            </Suspense>
          </div>
        </div>
      </main>

      {/* El formulario ya está arriba: el pie no lo repite. */}
      <Footer showContact={false} />
    </div>
  );
};

export default Contact;
