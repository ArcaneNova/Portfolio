import React, { useEffect, useState } from 'react';

const TechOverlay = () => {
  const [dots, setDots] = useState([]);
  const [time, setTime] = useState(new Date().toISOString());
  
  // Generate random data points
  useEffect(() => {
    const generateDots = () => {
      const newDots = [];
      // Create fewer dots for better performance
      const dotCount = window.innerWidth < 768 ? 15 : 25;
      
      for (let i = 0; i < dotCount; i++) {
        newDots.push({
          id: i,
          x: Math.random() * 95 + 2.5, // Keep away from edges
          y: Math.random() * 95 + 2.5,
          size: Math.random() * 4 + 2,
          pulse: Math.random() > 0.7,
          opacity: Math.random() * 0.3 + 0.1,
          delay: Math.random() * 5
        });
      }
      
      setDots(newDots);
    };
    
    generateDots();
    
    // Update time
    const timeInterval = setInterval(() => {
      setTime(new Date().toISOString());
    }, 1000);
    
    return () => clearInterval(timeInterval);
  }, []);
  
  return (
    <div 
      className="fixed inset-0 overflow-hidden" 
      style={{ zIndex: 0 }}
    >
      {/* Corner elements */}
      <div className="absolute top-4 left-4 hidden md:block">
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-900/40 p-2 rounded-sm">
          <div className="text-xs font-mono text-cyan-500/70 flex items-center">
            <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
            SYS.ACTIVE
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 hidden lg:block">
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-900/40 p-2 rounded-sm">
          <div className="text-xs font-mono text-cyan-500/70">
            {time.substring(0, 19).replace('T', ' ')}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 hidden lg:block">
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-900/40 p-2 rounded-sm">
          <div className="text-xs font-mono text-cyan-500/70 flex items-center">
            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
            SECURE_CONNECTION
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 hidden md:block">
        <div className="bg-black/30 backdrop-blur-sm border border-cyan-900/40 p-2 rounded-sm">
          <div className="text-xs font-mono text-cyan-500/70">
            QTM::{Math.floor(Math.random() * 1000).toString().padStart(4, '0')}
          </div>
        </div>
      </div>
      
      {/* Data points */}
      {dots.map((dot) => (
        <div
          key={dot.id}
          className={`absolute rounded-full ${dot.pulse ? 'animate-pulse' : ''}`}
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: 'rgba(6, 182, 212, 0.3)',
            opacity: dot.opacity,
            animationDelay: `${dot.delay}s`
          }}
        />
      ))}
      
      {/* Grid scan lines - subtle */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_calc(100%_-_1px),rgba(6,182,212,0.2)_calc(100%_-_1px)),linear-gradient(90deg,transparent_calc(100%_-_1px),rgba(6,182,212,0.2)_calc(100%_-_1px))] bg-[size:40px_40px]"></div>
      
      {/* Horizontal scan effect */}
      <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent top-1/3 animate-scan-slow"></div>
      <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent top-2/3 animate-scan-reverse"></div>
      
      {/* Vertical data streams */}
      <div className="absolute top-0 bottom-0 right-1/4 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-pulse"></div>
      <div className="absolute top-0 bottom-0 left-1/3 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-pulse delay-1000"></div>
      
      {/* Technical corner borders */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400/20"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/20"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-400/20"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-400/20"></div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
      
      {/* Add custom animations */}
      <style jsx>{`
        @keyframes scan-slow {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        @keyframes scan-reverse {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(0); opacity: 0; }
        }
        
        .animate-scan-slow {
          animation: scan-slow 15s linear infinite;
        }
        
        .animate-scan-reverse {
          animation: scan-reverse 20s linear infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default TechOverlay; 