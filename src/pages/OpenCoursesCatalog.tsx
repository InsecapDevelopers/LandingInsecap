import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SEO from "@/components/SEO";
import { ClientTypeSwitch } from "@/components/ClientTypeSwitch";
import { useLocalizedPath } from "@/hooks/use-localized-path";

// ponytail: catálogo estático. La oferta de cursos abiertos cambia una vez al mes y se
// edita aquí; conectar a la API de calendarizaciones cuando exista el flujo real.
const MES = "Septiembre 2026";
const FORM_HREF = "/formulario/cursos-abiertos";

const CURSOS = [
  {
    titulo: "Trabajo en Altura Física",
    duracion: "8 horas",
    modalidad: "Presencial",
    sede: "Calama · La Cascada 1513",
    imagen:
      "https://storageisecap.sfo2.digitaloceanspaces.com/noticias/fd2e0110-4a81-4300-96b6-7182af43300a.jpeg",
    // ids negativos = sin calendarización en el TMS (CURSOS_SIN_CALENDARIZACION del formulario)
    sesiones: [
      { id: "-10", label: "01-09-2026" },
      { id: "-11", label: "08-09-2026" },
      { id: "-12", label: "22-09-2026" },
    ],
  },
  {
    titulo: "Técnicas de Aislación y Bloqueo",
    duracion: "5,54 horas",
    modalidad: "Presencial",
    sede: "Calama · La Cascada 1513",
    imagen:
      "https://storageisecap.sfo2.digitaloceanspaces.com/noticias/eca834f1-d559-4c72-9b1d-49e8539cb04c.jpeg",
    // ids negativos = sin calendarización en el TMS (CURSOS_SIN_CALENDARIZACION del formulario)
    sesiones: [
      { id: "-13", label: "03-09-2026" },
      { id: "-14", label: "10-09-2026" },
      { id: "-15", label: "24-09-2026" },
    ],
  },
  {
    titulo: "Espacios Confinados",
    duracion: "8 horas",
    modalidad: "Presencial",
    sede: "Calama · La Cascada 1513",
    imagen:
      "https://storageisecap.sfo2.digitaloceanspaces.com/noticias/27bda1db-b09b-4276-8435-a3b2b2989bf8.jpeg",
    // ids negativos = sin calendarización en el TMS (CURSOS_SIN_CALENDARIZACION del formulario)
    sesiones: [
      { id: "-16", label: "04-09-2026" },
      { id: "-17", label: "11-09-2026" },
      { id: "-18", label: "25-09-2026" },
    ],
  },
];

const OpenCoursesCatalog = () => {
  const { localizedPath, locale } = useLocalizedPath();

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
      subtitle: "Inscricao individual",
      breadcrumb: "Cursos Abertos",
      intro:
        "Cursos com datas programadas e vagas disponiveis. Inscreva-se individualmente e certifique suas competencias.",
      sessions: "Datas disponiveis",
      enroll: "Inscrever-se",
      monthFilter: "Mes da programacao",
    },
  }[locale];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={content.title}
        description={content.intro}
        url="/cursos-abiertos"
        type="website"
        keywords={[
          "cursos abiertos",
          "capacitación Calama",
          "cursos con fecha",
          "INSECAP",
        ]}
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

            {/* Mes de la programación vigente */}
            <div className="mt-10 mb-10 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-insecap-blue">
                {MES}
              </h2>
              <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-400" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
              {CURSOS.map((curso, i) => (
                <article
                  key={curso.titulo}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <img
                    src={curso.imagen}
                    alt={`Afiche del curso ${curso.titulo}, ${MES}, modalidad ${curso.modalidad}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="aspect-square w-full object-cover"
                  />

                  <div className="flex flex-col p-6">
                    <h3 className="text-lg font-bold text-foreground leading-snug">
                      {curso.titulo}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {curso.sede && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-insecap-blue" />
                          {curso.sede}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-insecap-blue" />
                        {curso.modalidad}
                      </span>
                      {curso.duracion && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-insecap-blue" />
                          {curso.duracion}
                        </span>
                      )}
                    </div>

                    <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {content.sessions} · {MES}
                    </p>

                    <ul className="flex flex-col gap-2">
                      {curso.sesiones.map((sesion) => (
                        <li key={sesion.label}>
                          <Link
                            to={`${localizedPath(FORM_HREF)}?fecha=${sesion.id}&modalidad=1`}
                            aria-label={`${content.enroll}: ${curso.titulo}, ${sesion.label}`}
                            className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium tabular-nums transition-all duration-150 hover:border-insecap-blue hover:text-insecap-blue active:scale-[0.98] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insecap-blue"
                          >
                            {sesion.label}
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
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OpenCoursesCatalog;
