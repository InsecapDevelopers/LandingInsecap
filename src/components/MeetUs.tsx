import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MeetUs: React.FC = () => {
  const { t } = useTranslation();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageSrc = "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Quienes-Somos-Collage-01-2400x1356.jpg?v=1776094555";

  return (
    <section className="py-16 lg:py-24">
      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={imageSrc}
            alt={t('meetUs.imageAlt')}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Columna Izquierda - Imagen */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div
              className="relative w-full cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={imageSrc}
                alt={t('meetUs.imageAlt')}
                className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              />
            </div>
          </div>

          {/* Columna Derecha - Contenido de Texto */}
          <div className="flex flex-col gap-6 order-1 lg:order-2">
            {/* Subtítulo */}
            <p className="text-blue-500 text-sm font-semibold uppercase tracking-wide">
              {t('meetUs.badge')}
            </p>

            {/* Título Principal */}
            <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              {t('meetUs.title')}
            </h2>

            {/* Párrafo Descriptivo */}
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              {t('meetUs.description')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MeetUs;
