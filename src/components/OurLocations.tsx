import React from 'react';
import { useTranslation } from 'react-i18next';
import ChileSedesMap from './chile-map/ChileSedesMap';

const OurLocations: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-4 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-100/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-2 sm:px-4 relative z-10">
        {/* Cabecera de la sección */}
        <div className="text-center mb-3">
          <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-2 text-center">
            {t('locations.badge')}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-blue-950 mb-3">
            {t('locations.title')}
          </h2>
          <p className="hidden md:flex items-center justify-center gap-1.5 text-sm text-gray-400 mb-4">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {t('locations.mapHint')}
          </p>

          {/* Línea decorativa con gradiente */}
          <div className="w-64 h-1.5 mx-auto bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full" />
        </div>

        {/* Mapa interactivo de Chile */}
        <div className="mx-auto">
          <ChileSedesMap />
        </div>
      </div>
    </section>
  );
};

export default OurLocations;