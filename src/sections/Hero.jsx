import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useMediaQuery } from 'react-responsive';
import TypewriterEffect from '../components/TypewriterEffect';
import CyberpunkInterface from '../components/CyberpunkInterface';
import HologramButton from '../components/HologramButton';
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa';
import CircuitNetwork from '../components/CircuitNetwork';
import Button from '../components/Button';
import { SectionWrapper } from '../hoc/index.js';

// Use a placeholder image URL instead of importing from assets
const profileImage = "/mdarshadnoor.png";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const Hero = () => {
  const sectionRef = useRef(null);
  const profileRef = useRef(null);
  const textContentRef = useRef(null);
  const buttonsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const contentRef = useRef(null);
  const textRef = useRef(null);
  const imageContainerRef = useRef(null);
  const profileImageRef = useRef(null);
  const scanningLineRef = useRef(null);
  const techCircleRef = useRef(null);
  
  useEffect(() => {
    // Animation timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Animate elements with a cleaner, more subtle approach
    tl.fromTo(textContentRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3 }
    );
    
    tl.fromTo(profileRef.current, 
      { opacity: 0, scale: 0.95 }, 
      { opacity: 1, scale: 1, duration: 0.7 }, 
      "-=0.4"
    );
    
    tl.fromTo(buttonsRef.current, 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.6 }, 
      "-=0.3"
    );
    
    tl.fromTo(scrollIndicatorRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.5, delay: 0.3 }
    );
    
    // More subtle pulse animation for scroll indicator
    gsap.to(scrollIndicatorRef.current, {
      y: 8,
      duration: 1.8,
      repeat: -1,
      yoyo: true
    });
    
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="hero" 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6"
    >
      {/* Background */}
      <CircuitNetwork />
      
      {/* Subtle gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/80 z-[1]"></div>
      
      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Left side - Text content with improved contrast */}
        <div ref={contentRef} className="flex flex-col space-y-6 text-center lg:text-left">
          <h2 className="text-cyan-400 text-xl md:text-2xl font-mono tracking-wider">
            <CyberpunkInterface>HELLO WORLD</CyberpunkInterface>
          </h2>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Md Arshad Noor
          </h1>
          
          <div className="h-20">
            <TypewriterEffect 
              text="Software Engineer specializing in web development, machine learning, and app development."
              delay={70}
              className="text-xl md:text-2xl text-white opacity-90"
            />
          </div>
          
          <div className="backdrop-blur-md bg-slate-950/80 border border-cyan-900/50 p-5 rounded-lg shadow-lg">
            <p className="text-gray-300 text-lg">
              Creating futuristic digital experiences with cutting-edge technologies and innovative solutions.
            </p>
          </div>
          
          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-4 justify-center lg:justify-start mt-6">
            <Button 
              type="filled" 
              title="GitHub" 
              icon="github"
              link="https://github.com/ArcaneNova"
            />
            
            <Button 
              type="outlined" 
              title="LinkedIn" 
              icon="linkedin"
              link="https://linkedin.com/in/mdarshadnoor"
            />
            
            <Button 
              type="special" 
              title="Resume" 
              icon="file"
              link="/ats-resume.html"
            />
          </div>
        </div>
        
        {/* Right side - Profile Image with simplified, cleaner effects */}
        <div ref={imageContainerRef} className="flex justify-center items-center">
          <div ref={profileRef} className="relative">
            {/* Subtle glow instead of pulsing gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-xl opacity-40"></div>
            
            <div className="relative rounded-full border-2 border-cyan-500/40 overflow-hidden w-64 h-64 md:w-80 md:h-80 shadow-lg shadow-cyan-500/20">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              
              {/* Subtle scanning effect overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="w-full h-16 bg-cyan-400/5 animate-scan-slow"></div>
              </div>
              
              {/* Minimal data points */}
              <div className="absolute bottom-0 left-0 m-2 text-xs font-mono text-cyan-400/80">SYSTEM READY</div>
            </div>
            
            {/* Single minimal tech spec with better contrast */}
            <div className="absolute -bottom-5 right-0 bg-slate-950/80 backdrop-blur-md border border-cyan-900/50 p-2 rounded text-xs font-mono text-cyan-400/90">
              <CyberpunkInterface>STATUS: ONLINE</CyberpunkInterface>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator with improved visibility */}
      <div 
        ref={scrollIndicatorRef} 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-cyan-400 flex flex-col items-center z-10"
      >
        <div className="flex flex-col items-center">
          <div className="text-white/90 text-sm mb-2 font-light">Scroll Down</div>
          <div className="w-5 h-10 border border-white/80 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/90 rounded-full animate-bounce-slow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
