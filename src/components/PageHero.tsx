import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { buildBreadcrumbJsonLd, serializeJsonLd } from '@/lib/jsonld';

const PAGE_HERO_IMAGES = [
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2026-03-05_at_10.58.32_2.jpg?v=1772742132',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2026-03-05_at_10.58.32_1.jpg?v=1772742132',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/WhatsApp_Image_2026-03-05_at_10.58.32.jpg?v=1772742131',
];

/** Imagen fija por ruta (hash del pathname): el HTML prerenderizado y la hidratación eligen la
 *  misma, y cada página conserva su fondo entre visitas. */
const pickForPath = (pathname: string) => {
  let hash = 0;
  for (let i = 0; i < pathname.length; i++) {
    hash = (hash * 31 + pathname.charCodeAt(i)) >>> 0;
  }
  return PAGE_HERO_IMAGES[hash % PAGE_HERO_IMAGES.length];
};

interface BreadcrumbItem {
  label: string;
  /** Ruta sin prefijo de idioma; el último elemento (página actual) va sin href. */
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
  const { t } = useTranslation();
  const [activeBg, setActiveBg] = useState(backgroundImage ?? pickForPath(location.pathname));
  const [visible, setVisible] = useState(true);
  const isFirstRender = useRef(true);
  // BreadcrumbList (Fase 4) con los mismos elementos que el breadcrumb visible.
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: t('header.nav.home'), path: localizedPath('/') },
      ...breadcrumbs.map((item) => ({ name: item.label, path: item.href ? localizedPath(item.href) : undefined })),
    ],
    location.pathname,
  );

  useEffect(() => {
    if (backgroundImage) {
      setActiveBg(backgroundImage);
      setVisible(true);
    }
  }, [backgroundImage]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (backgroundImage) return;
    // fade out → swap → fade in
    setVisible(false);
    const swap = setTimeout(() => {
      setActiveBg(pickForPath(location.pathname));
      setVisible(true);
    }, 300);
    return () => clearTimeout(swap);
  }, [location.pathname, backgroundImage]);

  return (
    <section 
      className={`relative w-full h-[450px] flex items-center overflow-hidden ${className || ''}`}
    >
      <Helmet>
        <script type="application/ld+json">{serializeJsonLd(breadcrumbJsonLd)}</script>
      </Helmet>
      <div className="absolute inset-0 z-0">
        <img 
          src={activeBg}
          alt=""
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
          {/* Breadcrumb visible (Fase 3); su BreadcrumbList en JSON-LD va arriba (Fase 4). */}
          <nav aria-label={t('breadcrumb.label')} className="text-sm text-slate-300 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <ol className="flex flex-wrap gap-2 items-center">
              <li>
                <Link to={localizedPath('/')} className="hover:text-blue-400 transition-colors">{t('header.nav.home')}</Link>
              </li>
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-slate-500" aria-hidden="true">/</span>
                  {item.href ? (
                    <Link to={localizedPath(item.href)} className="hover:text-blue-400 transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium" aria-current="page">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default PageHero;