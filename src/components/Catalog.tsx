import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AnimatedCatalogModal } from './CatalogModal';

const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const Catalog: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section
      className="w-full h-[400px] md:h-[500px] bg-cover bg-center relative flex items-center backdrop-blur-sm"
      style={{
        backgroundImage: `url('https://cdn.shopify.com/s/files/1/0711/9827/7676/files/E-Sala-6-Image-2024-08-05-at-13.13.42-2.jpg?v=1769004992')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-800 bg-opacity-70 backdrop-blur-sm"></div>

      {/* Gradient overlay al pie (opcional) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900 opacity-40"></div>

      {/* Blur transition effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-transparent to-white/5"></div>

      {/* Contenido */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="container mx-auto px-8 md:px-14 lg:px-16">
          <div className="max-w-xl">
            {/* Título Principal */}
            <motion.h1
              custom={0}
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            >
              {t('catalog.title')}
            </motion.h1>

            {/* Descripción */}
            <motion.p
              custom={1}
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="text-lg text-white leading-relaxed mb-8"
            >
              {t('catalog.description')}
            </motion.p>

            {/* Botón CTA */}
            <motion.div
              custom={2}
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <AnimatedCatalogModal />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Catalog;
export { Catalog };
