'use client';
import React from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from '@/components/ui/animated-modal';
import { Link } from 'react-router-dom';
import { BookPlusIcon } from 'lucide-react';

interface AnimatedCatalogModalProps {
  onClose?: () => void;
}

export function CatalogModalContent() {
  return (
    <div className="text-center space-y-6">
      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold">
        Explora nuestro catálogo de cursos
      </h4>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-2">Cursos Disponibles</h5>
          <p className="text-sm text-blue-700">Accede a una amplia variedad de programas educativos diseñados para potenciar tus habilidades profesionales.</p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-2">Capacitación Continua</h5>
          <p className="text-sm text-blue-700">Mantente actualizado con nuestros cursos de capacitación continua adaptados a las tendencias del mercado.</p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-2">Flexibilidad Horaria</h5>
          <p className="text-sm text-blue-700">Estudia a tu propio ritmo con opciones presenciales, online e híbridas.</p>
        </div>
      </div>
    </div>
  );
}

export function AnimatedCatalogModal() {
  return (
    <Modal>
      <Link to="/cursos">
        <ModalTrigger 
          onClick={() => {}} 
          className="group/modal-btn inline-flex items-center justify-center relative overflow-hidden bg-white text-blue-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
        >
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            Ver Catálogo
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-2xl z-20">
            <BookPlusIcon className="w-6 h-6" />
          </div>
        </ModalTrigger>
      </Link>
    </Modal>
  );
}
