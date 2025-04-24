import React, { useState } from 'react';
import GlowEffect from './GlowEffect';

const NeonBox = ({
  children,
  color = 'blue',
  intensity = 'medium',
  pulse = false,
  border = true,
  rounded = 'medium',
  padding = 'medium',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Color variations with matching glow colors
  const colorMap = {
    blue: {
      primary: 'text-cyan-400',
      secondary: 'text-cyan-300',
      border: 'border-cyan-500',
      glow: '#0891b2',
    },
    purple: {
      primary: 'text-purple-400',
      secondary: 'text-purple-300',
      border: 'border-purple-500',
      glow: '#8b5cf6',
    },
    pink: {
      primary: 'text-pink-400',
      secondary: 'text-pink-300',
      border: 'border-pink-500',
      glow: '#ec4899',
    },
    green: {
      primary: 'text-emerald-400',
      secondary: 'text-emerald-300',
      border: 'border-emerald-500',
      glow: '#10b981',
    },
    red: {
      primary: 'text-red-400',
      secondary: 'text-red-300',
      border: 'border-red-500',
      glow: '#ef4444',
    },
    yellow: {
      primary: 'text-amber-400',
      secondary: 'text-amber-300',
      border: 'border-amber-500',
      glow: '#f59e0b',
    },
  };

  // Intensity variations for the glow
  const intensityMap = {
    low: '1',
    medium: '2',
    high: '3',
    extreme: '4',
  };

  // Rounded corner variations
  const roundedMap = {
    none: 'rounded-none',
    small: 'rounded',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-full',
  };

  // Padding variations
  const paddingMap = {
    none: 'p-0',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
  };

  const selectedColor = colorMap[color] || colorMap.blue;
  const selectedRounded = roundedMap[rounded] || roundedMap.medium;
  const selectedPadding = paddingMap[padding] || paddingMap.medium;
  const selectedIntensity = intensityMap[intensity] || intensityMap.medium;

  const pulseAnimation = pulse 
    ? 'animate-pulse duration-4000' 
    : '';

  return (
    <div 
      className={`
        relative 
        bg-gray-900/80
        ${selectedPadding}
        ${selectedRounded}
        ${border ? `border ${selectedColor.border}` : ''}
        ${pulseAnimation}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <GlowEffect 
        color={selectedColor.glow}
        size={isHovered ? parseInt(selectedIntensity) + 1 : selectedIntensity}
        className="absolute inset-0"
      />

      {/* Inner content with neon text */}
      <div className={`relative z-10 ${selectedColor.primary}`}>
        {children}
      </div>

      {/* Neon corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-80 z-20" 
        style={{ borderColor: selectedColor.glow }} />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r opacity-80 z-20" 
        style={{ borderColor: selectedColor.glow }} />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l opacity-80 z-20" 
        style={{ borderColor: selectedColor.glow }} />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-80 z-20" 
        style={{ borderColor: selectedColor.glow }} />
    </div>
  );
};

export default NeonBox; 