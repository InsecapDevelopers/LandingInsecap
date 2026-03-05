import { useState, useEffect } from 'react';
import { Star, Award, Trophy, Coins, Gift } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import {
  getMuroFamaPodio, PodioItem,
  getPodioInsecoins, PodioInsecoinsItem,
} from '@/lib/tmsApi';

const medalEmoji = ['🥇', '🥈', '🥉'];

const cardBorder = [
  'border-2 border-yellow-400 md:scale-110',
  'border border-gray-400',
  'border border-amber-700',
];

const PodioCard = ({ item, position }: { item: PodioItem; position: number }) => (
  <div
    className={`bg-card rounded-2xl p-6 flex flex-col items-center text-center shadow-md w-full md:w-64 ${cardBorder[position - 1]}`}
  >
    <span className="text-3xl mb-3">{medalEmoji[position - 1]}</span>
    {item.foto ? (
      <img
        src={item.foto}
        alt={item.nombre}
        className="w-20 h-20 rounded-full object-cover mb-3"
      />
    ) : (
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold mb-3">
        {item.nombre.charAt(0)}
      </div>
    )}
    <p className="font-bold text-foreground text-lg leading-tight">{item.nombre}</p>
    <p className="text-sm text-muted-foreground mt-1">{item.rol}</p>
    <p className="text-sm text-muted-foreground">{item.mes}</p>
    <p className="text-xs text-muted-foreground italic mt-2">{item.logro}</p>
  </div>
);

const PodioSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-8 px-4">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="bg-card rounded-2xl p-6 flex flex-col items-center w-full md:w-64 animate-pulse"
      >
        <div className="w-10 h-10 rounded-full bg-muted mb-3" />
        <div className="w-20 h-20 rounded-full bg-muted mb-3" />
        <div className="h-4 w-32 rounded bg-muted mb-2" />
        <div className="h-3 w-24 rounded bg-muted mb-1" />
        <div className="h-3 w-20 rounded bg-muted" />
      </div>
    ))}
  </div>
);

const HonorTeam = () => {
  const [podio, setPodio] = useState<PodioItem[]>([]);
  const [loadingPodio, setLoadingPodio] = useState(true);

  const [podioInsecoins, setPodioInsecoins] = useState<PodioInsecoinsItem[]>([]);
  const [loadingInsecoins, setLoadingInsecoins] = useState(true);

  useEffect(() => {
    getMuroFamaPodio().then((data) => { setPodio(data); setLoadingPodio(false); });
    getPodioInsecoins().then((data) => { setPodioInsecoins(data); setLoadingInsecoins(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title="Equipo Honor y Felicidad"
          subtitle="Reconocimiento"
          breadcrumbs={[{ label: "Honor y Felicidad" }]}
        />
        <div className="container mx-auto px-8 md:px-14 lg:px-16 mt-12">
          <div className="text-center mb-12">
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Reconocemos el talento, el compromiso y la excelencia de nuestro equipo humano.
            </p>
          </div>

          {/* Muro de la Fama Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-secondary" />
              Muro de la Fama
            </h2>
            <div className="prose prose-blue max-w-none text-muted-foreground mb-8">
              <p className="text-justify leading-relaxed">
                Cada mes, una terna aleatoria de colaboradores nomina al <strong>"Colaborador del Mes"</strong> y las distintas áreas al <strong>"Facilitador del Mes"</strong>. Todo el equipo vota, y el Muro de la Fama se llena de historias de esfuerzo y celebración colectiva. 🌟
              </p>
            </div>

            {/* Podio Muro de la Fama */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg p-6 bg-gradient-to-br from-secondary/5 to-primary/5">
              {loadingPodio && <PodioSkeleton />}

              {!loadingPodio && podio.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  El podio se actualizará próximamente.
                </p>
              )}

              {!loadingPodio && podio.length > 0 && (
                <div className="flex flex-col md:flex-row gap-6 items-end justify-center py-8 px-4">
                  {podio.map((item, idx) => (
                    <PodioCard key={item.nombre} item={item} position={idx + 1} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Muro de la Felicidad Section */}
          <section className="mb-20">
            <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-1 rounded-3xl mb-12">
              <div className="bg-card rounded-[calc(1.5rem-1px)] p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <Star className="w-8 h-8 text-primary" />
                      Muro de la Felicidad
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      En Insecap estrenamos un espacio interno para reconocer el talento y la colaboración de relatores, coordinadores y colaboradores: el <strong>Muro de la Felicidad</strong>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <Star className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">5 Estrellas</h4>
                          <p className="text-sm text-muted-foreground">Cada trabajador recibe 5 estrellas al mes para donar.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-secondary/10 rounded-xl">
                          <Coins className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">Insecoins</h4>
                          <p className="text-sm text-muted-foreground">Cada estrella son 10 Insecoins canjeables por premios.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-accent/10 rounded-xl">
                          <Gift className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">Premios</h4>
                          <p className="text-sm text-muted-foreground">Pizza, donas, cine, días libres y más beneficios.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">Reconocimiento</h4>
                          <p className="text-sm text-muted-foreground">Potenciamos la cultura de gratitud y apoyo mutuo.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-80">
                    <div className="bg-background rounded-2xl p-6 border border-border shadow-inner">
                      <h4 className="font-bold text-foreground mb-1 text-center">Podio Mensual</h4>
                      <p className="text-xs text-muted-foreground text-center mb-4">Top 3 · más Insecoins del mes</p>

                      {loadingInsecoins && (
                        <div className="space-y-3">
                          {[0,1,2].map(i => (
                            <div key={i} className="flex items-center gap-3 animate-pulse">
                              <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                              <div className="h-3 w-28 rounded bg-muted" />
                              <div className="ml-auto h-3 w-10 rounded bg-muted" />
                            </div>
                          ))}
                        </div>
                      )}

                      {!loadingInsecoins && podioInsecoins.length === 0 && (
                        <div className="text-center py-4">
                          <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">Sin datos aún</p>
                        </div>
                      )}

                      {!loadingInsecoins && podioInsecoins.length > 0 && (
                        <ol className="space-y-3">
                          {podioInsecoins.map((item) => (
                            <li key={item.puesto} className="flex items-center gap-3">
                              <span className="text-lg w-6 text-center flex-shrink-0">
                                {['🥇','🥈','🥉'][item.puesto - 1] ?? item.puesto}
                              </span>
                              {item.foto ? (
                                <img src={item.foto} alt={item.nombre} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {item.nombre.charAt(0)}
                                </div>
                              )}
                              <span className="text-sm text-foreground truncate flex-1">{item.nombre}</span>
                              <span className="text-xs font-semibold text-primary flex-shrink-0">{item.totalInsecoins} 🪙</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HonorTeam;
