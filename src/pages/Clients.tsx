import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { clientLogos } from '@/data/clients';
import { Marquee } from "@/components/ui/marquee";

const Clients = () => {
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
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
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

        <section className="py-20 bg-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-6">¿Quieres ser parte de nuestros clientes?</h3>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Únete a las empresas que ya están potenciando sus habilidades con Insecap. 
              Contáctanos hoy mismo para diseñar un plan a tu medida.
            </p>
            <a 
              href="/contacto" 
              className="inline-block bg-white text-blue-700 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition-colors duration-300 shadow-lg"
            >
              Contactar Ahora
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Clients;
