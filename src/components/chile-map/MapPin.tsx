import React from 'react';
import { COLORS } from './data';

interface MapPinProps {
  x: number;
  y: number;
  label: string;
  isActive: boolean;
  labelAbove?: boolean;
  onClick: () => void;
  onMouseEnter: (e: React.MouseEvent<SVGGElement>) => void;
  onMouseLeave: () => void;
}

const MapPin: React.FC<MapPinProps> = ({
  x,
  y,
  label,
  isActive,
  labelAbove = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const fontSize = isActive ? 18 : 16;
  // Estimate text width (chars * ~9px per char at fontSize 16)
  const textWidth = label.length * fontSize * 0.58 + 16;
  const textHeight = fontSize + 8;
  const lineLen = 22;
  const labelY = labelAbove
    ? y - lineLen - textHeight / 2
    : y + lineLen + textHeight / 2;
  const lineY2 = labelAbove ? y - lineLen : y + lineLen;

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
      {/* Connector line */}
      <line
        x1={x}
        y1={y}
        x2={x}
        y2={lineY2}
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={1.5}
        className="pointer-events-none"
      />
      {/* Label background */}
      <rect
        x={x - textWidth / 2}
        y={labelY - textHeight / 2}
        width={textWidth}
        height={textHeight}
        rx={5}
        ry={5}
        fill="rgba(36,55,120,0.82)"
        className="pointer-events-none"
      />
      {/* Label text */}
      <text
        x={x}
        y={labelY + fontSize * 0.35}
        fill="#ffffff"
        fontSize={fontSize}
        fontWeight={isActive ? 700 : 600}
        textAnchor="middle"
        className="pointer-events-none select-none"
      >
        {label}
      </text>
    </g>
  );
};

export default MapPin;
