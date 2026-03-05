import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle, formatPrice, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { isEcommerceEnabled } from "@/lib/featureFlags";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Clock,
  Monitor,
  Award,
  CheckCircle,
  ArrowLeft,
  Users,
  Calendar,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  vendor: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

const CourseDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;

      try {
        setIsLoading(true);
        const data = await fetchProductByHandle(handle);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product) return;

    const firstVariant = product.variants.edges[0]?.node;
    if (!firstVariant) {
      toast.error("Curso no disponible");
      return;
    }

    const shopifyProduct: ShopifyProduct = {
      node: product
    };

    addItem({
      product: shopifyProduct,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });

    toast.success("Curso agregado al carrito", {
      description: product.title,
      position: "top-center",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-video rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const price = product.priceRange.minVariantPrice;
  const images = product.images.edges;
  const currentImage = images[selectedImage]?.node;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20">
        <PageHero
          title={product.title}
          subtitle={product.productType || "Curso"}
          backgroundImage={product.images.edges[0]?.node.url}
          breadcrumbs={[
            { label: "Cursos", href: "/cursos" },
            { label: product.title }
          ]}
        />

        <div className="container mx-auto px-4 mt-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-insecap-blue to-insecap-cyan rounded-xl overflow-hidden">
                {currentImage ? (
                  <img
                    src={currentImage.url}
                    alt={currentImage.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Award className="h-24 w-24 text-white/50" />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${idx === selectedImage
                        ? 'border-insecap-cyan'
                        : 'border-transparent hover:border-muted'
                        }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `Imagen ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-insecap-cyan text-white border-0">
                    {product.productType || "Curso"}
                  </Badge>
                  <Badge className="bg-green-500 text-white border-0">
                    SENCE
                  </Badge>
                  <Badge variant="outline" className="border-insecap-cyan text-insecap-cyan">
                    NCh 2728
                  </Badge>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {product.title}
                </h1>

                <p className="text-muted-foreground">
                  Por <span className="text-insecap-cyan font-medium">{product.vendor}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-6 py-4 border-y border-border">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-insecap-cyan" />
                  <span className="text-sm">24 horas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-insecap-cyan" />
                  <span className="text-sm">{product.productType || "Online"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-insecap-cyan" />
                  <span className="text-sm">+500 alumnos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-insecap-cyan" />
                  <span className="text-sm">Inicio inmediato</span>
                </div>
              </div>

              {isEcommerceEnabled && (
                <div className="bg-muted/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-insecap-cyan">
                        {formatPrice(price.amount, price.currencyCode)}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Precio por participante
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full bg-insecap-blue hover:bg-insecap-blue/90 text-white"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Agregar al Carrito
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Este curso incluye:</h3>
                <ul className="space-y-2">
                  {[
                    "Material didáctico digital",
                    "Certificado de aprobación",
                    "Acceso ilimitado al contenido",
                    "Soporte técnico dedicado",
                    "Evaluación final certificada"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12">
            <Tabs defaultValue="descripcion" className="w-full">
              <TabsList className="w-full justify-start bg-muted/30 p-1 h-auto flex-wrap">
                <TabsTrigger value="descripcion" className="data-[state=active]:bg-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Descripción
                </TabsTrigger>
                <TabsTrigger value="objetivos" className="data-[state=active]:bg-white">
                  Objetivos
                </TabsTrigger>
                <TabsTrigger value="temario" className="data-[state=active]:bg-white">
                  Temario
                </TabsTrigger>
                <TabsTrigger value="certificacion" className="data-[state=active]:bg-white">
                  Certificación
                </TabsTrigger>
              </TabsList>

              <TabsContent value="descripcion" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description ||
                      "Este curso está diseñado para entregar conocimientos y habilidades específicas en el área de capacitación profesional. Los participantes aprenderán metodologías actualizadas y técnicas prácticas aplicables en su entorno laboral. Nuestro programa cumple con los más altos estándares de calidad y está certificado bajo la normativa vigente."}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="objetivos" className="mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Objetivos del curso:</h3>
                  <ul className="space-y-3">
                    {[
                      "Comprender los fundamentos teóricos y prácticos del área",
                      "Aplicar técnicas y metodologías actualizadas",
                      "Desarrollar habilidades específicas para el desempeño laboral",
                      "Cumplir con los requisitos normativos y de seguridad",
                      "Obtener certificación reconocida en el mercado"
                    ].map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-insecap-cyan flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="temario" className="mt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contenido del curso:</h3>
                  <div className="space-y-3">
                    {[
                      { module: "Módulo 1", title: "Introducción y fundamentos" },
                      { module: "Módulo 2", title: "Marco normativo y legal" },
                      { module: "Módulo 3", title: "Técnicas y metodologías" },
                      { module: "Módulo 4", title: "Aplicación práctica" },
                      { module: "Módulo 5", title: "Evaluación y certificación" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                        <span className="text-sm font-medium text-insecap-cyan">{item.module}</span>
                        <span className="text-muted-foreground">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="certificacion" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Award className="h-12 w-12 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg text-green-800 dark:text-green-400 mb-2">
                        Certificación SENCE
                      </h3>
                      <p className="text-green-700 dark:text-green-300">
                        Este curso cuenta con código SENCE, lo que permite utilizar la franquicia tributaria
                        para capacitación. Al aprobar, recibirás un certificado oficial válido ante SENCE.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-insecap-blue/5 rounded-xl">
                    <Award className="h-12 w-12 text-insecap-blue flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg text-insecap-blue mb-2">
                        Norma Chilena NCh 2728
                      </h3>
                      <p className="text-muted-foreground">
                        Insecap Capacitaciones está certificado bajo la Norma Chilena NCh 2728 que
                        garantiza la calidad de nuestros organismos técnicos de capacitación (OTEC).
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
