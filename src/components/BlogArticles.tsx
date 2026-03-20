import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';
import { fetchBlogArticles, formatArticleDate, ShopifyArticle } from '@/lib/shopify';
import { useLocalizedPath } from '@/hooks/use-localized-path';

interface ArticleCardProps {
  article: ShopifyArticle;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const { localizedPath } = useLocalizedPath();

  return (
    <Link to={localizedPath(`/noticias/${article.blog.handle}/${article.handle}`)}>
        const { localizedPath } = useLocalizedPath();

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
          <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-insecap-cyan transition-colors min-h-[3rem]">
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
            {article.authorV2 && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.authorV2.name}</span>
              </div>
            )}
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
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-4 w-20 ml-auto" />
    </CardContent>
  </Card>
);

interface BlogArticlesProps {
  blogHandle?: string;
  limit?: number;
  showTitle?: boolean;
}

export const BlogArticles = ({ blogHandle = 'news', limit = 6, showTitle = true }: BlogArticlesProps) => {
  const [articles, setArticles] = useState<ShopifyArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBlogArticles(blogHandle, limit);
        setArticles(data);
      } catch (err) {
        setError("Error al cargar las noticias");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [blogHandle, limit]);

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-8 md:px-14 lg:px-16">
          <p className="text-center text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  if (!isLoading && articles.length === 0) {
    return null; // No mostrar la sección si no hay artículos
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        {showTitle && (
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-insecap-cyan/10 text-insecap-cyan border-insecap-cyan/20">
              Blog & Noticias
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Últimas Noticias
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mantente informado sobre las novedades en capacitación y seguridad laboral
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: limit > 3 ? 3 : limit }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))
            : articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
        </div>

        {!isLoading && articles.length > 0 && (
          <div className="text-center mt-10">
            <Link to={localizedPath('/noticias')}>
              <Button
                variant="outline"
                size="lg"
                className="border-insecap-cyan text-insecap-cyan hover:bg-insecap-cyan hover:text-white"
              >
                Ver todas las noticias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogArticles;
