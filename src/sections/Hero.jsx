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
const profileImage = "https://via.placeholder.com/400x400";

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
    
    // Animate elements
    tl.fromTo(textContentRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, delay: 0.5 }
    );
    
    tl.fromTo(profileRef.current, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 0.8 }, 
      "-=0.5"
    );
    
    tl.fromTo(buttonsRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.7 }, 
      "-=0.3"
    );
    
    tl.fromTo(scrollIndicatorRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.5, delay: 0.5 }
    );
    
    // Pulse animation for scroll indicator
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      duration: 1.5,
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
      
      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Left side - Text content */}
        <div ref={contentRef} className="flex flex-col space-y-6 text-center lg:text-left">
          <h2 className="text-cyan-400 text-xl md:text-2xl font-mono tracking-wider animate-pulse">
            <CyberpunkInterface>INITIALIZING INTERFACE</CyberpunkInterface>
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
          
          <div className="backdrop-blur-sm bg-black/30 border border-cyan-900/50 p-4 rounded-lg">
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
        
        {/* Right side - Profile Image with effects */}
        <div ref={imageContainerRef} className="flex justify-center items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative rounded-full border-4 border-cyan-500/50 overflow-hidden w-64 h-64 md:w-80 md:h-80">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              
              {/* Scanning effect overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="w-full h-20 bg-cyan-400/10 animate-scan"></div>
              </div>
              
              {/* Data points around profile */}
              <div className="absolute top-0 right-0 m-2 text-xs font-mono text-cyan-400">ID:0xFF92</div>
              <div className="absolute bottom-0 left-0 m-2 text-xs font-mono text-cyan-400">SYS:ACTIVE</div>
            </div>
            
            {/* Technical specs around profile */}
            <div className="absolute -top-6 -left-6 bg-black/50 backdrop-blur-sm border border-cyan-900/50 p-2 rounded text-xs font-mono text-cyan-400 animate-pulse">
              <CyberpunkInterface>STATUS: ONLINE</CyberpunkInterface>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-black/50 backdrop-blur-sm border border-cyan-900/50 p-2 rounded text-xs font-mono text-cyan-400 animate-blink">
              <CyberpunkInterface>SIGNAL: 100%</CyberpunkInterface>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        ref={scrollIndicatorRef} 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-cyan-400 flex flex-col items-center"
      >
        <div className="flex flex-col items-center">
          <div className="text-white text-sm mb-2">Scroll Down</div>
          <div className="w-5 h-10 border-2 border-white rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full scroll-dot"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
