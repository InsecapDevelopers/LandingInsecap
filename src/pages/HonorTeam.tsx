import { Star, Award, Trophy, MessageSquare, Coins, Gift } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';

const HonorTeam = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title="Equipo Honor y Felicidad"
          subtitle="Reconocimiento"
          breadcrumbs={[{ label: "Honor y Felicidad" }]}
        />
        <div className="container mx-auto px-4 mt-12">
          <div className="text-center mb-12">
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Reconocemos el talento, el compromiso y la excelencia de nuestro equipo humano.
            </p>
          </div>

          {/* Muro de la Fama Section */}
          <section className="mb-20">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-secondary" />
                  Muro de la Fama
                </h2>
                <div className="prose prose-blue max-w-none text-muted-foreground">
                  <p className="text-justify leading-relaxed">
                    Cada mes, llenos de gratitud, formamos una terna aleatoria de 3 colaboradores que, tras evaluar las contribuciones y el espíritu de equipo, nominan a 4 compañeros para el <strong>"Colaborador del Mes"</strong>. 🌟 A continuación, todo el personal vota para decidir quién será homenajeado por su dedicación y energía.
                  </p>
                  <p className="text-justify leading-relaxed mt-4">
                    Al mismo tiempo, las distintas áreas de Insecap nominan a 4 Facilitadores sobresalientes; luego, entre todos los colaboradores, se escoge al <strong>"Facilitador del Mes"</strong> para reconocer su pasión y compromiso en la formación. 🎓❤️
                  </p>
                  <p className="text-justify leading-relaxed mt-4">
                    De este modo, nuestro Muro de la Fama se llena cada mes de historias de esfuerzo, inspiración y celebración colectiva.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                <img
                  src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Capin-19.png?v=1769112910"
                  alt="Muro de la Fama Mascot"
                  className="w-48 h-auto object-contain animate-bounce-slow"
                />
              </div>
            </div>

            {/* Fama Iframe Container */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg p-1 bg-gradient-to-br from-secondary/5 to-primary/5">
              <div className="relative w-full overflow-hidden" style={{ minHeight: '1100px' }}>
                <iframe
                  id="iframeFama"
                  src="https://tms.insecap.cl/murofama/resumenfamaweb"
                  className="w-full border-0 min-h-[1100px]"
                  scrolling="no"
                  title="Resumen Fama Web"
                  onLoad={(e) => {
                    const iframe = e.currentTarget;
                    window.addEventListener('message', (ev) => {
                      if (ev.origin !== 'https://tms.insecap.cl') return;
                      if (ev.data.type === 'setHeight') {
                        iframe.style.height = ev.data.height + 'px';
                      }
                    }, false);
                  }}
                />
              </div>
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
                    <div className="bg-background rounded-2xl p-6 border border-border shadow-inner text-center">
                      <h4 className="font-bold text-foreground mb-4">Podio Mensual</h4>
                      <p className="text-sm text-muted-foreground mb-6">Top 3 de quienes han recibido más Insecoins.</p>
                      <div className="flex justify-center">
                        <Trophy className="w-16 h-16 text-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Felicidad Iframe Container */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
              <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Podio de Estrellas en Vivo</span>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="relative w-full overflow-hidden" style={{ paddingTop: '75%' }}>
                <iframe
                  src="https://tms.insecap.cl/MuroFelicidad/podioestrellas"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allowFullScreen
                  title="Podio de Estrellas"
                />
              </div>
              <div className="p-4 text-center text-xs text-muted-foreground md:hidden">
                * Desliza dentro del cuadro para ver más detalles
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
