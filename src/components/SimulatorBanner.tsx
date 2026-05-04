import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { useTranslation } from 'react-i18next';

const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const SimulatorBanner = () => {
  const { localizedPath } = useLocalizedPath();
  const { i18n } = useTranslation();

  const content = {
    es: {
      label: 'CAPACITACIÓN EN SIMULACIÓN',
      title: 'SIMULADORES\nDISPONIBLES',
      cta: 'VER SIMULADORES',
    },
    en: {
      label: 'SIMULATION TRAINING',
      title: 'AVAILABLE\nSIMULATORS',
      cta: 'VIEW SIMULATORS',
    },
    pt: {
      label: 'TREINAMENTO EM SIMULACAO',
      title: 'SIMULADORES\nDISPONIVEIS',
      cta: 'VER SIMULADORES',
    },
  };

  const lang = (i18n.language?.split('-')[0] || 'es') as 'es' | 'en' | 'pt';
  const messages = content[lang] || content['es'];

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-24 md:py-32 lg:py-40 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(15, 23, 42, 0.8)), url('https://cdn.shopify.com/s/files/1/0711/9827/7676/files/banner_caex.png?v=1776263507')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-8 md:px-14 lg:px-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <Badge className="inline-block mb-6 bg-insecap-blue text-white border-0 px-4 py-2 text-sm font-semibold uppercase">
              {messages.label}
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h2
            custom={1}
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight font-montserrat"
          >
            {messages.title.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </motion.h2>

          {/* CTA Button */}
          <motion.div
            custom={2}
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            <Link to={localizedPath('/simuladores')}>
              <Button
                size="lg"
                className="bg-insecap-blue hover:bg-insecap-blue/90 text-white font-bold uppercase tracking-wide px-8 py-3 h-auto text-base"
              >
                {messages.cta}
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SimulatorBanner;
