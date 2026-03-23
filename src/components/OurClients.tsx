import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { clientLogos } from '@/data/clients';
import { Marquee } from "@/components/ui/marquee";
import { useLocalizedPath } from '@/hooks/use-localized-path';

const bounceVariant = {
    hidden: { y: 0 },
    visible: {
        y: [0, -14, 0, -10, 0, -5, 0],
        transition: {
            duration: 1.2,
            ease: 'easeOut' as const,
            repeat: Infinity,
            repeatDelay: 2.5
        },
    },
};

const OurClients: React.FC = () => {
    const { t } = useTranslation();
    const { localizedPath } = useLocalizedPath();

    return (
        <section className="w-full bg-white py-12 flex flex-col items-center overflow-hidden">
            <div className="container mx-auto px-8 md:px-14 lg:px-16 mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
                    {t('ourClients.title')}
                </h2>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-white mb-12">
                <Marquee pauseOnHover className="[--duration:40s]">
                    {clientLogos.map((logo, index) => (
                        <div key={index} className="flex shrink-0 items-center justify-center px-10">
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                className="h-16 md:h-20 w-auto object-contain transition-all duration-300"
                            />
                        </div>
                    ))}
                </Marquee>

                {/* Gradientes laterales para suavizar la entrada/salida de logos */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white"></div>
            </div>

            {/* Botón CTA - con animación bounce */}
            <motion.div
                variants={bounceVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.5 }}
            >
                <Link to={localizedPath('/nuestros-clientes')} className="group/modal-btn inline-flex items-center justify-center relative overflow-hidden bg-blue-700 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-800 transition-colors duration-300 shadow-md">
                    <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                        {t('ourClients.clickHere')}
                    </span>
                    <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-2xl z-20">
                        <Users className="w-6 h-6" />
                    </div>
                </Link>
            </motion.div>
        </section>
    );
};

export default OurClients;