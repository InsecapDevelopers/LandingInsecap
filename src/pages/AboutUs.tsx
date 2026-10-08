import React, { useState } from 'react';
import { Users, Monitor, Video, MapPin, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import MeetUs from '@/components/MeetUs';
import OurLocations from '@/components/OurLocations';
import PageHero from '@/components/PageHero';
import InsecapEnDatos from '@/components/InsecapEnDatos';
import { getRespuestaNosotros } from '@/data/respuestas';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/use-scroll-animation';
import { Meteors } from '@/components/ui/meteors';
import { getYearsOfExperience } from '@/lib/insecapUtils';
import { useLocalizedPath } from '@/hooks/use-localized-path';
// 1. IMPORTANTE: Importar el plugin de Autoplay
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const antofagastaImages = [
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/sede-antofagasta-2025-8b813334.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2026-01-19-at-09-32-40-c41a4f12.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/sala-2-antofa-1675-scaled-d6e654b8.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2026-01-21-at-09-11-04-17244468.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2026-01-16-at-16-11-18-5b2585d4.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/sala-1-antofa-1638-scaled-f0587920.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2025-11-10-at-17-23-41-1-1794b787.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/presencialt-092031-b1831735.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/img-1593-scaled-2e337ac7.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/gemini-generated-image-fhyf58fhyf58fhyf-348fb4bf-e08f-4152-8-88e15687.webp",
];

const santiagoImages = [
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/sede-santiago-web-b334326b.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2024-04-03-at-12-56-34-pm-4a866201.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2026-01-07-at-09-22-34-b82e9669.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2025-11-20-at-09-13-03-4f3fadf5.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2025-08-12-at-09-23-16-29aa5128.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2025-10-10-at-16-02-21-af4ea81c.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/e-sala-3-image-2024-08-05-at-13-17-20-caaa277d.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2025-10-14-at-15-54-11-1-07add670.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/sala-stgo-salon2-1714-d7bfea15.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/sala-e-stgo-salon1-7390-7764895a.webp",
];

const calamaImages = [
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/cascada-fachada-y-letrero-scaled-b16fb817.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/ghorquilla3675-web-3c089be8.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/toconao-13-59-37-b61aeaf0.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/whatsapp-image-2025-11-08-at-09-58-59-b3ab0a7e.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/presencial-095357-eae34b64.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/salon-break-104615-6b2505bc.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/sala-zen135934-1-d124d407.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/san-pedro-124306-6-da50d69e.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/lasana-img-3964-scaled-e25185e5.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/caspana-img-3949-scaled-356f5759.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/presencial-094101-61844b24.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/toconce-img-3603-scaled-ec91321e.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/ghorquilla3675-web-6f410fbf-8a24-4820-bfc2-acf479adc4ca-fad07122.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/computacion-img-3527-scaled-61227306.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/simulador-cabina-173107-7-856ccea5.webp",
  "https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/soldadura-1009177-5c64a9ea.webp",
];

// ─── Lightbox compartido para todas las sedes ────────────────────────────────
const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" />
  </svg>
);

interface SedeGalleryLabels {
  sede: string;
  close: string;
  prev: string;
  next: string;
  photoAlt: (sede: string, n: number) => string;
  thumb: (n: number) => string;
}

interface SedeGalleryProps {
  images: string[];
  label: string;
  labels: SedeGalleryLabels;
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}

const SedeGallery = ({ images, label, labels, index, setIndex, onClose }: SedeGalleryProps) => {
  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black/90"
      onClick={onClose}
    >
      {/* Barra superior: fija */}
      <div
        className="shrink-0 flex items-center justify-between px-6 py-3"
        onClick={e => e.stopPropagation()}
      >
        <span className="text-white/60 text-sm font-medium tracking-wide">{labels.sede} {label}</span>
        <span className="text-white/50 text-sm tabular-nums">{index + 1} / {images.length}</span>
        <button
          onClick={onClose}
          aria-label={labels.close}
          className="text-white/70 hover:text-white transition-colors ml-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Área de imagen: ocupa todo el espacio disponible */}
      <div
        className="flex-1 flex items-center justify-center px-12 overflow-hidden min-h-0"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
          {/* Botón anterior */}
          <button
            onClick={prev}
            aria-label={labels.prev}
            className="absolute left-0 z-10 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors -translate-x-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            key={index}
            src={images[index]}
            alt={labels.photoAlt(label, index + 1)}
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />

          {/* Botón siguiente */}
          <button
            onClick={next}
            aria-label={labels.next}
            className="absolute right-0 z-10 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors translate-x-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tira de miniaturas: fija al fondo */}
      <div
        className="shrink-0 flex gap-2 justify-center overflow-x-auto py-3 px-4"
        style={{ height: '72px' }}
        onClick={e => e.stopPropagation()}
      >
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={labels.thumb(i + 1)}
            className={`shrink-0 w-14 h-full rounded-lg overflow-hidden border-2 transition-all ${i === index ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-75'}`}
          >
            <img src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const AboutUs = () => {
  const { locale } = useLocalizedPath();
  // Animaciones de scroll
  const queHacemosHeader = useScrollAnimation({ threshold: 0.2 });
  const queHacemosCards = useStaggerAnimation({ threshold: 0.15 });
  const locationsHeader = useScrollAnimation({ threshold: 0.2 });
  const sedeAntofText = useScrollAnimation({ threshold: 0.15 });
  const sedeAntofCarousel = useScrollAnimation({ threshold: 0.15 });
  const sedeCalamaText = useScrollAnimation({ threshold: 0.15 });
  const sedeCalamaCarousel = useScrollAnimation({ threshold: 0.15 });
  const [antofLightbox, setAntofLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const [calamaLightbox, setCalamaLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const [santiagoLightbox, setSantiagoLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  const sedeSantiagoText = useScrollAnimation({ threshold: 0.15 });
  const sedeSantiagoCarousel = useScrollAnimation({ threshold: 0.15 });
  const sedeVirtualSection = useScrollAnimation({ threshold: 0.1 });

  const content = {
    es: {
      pageTitle: `Más de ${getYearsOfExperience()} años de experiencia`,
      pageSubtitle: 'Nosotros',
      breadcrumb: 'Nosotros',
      focus: 'Nuestro enfoque',
      whatTitle: '¿Qué hacemos?',
      whatText: 'Entregamos soluciones de capacitación y entrenamientos a la medida. Interactuamos con partes interesadas y usuarios finales para que la solución sea la que requiere cada cliente.',
      availableMode: 'Modalidad disponible',
      modalities: ['Presencial', 'Sincrónico', 'Asincrónico'],
      modalitiesDesc: ['En nuestras instalaciones o donde el cliente disponga.', 'Plataformas electrónicas con clases en vivo vía streaming.', 'Entrenamiento de autoinstrucción en plataforma Moodle.'],
      brand: 'Insecap Capacitación',
      antof: 'Sede Antofagasta',
      calama: 'Sede Calama',
      santiago: 'Sede Santiago',
      expand: 'Expandir',
      antofItems: [`${new Date().getFullYear() - 2010} años realizando capacitación en la región.`, 'Equipamiento para proceso práctico: torre de entrenamiento, Layer, trípode de descenso.', 'Salón de coffee break.', 'Salas de capacitación hasta 35 personas.'],
      calamaItems: ['Salones adaptados hasta 60 personas.', 'Coffee break exclusivos.'],
      santiagoItems: ['Sede ubicada en el corazón de la capital, accesible desde toda la Región Metropolitana.', 'Múltiples salas de capacitación equipadas con tecnología audiovisual de última generación.', 'Espacio para prácticas en terreno y simulaciones controladas.', 'Café y área de descanso para participantes.'],
      online: 'Insecap Online',
      virtualTitle: 'Sedes Virtuales',
      virtualText: 'Nuestra metodología online permite llegar a todo Chile con la misma calidad que nuestras sedes físicas, utilizando tecnología de vanguardia para el aprendizaje.',
      virtualItems: [`${new Date().getFullYear() - 2020} años realizando capacitaciones online con éxito.`, 'Plataforma LMS (Moodle) optimizada para el alumno.', 'Soporte técnico y académico 24/7.'],
      mapAntof: 'Mapa Sede Antofagasta',
      mapCalama: 'Mapa Sede Calama',
      mapSantiago: 'Mapa Sede Santiago',
      virtualImage: 'Clase de capacitación online de INSECAP',
      gallery: {
        sede: 'Sede',
        close: 'Cerrar',
        prev: 'Foto anterior',
        next: 'Foto siguiente',
        photoAlt: (sede: string, n: number) => `Instalaciones de INSECAP en ${sede}, foto ${n}`,
        thumb: (n: number) => `Ver foto ${n}`,
      },
    },
    en: {
      pageTitle: `More than ${getYearsOfExperience()} years of experience`,
      pageSubtitle: 'About us',
      breadcrumb: 'About us',
      focus: 'Our approach',
      whatTitle: 'What do we do?',
      whatText: 'We deliver tailored training solutions and learning experiences. We interact with stakeholders and end users so the final solution matches what each client actually needs.',
      availableMode: 'Available mode',
      modalities: ['On-site', 'Synchronous', 'Asynchronous'],
      modalitiesDesc: ['At our facilities or wherever the client requires.', 'Digital platforms with live classes via streaming.', 'Self-paced training through our Moodle platform.'],
      brand: 'Insecap Training',
      antof: 'Antofagasta Campus',
      calama: 'Calama Campus',
      santiago: 'Santiago Campus',
      expand: 'Expand',
      antofItems: [`${new Date().getFullYear() - 2010} years delivering training in the region.`, 'Equipment for hands-on practice: training tower, layer and descent tripod.', 'Coffee break lounge.', 'Training rooms for up to 35 people.'],
      calamaItems: ['Classrooms adapted for up to 60 people.', 'Exclusive coffee break areas.'],
      santiagoItems: ['Campus located in the heart of the capital, accessible from across the metropolitan region.', 'Multiple training rooms equipped with state-of-the-art audiovisual technology.', 'Space for field practice and controlled simulations.', 'Coffee and rest area for participants.'],
      online: 'Insecap Online',
      virtualTitle: 'Virtual Campuses',
      virtualText: 'Our online methodology allows us to reach all of Chile with the same quality as our physical campuses, using advanced learning technology.',
      virtualItems: [`${new Date().getFullYear() - 2020} years delivering successful online training.`, 'Student-optimized LMS (Moodle) platform.', '24/7 technical and academic support.'],
      mapAntof: 'Antofagasta Campus Map',
      mapCalama: 'Calama Campus Map',
      mapSantiago: 'Santiago Campus Map',
      virtualImage: 'INSECAP online training class',
      gallery: {
        sede: 'Campus',
        close: 'Close',
        prev: 'Previous photo',
        next: 'Next photo',
        photoAlt: (sede: string, n: number) => `INSECAP facilities in ${sede}, photo ${n}`,
        thumb: (n: number) => `View photo ${n}`,
      },
    },
    pt: {
      pageTitle: `Mais de ${getYearsOfExperience()} anos de experiência`,
      pageSubtitle: 'Sobre nós',
      breadcrumb: 'Sobre nós',
      focus: 'Nosso enfoque',
      whatTitle: 'O que fazemos?',
      whatText: 'Entregamos soluções de capacitação e treinamentos sob medida. Interagimos com as partes interessadas e os usuários finais para que a solução atenda exatamente ao que cada cliente precisa.',
      availableMode: 'Modalidade disponível',
      modalities: ['Presencial', 'Síncrono', 'Assíncrono'],
      modalitiesDesc: ['Em nossas instalações ou onde o cliente indicar.', 'Plataformas digitais com aulas ao vivo via streaming.', 'Treinamento autodirigido na plataforma Moodle.'],
      brand: 'Insecap Capacitação',
      antof: 'Unidade Antofagasta',
      calama: 'Unidade Calama',
      santiago: 'Unidade Santiago',
      expand: 'Expandir',
      antofItems: [`${new Date().getFullYear() - 2010} anos realizando capacitação na região.`, 'Equipamentos para a prática: torre de treinamento, Layer e tripé de descida.', 'Sala de coffee break.', 'Salas de capacitação para até 35 pessoas.'],
      calamaItems: ['Salas adaptadas para até 60 pessoas.', 'Espaços exclusivos para coffee break.'],
      santiagoItems: ['Unidade localizada no coração da capital, acessível de toda a Região Metropolitana.', 'Múltiplas salas de capacitação equipadas com tecnologia audiovisual de última geração.', 'Espaço para práticas em campo e simulações controladas.', 'Café e área de descanso para participantes.'],
      online: 'Insecap Online',
      virtualTitle: 'Unidades Virtuais',
      virtualText: 'Nossa metodologia online nos permite chegar a todo o Chile com a mesma qualidade das unidades presenciais, utilizando tecnologia de ponta para a aprendizagem.',
      virtualItems: [`${new Date().getFullYear() - 2020} anos realizando capacitações online com sucesso.`, 'Plataforma LMS (Moodle) otimizada para o aluno.', 'Suporte técnico e acadêmico 24/7.'],
      mapAntof: 'Mapa Unidade Antofagasta',
      mapCalama: 'Mapa Unidade Calama',
      mapSantiago: 'Mapa Unidade Santiago',
      virtualImage: 'Aula de capacitação online da INSECAP',
      gallery: {
        sede: 'Unidade',
        close: 'Fechar',
        prev: 'Foto anterior',
        next: 'Próxima foto',
        photoAlt: (sede: string, n: number) => `Instalações da INSECAP em ${sede}, foto ${n}`,
        thumb: (n: number) => `Ver foto ${n}`,
      },
    },
  }[locale];

  // Datos de modalidades
  const modalidades = [
    { icon: <Users className="w-8 h-8 text-white" />, title: content.modalities[0], desc: content.modalitiesDesc[0], iconBg: 'bg-blue-600', border: 'border-blue-400', badge: 'bg-blue-100 text-blue-700' },
    { icon: <Video className="w-8 h-8 text-white" />, title: content.modalities[1], desc: content.modalitiesDesc[1], iconBg: 'bg-violet-600', border: 'border-violet-400', badge: 'bg-violet-100 text-violet-700' },
    { icon: <Monitor className="w-8 h-8 text-white" />, title: content.modalities[2], desc: content.modalitiesDesc[2], iconBg: 'bg-cyan-600', border: 'border-cyan-400', badge: 'bg-cyan-100 text-cyan-700' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <SEO url="/nosotros" />

      <main>
        <PageHero
          title={content.pageTitle}
          subtitle={content.pageSubtitle}
          breadcrumbs={[{ label: content.breadcrumb }]}
        />

        {/* Párrafo de respuesta (Fase 8): qué es INSECAP en 40–60 palabras, con entidades explícitas. */}
        <div className="container mx-auto px-8 md:px-14 lg:px-16 pt-12">
          <p data-respuesta="nosotros" className="max-w-4xl mx-auto text-lg leading-relaxed text-foreground">
            {getRespuestaNosotros(locale)}
          </p>
        </div>

        <MeetUs />

        {/* ¿Qué hacemos? Section */}
        <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 40%, #ecfeff 80%, #f0fdf4 100%)' }}>
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #a5b4fc, transparent 70%)' }} />
          <div className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #67e8f9, transparent 70%)' }} />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full opacity-10" style={{ background: 'radial-gradient(ellipse, #818cf8, transparent 70%)' }} />

          <div className="relative container mx-auto px-8 md:px-14 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              <div
                ref={queHacemosHeader.ref}
                className={`transition-all duration-700 ease-out mb-12 ${queHacemosHeader.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
              >
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">{content.focus}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-5">{content.whatTitle}</h2>
                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                  {content.whatText}
                </p>
              </div>

              <div ref={queHacemosCards.ref} className="grid md:grid-cols-3 gap-6">
                {modalidades.map((mod, index) => (
                  <div
                    key={index}
                    className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 p-8 flex flex-col items-center text-center border-t-4 ${mod.border} ${queHacemosCards.isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                      }`}
                    style={{
                      transitionDelay: queHacemosCards.isVisible ? queHacemosCards.getDelay(index, 150) : '0ms'
                    }}
                  >
                    <div className={`${mod.iconBg} p-4 rounded-2xl mb-5 shadow-lg`}>
                      {mod.icon}
                    </div>
                    <h3 className="font-bold text-blue-950 text-xl mb-3">{mod.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{mod.desc}</p>
                    <span className={`mt-5 inline-block text-xs font-medium px-3 py-1 rounded-full ${mod.badge}`}>
                      {content.availableMode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Acreditaciones, modalidades, sedes y cifras 2025 en tablas y listas (Fase 8). */}
        <InsecapEnDatos />

        {/* Sedes Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">

            <div
              ref={locationsHeader.ref}
              className={`transition-all duration-700 ease-out ${locationsHeader.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
            >
              <OurLocations />
            </div>

            {/* Sede Antofagasta Section */}
            <div className="mt-24 grid lg:grid-cols-2 gap-12 items-stretch">
              <div
                ref={sedeAntofText.ref}
                className={`order-2 lg:order-1 flex flex-col transition-all duration-700 ease-out ${sedeAntofText.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-12'
                  }`}
              >
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <MapPin className="w-6 h-6" />
                  <span className="font-bold uppercase tracking-wider">{content.brand}</span>
                </div>
                <h3 className="text-4xl font-bold text-blue-950 mb-6">{content.antof}</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{content.antofItems[0]}</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{content.antofItems[1]}</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{content.antofItems[2]}</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{content.antofItems[3]}</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-gray-100 flex-1 min-h-[200px]">
                  <iframe
                    title={content.mapAntof}
                    src="https://maps.google.com/maps?q=Copiapo+956+Antofagasta+Chile&output=embed&z=15"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '200px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
              <div
                ref={sedeAntofCarousel.ref}
                className={`order-1 lg:order-2 px-8 transition-all duration-700 ease-out delay-200 ${sedeAntofCarousel.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-12'
                  }`}
              >
                <Carousel
                  plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
                  opts={{ loop: true }}
                  className="w-full max-w-xl mx-auto"
                >
                  <CarouselContent>
                    {antofagastaImages.map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-lg">
                          <img src={src} alt={content.gallery.photoAlt('Antofagasta', index + 1)} width={1600} height={1200} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setAntofLightbox({ open: true, index: 0 })}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" /></svg>
                    {content.expand}
                  </button>
                </div>
              </div>
            </div>

            {/* Sede Calama Section */}
            <div className="mt-32 grid lg:grid-cols-2 gap-12 items-stretch">
              <div
                ref={sedeCalamaCarousel.ref}
                className={`px-8 transition-all duration-700 ease-out ${sedeCalamaCarousel.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-12'
                  }`}
              >
                <Carousel
                  plugins={[Autoplay({ delay: 3500, stopOnInteraction: false })]}
                  opts={{ loop: true }}
                  className="w-full max-w-xl mx-auto"
                >
                  <CarouselContent>
                    {calamaImages.map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-lg">
                          <img src={src} alt={content.gallery.photoAlt('Calama', index + 1)} width={1600} height={1200} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setCalamaLightbox({ open: true, index: 0 })}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" /></svg>
                    {content.expand}
                  </button>
                </div>
              </div>
              <div
                ref={sedeCalamaText.ref}
                className={`flex flex-col transition-all duration-700 ease-out delay-200 ${sedeCalamaText.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-12'
                  }`}
              >
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <MapPin className="w-6 h-6" />
                  <span className="font-bold uppercase tracking-wider">{content.brand}</span>
                </div>
                <h3 className="text-4xl font-bold text-blue-950 mb-6">{content.calama}</h3>
                <ul className="space-y-4">
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{content.calamaItems[0]}</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{content.calamaItems[1]}</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-gray-100 flex-1 min-h-[200px]">
                  <iframe
                    title={content.mapCalama}
                    src="https://maps.google.com/maps?q=La+Cascada+1513+Calama+Chile&output=embed&z=15"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '200px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>

            {/* Sede Santiago Section */}
            <div className="mt-32 grid lg:grid-cols-2 gap-12 items-stretch">
              <div
                ref={sedeSantiagoText.ref}
                className={`order-2 lg:order-1 flex flex-col transition-all duration-700 ease-out ${sedeSantiagoText.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-12'
                  }`}
              >
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <MapPin className="w-6 h-6" />
                  <span className="font-bold uppercase tracking-wider">{content.brand}</span>
                </div>
                <h3 className="text-4xl font-bold text-blue-950 mb-6">{content.santiago}</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{content.santiagoItems[0]}</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{content.santiagoItems[1]}</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{content.santiagoItems[2]}</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{content.santiagoItems[3]}</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-gray-100 flex-1 min-h-[200px]">
                  <iframe
                    title={content.mapSantiago}
                    src="https://maps.google.com/maps?q=Valenzuela+Castillo+1063+Santiago+Chile&output=embed&z=15"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '200px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
              <div
                ref={sedeSantiagoCarousel.ref}
                className={`order-1 lg:order-2 px-8 transition-all duration-700 ease-out delay-200 ${sedeSantiagoCarousel.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-12'
                  }`}
              >
                <Carousel
                  plugins={[Autoplay({ delay: 3200, stopOnInteraction: false })]}
                  opts={{ loop: true }}
                  className="w-full max-w-xl mx-auto"
                >
                  <CarouselContent>
                    {santiagoImages.map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-lg">
                          <img src={src} alt={content.gallery.photoAlt('Santiago', index + 1)} width={1600} height={1200} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setSantiagoLightbox({ open: true, index: 0 })}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" /></svg>
                    {content.expand}
                  </button>
                </div>
              </div>
            </div>

            {/* Sede Virtual Section */}
            <div
              ref={sedeVirtualSection.ref}
              className={`mt-32 rounded-[3rem] p-12 lg:p-20 text-white overflow-hidden relative transition-all duration-900 ease-out ${sedeVirtualSection.isVisible
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-12 scale-[0.97]'
                }`}
              style={{ background: 'linear-gradient(135deg, #0c1a6b 0%, #1a3a8f 40%, #0e7bb5 100%)' }}
            >
              {/* Orb superior derecho */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400 rounded-full blur-[140px] opacity-20 -mr-32 -mt-32 pointer-events-none" />
              {/* Orb inferior izquierdo */}
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[120px] opacity-15 -ml-24 -mb-24 pointer-events-none" />
              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
              />
              {/* Meteors */}
              <Meteors number={14} />
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-2 text-blue-400 mb-4">
                    <Monitor className="w-6 h-6" />
                    <span className="font-bold uppercase tracking-wider">{content.online}</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-6">{content.virtualTitle}</h3>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    {content.virtualText}
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-4 items-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                      <span className="text-lg">{content.virtualItems[0]}</span>
                    </li>
                    <li className="flex gap-4 items-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                      <span className="text-lg">{content.virtualItems[1]}</span>
                    </li>
                    <li className="flex gap-4 items-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                      <span className="text-lg">{content.virtualItems[2]}</span>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <img
                    src="https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/img-20190903-133957-scaled-ppg1u2wov3lkg6zm0s3v1xtbjxpl8ub1v-7b9e3d03.webp"
                    alt={content.virtualImage}
                    width={900}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="rounded-2xl shadow-2xl max-w-md w-full h-auto"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Lightbox Antofagasta */}
      {antofLightbox.open && (
        <SedeGallery
          images={antofagastaImages}
          label="Antofagasta"
          labels={content.gallery}
          index={antofLightbox.index}
          setIndex={i => setAntofLightbox(prev => ({ ...prev, index: i }))}
          onClose={() => setAntofLightbox({ open: false, index: 0 })}
        />
      )}

      {/* Lightbox Calama */}
      {calamaLightbox.open && (
        <SedeGallery
          images={calamaImages}
          label="Calama"
          labels={content.gallery}
          index={calamaLightbox.index}
          setIndex={i => setCalamaLightbox(prev => ({ ...prev, index: i }))}
          onClose={() => setCalamaLightbox({ open: false, index: 0 })}
        />
      )}

      {/* Lightbox Santiago */}
      {santiagoLightbox.open && (
        <SedeGallery
          images={santiagoImages}
          label="Santiago"
          labels={content.gallery}
          index={santiagoLightbox.index}
          setIndex={i => setSantiagoLightbox(prev => ({ ...prev, index: i }))}
          onClose={() => setSantiagoLightbox({ open: false, index: 0 })}
        />
      )}

      <Footer />
    </div>
  );
};

export default AboutUs;