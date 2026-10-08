import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { buildBreadcrumbJsonLd, serializeJsonLd } from '@/lib/jsonld';
import { HIGH_PRIORITY, localImage } from '@/lib/images';

/** Fotos por defecto (Fase 6): WebP locales en public/images/hero, con sus anchos disponibles. Se
 *  recomprimieron desde Shopify (WhatsApp_Image_2026-03-05_at_10.58.32_2/_1/sin sufijo, mismo orden)
 *  con `cwebp -q 60 -m 6 -resize <ancho> 0`: servirlas desde el mismo origen evita una conexión a
 *  otro dominio antes de la imagen LCP. La original de sala-clases-0 mide 960 px. */
const PAGE_HERO_IMAGES: Record<string, readonly number[]> = {
  '/images/hero/sala-clases-2-3e8e2693': [640, 828, 1080, 1280, 1600],
  '/images/hero/sala-clases-1-27b50271': [640, 828, 1080, 1280, 1600],
  '/images/hero/sala-clases-0-0a49725b': [640, 828, 960],
};
const PAGE_HERO_BASES = Object.keys(PAGE_HERO_IMAGES);

/** Imagen fija por ruta (hash del pathname): el HTML prerenderizado y la hidratación eligen la
 *  misma, y cada página conserva su fondo entre visitas. */
const pickForPath = (pathname: string) => {
  let hash = 0;
  for (let i = 0; i < pathname.length; i++) {
    hash = (hash * 31 + pathname.charCodeAt(i)) >>> 0;
  }
  return PAGE_HERO_BASES[hash % PAGE_HERO_BASES.length];
};

/** Fondo a todo el ancho y 450 px de alto (object-cover): imagen LCP de las páginas internas, con
 *  fetchpriority=high y el preload que inyecta scripts/prerender.mjs. Va bajo una capa al 60 % con
 *  backdrop-blur, así que basta el ancho de pantalla (sizes 100vw) aunque en móvil el recorte cover
 *  de una foto 3:2 mida ~675 px. `image` es una foto local de PAGE_HERO_IMAGES o, si la página pasa
 *  `backgroundImage` (simuladores), una URL de Spaces. */
const heroBackground = (image: string) => {
  const localWidths = PAGE_HERO_IMAGES[image];
  return localWidths
    ? localImage(image, localWidths, '100vw')
    : { src: image };
};

interface BreadcrumbItem {
  label: string;
  /** Ruta sin prefijo de idioma; el último elemento (página actual) va sin href. */
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle: string;
  /** Párrafo bajo el título (p. ej. el párrafo de respuesta GEO de la página). */
  description?: string;
  backgroundImage?: string;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

const PageHero = ({ 
  title, 
  subtitle, 
  description,
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
      className={`relative w-full min-h-[450px] flex items-center overflow-hidden ${className || ''}`}
    >
      <Helmet>
        <script type="application/ld+json">{serializeJsonLd(breadcrumbJsonLd)}</script>
      </Helmet>
      <div className="absolute inset-0 z-0">
        <img
          {...heroBackground(activeBg)}
          {...HIGH_PRIORITY}
          alt=""
          width={1600}
          height={1066}
          className="w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: visible ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>
      
      {/* Con descripción el hero crece: pt-32 deja libre el header fijo y pb-16 la franja que tapa el
          selector de tipo de cliente (-mt-8). */}
      <div className={`container mx-auto px-8 md:px-14 lg:px-16 relative z-10 ${description ? 'pt-32 pb-16' : 'pt-20'}`}>
        <div className={description ? undefined : 'max-w-3xl'}>
          <span className="text-blue-400 font-semibold uppercase tracking-wider text-sm mb-4 block animate-in fade-in slide-in-from-left-4 duration-700">
            {subtitle}
          </span>
          <h1 className={`max-w-3xl text-4xl md:text-5xl font-bold text-white animate-in fade-in slide-in-from-left-6 duration-1000 ${description ? 'mb-4' : 'mb-6'}`}>
            {title}
          </h1>
          {/* A lo ancho del contenedor: el título sigue en max-w-3xl. */}
          {description && (
            <p className="mb-6 text-left text-sm leading-relaxed text-slate-300 animate-in fade-in slide-in-from-left-6 duration-1000 md:text-base">
              {description}
            </p>
          )}
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