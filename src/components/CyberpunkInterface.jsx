import { useRef, useEffect } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CyberpunkInterface = ({ children, title, variant = "default" }) => {
  const containerRef = useRef(null);
  const scannerRef = useRef(null);
  const glitchRef = useRef(null);
  const dataPointsRef = useRef(null);

  // Generate random data points for technical background
  const generateDataPoints = () => {
    const points = [];
    for (let i = 0; i < 30; i++) {
      points.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        pulse: Math.random() > 0.7
      });
    }
    return points;
  };

  const dataPoints = generateDataPoints();

  // Helper function to trigger random glitch effects
  const triggerGlitch = () => {
    if (!glitchRef.current) return;
    
    gsap.to(glitchRef.current, {
      skewX: () => Math.random() * 10 - 5,
      skewY: () => Math.random() * 10 - 5,
      duration: 0.1,
      onComplete: () => {
        gsap.to(glitchRef.current, {
          skewX: 0,
          skewY: 0,
          duration: 0.1
        });
      }
    });
  };

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

    // Create a timeline for the scanner animation
    if (scannerRef.current) {
      gsap.to(scannerRef.current, {
        y: '100%',
        duration: 3,
        ease: "none",
        repeat: -1,
        opacity: (i, el) => {
          return gsap.utils.random(0.3, 0.7);
        }
      });
    }

    // Set up random glitch intervals
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    }, 3000);

    // Data points subtle animations
    if (dataPointsRef.current && dataPointsRef.current.children.length) {
      Array.from(dataPointsRef.current.children).forEach(point => {
        if (point.dataset.pulse === "true") {
          gsap.to(point, {
            opacity: 0.3,
            duration: gsap.utils.random(1, 3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      });
    }

    return () => {
      clearInterval(glitchInterval);
    };
  }, []);

  // Color schemes for different variants
  const variantStyles = {
    default: {
      border: "border-indigo-500/30",
      gradient: "from-indigo-900/80 to-purple-900/80",
      text: "text-cyan-300",
      leftBorder: "from-indigo-500/80 via-purple-500/50 to-transparent",
      rightBorder: "from-transparent via-purple-500/50 to-indigo-500/80",
      bottomBorder: "from-indigo-500/80 via-purple-500/50 to-indigo-500/80",
      cornerBorder: "border-indigo-500",
      dataPoints: "bg-indigo-500",
      scanLine: "bg-indigo-400/20"
    },
    blue: {
      border: "border-blue-500/30",
      gradient: "from-blue-900/80 to-cyan-900/80",
      text: "text-blue-300",
      leftBorder: "from-blue-500/80 via-cyan-500/50 to-transparent",
      rightBorder: "from-transparent via-cyan-500/50 to-blue-500/80",
      bottomBorder: "from-blue-500/80 via-cyan-500/50 to-blue-500/80",
      cornerBorder: "border-blue-500",
      dataPoints: "bg-blue-500",
      scanLine: "bg-blue-400/20"
    },
    red: {
      border: "border-red-500/30",
      gradient: "from-red-900/80 to-orange-900/80",
      text: "text-red-300",
      leftBorder: "from-red-500/80 via-orange-500/50 to-transparent",
      rightBorder: "from-transparent via-orange-500/50 to-red-500/80",
      bottomBorder: "from-red-500/80 via-orange-500/50 to-red-500/80",
      cornerBorder: "border-red-500",
      dataPoints: "bg-red-500",
      scanLine: "bg-red-400/20"
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <div 
      ref={containerRef} 
      className={`relative ${styles.border} rounded-md overflow-hidden bg-black/20 backdrop-blur-sm group`}
    >
      {/* DataFlow Background - Technical pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div ref={dataPointsRef} className="relative w-full h-full">
          {dataPoints.map((point, index) => (
            <div 
              key={index}
              data-pulse={point.pulse}
              className={`absolute ${styles.dataPoints} rounded-full opacity-60`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: `${point.size}px`,
                height: `${point.size}px`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_70%)] opacity-70"></div>
        </div>
      </div>

      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM2MTYxZmYiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjMiPjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDBoMjBNMjAgNDBoMjBNMCAwdjQwIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>

      {/* Top Header Bar */}
      <div ref={glitchRef} className={`bg-gradient-to-r ${styles.gradient} py-2 px-4 flex items-center justify-between`}>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2 group-hover:animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2 group-hover:animate-pulse delay-75"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2 group-hover:animate-pulse delay-150"></div>
          <span className={`text-xs ${styles.text} ml-3 font-mono tracking-wider flex items-center`}>
            <span className="mr-2 inline-block w-2 h-2 bg-current animate-ping opacity-50 rounded-full"></span>
            {title || "INTERFACE"}
            <span className="ml-2 text-xs opacity-60 hidden sm:inline-block">v2.5.0</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs font-mono opacity-70 mr-2 hidden sm:block">{new Date().toISOString().substring(0, 10)}</div>
          <div className="w-1 h-4 bg-cyan-500/50 animate-pulse"></div>
          <div className="w-2 h-2 bg-cyan-400/70 rounded-full animate-ping"></div>
        </div>
      </div>
      
      {/* Left Border Decoration - Enhanced with animations */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${styles.leftBorder}`}>
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_60%)]"></div>
      </div>
      
      {/* Right Border Decoration - Enhanced with animations */}
      <div className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b ${styles.rightBorder}`}>
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_60%)]"></div>
      </div>
      
      {/* Bottom Border Decoration - Enhanced with pulse effect */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.bottomBorder} group-hover:animate-pulse`}></div>
      
      {/* Corner Decorations - Enhanced with glow on hover */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${styles.cornerBorder} group-hover:shadow-md group-hover:shadow-indigo-500/50`}></div>
      <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${styles.cornerBorder} group-hover:shadow-md group-hover:shadow-indigo-500/50`}></div>
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${styles.cornerBorder} group-hover:shadow-md group-hover:shadow-indigo-500/50`}></div>
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${styles.cornerBorder} group-hover:shadow-md group-hover:shadow-indigo-500/50`}></div>
      
      {/* Content container with subtle transforms on hover */}
      <div className="relative z-10 transition-transform duration-300 group-hover:scale-[1.01]">
        {children}
      </div>
      
      {/* Advanced Scanner Effect */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none z-0">
        {/* Primary scan line */}
        <div ref={scannerRef} className={`h-px w-full ${styles.scanLine} absolute`}></div>
        
        {/* Data visualizer - like binary data flowing */}
        <div className="absolute right-2 top-12 bottom-4 w-px bg-indigo-500/10 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="h-1 w-full bg-indigo-400/40"
              style={{ 
                position: 'absolute', 
                top: `${i * 10}%`, 
                animationDelay: `${i * 0.2}s`,
                animation: 'moveDown 3s infinite linear'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Hover overlay with radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0)_0%,rgba(99,102,241,0.15)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes moveDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
      `}</style>
    </div>
  );
};

export default CyberpunkInterface; 