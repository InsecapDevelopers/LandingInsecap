import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopifyProduct, fetchProducts, fetchProductsByCollection, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { isEcommerceEnabled } from "@/lib/featureFlags";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { ShoppingCart, Clock, Monitor, Award, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const ShopifyProductCard = ({ product }: { product: ShopifyProduct }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;

  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!firstVariant) {
      toast.error("Curso no disponible");
      return;
    }

    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });

    toast.success("Curso agregado al carrito", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <Link to={`/curso/${node.handle}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-insecap-blue to-insecap-cyan overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Award className="h-16 w-16 text-white/50" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-insecap-cyan text-white border-0">
              {node.productType || "Curso"}
            </Badge>
          </div>
          <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
            SENCE
          </Badge>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-insecap-cyan transition-colors min-h-[3rem]">
            {node.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {node.description || "Capacitación profesional certificada"}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>24 hrs</span>
            </div>
            <div className="flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              <span>{node.productType || "Online"}</span>
            </div>
          </div>

          {isEcommerceEnabled && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <span className="text-xl font-bold text-insecap-cyan">
                  {formatPrice(price.amount, price.currencyCode)}
                </span>
              </div>
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="bg-insecap-blue hover:bg-insecap-blue/90 text-white"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

const ProductSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-lg">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-5 space-y-3">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between pt-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </CardContent>
  </Card>
);

export const ShopifyProducts = ({
  category,
  collection,
  tag,
  limit = 12,
  hideHeader = false
}: {
  category?: string;
  collection?: string;
  tag?: string;
  limit?: number;
  hideHeader?: boolean;
}) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        let data: ShopifyProduct[] = [];

        if (collection) {
          data = await fetchProductsByCollection(collection, limit);
        } else {
          let query = undefined;
          if (tag) {
            query = `tag:${tag}`;
          } else if (category) {
            query = `product_type:${category}`;
          }
          data = await fetchProducts(limit, query);
        }

        setProducts(data);
      } catch (err) {
        setError("Error al cargar los cursos");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [category, collection, tag, limit]);

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-8 md:px-14 lg:px-16 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  /* ── MOBILE: carrusel vertical ─────────────────────────────────────────── */
  if (isMobile) {
    return (
      <section id="cursos-destacados" className={`py-20 ${hideHeader ? 'py-0 bg-transparent' : 'bg-muted/30'}`}>
        <div className="container mx-auto px-8 sm:px-10 md:px-12 lg:px-4">
          {!hideHeader && (
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-insecap-blue/10 text-insecap-blue hover:bg-insecap-blue/20">
                Catálogo de Cursos
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Cursos <span className="text-insecap-cyan">Destacados</span>
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Explora nuestra oferta de cursos con certificación SENCE y NCh 2728
              </p>
            </div>
          )}

          <div className="flex justify-center mt-16">
            <Carousel
              opts={{ align: "start" }}
              orientation="vertical"
              className="w-full max-w-sm"
            >
              <CarouselContent className="-mt-2 h-[520px]">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <CarouselItem key={i} className="pt-2 basis-[85%]">
                        <ProductSkeleton />
                      </CarouselItem>
                    ))
                  : products.map((product) => (
                      <CarouselItem key={product.node.id} className="pt-2 basis-[85%]">
                        <ShopifyProductCard product={product} />
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <CarouselPrevious className="h-12 w-12 border-2 border-insecap-cyan text-insecap-cyan hover:bg-insecap-cyan hover:text-white [&_svg]:h-6 [&_svg]:w-6" />
              <CarouselNext className="h-12 w-12 border-2 border-insecap-cyan text-insecap-cyan hover:bg-insecap-cyan hover:text-white [&_svg]:h-6 [&_svg]:w-6" />
            </Carousel>
          </div>

          {!isLoading && products.length > 0 && !hideHeader && (
            <div className="text-center mt-10">
              <Link to="/cursos">
                <Button size="lg" variant="outline" className="border-insecap-cyan text-insecap-cyan hover:bg-insecap-cyan hover:text-white">
                  Ver todos los cursos
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ── DESKTOP / TABLET: carrusel horizontal arrastrable ─────────────────── */
  return (
    <section id="cursos-destacados" className={`py-20 ${hideHeader ? 'py-0 bg-transparent' : 'bg-muted/30'}`}>
      <div className="container mx-auto px-8 sm:px-10 md:px-12 lg:px-4">
        {!hideHeader && (
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-insecap-blue/10 text-insecap-blue hover:bg-insecap-blue/20">
              Catálogo de Cursos
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cursos <span className="text-insecap-cyan">Destacados</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra oferta de cursos con certificación SENCE y NCh 2728
            </p>
          </div>
        )}

        <Carousel
          opts={{ align: "start", dragFree: false, slidesToScroll: 1 }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <ProductSkeleton />
                  </CarouselItem>
                ))
              : products.map((product) => (
                  <CarouselItem key={product.node.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <ShopifyProductCard product={product} />
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 -translate-x-5 h-12 w-12 rounded-full bg-white shadow-lg border-insecap-cyan hover:bg-insecap-cyan hover:text-white disabled:opacity-30" />
          <CarouselNext className="right-0 translate-x-5 h-12 w-12 rounded-full bg-white shadow-lg border-insecap-cyan hover:bg-insecap-cyan hover:text-white disabled:opacity-30" />
        </Carousel>

        {!isLoading && products.length > 0 && !hideHeader && (
          <div className="text-center mt-12">
            <Link to="/cursos">
              <Button size="lg" variant="outline" className="border-insecap-cyan text-insecap-cyan hover:bg-insecap-cyan hover:text-white">
                Ver todos los cursos
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopifyProducts;
