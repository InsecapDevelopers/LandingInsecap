import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ImageIcon, Search, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { ClientTypeSwitch } from '@/components/ClientTypeSwitch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  B2bCatalogTopic,
  getB2bCatalogCategoriesFromTopics,
  loadB2bCatalogTopics,
  semanticSearchB2bTopics,
} from '@/lib/b2bCatalogData';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const TOPICS_PER_PAGE = 12;

const B2bCourseCard = ({ topic }: { topic: B2bCatalogTopic }) => {
  const { localizedPath } = useLocalizedPath();

  return (
    <Card className="flex h-full flex-col overflow-hidden border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700">
        {topic.image ? (
          <img
            src={topic.image.url}
            alt={topic.image.altText || topic.tema}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-200">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-3">
          <Badge className="w-fit border-0 bg-amber-100 text-amber-800">Empresas</Badge>
          <Badge className="w-fit border-0 bg-insecap-blue/10 text-insecap-blue">
            {topic.categoria}
          </Badge>

          <h3 className="min-h-[3.5rem] text-xl font-bold leading-tight text-foreground">
            {topic.tema}
          </h3>
        </div>

        <div className="mt-auto">
          <Link to={localizedPath(`/curso-empresa/${topic.handle}`)}>
            <Button className="w-full bg-insecap-blue hover:bg-insecap-blue/90 text-white">
              Ver detalle empresa
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const B2bCourseCatalog = () => {
  const { locale, localizedPath } = useLocalizedPath();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [allTopics, setAllTopics] = useState<B2bCatalogTopic[]>([]);

  const content = {
    es: {
      title: 'Catálogo Empresas',
      subtitle: 'Cursos para cotización corporativa',
      intro:
        'Este catálogo está orientado a clientes empresa. Selecciona el curso y te llevaremos al formulario de contacto para cotizar.',
      search: 'Buscar por tema para empresas...',
      allCategories: 'Todas las categorías',
      noResults: 'No hay cursos empresa que coincidan con tus filtros.',
      noData:
        'No hay cursos B2B visibles en Shopify ni en fallback local. Verifica que tengan tag b2b y estén publicados en el canal de venta para Storefront.',
      loading: 'Cargando cursos empresa desde Shopify...',
      clientTypeLabel: 'Tipo de cliente',
      peopleClient: 'Particular',
      businessClient: 'Empresa',
      found: 'cursos empresa encontrados',
    },
    en: {
      title: 'Corporate Catalog',
      subtitle: 'Courses for corporate quotation',
      intro:
        'This catalog is focused on corporate clients. Pick a course and we will send you to the contact form for a quote.',
      search: 'Search corporate topics...',
      allCategories: 'All categories',
      noResults: 'No corporate courses match your filters.',
      noData:
        'No B2B courses visible in Shopify or local fallback. Ensure products have tag b2b and are published to a Storefront sales channel.',
      loading: 'Loading corporate courses from Shopify...',
      clientTypeLabel: 'Client type',
      peopleClient: 'Individual',
      businessClient: 'Company',
      found: 'corporate courses found',
    },
    pt: {
      title: 'Catálogo Empresas',
      subtitle: 'Cursos para cotação corporativa',
      intro:
        'Este catálogo é focado em clientes empresa. Selecione o curso e iremos ao formulário de contato para cotação.',
      search: 'Buscar temas corporativos...',
      allCategories: 'Todas as categorias',
      noResults: 'Nenhum curso corporativo corresponde aos filtros.',
      noData:
        'Não há cursos B2B visíveis no Shopify nem no fallback local. Verifique tag b2b e publicação no canal de venda do Storefront.',
      loading: 'Carregando cursos corporativos do Shopify...',
      clientTypeLabel: 'Tipo de cliente',
      peopleClient: 'Particular',
      businessClient: 'Empresa',
      found: 'cursos corporativos encontrados',
    },
  }[locale];

  useEffect(() => {
    let cancelled = false;

    const loadTopics = async () => {
      try {
        setIsLoadingTopics(true);
        const topics = await loadB2bCatalogTopics();
        if (!cancelled) {
          setAllTopics(topics);
        }
      } catch (error) {
        console.error('Error loading B2B catalog topics:', error);
        if (!cancelled) {
          setAllTopics([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTopics(false);
        }
      }
    };

    void loadTopics();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => getB2bCatalogCategoriesFromTopics(allTopics), [allTopics]);

  const filteredByCategory = useMemo(() => {
    if (!selectedCategory) {
      return allTopics;
    }
    return allTopics.filter((topic) => topic.categoria === selectedCategory);
  }, [allTopics, selectedCategory]);

  const semanticResults = useMemo(
    () => semanticSearchB2bTopics(filteredByCategory, searchTerm),
    [filteredByCategory, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(semanticResults.length / TOPICS_PER_PAGE));

  const paginatedTopics = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * TOPICS_PER_PAGE;
    return semanticResults.slice(start, start + TOPICS_PER_PAGE);
  }, [semanticResults, currentPage, totalPages]);

  const resetPagination = () => setCurrentPage(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: 'Cursos Empresas' }]}
        />

        <ClientTypeSwitch activeMode="empresa" />

        <div className="container mx-auto px-8 md:px-14 lg:px-16 mt-4">

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

          {isLoadingTopics ? (
            <div className="rounded-xl border border-border bg-muted/20 p-10 text-center text-muted-foreground">
              {content.loading}
            </div>
          ) : allTopics.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center text-muted-foreground">
              {content.noData}
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-muted-foreground">
                {semanticResults.length} {content.found}
              </div>

              {semanticResults.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">{content.noResults}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedTopics.map((topic) => (
                      <B2bCourseCard key={topic.handle} topic={topic} />
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default B2bCourseCatalog;
