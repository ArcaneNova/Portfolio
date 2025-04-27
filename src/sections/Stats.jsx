import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FaGithub, FaCodepen, FaLaptopCode, FaAward, FaStar, FaCodeBranch, FaUsers, FaCode } from 'react-icons/fa';
import { SiLeetcode, SiCodewars } from 'react-icons/si';
import CyberpunkInterface from '../components/CyberpunkInterface';
import GlowEffect from '../components/GlowEffect';

gsap.registerPlugin(ScrollTrigger);

// Main statistics data
const statsData = [
  {
    id: 'code',
    icon: <FaLaptopCode />,
    value: 50000,
    label: 'Lines of Code',
    description: 'Written across various projects',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'projects',
    icon: <FaCodepen />,
    value: 50,
    label: 'Projects Completed',
    description: 'From small tools to large apps',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 'contributions',
    icon: <FaGithub />,
    value: 90,
    label: 'GitHub Contributions',
    description: 'Last 12 months of activity',
    color: 'from-teal-400 to-blue-400'
  },
  {
    id: 'awards',
    icon: <FaAward />,
    value: 5,
    label: 'Coding Awards',
    description: 'Hackathons and competitions',
    color: 'from-amber-400 to-orange-500'
  }
];

// Coding platform data
const platformData = [
  {
    name: 'GitHub',
    icon: <FaGithub size={24} />,
    stats: [
      { label: 'Stars', value: '10', icon: <FaStar /> },
      { label: 'Repositories', value: '90+', icon: <FaCodepen /> },
      { label: 'Followers', value: '2', icon: <FaUsers /> },
      { label: 'Contributions', value: '90+', icon: <FaCodeBranch /> }
    ],
    url: 'https://github.com/ArcaneNova',
    color: 'from-blue-600 to-blue-900',
    badgeColor: 'bg-blue-800'
  },
  {
    name: 'LeetCode',
    icon: <SiLeetcode size={24} />,
    stats: [
      { label: 'Problems', value: '100+', icon: <FaCodepen /> },
      { label: 'Contest Rating', value: '3500', icon: <FaStar /> },
      { label: 'Global Rank', value: 'Top 20%', icon: <FaAward /> }
    ],
    url: 'https://leetcode.com/u/ArcaneNova/',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-orange-600'
  },
  {
    name: 'GeeksforGeeks',
    icon: <SiCodewars size={24} />,
    stats: [
      { label: 'Rank', value: '686', icon: <FaAward /> },
      { label: 'Problems', value: '286', icon: <FaStar /> },
      { label: 'Courses', value: '2', icon: <FaCodepen /> }
    ],
    url: 'https://www.codewars.com/users/yourusername',
    color: 'from-red-700 to-red-900',
    badgeColor: 'bg-red-800'
   }
];

// Enhanced GitHub-like contribution visualization with more realistic data
const contributionData = [
  [1, 3, 2, 4, 2, 2, 0],
  [2, 3, 5, 4, 1, 2, 0],
  [0, 2, 6, 5, 3, 1, 2],
  [3, 5, 7, 4, 2, 3, 1],
  [2, 4, 6, 3, 1, 2, 3],
  [1, 3, 2, 4, 6, 3, 2],
  [0, 1, 3, 5, 4, 2, 1]
];

// Days of the week for the contribution graph
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Months for contribution graph
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Function to get current date for the contribution graph
const getCurrentDate = () => {
  const date = new Date();
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const Stats = () => {
  const sectionRef = useRef(null);
  const statsGridRef = useRef(null);
  const platformsRef = useRef(null);
  const contributionRef = useRef(null);
  
  const [activePlatform, setActivePlatform] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  
  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Update the useEffect for visibility detection to instantly set visible on mobile
  useEffect(() => {
    // Set immediately visible on mobile
    if (window.innerWidth < 768) {
      setIsVisible(true);
      return;
    }
    
    // Normal intersection observer for desktop
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);
  
  // Modify the GSAP animation function to make components load faster on mobile
  useGSAP(() => {
    // Set everything immediately visible on mobile with minimal animations
    if (isMobile) {
      // Make sure all elements are visible even without scrolling
      gsap.set('.stats-title, .stat-card, .platform-card, .contribution-cell', {
        opacity: 1,
        y: 0,
        scale: 1
      });
      
      // Add minimal animations for better user experience
      gsap.fromTo(
        '.stat-card',
        { y: 10, opacity: 0.8 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power1.out' }
      );
      
      gsap.fromTo(
        '.contribution-cell',
        { scale: 0.95, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.3, stagger: 0.001 }
      );
      
      return;
    }
    
    // Desktop animations with optimized scroll triggers
    // Only run animations if section is visible
    if (!isVisible) return;
    
    const animationDuration = isMobile ? 0.5 : 0.8;
    const staggerAmount = isMobile ? 0.1 : 0.2;
    
    // Animate section title with reduced complexity
    gsap.from('.stats-title', {
      y: 20,
      opacity: 0,
      duration: animationDuration,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 95%', // Start earlier
        toggleActions: 'play none none none'
      }
    });
    
    // Animate stat cards with reduced complexity for mobile
    gsap.from('.stat-card', {
      y: 30,
      opacity: 0,
      stagger: staggerAmount,
      duration: animationDuration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: statsGridRef.current,
        start: 'top 95%', // Start earlier
        toggleActions: 'play none none none'
      }
    });
    
    // Only run more complex animations on desktop
    if (!isMobile) {
      // Animate platforms
      gsap.from('.platform-card', {
        scale: 0.95,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: platformsRef.current,
          start: 'top 90%', // Start earlier
          toggleActions: 'play none none none'
        }
      });
      
      // Enhanced contribution grid animation
      gsap.from('.contribution-cell', {
        scale: 0.8,
        opacity: 0,
        stagger: 0.005, // Faster stagger for smoother animation
        duration: 0.4,
        scrollTrigger: {
          trigger: contributionRef.current,
          start: 'top 95%', // Start earlier
          toggleActions: 'play none none none'
        }
      });
    }
  }, [isVisible, isMobile]);
  
  // Get intensity color based on value (0-7)
  const getContributionColor = (value) => {
    const colors = [
      'bg-blue-900/30 hover:bg-blue-900/50',
      'bg-blue-800/40 hover:bg-blue-800/60',
      'bg-blue-700/50 hover:bg-blue-700/70',
      'bg-blue-600/60 hover:bg-blue-600/80',
      'bg-blue-500/70 hover:bg-blue-500/90',
      'bg-blue-400/80 hover:bg-blue-400',
      'bg-blue-300/90 hover:bg-blue-300',
      'bg-blue-200 hover:bg-blue-100'
    ];
    return colors[Math.min(value, colors.length - 1)];
  };
  
  // Calculate total contributions
  const totalContributions = contributionData.flat().reduce((sum, val) => sum + val, 0);
  
  // Generate random dates for contribution tooltips
  const getRandomDate = (index) => {
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - (49 - index)); // Last 7 weeks
    return pastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Render optimized stats section
  return (
    <section ref={sectionRef} id="stats" className="py-20 md:py-28 relative overflow-hidden bg-black-200">
      {/* Simplified background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,16,30,0.8),rgba(0,0,10,1))]"></div>
        
        {/* Reduced grid lines for better performance */}
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
        
        {/* Reduced floating shapes */}
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-blue-400/5 blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-80 h-80 rounded-full bg-blue-300/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Optimized section header */}
        <div className="text-center mb-16">
          <h2 className="stats-title text-3xl md:text-4xl font-bold text-white inline-block">
            <span className="text-blue-100">&lt;</span> Coding Stats <span className="text-blue-100">/&gt;</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-100 to-blue-50/50 mx-auto mt-4"></div>
          <p className="max-w-3xl mx-auto mt-4 text-blue-50 text-base md:text-lg">
            A quantitative look at my coding journey and achievements
          </p>
        </div>
        
        {/* Optimized stats grid */}
        <div ref={statsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-20">
          {statsData.map((stat) => (
            <motion.div 
              key={stat.id} 
              className="stat-card h-full"
              whileHover={{ 
                y: isMobile ? -5 : -10,
                scale: isMobile ? 1.01 : 1.03,
                transition: { type: "spring", stiffness: 300, damping: 15 }
              }}
            >
              <GlowEffect intensity="low" className="h-full">
                <CyberpunkInterface className="h-full" variant="simple">
                  <div className="p-5 md:p-6 h-full flex flex-col">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl mb-4`}>
                      {stat.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                        <AnimatedCounter value={stat.value} duration={isMobile ? 1.5 : 2.5} />
                      </div>
                      <h3 className="text-lg text-blue-100 font-medium mb-1">{stat.label}</h3>
                      <p className="text-blue-50/80 text-xs md:text-sm">{stat.description}</p>
                    </div>
                  </div>
                </CyberpunkInterface>
              </GlowEffect>
            </motion.div>
          ))}
        </div>
        
        {/* Enhanced Contribution Graph with interactive elements */}
        <div ref={contributionRef} className="mb-20">
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-center text-white">
            GitHub <span className="text-blue-100">Contribution Graph</span>
          </h3>
          
          <GlowEffect intensity="medium">
            <CyberpunkInterface variant="modern">
              <div className="p-4 md:p-6 bg-black-100/60">
                {/* GitHub header with logo and profile link */}
                <div className="flex justify-between items-center mb-6 border-b border-blue-900/30 pb-4">
                  <div className="flex items-center">
                    <FaGithub className="text-blue-100 mr-3" size={28} />
                    <div>
                      <h4 className="text-white font-bold text-lg">ArcaneNova</h4>
                      <p className="text-blue-50 text-xs">@ArcaneNova</p>
                    </div>
                  </div>
                  <a 
                    href="https://github.com/ArcaneNova"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center"
                  >
                    <span>View Profile</span>
                    <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                
                {/* Current date and contribution summary */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 text-blue-50">
                  <div className="flex items-center space-x-2 mb-3 md:mb-0">
                    <span className="text-xs font-mono bg-blue-900/40 py-1 px-2 rounded border border-blue-800/30">
                      {getCurrentDate()}
                    </span>
                    <span className="text-xs">Contribution activity</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <FaCode className="text-blue-400 mr-1.5" size={14} />
                      <span className="text-white font-medium">{totalContributions}</span>
                      <span className="text-blue-50 text-xs ml-1">contributions in the last year</span>
                    </div>
                  </div>
                </div>
                
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-2 mb-2 ml-8">
                  {daysOfWeek.map((day, i) => (
                    <div key={day} className="text-center text-xs text-blue-50/80 font-medium">{day}</div>
                  ))}
                </div>
                
                {/* Month labels */}
                <div className="flex">
                  {/* Month labels column */}
                  <div className="flex flex-col justify-between pr-2 py-2">
                    {months.slice(0, 6).map((month, i) => (
                      i % 2 === 0 && <div key={month} className="text-xs text-blue-50/80 h-8">{month}</div>
                    ))}
                  </div>
                  
                  {/* Contribution grid */}
                  <div className="flex-1">
                    <div className="grid grid-cols-7 gap-1 md:gap-1.5">
                      {contributionData.flat().map((value, index) => (
                        <motion.div
                          key={index}
                          className={`contribution-cell relative w-full aspect-square rounded-sm ${getContributionColor(value)} cursor-pointer transition-all duration-200 border border-blue-400/10`}
                          whileHover={{ scale: 1.2, zIndex: 10 }}
                          onHoverStart={() => setHoveredCell(index)}
                          onHoverEnd={() => setHoveredCell(null)}
                        >
                          {/* Tooltip */}
                          {hoveredCell === index && (
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black-100 border border-blue-400/30 text-white text-xs py-1 px-2 rounded shadow-lg z-20 whitespace-nowrap">
                              <strong>{value} contributions</strong> on {getRandomDate(index)}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-blue-900/30 pt-4">
                  <div className="flex items-center">
                    <span className="text-xs text-blue-50/80 mr-2">Contribution level:</span>
                    <div className="flex space-x-1">
                      {[0, 2, 4, 6].map((value) => (
                        <div 
                          key={value} 
                          className={`w-3 h-3 rounded-sm ${getContributionColor(value)}`}
                          title={`${value} contributions`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="font-mono bg-blue-900/30 py-1.5 px-3 rounded-md border border-blue-800/40 flex items-center">
                    <FaGithub className="mr-2 text-blue-300" size={14} />
                    <span className="text-xs">TOTAL: </span>
                    <span className="text-blue-100 font-bold ml-1">{totalContributions}</span>
                  </div>
                </div>
              </div>
            </CyberpunkInterface>
          </GlowEffect>
        </div>
        
        {/* Optimized Platforms section */}
        <div ref={platformsRef} className="mt-12">
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-center text-white">
            Coding <span className="text-blue-100">Platforms</span>
          </h3>
          
          {/* Improved Platform selection tabs */}
          <div className="flex flex-wrap justify-center mb-8 gap-3">
            {platformData.map((platform, index) => (
              <motion.button
                key={index}
                className={`px-4 py-2.5 rounded-lg flex items-center space-x-2.5 transition-all ${
                  activePlatform === index 
                    ? `${platform.badgeColor} text-white shadow-lg shadow-${platform.badgeColor}/20 border border-blue-400/30` 
                    : 'bg-black-100/80 text-blue-50 hover:bg-black-100 border border-blue-900/40'
                }`}
                onClick={() => setActivePlatform(index)}
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
              >
                <span>{platform.icon}</span>
                <span className="font-medium">{platform.name}</span>
              </motion.button>
            ))}
          </div>
          
          {/* Enhanced Platform details */}
          <div className="platform-card">
            <GlowEffect intensity="medium">
              <CyberpunkInterface variant="modern">
                <div className="p-5 md:p-6 bg-black-100/60">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${platformData[activePlatform].color} flex items-center justify-center mr-4 shadow-lg shadow-${platformData[activePlatform].badgeColor}/20 border border-blue-400/20`}>
                        {platformData[activePlatform].icon}
                      </div>
                      <div>
                        <h4 className="text-xl md:text-2xl font-bold text-white">{platformData[activePlatform].name}</h4>
                        <p className="text-blue-50 text-xs md:text-sm">Coding profile and achievements</p>
                      </div>
                    </div>
                    
                    <a 
                      href={platformData[activePlatform].url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-white text-sm flex items-center bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-md transition-colors shadow-md"
                    >
                      View Profile 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {platformData[activePlatform].stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        className={`${platformData[activePlatform].badgeColor} rounded-lg p-4 border border-blue-400/20 shadow-lg`}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <div className="text-blue-50 mb-2 flex items-center text-sm">
                          <span className="mr-2 text-blue-200">{stat.icon}</span>
                          <span>{stat.label}</span>
                        </div>
                        <div className="text-white text-2xl md:text-3xl font-bold">{stat.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CyberpunkInterface>
            </GlowEffect>
          </div>
        </div>
      </div>
    </section>
  );
};

// Optimized animated counter component
const AnimatedCounter = ({ value, duration = 2.5 }) => {
  const [count, setCount] = useState(0);
  
  useGSAP(() => {
    let start = 0;
    const end = parseInt(value.toString().replace(/,/g, ''));
    const incrementTime = (duration / end) * 1000;
    
    // Simple counter for better performance
    const counter = setInterval(() => {
      start += Math.ceil(end / 20); // Increase by larger chunks
      if (start > end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(start);
      }
    }, incrementTime);
    
    return () => clearInterval(counter);
  }, []);
  
  return <span>{count.toLocaleString()}</span>;
};

export default Stats; 