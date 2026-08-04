import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import OpenCourseRequestForm from '@/components/OpenCourseRequestForm';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { useSearchParams } from 'react-router-dom';

const OpenCourseForm = () => {
  const { locale } = useLocalizedPath();
  // ?fecha=<id> llega desde el carrusel de cursos abiertos y preselecciona esa sesión.
  const [searchParams] = useSearchParams();
  const fechaId = searchParams.get('fecha') ?? undefined;

  const content = {
    es: {
      title: 'Cursos Abiertos',
      subtitle: 'Inscríbete',
      breadcrumb: 'Cursos Abiertos',
    },
    en: {
      title: 'Open Courses',
      subtitle: 'Sign up',
      breadcrumb: 'Open Courses',
    },
    pt: {
      title: 'Cursos Abertos',
      subtitle: 'Inscreva-se',
      breadcrumb: 'Cursos Abertos',
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

        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            <div className="max-w-xl mx-auto rounded-2xl shadow-2xl bg-white p-8">
              {/* defaultModalidad (no fixed): la oferta incluye presenciales y online */}
              <OpenCourseRequestForm
                fixedCiudadNombre="Calama"
                fixedTipoContactado="1"
                defaultModalidad="1"
                preselectedCalendarizacionId={fechaId}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OpenCourseForm;
