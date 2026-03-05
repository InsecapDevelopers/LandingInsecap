import React from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  visible: boolean;
  pinPos: { x: number; y: number } | null;
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  tipo: 'fisica' | 'virtual';
}

const Tooltip: React.FC<TooltipProps> = ({ visible, pinPos, nombre, ciudad, direccion, telefono, tipo }) => {
  if (!visible || !pinPos) return null;

  const tipoLabel = tipo === 'fisica' ? '📍 Sede Física' : '🌐 Sede Virtual';

  return createPortal(
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: pinPos.x,
        top: pinPos.y,
        transform: 'translate(-50%, calc(-100% - 16px))',
      }}
    >
      {/* Card */}
      <div className="bg-[#1a2a6c] text-white rounded-2xl px-4 py-3 shadow-2xl border border-white/15 min-w-[200px] max-w-[240px]">
        <p className="font-bold text-sm leading-tight">{nombre}</p>
        <p className="text-blue-200 text-xs mt-0.5">{ciudad}</p>
        {direccion && (
          <p className="text-blue-300/80 text-[11px] mt-1 leading-tight">{direccion}</p>
        )}
        {telefono && (
          <p className="text-blue-300/80 text-[11px] mt-0.5">{telefono}</p>
        )}
        <div className="mt-1.5 pt-1.5 border-t border-white/10">
          <span className="text-[11px] text-blue-300">{tipoLabel}</span>
        </div>
      </div>
      {/* Arrow pointing down to pin */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: -8,
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '9px solid #1a2a6c',
        }}
      />
    </div>,
    document.body
  );
};

export default Tooltip;
