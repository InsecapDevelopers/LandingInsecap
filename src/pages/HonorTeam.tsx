import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
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

const platformConfig = [
  { height: 'h-36', topColor: 'bg-yellow-400', bodyColor: 'bg-yellow-50 dark:bg-yellow-950/40', textColor: 'text-yellow-600 dark:text-yellow-400', ringColor: 'ring-2 ring-yellow-400', label: '1.er Lugar' },
  { height: 'h-24', topColor: 'bg-slate-400', bodyColor: 'bg-slate-100 dark:bg-slate-800/40', textColor: 'text-slate-500 dark:text-slate-400', ringColor: 'ring-2 ring-slate-400', label: '2.do Lugar' },
  { height: 'h-20', topColor: 'bg-amber-600', bodyColor: 'bg-amber-50 dark:bg-amber-950/40', textColor: 'text-amber-700 dark:text-amber-500', ringColor: 'ring-2 ring-amber-600', label: '3.er Lugar' },
];

const PodioMensual = ({ items }: { items: PodioInsecoinsItem[] }) => {
  // Orden visual: 2do | 1ro | 3ro
  const ordered = [items[1], items[0], items[2]].filter(Boolean);
  const configIndex = (puesto: number) => puesto - 1;

  return (
    <div className="flex items-end justify-center gap-2 md:gap-4 px-4 pt-10 pb-0">
      {ordered.map((item) => {
        const cfg = platformConfig[configIndex(item.puesto)];
        return (
          <div key={item.puesto} className="flex flex-col items-center w-28 md:w-36">
            {/* Avatar + Nombre */}
            <div className="flex flex-col items-center mb-3">
              <span className="text-2xl mb-1">{medalEmoji[item.puesto - 1]}</span>
              {item.foto ? (
                <img
                  src={item.foto}
                  alt={item.nombre}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ${cfg.ringColor} shadow-md`}
                />
              ) : (
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center text-xl font-bold ${cfg.ringColor} shadow-md`}>
                  {item.nombre.charAt(0)}
                </div>
              )}
              <p className="font-semibold text-foreground text-sm md:text-base leading-tight text-center mt-2 px-1 line-clamp-2">
                {item.nombre}
              </p>
            </div>

            {/* Plataforma */}
            <div className={`w-full rounded-t-xl overflow-hidden shadow-lg ${cfg.height}`}>
              {/* Franja superior de color */}
              <div className={`${cfg.topColor} h-4`} />
              {/* Cuerpo */}
              <div className={`${cfg.bodyColor} flex-1 h-full flex items-center justify-center`}>
                <span className={`text-3xl md:text-4xl font-black ${cfg.textColor} opacity-30 select-none`}>
                  {item.puesto}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const shootStars = () => {
  const defaults = {
    spread: 360,
    ticks: 60,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
  };
  const shoot = () => {
    confetti({ ...defaults, particleCount: 40, scalar: 1.2, shapes: ['star'] });
    confetti({ ...defaults, particleCount: 10, scalar: 0.75, shapes: ['circle'] });
  };
  setTimeout(shoot, 0);
  setTimeout(shoot, 120);
  setTimeout(shoot, 250);
};

const shootCelebration = () => {
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'] });
  setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#f59e0b', '#fbbf24', '#fde68a'] }), 200);
  setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#3b82f6', '#06b6d4', '#8b5cf6'] }), 200);
};

const HonorTeam = () => {
  const [podio, setPodio] = useState<PodioItem[]>([]);
  const [loadingPodio, setLoadingPodio] = useState(true);

  const [podioInsecoins, setPodioInsecoins] = useState<PodioInsecoinsItem[]>([]);
  const [loadingInsecoins, setLoadingInsecoins] = useState(true);

  useEffect(() => {
    getMuroFamaPodio().then((data) => { setPodio(data); setLoadingPodio(false); });
    getPodioInsecoins().then((data) => { setPodioInsecoins(data); setLoadingInsecoins(false); });
  }, []);

  useEffect(() => {
    if (!loadingPodio && podio.length > 0) shootStars();
  }, [loadingPodio, podio.length]);

  useEffect(() => {
    if (!loadingInsecoins && podioInsecoins.length > 0) shootCelebration();
  }, [loadingInsecoins, podioInsecoins.length]);

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
            <div className="relative rounded-2xl border border-border overflow-hidden shadow-xl bg-gradient-to-br from-primary/10 via-card to-secondary/10">
              {/* Orbes decorativos de fondo */}
              <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full bg-yellow-400/5 blur-2xl" />
              {loadingPodio && <PodioSkeleton />}

              {!loadingPodio && podio.length === 0 && (
                <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 py-12 px-8">
                  {/* Imagen mascota con halo animado */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-110 animate-pulse" />
                    <img
                      src="/Capin-14.png"
                      alt="Capin pensando"
                      className="relative w-52 md:w-64 object-contain drop-shadow-xl select-none"
                    />
                  </div>

                  {/* Texto */}
                  <div className="text-center md:text-left">
                    {/* Badge animado */}
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-widest mb-4 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      En curso
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 leading-tight">
                      ¡Estamos en<br />
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">votaciones!</span> 🗳️
                    </h3>
                    <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
                      Próximamente conoceremos a los ganadores del mes.<br />
                      <span className="font-medium text-foreground">¡Mantente atento a los resultados!</span>
                    </p>
                  </div>
                </div>
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

          {/* Podio Mensual de Insecoins */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              Muro de la Felicidad
            </h2>
            <div className="relative rounded-2xl border border-border overflow-hidden shadow-xl bg-gradient-to-br from-primary/10 via-card to-secondary/10">
              {/* Orbes decorativos de fondo */}
              <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-yellow-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full bg-primary/5 blur-2xl" />

              {loadingInsecoins && <PodioSkeleton />}

              {!loadingInsecoins && podioInsecoins.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  El podio mensual se actualizará próximamente.
                </p>
              )}

              {!loadingInsecoins && podioInsecoins.length > 0 && (
                <PodioMensual items={podioInsecoins} />
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HonorTeam;
