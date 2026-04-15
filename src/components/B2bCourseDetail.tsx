import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { ClientTypeSwitch } from '@/components/ClientTypeSwitch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  B2bCatalogTopic,
  findB2bCatalogByHandle,
  formatB2bHoursLabel,
  getB2bTopicAvailabilitySummary,
  getRelatedB2bTopics,
  loadB2bCatalogTopics,
} from '@/lib/b2bCatalogData';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const B2bCourseDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { localizedPath, locale } = useLocalizedPath();
  const [isLoadingTopic, setIsLoadingTopic] = useState(true);
  const [topic, setTopic] = useState<B2bCatalogTopic | null>(null);
  const [allTopics, setAllTopics] = useState<B2bCatalogTopic[]>([]);

  const content = {
    es: {
      notFoundTitle: 'Curso empresa no encontrado',
      notFoundBody: 'El handle solicitado no existe en el catálogo B2B.',
      backToCatalog: 'Volver al catálogo de empresas',
      summaryTitle: 'Disponibilidad general',
      summaryBody:
        'Este curso para empresas se cotiza según la modalidad, la carga horaria y el estándar requerido por tu organización.',
      hours: 'Horas',
      standards: 'Estándares',
      modalities: 'Modalidades',
      businessSummary: 'Resumen comercial',
      quoteNote:
        'Este curso se atiende con una propuesta comercial para empresas. Nuestro equipo preparará una cotización según tus requerimientos.',
      quoteCta: 'Ir al formulario de contacto',
      related: 'Otros cursos para empresas en',
      grouped: 'cursos base agrupados',
      catalogCrumb: 'Cursos Empresas',
      loading: 'Cargando detalle desde Shopify...',
    },
    en: {
      notFoundTitle: 'Corporate course not found',
      notFoundBody: 'The requested handle does not exist in the B2B catalog.',
      backToCatalog: 'Back to corporate catalog',
      summaryTitle: 'General availability',
      summaryBody:
        'This corporate course is quoted according to modality, duration, and standard required by your organization.',
      hours: 'Hours',
      standards: 'Standards',
      modalities: 'Modalities',
      businessSummary: 'Commercial summary',
      quoteNote:
        'This course is managed through a business proposal for companies. Our team will prepare a quote based on your needs.',
      quoteCta: 'Go to contact form',
      related: 'Other corporate courses in',
      grouped: 'base courses grouped',
      catalogCrumb: 'Corporate Courses',
      loading: 'Loading details from Shopify...',
    },
    pt: {
      notFoundTitle: 'Curso corporativo nao encontrado',
      notFoundBody: 'O handle solicitado nao existe no catalogo B2B.',
      backToCatalog: 'Voltar ao catalogo empresas',
      summaryTitle: 'Disponibilidade geral',
      summaryBody:
        'Este curso corporativo e cotado conforme modalidade, carga horaria e padrao requerido pela sua organizacao.',
      hours: 'Horas',
      standards: 'Padroes',
      modalities: 'Modalidades',
      businessSummary: 'Resumo comercial',
      quoteNote:
        'Este curso e atendido por proposta comercial para empresas. Nossa equipe preparara uma cotacao conforme seus requisitos.',
      quoteCta: 'Ir ao formulario de contato',
      related: 'Outros cursos empresa em',
      grouped: 'cursos base agrupados',
      catalogCrumb: 'Cursos Empresas',
      loading: 'Carregando detalhes do Shopify...',
    },
  }[locale];

  useEffect(() => {
    let cancelled = false;

    const loadTopic = async () => {
      if (!handle) {
        setTopic(null);
        setAllTopics([]);
        setIsLoadingTopic(false);
        return;
      }

      try {
        setIsLoadingTopic(true);
        const [topics, foundTopic] = await Promise.all([
          loadB2bCatalogTopics(),
          findB2bCatalogByHandle(handle),
        ]);

        if (!cancelled) {
          setAllTopics(topics);
          setTopic(foundTopic);
        }
      } catch (error) {
        console.error('Error loading B2B topic detail:', error);
        if (!cancelled) {
          setAllTopics([]);
          setTopic(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTopic(false);
        }
      }
    };

    void loadTopic();

    return () => {
      cancelled = true;
    };
  }, [handle]);

  const relatedTopics = useMemo(() => {
    if (!topic) {
      return [];
    }
    return getRelatedB2bTopics(allTopics, topic, 6);
  }, [allTopics, topic]);

  if (isLoadingTopic) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-8 md:px-14 lg:px-16 py-20">
          <p className="text-muted-foreground">{content.loading}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-8 md:px-14 lg:px-16 py-20">
          <h1 className="text-2xl font-bold mb-3">{content.notFoundTitle}</h1>
          <p className="text-muted-foreground mb-6">{content.notFoundBody}</p>
          <Link to={localizedPath('/cursos-empresas')}>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {content.backToCatalog}
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const availability = getB2bTopicAvailabilitySummary(topic);
  const quotePath = `${localizedPath('/contacto')}?origen=b2b&curso=${encodeURIComponent(topic.tema)}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title={topic.tema}
          subtitle={topic.categoria}
          breadcrumbs={[
            { label: content.catalogCrumb, href: '/cursos-empresas' },
            { label: topic.tema },
          ]}
        />

        <ClientTypeSwitch activeMode="empresa" />

        <div className="container mx-auto px-8 md:px-14 lg:px-16 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{content.summaryTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{content.summaryBody}</p>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="mb-3 text-sm font-semibold text-foreground">{content.modalities}</p>
                    <div className="flex flex-wrap gap-2">
                      {availability.modalidades.map((modalidad) => (
                        <Badge key={modalidad} variant="secondary" className="bg-insecap-blue/10 text-insecap-blue">
                          {modalidad}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="mb-3 text-sm font-semibold text-foreground">{content.hours}</p>
                    <div className="flex flex-wrap gap-2">
                      {availability.horas.map((hours) => (
                        <Badge key={hours} variant="secondary" className="bg-insecap-cyan/10 text-insecap-cyan">
                          {formatB2bHoursLabel(hours)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="mb-3 text-sm font-semibold text-foreground">{content.standards}</p>
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
                  Este tema agrupa {topic.cursos_fuente} cursos base y se adapta a tus lineamientos internos.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{content.businessSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-slate-900 to-slate-700 text-slate-200">
                  {topic.image ? (
                    <img
                      src={topic.image.url}
                      alt={topic.image.altText || topic.tema}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-10 w-10" />
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-semibold text-foreground">{topic.categoria}</p>
                </div>

                <p className="text-sm text-muted-foreground">{content.quoteNote}</p>

                <Link to={quotePath}>
                  <Button className="w-full bg-insecap-blue hover:bg-insecap-blue/90 text-white">
                    <Mail className="h-4 w-4 mr-2" />
                    {content.quoteCta}
                  </Button>
                </Link>
                <Link to={localizedPath('/cursos-empresas')}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {content.backToCatalog}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {relatedTopics.length > 0 ? (
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>
                    {content.related} {topic.categoria}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {relatedTopics.map((relatedTopic) => (
                      <Link key={relatedTopic.handle} to={localizedPath(`/curso-empresa/${relatedTopic.handle}`)}>
                        <div className="h-full rounded-xl border border-border p-4 transition-colors hover:border-insecap-cyan hover:bg-insecap-cyan/5">
                          <p className="font-semibold text-foreground">{relatedTopic.tema}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {relatedTopic.cursos_fuente} {content.grouped}
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

export default B2bCourseDetail;
