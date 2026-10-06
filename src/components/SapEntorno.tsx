import { useEffect, useState } from 'react';
import { Coins, Maximize2, Network, ShieldCheck, Truck } from 'lucide-react';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { SAP_ENV_SHOTS } from '@/lib/sapCatalog';
import { MotionCarousel } from '@/components/animate-ui/components/community/motion-carousel';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

type Locale = 'es' | 'en' | 'pt';
const ICONS = [Network, Truck, Coins, ShieldCheck];

const TEXT = {
  es: {
    eyebrow: 'Entorno SAP Insecap Minerals',
    title: 'Practican en un SAP armado a la medida de tu empresa.',
    lead: 'Configuramos nuestro entorno SAP S/4HANA con la estructura de tu operación. Tu equipo practica con datos que reconoce, sin tocar tu sistema productivo.',
    points: [
      { title: 'Ubicaciones técnicas', text: 'La jerarquía de tu faena: área, flota, equipo y sistema, con una codificación como la tuya.' },
      { title: 'Equipos y flotas', text: 'Cargadores frontales, grúas puente y los activos que tu equipo mantiene día a día.' },
      { title: 'Centros de costo de la región', text: 'Centros de costo y de planificación como los de las faenas del norte de Chile.' },
      { title: 'Sin riesgo', text: 'Un entorno propio: se equivocan, repiten y aprenden sin afectar tu operación.' },
    ],
    real: 'Captura real',
    open: 'ver en grande',
    prev: 'Captura anterior',
    next: 'Captura siguiente',
    note: 'Capturas reales del entorno SAP Insecap Minerals. Toca una para verla en grande.',
  },
  en: {
    eyebrow: 'SAP Insecap Minerals environment',
    title: 'They practice on an SAP built around your company.',
    lead: 'We configure our SAP S/4HANA environment with the structure of your operation. Your team practices on data they recognize, without touching your production system.',
    points: [
      { title: 'Functional locations', text: 'Your site hierarchy: area, fleet, equipment and system, coded the way you code them.' },
      { title: 'Equipment and fleets', text: 'Front loaders, overhead cranes and the assets your team maintains every day.' },
      { title: 'Regional cost centers', text: 'Cost and planning centers like those of mining sites in northern Chile.' },
      { title: 'Risk-free', text: 'An environment of our own: they make mistakes, repeat and learn without affecting your operation.' },
    ],
    real: 'Real screenshot',
    open: 'view larger',
    prev: 'Previous screenshot',
    next: 'Next screenshot',
    note: 'Real screenshots of the SAP Insecap Minerals environment. Tap one to view it larger.',
  },
  pt: {
    eyebrow: 'Ambiente SAP Insecap Minerals',
    title: 'A prática acontece em um SAP montado sob medida para sua empresa.',
    lead: 'Configuramos nosso ambiente SAP S/4HANA com a estrutura da sua operação. Sua equipe pratica com dados que reconhece, sem tocar seu sistema produtivo.',
    points: [
      { title: 'Locais de instalação', text: 'A hierarquia da sua operação: área, frota, equipamento e sistema, com uma codificação como a sua.' },
      { title: 'Equipamentos e frotas', text: 'Carregadeiras, pontes rolantes e os ativos que sua equipe mantém no dia a dia.' },
      { title: 'Centros de custo da região', text: 'Centros de custo e de planejamento como os das operações do norte do Chile.' },
      { title: 'Sem risco', text: 'Um ambiente próprio: erram, repetem e aprendem sem afetar sua operação.' },
    ],
    real: 'Captura real',
    open: 'ver em tamanho grande',
    prev: 'Captura anterior',
    next: 'Próxima captura',
    note: 'Capturas reais do ambiente SAP Insecap Minerals. Toque em uma para vê-la em tamanho grande.',
  },
};

/**
 * Entorno SAP Insecap Minerals: qué tiene de "a medida" y capturas reales en carrusel, con visor grande.
 * Landing SAP: sección clara con h2. Home (embedded): bloque oscuro dentro del banner SAP, con h3.
 */
const SapEntorno = ({ embedded = false }: { embedded?: boolean }) => {
  const { locale } = useLocalizedPath();
  const lc = locale as Locale;
  const t = TEXT[lc];
  // Captura abierta en el visor (null = cerrado) y la que muestra el visor al deslizar.
  const [open, setOpen] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) return;
    const sync = () => setCurrent(api.selectedScrollSnap());
    sync();
    api.on('select', sync);
    return () => { api.off('select', sync); };
  }, [api]);

  const Title = embedded ? 'h3' : 'h2';
  const PointTitle = embedded ? 'h4' : 'h3';
  const ink = embedded
    ? { title: 'text-white', body: 'text-white/75', icon: 'text-sky-300', caption: 'text-white/70', ring: 'focus-visible:ring-sky-300 focus-visible:ring-offset-[#0D1C3F]' }
    : { title: 'text-[#101D42]', body: 'text-slate-600', icon: 'text-[#284FD8]', caption: 'text-slate-600', ring: 'focus-visible:ring-[#284FD8]' };

  const slides = SAP_ENV_SHOTS.map((shot, i) => {
    const alt = shot.alt[lc];
    return {
      key: shot.src,
      label: alt,
      content: (
        <figure>
          <button
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`${alt}: ${t.open}`}
            className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl text-left shadow-[0_18px_40px_-16px_rgba(5,12,40,0.55)] ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${embedded ? 'ring-white/15' : 'ring-slate-200'} ${ink.ring}`}
          >
            <div className="aspect-[16/9] overflow-hidden bg-white">
              <img
                src={shot.src}
                alt={alt}
                width={shot.w}
                height={shot.h}
                loading="lazy"
                draggable={false}
                className="h-auto max-w-none transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                style={{ width: `${shot.zoom * 100}%`, transformOrigin: 'top left' }}
              />
            </div>
            {i === 0 && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#101D42]/90 px-3 py-1 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                {t.real}
              </span>
            )}
            {/* Siempre visible: en móvil no hay hover que avise que se puede ampliar */}
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[#284FD8] shadow-md transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none"
            >
              <Maximize2 className="h-4 w-4" />
            </span>
          </button>
          <figcaption className={`mt-3 text-sm font-medium ${ink.caption}`}>{alt}</figcaption>
        </figure>
      ),
    };
  });

  const intro = (
    <>
      {!embedded && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#284FD8]">{t.eyebrow}</p>}
      <Title
        id="sap-entorno-title"
        className={`${embedded ? 'text-[clamp(1.5rem,3vw,2rem)]' : 'mt-3 text-[clamp(1.6rem,3.6vw,2.4rem)]'} font-bold leading-tight tracking-tight [text-wrap:balance] ${ink.title}`}
      >
        {t.title}
      </Title>
      <p className={`mt-4 max-w-[60ch] text-base leading-relaxed md:text-lg ${ink.body}`}>{t.lead}</p>
    </>
  );

  const points = (
    <ul className={`grid gap-x-8 gap-y-5 sm:grid-cols-2 ${embedded ? 'mt-8' : ''}`}>
      {t.points.map((point, i) => {
        const Icon = ICONS[i];
        return (
          <li key={point.title} className="flex gap-3">
            {embedded ? (
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${ink.icon}`} aria-hidden="true" />
            ) : (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#284FD8]/15 bg-[#284FD8]/10">
                <Icon className={`h-5 w-5 ${ink.icon}`} aria-hidden="true" />
              </span>
            )}
            <div>
              <PointTitle className={`font-semibold ${ink.title}`}>{point.title}</PointTitle>
              <p className={`mt-1 text-sm leading-relaxed ${ink.body}`}>{point.text}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );

  const carousel = (
    <MotionCarousel
      slides={slides}
      options={{ align: 'start' }}
      slideSize="min(88%, 760px)"
      prevLabel={t.prev}
      nextLabel={t.next}
      tone={embedded ? 'dark' : 'light'}
    />
  );

  return (
    <div aria-labelledby="sap-entorno-title" role="region" className="[&_p]:text-left">
      {embedded ? (
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14">
          <div>
            {intro}
            {points}
          </div>
          {carousel}
        </div>
      ) : (
        <>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-14">
            <div>{intro}</div>
            {points}
          </div>
          <div className="mt-12">{carousel}</div>
          <p className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#284FD8]" aria-hidden="true" />
            {t.note}
          </p>
        </>
      )}

      {/* Visor: carrusel a pantalla casi completa; flechas del teclado y deslizar en móvil (Embla) */}
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent
          aria-describedby={undefined}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') api?.scrollPrev();
            if (e.key === 'ArrowRight') api?.scrollNext();
          }}
          className="w-[96vw] max-w-[1400px] gap-0 border-white/10 bg-[#0B1533] p-3 text-white sm:p-5 [&>button]:text-white [&>button]:opacity-90"
        >
          <DialogTitle className="sr-only">{t.eyebrow}</DialogTitle>
          {open !== null && (
            <Carousel key={open} setApi={setApi} opts={{ startIndex: open, loop: true }} className="mt-8">
              <CarouselContent>
                {SAP_ENV_SHOTS.map((shot) => (
                  <CarouselItem key={shot.src} className="flex items-center justify-center">
                    <img
                      src={shot.src}
                      alt={shot.alt[lc]}
                      width={shot.w}
                      height={shot.h}
                      className="max-h-[75vh] w-auto rounded-lg object-contain"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious aria-label={t.prev} className="left-2 h-11 w-11 border-0 bg-white/90 text-[#101D42] shadow-lg hover:bg-white sm:left-4" />
              <CarouselNext aria-label={t.next} className="right-2 h-11 w-11 border-0 bg-white/90 text-[#101D42] shadow-lg hover:bg-white sm:right-4" />
            </Carousel>
          )}
          <div className="mt-4 flex items-center justify-between gap-4 px-1 text-sm">
            <p className="font-medium text-white/90" aria-live="polite">{SAP_ENV_SHOTS[current].alt[lc]}</p>
            <p className="shrink-0 tabular-nums text-white/60">{current + 1} / {SAP_ENV_SHOTS.length}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SapEntorno;
