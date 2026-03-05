import React from 'react';
import { COLORS } from './data';

interface MapPinProps {
  x: number;
  y: number;
  label: string;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: (e: React.MouseEvent<SVGGElement>) => void;
  onMouseLeave: () => void;
}

const MapPin: React.FC<MapPinProps> = ({
  x,
  y,
  label,
  isActive,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <g
      className="cursor-pointer"
      onClick={onClick}
      onMouseEnter={(e) => onMouseEnter(e)}
      onMouseLeave={onMouseLeave}
    >
      {/* Pulsing ring */}
      <circle
        cx={x}
        cy={y}
        r={isActive ? 32 : 24}
        fill="none"
        stroke={COLORS.turquesa}
        strokeWidth={3}
        opacity={0.4}
        className="animate-ping"
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
      {/* Outer glow */}
      <circle
        cx={x}
        cy={y}
        r={isActive ? 20 : 16}
        fill={COLORS.turquesa}
        opacity={0.25}
      />
      {/* Main pin dot */}
      <circle
        cx={x}
        cy={y}
        r={isActive ? 12 : 9}
        fill={isActive ? COLORS.turquesaClaro : COLORS.turquesa}
        stroke="#ffffff"
        strokeWidth={4}
        className="transition-all duration-200"
        style={{
          filter: isActive ? 'drop-shadow(0 0 8px rgba(35,183,199,0.6))' : 'drop-shadow(0 0 4px rgba(35,183,199,0.3))',
        }}
      />
      {/* Label */}
      <text
        x={x + 24}
        y={y + 8}
        fill="#ffffff"
        fontSize={isActive ? 22 : 20}
        fontWeight={isActive ? 700 : 500}
        className="pointer-events-none select-none"
        style={{
          textShadow: '0 1px 4px rgba(0,0,0,0.7)',
        }}
      >
        {label}
      </text>
    </g>
  );
};

export default MapPin;
