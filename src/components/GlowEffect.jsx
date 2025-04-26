import React from 'react';
import { motion } from 'framer-motion';

/**
 * Enhanced GlowEffect component with improved visuals and animations
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Content to display with the glow effect
 * @param {string} props.className Additional CSS classes
 * @param {string} props.color Base color for the glow (Tailwind color class)
 * @param {string} props.intensity Glow intensity: 'low', 'medium', 'high', 'extreme'
 * @param {Function} props.onClick Optional click handler function
 * @param {boolean} props.animated Whether to animate the glow effect
 * @param {string} props.variant Visual variant: 'default', 'pulse', 'ripple', 'shimmer'
 * @returns {JSX.Element} Enhanced GlowEffect component
 */
const GlowEffect = ({ 
  children,
  className = '',
  color = 'cyan-400', // Tailwind color class
  intensity = 'medium', // 'low', 'medium', 'high', 'extreme'
  onClick,
  animated = false,
  variant = 'default'
}) => {
  // Calculate shadow opacity based on intensity
  const intensityMap = {
    low: { opacity: '0.1', blur: 'blur-md', scale: '1.05', hover: '0.2' },
    medium: { opacity: '0.2', blur: 'blur-lg', scale: '1.07', hover: '0.3' },
    high: { opacity: '0.3', blur: 'blur-xl', scale: '1.1', hover: '0.4' },
    extreme: { opacity: '0.4', blur: 'blur-2xl', scale: '1.15', hover: '0.6' }
  };

  const settings = intensityMap[intensity] || intensityMap.medium;
  const hoverClass = onClick ? 'cursor-pointer' : '';
  
  // Function to get animation properties based on variant
  const getAnimationProps = () => {
    if (!animated) return {};
    
    switch(variant) {
      case 'pulse':
        return {
          animate: { 
            scale: [1, settings.scale, 1],
            opacity: [settings.opacity, settings.hover, settings.opacity]
          },
          transition: { 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'ripple':
        return {
          animate: { 
            scale: [1, 1.2],
            opacity: [settings.opacity, 0]
          },
          transition: { 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }
        };
      case 'shimmer':
        // Shimmer effect uses a pseudo-element in CSS
        return {};
      default:
        return {};
    }
  };
  
  const animationProps = getAnimationProps();
  
  // Pulse animation styles for the variant
  const getVariantClass = () => {
    switch(variant) {
      case 'shimmer':
        return 'glow-shimmer';
      case 'ripple':
        return 'glow-ripple';
      default:
        return '';
    }
  };
  
  return (
    <div 
      className={`relative ${hoverClass} ${className} overflow-visible`}
      onClick={onClick}
    >
      {/* The glow effect layer */}
      <motion.div 
        className={`absolute inset-0 rounded-inherit bg-${color} ${settings.blur} transition-all duration-300 -z-10 pointer-events-none ${getVariantClass()}`}
        style={{ opacity: settings.opacity }}
        whileHover={!animated ? { scale: settings.scale, opacity: settings.hover } : {}}
        {...animationProps}
      />
      
      {/* Multiple layers for depth */}
      <motion.div 
        className={`absolute inset-0 rounded-inherit bg-${color} blur-md transition-all duration-300 -z-20 pointer-events-none`}
        style={{ opacity: settings.opacity * 0.5 }}
        whileHover={!animated ? { scale: settings.scale * 1.1, opacity: settings.hover * 0.5 } : {}}
      />
      
      {/* Border with gradient effect */}
      <div className={`absolute inset-0 rounded-inherit border border-${color}/40 pointer-events-none overflow-hidden`}>
        {variant === 'shimmer' && (
          <div className="absolute inset-0 shimmer-effect" />
        )}
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>
      
      <style jsx>{`
        .glow-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          100% {
            left: 200%;
          }
        }
        
        .glow-ripple::before {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: inherit;
          border: 2px solid transparent;
          background: linear-gradient(45deg, rgba(6, 182, 212, 0.5), transparent, rgba(6, 182, 212, 0.5)) border-box;
          mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: rotate 4s linear infinite;
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .shimmer-effect {
          position: absolute;
          top: -400%;
          left: -150%;
          width: 400%;
          height: 200%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(6, 182, 212, 0.1),
            transparent
          );
          transform: rotate(30deg);
          animation: shimmerMove 3s linear infinite;
        }
        
        @keyframes shimmerMove {
          0% {
            transform: translateX(-30%) rotate(30deg);
          }
          100% {
            transform: translateX(30%) rotate(30deg);
          }
        }
      `}</style>
    </div>
  );
};

export default GlowEffect; 