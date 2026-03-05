import React from 'react';

const OurLocations: React.FC = () => {
  const mapImageUrl = "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/nosotros_cedes.svg?v=1769433643";

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Cabecera de la sección */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-2 block">
            Nuestras Sedes
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-blue-950 mb-6">
            Nos encontramos en las siguientes regiones
          </h2>

          {/* Línea decorativa con gradiente */}
          <div className="w-64 h-1.5 mx-auto bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></div>
        </div>

        {/* Contenedor de la Imagen */}
        <div className="max-w-6xl mx-auto">
          <img
            src={mapImageUrl}
            alt="Mapa de sedes regionales"
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default OurLocations;