import React, { useState } from 'react';
import { Users, Monitor, Video, MapPin, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MeetUs from '@/components/MeetUs';
import OurLocations from '@/components/OurLocations';
import PageHero from '@/components/PageHero';
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
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sede-Antofagasta_2025.jpg?v=1773425188",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp-Image-2026-01-19-at-09.32.40.jpg?v=1773425188",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sala-2-Antofa_1675-scaled.jpg?v=1773425188",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp-Image-2026-01-21-at-09.11.04.jpg?v=1773425188",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp-Image-2026-01-16-at-16.11.18.jpg?v=1773425188",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sala-1-Antofa_1638-scaled.jpg?v=1773425188",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp-Image-2025-11-10-at-17.23.41-1.jpg?v=1773425189",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Presencialt-092031.jpg?v=1773425188",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/IMG_1593-scaled.jpg?v=1773425189",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Gemini_Generated_Image_2s9gzo2s9gzo2s9g_18cf6377-0427-4e98-9eda-c5a212cb6e03.png?v=1773425190",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Gemini_Generated_Image_fhyf58fhyf58fhyf_348fb4bf-e08f-4152-8505-b6643fa9ac81.png?v=1773425190",
];

const santiagoImages = [
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sede_Santiago_web.jpg?v=1776094293",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2024-04-03_at_12.56.34_PM.jpg?v=1776094308",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2026-01-07_at_09.22.34.jpg?v=1776094309",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2025-11-20_at_09.13.03.jpg?v=1776094309",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2025-08-12_at_09.23.16.jpg?v=1776094310",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2025-10-10_at_16.02.21.jpg?v=1776094309",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/E-Sala_3_Image_2024-08-05_at_13.17.20.jpg?v=1776094309",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2025-10-14_at_15.54.11_1.jpg?v=1776094309",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sala_Stgo-Salon2_1714.jpg?v=1776094309",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sala_E-Stgo-Salon1_7390.jpg?v=1776094309",
];

const calamaImages = [
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sede-Cascada-M-scaled.jpg?v=1773424088",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/GHorquilla3675_web.jpg?v=1773345899",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Toconao-13.59.37.jpg?v=1773424087",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp-Image-2025-11-08-at-09.58.59.jpg?v=1773424087",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Presencial-095357.jpg?v=1773424087",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Salon-Break-104615.jpg?v=1773424087",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sala-Zen135934-1.jpg?v=1773424087",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/San-Pedro-124306-6.jpg?v=1773424088",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Lasana-IMG_3964-scaled.jpg?v=1773424088",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Caspana-IMG_3949-scaled.jpg?v=1773424088",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Presencial-094101.jpg?v=1773424088",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Toconce-IMG_3603-scaled.jpg?v=1773424088",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/GHorquilla3675_web_6f410fbf-8a24-4820-bfc2-acf479adc4ca.jpg?v=1773424088",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Computacion-IMG_3527-scaled.jpg?v=1773424088",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Simulador-Cabina-173107-7.jpg?v=1773424088",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Soldadura-1009177.jpg?v=1773424089",
];

// ─── Lightbox compartido para todas las sedes ────────────────────────────────
const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" />
  </svg>
);

interface SedeGalleryProps {
  images: string[];
  label: string;
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}

const SedeGallery = ({ images, label, index, setIndex, onClose }: SedeGalleryProps) => {
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
        <span className="text-white/60 text-sm font-medium tracking-wide">Sede {label}</span>
        <span className="text-white/50 text-sm tabular-nums">{index + 1} / {images.length}</span>
        <button
          onClick={onClose}
          aria-label="Cerrar"
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
            aria-label="Anterior"
            className="absolute left-0 z-10 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors -translate-x-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            key={index}
            src={images[index]}
            alt={`${label} ${index + 1}`}
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />

          {/* Botón siguiente */}
          <button
            onClick={next}
            aria-label="Siguiente"
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
            className={`shrink-0 w-14 h-full rounded-lg overflow-hidden border-2 transition-all ${i === index ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-75'}`}
          >
            <img src={src} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
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
      virtualImage: 'Sede Virtual',
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
      virtualImage: 'Virtual campus',
    },
    pt: {
      pageTitle: `Mais de ${getYearsOfExperience()} anos de experiencia`,
      pageSubtitle: 'Sobre nos',
      breadcrumb: 'Sobre nos',
      focus: 'Nosso enfoque',
      whatTitle: 'O que fazemos?',
      whatText: 'Entregamos solucoes de capacitacao e treinamentos sob medida. Interagimos com as partes interessadas e usuarios finais para que a solucao atenda exatamente o que cada cliente precisa.',
      availableMode: 'Modalidade disponivel',
      modalities: ['Presencial', 'Sincrono', 'Assincrono'],
      modalitiesDesc: ['Em nossas instalacoes ou onde o cliente indicar.', 'Plataformas digitais com aulas ao vivo via streaming.', 'Treinamento autodirigido na plataforma Moodle.'],
      brand: 'Insecap Capacitacao',
      antof: 'Unidade Antofagasta',
      calama: 'Unidade Calama',
      santiago: 'Unidade Santiago',
      expand: 'Expandir',
      antofItems: [`${new Date().getFullYear() - 2010} anos realizando capacitacao na regiao.`, 'Equipamentos para pratica: torre de treinamento, Layer e tripode de descida.', 'Sala de coffee break.', 'Salas de capacitacao para ate 35 pessoas.'],
      calamaItems: ['Salas adaptadas para ate 60 pessoas.', 'Espacos exclusivos para coffee break.'],
      santiagoItems: ['Unidade localizada no coracao da capital, acessivel de toda a Regiao Metropolitana.', 'Multiplas salas de capacitacao equipadas com tecnologia audiovisual de ultima geracao.', 'Espaco para praticas em campo e simulacoes controladas.', 'Cafe e area de descanso para participantes.'],
      online: 'Insecap Online',
      virtualTitle: 'Unidades Virtuais',
      virtualText: 'Nossa metodologia online nos permite chegar a todo o Chile com a mesma qualidade das unidades fisicas, utilizando tecnologia de ponta para aprendizagem.',
      virtualItems: [`${new Date().getFullYear() - 2020} anos realizando capacitacoes online com sucesso.`, 'Plataforma LMS (Moodle) otimizada para o aluno.', 'Suporte tecnico e academico 24/7.'],
      mapAntof: 'Mapa Unidade Antofagasta',
      mapCalama: 'Mapa Unidade Calama',
      mapSantiago: 'Mapa Unidade Santiago',
      virtualImage: 'Unidade virtual',
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

      <main>
        <PageHero
          title={content.pageTitle}
          subtitle={content.pageSubtitle}
          breadcrumbs={[{ label: content.breadcrumb }]}
        />

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
                    <h4 className="font-bold text-blue-950 text-xl mb-3">{mod.title}</h4>
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
                          <img src={src} alt={`Antofagasta ${index + 1}`} className="w-full h-full object-cover" />
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
                          <img src={src} alt={`Calama ${index + 1}`} className="w-full h-full object-cover" />
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
                    src="https://maps.google.com/maps?q=Valenzuela+Castillos+1063+Santiago+Chile&output=embed&z=15"
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
                          <img src={src} alt={`Santiago ${index + 1}`} className="w-full h-full object-cover" />
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
                    src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/IMG_20190903_133957-scaled-ppg1u2wov3lkg6zm0s3v1xtbjxpl8ub1vtrbj8miio.jpg?v=1776094514"
                    alt={content.virtualImage}
                    className="rounded-2xl shadow-2xl max-w-md w-full"
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