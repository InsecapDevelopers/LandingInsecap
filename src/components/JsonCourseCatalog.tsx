import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, Search, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  JsonCatalogTopic,
  getJsonCatalogCategories,
  getJsonCatalogTopics,
  semanticSearchJsonTopics,
} from '@/lib/catalogData';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import {
  fetchCatalogProductSummaries,
  ShopifyCatalogProductSummary,
} from '@/lib/shopify';

const TOPICS_PER_PAGE = 12;

const JsonCourseCard = ({
  topic,
  productSummary,
}: {
  topic: JsonCatalogTopic;
  productSummary?: ShopifyCatalogProductSummary;
}) => {
  const { localizedPath } = useLocalizedPath();
  const heroImage = productSummary?.image;

  return (
    <Card className="flex h-full flex-col overflow-hidden border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-insecap-blue to-insecap-cyan">
        {heroImage ? (
          <img
            src={heroImage.url}
            alt={heroImage.altText || topic.tema}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-900/10 text-white/80">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-3">
          <Badge className="w-fit border-0 bg-insecap-blue/10 text-insecap-blue">
            {topic.categoria}
          </Badge>

          <h3 className="min-h-[3.5rem] text-xl font-bold leading-tight text-foreground">
            {topic.tema}
          </h3>
        </div>

        <div className="mt-auto">
          <Link to={localizedPath(`/curso/${topic.handle}`)}>
            <Button className="w-full bg-insecap-blue hover:bg-insecap-blue/90 text-white">
              Ver detalle
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const JsonCourseCatalog = () => {
  const { locale } = useLocalizedPath();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productSummaries, setProductSummaries] = useState<
    Record<string, ShopifyCatalogProductSummary>
  >({});

  const content = {
    es: {
      title: 'Catálogo de Cursos Técnicos',
      subtitle: 'Temas agrupados para cotización rápida',
      intro:
        'Explora por categoría y entra al detalle para revisar modalidades, horas y estándares disponibles.',
      search: 'Buscar por tema (ej: grua, altura, electricidad...)',
      allCategories: 'Todas las categorías',
      noResults: 'No hay temas que coincidan con tus filtros.',
    },
    en: {
      title: 'Technical Course Catalog',
      subtitle: 'Grouped topics for faster quoting',
      intro:
        'Browse by category and open each detail page to review available modalities, hours, and standards.',
      search: 'Search by topic (e.g. crane, heights, electricity...)',
      allCategories: 'All categories',
      noResults: 'No topics match your filters.',
    },
    pt: {
      title: 'Catálogo de Cursos Técnicos',
      subtitle: 'Temas agrupados para cotação rápida',
      intro:
        'Explore por categoria e entre no detalhe para revisar modalidades, horas e padrões disponíveis.',
      search: 'Buscar por tema (ex: guindaste, altura, eletricidade...)',
      allCategories: 'Todas as categorias',
      noResults: 'Nenhum tema corresponde aos filtros.',
    },
  }[locale];

  const allTopics = useMemo(() => getJsonCatalogTopics(), []);
  const categories = useMemo(() => getJsonCatalogCategories(), []);

  const filteredByCategory = useMemo(() => {
    if (!selectedCategory) {
      return allTopics;
    }
    return allTopics.filter((topic) => topic.categoria === selectedCategory);
  }, [allTopics, selectedCategory]);

  const semanticResults = useMemo(
    () => semanticSearchJsonTopics(filteredByCategory, searchTerm),
    [filteredByCategory, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(semanticResults.length / TOPICS_PER_PAGE));

  const paginatedTopics = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * TOPICS_PER_PAGE;
    return semanticResults.slice(start, start + TOPICS_PER_PAGE);
  }, [semanticResults, currentPage, totalPages]);

  useEffect(() => {
    let cancelled = false;

    const loadProductSummaries = async () => {
      const handles = paginatedTopics.map((topic) => topic.handle);

      if (handles.length === 0) {
        return;
      }

      try {
        const summaries = await fetchCatalogProductSummaries(handles);
        if (!cancelled) {
          setProductSummaries((current) => ({ ...current, ...summaries }));
        }
      } catch (error) {
        console.error('Error fetching catalog product summaries:', error);
      }
    };

    loadProductSummaries();

    return () => {
      cancelled = true;
    };
  }, [paginatedTopics]);

  const resetPagination = () => setCurrentPage(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: 'Cursos' }]}
        />

        <div className="container mx-auto px-8 md:px-14 lg:px-16 mt-12">
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{content.intro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  resetPagination();
                }}
                placeholder={content.search}
                className="h-10 w-full rounded-md border border-border bg-card pl-10 pr-3 text-sm"
              />
            </label>

            <label className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  resetPagination();
                }}
                className="h-10 w-full rounded-md border border-border bg-card pl-10 pr-3 text-sm"
              >
                <option value="">{content.allCategories}</option>
                {categories.map((category) => (
                  <option key={category.label} value={category.label}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-6 text-sm text-muted-foreground">
            {semanticResults.length} temas encontrados
          </div>

          {semanticResults.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">{content.noResults}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTopics.map((topic) => (
                  <JsonCourseCard
                    key={topic.handle}
                    topic={topic}
                    productSummary={productSummaries[topic.handle]}
                  />
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Página {Math.min(currentPage, totalPages)} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JsonCourseCatalog;
