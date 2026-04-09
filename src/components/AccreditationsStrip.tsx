import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const topLogos = [
  { src: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logosence_png.png?v=1772478498', alt: 'SENCE' },
  { src: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logo_slogan.svg?v=1772193702', alt: 'NCh2728' },
  { src: '/logos/CCS.png', alt: 'Cámara de Comercio de Santiago' },
  { src: '/logos/SICEP.png', alt: 'SICEP' },
];

const bottomLogos = [
  { src: 'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-02-27_085941459.png?v=1772193585', alt: 'ISO 9001' },
  { src: '/logos/Sello Acreditado Codelco Color.png', alt: 'OTEC Acreditada por Codelco' },
  { src: '/logos/Sello CCM Color.png', alt: 'Consejo de Competencias Mineras' },
];

const AccreditationsStrip = () => {
  const { t } = useTranslation();

  return (
    <div className="relative z-30 -mt-16 mb-8">
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-xl px-8 py-8 md:px-12 md:py-10"
        >
          <h3 className="text-center text-sm md:text-base font-bold uppercase tracking-[0.2em] text-primary mb-8">
            {t('hero.accreditationsSubtitle', 'Certificaciones y Membresías que avalan nuestra calidad')}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-6">
            {topLogos.map((logo) => (
              <motion.img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                whileHover={{ scale: 1.1 }}
                className="h-10 md:h-14 w-auto object-contain hover:scale-110 transition-transform duration-300 cursor-pointer"
                loading="lazy"
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {bottomLogos.map((logo) => (
              <motion.img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                whileHover={{ scale: 1.1 }}
                className={`w-auto object-contain hover:scale-110 transition-transform duration-300 cursor-pointer ${
                  logo.alt === 'OTEC Acreditada por Codelco' ? 'h-20 md:h-28' : 'h-14 md:h-20'
                }`}
                loading="lazy"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccreditationsStrip;
