import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const EXTINGUISHER_BANNER = 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Extintor_VR_341L.jpg?v=1776289560';
const EXTINGUISHER_GALLERY_IMAGES = [
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Extintor_VR-3.jpg?v=1776289533',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Extintor_RV-H_858.jpg?v=1776289533',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Extintor_RV-W12.jpg?v=1776289534',
];

type ExtinguisherContent = {
  title: string;
  subtitle: string;
  backCta: string;
  productBrand: string;
  productName: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  locationLabel: string;
  locationValue: string;
  locationValue2: string;
  locationValue3: string;
  detailsLabel: string;
  details: string[];
};

const SimulatorExtinguisherDetail = () => {
  const { localizedPath, locale } = useLocalizedPath();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const content = useMemo<ExtinguisherContent>(() => ({
    es: {
      title: 'Detalle Extintores',
      subtitle: 'Simulador de Uso de Extintores',
      backCta: 'Volver a Simuladores',
      productBrand: 'Simulador VR',
      productName: 'Uso de Extintores',
      description: 'Este simulador está diseñado para entrenar la respuesta ante incendios en un entorno seguro, con escenarios realistas, clases de fuego diferenciadas y evaluación de técnica operativa para emergencias.',
      primaryCta: 'Solicitar información',
      secondaryCta: 'Agendar demostración',
      locationLabel: 'Ubicación',
      locationValue: 'Calama, Región de Antofagasta',
      locationValue2: 'Antofagasta, Región de Antofagasta',
      locationValue3: 'Santiago, Región Metropolitana',
      detailsLabel: 'Detalle del simulador',
      details: ['Entrenamiento inmersivo y seguro', 'Escenarios de incendio por tipo de riesgo', 'Medición de desempeño por participante'],
    },
    en: {
      title: 'Extinguisher Detail',
      subtitle: 'Fire Extinguisher Use Simulator',
      backCta: 'Back to Simulators',
      productBrand: 'VR Simulator',
      productName: 'Fire Extinguisher Use',
      description: 'This simulator is designed to train emergency fire response in a safe environment, with realistic scenarios, differentiated fire classes, and operational technique assessment.',
      primaryCta: 'Request information',
      secondaryCta: 'Schedule a demo',
      locationLabel: 'Available locations',
      locationValue: 'Calama, Antofagasta Region',
      locationValue2: 'Antofagasta, Antofagasta Region',
      locationValue3: 'Santiago, Metropolitan Region',
      detailsLabel: 'Simulator detail',
      details: ['Immersive and safe training', 'Fire scenarios by risk type', 'Participant performance tracking'],
    },
    pt: {
      title: 'Detalhe Extintores',
      subtitle: 'Simulador de Uso de Extintores',
      backCta: 'Voltar para Simuladores',
      productBrand: 'Simulador VR',
      productName: 'Uso de Extintores',
      description: 'Este simulador foi projetado para treinar a resposta a incêndios em um ambiente seguro, com cenários realistas, classes de fogo diferenciadas e avaliação da técnica operacional.',
      primaryCta: 'Solicitar informações',
      secondaryCta: 'Agendar demonstração',
      locationLabel: 'Sedes disponíveis',
      locationValue: 'Calama, Região de Antofagasta',
      locationValue2: 'Antofagasta, Região de Antofagasta',
      locationValue3: 'Santiago, Região Metropolitana',
      detailsLabel: 'Detalhe do simulador',
      details: ['Treinamento imersivo e seguro', 'Cenários de incêndio por tipo de risco', 'Medição de desempenho por participante'],
    },
  }[locale as 'es' | 'en' | 'pt']), [locale]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? EXTINGUISHER_GALLERY_IMAGES.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === EXTINGUISHER_GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[
            { label: 'Simuladores', href: localizedPath('/simuladores') },
            { label: content.title },
          ]}
          backgroundImage={EXTINGUISHER_BANNER}
        />

        <div className="container mx-auto px-8 md:px-14 lg:px-16 mt-10">
          <div className="mb-8 flex justify-center">
            <Link to={localizedPath('/simuladores')}>
              <Button variant="outline" className="border-insecap-blue text-insecap-blue hover:bg-insecap-blue hover:text-white font-semibold">
                {content.backCta}
              </Button>
            </Link>
          </div>

          <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-6">
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                <img
                  src={EXTINGUISHER_GALLERY_IMAGES[activeImageIndex]}
                  alt={`Extintor vista ${activeImageIndex + 1}`}
                  className="h-[320px] w-full object-contain md:h-[480px]"
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
                {EXTINGUISHER_GALLERY_IMAGES.map((imageUrl, index) => (
                  <button
                    type="button"
                    key={`${imageUrl}-${index}`}
                    onClick={() => setActiveImageIndex(index)}
                    className={`overflow-hidden rounded-md border bg-white transition-colors ${
                      index === activeImageIndex
                        ? 'border-insecap-blue ring-2 ring-insecap-blue/30'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Miniatura extintor ${index + 1}`}
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
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{content.description}</p>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Link to={localizedPath('/contacto?origen=simulador&equipo=Extintor')}>
                  <Button className="w-full bg-insecap-blue hover:bg-insecap-blue/90 text-white font-semibold">
                    {content.primaryCta}
                  </Button>
                </Link>
                <Link to={localizedPath('/contacto?origen=simulador&equipo=Extintor&accion=demo')}>
                  <Button variant="outline" className="w-full border-insecap-blue text-insecap-blue hover:bg-insecap-blue hover:text-white font-semibold">
                    {content.secondaryCta}
                  </Button>
                </Link>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">{content.locationLabel}</h3>
                <div className="mt-2 space-y-1.5">
                  {[content.locationValue, content.locationValue2, content.locationValue3].map((loc) => (
                    <div key={loc} className="flex items-center gap-2 text-sm text-slate-700">
                      <MapPin className="h-4 w-4 shrink-0 text-insecap-blue" />
                      <span>{loc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{content.detailsLabel}</h4>
                <div className="mt-3 space-y-1.5">
                  {content.details.map((detail) => (
                    <p key={detail} className="text-sm text-slate-700">• {detail}</p>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SimulatorExtinguisherDetail;
