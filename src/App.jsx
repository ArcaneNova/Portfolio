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
  const [loading, setLoading] = useState(false); // Set initial loading to false to prevent blank screen
  const [loadingProgress, setLoadingProgress] = useState(100); // Start with 100% progress
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

  // Remove loading simulation to show content immediately
  // This prevents blank screens on mobile devices

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

  // Skip loading screen entirely to prevent blank screens
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
