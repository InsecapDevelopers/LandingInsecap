'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from '@/components/ui/animated-modal';
import { Link } from 'react-router-dom';
import { BookPlusIcon } from 'lucide-react';
import { useLocalizedPath } from '@/hooks/use-localized-path';

interface AnimatedCatalogModalProps {
  onClose?: () => void;
}

export function CatalogModalContent() {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-6">
      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold">
        {t('catalogModal.intro')}
      </h4>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-950 mb-2">{t('catalogModal.available')}</h5>
          <p className="text-sm text-blue-700">{t('catalogModal.availableDesc')}</p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-950 mb-2">{t('catalogModal.continuous')}</h5>
          <p className="text-sm text-blue-700">{t('catalogModal.continuousDesc')}</p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-950 mb-2">{t('catalogModal.flexible')}</h5>
          <p className="text-sm text-blue-700">{t('catalogModal.flexibleDesc')}</p>
        </div>
      </div>
    </div>
  );
}

export function AnimatedCatalogModal() {
  const { t } = useTranslation();
  const { localizedPath } = useLocalizedPath();

  return (
    <Modal>
      <Link to={localizedPath('/cursos')}>
        <ModalTrigger 
          onClick={() => {}} 
          className="group/modal-btn inline-flex items-center justify-center relative overflow-hidden bg-white text-blue-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
        >
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            {t('catalogModal.viewCatalog')}
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-2xl z-20">
            <BookPlusIcon className="w-6 h-6" />
          </div>
        </ModalTrigger>
      </Link>
    </Modal>
  );
}
