import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { getJsonCatalogByHandle, type JsonCatalogTopic } from "@/lib/catalogData";
import { slugify } from "@/data/cursos-seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { Award, ChevronRight, Monitor } from "lucide-react";

/**
 * Cursos Destacados de la home: lista curada local de temas de shopify_thematic_intermediate.json
 * con enlace a su ficha B2B. Reemplaza al carrusel de productos Shopify (decisión 1.6), que
 * repetía cursos (Izaje x3) y mostraba "24 hrs" y "SENCE" fijos en todas las tarjetas.
 * Al ser local sale completa en el HTML prerenderizado, sin esperar a Shopify.
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

/** Slug de la ficha /cursos/:slug: el handle B2B de Shopify sin `curso-` (tema en slug, coincide en los 61 temas). */
const toCursoSlug = (topic: JsonCatalogTopic): string => slugify(topic.tema);

const featuredTopics: JsonCatalogTopic[] = Array.from(new Set(FEATURED_TOPIC_HANDLES))
  .map((handle) => getJsonCatalogByHandle(handle))
  .filter((topic): topic is JsonCatalogTopic => topic !== null);

const FeaturedTopicCard = ({ topic }: { topic: JsonCatalogTopic }) => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();

  return (
    <Link to={localizedPath(`/cursos/${toCursoSlug(topic)}`)} className="block h-full">
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card h-full flex flex-col">
        <div className="relative h-32 bg-gradient-to-br from-insecap-blue to-insecap-cyan overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <Award className="h-14 w-14 text-white/60" aria-hidden="true" />
          </div>
          <div className="absolute top-3 left-3">
            <Badge className="bg-insecap-blue text-white border-0">
              {topic.categoria}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-foreground mb-3 line-clamp-2 group-hover:text-insecap-blue transition-colors min-h-[3rem]">
            {topic.tema}
          </h3>

          {topic.modalidades.length > 0 && (
            <div className="flex items-start gap-1.5 text-sm text-muted-foreground mb-4 flex-1">
              <Monitor className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{topic.modalidades.join(' · ')}</span>
            </div>
          )}

          <span className="mt-auto pt-4 border-t border-border text-sm font-medium text-insecap-blue flex items-center gap-1 group-hover:gap-2 transition-all">
            {t('shopify.viewCourse')} <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
};

export const ShopifyProducts = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();

  if (featuredTopics.length === 0) {
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
              {t('shopify.sectionDesc')}
            </p>
          </div>
        )}

        {/* Temas y categorías vienen del catálogo en español */}
        <ul lang="es" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTopics.map((topic) => (
            <li key={topic.handle}>
              <FeaturedTopicCard topic={topic} />
            </li>
          ))}
        </ul>

        {!hideHeader && (
          <div className="text-center mt-12">
            <Link to={localizedPath('/cursos')}>
              <Button size="lg" variant="outline" className="border-insecap-blue text-insecap-blue hover:bg-insecap-blue hover:text-white">
                {t('shopify.viewAll')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopifyProducts;
