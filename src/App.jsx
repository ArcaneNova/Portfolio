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
import { useEffect, useState, Component } from "react";
import CVSection from "./sections/CV.jsx";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [webGLSupported, setWebGLSupported] = useState(true);

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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black-200 flex flex-col items-center justify-center z-50">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        
        {/* Scanner line effect */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-100 to-transparent animate-scan"></div>
        
        {/* Loading content */}
        <div className="text-center z-10 px-4">
          <h1 className="text-blue-100 text-2xl md:text-4xl font-mono mb-6 glitch-text">SYSTEM INITIALIZATION</h1>
          
          {/* Loading bar */}
          <div className="w-full max-w-md h-2 bg-black-100 rounded-full overflow-hidden mb-4 border border-blue-100/30">
            <div 
              className="h-full bg-gradient-to-r from-blue-100/50 to-blue-100 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          {/* Loading text */}
          <div className="text-blue-50 font-mono text-sm md:text-base flex flex-col items-center">
            <div className="mb-2 flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-100 mr-2 animate-pulse"></span>
              <span>{loadingProgress}% COMPLETE</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 text-xs opacity-70">
              {loadingProgress >= 20 && <span>// Initializing interface</span>}
              {loadingProgress >= 40 && <span>// Loading modules</span>}
              {loadingProgress >= 60 && <span>// Syncing data</span>}
              {loadingProgress >= 80 && <span>// Activating systems</span>}
              {loadingProgress >= 95 && <span>// Ready</span>}
            </div>
          </div>
        </div>
        
        {/* Cyberpunk corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-100"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-100"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-100"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-100"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Holographic background with fallback */}
      <div className="fixed inset-0 -z-10">
        {webGLSupported ? (
          <ErrorBoundary fallback={<FallbackBackground />}>
            <HolographicBackground />
          </ErrorBoundary>
        ) : (
          <FallbackBackground />
        )}
      </div>
      
      {/* Tech pattern background overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-60 -z-5"></div>
      
      {/* Scanning line animation */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-100/70 to-transparent animate-scan pointer-events-none z-10"></div>
      
      {/* Main content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Stats />
        <Challenge />
        <CVSection />
        <Contact />
        <Footer />
      </div>
      
      {/* Fixed corner element - decorative */}
      <div className="fixed bottom-4 right-4 w-24 h-24 border border-blue-100/20 rounded-lg pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black-200/50 backdrop-blur-sm"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-100 to-transparent"></div>
      </div>
    </div>
  );
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

// Fallback background when WebGL isn't available
const FallbackBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-black-200 to-black-100">
    <div className="absolute inset-0 opacity-40">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 to-transparent animate-pulse"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent"></div>
      
      {/* Simulated stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-blue-50/80 animate-pulse"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 2}s`
          }}
        />
      ))}
    </div>
  </div>
);

export default App;
