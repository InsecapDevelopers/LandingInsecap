import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const OpenCourseForm = () => {
  const { locale } = useLocalizedPath();

  const content = {
    es: {
      title: 'Cursos Abiertos',
      subtitle: 'Inscríbete',
      breadcrumb: 'Cursos Abiertos',
      iframeTitle: 'Formulario de inscripción a cursos abiertos',
    },
    en: {
      title: 'Open Courses',
      subtitle: 'Sign up',
      breadcrumb: 'Open Courses',
      iframeTitle: 'Open course enrollment form',
    },
    pt: {
      title: 'Cursos Abertos',
      subtitle: 'Inscreva-se',
      breadcrumb: 'Cursos Abertos',
      iframeTitle: 'Formulario de inscricao em cursos abertos',
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
            <div className="max-w-xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white">
              <iframe
                src="https://tmsplus.insecap.cl/public/formulario/curso-abierto"
                className="w-full h-[1400px] border-none"
                title={content.iframeTitle}
                scrolling="auto"
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
