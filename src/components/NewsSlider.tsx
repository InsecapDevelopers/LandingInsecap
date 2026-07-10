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
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-8 md:px-16 lg:px-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-insecap-cyan mb-2 block">
              {t('blog.sectionBadge')}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-insecap-blue">
              {t('blog.latestNews')}
            </h2>
          </div>
          <Link
            to={localizedPath('/noticias')}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-insecap-cyan hover:text-insecap-blue transition-colors group"
          >
            {t('news.seeMore')}
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

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
