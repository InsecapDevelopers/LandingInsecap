import React, { useEffect, useState } from 'react';
import { Meteors } from '@/components/ui/meteors';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    // Secuencia (igual que RelatoresYA):
    // 0–1050ms  → 3 barras blancas suben (300+350+400ms)
    // 1100ms    → logo fade-in (700ms)
    // 1850ms    → subtítulo fade-in (600ms)
    // 3100ms    → empieza fade-out (600ms)
    // 3700ms    → listo
    const tOut  = setTimeout(() => setPhase('out'), 3100);
    const tDone = setTimeout(() => onDone(), 3700);
    return () => { clearTimeout(tOut); clearTimeout(tDone); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(to right, #00B8DE, #485CC7)',
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 600ms ease-in-out' : 'none',
        pointerEvents: phase === 'out' ? 'none' : 'all',
      }}
    >
      <style>{`
        /* Solo transform y opacity: propiedades 100% composited, 60fps garantizados */
        @keyframes barUp {
          from { transform: scaleY(1) translateZ(0); }
          to   { transform: scaleY(0) translateZ(0); }
        }
        @keyframes logoFadeIn {
          from { opacity: 0; transform: scale(0.92) translateZ(0); }
          to   { opacity: 1; transform: scale(1)    translateZ(0); }
        }
        @keyframes subIn {
          from { opacity: 0; transform: translateY(16px) translateZ(0); }
          to   { opacity: 1; transform: translateY(0)    translateZ(0); }
        }
        .splash-bar-1 { animation: barUp      300ms ease-in                          0ms both; transform-origin: top; will-change: transform; }
        .splash-bar-2 { animation: barUp      350ms ease-in                        300ms both; transform-origin: top; will-change: transform; }
        .splash-bar-3 { animation: barUp      400ms ease-in                        650ms both; transform-origin: top; will-change: transform; }
        .splash-logo  { animation: logoFadeIn 700ms cubic-bezier(.22,.68,0,1.08) 1100ms both; will-change: transform, opacity; }
        .splash-sub   { animation: subIn      600ms ease-out                      1850ms both; will-change: transform, opacity; }
      `}</style>

      {/* Meteors decorativos */}
      <Meteors number={18} />

      {/* 3 barras blancas — scaleY + translateZ(0) = composited layer propio */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="splash-bar-1 absolute inset-y-0 left-0 bg-white"
             style={{ width: '33.34%' }} />
        <div className="splash-bar-2 absolute inset-y-0 bg-white"
             style={{ left: '33.33%', width: '33.34%' }} />
        <div className="splash-bar-3 absolute inset-y-0 right-0 bg-white"
             style={{ width: '33.34%' }} />
      </div>

      {/* Contenido centrado */}
      <div className="relative z-10 flex flex-col items-center gap-9">
        <img
          src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Insecap_Logo-07.png?v=1767801508"
          alt="Insecap"
          className="splash-logo w-72 sm:w-96 md:w-[30rem] select-none"
          draggable={false}
        />
        <p
          className="splash-sub text-white/80 font-light uppercase text-sm md:text-base select-none"
          style={{ letterSpacing: '0.42em' }}
        >
          Creciendo Juntos
        </p>
      </div>
    </div>
  );
}
