import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Mail, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import Pendiente from '@/components/Pendiente';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotFound from '@/pages/NotFound';
import {
  formatHoras,
  getEstandaresVisibles,
  getHorasPorModalidad,
  getRelatedCursos,
  getCursoSeo,
  getCursoSeoMeta,
} from '@/data/cursos-seo';
import { COBERTURA_VIRTUAL, sedes } from '@/data/sedes';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { resolveLegacyPath } from '@/lib/legacy-redirects';

const FichaRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <tr className="border-b border-border last:border-0">
    <th scope="row" className="w-1/3 py-3 pr-4 text-left align-top text-sm font-semibold text-foreground">
      {label}
    </th>
    <td className="py-3 text-sm text-muted-foreground">{children}</td>
  </tr>
);

/**
 * Ficha SEO de un tema del catálogo (/cursos/:slug), con la estructura de la Fase 2:
 * H1, respuesta, tabla, objetivo y aprendizajes, normativa, FAQ, CTA + relacionados + categoría
 * + sedes y "Última actualización". Datos locales (src/data/cursos-seo.ts): sale completa en el
 * HTML prerenderizado, sin esperar a Shopify.
 */
const CursoFicha = () => {
  const { slug } = useParams<{ slug: string }>();
  const { localizedPath, locale } = useLocalizedPath();
  const { pathname, search } = useLocation();
  const curso = getCursoSeo(slug);

  if (!curso) {
    // `cursos/ea-*`: en producción nginx ya respondió 301 a la categoría (dist/redirects.map).
    const legacy = resolveLegacyPath(pathname);
    return legacy ? <Navigate to={`${legacy}${search}`} replace /> : <NotFound />;
  }

  const { tema, area } = curso;
  const title = `Curso de ${tema.tema}`;
  const horasPorModalidad = getHorasPorModalidad(tema);
  const estandares = getEstandaresVisibles(tema);
  const tieneElearning = tema.modalidades.some((modalidad) => modalidad.toLowerCase().startsWith('e-learning'));
  const relacionados = getRelatedCursos(curso, 3);
  const quotePath = `${localizedPath('/contacto')}?origen=b2b&curso=${encodeURIComponent(tema.tema)}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO {...getCursoSeoMeta(curso)} url={`/cursos/${curso.slug}`} />
      <Header />

      {/* El contenido de datos solo existe en español (decisión 1.3). */}
      <main className="pb-16" lang={locale === 'es' ? undefined : 'es'}>
        <PageHero
          title={title}
          subtitle={area.nombre}
          breadcrumbs={[
            { label: 'Cursos', href: '/cursos' },
            { label: area.nombre, href: `/cursos/categoria/${area.slug}` },
            { label: tema.tema },
          ]}
        />

        <div className="container mx-auto mt-12 grid grid-cols-1 gap-8 px-8 md:px-14 lg:grid-cols-3 lg:px-16">
          <article className="space-y-10 lg:col-span-2">
            <section aria-label="Resumen del curso">
              {curso.respuesta ? (
                <p className="text-lg leading-relaxed text-foreground">{curso.respuesta}</p>
              ) : (
                <p className="text-lg leading-relaxed">
                  {/* TODO: párrafo de respuesta de 40–60 palabras (sección 4, punto 1). */}
                  <Pendiente campo="respuesta">Descripción del curso por confirmar con INSECAP.</Pendiente>
                </p>
              )}
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Ficha del curso</h2>
              <div className="overflow-x-auto rounded-xl border border-border bg-card px-5">
                <table className="w-full">
                  <tbody>
                    <FichaRow label="Horas">
                      <ul className="space-y-1">
                        {horasPorModalidad.map((item) => (
                          <li key={item.modalidad}>
                            {item.modalidad}: {formatHoras(item.horas)}
                          </li>
                        ))}
                      </ul>
                      {curso.horasPorVerificar && (
                        <p className="mt-2">
                          <Pendiente campo="horas">{curso.horasPorVerificar}</Pendiente>
                        </p>
                      )}
                    </FichaRow>
                    <FichaRow label="Modalidades">{tema.modalidades.join(', ')}</FichaRow>
                    <FichaRow label="Estándares">{estandares.length > 0 ? estandares.join(', ') : <Pendiente campo="estandares" />}</FichaRow>
                    <FichaRow label="Código SENCE">{curso.codigoSence ?? <Pendiente campo="codigo-sence" />}</FichaRow>
                    <FichaRow label="Requisitos de ingreso">{curso.requisitos ?? <Pendiente campo="requisitos" />}</FichaRow>
                    <FichaRow label="Certificado">{curso.certificado ?? <Pendiente campo="certificado" />}</FichaRow>
                    <FichaRow label="Vigencia">{curso.vigencia ?? <Pendiente campo="vigencia" />}</FichaRow>
                    <FichaRow label="Sedes">
                      {curso.sedes ? (
                        curso.sedes.join(', ')
                      ) : (
                        <>
                          <Pendiente campo="sedes">Sedes presenciales por confirmar.</Pendiente>
                          {tieneElearning && <> E-learning con cobertura {COBERTURA_VIRTUAL}.</>}
                        </>
                      )}
                    </FichaRow>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Objetivo y aprendizajes</h2>
              {curso.objetivo ? (
                <p className="leading-relaxed text-muted-foreground">{curso.objetivo}</p>
              ) : (
                <p><Pendiente campo="objetivo">Objetivo general por confirmar.</Pendiente></p>
              )}
              {curso.aprendizajes ? (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-muted-foreground">
                  {curso.aprendizajes.map((aprendizaje) => <li key={aprendizaje}>{aprendizaje}</li>)}
                </ul>
              ) : (
                <p className="mt-2"><Pendiente campo="aprendizajes">Aprendizajes esperados por confirmar.</Pendiente></p>
              )}
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Normativa de referencia</h2>
              {curso.normativa ? (
                <>
                  <p className="mb-3 text-sm text-muted-foreground">Marco legal chileno general de la materia.</p>
                  <ul className="space-y-2">
                    {curso.normativa.map((norma) => (
                      <li key={norma.nombre} className="text-muted-foreground">
                        <strong className="text-foreground">{norma.nombre}:</strong> {norma.descripcion}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm"><Pendiente campo="normativa">Normativa específica del curso por confirmar.</Pendiente></p>
                </>
              ) : (
                <p><Pendiente campo="normativa">Normativa aplicable por confirmar.</Pendiente></p>
              )}
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Preguntas frecuentes</h2>
              <div className="space-y-5">
                {curso.faq.map((item) => (
                  <div key={item.pregunta}>
                    <h3 className="font-semibold text-foreground">{item.pregunta}</h3>
                    <p className="mt-1 text-muted-foreground">
                      {item.respuesta ?? <Pendiente campo="faq" />}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <p className="text-sm text-muted-foreground">
              Última actualización: <time dateTime={curso.ultimaActualizacion}>{curso.ultimaActualizacion}</time>
            </p>
          </article>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cotiza este curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Se cotiza según la modalidad, la carga horaria y el estándar que requiera tu empresa.
                </p>
                <Button asChild className="w-full bg-insecap-blue text-white hover:bg-insecap-blue/90">
                  <Link to={quotePath}>
                    <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                    Solicitar cotización
                  </Link>
                </Button>
                <p className="text-sm">
                  Área:{' '}
                  <Link to={localizedPath(`/cursos/categoria/${area.slug}`)} className="font-semibold text-insecap-blue hover:underline">
                    Cursos de {area.nombre}
                  </Link>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sedes INSECAP</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {sedes.map((sede) => (
                    <li key={sede.slug}>
                      <Link to={localizedPath(`/sedes/${sede.slug}`)} className="flex items-center gap-2 text-sm text-foreground hover:text-insecap-blue">
                        <MapPin className="h-4 w-4 shrink-0 text-insecap-blue" aria-hidden="true" />
                        {sede.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>

          {relacionados.length > 0 && (
            <section className="lg:col-span-3">
              <h2 className="mb-4 text-2xl font-bold text-foreground">Cursos relacionados</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {relacionados.map((relacionado) => (
                  <Link
                    key={relacionado.slug}
                    to={localizedPath(`/cursos/${relacionado.slug}`)}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-insecap-blue"
                  >
                    <span className="font-semibold text-foreground group-hover:text-insecap-blue">
                      Curso de {relacionado.tema.tema}
                    </span>
                    <span className="mt-2 text-sm text-muted-foreground">{relacionado.tema.modalidades.join(' · ')}</span>
                    <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold text-insecap-blue">
                      Ver ficha <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CursoFicha;
