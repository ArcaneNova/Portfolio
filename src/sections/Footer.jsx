import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaDiscord } from 'react-icons/fa';
import GlowEffect from '../components/GlowEffect';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  
  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Stats', href: '#stats' },
    { name: 'Challenges', href: '#challenges' },
    { name: 'Contact', href: '#contact' },
  ];
  
  const socialLinks = [
    { icon: <FaGithub />, href: 'https://github.com/yourusername', label: 'GitHub' },
    { icon: <FaLinkedin />, href: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
    { icon: <FaTwitter />, href: 'https://twitter.com/yourusername', label: 'Twitter' },
    { icon: <FaDiscord />, href: 'https://discord.gg/yourinvite', label: 'Discord' },
    { icon: <FaEnvelope />, href: 'mailto:your.email@example.com', label: 'Email' },
  ];
  
  useGSAP(() => {
    gsap.from('.footer-content', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    });
    
    gsap.from('.footer-links a', {
      y: 10,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    });
    
    gsap.from('.social-icons a', {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    });
  }, { scope: footerRef });
  
  return (
    <footer ref={footerRef} className="relative py-12 bg-black-200 overflow-hidden">
      {/* Footer scan line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent"></div>
      
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        {/* Tech lines grid pattern - horizontal */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div 
              key={`h-line-${i}`} 
              className="absolute h-px bg-blue-100" 
              style={{ 
                top: `${i * 10}%`, 
                left: 0, 
                right: 0,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
          
          {/* Tech lines grid pattern - vertical */}
          {[...Array(20)].map((_, i) => (
            <div 
              key={`v-line-${i}`} 
              className="absolute w-px bg-blue-100" 
              style={{ 
                left: `${i * 5}%`, 
                top: 0, 
                bottom: 0,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
        </div>
        
        {/* Glow spots */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-100/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="footer-content max-w-6xl mx-auto">
          {/* Logo and slogan */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">
                <span className="text-blue-100">&lt;</span> Your Name <span className="text-blue-100">/&gt;</span>
              </h2>
              <p className="text-blue-50 opacity-80">Building the future, one line at a time</p>
            </div>
            
            {/* Nav links */}
            <nav className="footer-links">
              <ul className="flex flex-wrap justify-center gap-6">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a 
                      href={item.href}
                      className="text-blue-50 hover:text-blue-100 transition-colors text-sm"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-100/30 to-transparent my-8"></div>
          
          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-blue-50 opacity-70 text-sm">
                © {new Date().getFullYear()} Your Name. All rights reserved.
              </p>
              <p className="text-blue-50 opacity-50 text-xs mt-1">
                Built with React, Three.js, GSAP, and Tailwind CSS
              </p>
            </div>
            
            {/* Social links */}
            <div className="social-icons flex gap-4">
              {socialLinks.map((social, index) => (
                <GlowEffect key={index} className="w-10 h-10">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-black-100 border border-blue-100/20 text-blue-100 hover:text-white hover:bg-blue-100/20 transition-colors"
                  >
                    {social.icon}
                  </a>
                </GlowEffect>
              ))}
            </div>
          </div>
          
          {/* Back to top button */}
          <div className="flex justify-center mt-12">
            <GlowEffect className="w-12 h-12">
              <a
                href="#home"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100/10 border border-blue-100/30 text-blue-100 hover:bg-blue-100/20 transition-colors"
                aria-label="Back to top"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </GlowEffect>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 