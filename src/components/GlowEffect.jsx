import React from 'react';

export const GlowEffect = ({ 
  children,
  className = '',
  color = 'blue-100', // Tailwind color class
  intensity = 'medium', // 'low', 'medium', 'high'
  onClick
}) => {
  // Calculate shadow opacity based on intensity
  const intensityMap = {
    low: 'opacity-10 hover:opacity-20',
    medium: 'opacity-20 hover:opacity-30',
    high: 'opacity-30 hover:opacity-40'
  };

  const opacityClass = intensityMap[intensity] || intensityMap.medium;
  const hoverClass = onClick ? 'cursor-pointer transform transition-all duration-300 hover:-translate-y-1' : '';
  
  return (
    <div 
      className={`relative ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {/* The glow effect overlay */}
      <div className={`absolute inset-0 rounded-inherit bg-${color} blur-xl ${opacityClass} transition-opacity duration-300 -z-10 pointer-events-none`}></div>
      
      {/* Border effect */}
      <div className={`absolute inset-0 rounded-inherit border border-${color}/30 pointer-events-none`}></div>
      
      {/* Content */}
      <div className="relative overflow-hidden mix-blend-screen">
        {children}
      </div>
    </div>
  );
};

export default GlowEffect; 