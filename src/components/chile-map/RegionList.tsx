import React from 'react';
import { Globe, Monitor } from 'lucide-react';
import { regiones, sedesVirtuales } from './data';

interface RegionListProps {
  hoveredRegion: string | null;
  activeRegion: string | null;
  onRegionHover: (regionId: string | null) => void;
  onRegionClick: (regionId: string) => void;
}

const RegionList: React.FC<RegionListProps> = ({
  hoveredRegion,
  activeRegion,
  onRegionHover,
  onRegionClick,
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Globe className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-blue-950 text-sm">Sedes Virtuales</h3>
          <p className="text-xs text-gray-500">Capacitación online</p>
        </div>
      </div>

      {/* Region list */}
      <div className="space-y-1.5">
        {regiones.map((region) => {
          const isVirtual = region.tipo === 'virtual' || region.tipo === 'ambas';
          const isHovered = hoveredRegion === region.id;
          const isActive = activeRegion === region.id;

          return (
            <button
              key={region.id}
              className={`
                w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group
                flex items-center gap-3 border
                ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm'
                    : isHovered
                    ? 'bg-blue-50/50 border-blue-100'
                    : 'bg-white/50 border-transparent hover:bg-blue-50/30 hover:border-blue-100/50'
                }
              `}
              onMouseEnter={() => onRegionHover(region.id)}
              onMouseLeave={() => onRegionHover(null)}
              onClick={() => onRegionClick(region.id)}
            >
              {/* Indicator dot */}
              <div
                className={`
                  w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-200
                  ${isActive || isHovered ? 'scale-125' : 'scale-100'}
                `}
                style={{ backgroundColor: region.color }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-900'
                      : isHovered
                      ? 'text-blue-800'
                      : 'text-gray-700'
                  }`}
                >
                  {region.nombre}
                </p>
                <p className="text-xs text-gray-400 truncate">{region.ciudad}</p>
              </div>

              {/* Type badge */}
              <div
                className={`
                  shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium
                  transition-all duration-200
                  ${
                    isVirtual
                      ? 'bg-cyan-50 text-cyan-600'
                      : 'bg-blue-50 text-blue-600'
                  }
                  ${isActive || isHovered ? 'opacity-100' : 'opacity-70'}
                `}
              >
                {isVirtual ? (
                  <Monitor className="w-3 h-3" />
                ) : (
                  <Globe className="w-3 h-3" />
                )}
                {region.tipo === 'ambas' ? 'Ambas' : isVirtual ? 'Virtual' : 'Física'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RegionList;
