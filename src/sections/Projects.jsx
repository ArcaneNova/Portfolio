import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaCode } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
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
        github: 'https://github.com/ArcaneNova?tab=repositories',
        live: 'https://annadata-pro.netlify.app/'
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
        github: 'https://github.com/ArcaneNova/Portfolio',
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
        github: 'https://github.com/ArcaneNova',
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
  
  // For featured projects that don't have images, generate a gradient background
  const getGradient = (id) => {
    const gradients = [
      'from-blue-600 to-indigo-700',
      'from-purple-600 to-pink-700',
      'from-green-600 to-teal-700',
      'from-red-600 to-orange-700',
      'from-amber-600 to-yellow-700',
      'from-indigo-600 to-blue-700'
    ];
    
    return gradients[id % gradients.length];
  };
  
  // For placeholder icons based on project category
  const getPlaceholderIcon = (category) => {
    switch(category) {
      case 'web': return '🌐';
      case 'ml': return '🧠';
      case 'fullstack': return '⚛️';
      case 'api': return '🔌';
      default: return '💻';
    }
  };
  
  useGSAP(() => {
    // Animation for the section title and subtitle
    gsap.fromTo(
      ".projects-title, .projects-subtitle",
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: "top 80%"
        }
      }
    );
    
    // Animation for the filter buttons
    gsap.fromTo(
      ".filter-buttons button",
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".filter-buttons",
          start: "top 85%"
        }
      }
    );
    
    // Animation for project cards
    gsap.fromTo(
      ".project-card",
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 85%"
        }
      }
    );
  }, [activeFilter]); // Re-run when filter changes
  
  // Project Card Component
  const ProjectCard = ({ project }) => {
    return (
      <motion.div 
        className="project-card relative overflow-hidden rounded-xl backdrop-blur-sm border border-blue-100/10 transition-all h-full"
        whileHover={{ 
          y: -8, 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          borderColor: "rgba(59, 130, 246, 0.5)"
        }}
        layout
      >
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black-200 to-transparent opacity-70 z-10"></div>
          
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getGradient(project.id)} flex items-center justify-center`}>
              <span className="text-5xl">{getPlaceholderIcon(project.category)}</span>
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-3 right-3 z-20">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${projectStatusColors[project.status]} text-white`}>
              {project.status}
            </span>
          </div>
          
          {/* Category tag */}
          <div className="absolute bottom-3 left-3 z-20">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-blue-100 border border-blue-100/30">
              {filters.find(f => f.id === project.category)?.label || 'Other'}
            </span>
          </div>
        </div>
        
        {/* Project Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{project.title}</h3>
          <p className="text-blue-100/80 text-sm mb-3 line-clamp-1">{project.subtitle}</p>
          
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 rounded-md bg-blue-900/30 text-blue-100"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-md bg-blue-900/30 text-blue-100">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
          
          {/* Date */}
          <div className="flex items-center text-gray-400 text-xs mb-4">
            <FaCalendarAlt className="mr-1" /> {project.date}
          </div>
          
          {/* Links */}
          <div className="flex gap-3">
            {project.links.github && (
              <a 
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-white text-sm transition-colors"
              >
                <FaGithub /> Code
              </a>
            )}
            
            {project.links.live && project.links.live !== '#' && (
              <a 
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm transition-colors"
              >
                <FaExternalLinkAlt /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Featured Project Card component for the carousel
  const FeaturedProjectCard = ({ project }) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-black-100/40 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-100/20 hover:border-blue-100/40 transition-all">
        {/* Left side - Project image */}
        <div className="relative h-64 lg:h-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10"></div>
          
          {project.image ? (
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
              </div>
            </div>
          )}
          
          {/* Status badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${projectStatusColors[project.status]} text-white`}>
              {project.status}
            </span>
          </div>
          
          {/* Category tag */}
          <div className="absolute bottom-4 left-4 z-20">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-blue-100 border border-blue-100/30">
              {filters.find(f => f.id === project.category)?.label || 'Other'}
            </span>
          </div>
          
          {/* Achievement badge if exists */}
          {project.achievements && (
            <div className="absolute top-4 left-4 z-20">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-amber-600 text-white">
                🏆 {project.achievements}
              </span>
            </div>
          )}
        </div>
        
        {/* Right side - Project details */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
            <p className="text-blue-100 text-lg mb-4">{project.subtitle}</p>
            
            <p className="text-gray-300 mb-6">{project.description}</p>
            
            {/* Project highlights */}
            {project.highlights && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">▹</span>
                      <span className="text-gray-300 text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-sm px-3 py-1 rounded-md bg-blue-900/30 text-blue-100"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Date */}
            <div className="flex items-center text-gray-400 text-sm mb-6">
              <FaCalendarAlt className="mr-2" /> {project.date}
            </div>
            
            {/* Links */}
            <div className="flex gap-4">
              {project.links.github && (
                <a 
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors"
                >
                  <FaGithub /> Source Code
                </a>
              )}
              
              {project.links.live && project.links.live !== '#' && (
                <a 
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
                >
                  <FaExternalLinkAlt /> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" ref={projectsRef} className="relative py-24 md:py-32 overflow-hidden bg-black-200">
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
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-24">
          <CyberpunkInterface title="PROJECTS_COLLECTION" subtitle="DEV.PORTFOLIO" className="mb-6">
            <div className="py-6">
              <h2 className="projects-title text-3xl md:text-5xl font-bold text-white inline-block">
                <span className="text-blue-100">&lt;</span> My Projects <span className="text-blue-100">/&gt;</span>
              </h2>
              <p className="projects-subtitle text-blue-50 mt-6 max-w-3xl mx-auto px-4">
                Explore my projects spanning web development, machine learning, and full-stack applications.
                Each project represents a unique challenge and solution.
              </p>
            </div>
          </CyberpunkInterface>
        </div>
        
        {/* Featured Projects Carousel */}
        <div className="featured-carousel mb-16 md:mb-28 relative">
          <h3 className="text-2xl font-bold mb-8 text-center text-white">
            Featured <span className="text-blue-100">Projects</span>
          </h3>
          
          <div ref={carouselRef} className="relative overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <FeaturedProjectCard project={featuredProjects[currentIndex]} />
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation Controls */}
            {featuredProjects.length > 1 && (
              <>
                <button 
                  onClick={prevProject}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 text-white p-3 rounded-full border border-blue-100/20 hover:bg-black/70 transition-colors"
                  aria-label="Previous project"
                >
                  <FaChevronLeft />
                </button>
                
                <button 
                  onClick={nextProject}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 text-white p-3 rounded-full border border-blue-100/20 hover:bg-black/70 transition-colors"
                  aria-label="Next project"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
            
            {/* Pagination indicators */}
            {featuredProjects.length > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {featuredProjects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentIndex === index 
                        ? 'bg-blue-400 w-6' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Project Filters */}
        <div className="filter-buttons flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 md:px-6 md:py-2.5 rounded-md transition-all duration-300 border ${
                activeFilter === filter.id
                  ? 'bg-blue-100/20 border-blue-100 text-white shadow-lg shadow-blue-900/20'
                  : 'bg-black-100 border-blue-100/20 text-blue-50 hover:bg-blue-100/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Projects grid */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        {/* No projects message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <h4 className="text-xl text-blue-100 mb-4">No projects found in this category</h4>
            <p className="text-gray-400">Try selecting a different filter</p>
          </div>
        )}
        
        {/* More projects button */}
        <div className="text-center mt-16 md:mt-20">
          <GlowEffect intensity={0.3}>
            <a
              href="https://github.com/ArcaneNova"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-blue-100/10 border border-blue-100/30 rounded-lg text-blue-100 hover:bg-blue-100/20 transition-colors font-medium"
            >
              <span>View More Projects</span>
              <FaGithub size={20} />
            </a>
          </GlowEffect>
        </div>
      </div>
    </section>
  );
};

export default Projects; 