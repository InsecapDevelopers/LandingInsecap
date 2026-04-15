import { memo, startTransition, useCallback, useEffect, useDeferredValue, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, ShieldCheck, Truck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SIMULATORS, SIMULATOR_CATEGORIES, type Simulator } from '@/lib/simulatorData';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const CAEX_BANNER = 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/banner_caex.png?v=1776263507';
const STORE_GALLERY_IMAGES = [
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/IMG_5512.jpg?v=1776281178',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/IMG_5499.jpg?v=1776281178',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/IMG_5495.jpg?v=1776281180',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/IMG_5604.jpg?v=1776281181',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/IMG_5506.jpg?v=1776281182',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/IMG_5509.jpg?v=1776281183',
];

type SimulatorModelsContent = {
  title: string;
  subtitle: string;
  allCategories: string;
  noResults: string;
  contactCta: string;
  backCta: string;
  storeHeadline: string;
  storeDescription: string;
  storeFeatures: string[];
  catalogLabel: string;
  productBrand: string;
  productName: string;
  sku: string;
  primaryCta: string;
  secondaryCta: string;
  locationLabel: string;
  locationValue: string;
};

type CategoryOption = {
  handle: string;
  label: string;
};

type GalleryPanelProps = {
  content: SimulatorModelsContent;
  localizedPath: (path: string) => string;
};

type SimulatorCardProps = {
  simulator: Simulator;
};

type ModelsCatalogSectionProps = {
  content: SimulatorModelsContent;
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  filteredSimulators: Simulator[];
};

const GalleryPanel = memo(({ content, localizedPath }: GalleryPanelProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handlePrevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev === 0 ? STORE_GALLERY_IMAGES.length - 1 : prev - 1));
  }, []);

  const handleNextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev === STORE_GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
  }, []);

  const handleSelectImage = useCallback((index: number) => {
    setActiveImageIndex(index);
  }, []);

  useEffect(() => {
    const nextIndex = (activeImageIndex + 1) % STORE_GALLERY_IMAGES.length;
    const prevIndex = activeImageIndex === 0 ? STORE_GALLERY_IMAGES.length - 1 : activeImageIndex - 1;
    const preloadSources = [STORE_GALLERY_IMAGES[nextIndex], STORE_GALLERY_IMAGES[prevIndex]];

    preloadSources.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [activeImageIndex]);

  return (
    <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-6">
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
          <img
            src={STORE_GALLERY_IMAGES[activeImageIndex]}
            alt={`Multisim vista ${activeImageIndex + 1}`}
            className="h-[320px] w-full object-cover md:h-[480px]"
            decoding="async"
          />
          <button
            type="button"
            onClick={handlePrevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm hover:bg-white"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm hover:bg-white"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {STORE_GALLERY_IMAGES.map((imageUrl, index) => (
            <button
              type="button"
              key={imageUrl}
              onClick={() => handleSelectImage(index)}
              className={`overflow-hidden rounded-md border bg-white transition-colors ${
                index === activeImageIndex
                  ? 'border-insecap-blue ring-2 ring-insecap-blue/30'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img
                src={imageUrl}
                alt={`Miniatura Multisim ${index + 1}`}
                className="h-16 w-16 object-cover md:h-20 md:w-20"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm lg:sticky lg:top-24 lg:h-fit">
        <div className="mb-1 text-sm font-semibold text-slate-500">{content.productBrand}</div>
        <h2 className="text-3xl font-bold leading-tight text-slate-900">{content.productName}</h2>
        <p className="mt-2 text-xs font-semibold text-slate-500">{content.sku}</p>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link to={localizedPath('/contacto?origen=simulador&equipo=Multisim%20Simumak')}>
            <Button className="w-full bg-insecap-blue hover:bg-insecap-blue/90 text-white font-semibold">
              {content.primaryCta}
            </Button>
          </Link>
          <Link to={localizedPath('/contacto?origen=simulador&equipo=Multisim%20Simumak&accion=demo')}>
            <Button variant="outline" className="w-full border-insecap-blue text-insecap-blue hover:bg-insecap-blue hover:text-white font-semibold">
              {content.secondaryCta}
            </Button>
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900">{content.locationLabel}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
            <MapPin className="h-4 w-4 text-insecap-blue" />
            <span>{content.locationValue}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Multisim Store</h4>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{content.storeDescription}</p>
          <div className="mt-3 space-y-1.5">
            {content.storeFeatures.map((feature) => (
              <p key={feature} className="text-sm text-slate-700 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-insecap-blue" />
                <span>{feature}</span>
              </p>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
});

GalleryPanel.displayName = 'GalleryPanel';

const SimulatorCard = memo(({ simulator }: SimulatorCardProps) => (
  <Card className="overflow-hidden border-0 shadow-lg h-full">
    <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
      {simulator.image ? (
        <img
          src={simulator.image}
          alt={simulator.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400">
          <Truck className="h-16 w-16" />
        </div>
      )}
    </div>

    <CardContent className="p-5 space-y-3">
      <h3 className="text-base font-bold text-foreground leading-tight">{simulator.name}</h3>

      <div className="grid gap-2">
        {simulator.specs.map((spec) => (
          <div key={spec.label} className="space-y-0.5">
            <p className="text-xs text-muted-foreground uppercase font-semibold">{spec.label}</p>
            <p className="text-sm font-bold text-foreground">{spec.value}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

SimulatorCard.displayName = 'SimulatorCard';

const ModelsCatalogSectionInner = ({
  content,
  categories,
  selectedCategory,
  onSelectCategory,
  filteredSimulators,
}: ModelsCatalogSectionProps) => {
  const CARDS_PER_PAGE = 4;
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(filteredSimulators.length / CARDS_PER_PAGE);
  const visibleCards = filteredSimulators.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  // Reset to first page when category changes
  useEffect(() => {
    setPage(0);
  }, [filteredSimulators]);

  return (
    <>
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{content.catalogLabel}</h2>
        <p className="text-sm text-slate-500 mt-1">Multisim · Simumak</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => onSelectCategory('')}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors uppercase ${
            !selectedCategory
              ? 'bg-insecap-blue text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {content.allCategories}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.handle}
            onClick={() => onSelectCategory(cat.handle)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors uppercase ${
              selectedCategory === cat.handle
                ? 'bg-insecap-blue text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredSimulators.length > 0 ? (
        <div className="mb-12">
          <div className="relative">
            {page > 0 && (
              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-md hover:bg-slate-50 md:-left-6"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {visibleCards.map((simulator) => (
                <SimulatorCard key={simulator.id} simulator={simulator} />
              ))}
            </div>

            {page < totalPages - 1 && (
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-md hover:bg-slate-50 md:-right-6"
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all ${i === page ? 'w-6 bg-insecap-blue' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                  aria-label={`Ir a página ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">{content.noResults}</p>
        </div>
      )}
    </>
  );
};

const ModelsCatalogSection = memo(ModelsCatalogSectionInner);

ModelsCatalogSection.displayName = 'ModelsCatalogSection';

const SimulatorModels = () => {
  const { t } = useTranslation();
  const { localizedPath, locale } = useLocalizedPath();
  const [searchParams] = useSearchParams();

  const initialCategory = searchParams.get('categoria') ?? '';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const deferredSelectedCategory = useDeferredValue(selectedCategory);

  const content = useMemo<SimulatorModelsContent>(() => ({
    es: {
      title: 'Modelos Disponibles',
      subtitle: 'Multisim · Simumak',
      allCategories: 'Todas las categorías',
      noResults: 'No hay simuladores en esta categoría.',
      contactCta: 'Solicitar Cotización',
      backCta: 'Volver a Simuladores',
      storeHeadline: 'Entrena en una experiencia inmersiva, segura y medible',
      storeDescription: 'Nuestra línea Multisim integra cabina realista, escenarios operacionales de alta exigencia y evaluación por desempeño para procesos de capacitación y certificación técnica.',
      storeFeatures: ['Escenarios de alto realismo', 'Métricas y trazabilidad de desempeño', 'Modelos para minería, construcción y logística'],
      catalogLabel: 'Algunos de nuestros modelos disponibles',
      productBrand: 'Simumak',
      productName: 'Simulador Multisim 360 para Operación CAEX',
      sku: 'SKU SIMM-CAEX-360',
      primaryCta: 'Solicitar ahora',
      secondaryCta: 'Agendar demo',
      locationLabel: 'Ubicación',
      locationValue: 'Calama, Región de Antofagasta',
    },
    en: {
      title: 'Available Models',
      subtitle: 'Multisim · Simumak',
      allCategories: 'All categories',
      noResults: 'No simulators in this category.',
      contactCta: 'Request Quote',
      backCta: 'Back to Simulators',
      storeHeadline: 'Train with an immersive, safe and measurable experience',
      storeDescription: 'Our Multisim line combines realistic cabins, high-demand operational scenarios, and performance-based evaluation for technical training and certification processes.',
      storeFeatures: ['High-realism scenarios', 'Performance metrics and traceability', 'Models for mining, construction and logistics'],
      catalogLabel: 'All available models',
      productBrand: 'Simumak',
      productName: 'Multisim 360 CAEX Operation Simulator',
      sku: 'SKU SIMM-CAEX-360',
      primaryCta: 'Request now',
      secondaryCta: 'Schedule demo',
      locationLabel: 'Location',
      locationValue: 'Calama, Antofagasta Region',
    },
    pt: {
      title: 'Modelos Disponíveis',
      subtitle: 'Multisim · Simumak',
      allCategories: 'Todas as categorias',
      noResults: 'Sem simuladores nesta categoria.',
      contactCta: 'Solicitar Cotação',
      backCta: 'Voltar para Simuladores',
      storeHeadline: 'Treine com uma experiência imersiva, segura e mensurável',
      storeDescription: 'Nossa linha Multisim combina cabine realista, cenários operacionais de alta exigência e avaliação por desempenho para processos de treinamento e certificação técnica.',
      storeFeatures: ['Cenários de alto realismo', 'Métricas e rastreabilidade de desempenho', 'Modelos para mineração, construção e logística'],
      catalogLabel: 'Todos os modelos disponíveis',
      productBrand: 'Simumak',
      productName: 'Simulador Multisim 360 para Operação CAEX',
      sku: 'SKU SIMM-CAEX-360',
      primaryCta: 'Solicitar agora',
      secondaryCta: 'Agendar demo',
      locationLabel: 'Localização',
      locationValue: 'Calama, Região de Antofagasta',
    },
  }[locale as 'es' | 'en' | 'pt']), [locale]);

  const categoryLabels = SIMULATOR_CATEGORIES[locale as keyof typeof SIMULATOR_CATEGORIES] || SIMULATOR_CATEGORIES.es;

  const categories = useMemo(() => {
    const cats = new Set(SIMULATORS.map((s) => s.category));
    return Array.from(cats).map((cat) => ({
      handle: cat,
      label: categoryLabels[cat as keyof typeof categoryLabels] || cat,
    }));
  }, [categoryLabels]);

  const filteredSimulators = useMemo(() => {
    if (!deferredSelectedCategory) return SIMULATORS;
    return SIMULATORS.filter((s) => s.category === deferredSelectedCategory);
  }, [deferredSelectedCategory]);

  const handleSelectCategory = useCallback((category: string) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: t('header.nav.home'), href: localizedPath('/') }, { label: 'Simuladores', href: localizedPath('/simuladores') }, { label: content.title }]}
          backgroundImage={CAEX_BANNER}
        />

        <div className="container mx-auto px-8 md:px-14 lg:px-16 mt-10">
          <div className="mb-8 flex justify-center">
            <Link to={localizedPath('/simuladores')}>
              <Button variant="outline" className="border-insecap-blue text-insecap-blue hover:bg-insecap-blue hover:text-white font-semibold">
                {content.backCta}
              </Button>
            </Link>
          </div>

          <GalleryPanel content={content} localizedPath={localizedPath} />

          <ModelsCatalogSection
            content={content}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            filteredSimulators={filteredSimulators}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SimulatorModels;
