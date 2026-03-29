import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CatalogSelections,
  formatHoursLabel,
  getInitialSelections,
  getJsonCatalogByHandle,
  getSelectorOptions,
  hasValidCombination,
} from '@/lib/catalogData';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const JsonCourseDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { localizedPath } = useLocalizedPath();
  const topic = useMemo(() => (handle ? getJsonCatalogByHandle(handle) : null), [handle]);
  const [selections, setSelections] = useState<CatalogSelections>(getInitialSelections());

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

  const options = getSelectorOptions(topic, selections);
  const isValid = hasValidCombination(topic, selections);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title={topic.tema}
          subtitle={topic.categoria}
          breadcrumbs={[
            { label: 'Cursos', href: '/cursos' },
            { label: topic.tema },
          ]}
        />

        <div className="container mx-auto px-8 md:px-14 lg:px-16 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Configuración técnica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    Modalidad
                    <select
                      value={selections.modalidad}
                      onChange={(event) =>
                        setSelections((current) => ({
                          ...current,
                          modalidad: event.target.value,
                        }))
                      }
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">Todos</option>
                      {options.modalidades.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    Horas
                    <select
                      value={selections.horas}
                      onChange={(event) =>
                        setSelections((current) => ({
                          ...current,
                          horas: event.target.value,
                        }))
                      }
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">Todos</option>
                      {options.horas.map((option) => (
                        <option key={option} value={option}>
                          {formatHoursLabel(option)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    Estándar
                    <select
                      value={selections.estandar}
                      onChange={(event) =>
                        setSelections((current) => ({
                          ...current,
                          estandar: event.target.value,
                        }))
                      }
                      className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">Todos</option>
                      {options.estandares.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className={`text-sm ${isValid ? 'text-green-600' : 'text-amber-600'}`}>
                  {isValid
                    ? 'Configuración disponible para cotización.'
                    : 'No hay una combinación exacta con esos filtros.'}
                </div>

                <div className="rounded-md border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Modalidad</th>
                        <th className="text-left p-3 font-medium">Horas</th>
                        <th className="text-left p-3 font-medium">Estándar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topic.combinaciones.map((combination, index) => (
                        <tr key={`${combination.modalidad}-${combination.estandar}-${index}`} className="border-t border-border">
                          <td className="p-3">{combination.modalidad}</td>
                          <td className="p-3">{formatHoursLabel(String(combination.horas ?? 'cotizar'))}</td>
                          <td className="p-3">{combination.estandar}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen comercial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JsonCourseDetail;
