import React from 'react';

interface RegionPathProps {
  d: string;
  regionId: string;
  color: string;
  colorHover: string;
  colorActive: string;
  isHovered: boolean;
  isActive: boolean;
  onMouseEnter: (regionId: string) => void;
  onMouseLeave: () => void;
  onClick: (regionId: string) => void;
}

const RegionPath: React.FC<RegionPathProps> = ({
  d,
  regionId,
  color,
  colorHover,
  colorActive,
  isHovered,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  const fillColor = isActive ? colorActive : isHovered ? colorHover : color;
  const strokeColor = isActive || isHovered ? '#ffffff' : 'rgba(255,255,255,0.3)';
  const strokeWidth = isActive ? 3 : isHovered ? 2.5 : 1.5;

  return (
    <path
      d={d}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      className="cursor-pointer transition-all duration-200"
      style={{
        filter: isHovered || isActive ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'none',
      }}
      onMouseEnter={() => onMouseEnter(regionId)}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(regionId)}
    />
  );
};

export default RegionPath;
