import { Link, useParams } from 'react-router-dom';
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import Pendiente from '@/components/Pendiente';
import NotFound from '@/pages/NotFound';
import { CURSOS_MAS_DEMANDADOS, cursoAreas, getCursoSeo, type CursoSeo } from '@/data/cursos-seo';
import { COBERTURA_VIRTUAL, getSedeBySlug, getSedeMapsUrl, getSedeSeoMeta, sedes } from '@/data/sedes';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const masDemandados = CURSOS_MAS_DEMANDADOS
  .map((slug) => getCursoSeo(slug))
  .filter((curso): curso is CursoSeo => curso !== null);

/** Página de una sede física (/sedes/:sede) con el NAP de src/data/sedes.ts. */
const SedeDetail = () => {
  const { sede: sedeSlug } = useParams<{ sede: string }>();
  const { localizedPath, locale } = useLocalizedPath();
  const sede = getSedeBySlug(sedeSlug);

  if (!sede) {
    return <NotFound />;
  }

  const title = `INSECAP ${sede.ciudad}`;
  const respuesta = `${sede.nombre} de INSECAP está en ${sede.direccion}, ${sede.ciudad}, ${sede.region}.${sede.casaMatriz ? ' Es la casa matriz de INSECAP.' : ''} INSECAP es una OTEC chilena acreditada por SENCE (Resolución N° 12208) y por Codelco, que capacita en seguridad, cumplimiento normativo y continuidad operacional, sobre todo para la gran minería. Teléfono ${sede.telefono}.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO {...getSedeSeoMeta(sede)} url={`/sedes/${sede.slug}`} />
      <Header />

      <main className="pb-16" lang={locale === 'es' ? undefined : 'es'}>
        <PageHero
          title={title}
          subtitle={sede.nombre}
          breadcrumbs={[{ label: 'Sedes' }, { label: sede.ciudad }]}
        />

        <div className="container mx-auto mt-12 grid grid-cols-1 gap-10 px-8 md:px-14 lg:grid-cols-3 lg:px-16">
          <div className="space-y-10 lg:col-span-2">
            <p className="text-lg leading-relaxed text-foreground">{respuesta}</p>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Cursos más demandados de INSECAP</h2>
              <p className="mb-4 text-sm">
                {/* TODO: qué cursos se dictan en cada sede (sección 4, punto 1). */}
                <Pendiente campo="cursos-sede">Cursos que se dictan en esta sede por confirmar.</Pendiente>
              </p>
              <ul className="grid gap-3 md:grid-cols-2">
                {masDemandados.map((curso) => (
                  <li key={curso.slug}>
                    <Link
                      to={localizedPath(`/cursos/${curso.slug}`)}
                      className="block rounded-xl border border-border bg-card p-4 font-semibold text-foreground transition-colors hover:border-insecap-blue hover:text-insecap-blue"
                    >
                      Curso de {curso.tema.tema}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Áreas de capacitación</h2>
              <ul className="flex flex-wrap gap-2">
                {cursoAreas.map((area) => (
                  <li key={area.slug}>
                    <Link
                      to={localizedPath(`/cursos/categoria/${area.slug}`)}
                      className="block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-insecap-blue hover:text-insecap-blue"
                    >
                      {area.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Los cursos e-learning sincrónicos y asincrónicos tienen cobertura {COBERTURA_VIRTUAL}.
              </p>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold text-foreground">Datos de contacto</h2>
              <address className="space-y-3 text-sm not-italic text-foreground">
                <p className="font-semibold">INSECAP {sede.nombre}</p>
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-insecap-blue" aria-hidden="true" />
                  <span>{sede.direccion}, {sede.ciudad}, {sede.region}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-insecap-blue" aria-hidden="true" />
                  <a href={`tel:${sede.telefonoE164}`} className="hover:underline">{sede.telefono}</a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-insecap-blue" aria-hidden="true" />
                  <a href={`mailto:${sede.email}`} className="hover:underline">{sede.email}</a>
                </p>
                <p className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-insecap-blue" aria-hidden="true" />
                  <span>Horario: {sede.horario ?? <Pendiente campo="horario" />}</span>
                </p>
              </address>
              <a
                href={getSedeMapsUrl(sede)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-insecap-blue hover:underline"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Cómo llegar a la sede de {sede.ciudad} (Google Maps)
              </a>
            </section>

            <nav aria-label="Otras sedes" className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold text-foreground">Otras sedes</h2>
              <ul className="space-y-2">
                {sedes
                  .filter((otra) => otra.slug !== sede.slug)
                  .map((otra) => (
                    <li key={otra.slug}>
                      <Link to={localizedPath(`/sedes/${otra.slug}`)} className="text-sm text-foreground hover:text-insecap-blue">
                        {otra.nombre}: {otra.direccion}, {otra.ciudad}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SedeDetail;
