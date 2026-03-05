import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { clientLogos } from '@/data/clients';
import { Marquee } from "@/components/ui/marquee";
import { getLiderComercial, LiderComercial } from '@/lib/tmsApi';

const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const Clients = () => {
  const [lider, setLider] = useState<LiderComercial | null>(null);
  const [liderLoading, setLiderLoading] = useState(true);

  useEffect(() => {
    getLiderComercial().then((data) => {
      setLider(data);
      setLiderLoading(false);
    });
  }, []);

  const waPhone = lider?.telefono?.replace(/\D/g, '') ?? '56988198254';
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent('Hola, me interesa ser parte de los clientes de Insecap. ¿Podemos conversar?')}`;

  // Dividimos los logos en dos grupos para las dos filas de la marquesina
  const firstRow = clientLogos.slice(0, Math.ceil(clientLogos.length / 2));
  const secondRow = clientLogos.slice(Math.ceil(clientLogos.length / 2));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <PageHero 
          title="Nuestros Clientes"
          subtitle="Empresas que confían en nosotros"
          breadcrumbs={[{ label: "Clientes" }]}
        />

        <section className="py-20 bg-slate-50 overflow-hidden">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            <div className="max-w-4xl mx-auto mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">
                Alianzas Estratégicas
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Trabajamos de la mano con las empresas líderes en el sector, 
                brindando soluciones de capacitación personalizadas que impulsan 
                el desarrollo de su capital humano.
              </p>
            </div>

            <div className="relative flex flex-col gap-8 w-full">
              {/* Primera Fila de Marquesina */}
              <Marquee pauseOnHover className="[--duration:40s]">
                {firstRow.map((logo, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 md:p-8 mx-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group min-w-[200px] h-[120px]"
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="max-h-16 md:max-h-20 w-auto object-contain transition-all duration-500"
                    />
                  </div>
                ))}
              </Marquee>

              {/* Segunda Fila de Marquesina (en reversa) */}
              <Marquee reverse pauseOnHover className="[--duration:45s]">
                {secondRow.map((logo, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 md:p-8 mx-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group min-w-[200px] h-[120px]"
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="max-h-16 md:max-h-20 w-auto object-contain transition-all duration-500"
                    />
                  </div>
                ))}
              </Marquee>

              {/* Gradientes laterales */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50"></div>
            </div>
          </div>
        </section>

        <section
          className="relative py-20 overflow-hidden"
          style={{ backgroundImage: 'url(\'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/E-Sala-6-Image-2024-08-05-at-13.13.42-2.jpg?v=1769004992\')', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-blue-800 bg-opacity-75 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900 opacity-40" />

          <div className="relative z-10 container mx-auto px-8 md:px-14 lg:px-16">
            <div className="max-w-xl">
              <motion.h3
                custom={0}
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                ¿Quieres ser parte de nuestros clientes?
              </motion.h3>

              <motion.p
                custom={1}
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                className="text-blue-100 text-lg mb-10 leading-relaxed"
              >
                Únete a las empresas que ya están potenciando sus habilidades con Insecap.
                Contáctanos hoy mismo para diseñar un plan a tu medida.
              </motion.p>

              <motion.div
                custom={2}
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                className="flex flex-col gap-3"
              >
                {liderLoading ? (
                  <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium py-3 px-5 rounded-full">
                    <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    Obteniendo el líder comercial, espera un momento para contactar…
                  </div>
                ) : (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-blue-700 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition-colors duration-300 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-600">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Hablar con el líder comercial
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Clients;
