import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const PAGE_HERO_IMAGES = [
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2026-03-05_at_10.58.32_2.jpg?v=1772742132',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2026-03-05_at_10.58.32_1.jpg?v=1772742132',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2026-03-05_at_10.58.32.jpg?v=1772742131',
];

const pickRandom = (exclude?: string) => {
  const options = PAGE_HERO_IMAGES.filter((img) => img !== exclude);
  return options[Math.floor(Math.random() * options.length)];
};

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

const PageHero = ({ 
  title, 
  subtitle, 
  backgroundImage,
  breadcrumbs,
  className
}: PageHeroProps) => {
  const location = useLocation();
  const { localizedPath } = useLocalizedPath();
  const [activeBg, setActiveBg] = useState(backgroundImage ?? pickRandom());
  const [visible, setVisible] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (backgroundImage) return;
    // fade out → swap → fade in
    setVisible(false);
    const swap = setTimeout(() => {
      setActiveBg((prev) => pickRandom(prev));
      setVisible(true);
    }, 300);
    return () => clearTimeout(swap);
  }, [location.pathname, backgroundImage]);

  return (
    <section 
      className={`relative w-full h-[450px] flex items-center overflow-hidden ${className || ''}`}
    >
      <div className="absolute inset-0 z-0">
        <img 
          src={activeBg}
          alt="Background"
          className="w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: visible ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="container mx-auto px-8 md:px-14 lg:px-16 relative z-10 pt-20">
        <div className="max-w-3xl">
          <span className="text-blue-400 font-semibold uppercase tracking-wider text-sm mb-4 block animate-in fade-in slide-in-from-left-4 duration-700">
            {subtitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-in fade-in slide-in-from-left-6 duration-1000">
            {title}
          </h1>
          <nav className="flex text-sm text-slate-300 gap-2 items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link to={localizedPath('/')} className="hover:text-blue-400 transition-colors">Inicio</Link>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <span className="text-slate-500">/</span>
                {item.href ? (
                  <Link to={localizedPath(item.href)} className="hover:text-blue-400 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
};

export default PageHero;