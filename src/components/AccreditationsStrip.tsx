import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// width/height intrínsecos (reservan la proporción). Los logos están en Spaces en WebP a ~2x de su render.
const topLogos = [
  { src: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/logosence-png-0bbdd899.webp', alt: 'SENCE', width: 308, height: 132 },
  { src: '/logos/SELLO_2728.svg', alt: 'NCh2728', width: 261, height: 235 },
  { src: '/logos/CCS.png', alt: 'Cámara de Comercio de Santiago', width: 438, height: 124 },
  { src: '/images/logos/sicep.webp', alt: 'SICEP', width: 298, height: 128 },
];

const bottomLogos = [
  { src: 'https://storageisecap.sfo2.digitaloceanspaces.com/repositorio/catalogo-web/imagen-2026-02-27-085941459-0929b47e.webp', alt: 'ISO 9001', width: 963, height: 865 },
  { src: '/images/logos/sello-codelco.webp', alt: 'OTEC Acreditada por Codelco', width: 217, height: 224 },
  { src: '/images/logos/sello-ccm.webp', alt: 'Consejo de Competencias Mineras', width: 300, height: 160 },
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
            {topLogos.map((logo, i) => (
              <motion.img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                decoding="async"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
                whileHover={{ scale: 1.12, transition: { duration: 0.25, delay: 0 } }}
                className="h-10 md:h-14 w-auto object-contain cursor-pointer"
                loading="lazy"
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {bottomLogos.map((logo, i) => (
              <motion.img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                decoding="async"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + (topLogos.length + i) * 0.15, ease: 'easeOut' }}
                whileHover={{ scale: 1.12, transition: { duration: 0.25, delay: 0 } }}
                className={`w-auto object-contain cursor-pointer ${
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
