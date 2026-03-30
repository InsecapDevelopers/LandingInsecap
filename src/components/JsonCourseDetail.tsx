import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  formatHoursLabel,
  getJsonCatalogByHandle,
  getRelatedJsonTopics,
  getTopicAvailabilitySummary,
} from '@/lib/catalogData';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import {
  fetchCatalogProductSummaries,
  ShopifyCatalogProductSummary,
} from '@/lib/shopify';

const JsonCourseDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { localizedPath } = useLocalizedPath();
  const topic = useMemo(() => (handle ? getJsonCatalogByHandle(handle) : null), [handle]);
  const [productSummary, setProductSummary] = useState<ShopifyCatalogProductSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProductSummary = async () => {
      if (!topic) {
        return;
      }

      try {
        const summaries = await fetchCatalogProductSummaries([topic.handle]);
        if (!cancelled) {
          setProductSummary(summaries[topic.handle] ?? null);
        }
      } catch (error) {
        console.error('Error fetching topic product summary:', error);
        if (!cancelled) {
          setProductSummary(null);
        }
      }
    };

    setProductSummary(null);
    loadProductSummary();

    return () => {
      cancelled = true;
    };
  }, [topic]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-8 md:px-14 lg:px-16 py-20">
          <h1 className="text-2xl font-bold mb-3">Tema no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            El handle solicitado no existe en la base de datos JSON.
          </p>
          <Link to={localizedPath('/cursos')}>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al catálogo
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const availability = getTopicAvailabilitySummary(topic);
  const relatedTopics = getRelatedJsonTopics(topic, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title={topic.tema}
          subtitle={topic.categoria}
          backgroundImage={productSummary?.image?.url}
          breadcrumbs={[
            { label: 'Cursos', href: '/cursos' },
            { label: topic.tema },
          ]}
        />

        <div className="container mx-auto px-8 md:px-14 lg:px-16 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Disponibilidad general</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Revisa la disponibilidad general de este tema y solicita una cotización según
                  la combinación que necesites.
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="mb-3 text-sm font-semibold text-foreground">Modalidades</p>
                    <div className="flex flex-wrap gap-2">
                      {availability.modalidades.map((modalidad) => (
                        <Badge key={modalidad} variant="secondary" className="bg-insecap-blue/10 text-insecap-blue">
                          {modalidad}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="mb-3 text-sm font-semibold text-foreground">Horas</p>
                    <div className="flex flex-wrap gap-2">
                      {availability.horas.map((hours) => (
                        <Badge key={hours} variant="secondary" className="bg-insecap-cyan/10 text-insecap-cyan">
                          {formatHoursLabel(hours)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="mb-3 text-sm font-semibold text-foreground">Estándares</p>
                    <div className="flex flex-wrap gap-2">
                      {availability.estandares.map((standard) => (
                        <Badge key={standard} variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground">
                  Este tema agrupa {topic.cursos_fuente} cursos base y se adapta según modalidad,
                  carga horaria y estándar requerido.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen comercial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
                  {productSummary?.image ? (
                    <img
                      src={productSummary.image.url}
                      alt={productSummary.image.altText || topic.tema}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-insecap-blue to-insecap-cyan text-white/80">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoría</p>
                  <p className="font-semibold text-foreground">{topic.categoria}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Precio</span>
                  <span className="text-2xl font-bold text-insecap-cyan">Cotizar</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Modo LecturaJSON activo. Los valores comerciales se gestionan vía cotización.
                </p>
                <Button className="w-full bg-insecap-blue hover:bg-insecap-blue/90 text-white">
                  Solicitar cotización
                </Button>
                <Link to={localizedPath('/cursos')}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al catálogo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {relatedTopics.length > 0 ? (
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Otros temas en {topic.categoria}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {relatedTopics.map((relatedTopic) => (
                      <Link key={relatedTopic.handle} to={localizedPath(`/curso/${relatedTopic.handle}`)}>
                        <div className="h-full rounded-xl border border-border p-4 transition-colors hover:border-insecap-cyan hover:bg-insecap-cyan/5">
                          <p className="font-semibold text-foreground">{relatedTopic.tema}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {relatedTopic.cursos_fuente} cursos base agrupados
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JsonCourseDetail;
