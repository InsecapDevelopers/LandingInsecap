import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const CAEX_BANNER = 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/banner_caex.png?v=1776263507';
const MULTISIM_CARD_IMAGE = 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/IMG_5510.jpg?v=1776281179';
const EXTINTOR_IMAGE = 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Extintor_VR_341L.jpg?v=1776289560';

const SimulatorCatalog = () => {
  const { t } = useTranslation();
  const { localizedPath, locale } = useLocalizedPath();

  const content = {
    es: {
      title: 'Simuladores',
      subtitle: 'Tecnología de simulación para capacitación especializada',
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
    },
    en: {
      title: 'Simulators',
      subtitle: 'Simulation technology for specialized training',
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
    },
    pt: {
      title: 'Simuladores',
      subtitle: 'Tecnologia de simulação para treinamento especializado',
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
    },
  }[locale];

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
                    <Link
                      key={label}
                      to={localizedPath(`/simuladores/modelos?categoria=${encodeURIComponent(content.multisimLinkHandles[i])}`)}
                      className="flex items-center gap-1 text-insecap-blue hover:underline text-sm font-medium w-fit"
                    >
                      <ChevronRight className="h-4 w-4" />
                      {label}
                    </Link>
                  ))}
                </div>
                <div>
                  <Link to={localizedPath('/simuladores/modelos')}>
                    <Button className="bg-insecap-blue hover:bg-insecap-blue/90 text-white font-semibold">
                      {content.multisimCta}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[320px] overflow-hidden">
                <img
                  src={MULTISIM_CARD_IMAGE}
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
                  <Link to={localizedPath('/simuladores/extintores')}>
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

      </main>

      <Footer />
    </div>
  );
};

export default SimulatorCatalog;
