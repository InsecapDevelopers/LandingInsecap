import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ArrowLeft, Share2, Newspaper, X } from 'lucide-react';
import { fetchArticleByHandleGraphQL, formatArticleDate, ShopifyArticle } from '@/lib/shopify';
import { toast } from 'sonner';
import PageHero from '@/components/PageHero';

const ArticleDetail = () => {
  const { blogHandle, articleHandle } = useParams<{ blogHandle: string; articleHandle: string }>();
  const [article, setArticle] = useState<ShopifyArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const articleContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!blogHandle || !articleHandle) return;
      
      try {
        setIsLoading(true);
        const data = await fetchArticleByHandleGraphQL(blogHandle, articleHandle);
        setArticle(data);
      } catch (err) {
        console.error('Error loading article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [blogHandle, articleHandle]);

  // Handle ESC key to close image modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Add click handlers to all images in the article content
  useEffect(() => {
    if (!articleContentRef.current) return;

    const images = articleContentRef.current.querySelectorAll('img');
    
    const handleImageClick = (e: Event) => {
      const img = e.target as HTMLImageElement;
      setSelectedImage({
        url: img.src,
        alt: img.alt || article?.title || 'Imagen de la noticia'
      });
    };

    images.forEach((img) => {
      img.style.cursor = 'pointer';
      img.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      img.addEventListener('click', handleImageClick);
      
      // Add hover effects
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.02)';
        img.style.opacity = '0.9';
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.opacity = '1';
      });
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('click', handleImageClick);
      });
    };
  }, [article]);

  // Helper function to extract plain text from HTML
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Helper function to get first 160 chars for description
  const getMetaDescription = (article: ShopifyArticle): string => {
    if (article.excerpt) {
      return article.excerpt.substring(0, 160);
    }
    const plainText = stripHtml(article.contentHtml);
    return plainText.substring(0, 160) + '...';
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || '',
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex gap-4 mb-8">
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-80 w-full mb-8 rounded-xl" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Artículo no encontrado
            </h1>
            <p className="text-muted-foreground mb-6">
              El artículo que buscas no existe o ha sido eliminado
            </p>
            <Link to="/noticias">
              <Button className="bg-insecap-cyan hover:bg-insecap-cyan/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a noticias
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {article && (
        <SEO
          title={article.title}
          description={getMetaDescription(article)}
          image={article.image?.url}
          imageAlt={article.image?.altText || article.title}
          url={`/noticias/${blogHandle}/${articleHandle}`}
          type="article"
          article={{
            publishedTime: article.publishedAt,
            author: article.authorV2?.name,
            section: 'Noticias',
            tags: ['capacitación', 'INSECAP', 'formación profesional']
          }}
          keywords={[
            article.title,
            'INSECAP',
            'capacitación',
            'OTEC',
            'formación profesional',
            'noticias',
            article.authorV2?.name || ''
          ].filter(Boolean)}
          jsonLd={[
            {
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              'headline': article.title,
              'description': getMetaDescription(article),
              'image': article.image?.url,
              'datePublished': article.publishedAt,
              'dateModified': article.publishedAt,
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
              'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': `https://insecap-capacitaciones.myshopify.com/noticias/${blogHandle}/${articleHandle}`
              },
              'articleSection': 'Noticias',
              'inLanguage': 'es-CL'
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'name': 'Inicio',
                  'item': 'https://insecap-capacitaciones.myshopify.com'
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'name': 'Noticias',
                  'item': 'https://insecap-capacitaciones.myshopify.com/noticias'
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': article.title,
                  'item': `https://insecap-capacitaciones.myshopify.com/noticias/${blogHandle}/${articleHandle}`
                }
              ]
            }
          ]}
        />
      )}
      <Header />
      <main>
        <PageHero 
          title={article.title}
          subtitle="Noticia"
          breadcrumbs={[
            { label: "Noticias", href: "/noticias" },
            { label: article.title }
          ]}
        />

        {/* Article Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 text-slate-500 mb-8 border-b pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatArticleDate(article.publishedAt)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="hover:text-blue-600 hover:bg-blue-50"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Compartir
              </Button>
            </div>
            {article.image && (
              <div 
                className="mb-8 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => setSelectedImage({ url: article.image!.url, alt: article.image!.altText || article.title })}
              >
                <img
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  className="w-full h-auto transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
                />
              </div>
            )}
            
            <article 
              ref={articleContentRef}
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-insecap-cyan prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </div>
        </section>

        {/* Image Modal - Universal for all images */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Back to Blog */}
        <section className="py-8 border-t border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to="/noticias">
              <Button variant="outline" className="border-insecap-cyan text-insecap-cyan hover:bg-insecap-cyan hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ver más noticias
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
