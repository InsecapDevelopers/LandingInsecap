import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import Pendiente from '@/components/Pendiente';
import { cursosSeo, getCursoSeo, getHorasPorModalidad, listarNombres } from '@/data/cursos-seo';
import { getCasaMatriz, sedes } from '@/data/sedes';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { buildFaqJsonLd } from '@/lib/jsonld';
import { SITE_URL } from '@/lib/locale-routing';

interface Pregunta {
  pregunta: string;
  respuesta: string;
  /** Lo que falta validar con INSECAP. TODO: respuestas validadas (sección 4, punto 6). */
  pendiente?: string;
  /**
   * Respuesta para el FAQPage cuando la pregunta tiene una parte pendiente pero lo confirmado ya la
   * responde (sin el texto "Por confirmar" ni datos dudosos). Sin este campo, una pregunta con
   * `pendiente` queda fuera del JSON-LD.
   */
  respuestaJsonLd?: string;
  enlace?: { href: string; label: string };
}

const trabajoEnAltura = getCursoSeo('trabajo-en-altura');
const horasAlturaTexto = (sinDudosas: boolean) => (trabajoEnAltura
  ? getHorasPorModalidad(trabajoEnAltura.tema)
    .map((item) => ({
      ...item,
      horas: sinDudosas
        ? item.horas.filter((h) => !trabajoEnAltura.horasDudosas.some((d) => d.modalidad === item.modalidad && d.horas === h))
        : item.horas,
    }))
    .filter((item) => item.horas.length > 0)
    .map((item) => `${item.modalidad.toLowerCase()}: ${item.horas.join(', ')} horas`)
  : []);
const respuestaAltura = (sinDudosas: boolean) =>
  `Depende de la modalidad y del estándar que requiera la empresa. Cargas disponibles en el catálogo de INSECAP: ${horasAlturaTexto(sinDudosas).join('; ')}.`;
const cursosCodelco = cursosSeo.filter((curso) => curso.tema.estandares.includes('Codelco'));
const respuestaCodelco = `INSECAP es OTEC acreditada por Codelco y ofrece ${cursosCodelco.length} cursos con versión de estándar Codelco, como ${listarNombres(cursosCodelco.slice(0, 4).map((curso) => curso.tema.tema))}.`;
const ciudades = listarNombres(sedes.map((sede) => sede.ciudad));

/** Las 6 preguntas del contexto de negocio, respondidas solo con datos del contexto y del catálogo. */
const PREGUNTAS: Pregunta[] = [
  {
    pregunta: '¿Qué es una OTEC?',
    respuesta:
      `OTEC significa Organismo Técnico de Capacitación. INSECAP es una OTEC chilena con casa matriz en ${getCasaMatriz().ciudad}, acreditada por SENCE (Resolución N° 12208), certificada en NCh 2728:2015 e ISO 9001:2015, acreditada por Codelco y con el sello del Consejo de Competencias Mineras (CCM). Es miembro de la Cámara de Comercio de Santiago (CCS) y de SICEP.`,
    enlace: { href: '/acreditaciones', label: 'Ver acreditaciones' },
  },
  {
    pregunta: '¿Cómo uso la franquicia SENCE?',
    respuesta: 'INSECAP es OTEC acreditada por SENCE con la Resolución N° 12208 vigente.',
    pendiente: 'Requisitos, pasos para usar la franquicia y cursos con código SENCE por confirmar.',
    enlace: { href: '/franquicia-sence', label: 'Franquicia SENCE' },
  },
  {
    pregunta: '¿Cuánto dura el curso de trabajo en altura?',
    respuesta: respuestaAltura(false),
    pendiente: trabajoEnAltura?.horasPorVerificar ?? undefined,
    // El FAQPage no lleva la combinación dudosa (150 h asincrónico, TODO en src/data/cursos-seo.ts).
    respuestaJsonLd: respuestaAltura(true),
    enlace: { href: '/cursos/trabajo-en-altura', label: 'Ficha del curso de Trabajo en Altura' },
  },
  {
    pregunta: '¿El certificado sirve para faena Codelco?',
    respuesta: respuestaCodelco,
    pendiente: 'Validez del certificado en cada faena por confirmar.',
    // Lo confirmado (acreditación Codelco y cursos con su estándar) ya responde; la validez por faena queda fuera.
    respuestaJsonLd: respuestaCodelco,
  },
  {
    pregunta: '¿Hacen cursos en terreno?',
    respuesta: `INSECAP realiza capacitación cerrada a la medida de cada empresa y tiene sedes en ${ciudades}.`,
    pendiente: 'Si los cursos se dictan en las instalaciones o faenas del cliente está por confirmar.',
    enlace: { href: '/contacto', label: 'Contactar a INSECAP' },
  },
  {
    pregunta: '¿Qué diferencia hay entre e-learning sincrónico y asincrónico?',
    respuesta: 'INSECAP dicta cursos en modalidad presencial, e-learning sincrónico, e-learning asincrónico y recertificación.',
    pendiente: 'Explicación de la diferencia entre ambas modalidades por confirmar.',
  },
];

/**
 * FAQPage (Fases 4 y 8): las preguntas sin parte pendiente y las que tienen `respuestaJsonLd` (solo
 * lo confirmado). Lo "Por confirmar" nunca va al JSON-LD.
 * TODO: sumar las demás cuando INSECAP valide sus respuestas (sección 4, punto 6).
 */
const faqJsonLd = buildFaqJsonLd(
  PREGUNTAS.map((item) => ({
    pregunta: item.pregunta,
    respuesta: item.respuestaJsonLd ?? item.respuesta,
    porVerificar: Boolean(item.pendiente) && !item.respuestaJsonLd,
  })),
  `${SITE_URL}/es/preguntas-frecuentes#faq`,
);

/** Preguntas frecuentes (/preguntas-frecuentes). */
const PreguntasFrecuentes = () => {
  const { localizedPath, locale } = useLocalizedPath();

  return (
    <div className="min-h-screen bg-background">
      <SEO url="/preguntas-frecuentes" jsonLd={[faqJsonLd]} />
      <Header />

      <main className="pb-16" lang={locale === 'es' ? undefined : 'es'}>
        <PageHero
          title="Preguntas frecuentes"
          subtitle="INSECAP responde"
          breadcrumbs={[{ label: 'Preguntas frecuentes' }]}
        />

        <div className="container mx-auto mt-12 max-w-4xl space-y-8 px-8 md:px-14 lg:px-16">
          {PREGUNTAS.map((item) => (
            <section key={item.pregunta} className="border-b border-border pb-8 last:border-0">
              <h2 className="mb-3 text-xl font-bold text-foreground">{item.pregunta}</h2>
              <p className="leading-relaxed text-muted-foreground">{item.respuesta}</p>
              {item.pendiente && (
                <p className="mt-2 text-sm"><Pendiente campo="faq">{item.pendiente}</Pendiente></p>
              )}
              {item.enlace && (
                <Link to={localizedPath(item.enlace.href)} className="mt-3 inline-block text-sm font-semibold text-insecap-blue hover:underline">
                  {item.enlace.label}
                </Link>
              )}
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PreguntasFrecuentes;
