import React from 'react';
import { Users, Monitor, Video, MapPin, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MeetUs from '@/components/MeetUs';
import OurLocations from '@/components/OurLocations';
import PageHero from '@/components/PageHero';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/use-scroll-animation';
import { Meteors } from '@/components/ui/meteors';
import { getYearsOfExperience } from '@/lib/insecapUtils';
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
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sede-Antofagasta-web.jpg?v=1768245326",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_4089-scaled-ppg1t52i12b8u8cridhak6cq62cdjqkpr69u9a0oqo.jpg?v=1769177894",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_4072-scaled-ppg1t52i12b8u8cridhak6cq62cdjqkpr69u9a0oqo.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_3690-scaled-ppg1t52i12b8u8cridhak6cq62cdjqkpr69u9a0oqo.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_3949-scaled-ppg1t52i12b8u8cridhak6cq62cdjqkpr69u9a0oqo.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_3841-scaled-ppg1t52i12b8u8cridhak6cq62cdjqkpr69u9a0oqo.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_4042-scaled-ppg1t52i12b8u8cridhak6cq62cdjqkpr69u9a0oqo.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_3775-scaled-ppg1t52i12b8u8cridhak6cq62cdjqkpr69u9a0oqo.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_3738-scaled-ppg1t52i12b8u8cridhak6cq62cdjqkpr69u9a0oqo.jpg?v=1769177894"
];

const santiagoImages = [
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Cascada-fachada-y-letrero-scaled.jpg?v=1767971535",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Banner-Nosotros-Web-16-anos-scaled.jpg?v=1767878773",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_111938161.png?v=1772461187",
];

const calamaImages = [
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/sede-calama.jpg?v=1768245410",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_5579-scaled-ppg1uafedrvv12oosvcvlvx0b0oiyf4wkuz7dgbd4w.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_5628-scaled-ppg1uafedrvv12oosvcvlvx0b0oiyf4wkuz7dgbd4w.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_5647-scaled-ppg1ubd8klx5conbndri6dogwejw648mwzmouq9yyo.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_5664-scaled-ppg1ubd8klx5conbndri6dogwejw648mwzmouq9yyo.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_5672-scaled-ppg1ubd8klx5conbndri6dogwejw648mwzmouq9yyo.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_5700-scaled-ppg1ubd8klx5conbndri6dogwejw648mwzmouq9yyo.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_5720-scaled-ppg1ucb2rfyfoalyhw64qvfxhsf9dtcd94a6c08ksg.jpg?v=1769177893",
  "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DSC_5728-scaled-ppg1ucb2rfyfoalyhw64qvfxhsf9dtcd94a6c08ksg.jpg?v=1769177893"
];

const AboutUs = () => {
  // Animaciones de scroll
  const queHacemosHeader = useScrollAnimation({ threshold: 0.2 });
  const queHacemosCards = useStaggerAnimation({ threshold: 0.15 });
  const locationsHeader = useScrollAnimation({ threshold: 0.2 });
  const sedeAntofText = useScrollAnimation({ threshold: 0.15 });
  const sedeAntofCarousel = useScrollAnimation({ threshold: 0.15 });
  const sedeCalamaText = useScrollAnimation({ threshold: 0.15 });
  const sedeCalamaCarousel = useScrollAnimation({ threshold: 0.15 });
  const sedeSantiagoText = useScrollAnimation({ threshold: 0.15 });
  const sedeSantiagoCarousel = useScrollAnimation({ threshold: 0.15 });
  const sedeVirtualSection = useScrollAnimation({ threshold: 0.1 });

  // Datos de modalidades
  const modalidades = [
    { icon: <Users className="w-8 h-8 text-white" />, title: 'Presencial', desc: 'En nuestras instalaciones o donde el cliente disponga.' },
    { icon: <Video className="w-8 h-8 text-white" />, title: 'Sincrónico', desc: 'Plataformas electrónicas con clases en vivo vía streaming.' },
    { icon: <Monitor className="w-8 h-8 text-white" />, title: 'Asincrónico', desc: 'Entrenamiento de autoinstrucción en plataforma Moodle.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <PageHero
          title={`Más de ${getYearsOfExperience()} años de experiencia`}
          subtitle="Nosotros"
          breadcrumbs={[{ label: "Nosotros" }]}
        />

        <MeetUs />

        {/* ¿Qué hacemos? Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            <div className="max-w-4xl mx-auto mb-20 text-center">
              <div
                ref={queHacemosHeader.ref}
                className={`transition-all duration-700 ease-out ${queHacemosHeader.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                  }`}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6">¿Qué hacemos?</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Entregamos soluciones de capacitación y entrenamientos a la medida.
                  Interactuamos con partes interesadas y usuarios finales para que la
                  solución sea la que requiere cada cliente.
                </p>
              </div>

              <div ref={queHacemosCards.ref} className="grid md:grid-cols-3 gap-8 text-left">
                {modalidades.map((mod, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center text-center transition-all duration-500 ${queHacemosCards.isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                      }`}
                    style={{
                      transitionDelay: queHacemosCards.isVisible ? queHacemosCards.getDelay(index, 150) : '0ms'
                    }}
                  >
                    <div className="bg-blue-600 p-4 rounded-full mb-4">
                      {mod.icon}
                    </div>
                    <h4 className="font-bold text-blue-950 text-xl mb-2">{mod.title}</h4>
                    <p className="text-gray-600 text-sm">{mod.desc}</p>
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
                  <span className="font-bold uppercase tracking-wider">Insecap Capacitación</span>
                </div>
                <h3 className="text-4xl font-bold text-blue-950 mb-6">Sede Antofagasta</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>{new Date().getFullYear() - 2010} años realizando capacitación en la región.</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>Equipamiento para proceso práctico: torre de entrenamiento, Layer, trípode de descenso.</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>Salón de coffee break.</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>Salas de capacitación hasta 35 personas.</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-gray-100 flex-1 min-h-[200px]">
                  <iframe
                    title="Mapa Sede Antofagasta"
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
                  <span className="font-bold uppercase tracking-wider">Insecap Capacitación</span>
                </div>
                <h3 className="text-4xl font-bold text-blue-950 mb-6">Sede Calama</h3>
                <ul className="space-y-4">
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>Salones adaptados hasta 60 personas.</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>Coffee break exclusivos.</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-gray-100 flex-1 min-h-[200px]">
                  <iframe
                    title="Mapa Sede Calama"
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
                  <span className="font-bold uppercase tracking-wider">Insecap Capacitación</span>
                </div>
                <h3 className="text-4xl font-bold text-blue-950 mb-6">Sede Santiago</h3>
                <ul className="space-y-4 mb-8">
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>Sede ubicada en el corazón de la capital, accesible desde toda la Región Metropolitana.</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>Múltiples salas de capacitación equipadas con tecnología audiovisual de última generación.</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>Espacio para prácticas en terreno y simulaciones controladas.</span>
                  </li>
                  <li className="flex gap-4 text-gray-600 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                    <span>Café y área de descanso para participantes.</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-2xl overflow-hidden shadow-md border border-gray-100 flex-1 min-h-[200px]">
                  <iframe
                    title="Mapa Sede Santiago"
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
                    <span className="font-bold uppercase tracking-wider">Insecap Online</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-6">Sedes Virtuales</h3>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    Nuestra metodología online permite llegar a todo Chile con la misma calidad
                    que nuestras sedes físicas, utilizando tecnología de vanguardia para el aprendizaje.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-4 items-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                      <span className="text-lg">{new Date().getFullYear() - 2020} años realizando capacitaciones online con éxito.</span>
                    </li>
                    <li className="flex gap-4 items-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                      <span className="text-lg">Plataforma LMS (Moodle) optimizada para el alumno.</span>
                    </li>
                    <li className="flex gap-4 items-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                      <span className="text-lg">Soporte técnico y académico 24/7.</span>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/IMG_20190903_133957-scaled-ppg1u2wov3lkg6zm0s3v1xtbjxpl8ub1vtrbj8miio.jpg?v=1769177894"
                    alt="Sede Virtual"
                    className="rounded-2xl shadow-2xl max-w-md w-full"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;