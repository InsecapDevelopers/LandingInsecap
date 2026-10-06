import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import NotFound from '@/pages/NotFound';
import { cursoAreas, getCursoArea, getCursosByArea, getRangoHoras, listarNombres } from '@/data/cursos-seo';
import { useLocalizedPath } from '@/hooks/use-localized-path';

/** Cursos de un área del catálogo (/cursos/categoria/:area). Datos locales. */
const CursoCategoria = () => {
  const { area: areaSlug } = useParams<{ area: string }>();
  const { localizedPath, locale } = useLocalizedPath();
  const area = getCursoArea(areaSlug);

  if (!area) {
    return <NotFound />;
  }

  const cursos = getCursosByArea(area.slug);
  const modalidades = Array.from(new Set(cursos.flatMap((curso) => curso.tema.modalidades)))
    .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
    .map((modalidad) => modalidad.toLowerCase());
  const title = `Cursos de ${area.nombre}`;
  const intro = `INSECAP, OTEC acreditada por SENCE y por Codelco, ofrece ${cursos.length} cursos de ${area.nombre} para empresas, en modalidad ${listarNombres(modalidades)}. Cada curso se cotiza según la modalidad, la carga horaria y el estándar que requiera la empresa.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO title={title} description={intro} url={`/cursos/categoria/${area.slug}`} />
      <Header />

      <main className="pb-16" lang={locale === 'es' ? undefined : 'es'}>
        <PageHero
          title={title}
          subtitle="Catálogo INSECAP"
          breadcrumbs={[{ label: 'Cursos', href: '/cursos' }, { label: area.nombre }]}
        />

        <div className="container mx-auto mt-12 px-8 md:px-14 lg:px-16">
          <p className="mb-10 max-w-3xl text-lg leading-relaxed text-foreground">{intro}</p>

          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cursos.map((curso) => {
              const rango = getRangoHoras(curso.tema);
              return (
                <li key={curso.slug}>
                  <Link
                    to={localizedPath(`/cursos/${curso.slug}`)}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-insecap-blue"
                  >
                    <h2 className="text-lg font-semibold text-foreground group-hover:text-insecap-blue">
                      Curso de {curso.tema.tema}
                    </h2>
                    <span className="mt-2 text-sm text-muted-foreground">{curso.tema.modalidades.join(' · ')}</span>
                    {rango && <span className="text-sm text-muted-foreground">{rango}</span>}
                    <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold text-insecap-blue">
                      Ver ficha <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <nav aria-label="Otras áreas" className="mt-14">
            <h2 className="mb-4 text-xl font-bold text-foreground">Otras áreas de capacitación</h2>
            <ul className="flex flex-wrap gap-2">
              {cursoAreas
                .filter((otra) => otra.slug !== area.slug)
                .map((otra) => (
                  <li key={otra.slug}>
                    <Link
                      to={localizedPath(`/cursos/categoria/${otra.slug}`)}
                      className="block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-insecap-blue hover:text-insecap-blue"
                    >
                      {otra.nombre}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  to={localizedPath('/cursos')}
                  className="block rounded-full px-4 py-2 text-sm font-semibold text-insecap-blue hover:underline"
                >
                  Todos los cursos
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CursoCategoria;
