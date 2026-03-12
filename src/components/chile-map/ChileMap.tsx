import React, { useMemo, useRef } from 'react';
import MapPin from './MapPin';
import { regiones, regionPaths, regionesDecorativas, sedeLocations, COLORS } from './data';

interface ChileMapProps {
  mode: 'fisicas' | 'virtuales';
  hoveredSede: string | null;
  onSedeHover: (sedeId: string | null, screenX?: number, screenY?: number) => void;
}

/** Transform vertical SVG coords → horizontal (rotate -90° around center) */
const transformCoord = (x: number, y: number) => ({ x: y, y: 1000 - x });

const ChileMap: React.FC<ChileMapProps> = ({
  mode,
  hoveredSede,
  onSedeHover,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const filteredSedes = useMemo(
    () => sedeLocations.filter((s) => s.tipo === (mode === 'fisicas' ? 'fisica' : 'virtual')),
    [mode]
  );

  // Regions that contain sedes in the current mode get highlighted
  const activeRegionIds = useMemo(
    () => new Set(filteredSedes.map((s) => s.regionId)),
    [filteredSedes]
  );

  // Region of the hovered sede
  const hoveredRegionId = useMemo(() => {
    if (!hoveredSede) return null;
    return sedeLocations.find((s) => s.id === hoveredSede)?.regionId ?? null;
  }, [hoveredSede]);

  return (
    <div className="relative w-full flex items-center justify-center">
      <svg
        ref={svgRef}
        viewBox="-70 230 1140 560"
        className="w-full h-auto drop-shadow-2xl min-h-[420px] md:min-h-[520px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow filter definition */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(35,183,199,0.05)" />
            <stop offset="100%" stopColor="rgba(60,79,151,0.05)" />
          </linearGradient>
        </defs>

        {/* All paths rotated -90° for horizontal display */}
        <g transform="rotate(-90 500 500)">
          {/* Decorative regions */}
          {regionesDecorativas.map((r) => (
            <path
              key={r.id}
              d={r.d}
              fill={r.color}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1.5}
              strokeLinejoin="round"
              opacity={0.5}
            />
          ))}

          {/* Interactive regions — plain paths with conditional highlight */}
          {regiones.map((region) => {
            const pathD = regionPaths[region.id];
            if (!pathD) return null;
            const isHighlighted = activeRegionIds.has(region.id);
            const isHovered = hoveredRegionId === region.id;
            return (
              <path
                key={region.id}
                d={pathD}
                fill={isHovered ? region.colorActive : isHighlighted ? region.color : region.color}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1.5}
                strokeLinejoin="round"
                opacity={isHighlighted ? (isHovered ? 1 : 0.85) : 0.4}
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {/* Sede pins based on mode */}
        {mode === 'fisicas'
          ? /* Physical: MapPin with pulsing animation */
            filteredSedes.map((sede, index) => {
              const pos = transformCoord(sede.pinX, sede.pinY);
              return (
                <MapPin
                  key={`pin-${sede.id}`}
                  x={pos.x}
                  y={pos.y}
                  label={sede.ciudad}
                  isActive={hoveredSede === sede.id}
                  labelAbove={index % 2 === 0}
                  onClick={() => {}}
                  onMouseEnter={(e) => onSedeHover(sede.id, e.clientX, e.clientY)}
                  onMouseLeave={() => onSedeHover(null)}
                />
              );
            })
          : /* Virtual: subtle dot markers with city labels alternating above/below */
            filteredSedes.map((sede, index) => {
              const pos = transformCoord(sede.pinX, sede.pinY);
              const isHovered = hoveredSede === sede.id;
              const isAbove = index % 2 === 0;
              const labelY = isAbove
                ? pos.y - (isHovered ? 22 : 16)
                : pos.y + (isHovered ? 28 : 22);
              return (
                <g
                  key={`vpin-${sede.id}`}
                  className="cursor-pointer"
                  onMouseEnter={(e) => onSedeHover(sede.id, e.clientX, e.clientY)}
                  onMouseLeave={() => onSedeHover(null)}
                >
                  {/* Outer glow ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 12 : 8}
                    fill={COLORS.turquesa}
                    opacity={isHovered ? 0.35 : 0.15}
                    className="transition-all duration-200"
                  />
                  {/* Inner dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 6 : 4}
                    fill={isHovered ? COLORS.turquesaClaro : COLORS.grisClaro}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    className="transition-all duration-200"
                    style={{
                      filter: isHovered
                        ? 'drop-shadow(0 0 4px rgba(35,183,199,0.5))'
                        : 'none',
                    }}
                  />
                  {/* City label — alternating above/below */}
                  <text
                    x={pos.x}
                    y={labelY}
                    fill="#ffffff"
                    fontSize={isHovered ? 15 : 12}
                    fontWeight={isHovered ? 700 : 600}
                    textAnchor="middle"
                    className="pointer-events-none select-none transition-all duration-200"
                    style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
                  >
                    {sede.ciudad}
                  </text>
                </g>
              );
            })}
      </svg>
    </div>
  );
};

export default ChileMap;
