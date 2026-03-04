import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Importar estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Importar tipos y funciones de Shopify
import { fetchBlogArticlesGraphQL, ShopifyArticle } from '@/lib/shopify';

// Importar componentes UI
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const NewsSlider: React.FC = () => {
  const [articles, setArticles] = useState<ShopifyArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogArticlesGraphQL('noticias', 5);
        setArticles(data.articles);
        setError(null);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('No se pudieron cargar las noticias en este momento.');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Función para formatear la fecha en español
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
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
        <div className="container mx-auto px-4 md:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>

          {/* Card Skeleton */}
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5 gap-0">
                  <Skeleton className="h-[400px] md:col-span-2" />
                  <div className="p-8 md:col-span-3 flex flex-col justify-center">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <Skeleton className="h-8 w-full mb-3" />
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-20 w-full mb-6" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-gray-500">{error}</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-gray-500">Próximamente nuevas noticias</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-insecap-cyan border-insecap-cyan">
            Noticias
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Últimas <span className="text-insecap-cyan">Noticias</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Mantente informado sobre las últimas novedades, cursos y eventos de INSECAP
          </p>
        </div>

        {/* Swiper Slider */}
        <div className="max-w-6xl mx-auto">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            className="news-swiper [&_.swiper-button-next]:text-insecap-cyan [&_.swiper-button-prev]:text-insecap-cyan [&_.swiper-pagination-bullet-active]:bg-insecap-cyan [&_.swiper-button-next]:after:text-3xl [&_.swiper-button-prev]:after:text-3xl"
          >
            {articles.map((article) => (
              <SwiperSlide key={article.id}>
                <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-0 mb-12">
                  <CardContent className="p-0">
                    {/* Layout Horizontal en Desktop, Vertical en Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                      {/* Imagen - 40% en desktop */}
                      <div className="relative h-64 md:h-[400px] md:col-span-2 overflow-hidden bg-gradient-to-br from-insecap-blue to-insecap-cyan">
                        {article.image ? (
                          <img
                            src={article.image.url}
                            alt={article.image.altText || article.title}
                            className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <div className="text-center">
                              <Calendar className="w-16 h-16 mx-auto mb-2 opacity-50" />
                              <p className="text-sm opacity-75">Sin imagen</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contenido - 60% en desktop */}
                      <div className="p-8 md:p-10 md:col-span-3 flex flex-col justify-center">
                        {/* Badge con fecha */}
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                          <Badge variant="secondary" className="flex items-center gap-1.5 bg-insecap-cyan/10 text-insecap-cyan border-0">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(article.publishedAt)}
                          </Badge>
                        </div>

                        {/* Título */}
                        <h3 className="text-2xl md:text-3xl font-bold text-insecap-cyan mb-4 line-clamp-2 leading-tight">
                          {article.title}
                        </h3>

                        {/* Excerpt o contenido truncado */}
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 line-clamp-3">
                          {article.excerpt
                            ? stripHtml(article.excerpt)
                            : truncateText(stripHtml(article.contentHtml), 180)}
                        </p>

                        {/* Botón de acción */}
                        <div>
                          <Button
                            asChild
                            className="bg-insecap-cyan hover:bg-insecap-cyan/90 text-white font-semibold group"
                          >
                            <Link to={`/noticias/${article.blog.handle}/${article.handle}`}>
                              Leer más
                              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Link para ver todas las noticias */}
        <div className="text-center mt-8">
          <Button variant="outline" asChild className="border-insecap-cyan text-insecap-cyan hover:bg-insecap-cyan hover:text-white">
            <Link to="/noticias">
              Ver todas las noticias
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsSlider;
