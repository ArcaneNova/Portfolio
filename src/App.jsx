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
  // Set all initial states to skip loading
  const [loading, setLoading] = useState(false); // Keep false to never show loading screen
  const [loadingProgress, setLoadingProgress] = useState(100); // Always 100% complete
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState('minimal'); // Use minimal background for better performance
  const [isMobile, setIsMobile] = useState(false);

  // Check WebGL support and mobile status immediately
  useEffect(() => {
    // Check if mobile for performance optimizations
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      
      // If mobile, use even more minimal backgrounds
      if (isMobileDevice) {
        setBackgroundMode('ultra-minimal');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const isWebGLSupported = !!gl;
      setWebGLSupported(isWebGLSupported && !isMobile); // Disable WebGL on mobile for better performance
      if (!isWebGLSupported) {
        console.warn("WebGL not supported - using fallback background");
      }
    } catch (e) {
      console.error("Error checking WebGL support:", e);
      setWebGLSupported(false);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Effect to add body styles to ensure background extends across all content
  useEffect(() => {
    // Ensure the body covers the entire page
    document.body.style.position = 'relative';
    document.body.style.minHeight = '100vh';
    document.body.style.overflowX = 'hidden';
    
    // Add a class to help with mobile optimizations
    if (isMobile) {
      document.body.classList.add('is-mobile');
    } else {
      document.body.classList.remove('is-mobile');
    }
    
    // Clean up
    return () => {
      document.body.style.position = '';
      document.body.style.minHeight = '';
      document.body.style.overflowX = '';
      document.body.classList.remove('is-mobile');
    };
  }, [isMobile]);

  // Return the app with optimized background for mobile
  return (
    <main className='relative z-0'>
      <div className="relative z-0 min-h-screen flex flex-col overflow-x-hidden">
        {/* Professional background with footer-style network lines - simplified for mobile */}
        <div className="fixed inset-0 z-[-2] bg-gradient-to-b from-black to-slate-950">
          {/* Simplified neural network lines in background for better performance */}
          <div className="absolute inset-0 opacity-10">
            {/* Reduced number of lines on mobile for better performance */}
            {Array.from({ length: isMobile ? 5 : 10 }).map((_, i) => (
              <div 
                key={`h-line-${i}`}
                className="absolute h-px bg-cyan-400"
                style={{ 
                  top: `${i * (isMobile ? 20 : 10)}%`, 
                  left: 0, 
                  right: 0,
                  opacity: Math.random() * 0.5 + 0.2,
                  boxShadow: 'none' // Remove shadows on mobile for performance
                }}
              />
            ))}
            
            {Array.from({ length: isMobile ? 8 : 15 }).map((_, i) => (
              <div 
                key={`v-line-${i}`}
                className="absolute w-px bg-cyan-400"
                style={{ 
                  left: `${i * (isMobile ? 14 : 7)}%`, 
                  top: 0, 
                  bottom: 0,
                  opacity: Math.random() * 0.5 + 0.2,
                  boxShadow: 'none' // Remove shadows on mobile for performance
                }}
              />
            ))}
          </div>
          
          {/* Simpler glow spots for mobile */}
          {!isMobile && (
            <>
              <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
            </>
          )}
          
          {/* Simpler circuit paths animation for mobile */}
          {!isMobile && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent top-[15%] animate-scan"></div>
              <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent top-[45%] animate-scan-reverse"></div>
              <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent top-[75%] animate-scan"></div>
            </div>
          )}
          
          {/* Only add holographic effect on desktop for better performance */}
          {webGLSupported && !isMobile && <HolographicBackground intensity={0.05} />}
          
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
