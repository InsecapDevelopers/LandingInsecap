import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const DuaSection: React.FC = () => {
  const images = [
    "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DUA-Web_Mesa-de-trabajo-1-scaled.jpg?v=1768504112",
    "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DUA-Web-02-scaled.jpg?v=1768504131",
    "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DUA-Web-03-scaled.jpg?v=1768504179",
    "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DUA-Web-04-scaled.jpg?v=1768504200",
    "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/DUA-Web-05-scaled.jpg?v=1768504218"
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Columna Izquierda: Carrusel que se ajusta a la imagen */}
          <div className="w-full lg:w-3/5 rounded-3xl overflow-hidden shadow-2xl relative">
            <Swiper
              loop={true} 
              autoHeight={true}
              spaceBetween={0}
              centeredSlides={true}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="mySwiper w-full h-auto [&_.swiper-button-next]:text-blue-600 [&_.swiper-button-prev]:text-blue-600 [&_.swiper-pagination-bullet-active]:bg-blue-600"
            >
              {images.map((url, index) => (
                <SwiperSlide key={index}>
                  <img 
                    src={url} 
                    alt={`Metodología DUA - Diapositiva ${index + 1}`} 
                    /* Usamos w-full y h-auto para que la imagen mantenga su proporción original */
                    className="w-full h-auto block select-none"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Columna Derecha: Texto */}
          <div className="w-full lg:w-2/5">
            <div className="flex flex-col gap-6">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
                Metodología Innovadora
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Metodología <span className="text-blue-600">DUA</span> en nuestros cursos.
              </h2>
              <div className="w-24 h-2 bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full"></div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                El Diseño Universal para el Aprendizaje (DUA) es una metodología que nos permite planificar y 
                ejecutar capacitaciones efectivas y accesibles para todo tipo de personas, con distintas características, 
                habilidades y necesidades.
              </p>

              <div className="grid gap-4 mt-4">
                {[
                  'Flexibilidad en la enseñanza',
                  'Eliminación de barreras cognitivas',
                  'Potenciación del compromiso'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all hover:bg-slate-100">
                    <div className="bg-blue-600 w-2 h-2 rounded-full"></div>
                    <span className="text-slate-800 font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DuaSection;