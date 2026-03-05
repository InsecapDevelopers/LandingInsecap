import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

const BeRelator = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <PageHero 
          title="TRABAJA CON NOSOTROS"
          subtitle="Insecap Capacitación"
          breadcrumbs={[{ label: "TRABAJA CON NOSOTROS" }]}
        />

        <section className="py-20 bg-slate-50 relative overflow-hidden">
          {/* Fondo decorativo similar al de referencia */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
             <img 
               src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Insecap_Logo-07.png?v=1767801508" 
               className="absolute -right-20 -bottom-20 w-1/2 rotate-12"
               alt=""
             />
          </div>

          <div className="container mx-auto px-8 md:px-14 lg:px-16 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h3 className="text-2xl font-bold text-blue-600 mb-4 uppercase tracking-tight">Insecap Capacitación</h3>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
                <p>
                  Estamos en constante búsqueda de talento apasionado por la enseñanza y la capacitación. 
                  Si eres un relator de capacitación con experiencia y compromiso por compartir tu conocimiento, 
                  te invitamos a formar parte de nuestro dinámico equipo de facilitadores.
                </p>
                <p>
                  Para iniciar el proceso, te pedimos que completes nuestro formulario de contacto. 
                  En él, podrás proporcionarnos información sobre tu experiencia, áreas de especialización 
                  y cómo crees que puedes contribuir a nuestro equipo.
                </p>
              </div>
            </div>

            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
              <div className="w-full flex justify-center p-0 md:p-4">
                <iframe 
                  src="https://tms.insecap.cl/Relator/TrabajaConNosotros" 
                  width="1000" 
                  height="1100"
                  className="w-full border-none min-h-[1100px]"
                  title="Formulario Trabaja con Nosotros"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BeRelator;
