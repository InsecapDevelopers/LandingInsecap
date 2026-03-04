import React from 'react';

const MeetUs: React.FC = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Columna Izquierda - Imagen */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full aspect-square md:aspect-auto md:h-[400px]">
              <img
                src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Quienes-Somos-Collage-01-2400x1356.jpg?v=1767876559"
                alt="Quiénes Somos Collage"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Columna Derecha - Contenido de Texto */}
          <div className="flex flex-col gap-6 order-1 lg:order-2">
            {/* Subtítulo */}
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-wide">
              Conócenos
            </p>

            {/* Título Principal */}
            <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              Quienes somos
            </h2>

            {/* Párrafo Descriptivo */}
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              Somos un Organismo Técnico de Capacitación, líder, entregando soluciones
              a lo largo del país, aplicando metodologías de vanguardia, con el fin de asegurar
              el aprendizaje efectivo en diversas disciplinas.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MeetUs;
