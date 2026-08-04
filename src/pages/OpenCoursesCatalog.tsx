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
const MES = "Agosto 2026";
const FORM_HREF = "/formulario/cursos-abiertos";

const CURSOS = [
  {
    titulo: "Trabajo en Altura Física",
    imagen:
      "https://storageisecap.sfo2.digitaloceanspaces.com/noticias/f7ae80b8-69c6-4cd3-b60e-22c98c401da9.jpeg",
    modalidad: "Presencial",
    sede: "Calama · La Cascada 1513",
    // id = calendarización del TMS; preselecciona la fecha en el formulario
    sesiones: [
      { id: "456", label: "03-08-2026 al 04-08-2026" },
      { id: "457", label: "10-08-2026 al 11-08-2026" },
      { id: "458", label: "17-08-2026 al 18-08-2026" },
      { id: "459", label: "24-08-2026 al 24-08-2026" },
    ],
  },
  {
    titulo: "Técnicas de Aislación y Bloqueo",
    imagen:
      "https://storageisecap.sfo2.digitaloceanspaces.com/noticias/f7834dae-418d-40fb-bff5-fc60720f0db1.jpeg",
    modalidad: "Presencial",
    sede: "Calama · La Cascada 1513",
    sesiones: [
      { id: "460", label: "04-08-2026 al 04-08-2026" },
      { id: "461", label: "11-08-2026 al 11-08-2026" },
      { id: "462", label: "18-08-2026 al 18-08-2026" },
      { id: "463", label: "25-08-2026 al 25-08-2026" },
    ],
  },
  {
    titulo: "Espacios Confinados",
    imagen:
      "https://storageisecap.sfo2.digitaloceanspaces.com/noticias/0c86ecc5-7301-495c-a23e-cae1bf549914.jpeg",
    modalidad: "Presencial",
    sede: "Calama · La Cascada 1513",
    sesiones: [
      { id: "464", label: "06-08-2026 al 06-08-2026" },
      { id: "465", label: "13-08-2026 al 13-08-2026" },
      { id: "466", label: "20-08-2026 al 20-08-2026" },
      { id: "467", label: "27-08-2026 al 27-08-2026" },
    ],
  },
  {
    titulo: "SAP PM: Gestión de Mantenimiento",
    imagen:
      "https://storageisecap.sfo2.digitaloceanspaces.com/noticias/bc61442a-b46b-4d98-9bad-19da6d6aaeab.jpeg",
    modalidad: "Sincrónico",
    duracion: "24 horas",
    // Sin id: no tiene calendarización cargada, el formulario deja elegir el curso
    sesiones: [{ id: null, label: "28-08-2026" }],
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
    },
    en: {
      title: "Open Courses",
      subtitle: "Individual enrollment",
      breadcrumb: "Open Courses",
      intro:
        "Courses with scheduled dates and available seats. Enroll individually and certify your skills.",
      sessions: "Available dates",
      enroll: "Enroll",
    },
    pt: {
      title: "Cursos Abertos",
      subtitle: "Inscricao individual",
      breadcrumb: "Cursos Abertos",
      intro:
        "Cursos com datas programadas e vagas disponiveis. Inscreva-se individualmente e certifique suas competencias.",
      sessions: "Datas disponiveis",
      enroll: "Inscrever-se",
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
                      {content.sessions}
                    </p>

                    <ul className="flex flex-col gap-2">
                      {curso.sesiones.map((sesion) => (
                        <li key={sesion.label}>
                          <Link
                            to={`${localizedPath(FORM_HREF)}${sesion.id ? `?fecha=${sesion.id}` : ""}`}
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
