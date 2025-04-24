import { useRef } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CyberpunkInterface = ({ children, title }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Animate container when it enters viewport
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.98 },
      { 
        opacity: 1, 
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="relative border border-indigo-500/30 rounded-md overflow-hidden bg-black/20 backdrop-blur-sm">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 py-2 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs text-cyan-300 ml-3 font-mono tracking-wider">{title || "INTERFACE"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1 h-4 bg-cyan-500/50"></div>
          <div className="w-2 h-2 bg-cyan-400/70 rounded-full"></div>
        </div>
      </div>
      
      {/* Left Border Decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/80 via-purple-500/50 to-transparent"></div>
      
      {/* Right Border Decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-purple-500/50 to-indigo-500/80"></div>
      
      {/* Bottom Border Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/80 via-purple-500/50 to-indigo-500/80"></div>
      
      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-indigo-500"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-indigo-500"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-indigo-500"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-indigo-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Scanner Effect */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none">
        <div className="h-px w-full bg-cyan-400/20 absolute scan-line"></div>
      </div>
    </div>
  );
};

export default CyberpunkInterface; 