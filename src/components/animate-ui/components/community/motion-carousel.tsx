'use client';

import * as React from 'react';
import { motion, useReducedMotion, type Transition } from 'motion/react';
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// Adaptado de @animate-ui/components-community-motion-carousel: recibe contenido real
// (no solo números), etiquetas accesibles y tono claro/oscuro.

type MotionSlide = { key: string; label: string; content: React.ReactNode };

type MotionCarouselProps = {
  slides: MotionSlide[];
  options?: EmblaOptionsType;
  /** Ancho de cada slide (CSS), p. ej. '85%'. El vecino asoma para invitar a deslizar. */
  slideSize?: string;
  prevLabel: string;
  nextLabel: string;
  tone?: 'light' | 'dark';
  className?: string;
};

type EmblaControls = {
  selectedIndex: number;
  scrollSnaps: number[];
  prevDisabled: boolean;
  nextDisabled: boolean;
  onDotClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

const transition: Transition = { type: 'spring', stiffness: 240, damping: 24, mass: 1 };

const useEmblaControls = (emblaApi: EmblaCarouselType | undefined): EmblaControls => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [prevDisabled, setPrevDisabled] = React.useState(true);
  const [nextDisabled, setNextDisabled] = React.useState(true);

  const onDotClick = React.useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
  const onPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateSelectionState = (api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  };

  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    updateSelectionState(api);
  }, []);

  const onSelect = React.useCallback((api: EmblaCarouselType) => updateSelectionState(api), []);

  React.useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    emblaApi.on('reInit', onInit).on('select', onSelect);
    return () => {
      emblaApi.off('reInit', onInit).off('select', onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return { selectedIndex, scrollSnaps, prevDisabled, nextDisabled, onDotClick, onPrev, onNext };
};

function MotionCarousel({
  slides,
  options,
  slideSize = '85%',
  prevLabel,
  nextLabel,
  tone = 'light',
  className,
}: MotionCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { selectedIndex, scrollSnaps, prevDisabled, nextDisabled, onDotClick, onPrev, onNext } =
    useEmblaControls(emblaApi);
  const reduceMotion = useReducedMotion();
  const dark = tone === 'dark';

  const arrow = cn(
    'grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    dark
      ? 'bg-white/10 text-white hover:bg-white/20 focus-visible:ring-sky-300 focus-visible:ring-offset-[#0D1C3F]'
      : 'bg-[#101D42] text-white hover:bg-[#284FD8] focus-visible:ring-[#284FD8]',
  );

  return (
    <div
      className={cn('w-full space-y-4', className)}
      style={{ '--slide-size': slideSize, '--slide-spacing': '1rem' } as React.CSSProperties}
      // Flechas del teclado con el foco en cualquier parte del carrusel.
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') onPrev();
        if (e.key === 'ArrowRight') onNext();
      }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((slide, index) => (
            <div
              key={slide.key}
              role="group"
              aria-roledescription="slide"
              aria-label={slide.label}
              className="mr-[var(--slide-spacing)] flex min-w-0 flex-none basis-[var(--slide-size)]"
            >
              <motion.div
                className="size-full"
                initial={false}
                // El slide activo al frente; los vecinos atrás y un poco apagados.
                animate={{ scale: index === selectedIndex || reduceMotion ? 1 : 0.92, opacity: index === selectedIndex ? 1 : 0.55 }}
                transition={reduceMotion ? { duration: 0 } : transition}
              >
                {slide.content}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button type="button" onClick={onPrev} disabled={prevDisabled} aria-label={prevLabel} className={arrow}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {scrollSnaps.map((_, index) => {
            const selected = index === selectedIndex;
            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => onDotClick(index)}
                aria-label={slides[index]?.label}
                aria-current={selected}
                layout={!reduceMotion}
                initial={false}
                className={cn(
                  'flex cursor-pointer select-none items-center justify-center rounded-full text-xs font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  dark
                    ? 'bg-sky-300 text-[#0D1C3F] focus-visible:ring-sky-300 focus-visible:ring-offset-[#0D1C3F]'
                    : 'bg-[#284FD8] text-white focus-visible:ring-[#284FD8]',
                  !selected && (dark ? 'bg-white/30' : 'bg-slate-300'),
                )}
                animate={{ width: selected ? 52 : 10, height: selected ? 26 : 10 }}
                transition={reduceMotion ? { duration: 0 } : transition}
              >
                <motion.span
                  initial={false}
                  className="block whitespace-nowrap px-2"
                  animate={{ opacity: selected ? 1 : 0, scale: selected ? 1 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : transition}
                  aria-hidden="true"
                >
                  {index + 1}/{scrollSnaps.length}
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        <button type="button" onClick={onNext} disabled={nextDisabled} aria-label={nextLabel} className={arrow}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export { MotionCarousel, type MotionCarouselProps, type MotionSlide };
