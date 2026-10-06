import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { ORG_ID } from '@/lib/jsonld';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ArrowRight, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatArticleDate, ShopifyArticle } from '@/lib/shopify';
import { NEWS_PER_PAGE, newsListQuery } from '@/lib/queries';
import { SITE_URL } from '@/lib/locale-routing';
import PageHero from '@/components/PageHero';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const ARTICLES_PER_PAGE = NEWS_PER_PAGE;

const ArticleCard = ({ article }: { article: ShopifyArticle }) => {
  const { localizedPath } = useLocalizedPath();
  const { t } = useTranslation();

  return (
    <Link to={localizedPath(`/noticias/${article.handle}`)}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-insecap-blue to-insecap-cyan overflow-hidden">
          {article.image ? (
            <img
              src={article.image.url}
              alt={article.image.altText || article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Newspaper className="h-16 w-16 text-white/50" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-insecap-cyan text-white border-0">
              {t('blog.newsBadge')}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-insecap-cyan transition-colors">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-1">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatArticleDate(article.updatedAt ?? article.publishedAt)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-border">
            <span className="text-insecap-cyan font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              {t('blog.readMore')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const ArticleCardSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-lg">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-5">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-3" />
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-4 w-20 ml-auto" />
    </CardContent>
  </Card>
);

const Blog = () => {
  const { t } = useTranslation();
  const { localizedPath, locale } = useLocalizedPath();
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLElement>(null);
  // La página 1 llega prerenderizada (window.__RQ__); cada cambio de página es un request nuevo.
  const { data, isPending: isLoading, isError } = useQuery(newsListQuery(currentPage, ARTICLES_PER_PAGE));
  const allArticles = data?.articles ?? [];
  const total = data?.total ?? 0;

  // El servidor ya devuelve la página pedida
  const pageArticles = allArticles;
  const totalPages = Math.ceil(total / ARTICLES_PER_PAGE);

  const content = {
    es: {
      title: 'Noticias y Artículos', subtitle: 'Blog y Noticias', breadcrumb: 'Noticias', intro: 'Mantente al día con las últimas novedades de INSECAP en capacitación, seguridad laboral y desarrollo profesional.', loadError: 'Error al cargar noticias', loadErrorText: 'No se pudieron cargar las noticias. Por favor, intenta de nuevo más tarde.', emptyTitle: 'No hay artículos disponibles', emptyText: 'Pronto publicaremos nuevas noticias. ¡Vuelve pronto!', page: 'Página', of: 'de',
    },
    en: {
      title: 'News and Articles', subtitle: 'Blog and News', breadcrumb: 'News', intro: 'Stay up to date with the latest INSECAP news on training, workplace safety and professional development.', loadError: 'Error loading news', loadErrorText: 'The news could not be loaded. Please try again later.', emptyTitle: 'No articles available', emptyText: 'We will publish new stories soon. Check back later!', page: 'Page', of: 'of',
    },
    pt: {
      title: 'Notícias e Artigos', subtitle: 'Blog e Notícias', breadcrumb: 'Notícias', intro: 'Fique por dentro das últimas novidades da INSECAP sobre capacitação, segurança no trabalho e desenvolvimento profissional.', loadError: 'Erro ao carregar as notícias', loadErrorText: 'Não foi possível carregar as notícias. Tente novamente mais tarde.', emptyTitle: 'Nenhum artigo disponível', emptyText: 'Em breve publicaremos novas notícias. Volte logo!', page: 'Página', of: 'de',
    },
  }[locale];

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Rango de páginas visibles en la barra de paginación
  const getPageRange = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const lo = Math.max(2, currentPage - 1);
      const hi = Math.min(totalPages - 1, currentPage + 1);
      for (let i = lo; i <= hi; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        url="/noticias"
        type="website"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          'name': 'Blog INSECAP - Noticias y Artículos',
          'description': 'Blog oficial de INSECAP con noticias, artículos y recursos sobre capacitación y desarrollo profesional en Chile',
          'url': `${SITE_URL}${localizedPath('/noticias')}`,
          'publisher': { '@id': ORG_ID },
          'blogPost': allArticles.slice(0, 10).map((article) => ({
            '@type': 'BlogPosting',
            'headline': article.title,
            'description': article.excerpt || article.title,
            'image': article.image?.url,
            'datePublished': article.publishedAt,
            'author': {
              '@type': 'Person',
              'name': article.authorV2?.name || 'INSECAP'
            },
            'publisher': { '@id': ORG_ID },
            'url': `${SITE_URL}${localizedPath(`/noticias/${article.handle}`)}`
          }))
        }}
      />
      <Header />
      <main>
        <PageHero
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: content.breadcrumb }]}
        />

        {/* Articles Grid */}
        <section className="py-16" ref={gridRef}>
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: ARTICLES_PER_PAGE }).map((_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-16">
                <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {content.loadError}
                </h2>
                <p className="text-muted-foreground mb-4">{content.loadErrorText}</p>
              </div>
            ) : allArticles.length === 0 ? (
              <div className="text-center py-16">
                <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {content.emptyTitle}
                </h2>
                <p className="text-muted-foreground">
                  {content.emptyText}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pageArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col items-center gap-4">
                    {/* Contador */}
                    <p className="text-sm text-muted-foreground">
                      {content.page} <span className="font-semibold text-foreground">{currentPage}</span> {content.of}{' '}
                      <span className="font-semibold text-foreground">{totalPages}</span>
                    </p>

                    {/* Controles */}
                    <nav className="flex items-center gap-1" aria-label={t('pagination.label')}>
                      {/* Anterior */}
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        {t('pagination.prev')}
                      </button>

                      {/* Números */}
                      <div className="flex items-center gap-1 mx-1">
                        {getPageRange().map((page, idx) =>
                          page === '...' ? (
                            <span key={`dots-${idx}`} className="px-2 text-muted-foreground select-none">…</span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => goToPage(page as number)}
                              aria-current={currentPage === page ? 'page' : undefined}
                              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-insecap-blue text-white shadow-md shadow-insecap-blue/30'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}
                      </div>

                      {/* Siguiente */}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {t('pagination.next')}
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
