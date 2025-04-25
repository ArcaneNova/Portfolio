import React, { useRef } from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedinIn, FaTwitter, FaCodepen, FaEnvelope, FaHeart } from 'react-icons/fa';
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
    { icon: <FaGithub />, url: 'https://github.com/ArcaneNova', label: 'GitHub' },
    { icon: <FaLinkedinIn />, url: 'https://linkedin.com/in/mdarshadnoor', label: 'LinkedIn' },
    { icon: <FaTwitter />, url: 'https://twitter.com/ArcaneNova_', label: 'Twitter' },
    { icon: <FaCodepen />, url: 'https://codepen.io/officialarshadnoor', label: 'CodePen' },
    { icon: <FaEnvelope />, url: 'mailto:arshadnoor585@gmail.com', label: 'Email' }
  ];

  // GSAP animations
  useGSAP(() => {
    if (!footerRef.current) return;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 95%',
        toggleActions: 'play none none none'
      }
    });
    
    tl.fromTo(
      contentRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, []);
  
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer ref={footerRef} className="relative bg-black-100/90 backdrop-blur-lg border-t border-blue-100/10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.05),transparent_70%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      
      {/* Glow line at top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-50"></div>
      
      {/* Animated scanner */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute h-px w-full bg-blue-100/20 top-0 left-0 animate-scan"></div>
      </div>
      
      <div ref={contentRef} className="container mx-auto px-4 py-16 relative z-10">
        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Branding */}
          <div>
            <GlowEffect className="inline-block mb-4">
              <h3 className="text-2xl font-bold text-white px-4 py-2 rounded">
                <span className="text-blue-100">Md</span> Arshad Noor
              </h3>
            </GlowEffect>
            <p className="text-blue-50 mb-6 max-w-md">
              Creating innovative digital experiences with cutting-edge technologies and futuristic solutions.
            </p>
            {/* Social icons */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-10 h-10 rounded-md bg-black-200 flex items-center justify-center border border-blue-100/20 text-blue-50 hover:text-blue-100 hover:border-blue-100/40 transition-all duration-300"
                  whileHover={{ y: -4, boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 border-l-2 border-blue-100 pl-3">
              Navigation
            </h3>
            <div className="grid grid-cols-2">
              <ul className="space-y-2">
                {navLinks.slice(0, 4).map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={800}
                      className="text-blue-50 hover:text-blue-100 transition-colors duration-300 cursor-pointer inline-flex items-center group"
                    >
                      <span className="w-0 h-px bg-blue-100 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {navLinks.slice(4).map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={800}
                      className="text-blue-50 hover:text-blue-100 transition-colors duration-300 cursor-pointer inline-flex items-center group"
                    >
                      <span className="w-0 h-px bg-blue-100 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 border-l-2 border-blue-100 pl-3">
              Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-black-200 rounded border border-blue-100/10">
                  <FaEnvelope className="text-blue-100" />
                </div>
                <div>
                  <p className="text-white text-sm">Email</p>
                  <a 
                    href="mailto:arshadnoor585@gmail.com" 
                    className="text-blue-50 hover:text-blue-100 transition-colors duration-300"
                  >
                    arshadnoor585@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-black-200 rounded border border-blue-100/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm">Location</p>
                  <p className="text-blue-50">Araria, Bihar, India</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-black-200 rounded border border-blue-100/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm">Availability</p>
                  <p className="text-blue-50 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                    Available for new projects
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-blue-100/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-50 mb-4 md:mb-0">
            © {currentYear} <span className="text-white">Md Arshad Noor</span> | All Rights Reserved
          </p>
          <div className="flex items-center space-x-1">
            <p className="text-blue-50 text-sm">Built with</p>
            <FaHeart className="text-blue-100 mx-1 text-xs animate-pulse" />
            <div className="flex space-x-2">
              <span className="px-2 py-1 text-xs bg-black-200 rounded text-blue-50 border border-blue-100/10">React</span>
              <span className="px-2 py-1 text-xs bg-black-200 rounded text-blue-50 border border-blue-100/10">Three.js</span>
              <span className="px-2 py-1 text-xs bg-black-200 rounded text-blue-50 border border-blue-100/10">Tailwind</span>
            </div>
          </div>
        </div>
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-100/30"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-100/30"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-100/30"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-100/30"></div>
      </div>
    </footer>
  );
};

export default Footer; 