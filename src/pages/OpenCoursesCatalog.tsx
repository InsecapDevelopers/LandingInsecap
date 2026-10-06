import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowRight, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SEO from "@/components/SEO";
import { ClientTypeSwitch } from "@/components/ClientTypeSwitch";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "@/hooks/use-localized-path";
import { coursesForMonth, getUpcomingBatches, matchMonthParam } from "@/lib/openCourses";
import { localImage } from "@/lib/images";

const FORM_HREF = "/formulario/cursos-abiertos";

const OpenCoursesCatalog = () => {
  const { localizedPath, locale } = useLocalizedPath();
  const { t } = useTranslation();
  // Lo ya dictado se descarta solo: en octubre las fechas de septiembre no aparecen.
  const { courses, months } = useMemo(() => getUpcomingBatches(), []);
  // ?mes=octubre abre la página ya filtrada: sirve para enlazar una tanda desde una campaña.
  const [searchParams, setSearchParams] = useSearchParams();
  const mesDeLaUrl = matchMonthParam(searchParams.get("mes"), months);
  const [mes, setMes] = useState(mesDeLaUrl ?? months[0]);
  const cursos = coursesForMonth(mes ?? "", courses);

  const content = {
    es: {
      title: "Cursos Abiertos",
      subtitle: "Inscripción individual",
      breadcrumb: "Cursos Abiertos",
      intro:
        "Cursos con fechas programadas y cupos disponibles. Inscríbete de forma individual y certifica tus competencias.",
      sessions: "Fechas disponibles",
      enroll: "Inscribirse",
      monthFilter: "Mes de la programación",
    },
    en: {
      title: "Open Courses",
      subtitle: "Individual enrollment",
      breadcrumb: "Open Courses",
      intro:
        "Courses with scheduled dates and available seats. Enroll individually and certify your skills.",
      sessions: "Available dates",
      enroll: "Enroll",
      monthFilter: "Schedule month",
    },
    pt: {
      title: "Cursos Abertos",
      subtitle: "Inscrição individual",
      breadcrumb: "Cursos Abertos",
      intro:
        "Cursos com datas programadas e vagas disponíveis. Inscreva-se individualmente e certifique suas competências.",
      sessions: "Datas disponíveis",
      enroll: "Inscrever-se",
      monthFilter: "Mês da programação",
    },
  }[locale];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        url="/cursos-abiertos"
        type="website"
      />
      <Header />

      <main>
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: content.breadcrumb }]}
        />
        <ClientTypeSwitch activeMode="abiertos" />

        <section className="pb-16">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            <p className="max-w-2xl mx-auto text-center text-muted-foreground text-lg">
              {content.intro}
            </p>

            {/* Con varias tandas vigentes el mes se elige; con una sola es solo el título. */}
            {months.length > 1 ? (
              <div
                role="group"
                aria-label={content.monthFilter}
                className="mt-10 mb-10 flex justify-center gap-2"
              >
                {months.map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={mes === m}
                    onClick={() => {
                      setMes(m);
                      // La URL sigue al filtro: así el enlace se puede copiar y compartir.
                      setSearchParams(
                        { mes: m.split(" ")[0].toLowerCase() },
                        { replace: true },
                      );
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider border-2 transition-all duration-150 active:scale-95 motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insecap-blue focus-visible:ring-offset-2 ${
                      mes === m
                        ? "border-insecap-blue bg-insecap-blue text-white shadow-lg shadow-insecap-blue/30"
                        : "border-border bg-transparent text-muted-foreground hover:border-insecap-blue hover:text-insecap-blue"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-10 mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-insecap-blue">
                  {mes}
                </h2>
                <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-400" />
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
              {cursos.map((curso, i) => {
                // El modelo parte el título para que la home destaque la segunda mitad.
                const titulo = `${curso.title} ${curso.titleHighlight}`;
                return (
                <article
                  key={titulo}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <img
                    {...localImage(curso.image, [640, 1080], "(min-width: 1024px) 400px, (min-width: 768px) 50vw, calc(100vw - 4rem)")}
                    alt={t('openOffer.posterAltFull', { course: titulo, month: mes, modality: curso.modality })}
                    width={1080}
                    height={1080}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="aspect-square w-full object-cover"
                  />

                  <div className="flex flex-col p-6">
                    <h3 lang={locale === "es" ? undefined : "es"} className="text-lg font-bold text-foreground leading-snug">
                      {titulo}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {curso.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-insecap-blue" />
                          {curso.location}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-insecap-blue" />
                        {curso.modality}
                      </span>
                      {curso.duration && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-insecap-blue" />
                          {curso.duration}
                        </span>
                      )}
                    </div>

                    <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {content.sessions} · {mes}
                    </p>

                    <ul className="flex flex-col gap-2">
                      {curso.sessions.map((sesion) => (
                        <li key={sesion.id}>
                          <Link
                            to={`${localizedPath(FORM_HREF)}?fecha=${sesion.id}&modalidad=${curso.modalityId}`}
                            aria-label={sesion.city
                              ? t("openOffer.enrollInCity", { course: titulo, date: sesion.label, city: sesion.city })
                              : t("openOffer.enrollInDate", { course: titulo, date: sesion.label })}
                            className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium tabular-nums transition-all duration-150 hover:border-insecap-blue hover:text-insecap-blue active:scale-[0.98] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insecap-blue"
                          >
                            <span>
                              {sesion.label}
                              {sesion.city && (
                                <span className="ml-2 font-normal text-muted-foreground">{sesion.city}</span>
                              )}
                            </span>
                            <span className="flex items-center gap-1.5 shrink-0 text-insecap-blue font-semibold">
                              <span className="hidden lg:inline opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                {content.enroll}
                              </span>
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {curso.note && (
                      <p className="mt-4 flex gap-2 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                        <Info className="mt-0.5 w-4 h-4 shrink-0 text-insecap-blue" />
                        <span>{curso.note[locale]}</span>
                      </p>
                    )}
                  </div>
                </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OpenCoursesCatalog;
