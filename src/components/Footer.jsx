import React, { useRef, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedinIn, FaTwitter, FaCodepen, FaEnvelope, FaHeart, FaArrowUp } from 'react-icons/fa';
import GlowEffect from './GlowEffect.jsx';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const contentRef = useRef(null);

  // Navigation links
  const navLinks = [
    { name: 'Home', to: 'hero' },
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Stats', to: 'stats' },
    { name: 'Challenge', to: 'challenge' },
    { name: 'CV', to: 'cv' },
    { name: 'Contact', to: 'contact' }
  ];

  // Social links
  const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com/ArcaneNova', label: 'GitHub', color: '#6e5494' },
    { icon: <FaLinkedinIn />, url: 'https://linkedin.com/in/mdarshadnoor', label: 'LinkedIn', color: '#0077b5' },
    { icon: <FaTwitter />, url: 'https://twitter.com/ArcaneNova_', label: 'Twitter', color: '#1da1f2' },
    { icon: <FaCodepen />, url: 'https://codepen.io/officialarshadnoor', label: 'CodePen', color: '#76daff' },
    { icon: <FaEnvelope />, url: 'mailto:arshadnoor585@gmail.com', label: 'Email', color: '#00d4ff' }
  ];

  // GSAP animations
  useGSAP(() => {
    if (!footerRef.current) return;
    
    // Ensure contentRef exists
    if (contentRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
      
      tl.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
    
    // Check if social icons exist before animating
    const socialIcons = footerRef.current.querySelectorAll('.social-icon');
    if (socialIcons.length > 0) {
      gsap.fromTo(
        '.social-icon',
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.5, 
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%'
          }
        }
      );
    }
    
    // Check if footer links exist before animating
    const footerLinks = footerRef.current.querySelectorAll('.footer-link');
    if (footerLinks.length > 0) {
      gsap.fromTo(
        '.footer-link',
        { x: -20, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          stagger: 0.05, 
          duration: 0.4,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%'
          }
        }
      );
    }
  }, []);
  
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      ref={footerRef} 
      className="relative w-full py-16 mt-20 overflow-hidden bg-gradient-to-b from-black to-slate-900"
    >
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
      
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
      
      {/* Main content */}
      <div ref={contentRef} className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {/* Branding section */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <GlowEffect intensity="high" className="inline-block">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 rounded-lg">
                  <span className="text-white">&lt;</span> Md Arshad Noor <span className="text-white">/&gt;</span>
                </h3>
              </GlowEffect>
              <p className="text-blue-50/80 mt-4 max-w-md leading-relaxed">
                Crafting innovative digital experiences with cutting-edge technologies and futuristic interfaces that push the boundaries of web development.
              </p>
            </motion.div>
            
            {/* Social icons */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="social-icon w-10 h-10 rounded-md backdrop-blur-sm bg-black/40 flex items-center justify-center border border-cyan-500/30 text-cyan-400 transition-all duration-300"
                  whileHover={{ 
                    y: -4, 
                    boxShadow: `0 4px 20px rgba(0, 212, 255, 0.3)`,
                    backgroundColor: link.color,
                    borderColor: `${link.color}50`,
                    color: '#ffffff'
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Navigation links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-l-2 border-cyan-400 pl-3">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-4">
              <ul className="space-y-3">
                {navLinks.slice(0, 4).map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to}
                      spy={true} 
                      smooth={true} 
                      duration={800}
                      offset={-70}
                      className="footer-link text-cyan-100/70 hover:text-cyan-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 h-px bg-cyan-400 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {navLinks.slice(4).map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.to}
                      spy={true} 
                      smooth={true} 
                      duration={800}
                      offset={-70}
                      className="footer-link text-cyan-100/70 hover:text-cyan-400 transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 h-px bg-cyan-400 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Contact section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-l-2 border-cyan-400 pl-3">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="p-2 rounded-lg border border-cyan-500/20 bg-black/50 backdrop-blur-sm group-hover:bg-cyan-900/30 transition-colors duration-300">
                  <FaEnvelope className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-white text-sm">Email</p>
                  <a 
                    href="mailto:arshadnoor585@gmail.com" 
                    className="text-cyan-100/70 hover:text-cyan-400 transition-colors duration-300"
                  >
                    arshadnoor585@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="p-2 rounded-lg border border-cyan-500/20 bg-black/50 backdrop-blur-sm group-hover:bg-cyan-900/30 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm">Location</p>
                  <p className="text-cyan-100/70">Jalandhar, Punjab, India</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="p-2 rounded-lg border border-cyan-500/20 bg-black/50 backdrop-blur-sm group-hover:bg-cyan-900/30 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm">Availability</p>
                  <p className="text-cyan-100/70 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                    Open for new projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider with glow effect */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent my-10 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full blur-[2px]"></div>
        </div>
        
        {/* Bottom bar with copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-50/70 mb-6 md:mb-0 text-sm">
            © {currentYear} <span className="text-cyan-400">Md Arshad Noor</span> | All Rights Reserved
          </p>
          
          <div className="flex items-center space-x-2">
            <p className="text-blue-50/70 text-sm">Crafted with</p>
            <FaHeart className="text-cyan-400 mx-1 text-xs animate-pulse" />
            <div className="flex space-x-2">
              <span className="px-2 py-1 text-xs bg-black/40 backdrop-blur-sm rounded-md text-cyan-300 border border-cyan-500/20">React</span>
              <span className="px-2 py-1 text-xs bg-black/40 backdrop-blur-sm rounded-md text-cyan-300 border border-cyan-500/20">Three.js</span>
              <span className="px-2 py-1 text-xs bg-black/40 backdrop-blur-sm rounded-md text-cyan-300 border border-cyan-500/20">Tailwind</span>
            </div>
          </div>
        </div>
        
        {/* Back to top button */}
        <div className="flex justify-center mt-12">
          <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="hero"
              spy={true}
              smooth={true}
              duration={800}
              offset={-70}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-b from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400/50 transition-colors duration-300 cursor-pointer"
            >
              <FaArrowUp className="text-lg" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Cyberpunk decorative corners */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/50"></div>
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyan-500/50"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyan-500/50"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-500/50"></div>
    </footer>
  );
};

export default Footer; 