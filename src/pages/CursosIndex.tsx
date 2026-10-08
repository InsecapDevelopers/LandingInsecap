import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Mail, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import { ClientTypeSwitch } from '@/components/ClientTypeSwitch';
import { Button } from '@/components/ui/button';
import { CursoCard, areaIcon } from '@/components/CursoCard';
import { cursoAreas, cursosSeo, getCursosByArea, listarNombres } from '@/data/cursos-seo';
import { sedes } from '@/data/sedes';
import { SAP_HREF } from '@/lib/sapCatalog';
import { useLocalizedPath } from '@/hooks/use-localized-path';

/**
 * Índice de los 61 temas del catálogo para empresas (/cursos), agrupados por área.
 * Patrón de directorio a lo ancho: en escritorio, buscador y áreas fijos a la izquierda y tarjetas con foto
 * por área a la derecha; en móvil, apilado. Cierra con CTA de cotización.
 * Todo el listado sale en el HTML prerenderizado; el buscador solo filtra después de hidratar
 * (sin JS se ve el catálogo completo).
 */

/** Minúsculas y sin tildes, para que "grua" encuentre "Grúa". */
const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const CursosIndex = () => {
  const { localizedPath, locale } = useLocalizedPath();
  const ciudades = listarNombres(sedes.map((sede) => sede.ciudad));
  const [query, setQuery] = useState('');
  const q = normalizar(query.trim());

  const areas = useMemo(
    () =>
      cursoAreas
        .map((area) => ({ ...area, cursos: getCursosByArea(area.slug), Icon: areaIcon(area.nombre) }))
        // Las áreas con más cursos primero (Seguridad y Operación de Equipos son las más demandadas).
        .sort((a, b) => b.cursos.length - a.cursos.length),
    [],
  );
  const coincide = (texto: string) => !q || normalizar(texto).includes(q);
  const visibles = q ? areas.reduce((total, area) => total + area.cursos.filter((c) => coincide(c.tema.tema)).length, 0) : cursosSeo.length;

  return (
    <div className="min-h-screen bg-background">
      <SEO url="/cursos" seoParams={{ cursos: cursosSeo.length, areas: cursoAreas.length }} />
      <Header />

      <main className="pb-20" lang={locale === 'es' ? undefined : 'es'}>
        {/* Párrafo de respuesta (GEO, 40–60 palabras con entidades explícitas) como subtítulo del hero. */}
        <PageHero
          title="Cursos de capacitación para empresas"
          subtitle="Catálogo INSECAP"
          description={`INSECAP es una OTEC chilena acreditada por SENCE (Resolución N° 12208), certificada en NCh 2728:2015 e ISO 9001:2015 y acreditada por Codelco. Su catálogo para empresas reúne ${cursosSeo.length} cursos en ${cursoAreas.length} áreas, en modalidad presencial, e-learning sincrónico y e-learning asincrónico, con sedes en ${ciudades}.`}
          breadcrumbs={[{ label: 'Cursos' }]}
        />

        <ClientTypeSwitch activeMode="empresa" />

        {/* Mismo contenedor que PageHero y ClientTypeSwitch: el borde izquierdo queda alineado con el título. */}
        <div className="container mx-auto mt-6 px-8 md:px-14 lg:px-16">
          {/* Escritorio: buscador y áreas en una columna fija a la izquierda; el listado ocupa el resto. */}
          <div className="mt-4 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 xl:gap-14">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              {/* Buscador: acción principal del directorio */}
              <div role="search">
                <label htmlFor="buscar-curso" className="mb-2 block text-sm font-semibold text-foreground">
                  Busca un curso
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="buscar-curso"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Ej.: altura, grúa horquilla, LOTO"
                    autoComplete="off"
                    className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-base text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground focus-visible:border-insecap-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-insecap-blue/20"
                  />
                </div>
                <p aria-live="polite" className="mt-2 text-sm text-muted-foreground">
                  {q ? `${visibles} ${visibles === 1 ? 'curso coincide' : 'cursos coinciden'} con “${query.trim()}”` : `${cursosSeo.length} cursos en ${cursoAreas.length} áreas`}
                </p>
              </div>

              {/* Áreas: atajos a cada sección; el conteo sigue a la búsqueda */}
              <nav aria-label="Áreas de capacitación" className="mt-6">
                <p className="mb-2 hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:block">Áreas</p>
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1 lg:gap-1">
                  {areas.map(({ slug, nombre, cursos, Icon }) => {
                    const total = cursos.filter((curso) => coincide(curso.tema.tema)).length;
                    return (
                      <li key={slug} hidden={total === 0}>
                        <a
                          href={`#area-${slug}`}
                          className="group flex h-full min-h-11 items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 text-sm transition-colors hover:border-insecap-blue/40 hover:bg-insecap-blue/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-insecap-blue/20 lg:border-transparent lg:bg-transparent"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-insecap-cyan-ink" aria-hidden="true" />
                          <span className="min-w-0 flex-1 font-medium leading-snug text-foreground group-hover:text-insecap-blue">{nombre}</span>
                          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground">
                            {total}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {/* Listado por área */}
            <div className="mt-12 space-y-14 lg:mt-0">
              {areas.map(({ slug, nombre, cursos, Icon }) => {
                const filtrados = cursos.filter((curso) => coincide(curso.tema.tema));
                return (
                  <section key={slug} id={`area-${slug}`} aria-labelledby={`titulo-${slug}`} hidden={filtrados.length === 0} className="scroll-mt-28">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                      <h2 id={`titulo-${slug}`} className="flex items-center gap-3 text-xl font-bold text-foreground sm:text-2xl">
                        <Icon className="h-6 w-6 text-insecap-cyan-ink" aria-hidden="true" />
                        {nombre}
                      </h2>
                      <Link
                        to={localizedPath(`/cursos/categoria/${slug}`)}
                        className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-insecap-blue hover:underline"
                      >
                        Ver área completa <span className="sr-only">de {nombre}</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {cursos.map((curso) => (
                        <li key={curso.slug} hidden={!coincide(curso.tema.tema)}>
                          <CursoCard curso={curso} />
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}

              {q && visibles === 0 && (
                <div className="max-w-xl rounded-2xl border border-dashed border-border p-8">
                  <p className="font-semibold text-foreground">No encontramos cursos con “{query.trim()}”.</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Prueba con otra palabra o cuéntanos qué necesitas: diseñamos cursos a la medida de tu operación.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setQuery('')}>
                    Ver todos los cursos
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* CTA final */}
          <section
            aria-labelledby="cta-cursos"
            className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-br from-insecap-blue to-[#233076] p-8 text-white shadow-lg md:p-12"
          >
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <h2 id="cta-cursos" className="text-2xl font-bold sm:text-3xl">
                  ¿No ves el curso que necesitas?
                </h2>
                <p className="mt-3 max-w-xl leading-relaxed text-white/90">
                  Diseñamos capacitación cerrada a la medida de tu operación, con franquicia SENCE y en la modalidad que
                  elijas.
                </p>
                <Button asChild size="lg" className="mt-6 bg-white text-insecap-blue hover:bg-white/90">
                  <Link to={`${localizedPath('/contacto')}?origen=cursos`}>
                    <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                    Solicitar cotización
                  </Link>
                </Button>
              </div>
              <ul className="space-y-1 text-sm font-semibold">
                {[
                  { to: '/cursos-abiertos', label: 'Cursos abiertos con fecha' },
                  { to: SAP_HREF, label: 'Especialidad SAP S/4HANA PM' },
                  { to: '/franquicia-sence', label: 'Cómo usar la franquicia SENCE' },
                  { to: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={localizedPath(to)}
                      className="flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {label}
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CursosIndex;
