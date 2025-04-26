import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FaGithub, FaCodepen, FaLaptopCode, FaAward, FaStar, FaCodeBranch, FaUsers } from 'react-icons/fa';
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
    color: 'from-gray-700 to-gray-900',
    badgeColor: 'bg-gray-800'
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

// Simplified GitHub-like contribution visualization
const contributionData = [
  [0, 1, 3, 2, 4, 2, 0],
  [1, 2, 3, 4, 2, 1, 2],
  [0, 1, 4, 3, 2, 3, 1],
  [2, 3, 4, 4, 3, 2, 0],
  [1, 3, 2, 1, 4, 2, 1]
];

const Stats = () => {
  const sectionRef = useRef(null);
  const statsGridRef = useRef(null);
  const platformsRef = useRef(null);
  const contributionRef = useRef(null);
  
  const [activePlatform, setActivePlatform] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Observer for lazy loading
  useEffect(() => {
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
  
  useGSAP(() => {
    // Only run animations if section is visible
    if (!isVisible) return;
    
    // Use lighter animations on mobile
    const animationDuration = isMobile ? 0.5 : 0.8;
    const staggerAmount = isMobile ? 0.1 : 0.2;
    
    // Animate section title with reduced complexity
    gsap.from('.stats-title', {
      y: 20,
      opacity: 0,
      duration: animationDuration,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
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
        start: 'top 90%',
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
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
      
      // Simplified contribution grid animation
      gsap.from('.contribution-cell', {
        scale: 0.8,
        opacity: 0,
        stagger: 0.01,
        duration: 0.3,
        scrollTrigger: {
          trigger: contributionRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    }
    
  }, [isVisible, isMobile]);
  
  // Get intensity color based on value (0-4)
  const getContributionColor = (value) => {
    const colors = [
      'bg-blue-900/20',
      'bg-blue-600/30',
      'bg-blue-500/50',
      'bg-blue-400/70',
      'bg-blue-300'
    ];
    return colors[value];
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
        
        {/* Enhanced Contribution Graph with reduced complexity */}
        <div ref={contributionRef} className="mb-20">
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-center text-white">
            GitHub <span className="text-blue-100">Contribution Graph</span>
          </h3>
          
          <GlowEffect intensity="low">
            <CyberpunkInterface variant="simple">
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={day} className="text-center text-xs text-blue-50 font-medium">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {contributionData.flat().map((value, index) => (
                    <div
                      key={index}
                      className={`contribution-cell w-full aspect-square rounded-sm ${getContributionColor(value)} border border-blue-400/10 flex items-center justify-center`}
                    >
                      {!isMobile && <span className="text-xs font-mono text-blue-100/80">{value}</span>}
                    </div>
                  ))}
                </div>
                
                <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-blue-50 gap-3">
                  <div className="flex items-center">
                    <span>Less</span>
                    <div className="flex space-x-1 mx-2">
                      {[0, 1, 2, 3, 4].map((value) => (
                        <div key={value} className={`w-3 h-3 rounded-sm ${getContributionColor(value)}`}></div>
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                  <div className="font-mono bg-blue-900/20 py-1 px-3 rounded-md border border-blue-400/10">
                    TOTAL: <span className="text-blue-100 font-bold">142</span>
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
          
          {/* Simplified Platform selection tabs */}
          <div className="flex flex-wrap justify-center mb-8 gap-3">
            {platformData.map((platform, index) => (
              <button
                key={index}
                className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activePlatform === index 
                    ? `${platform.badgeColor} text-white` 
                    : 'bg-black-100 text-blue-50 hover:bg-black-100/80'
                }`}
                onClick={() => setActivePlatform(index)}
              >
                <span>{platform.icon}</span>
                <span className="font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
          
          {/* Simplified Platform details */}
          <div className="platform-card">
            <GlowEffect intensity="low">
              <CyberpunkInterface variant="simple">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${platformData[activePlatform].color} flex items-center justify-center mr-4`}>
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
                      className="text-blue-100 hover:text-white text-sm flex items-center transition-colors bg-blue-900/20 py-1.5 px-3 rounded-md border border-blue-400/10 hover:bg-blue-800/30"
                    >
                      View Profile 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {platformData[activePlatform].stats.map((stat, index) => (
                      <div
                        key={index}
                        className={`${platformData[activePlatform].badgeColor} rounded-lg p-4`}
                      >
                        <div className="text-blue-50 mb-1 flex items-center text-xs md:text-sm">
                          <span className="mr-1.5">{stat.icon}</span>
                          <span>{stat.label}</span>
                        </div>
                        <div className="text-white text-xl md:text-2xl font-bold">{stat.value}</div>
                      </div>
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