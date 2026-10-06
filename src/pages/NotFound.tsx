import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone } from 'lucide-react';
import SEO from '@/components/SEO';
import { CONTACT_EMAIL, sedes } from '@/data/sedes';
import { useLocalizedPath } from '@/hooks/use-localized-path';

/** Teléfono de la casa matriz (NAP único de src/data/sedes.ts). */
const casaMatriz = sedes.find((sede) => sede.casaMatriz) ?? sedes[0];

const NotFound: React.FC = () => {
  const { localizedPath, locale } = useLocalizedPath();

  const content = {
    es: {
      title: '¡Ups! Página no encontrada',
      description: 'Lo sentimos, la página que estás buscando no existe o se movió a una nueva ubicación.',
      home: 'Ir al inicio',
      support: 'Si crees que esto es un error, contáctanos:',
      imageAlt: 'Capín, la mascota de INSECAP, buscando la página',
    },
    en: {
      title: 'Oops! Page Not Found',
      description: 'Sorry, the page you are looking for does not exist or has been moved to a new location.',
      home: 'Go to the home page',
      support: 'If you believe this is an error, contact us:',
      imageAlt: 'Capín, the INSECAP mascot, looking for the page',
    },
    pt: {
      title: 'Ops! Página não encontrada',
      description: 'Desculpe, a página que você procura não existe ou foi movida para um novo endereço.',
      home: 'Ir para o início',
      support: 'Se você acredita que isso é um erro, entre em contato conosco:',
      imageAlt: 'Capín, o mascote da INSECAP, procurando a página',
    },
  }[locale];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 font-['Montserrat',_sans-serif]">
      {/* Mismos metadatos que RouteMeta, más el tamaño de la og:image por defecto (RouteMeta no lo emite). */}
      <SEO />
      <div className="text-center max-w-2xl">
        
        {/* Imagen Capin - Usando la URL de Shopify para evitar problemas de exportación */}
        <div className="mb-8 flex justify-center">
          <img 
            src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Capin-19.png?v=1769112910" 
            alt={content.imageAlt}
            className="w-64 h-64 object-contain animate-bounce"
          />
        </div>

        {/* Mensaje 404 */}
        <h1 className="text-8xl font-bold text-blue-600 mb-4 drop-shadow-sm">404</h1>
        <h2 className="text-3xl font-semibold text-slate-800 mb-4">{content.title}</h2>
        <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
          {content.description}
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={localizedPath('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            {content.home}
          </Link>
        </div>

        {/* Info Adicional / Soporte: NAP de la casa matriz */}
        <address className="mt-12 pt-8 border-t border-blue-200/50 text-sm text-slate-500 not-italic">
          <p>{content.support}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 font-bold text-blue-600 mt-2 text-base">
            <a href={`tel:${casaMatriz.telefonoE164}`} className="flex items-center gap-2 hover:underline">
              <Phone className="w-4 h-4" aria-hidden="true" />
              {casaMatriz.telefono}
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 hover:underline">
              <Mail className="w-4 h-4" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </address>
      </div>
    </main>
  );
};

export default NotFound;