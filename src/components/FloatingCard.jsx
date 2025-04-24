import { useState, useRef, useEffect } from 'react';
import GlowEffect from './GlowEffect';

const FloatingCard = ({ 
  children, 
  className = '',
  color = 'blue', 
  elevation = 'medium',
  interactive = true,
  maxTilt = 10,
  glowIntensity = 'medium'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [floating, setFloating] = useState(false);

  // Effect to handle floating animation
  useEffect(() => {
    if (!interactive) return;
    
    // Start floating animation after a short delay
    const timer = setTimeout(() => {
      setFloating(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [interactive]);

  // Handle mouse movement for tilt effect
  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center as percentage of half width/height
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);
    
    // Calculate rotation (limited by maxTilt)
    setRotation({
      x: -percentY * maxTilt, // Reversed for natural feeling
      y: percentX * maxTilt
    });
  };

  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  // Elevation styling
  const elevationStyles = {
    low: 'shadow-md hover:shadow-lg',
    medium: 'shadow-lg hover:shadow-xl',
    high: 'shadow-xl hover:shadow-2xl'
  };

  // Handle animation classes
  const floatingAnimation = floating && interactive ? 'animate-float' : '';
  const tiltTransform = interactive && isHovered
    ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
    : 'rotateX(0deg) rotateY(0deg)';

  return (
    <GlowEffect 
      color={color} 
      intensity={glowIntensity}
      withHover={interactive}
      className={`perspective-1000 ${floatingAnimation} ${className}`}
    >
      <div 
        ref={cardRef}
        className={`
          relative overflow-hidden
          bg-slate-900/60 backdrop-blur-sm
          border border-slate-700/50
          rounded-lg p-5
          transition-all duration-300 ease-out
          ${elevationStyles[elevation] || elevationStyles.medium}
        `}
        style={{ 
          transform: tiltTransform,
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Holographic effect elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-800/5 to-slate-700/10 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/30 to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-slate-500/30 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-slate-500/30 to-transparent" />
        
        {/* Scanlines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-scanlines"></div>
        
        {/* Card content */}
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </GlowEffect>
  );
};

export default FloatingCard; 