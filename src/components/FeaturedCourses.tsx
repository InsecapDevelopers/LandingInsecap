import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { cursosSeo, type CursoSeo } from "@/data/cursos-seo";
import { CursoCard } from "@/components/CursoCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { ChevronRight } from "lucide-react";

/**
 * Cursos Destacados de la home: lista curada de temas del catálogo local (src/data/cursos.json),
 * con foto y enlace a su ficha. Al ser local sale completa en el HTML prerenderizado.
 *
 * TODO: lista curada definitiva de INSECAP (6 a 9 temas). Provisoria: cursos más demandados
 * del contexto de negocio que tienen tema propio en el catálogo.
 */
const FEATURED_TOPIC_HANDLES = [
  'trabajo-en-altura',
  'manejo-defensivo',
  'aislacion-bloqueo',
  'espacios-confinados',
  'andamios',
  'grua-horquilla',
  'izaje-cargas-suspendidas',
  'primeros-auxilios',
];

const featuredCursos: CursoSeo[] = FEATURED_TOPIC_HANDLES
  .map((handle) => cursosSeo.find((curso) => curso.tema.handle === handle))
  .filter((curso): curso is CursoSeo => curso !== undefined);

export const FeaturedCourses = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();

  if (featuredCursos.length === 0) {
    return null;
  }

  return (
    <section id="cursos-destacados" className={`py-20 ${hideHeader ? 'py-0 bg-transparent' : 'bg-muted/30'}`}>
      <div className="container mx-auto px-8 sm:px-10 md:px-12 lg:px-4">
        {!hideHeader && (
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-insecap-blue/10 text-insecap-blue hover:bg-insecap-blue/20">
              {t('featuredCourses.badge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('featuredCourses.title')}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('featuredCourses.sectionDesc')}
            </p>
          </div>
        )}

        {/* Temas y categorías vienen del catálogo en español */}
        <ul lang="es" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCursos.map((curso) => (
            <li key={curso.slug}>
              <CursoCard curso={curso} label={t('featuredCourses.viewCourse')} />
            </li>
          ))}
        </ul>

        {!hideHeader && (
          <div className="text-center mt-12">
            <Link to={localizedPath('/cursos')}>
              <Button size="lg" variant="outline" className="border-insecap-blue text-insecap-blue hover:bg-insecap-blue hover:text-white">
                {t('featuredCourses.viewAll')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
