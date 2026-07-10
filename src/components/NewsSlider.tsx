import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Importar tipos y funciones de Shopify
import { fetchBlogArticlesGraphQL, ShopifyArticle } from '@/lib/shopify';

// Importar componentes UI
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const NewsSlider: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<ShopifyArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { localizedPath } = useLocalizedPath();

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogArticlesGraphQL('noticias', 4);
        setArticles(data.articles);
        setError(null);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError(t('news.loadError'));
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Función para formatear la fecha usando el idioma activo
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Función para extraer texto plano del HTML
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="mb-10">
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-10 w-72" />
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse h-full">
                <Skeleton className="h-64 md:h-72 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-7 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 animate-pulse">
                  <Skeleton className="h-20 w-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 text-center">
          <p className="text-gray-500">{error}</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 text-center">
          <p className="text-gray-500">Próximamente nuevas noticias</p>
        </div>
      </section>
    );
  }

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);

  const getArticleCategory = (article: ShopifyArticle): string => {
    if (article.blog?.handle) {
      return article.blog.handle.replace(/-/g, ' ');
    }
    return t('blog.sectionBadge');
  };

  return (
    <section className="pb-16 bg-gradient-to-b from-slate-50 via-white to-gray-50 overflow-hidden">
      {/* Banner full-width, sin bordes ni padding. overflow-visible para que las olas salgan hacia abajo */}
      <div className="relative w-full bg-gradient-to-b from-slate-50 to-blue-50 h-[180px] md:h-[240px] mb-12">
          {/* Olas azules: SVG propio que desborda el banner hacia abajo */}
          <svg
            className="pointer-events-none absolute right-0 top-0 h-[210%] w-[45%] overflow-visible"
            viewBox="0 0 640 480"
            preserveAspectRatio="xMaxYMin slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="wave1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#dbeafe" />
                <stop offset="100%" stopColor="#93c5fd" />
              </linearGradient>
              <linearGradient id="wave2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <pattern id="dotsLight" width="34" height="34" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="5" fill="#ffffff" />
              </pattern>
            </defs>
            <path
              fill="url(#wave1)"
              d="M60 -40 C240 130 120 340 320 520 L640 520 L640 -40 Z"
              opacity="0.6"
            />
            <path
              fill="url(#wave2)"
              d="M260 -40 C440 150 320 360 520 520 L640 520 L640 -40 Z"
            />
            <rect x="480" y="120" width="120" height="120" fill="url(#dotsLight)" opacity="0.7" />
          </svg>

          {/* Fondo gráfico (elementos dentro del banner) */}
          <svg
            className="absolute inset-0 h-full w-full overflow-hidden"
            viewBox="0 0 2136 480"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="5" fill="#bfdbfe" />
              </pattern>
            </defs>

            {/* (grilla de puntos derecha ahora vive en el SVG de olas) */}
            {/* Grilla de puntos inferior izquierda */}
            <rect x="40" y="300" width="100" height="120" fill="url(#dots)" opacity="0.7" />

            {/* Icono de cámara (arriba izquierda) */}
            <g fill="#e2e8f0">
              <rect x="30" y="130" width="110" height="76" rx="16" />
              <path d="M140 152 L192 128 L192 208 L140 184 Z" />
            </g>

            {/* Placeholders de tarjetas de blog (abajo) */}
            <g opacity="0.55">
              {[240, 700, 1160].map((x) => (
                <g key={x} transform={`translate(${x} 320)`}>
                  <rect width="400" height="150" rx="14" fill="#eef2f7" />
                  <rect x="20" y="20" width="130" height="90" rx="9" fill="#dbe4ee" />
                  <rect x="170" y="24" width="190" height="13" rx="6" fill="#dbe4ee" />
                  <rect x="170" y="50" width="160" height="11" rx="5" fill="#e5ebf2" />
                  <rect x="170" y="72" width="180" height="11" rx="5" fill="#e5ebf2" />
                  <rect x="170" y="94" width="110" height="11" rx="5" fill="#e5ebf2" />
                </g>
              ))}
            </g>
          </svg>

          {/* Contenido real */}
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="container mx-auto px-8 md:px-16 lg:px-20">
              <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-insecap-cyan mb-2 block">
                {t('blog.sectionBadge')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-insecap-blue leading-tight">
                {t('blog.latestNews')}
              </h2>
              <div className="h-1 w-16 bg-insecap-cyan rounded-full mt-3 md:mt-4" />
              <Link
                to={localizedPath('/noticias')}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-insecap-blue hover:text-insecap-cyan transition-colors group mt-4 md:mt-5"
              >
                {t('news.seeMore')}
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Capin (imagen transparente) */}
          <img
            src="/CapinReportero.webp"
            alt="Capin Reportero"
            className="absolute bottom-0 right-[4%] lg:right-[8%] z-20 hidden h-[115%] w-auto object-contain md:block"
          />
        </div>

        <div className="container mx-auto px-8 md:px-16 lg:px-20">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            {featuredArticle && (
              <Link to={localizedPath(`/noticias/${featuredArticle.blog.handle}/${featuredArticle.handle}`)} className="group block h-full">
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 h-full transform-gpu group-hover:-translate-y-1 group-hover:scale-[1.01]">
                  <div className="relative overflow-hidden bg-white">
                    {featuredArticle.image ? (
                      <img
                        src={featuredArticle.image.url}
                        alt={featuredArticle.image.altText || featuredArticle.title}
                        className="block w-full h-auto transition-transform duration-500 transform-gpu group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 uppercase">
                      {getArticleCategory(featuredArticle)}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-insecap-blue leading-snug mb-3 group-hover:text-insecap-cyan transition-colors line-clamp-2">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {featuredArticle.excerpt
                        ? stripHtml(featuredArticle.excerpt)
                        : truncateText(stripHtml(featuredArticle.contentHtml), 140)}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {formatDate(featuredArticle.updatedAt ?? featuredArticle.publishedAt)}
                        </span>
                        {featuredArticle.authorV2?.name && (
                          <span className="flex items-center gap-1.5">
                            <User size={12} />
                            {featuredArticle.authorV2.name}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-insecap-cyan flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('news.readMore')} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            {secondaryArticles.map((article) => (
              <Link
                key={article.id}
                to={localizedPath(`/noticias/${article.blog.handle}/${article.handle}`)}
                className="group block"
              >
                <div className="relative flex items-center gap-4 rounded-xl overflow-hidden border border-insecap-cyan/60 hover:border-insecap-cyan hover:shadow-xl transition-all duration-300 p-4 isolate transform-gpu group-hover:scale-[1.015] group-hover:-translate-y-0.5">
                  <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
                    {article.image ? (
                      <img
                        src={article.image.url}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-sm scale-105 opacity-45 transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-insecap-blue to-insecap-cyan opacity-70" />
                    )}
                    <div className="absolute inset-0 bg-[#0A1E55]/72 backdrop-blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#0B1D4F]/25 to-black/45" />
                  </div>

                  <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    {article.image ? (
                      <img
                        src={article.image.url}
                        alt={article.image.altText || article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : null}
                  </div>

                  <div className="relative flex-1 min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-200 drop-shadow-sm">
                      {getArticleCategory(article)}
                    </span>
                    <h4 className="text-sm font-semibold text-white leading-snug mt-0.5 mb-1.5 line-clamp-2 group-hover:text-cyan-100 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-100/95 flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(article.updatedAt ?? article.publishedAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            <Link
              to={localizedPath('/noticias')}
              className="sm:hidden flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-insecap-blue text-insecap-blue text-sm font-semibold hover:bg-insecap-blue hover:text-white transition-all"
            >
              {t('news.seeMore')} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSlider;
