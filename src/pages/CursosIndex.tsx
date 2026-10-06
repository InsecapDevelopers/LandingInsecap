import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock,
  Cog,
  Factory,
  Mail,
  Monitor,
  Search,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import { ClientTypeSwitch } from '@/components/ClientTypeSwitch';
import { Button } from '@/components/ui/button';
import { cursoAreas, cursosSeo, getCursosByArea, getRangoHoras, listarNombres } from '@/data/cursos-seo';
import { sedes } from '@/data/sedes';
import { SAP_HREF } from '@/lib/sapCatalog';
import { useLocalizedPath } from '@/hooks/use-localized-path';

/**
 * Índice de los 61 temas del catálogo para empresas (/cursos), agrupados por área.
 * Patrón de directorio: buscador, áreas con ícono y conteo, listado por área y CTA de cotización.
 * Todo el listado sale en el HTML prerenderizado; el buscador solo filtra después de hidratar
 * (sin JS se ve el catálogo completo).
 */

const AREA_ICONS: Record<string, LucideIcon> = {
  'Seguridad y Prevención de Riesgos': ShieldCheck,
  'Operación de Equipos': Truck,
  'Electricidad y Electrónica': Zap,
  'Mecánica Industrial': Cog,
  'Procesos Industriales': Factory,
  'Técnicas Aplicadas': Wrench,
  'Técnicas de Habilidades Blandas': Users,
  'Computación e Informática': Monitor,
};

const ACREDITACIONES = ['SENCE · Res. N° 12208', 'NCh 2728:2015', 'ISO 9001:2015', 'Acreditada por Codelco'];

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
        .map((area) => ({ ...area, cursos: getCursosByArea(area.slug), Icon: AREA_ICONS[area.nombre] ?? BadgeCheck }))
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
        <PageHero title="Cursos de capacitación para empresas" subtitle="Catálogo INSECAP" breadcrumbs={[{ label: 'Cursos' }]} />

        <ClientTypeSwitch activeMode="empresa" />

        <div className="container mx-auto mt-6 max-w-6xl px-4 sm:px-8">
          {/* Respuesta directa + franja de confianza */}
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            INSECAP es una OTEC chilena acreditada por SENCE (Resolución N° 12208), certificada en NCh 2728:2015 e
            ISO 9001:2015 y acreditada por Codelco. Su catálogo para empresas reúne {cursosSeo.length} cursos en{' '}
            {cursoAreas.length} áreas, en modalidad presencial, e-learning sincrónico y e-learning asincrónico, con
            sedes en {ciudades}.
          </p>

          <ul aria-label="Acreditaciones" className="mt-6 flex flex-wrap justify-center gap-2">
            {ACREDITACIONES.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-insecap-blue/20 bg-insecap-blue/5 px-3 py-1.5 text-sm font-medium text-insecap-blue"
              >
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          {/* Buscador: acción principal del directorio */}
          <div role="search" className="mx-auto mt-10 max-w-2xl">
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
                placeholder="Ej.: trabajo en altura, grúa horquilla, LOTO"
                autoComplete="off"
                className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-base text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground focus-visible:border-insecap-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-insecap-blue/20"
              />
            </div>
            <p aria-live="polite" className="mt-2 text-sm text-muted-foreground">
              {q ? `${visibles} ${visibles === 1 ? 'curso coincide' : 'cursos coinciden'} con “${query.trim()}”` : `${cursosSeo.length} cursos en ${cursoAreas.length} áreas`}
            </p>
          </div>

          {/* Áreas: atajos a cada sección de la página */}
          {!q && (
            <nav aria-label="Áreas de capacitación" className="mt-10">
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {areas.map(({ slug, nombre, cursos, Icon }) => (
                  <li key={slug}>
                    <a
                      href={`#area-${slug}`}
                      className="group flex h-full flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:gap-3 transition-all duration-200 hover:border-insecap-blue/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-insecap-blue/20"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-insecap-blue/10 text-insecap-blue transition-colors group-hover:bg-insecap-blue group-hover:text-white">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-snug text-foreground">{nombre}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Listado por área */}
          <div className="mt-14 space-y-14">
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
                  <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {cursos.map((curso) => {
                      const rango = getRangoHoras(curso.tema);
                      return (
                        <li key={curso.slug} hidden={!coincide(curso.tema.tema)}>
                          <Link
                            to={localizedPath(`/cursos/${curso.slug}`)}
                            className="group flex h-full items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:border-insecap-blue/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-insecap-blue/20"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block font-semibold leading-snug text-foreground group-hover:text-insecap-blue">
                                {curso.tema.tema}
                              </span>
                              <span className="mt-2 flex flex-wrap items-center gap-1.5">
                                {curso.tema.modalidades.map((modalidad) => (
                                  <span key={modalidad} className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                    {modalidad}
                                  </span>
                                ))}
                                {rango && (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-insecap-cyan-ink">
                                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                    {rango}
                                  </span>
                                )}
                              </span>
                            </span>
                            <ChevronRight
                              className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-insecap-blue motion-reduce:transition-none"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>

          {q && visibles === 0 && (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="font-semibold text-foreground">No encontramos cursos con “{query.trim()}”.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prueba con otra palabra o cuéntanos qué necesitas: diseñamos cursos a la medida de tu operación.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setQuery('')}>
                Ver todos los cursos
              </Button>
            </div>
          )}

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
                  <Link to={`${localizedPath('/contacto')}?origen=b2b`}>
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
