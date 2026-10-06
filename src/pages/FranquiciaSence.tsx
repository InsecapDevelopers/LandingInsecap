import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import Pendiente from '@/components/Pendiente';
import { useLocalizedPath } from '@/hooks/use-localized-path';

/**
 * Franquicia tributaria SENCE (/franquicia-sence). Solo estructura: el contenido de cada sección
 * lo valida INSECAP. TODO: contenido validado de franquicia SENCE (sección 4, punto 6). Mientras
 * tanto la ruta sale con noindex (seo-routes.ts).
 */
const SECCIONES = [
  { titulo: '¿Qué es la franquicia tributaria SENCE?', campo: 'sence-que-es' },
  { titulo: '¿Qué empresas pueden usarla?', campo: 'sence-quien' },
  { titulo: '¿Cómo se usa la franquicia con INSECAP?', campo: 'sence-pasos' },
  { titulo: '¿Qué cursos tienen código SENCE?', campo: 'sence-cursos' },
];

const FranquiciaSence = () => {
  const { localizedPath, locale } = useLocalizedPath();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Franquicia tributaria SENCE"
        description="Capacitación con franquicia tributaria SENCE en INSECAP, OTEC acreditada por SENCE (Resolución N° 12208) y certificada en NCh 2728:2015."
        url="/franquicia-sence"
      />
      <Header />

      <main className="pb-16" lang={locale === 'es' ? undefined : 'es'}>
        <PageHero
          title="Franquicia tributaria SENCE"
          subtitle="Capacitación para empresas"
          breadcrumbs={[{ label: 'Franquicia SENCE' }]}
        />

        <div className="container mx-auto mt-12 max-w-4xl space-y-10 px-8 md:px-14 lg:px-16">
          <p className="text-lg leading-relaxed text-foreground">
            INSECAP es un Organismo Técnico de Capacitación (OTEC) acreditado por SENCE con la Resolución N° 12208
            y certificado en NCh 2728:2015, la norma chilena para OTEC. La franquicia tributaria se rige por la
            Ley 19.518, Estatuto de Capacitación y Empleo.
          </p>

          {SECCIONES.map((seccion) => (
            <section key={seccion.campo}>
              <h2 className="mb-3 text-2xl font-bold text-foreground">{seccion.titulo}</h2>
              <p><Pendiente campo={seccion.campo}>Contenido por validar con INSECAP.</Pendiente></p>
            </section>
          ))}

          <section className="rounded-2xl border border-border bg-muted/30 p-6">
            <h2 className="mb-3 text-xl font-bold text-foreground">Siguientes pasos</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-insecap-blue">
              <li><Link to={localizedPath('/cursos')} className="hover:underline">Ver el catálogo de cursos</Link></li>
              <li><Link to={localizedPath('/preguntas-frecuentes')} className="hover:underline">Preguntas frecuentes</Link></li>
              <li><Link to={localizedPath('/contacto')} className="hover:underline">Contactar a INSECAP</Link></li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FranquiciaSence;
