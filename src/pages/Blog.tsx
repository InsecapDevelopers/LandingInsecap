import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ArrowRight, Newspaper, Loader2 } from 'lucide-react';
import { fetchBlogArticlesGraphQL, formatArticleDate, ShopifyArticle } from '@/lib/shopify';
import PageHero from '@/components/PageHero';

const ArticleCard = ({ article }: { article: ShopifyArticle }) => {
  return (
    <Link to={`/noticias/${article.blog.handle}/${article.handle}`}>
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
              <span>{formatArticleDate(article.publishedAt)}</span>
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
  const [articles, setArticles] = useState<ShopifyArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ref for the sentinel element (infinite scroll trigger)
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load initial articles
  useEffect(() => {
    const loadInitialArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchBlogArticlesGraphQL('noticias', 6);
        setArticles(data.articles);
        setHasNextPage(data.pageInfo.hasNextPage);
        setEndCursor(data.pageInfo.endCursor);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('No se pudieron cargar las noticias. Por favor, intenta de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialArticles();
  }, []);

  // Load more articles
  const loadMoreArticles = useCallback(async () => {
    if (isLoadingMore || !hasNextPage || !endCursor) return;

    try {
      setIsLoadingMore(true);
      const data = await fetchBlogArticlesGraphQL('noticias', 6, endCursor);
      setArticles(prev => [...prev, ...data.articles]);
      setHasNextPage(data.pageInfo.hasNextPage);
      setEndCursor(data.pageInfo.endCursor);
    } catch (err) {
      console.error('Error loading more articles:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasNextPage, endCursor]);

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // When sentinel is visible, load more articles
        if (entries[0].isIntersecting && hasNextPage && !isLoadingMore) {
          loadMoreArticles();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Trigger 200px before reaching the sentinel
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasNextPage, isLoadingMore, loadMoreArticles]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Noticias y Artículos"
        description="Mantente al día con las últimas novedades de INSECAP en capacitación, seguridad laboral y desarrollo profesional. Artículos, noticias y recursos para tu crecimiento profesional."
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
          'url': 'https://insecap-capacitaciones.myshopify.com/noticias',
          'publisher': {
            '@type': 'Organization',
            'name': 'INSECAP',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://storage.googleapis.com/gpt-engineer-file-uploads/gakLUeb1NqeODjO4gfzigCGfMjb2/social-images/social-1767794256256-Insecap_ISOTIPO-08.png'
            }
          },
          'blogPost': articles.slice(0, 10).map((article) => ({
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
            'url': `https://insecap-capacitaciones.myshopify.com/noticias/${article.blog.handle}/${article.handle}`
          }))
        }}
      />
      <Header />
      <main>
        <PageHero
          title="Noticias y Artículos"
          subtitle="Blog & Noticias"
          breadcrumbs={[{ label: "Noticias" }]}
        />

        {/* Articles Grid */}
        <section className="py-16">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Error al cargar noticias
                </h2>
                <p className="text-muted-foreground mb-4">
                  {error}
                </p>
              </div>
            ) : articles.length === 0 ? (
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
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Infinite Scroll Sentinel */}
                <div ref={sentinelRef} className="w-full py-8">
                  {isLoadingMore && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Cargando más artículos...</span>
                    </div>
                  )}

                  {!hasNextPage && articles.length > 0 && (
                    <div className="text-center text-muted-foreground">
                      <Newspaper className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No hay más noticias por ahora</p>
                    </div>
                  )}
                </div>
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
