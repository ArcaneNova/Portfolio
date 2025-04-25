import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaCode } from 'react-icons/fa';
import { motion } from 'framer-motion';
import GlowEffect from '../components/GlowEffect';
import CyberpunkInterface from '../components/CyberpunkInterface';

gsap.registerPlugin(ScrollTrigger);

// Define filters at the file scope level so it's accessible to all components
const filters = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'ml', label: 'ML/AI' },
  { id: 'fullstack', label: 'Full Stack' },
  { id: 'api', label: 'API/Backend' }
];

const projectStatusColors = {
  'live': 'bg-green-500',
  'ongoing': 'bg-blue-400',
  'completed': 'bg-purple-500',
  'development': 'bg-amber-500'
};

const Projects = () => {
  const projectsRef = useRef(null);
  const carouselRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  
  const projectsData = [
    {
      id: 1,
      title: 'PowerIQ',
      subtitle: 'Delhi Electricity Demand Prediction',
      description: 'An LSTM-based model for time-series electricity demand forecasting with integration of weather API and real-time data visualization. Successfully reached the grand finale of SIH 2024.',
      image: '/projects/poweriq.jpg',
      tags: ['Next.js', 'LSTM', 'FastAPI', 'TensorFlow', 'NextAuth'],
      category: 'ml',
      date: 'Nov 2024 - Dec 2024',
      status: 'completed',
      links: {
        github: 'https://github.com/yourusername/poweriq',
        live: '#'
      },
      featured: true,
      achievements: 'SIH 2024 Grand Finalist',
      highlights: [
        'Developed an LSTM model for time-series electricity demand forecasting',
        'Integrated weather API for real-time data inputs',
        'Built a Next.js website with NextAuth authentication',
        'Deployed ML model using FastAPI, improving performance by 80% over Flask'
      ]
    },
    {
      id: 2,
      title: 'Lawawere',
      subtitle: 'Simplifying Indian Constitution',
      description: 'A platform designed to enhance awareness of Indian constitutional laws through interactive visualizations and simplified explanations, making legal knowledge more accessible.',
      image: '/projects/lawawere.jpg',
      tags: ['React.js', 'Express.js', 'MongoDB', 'TailwindCSS', 'Framer Motion'],
      category: 'fullstack',
      date: 'Oct 2024',
      status: 'live',
      links: {
        github: 'https://github.com/yourusername/lawawere',
        live: '#'
      },
      featured: true,
      achievements: 'Code-a-fest 2024 (3rd Prize)',
      highlights: [
        'Built a platform to enhance awareness of Indian constitutional laws',
        'Developed using React.js (frontend), Express.js (backend), and MongoDB (database)',
        'Designed interactive and visualized legal explanations using Framer Motion'
      ]
    },
    {
      id: 3,
      title: 'Eklavyatravel',
      subtitle: '900,000+ Villages Data & Census Information',
      description: 'A comprehensive platform providing detailed village census data and essential facility listings including hospitals, schools, colleges, and places of worship across 900,000+ villages in India.',
      image: '/projects/eklavyatravel.jpg',
      tags: ['Golang', 'Next.js', 'PostgreSQL', 'Redis', 'API'],
      category: 'api',
      date: 'Aug 2024 - Present',
      status: 'live',
      links: {
        github: 'https://github.com/yourusername/eklavyatravel',
        live: 'https://eklavyatravel.com'
      },
      featured: true,
      highlights: [
        'Engineered a high-performance backend in Golang to efficiently handle large-scale data',
        'Built a Next.js frontend for an intuitive user experience',
        'Used PostgreSQL for optimized data storage and retrieval',
        'Implemented Redis for caching to improve response times'
      ]
    },
    {
      id: 4,
      title: 'Annadata',
      subtitle: 'A Unified Platform for Farmers, Vendors, and Consumers',
      description: 'A marketplace platform connecting farmers directly with vendors and consumers, eliminating middlemen and ensuring better prices for farmers while providing fresh produce to consumers.',
      image: '/projects/annadata.jpg',
      tags: ['React.js', 'Express.js', 'MongoDB', 'TailwindCSS', 'Framer Motion'],
      category: 'fullstack',
      date: 'June 2024 - Aug 2024',
      status: 'live',
      links: {
        github: 'https://github.com/yourusername/annadata',
        live: 'https://annadata-pro.netlify.app'
      },
      featured: false,
      achievements: 'AIU Anveshan Winner',
      highlights: [
        'Developed a platform connecting farmers, vendors, and consumers directly',
        'Built responsive UI with React.js and TailwindCSS',
        'Implemented secure payment gateway integration',
        'Created real-time order tracking system'
      ]
    },
    {
      id: 5,
      title: '3D Portfolio',
      subtitle: 'Interactive Portfolio Website',
      description: 'A modern 3D portfolio website with interactive elements, holographic background effects, and responsive design for showcasing my projects and skills.',
      image: '/projects/portfolio.jpg',
      tags: ['React.js', 'Three.js', 'GSAP', 'TailwindCSS', 'Framer Motion'],
      category: 'web',
      date: 'March 2024 - April 2024',
      status: 'live',
      links: {
        github: 'https://github.com/yourusername/3d-portfolio',
        live: '#'
      },
      featured: false,
      highlights: [
        'Designed and developed a futuristic 3D portfolio website',
        'Implemented interactive 3D elements with Three.js',
        'Created smooth animations using GSAP and Framer Motion',
        'Built responsive layout using TailwindCSS'
      ]
    },
    {
      id: 6,
      title: 'Delhi Metro Route Finder',
      subtitle: 'Simplifying Delhi Metro Navigation',
      description: 'A comprehensive web application that helps users find the most efficient routes through the Delhi Metro system, with real-time updates and fare calculations.',
      image: '/projects/delhi-metro.jpg',
      tags: ['React.js', 'Node.js', 'Graph Algorithms', 'Google Maps API'],
      category: 'web',
      date: 'Jan 2024 - Feb 2024',
      status: 'live',
      links: {
        github: 'https://github.com/yourusername/delhi-metro',
        live: '#'
      },
      featured: false,
      highlights: [
        'Implemented graph algorithms for optimal route finding',
        'Integrated Google Maps API for visual route display',
        'Created fare calculator based on distance and interchange rules',
        'Built responsive UI for mobile and desktop users'
      ]
    }
  ];
  
  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all' 
    ? projectsData 
    : projectsData.filter(project => project.category === activeFilter);
  
  // Featured projects for carousel
  const featuredProjects = projectsData.filter(project => project.featured);
  
  // Handle next/prev navigation for the carousel
  const nextProject = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredProjects.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevProject = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredProjects.length - 1 : prevIndex - 1
    );
  };
  
  useGSAP(() => {
    // Animate section title
    gsap.from('.projects-title', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: projectsRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // Animate filter buttons
    gsap.from('.filter-buttons button', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.filter-buttons',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
    
    // Animate carousel
    gsap.from('.featured-carousel', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.featured-carousel',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // Animate project cards
    gsap.from('.project-card', {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }, { scope: projectsRef, dependencies: [activeFilter] });
  
  return (
    <section id="projects" ref={projectsRef} className="relative py-24 overflow-hidden bg-black-200">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,16,30,0.8),rgba(0,0,10,1))]"></div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div 
              key={`h-line-${i}`} 
              className="absolute h-px bg-blue-100" 
              style={{ top: `${i * 10}%`, left: 0, right: 0 }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div 
              key={`v-line-${i}`} 
              className="absolute w-px bg-blue-100" 
              style={{ left: `${i * 10}%`, top: 0, bottom: 0 }}
            />
          ))}
        </div>
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100/5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-100/5 blur-3xl animate-pulse animation-delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="projects-title text-4xl font-bold text-white inline-block">
            <span className="text-blue-100">&lt;</span> Projects <span className="text-blue-100">/&gt;</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-100 to-blue-50/50 mx-auto mt-4"></div>
          <p className="text-blue-50 mt-6 max-w-3xl mx-auto">
            Explore my projects spanning web development, machine learning, and full-stack applications.
            Each project represents a unique challenge and solution.
          </p>
        </div>
        
        {/* Featured Projects Carousel */}
        <div className="featured-carousel mb-20 relative">
          <h3 className="text-2xl font-bold mb-8 text-center text-white">
            Featured <span className="text-blue-100">Projects</span>
          </h3>
          
          <div ref={carouselRef} className="relative overflow-hidden">
            <div className="relative">
              {featuredProjects.map((project, index) => (
                <div 
                  key={project.id}
                  className={`transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100 block' : 'opacity-0 hidden'
                  }`}
                >
                  <FeaturedProjectCard project={project} />
                </div>
              ))}
            </div>
            
            {/* Navigation buttons */}
            <button 
              onClick={prevProject}
              className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 bg-black-100/80 rounded-full flex items-center justify-center text-blue-100 hover:bg-black-100 hover:text-white transition-colors z-10"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={nextProject}
              className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 bg-black-100/80 rounded-full flex items-center justify-center text-blue-100 hover:bg-black-100 hover:text-white transition-colors z-10"
            >
              <FaChevronRight />
            </button>
            
            {/* Pagination dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {featuredProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? 'bg-blue-100' : 'bg-blue-100/30'
                  } transition-colors`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Filter buttons */}
        <div className="filter-buttons flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2 rounded-md transition-all duration-300 border ${
                activeFilter === filter.id
                  ? 'bg-blue-100/20 border-blue-100 text-white'
                  : 'bg-black-100 border-blue-100/20 text-blue-50 hover:bg-blue-100/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Projects grid */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        {/* More projects button */}
        <div className="text-center mt-16">
          <GlowEffect className="inline-block">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100/10 border border-blue-100/30 rounded-md text-blue-100 hover:bg-blue-100/20 transition-colors"
            >
              <span>View More Projects</span>
              <FaGithub />
            </a>
          </GlowEffect>
        </div>
      </div>
    </section>
  );
};

// Featured Project Card component for the carousel
const FeaturedProjectCard = ({ project }) => {
  // Generate a unique gradient based on project id
  const getGradient = (id) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-cyan-400 to-blue-500',
      'from-emerald-400 to-cyan-500',
      'from-amber-400 to-orange-500',
      'from-pink-500 to-rose-500',
      'from-violet-500 to-purple-600'
    ];
    return gradients[id % gradients.length];
  };
  
  // Get placeholder illustration based on category
  const getPlaceholderIcon = (category) => {
    switch(category) {
      case 'ml':
        return '🧠';
      case 'web':
        return '🌐';
      case 'fullstack':
        return '⚙️';
      case 'api':
        return '🔌';
      default:
        return '💻';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-black-100/30 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-100/10">
      {/* Left side - Project image */}
      <div className="relative h-64 lg:h-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black-200/0 to-black-200/80 z-10"></div>
        
        {project.image && project.image !== '/projects/poweriq.jpg' && project.image !== '/projects/lawawere.jpg' ? (
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient(project.id)} flex items-center justify-center`}>
            <div className="relative flex flex-col items-center justify-center">
              <span className="text-7xl mb-4">{getPlaceholderIcon(project.category)}</span>
              <div className="w-32 h-32 absolute opacity-20 rounded-full bg-white/30 animate-ping"></div>
              <div className="w-full h-8 absolute bottom-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              
              {/* Tech pattern */}
              <div className="absolute inset-0 w-full h-full overflow-hidden opacity-20">
                <div className="absolute w-full h-full grid grid-cols-8 grid-rows-8 gap-4">
                  {Array.from({length: 32}).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-white/70" style={{ 
                      left: `${Math.random() * 100}%`, 
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.8 + 0.2
                    }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Status badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white z-20 ${projectStatusColors[project.status] || 'bg-gray-500'}`}>
          {project.status}
        </div>
        
        {/* Achievement badge if any */}
        {project.achievements && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-medium z-20">
            {project.achievements}
          </div>
        )}
      </div>
      
      {/* Right side - Project details */}
      <div className="p-6 lg:p-8 flex flex-col">
        <div className="mb-2 flex items-center text-sm text-blue-50">
          <FaCalendarAlt className="mr-2" />
          {project.date}
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
        <h4 className="text-lg text-blue-100 mb-4">{project.subtitle}</h4>
        
        <p className="text-blue-50 mb-6">
          {project.description}
        </p>
        
        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-3 py-1 rounded-full bg-blue-100/10 text-blue-50 text-xs border border-blue-100/30"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Key highlights */}
        <div className="mb-6">
          <h5 className="text-sm font-semibold text-blue-100 mb-2">Key Highlights:</h5>
          <ul className="space-y-1">
            {project.highlights.map((highlight, index) => (
              <li key={index} className="text-sm text-blue-50 flex items-start">
                <span className="text-blue-100 mr-2">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Project links */}
        <div className="mt-auto flex gap-4">
          {project.links.github && (
            <a 
              href={project.links.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded bg-black-200 text-blue-100 flex items-center hover:bg-black-100 transition-colors"
            >
              <FaGithub className="mr-2" />
              <span>Code</span>
            </a>
          )}
          
          {project.links.live && project.links.live !== '#' && (
            <a 
              href={project.links.live}
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded bg-blue-100 text-black font-medium flex items-center hover:bg-blue-50 transition-colors"
            >
              <FaExternalLinkAlt className="mr-2" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Regular Project Card component
const ProjectCard = ({ project }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate a unique gradient based on project id
  const getGradient = (id) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-cyan-400 to-blue-500',
      'from-emerald-400 to-cyan-500',
      'from-amber-400 to-orange-500',
      'from-pink-500 to-rose-500',
      'from-violet-500 to-purple-600'
    ];
    return gradients[id % gradients.length];
  };
  
  // Get placeholder illustration based on category
  const getPlaceholderIcon = (category) => {
    switch(category) {
      case 'ml':
        return '🧠';
      case 'web':
        return '🌐';
      case 'fullstack':
        return '⚙️';
      case 'api':
        return '🔌';
      default:
        return '💻';
    }
  };
  
  useGSAP(() => {
    if (isHovered) {
      gsap.to(cardRef.current.querySelector('.project-image-container'), {
        scale: 1.1,
        duration: 0.4,
        ease: 'power2.out'
      });
      gsap.to(cardRef.current.querySelector('.project-overlay'), {
        opacity: 0.85,
        duration: 0.4,
        ease: 'power2.out'
      });
      gsap.to(cardRef.current.querySelectorAll('.project-content > *'), {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.to(cardRef.current.querySelector('.project-image-container'), {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
      gsap.to(cardRef.current.querySelector('.project-overlay'), {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
      gsap.to(cardRef.current.querySelectorAll('.project-content > *'), {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  }, { scope: cardRef, dependencies: [isHovered] });
  
  return (
    <motion.div 
      ref={cardRef}
      className="project-card h-full relative rounded-xl overflow-hidden group perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        transform: "scale3d(1.02, 1.02, 1.02) rotateY(5deg)",
        transition: { duration: 0.4, ease: "easeOut" } 
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlowEffect intensity="medium" className="h-full">
        <div className="h-full relative bg-black-100/50 backdrop-blur-md border border-blue-100/20 rounded-xl overflow-hidden">
          {/* Project image */}
          <div className="relative h-56 overflow-hidden">
            <div className="project-image-container w-full h-full transform transition-transform duration-500">
              {project.image && project.image !== '/projects/poweriq.jpg' && project.image !== '/projects/lawawere.jpg' ? (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="project-image w-full h-full object-cover object-center"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getGradient(project.id)} flex items-center justify-center`}>
                  <div className="relative text-center">
                    <span className="text-6xl mb-2">{getPlaceholderIcon(project.category)}</span>
                    <div className="w-24 h-24 absolute opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 animate-ping"></div>
                    
                    {/* Tech pattern */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-20">
                      <div className="absolute w-full h-full">
                        {Array.from({length: 20}).map((_, i) => (
                          <div key={i} className="absolute w-1 h-1 rounded-full bg-white/70" style={{ 
                            left: `${Math.random() * 100}%`, 
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.8 + 0.2
                          }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Status badge */}
            <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white z-10 ${projectStatusColors[project.status] || 'bg-gray-500'}`}>
              {project.status}
            </div>
            {/* Date badge */}
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black-100/70 backdrop-blur-sm text-xs text-blue-50 flex items-center z-10">
              <FaCalendarAlt className="mr-1 text-blue-100" />
              {project.date.split(' - ')[0]}
            </div>
            {/* Overlay for hover effect */}
            <div className="project-overlay absolute inset-0 bg-gradient-to-b from-black-200/90 to-black-200/90 opacity-0 transition-opacity duration-500 z-20"></div>
            {/* Hover content */}
            <div className="project-content absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-30">
              <h4 className="text-xl font-bold text-white mb-2 transform translate-y-20 opacity-0">{project.title}</h4>
              <p className="text-blue-50 mb-4 text-sm transform translate-y-20 opacity-0">{project.subtitle}</p>
              <div className="flex space-x-3 transform translate-y-20 opacity-0">
                {project.links.github && (
                  <a 
                    href={project.links.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-black-100/50 text-blue-100 hover:bg-black-100 transition-colors"
                  >
                    <FaGithub />
                  </a>
                )}
                {project.links.live && project.links.live !== '#' && (
                  <a 
                    href={project.links.live}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-blue-100/90 text-black hover:bg-blue-100 transition-colors"
                  >
                    <FaExternalLinkAlt />
                  </a>
                )}
              </div>
              {project.achievements && (
                <div className="mt-4 px-3 py-1 rounded-full bg-amber-500/80 text-black text-xs font-medium transform translate-y-20 opacity-0">
                  {project.achievements}
                </div>
              )}
            </div>
          </div>
          
          {/* Project info */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-white">{project.title}</h3>
            <h4 className="text-sm text-blue-100 mb-3">{project.subtitle}</h4>
            <p className="text-blue-50 text-sm line-clamp-3 mb-4">
              {project.description}
            </p>
            {/* Tech tags */}
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 rounded-full bg-blue-100/10 text-blue-50 text-xs"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-2 py-1 rounded-full bg-blue-100/10 text-blue-50 text-xs">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </GlowEffect>
    </motion.div>
  );
};

export default Projects; 