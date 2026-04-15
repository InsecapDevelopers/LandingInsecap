import { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Truck, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SIMULATORS, SIMULATOR_CATEGORIES } from '@/lib/simulatorData';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const CAEX_BANNER = 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/banner_caex.png?v=1776263507';
const EXTINTOR_IMAGE = 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/simulador_extintores.jpg';

const SimulatorCatalog = () => {
  const { t } = useTranslation();
  const { localizedPath, locale } = useLocalizedPath();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const catalogRef = useRef<HTMLDivElement>(null);

  const content = {
    es: {
      title: 'Simuladores',
      subtitle: 'Tecnología de simulación para capacitación especializada',
      allCategories: 'Todas las categorías',
      noResults: 'No hay simuladores en esta categoría.',
      contactCta: 'Solicitar Cotización',
      multisimSubtitle: 'Simulador de',
      multisimTitle: 'Multisim',
      multisimBrand: 'Simumak',
      multisimDesc: 'MULTISIM es nuestra solución de simulación para maquinaria pesada y vehículos de alto tonelaje. Disponemos de simuladores para camiones mineros de las principales marcas, maquinaria de construcción, montacargas y vehículos 4x4. Con sistemas de dinámica propietaria y visualización en pantallas o VR, es la herramienta idónea para la capacitación de operadores, evaluación de desempeño y práctica de situaciones de riesgo.',
      multisimCta: 'Ver Modelos',
      multisimLinks: ['Camiones Minería', 'Maquinaria', 'Monta Carga', 'Manejo 4x4'],
      multisimLinkHandles: ['camiones-mineria', 'maquinaria', 'monta-carga', 'manejo-4x4'],
      extintorSubtitle: 'Simulador de',
      extintorTitle: 'Uso de Extintores',
      extintorDesc: 'Nuestro simulador de extinción de incendios permite a los participantes practicar el uso correcto de extintores en un entorno seguro y controlado. La simulación reproduce escenarios reales de incendio con distintas clases de fuego, desarrollando la destreza y la confianza necesarias para actuar ante emergencias en el lugar de trabajo.',
      extintorCta: 'Más Información',
      catalogTitle: 'Modelos Disponibles',
      catalogSubtitle: 'Multisim · Simumak',
    },
    en: {
      title: 'Simulators',
      subtitle: 'Simulation technology for specialized training',
      allCategories: 'All categories',
      noResults: 'No simulators in this category.',
      contactCta: 'Request Quote',
      multisimSubtitle: 'Simulator',
      multisimTitle: 'Multisim',
      multisimBrand: 'Simumak',
      multisimDesc: 'MULTISIM is our simulation solution for heavy machinery and high-tonnage vehicles. We offer simulators for mining trucks from major brands, construction machinery, forklifts and 4x4 vehicles. With proprietary dynamics systems and screen or VR visualization, it is the ideal tool for operator training, performance evaluation and hazard scenario practice.',
      multisimCta: 'View Models',
      multisimLinks: ['Mining Trucks', 'Machinery', 'Heavy Load', '4x4 Handling'],
      multisimLinkHandles: ['camiones-mineria', 'maquinaria', 'monta-carga', 'manejo-4x4'],
      extintorSubtitle: 'Simulator',
      extintorTitle: 'Fire Extinguisher Use',
      extintorDesc: 'Our fire extinguisher simulator allows participants to practice the correct use of extinguishers in a safe, controlled environment. The simulation reproduces real fire scenarios with different fire classes, developing the skill and confidence needed to act in workplace emergencies.',
      extintorCta: 'More Information',
      catalogTitle: 'Available Models',
      catalogSubtitle: 'Multisim · Simumak',
    },
    pt: {
      title: 'Simuladores',
      subtitle: 'Tecnologia de simulação para treinamento especializado',
      allCategories: 'Todas as categorias',
      noResults: 'Sem simuladores nesta categoria.',
      contactCta: 'Solicitar Cotação',
      multisimSubtitle: 'Simulador de',
      multisimTitle: 'Multisim',
      multisimBrand: 'Simumak',
      multisimDesc: 'MULTISIM é nossa solução de simulação para maquinária pesada e veículos de alto tonelagem. Dispomos de simuladores para caminhões de mineração das principais marcas, maquinaria de construção, empilhadeiras e veículos 4x4. Com sistemas de dinâmica proprietária e visualização em telas ou VR, é a ferramenta ideal para o treinamento de operadores, avaliação de desempenho e prática de situações de risco.',
      multisimCta: 'Ver Modelos',
      multisimLinks: ['Caminhões Mineração', 'Maquinaria', 'Elevação de Carga', 'Manejo 4x4'],
      multisimLinkHandles: ['camiones-mineria', 'maquinaria', 'monta-carga', 'manejo-4x4'],
      extintorSubtitle: 'Simulador de',
      extintorTitle: 'Uso de Extintores',
      extintorDesc: 'Nosso simulador de extinção de incêndios permite que os participantes pratiquem o uso correto de extintores em um ambiente seguro e controlado. A simulação reproduz cenários reais de incêndio com diferentes classes de fogo, desenvolvendo a habilidade e a confiança necessárias para agir em emergências no local de trabalho.',
      extintorCta: 'Mais Informações',
      catalogTitle: 'Modelos Disponíveis',
      catalogSubtitle: 'Multisim · Simumak',
    },
  }[locale];

  const categoryLabels = SIMULATOR_CATEGORIES[locale as keyof typeof SIMULATOR_CATEGORIES] || SIMULATOR_CATEGORIES.es;

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(SIMULATORS.map((s) => s.category));
    return Array.from(cats).map((cat) => ({
      handle: cat,
      label: categoryLabels[cat as keyof typeof categoryLabels] || cat,
    }));
  }, [categoryLabels]);

  // Filter simulators
  const filteredSimulators = useMemo(() => {
    if (!selectedCategory) return SIMULATORS;
    return SIMULATORS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const handleScrollToCatalog = (category?: string) => {
    setSelectedCategory(category ?? '');
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: content.title }]}
          backgroundImage={CAEX_BANNER}
        />

        {/* Tipos de Simuladores */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-8 md:px-14 lg:px-16 space-y-8">

            {/* Card 1: Multisim de Simumak */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {content.multisimSubtitle}{' '}
                  <span className="text-insecap-blue">{content.multisimTitle}</span>
                  <span className="text-gray-400 text-lg font-normal ml-2">· {content.multisimBrand}</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">{content.multisimDesc}</p>
                <div className="flex flex-col gap-1 mb-6">
                  {content.multisimLinks.map((label, i) => (
                    <button
                      key={label}
                      onClick={() => handleScrollToCatalog(content.multisimLinkHandles[i])}
                      className="flex items-center gap-1 text-insecap-blue hover:underline text-sm font-medium w-fit"
                    >
                      <ChevronRight className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
                <div>
                  <Button
                    onClick={() => handleScrollToCatalog()}
                    className="bg-insecap-blue hover:bg-insecap-blue/90 text-white font-semibold"
                  >
                    {content.multisimCta}
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[320px] overflow-hidden">
                <img
                  src={CAEX_BANNER}
                  alt="Simulador Multisim Simumak"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card 2: Uso de Extintores */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row-reverse">
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {content.extintorSubtitle}{' '}
                  <span className="text-insecap-blue">{content.extintorTitle}</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">{content.extintorDesc}</p>
                <div>
                  <Link to={localizedPath('/contacto?origen=simulador&equipo=Extintor')}>
                    <Button
                      variant="outline"
                      className="border-insecap-blue text-insecap-blue hover:bg-insecap-blue hover:text-white font-semibold"
                    >
                      {content.extintorCta}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[320px] overflow-hidden bg-gradient-to-br from-orange-700 to-red-900">
                <img
                  src={EXTINTOR_IMAGE}
                  alt="Simulador de Uso de Extintores"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Catálogo Multisim */}
        <div ref={catalogRef} className="container mx-auto px-8 md:px-14 lg:px-16 mt-14 scroll-mt-24">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900">{content.catalogTitle}</h3>
            <p className="text-insecap-blue font-semibold mt-1">{content.catalogSubtitle}</p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all uppercase ${
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
                onClick={() => setSelectedCategory(cat.handle)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all uppercase ${
                  selectedCategory === cat.handle
                    ? 'bg-insecap-blue text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Simulators Grid */}
          {filteredSimulators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {filteredSimulators.map((simulator) => (
                <Card key={simulator.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                    <Badge className="absolute top-3 left-3 bg-insecap-blue text-white border-0 uppercase text-xs font-bold">
                      {simulator.name}
                    </Badge>
                    {simulator.image ? (
                      <img
                        src={simulator.image}
                        alt={simulator.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Truck className="h-16 w-16" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="p-5 space-y-4">
                    {/* Specs Grid */}
                    <div className="grid gap-2">
                      {simulator.specs.map((spec) => (
                        <div key={spec.label} className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase font-semibold">{spec.label}</p>
                          <p className="text-sm font-bold text-foreground">{spec.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link to={localizedPath(`/contacto?origen=simulador&equipo=${encodeURIComponent(simulator.name)}`)}>
                      <Button className="w-full bg-insecap-blue hover:bg-insecap-blue/90 text-white font-semibold">
                        {content.contactCta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">{content.noResults}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SimulatorCatalog;
