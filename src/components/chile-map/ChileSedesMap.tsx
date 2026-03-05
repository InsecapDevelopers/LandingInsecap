import React, { useState, useCallback } from 'react';
import { Building2, Globe } from 'lucide-react';
import ChileMap from './ChileMap';
import Tooltip from './Tooltip';
import { sedeLocations } from './data';

type Mode = 'fisicas' | 'virtuales';

const ChileSedesMap: React.FC = () => {
  const [mode, setMode] = useState<Mode>('fisicas');
  const [hoveredSede, setHoveredSede] = useState<string | null>(null);
  const [pinPos, setPinPos] = useState<{ x: number; y: number } | null>(null);

  const handleSedeHover = useCallback((sedeId: string | null, screenX?: number, screenY?: number) => {
    setHoveredSede(sedeId);
    setPinPos(sedeId && screenX !== undefined && screenY !== undefined ? { x: screenX, y: screenY } : null);
  }, []);

  const hoveredData = hoveredSede
    ? sedeLocations.find((s) => s.id === hoveredSede)
    : null;

  return (
    <div>
      {/* Tooltip */}
      <Tooltip
        visible={!!hoveredData}
        pinPos={pinPos}
        nombre={hoveredData?.nombre ?? ''}
        ciudad={hoveredData?.ciudad ?? ''}
        direccion={hoveredData?.direccion ?? ''}
        telefono={hoveredData?.telefono ?? ''}
        tipo={hoveredData?.tipo ?? 'virtual'}
      />

      {/* Toggle buttons (desktop only) */}
      <div className="hidden md:flex flex-col items-center gap-2 mb-2">
        <div className="flex justify-center gap-3">
        <button
          onClick={() => setMode('fisicas')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 border-2 cursor-pointer ${
            mode === 'fisicas'
              ? 'bg-gradient-to-r from-[#3C4F97] to-[#485CC7] text-white border-[#485CC7] shadow-lg shadow-blue-500/25'
              : 'bg-white/60 text-gray-500 border-gray-200 hover:border-[#485CC7]/30 hover:text-[#3C4F97]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Sedes Físicas
        </button>
        <button
          onClick={() => setMode('virtuales')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 border-2 cursor-pointer ${
            mode === 'virtuales'
              ? 'bg-gradient-to-r from-[#23B7C7] to-[#00D4E8] text-white border-[#23B7C7] shadow-lg shadow-cyan-500/25'
              : 'bg-white/60 text-gray-500 border-gray-200 hover:border-[#23B7C7]/30 hover:text-[#23B7C7]'
          }`}
        >
          <Globe className="w-4 h-4" />
          Sedes Virtuales
          </button>
        </div>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Mapa interactivo — pasa el cursor sobre una sede
        </p>
      </div>

      {/* Mobile: static image */}
      <div className="block md:hidden">
        <img
          src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Mapa-Pagina-Web-2048x1119_5e4175db-ab32-4b50-be4c-c3f009f396d9.png?v=1772739032"
          alt="Mapa de sedes Insecap en Chile"
          className="w-full h-auto rounded-2xl"
          loading="lazy"
        />
      </div>

      {/* Desktop: interactive SVG map */}
      <div className="hidden md:flex justify-center">
        <div className="relative w-full max-w-6xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5 rounded-3xl blur-3xl" />
          <ChileMap
            mode={mode}
            hoveredSede={hoveredSede}
            onSedeHover={handleSedeHover}
          />
        </div>
      </div>
    </div>
  );
};

export default ChileSedesMap;
