import React from 'react';
import { Link } from 'react-router-dom'; // O 'next/link' si usas Next.js
import { Home, LogIn, Phone } from 'lucide-react';

const NotFound: React.FC = () => {
  // Nota: Asegúrate de tener la fuente Montserrat cargada en tu index.html o layout
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 font-['Montserrat',_sans-serif]">
      <div className="text-center max-w-2xl">
        
        {/* Imagen Capin - Usando la URL de Shopify para evitar problemas de exportación */}
        <div className="mb-8 flex justify-center">
          <img 
            src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Capin-19.png?v=1769112910" 
            alt="Capin 404" 
            className="w-64 h-64 object-contain animate-bounce"
          />
        </div>

        {/* Mensaje 404 */}
        <h1 className="text-8xl font-bold text-blue-600 mb-4 drop-shadow-sm">404</h1>
        <h2 className="text-3xl font-semibold text-slate-800 mb-4">
          ¡Ups! Página No Encontrada
        </h2>
        <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida a una nueva ubicación.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-5 h-5" />
            Ir al Inicio
          </Link>
          
          <Link
            to="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-lg border-2 border-blue-500 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5" />
            Iniciar Sesión
          </Link>
        </div>

        {/* Info Adicional / Soporte */}
        <div className="mt-12 pt-8 border-t border-blue-200/50 text-sm text-slate-500">
          <p>Si crees que esto es un error, contacta con soporte:</p>
          <div className="flex items-center justify-center gap-2 font-bold text-blue-600 mt-2 text-base">
            <Phone className="w-4 h-4" />
            <a href="tel:+56932594403" className="hover:underline">
              +56 9 3259 4403
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;