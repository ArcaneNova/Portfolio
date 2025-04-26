import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { HiMenuAlt4, HiX } from 'react-icons/hi';
import GlowEffect from './GlowEffect.jsx';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { icon: <FaTwitter />, url: 'https://twitter.com/ArcaneNova_', label: 'Twitter' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black-100/90 backdrop-blur-md shadow-lg shadow-blue-100/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="hero"
            spy={true}
            smooth={true}
            offset={-70}
            duration={800}
            className="text-2xl font-bold cursor-pointer"
          >
            <span className="text-blue-100"></span>
            <span className="text-white">Md Arshad Noor</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                spy={true}
                smooth={true}
                offset={-70}
                duration={800}
                className="relative px-4 py-2 text-blue-50 hover:text-blue-100 transition-colors duration-300 cursor-pointer group"
                activeClass="text-blue-100"
              >
                {link.name}
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-100 group-hover:w-full transition-all duration-300"
                  whileHover={{ width: '100%' }}
                />
              </Link>
            ))}
          </nav>

          {/* Contact Button */}
          <div className="hidden md:block">
            <GlowEffect>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={800}
                className="px-5 py-2 bg-blue-100 text-black-100 rounded font-medium cursor-pointer hover:bg-blue-100/90 transition-colors duration-300"
              >
                Contact Me
              </Link>
            </GlowEffect>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-blue-50 hover:text-blue-100 focus:outline-none z-20"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt4 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black-200/95 backdrop-blur-md z-10 pt-20"
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center text-center">
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col items-center space-y-6 py-8">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.to}
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={800}
                      onClick={toggleMobileMenu}
                      className="text-xl text-blue-50 hover:text-blue-100 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Social Links */}
                <div className="flex space-x-6 mt-8">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="text-blue-50 hover:text-blue-100 transition-colors duration-300"
                    >
                      <motion.span 
                        whileHover={{ y: -5 }} 
                        className="text-2xl"
                      >
                        {link.icon}
                      </motion.span>
                    </a>
                  ))}
                </div>

                {/* Mobile Contact Button */}
                <div className="mt-12">
                  <GlowEffect>
                    <Link
                      to="contact"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={800}
                      onClick={toggleMobileMenu}
                      className="px-6 py-3 bg-blue-100 text-black-100 rounded-md font-medium cursor-pointer hover:bg-blue-100/90 transition-colors duration-300"
                    >
                      Contact Me
                    </Link>
                  </GlowEffect>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Holographic Scan Line Effect */}
      <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-50 ${scrolled ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}></div>
    </header>
  );
};

export default Navbar;
