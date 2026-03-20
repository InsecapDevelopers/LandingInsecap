import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ArrowRight, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBlogArticlesGraphQL, formatArticleDate, ShopifyArticle } from '@/lib/shopify';
import PageHero from '@/components/PageHero';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const ARTICLES_PER_PAGE = 9;

const ArticleCard = ({ article }: { article: ShopifyArticle }) => {
  const { localizedPath } = useLocalizedPath();

  return (
    <Link to={localizedPath(`/noticias/${article.blog.handle}/${article.handle}`)}>
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
              Noticia
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
              Leer más <ArrowRight className="h-4 w-4" />
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
  const { localizedPath, locale } = useLocalizedPath();
  const [allArticles, setAllArticles] = useState<ShopifyArticle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const gridRef = useRef<HTMLElement>(null);

  // Paginación client-side (exacta porque tenemos todos los artículos)
  const start = (currentPage - 1) * ARTICLES_PER_PAGE;
  const pageArticles = allArticles.slice(start, start + ARTICLES_PER_PAGE);
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);

  const content = {
    es: {
      title: 'Noticias y Articulos', subtitle: 'Blog y Noticias', breadcrumb: 'Noticias', intro: 'Mantenete al dia con las ultimas novedades de INSECAP en capacitacion, seguridad laboral y desarrollo profesional.', loadError: 'Error al cargar noticias',
    },
    en: {
      title: 'News and Articles', subtitle: 'Blog and News', breadcrumb: 'News', intro: 'Stay up to date with the latest INSECAP news on training, workplace safety and professional development.', loadError: 'Error loading news',
    },
    pt: {
      title: 'Noticias e Artigos', subtitle: 'Blog e Noticias', breadcrumb: 'Noticias', intro: 'Fique por dentro das ultimas novidades da INSECAP sobre capacitacao, seguranca no trabalho e desenvolvimento profissional.', loadError: 'Erro ao carregar noticias',
    },
  }[locale];

  // Cargar TODOS los artículos en lotes al montar el componente
  useEffect(() => {
    const loadAll = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const collected: ShopifyArticle[] = [];
        let cursor: string | null = null;

        // Shopify permite hasta 250 por request; iteramos hasta agotar las páginas
        do {
          const data = await fetchBlogArticlesGraphQL('noticias', 250, cursor);
          collected.push(...data.articles);
          cursor = data.pageInfo.hasNextPage ? data.pageInfo.endCursor : null;
        } while (cursor);

        setAllArticles(collected);
      } catch {
        setError('No se pudieron cargar las noticias. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

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
        title={content.title}
        description={content.intro}
        url="/noticias"
        type="website"
        keywords={[
          'noticias INSECAP',
          'blog capacitación',
          'novedades OTEC',
          'artículos formación profesional',
          'actualidad laboral Chile',
          'capacitación empresarial',
          'desarrollo profesional'
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          'name': 'Blog INSECAP - Noticias y Artículos',
          'description': 'Blog oficial de INSECAP con noticias, artículos y recursos sobre capacitación y desarrollo profesional en Chile',
          'url': `https://insecap-capacitaciones.myshopify.com${localizedPath('/noticias')}`,
          'publisher': {
            '@type': 'Organization',
            'name': 'INSECAP',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://storage.googleapis.com/gpt-engineer-file-uploads/gakLUeb1NqeODjO4gfzigCGfMjb2/social-images/social-1767794256256-Insecap_ISOTIPO-08.png'
            }
          },
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
            'publisher': {
              '@type': 'Organization',
              'name': 'INSECAP',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://storage.googleapis.com/gpt-engineer-file-uploads/gakLUeb1NqeODjO4gfzigCGfMjb2/social-images/social-1767794256256-Insecap_ISOTIPO-08.png'
              }
            },
            'url': `https://insecap-capacitaciones.myshopify.com${localizedPath(`/noticias/${article.blog.handle}/${article.handle}`)}`
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
            ) : error ? (
              <div className="text-center py-16">
                <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {content.loadError}
                </h2>
                <p className="text-muted-foreground mb-4">{error}</p>
              </div>
            ) : allArticles.length === 0 ? (
              <div className="text-center py-16">
                <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  No hay artículos disponibles
                </h2>
                <p className="text-muted-foreground">
                  Pronto publicaremos nuevas noticias. ¡Vuelve pronto!
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
                      Página <span className="font-semibold text-foreground">{currentPage}</span> de{' '}
                      <span className="font-semibold text-foreground">{totalPages}</span>
                    </p>

                    {/* Controles */}
                    <nav className="flex items-center gap-1" aria-label="Paginación">
                      {/* Anterior */}
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
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
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
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
