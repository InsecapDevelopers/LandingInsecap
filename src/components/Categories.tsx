import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  HardHat,
  Briefcase,
  Shield,
  Building2,
  Monitor,
  Truck,
  Heart,
  Users,
  Wrench,
  BookOpen,
  LayoutGrid,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { fetchCategories, ShopifyCategory } from '@/lib/shopify';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const iconMap: Record<string, LucideIcon> = {
  'Minería': HardHat,
  'Administración': Briefcase,
  'Seguridad': Shield,
  'Construcción': Building2,
  'Informática': Monitor,
  'Transporte': Truck,
  'Salud': Heart,
  'RRHH': Users,
  'Mantención': Wrench,
  'Mantenimiento': Wrench,
  'Educación': BookOpen,
};

const colorMap = [
  'bg-insecap-cyan/10 text-insecap-cyan',
  'bg-insecap-blue/10 text-insecap-blue',
  'bg-insecap-cyan/10 text-insecap-cyan',
];

const CategorySkeleton = () => (
  <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
    <Skeleton className="w-14 h-14 rounded-xl mb-4" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

const Categories = () => {
    const { t } = useTranslation();
    const { localizedPath } = useLocalizedPath();

  const [categories, setCategories] = useState<ShopifyCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        // Limit to top 10 categories to maintain grid aesthetics
        setCategories(data.slice(0, 10));
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Determine how many categories to display based on screen size
  const displayedCategories = isMobile ? categories.slice(0, 4) : categories;

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            {t('categories.badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            {t('categories.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('categories.description')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <CategorySkeleton key={i} />)
          ) : (
            displayedCategories.map((category, index) => {
              const Icon = iconMap[category.label] || LayoutGrid;
              const colorClass = colorMap[index % colorMap.length];

              return (
                <a
                  key={category.label}
                  href={`/cursos?tag=${encodeURIComponent(category.label)}`}
                  className="group bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in border border-border/50"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {category.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} {category.count === 1 ? t('categories.course') : t('categories.courses')}
                  </p>
                </a>
              );
            })
          )}
        </div>

        {/* "Ver más" button - shown only on mobile when there are more than 4 categories */}
        {!isLoading && isMobile && categories.length > 4 && (
          <div className="text-center mt-12">
            <Link to={localizedPath('/cursos')}>
              <Button size="lg" variant="outline" className="border-insecap-cyan text-insecap-cyan hover:bg-insecap-cyan hover:text-white">
                {t('categories.showMore')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;

