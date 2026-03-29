import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CatalogSelections,
  JsonCatalogTopic,
  formatHoursLabel,
  getInitialSelections,
  getJsonCatalogCategories,
  getJsonCatalogTopics,
  getSelectorOptions,
  hasValidCombination,
  semanticSearchJsonTopics,
} from '@/lib/catalogData';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const TOPICS_PER_PAGE = 12;

const SelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => {
  return (
    <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-md border border-border bg-background px-2.5 text-sm text-foreground"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {label === 'Horas' ? formatHoursLabel(option) : option}
          </option>
        ))}
      </select>
    </label>
  );
};

const JsonCourseCard = ({ topic }: { topic: JsonCatalogTopic }) => {
  const { localizedPath } = useLocalizedPath();
  const [selections, setSelections] = useState<CatalogSelections>(getInitialSelections());
  const selectorOptions = useMemo(() => getSelectorOptions(topic, selections), [topic, selections]);

  const isConfigValid = useMemo(
    () => hasValidCombination(topic, selections),
    [topic, selections]
  );

  const updateSelection = (key: keyof CatalogSelections, value: string) => {
    setSelections((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-5 flex flex-col gap-4 h-full">
        <div className="space-y-2">
          <Badge className="bg-insecap-blue/10 text-insecap-blue">{topic.categoria}</Badge>
          <h3 className="font-bold text-foreground leading-tight">{topic.tema}</h3>
          <p className="text-xs text-muted-foreground">
            Handle Shopify: /cursos/{topic.handle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <SelectField
            label="Modalidad"
            value={selections.modalidad}
            options={selectorOptions.modalidades}
            onChange={(value) => updateSelection('modalidad', value)}
          />
          <SelectField
            label="Horas"
            value={selections.horas}
            options={selectorOptions.horas}
            onChange={(value) => updateSelection('horas', value)}
          />
          <SelectField
            label="Estándar"
            value={selections.estandar}
            options={selectorOptions.estandares}
            onChange={(value) => updateSelection('estandar', value)}
          />
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Precio</span>
            <span className="text-lg font-bold text-insecap-cyan">Cotizar</span>
          </div>

          <p className={`text-xs ${isConfigValid ? 'text-green-600' : 'text-amber-600'}`}>
            {isConfigValid
              ? 'Combinación disponible para cotización.'
              : 'No existe una combinación exacta con esos filtros.'}
          </p>

          <Link to={localizedPath(`/curso/${topic.handle}`)}>
            <Button className="w-full bg-insecap-blue hover:bg-insecap-blue/90 text-white">
              Ver y cotizar
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

  const content = {
    es: {
      title: 'Catálogo de Cursos Técnicos',
      subtitle: '61 temas maestros con configuración dinámica',
      intro:
        'Filtra por categoría, busca de forma semántica y configura modalidad, horas y estándar sin duplicar cursos.',
      search: 'Buscar por tema (ej: grua, altura, electricidad...)',
      allCategories: 'Todas las categorías',
      noResults: 'No hay temas que coincidan con tus filtros.',
    },
    en: {
      title: 'Technical Course Catalog',
      subtitle: '61 master topics with dynamic configuration',
      intro:
        'Filter by category, search semantically, and configure modality, hours, and standard without duplicated courses.',
      search: 'Search by topic (e.g. crane, heights, electricity...)',
      allCategories: 'All categories',
      noResults: 'No topics match your filters.',
    },
    pt: {
      title: 'Catálogo de Cursos Técnicos',
      subtitle: '61 temas principais com configuração dinâmica',
      intro:
        'Filtre por categoria, busque semanticamente e configure modalidade, horas e padrão sem duplicar cursos.',
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
                  <JsonCourseCard key={topic.handle} topic={topic} />
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
