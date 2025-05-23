import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useMediaQuery } from 'react-responsive';
import TypewriterEffect from '../components/TypewriterEffect';
import CyberpunkInterface from '../components/CyberpunkInterface';
import HologramButton from '../components/HologramButton';
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa';
import Button from '../components/Button';
import { SectionWrapper } from '../hoc/index.js';

// Use a placeholder image URL instead of importing from assets
const profileImage = "/profile.png";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Advanced role typing effect component
const RoleTypingEffect = () => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(80);
  
  const roles = [
    "Software Engineer",
    "Web Developer",
    "Machine Learning Engineer",
    "App Developer",
    "Solo Preneur",
    "Indie Hacker",
    "Learner"
  ];
  
  useEffect(() => {
    let timer;
    const currentRole = roles[roleIndex];
    
    // Handle typing and deleting logic
    if (!isDeleting && displayText === currentRole) {
      // Pause at complete word
      timer = setTimeout(() => {
        setIsDeleting(true);
        setTypingSpeed(50); // Faster when deleting
      }, 1500);
    } else if (isDeleting && displayText === '') {
      // Move to next role after complete deletion
      setIsDeleting(false);
      setTypingSpeed(120); // Slower when starting new word
      setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
    } else {
      // Handle typing or deleting characters
      timer = setTimeout(() => {
        setDisplayText(prev => {
          if (isDeleting) {
            // Remove last character
            return prev.substring(0, prev.length - 1);
          } else {
            // Add next character
            return currentRole.substring(0, prev.length + 1);
          }
        });
        
        // Random typing speed variation for realism
        if (!isDeleting) {
          setTypingSpeed(100 + Math.random() * 60);
        } else {
          setTypingSpeed(30 + Math.random() * 30);
        }
      }, typingSpeed);
    }
    
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles, typingSpeed]);
  
  return (
    <div className="h-20 flex items-center">
      <span className="text-xl md:text-2xl text-white opacity-90">I am a </span>
      <span className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 ml-2">
        {displayText}
        <span className={`inline-block w-2 h-6 bg-cyan-400 ml-1 ${isDeleting ? 'animate-blink-fast' : 'animate-blink'}`}></span>
      </span>
    </div>
  );
};

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
  
  useEffect(() => {
    // Animation timeline with no delays for immediate loading
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Only run animations if the refs are actually attached to DOM elements
    if (textContentRef.current && profileRef.current && buttonsRef.current && scrollIndicatorRef.current) {
      // For immediate visibility on first load
      gsap.set([textContentRef.current, profileRef.current, buttonsRef.current, scrollIndicatorRef.current], { 
        opacity: 1,
        y: 0,
        scale: 1
      });
      
      // Super minimal animations with no delays
      tl.fromTo(textContentRef.current, 
        { opacity: 0.9, y: 5 }, 
        { opacity: 1, y: 0, duration: 0.3 } // Very short duration
      );
      
      tl.fromTo(profileRef.current, 
        { opacity: 0.9, scale: 0.98 }, 
        { opacity: 1, scale: 1, duration: 0.3 }, 
        "-=0.2" // Overlap timing
      );
      
      tl.fromTo(buttonsRef.current, 
        { opacity: 0.9, y: 5 }, 
        { opacity: 1, y: 0, duration: 0.2 }, 
        "-=0.1"
      );
      
      // Simple scroll indicator animation
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.8,
        repeat: -1,
        yoyo: true
      });
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="hero" 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6"
    >
      {/* Removed CircuitNetwork for a cleaner look */}
      
      {/* Subtle gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/30 to-slate-950/50 z-[1]"></div>
      
      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Left side - Text content with improved contrast */}
        <div ref={contentRef} className="flex flex-col space-y-6 text-center lg:text-left">
          <h2 className="text-cyan-400 text-xl md:text-2xl font-mono tracking-wider opacity-100">
            <CyberpunkInterface variant="minimal">HELLO WORLD</CyberpunkInterface>
          </h2>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Md Arshad Noor
          </h1>
          
          {/* Replace static TypewriterEffect with dynamic role typing effect */}
          <RoleTypingEffect />
          
          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8 opacity-100">
            <Button 
              type="filled" 
              title="GitHub" 
              icon="github"
              link="https://github.com/ArcaneNova"
              noDelay={true} // Add a prop to disable animation delays
            />
            
            <Button 
              type="outlined" 
              title="LinkedIn" 
              icon="linkedin"
              link="https://linkedin.com/in/mdarshadnoor"
              noDelay={true} // Add a prop to disable animation delays
            />
            
            <Button 
              type="special" 
              title="Resume" 
              icon="file"
              link="/ats-resume.html"
              noDelay={true} // Add a prop to disable animation delays
            />
          </div>
        </div>
        
        {/* Right side - Profile Image with minimal, cleaner design */}
        <div ref={imageContainerRef} className="flex justify-center items-center opacity-100">
          <div ref={profileRef} className="relative">
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl opacity-30"></div>
            
            <div className="relative rounded-full border border-cyan-500/30 overflow-hidden w-64 h-64 md:w-80 md:h-80 shadow-md">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
                loading="eager" // Ensure image loads immediately
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>
              
              {/* Minimal data point */}
              <div className="absolute bottom-0 left-0 m-2 text-xs font-mono text-cyan-400/70">READY</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple scroll indicator */}
      <div 
        ref={scrollIndicatorRef} 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-cyan-400 flex flex-col items-center z-10 opacity-100"
      >
        <div className="flex flex-col items-center">
          <div className="text-white/80 text-sm mb-2 font-light">Scroll Down</div>
          <div className="w-5 h-10 border border-white/50 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/80 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
