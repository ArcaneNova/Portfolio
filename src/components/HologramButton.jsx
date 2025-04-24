import React, { useState } from 'react';

const HologramButton = ({ 
  children, 
  onClick, 
  className = '',
  glowColor = 'cyan',
  variant = 'primary',
  icon = null
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Define color schemes based on variant
  const colorSchemes = {
    primary: {
      base: 'border-cyan-400 bg-black bg-opacity-50',
      glow: 'shadow-cyan-500/50',
      text: 'text-cyan-400',
      hover: 'hover:bg-cyan-900/30'
    },
    secondary: {
      base: 'border-indigo-400 bg-black bg-opacity-50',
      glow: 'shadow-indigo-500/50',
      text: 'text-indigo-400',
      hover: 'hover:bg-indigo-900/30'
    },
    danger: {
      base: 'border-red-400 bg-black bg-opacity-50',
      glow: 'shadow-red-500/50',
      text: 'text-red-400',
      hover: 'hover:bg-red-900/30'
    }
  };
  
  const colors = colorSchemes[variant];
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group
        px-5 py-2
        border-2 border-dashed
        rounded
        font-mono
        transition-all duration-300
        transform
        ${colors.base}
        ${colors.text}
        ${colors.hover}
        ${isHovered ? `shadow-lg ${colors.glow}` : ''}
        ${className}
      `}
    >
      {/* Holographic scanline effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className={`scanline ${isHovered ? 'animate-scan' : ''}`}></div>
      </div>
      
      {/* Glitch effect on hover */}
      <div className={`absolute inset-0 ${isHovered ? 'animate-glitch' : ''} pointer-events-none opacity-30`}></div>
      
      {/* Content with icon if provided */}
      <div className="flex items-center justify-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span className={`relative z-10 ${isHovered ? 'animate-pulse' : ''}`}>{children}</span>
      </div>
      
      {/* Corner accents */}
      <div className="absolute h-2 w-2 border-t-2 border-l-2 left-0 top-0"></div>
      <div className="absolute h-2 w-2 border-t-2 border-r-2 right-0 top-0"></div>
      <div className="absolute h-2 w-2 border-b-2 border-l-2 left-0 bottom-0"></div>
      <div className="absolute h-2 w-2 border-b-2 border-r-2 right-0 bottom-0"></div>
      
      {/* Button data attributes display */}
      <div className="absolute -bottom-5 left-0 text-xs opacity-70">
        {isHovered && <span>SYS.BTN.{variant.toUpperCase()}</span>}
      </div>
    </button>
  );
};

export default HologramButton; 