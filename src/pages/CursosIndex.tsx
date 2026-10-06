import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import { ClientTypeSwitch } from '@/components/ClientTypeSwitch';
import { cursoAreas, cursosSeo, getCursosByArea, getRangoHoras, listarNombres } from '@/data/cursos-seo';
import { sedes } from '@/data/sedes';
import { SAP_HREF } from '@/lib/sapCatalog';
import { useLocalizedPath } from '@/hooks/use-localized-path';

/**
 * Índice de los 61 temas del catálogo para empresas (/cursos), agrupados por área.
 * Reemplaza a CursosRedirect (que enviaba a /cursos-abiertos). Datos locales: sale completo en el
 * HTML prerenderizado.
 */
const CursosIndex = () => {
  const { localizedPath, locale } = useLocalizedPath();
  const ciudades = listarNombres(sedes.map((sede) => sede.ciudad));

  return (
    <div className="min-h-screen bg-background">
      <SEO url="/cursos" seoParams={{ cursos: cursosSeo.length, areas: cursoAreas.length }} />
      <Header />

      <main className="pb-16" lang={locale === 'es' ? undefined : 'es'}>
        <PageHero
          title="Cursos de capacitación para empresas"
          subtitle="Catálogo INSECAP"
          breadcrumbs={[{ label: 'Cursos' }]}
        />

        <ClientTypeSwitch activeMode="empresa" />

        <div className="container mx-auto mt-4 px-8 md:px-14 lg:px-16">
          <p className="mx-auto mb-10 max-w-3xl text-center text-lg leading-relaxed text-muted-foreground">
            INSECAP es una OTEC chilena acreditada por SENCE (Resolución N° 12208), certificada en NCh 2728:2015 e
            ISO 9001:2015 y acreditada por Codelco. Su catálogo para empresas reúne {cursosSeo.length} cursos en{' '}
            {cursoAreas.length} áreas, en modalidad presencial, e-learning sincrónico y e-learning asincrónico, con
            sedes en {ciudades}.
          </p>

          <nav aria-label="Áreas de capacitación" className="mb-12 flex flex-wrap justify-center gap-2">
            {cursoAreas.map((area) => (
              <Link
                key={area.slug}
                to={localizedPath(`/cursos/categoria/${area.slug}`)}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-insecap-blue hover:text-insecap-blue"
              >
                {area.nombre}
              </Link>
            ))}
          </nav>

          <div className="space-y-12">
            {cursoAreas.map((area) => (
              <section key={area.slug} aria-labelledby={`area-${area.slug}`}>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 id={`area-${area.slug}`} className="text-2xl font-bold text-foreground">
                    {area.nombre}
                  </h2>
                  <Link
                    to={localizedPath(`/cursos/categoria/${area.slug}`)}
                    className="flex items-center gap-1 text-sm font-semibold text-insecap-blue hover:underline"
                  >
                    Ver cursos de {area.nombre} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
                <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {getCursosByArea(area.slug).map((curso) => {
                    const rango = getRangoHoras(curso.tema);
                    return (
                      <li key={curso.slug}>
                        <Link
                          to={localizedPath(`/cursos/${curso.slug}`)}
                          className="flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-insecap-blue"
                        >
                          <span className="font-semibold text-foreground">{curso.tema.tema}</span>
                          <span className="mt-1 text-sm text-muted-foreground">
                            {curso.tema.modalidades.join(' · ')}
                            {rango ? ` · ${rango}` : ''}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          <section className="mt-14 rounded-2xl border border-border bg-muted/30 p-6 md:p-8">
            <h2 className="mb-3 text-xl font-bold text-foreground">Otras formas de capacitarte con INSECAP</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-insecap-blue">
              <li><Link to={localizedPath('/cursos-abiertos')} className="hover:underline">Cursos abiertos con fecha</Link></li>
              <li><Link to={localizedPath(SAP_HREF)} className="hover:underline">Especialidad SAP S/4HANA PM</Link></li>
              <li><Link to={localizedPath('/franquicia-sence')} className="hover:underline">Franquicia SENCE</Link></li>
              <li><Link to={localizedPath('/preguntas-frecuentes')} className="hover:underline">Preguntas frecuentes</Link></li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CursosIndex;
