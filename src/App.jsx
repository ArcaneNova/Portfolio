import Footer from "./components/Footer.jsx";
import Contact from "./sections/Contact.jsx";
import Hero from "./sections/Hero.jsx";
import Navbar from "./components/Navbar.jsx";
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
  const [backgroundMode, setBackgroundMode] = useState('techgrid');

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
    const loadingDuration = 2500; // 2.5 seconds loading time
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

  // Effect to cycle between background modes for visual interest
  useEffect(() => {
    if (loading) return;
    
    // Don't cycle modes if WebGL isn't supported
    if (!webGLSupported) return;
    
    const modes = ['techgrid', 'galaxy', 'circuit', 'holographic', 'quantum', 'neon', 'matrix'];
    let currentIndex = 0;
    
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % modes.length;
      setBackgroundMode(modes[currentIndex]);
    }, 30000); // Change every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [loading, webGLSupported]);

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
      <div className="fixed inset-0 bg-black-200 flex flex-col items-center justify-center z-50">
        {/* Enhanced background grid with animation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
        </div>
        
        {/* Animated binary scrolling in background - subtle */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="animate-float-down whitespace-pre font-mono text-cyan-400 text-opacity-30">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="text-xs" style={{
                position: 'absolute',
                left: `${i * 10}%`,
                top: '-100%',
                animation: `floatDown ${10 + i * 2}s linear infinite`,
                animationDelay: `${i * 0.5}s`
              }}>
                {Array.from({ length: 20 }).map(() => 
                  Math.random() > 0.5 ? '1' : '0'
                ).join(' ')}
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced scanner line effect with better visibility */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
        
        {/* Loading content with improved styling */}
        <div className="text-center z-10 px-4 relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-40 h-40">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border border-dashed border-cyan-500/30 rounded-full animate-reverse-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="text-4xl text-cyan-400 font-bold advanced-glitch">{loadingProgress}%</div>
              </div>
            </div>
          </div>
          
          <h1 className="text-cyan-100 text-2xl md:text-4xl font-mono mb-6 glitch-text tracking-wider mt-24">SYSTEM INITIALIZATION</h1>
          
          {/* Loading bar with improved visual feedback */}
          <div className="w-full max-w-md h-3 bg-black-100/70 rounded-full overflow-hidden mb-4 border border-cyan-500/30 backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400/80 via-blue-500/80 to-indigo-600/80 rounded-full transition-all duration-300 relative"
              style={{ width: `${loadingProgress}%` }}
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.1)_5px,rgba(255,255,255,0.1)_10px)]"></div>
              <div className="absolute top-0 h-full w-10 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          {/* Loading text with enhanced styling */}
          <div className="text-cyan-200 font-mono text-sm md:text-base flex flex-col items-center">
            <div className="mb-2 flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
              <span>SYSTEM BOOT SEQUENCE</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 text-xs text-cyan-300/70">
              {loadingProgress >= 20 && <span className="typing-effect">// Initializing interface</span>}
              {loadingProgress >= 40 && <span className="typing-effect delay-300">// Loading modules</span>}
              {loadingProgress >= 60 && <span className="typing-effect delay-600">// Syncing data</span>}
              {loadingProgress >= 80 && <span className="typing-effect delay-900">// Activating neural network</span>}
              {loadingProgress >= 95 && <span className="typing-effect delay-1200 text-green-400">// Ready</span>}
            </div>
          </div>
        </div>
        
        {/* Improved cyberpunk corner decorations */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/80"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyan-500/80"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyan-500/80"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-500/80"></div>
        
        {/* Technical data points */}
        <div className="absolute top-4 right-4 text-right">
          <div className="text-xs font-mono text-cyan-500/70">SYS.ID: {Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</div>
          <div className="text-xs font-mono text-cyan-500/70">{new Date().toISOString().split('T')[0]}</div>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <div className="text-xs font-mono text-cyan-500/70 flex items-center">
            <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
            QUANTUM.ENGINE.V4
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className='relative z-0'>
      <div className="relative z-0 min-h-screen flex flex-col overflow-x-hidden">
        {/* Background component with rotation system */}
        <div className="fixed inset-0 z-[-2]">
          {webGLSupported && (
            <>
              {/* Tech Particles Grid */}
              {backgroundMode === 'techgrid' && (
                <ErrorBoundary fallback={<EnhancedFallbackBackground />}>
                  <TechParticlesGrid />
                </ErrorBoundary>
              )}
              
              {/* Tech Galaxy */}
              {backgroundMode === 'galaxy' && (
                <ErrorBoundary fallback={<EnhancedFallbackBackground />}>
                  <TechGalaxy />
                </ErrorBoundary>
              )}
              
              {/* Circuit Network */}
              {backgroundMode === 'circuit' && (
                <ErrorBoundary fallback={<EnhancedFallbackBackground />}>
                  <CircuitNetwork />
                </ErrorBoundary>
              )}
              
              {/* Base holographic effect */}
              {(backgroundMode === 'holographic' || backgroundMode === 'quantum') && (
                <ErrorBoundary fallback={<EnhancedFallbackBackground />}>
                  <HolographicBackground />
                </ErrorBoundary>
              )}
              
              {/* Quantum particle field for advanced 3D depth */}
              {backgroundMode === 'quantum' && (
                <ErrorBoundary fallback={null}>
                  <QuantumParticleField />
                </ErrorBoundary>
              )}
              
              {/* Neon grid effect */}
              {backgroundMode === 'neon' && (
                <ErrorBoundary fallback={null}>
                  <NeonGrid />
                  <div className="fixed inset-0 bg-black/60" style={{ zIndex: -9998 }}></div>
                </ErrorBoundary>
              )}
              
              {/* Matrix-like effect */}
              {backgroundMode === 'matrix' && (
                <ErrorBoundary fallback={null}>
                  <div className="fixed inset-0 bg-black" style={{ zIndex: -9999 }}></div>
                  <DigitalRain />
                  <DataStreams />
                </ErrorBoundary>
              )}
            </>
          )}
          
          {!webGLSupported && <EnhancedFallbackBackground />}
        </div>
        
        {/* Add technical overlay elements for ALL modes */}
        <TechOverlay />
        
        {/* Background switcher UI - small, tasteful control */}
        {webGLSupported && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 border border-cyan-900/20">
            <button 
              onClick={() => setBackgroundMode('techgrid')}
              className={`size-3 rounded-full ${backgroundMode === 'techgrid' ? 'bg-cyan-400' : 'bg-cyan-900/50'}`}
              title="Tech Particles Grid Mode"
            />
            <button 
              onClick={() => setBackgroundMode('galaxy')}
              className={`size-3 rounded-full ${backgroundMode === 'galaxy' ? 'bg-purple-400' : 'bg-cyan-900/50'}`}
              title="Tech Galaxy Mode"
            />
            <button 
              onClick={() => setBackgroundMode('circuit')}
              className={`size-3 rounded-full ${backgroundMode === 'circuit' ? 'bg-cyan-400' : 'bg-cyan-900/50'}`}
              title="Circuit Network Mode"
            />
            <button 
              onClick={() => setBackgroundMode('holographic')}
              className={`size-3 rounded-full ${backgroundMode === 'holographic' ? 'bg-cyan-400' : 'bg-cyan-900/50'}`}
              title="Holographic Mode"
            />
            <button 
              onClick={() => setBackgroundMode('quantum')}
              className={`size-3 rounded-full ${backgroundMode === 'quantum' ? 'bg-cyan-400' : 'bg-cyan-900/50'}`}
              title="Quantum Field Mode"
            />
            <button 
              onClick={() => setBackgroundMode('neon')}
              className={`size-3 rounded-full ${backgroundMode === 'neon' ? 'bg-cyan-400' : 'bg-cyan-900/50'}`}
              title="Neon Grid Mode"
            />
            <button 
              onClick={() => setBackgroundMode('matrix')}
              className={`size-3 rounded-full ${backgroundMode === 'matrix' ? 'bg-cyan-400' : 'bg-cyan-900/50'}`}
              title="Digital Rain Mode"
            />
          </div>
        )}
        
        {/* Hero section */}
        <div className="relative z-[1]">
          <Navbar />
          <div className="relative">
            <Hero />
          </div>
        </div>

        {/* Main content sections */}
        <div className="relative z-[1] flex-grow">
          <About />
          <Skills />
          <Projects />
          <Stats />
          <Challenge />
          <CVSection />
          <Contact />
        </div>

        {/* Footer always visible at bottom */}
        <div className="relative z-[1]">
          <Footer />
        </div>
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

// Simple error boundary for components that might fail
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
      return this.props.fallback || <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

// Enhanced fallback background when WebGL isn't available
const EnhancedFallbackBackground = () => (
  <div className="fixed inset-0 bg-gradient-to-b from-black via-slate-900/80 to-black-100" style={{ zIndex: -1 }}>
    <div className="absolute inset-0">
      {/* Enhanced animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5"></div>
      
      {/* Circuit pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwZGJkZTkiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjUiPjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDBoMjBNMjAgNDBoMjBNMCAwdjQwIi8+PC9nPjwvc3ZnPg==')]"></div>
      
      {/* Improved decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
      
      {/* Enhanced simulated stars with better depth */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 3 + 1;
          const opacity = Math.random() * 0.7 + 0.3;
          return (
            <div 
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background: i % 5 === 0 ? 'rgba(6, 182, 212, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: i % 5 === 0 ? '0 0 4px rgba(6, 182, 212, 0.8)' : 'none',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: opacity,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          );
        })}
      </div>
      
      {/* Scanning line */}
      <div className="absolute h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent top-1/3 animate-scan"></div>
      
      {/* Animated data points */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute size-2 rounded-full bg-cyan-400/30 animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  </div>
);

export default App;
