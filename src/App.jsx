import Footer from "./components/Footer.jsx";
import Contact from "./sections/Contact.jsx";
import Hero from "./sections/Hero.jsx";
import Navbar from "./components/NavBar.jsx";
import Skills from "./sections/Skills.jsx";
import Projects from "./sections/Projects.jsx";
import About from "./sections/About.jsx";
import Stats from "./sections/Stats.jsx";
import Challenge from "./sections/Challenge.jsx";
import HolographicBackground from "./components/HolographicBackground.jsx";
import TechOverlay from "./components/TechOverlay.jsx";
import QuantumParticleField from "./components/QuantumParticleField.jsx";
import NeonGrid from "./components/NeonGrid.jsx";
import DataStreams from "./components/DataStreams.jsx";
import DigitalRain from "./components/DigitalRain.jsx";
import CircuitNetwork from "./components/CircuitNetwork.jsx";
import TechParticlesGrid from "./components/TechParticlesGrid.jsx";
import TechGalaxy from "./components/TechGalaxy.jsx";
import { useEffect, useState, Component } from "react";
import CVSection from "./sections/CV.jsx";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState('minimal');

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const isWebGLSupported = !!gl;
      setWebGLSupported(isWebGLSupported);
      if (!isWebGLSupported) {
        console.warn("WebGL not supported - using fallback background");
      }
    } catch (e) {
      console.error("Error checking WebGL support:", e);
      setWebGLSupported(false);
    }
  }, []);

  useEffect(() => {
    // Simulate loading animation
    const loadingDuration = 2000; // 2 seconds loading time (reduced)
    const interval = 30; // update progress every 30ms
    const steps = loadingDuration / interval;
    let currentStep = 0;
    
    const loadingInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, Math.floor((currentStep / steps) * 100));
      setLoadingProgress(newProgress);
      
      if (currentStep >= steps) {
        clearInterval(loadingInterval);
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    }, interval);
    
    return () => {
      clearInterval(loadingInterval);
    };
  }, []);

  // Effect to add body styles to ensure background extends across all content
  useEffect(() => {
    // Ensure the body covers the entire page
    document.body.style.position = 'relative';
    document.body.style.minHeight = '100vh';
    document.body.style.overflowX = 'hidden';
    
    // Clean up
    return () => {
      document.body.style.position = '';
      document.body.style.minHeight = '';
      document.body.style.overflowX = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        {/* Simplified background grid with subtle animation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]"></div>
        </div>
        
        {/* Simplified loading content */}
        <div className="text-center z-10 px-4 relative">
          <div className="mb-8">
            <div className="w-20 h-20 border border-cyan-500/30 rounded-full mx-auto flex items-center justify-center">
              <div className="text-3xl text-cyan-400 font-bold">{loadingProgress}%</div>
            </div>
          </div>
          
          <h1 className="text-cyan-100 text-2xl md:text-3xl font-mono mb-6 tracking-wider">INITIALIZING</h1>
          
          {/* Simplified loading bar */}
          <div className="w-full max-w-md h-2 bg-black/70 rounded-full overflow-hidden mb-4 border border-cyan-500/20">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          {/* Simplified loading text */}
          <div className="text-cyan-200/80 font-mono text-sm">
            <span>Loading portfolio...</span>
          </div>
        </div>
        
        {/* Minimal corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cyan-500/40"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/40"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cyan-500/40"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-cyan-500/40"></div>
      </div>
    );
  }

  return (
    <main className='relative z-0'>
      <div className="relative z-0 min-h-screen flex flex-col overflow-x-hidden">
        {/* Professional background with footer-style network lines */}
        <div className="fixed inset-0 z-[-2] bg-gradient-to-b from-black to-slate-950">
          {/* Neural network lines in background */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={`h-line-${i}`}
                className="absolute h-px bg-cyan-400"
                style={{ 
                  top: `${i * 10}%`, 
                  left: 0, 
                  right: 0,
                  opacity: Math.random() * 0.5 + 0.2,
                  boxShadow: '0 0 8px rgba(6, 182, 212, 0.5)'
                }}
              />
            ))}
            
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={`v-line-${i}`}
                className="absolute w-px bg-cyan-400"
                style={{ 
                  left: `${i * 7}%`, 
                  top: 0, 
                  bottom: 0,
                  opacity: Math.random() * 0.5 + 0.2,
                  boxShadow: '0 0 8px rgba(6, 182, 212, 0.5)'
                }}
              />
            ))}
          </div>
          
          {/* Glow spots */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
          
          {/* Circuit paths animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent top-[15%] animate-scan"></div>
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent top-[45%] animate-scan-reverse"></div>
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent top-[75%] animate-scan"></div>
          </div>
          
          {/* Add holographic effect with reduced intensity for additional depth */}
          {webGLSupported && <HolographicBackground intensity={0.05} />}
          
          {/* Subtle gradient overlay for better contrast */}
          <div className="fixed inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/30 to-slate-950/50" style={{ zIndex: -1 }}></div>
        </div>
        
        {/* Main content */}
        <Navbar />
        <div className='relative z-10'>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Challenge />
          <Stats />
          <CVSection />
          <Contact />
        </div>
        <Footer />
      </div>
    </main>
  );
};

// Digital Clock Component
const Clock = () => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <div>{time}</div>;
};

// ErrorBoundary component for handling errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// Simplified fallback background
const EnhancedFallbackBackground = () => (
  <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
  </div>
);

export default App;
