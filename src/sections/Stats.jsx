import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FaGithub, FaCodepen, FaLaptopCode, FaAward, FaStar, FaCodeBranch, FaUsers } from 'react-icons/fa';
import { SiLeetcode, SiCodewars, SiHackerrank } from 'react-icons/si';
import CyberpunkInterface from '../components/CyberpunkInterface';
import GlowEffect from '../components/GlowEffect';

gsap.registerPlugin(ScrollTrigger);

// Main statistics data
const statsData = [
  {
    id: 'code',
    icon: <FaLaptopCode />,
    value: 210000,
    label: 'Lines of Code',
    description: 'Written across various projects',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    id: 'projects',
    icon: <FaCodepen />,
    value: 87,
    label: 'Projects Completed',
    description: 'From small tools to large apps',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 'contributions',
    icon: <FaGithub />,
    value: 200,
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
    icon: <FaGithub size={30} />,
    stats: [
      { label: 'Stars', value: '10', icon: <FaStar /> },
      { label: 'Repositories', value: '90+', icon: <FaCodepen /> },
      { label: 'Followers', value: '5', icon: <FaUsers /> },
      { label: 'Contributions', value: '1000+', icon: <FaCodeBranch /> }
    ],
    url: 'https://github.com/ArcaneNova',
    color: 'from-gray-700 to-gray-900',
    badgeColor: 'bg-gray-800'
  },
  {
    name: 'LeetCode',
    icon: <SiLeetcode size={30} />,
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
    icon: <SiCodewars size={30} />,
    stats: [
      { label: 'Rank', value: '686', icon: <FaAward /> },
      { label: 'Problems', value: '286', icon: <FaStar /> },
      { label: 'Courses', value: '2', icon: <FaCodepen /> }
    ],
    url: 'https://www.codewars.com/users/yourusername',
    color: 'from-red-700 to-red-900',
    badgeColor: 'bg-red-800'
  },
  {
    name: 'HackerRank',
    icon: <SiHackerrank size={30} />,
    stats: [
      { label: 'Skills Verified', value: '8', icon: <FaAward /> },
      { label: 'Badges', value: '12', icon: <FaStar /> },
      { label: 'Points', value: '3420', icon: <FaCodeBranch /> }
    ],
    url: 'https://www.hackerrank.com/yourusername',
    color: 'from-green-600 to-green-800',
    badgeColor: 'bg-green-700'
  }
];

// GitHub-like contribution visualization
const contributionData = [
  [0, 1, 3, 2, 4, 2, 0],
  [1, 2, 3, 4, 2, 1, 2],
  [0, 1, 4, 3, 2, 3, 1],
  [2, 3, 4, 4, 3, 2, 0],
  [1, 3, 2, 1, 4, 2, 1],
  [0, 0, 1, 3, 2, 1, 0],
  [1, 2, 3, 2, 1, 0, 1]
];

const Stats = () => {
  const sectionRef = useRef(null);
  const statsGridRef = useRef(null);
  const platformsRef = useRef(null);
  const contributionRef = useRef(null);
  
  const [activePlatform, setActivePlatform] = useState(0);
  
  useGSAP(() => {
    // Animate section title
    gsap.from('.stats-title', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // Animate stat cards
    gsap.from('.stat-card', {
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: statsGridRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
    
    // Animate platforms
    gsap.from('.platform-card', {
      scale: 0.95,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: platformsRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
    
    // Animate contribution grid
    gsap.from('.contribution-cell', {
      scale: 0,
      opacity: 0,
      stagger: 0.01,
      duration: 0.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: contributionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
    
  }, { scope: sectionRef });
  
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
  
  return (
    <section ref={sectionRef} id="stats" className="py-20 relative overflow-hidden bg-black-200">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,16,30,0.8),rgba(0,0,10,1))]"></div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={`h-line-${i}`} 
              className="absolute h-px bg-blue-100" 
              style={{ top: `${i * 5}%`, left: 0, right: 0 }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <div 
              key={`v-line-${i}`} 
              className="absolute w-px bg-blue-100" 
              style={{ left: `${i * 5}%`, top: 0, bottom: 0 }}
            />
          ))}
        </div>
        
        {/* Animated floating shapes */}
        <div className="absolute top-20 left-1/4 w-48 h-48 rounded-full bg-blue-100/5 blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute bottom-40 right-1/4 w-64 h-64 rounded-full bg-blue-100/5 blur-3xl animate-pulse opacity-50 animation-delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="stats-title text-4xl font-bold text-white inline-block">
            <span className="text-blue-100">&lt;</span> Coding Stats <span className="text-blue-100">/&gt;</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-100 to-blue-50/50 mx-auto mt-4"></div>
          <p className="max-w-3xl mx-auto mt-4 text-blue-50 text-lg">
            A quantitative look at my coding journey and achievements across various platforms
          </p>
        </div>
        
        {/* Stats grid */}
        <div ref={statsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {statsData.map((stat) => (
            <motion.div 
              key={stat.id} 
              className="stat-card h-full"
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              <GlowEffect intensity="medium">
                <CyberpunkInterface className="h-full">
                  <div className="p-6 h-full flex flex-col">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl mb-4`}>
                      {stat.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                        <AnimatedCounter value={stat.value} duration={2.5} />
                      </div>
                      <h3 className="text-xl text-blue-100 font-medium">{stat.label}</h3>
                      <p className="text-blue-50/80 text-sm mt-2">{stat.description}</p>
                    </div>
                  </div>
                </CyberpunkInterface>
              </GlowEffect>
            </motion.div>
          ))}
        </div>
        
        {/* Contribution Graph */}
        <div ref={contributionRef} className="mb-24">
          <h3 className="text-2xl font-bold mb-6 text-center text-white">
            GitHub <span className="text-blue-100">Contribution Graph</span>
          </h3>
          
          <CyberpunkInterface>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-3 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                  <div key={day} className="text-center text-xs text-blue-50">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {contributionData.flat().map((value, index) => (
                  <motion.div
                    key={index}
                    className={`contribution-cell w-full h-10 md:h-12 rounded-sm ${getContributionColor(value)} border border-blue-400/10 flex items-center justify-center`}
                    whileHover={{ scale: 1.2 }}
                  >
                    <span className="text-xs font-mono text-blue-100/80">{value}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 flex items-center justify-between text-xs text-blue-50">
                <div className="flex items-center">
                  <span>Less</span>
                  <div className="flex space-x-1 mx-2">
                    {[0, 1, 2, 3, 4].map((value) => (
                      <div key={value} className={`w-3 h-3 rounded-sm ${getContributionColor(value)}`}></div>
                    ))}
                  </div>
                  <span>More</span>
                </div>
                <div className="font-mono">
                  LAST 7 WEEKS: <span className="text-blue-100">142</span> CONTRIBUTIONS
                </div>
              </div>
            </div>
          </CyberpunkInterface>
        </div>
        
        {/* Platforms section */}
        <div ref={platformsRef} className="mt-16">
          <h3 className="text-2xl font-bold mb-6 text-center text-white">
            Coding <span className="text-blue-100">Platforms</span>
          </h3>
          
          {/* Platform selection tabs */}
          <div className="flex flex-wrap justify-center mb-8 gap-4">
            {platformData.map((platform, index) => (
              <motion.button
                key={index}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activePlatform === index 
                    ? `${platform.badgeColor} text-white` 
                    : 'bg-black-100 text-blue-50 hover:bg-black-100/80'
                }`}
                onClick={() => setActivePlatform(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{platform.icon}</span>
                <span>{platform.name}</span>
              </motion.button>
            ))}
          </div>
          
          {/* Platform details */}
          <motion.div 
            key={activePlatform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="platform-card"
          >
            <GlowEffect>
              <CyberpunkInterface>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platformData[activePlatform].color} flex items-center justify-center mr-4`}>
                        {platformData[activePlatform].icon}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white">{platformData[activePlatform].name}</h4>
                        <p className="text-blue-50 text-sm">Coding profile and achievements</p>
                      </div>
                    </div>
                    
                    <a 
                      href={platformData[activePlatform].url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-100 hover:text-white text-sm flex items-center transition-colors"
                    >
                      View Profile 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {platformData[activePlatform].stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        className={`${platformData[activePlatform].badgeColor} rounded-lg p-4`}
                        whileHover={{ y: -5 }}
                      >
                        <div className="text-blue-50 mb-1 flex items-center text-sm">
                          <span className="mr-1">{stat.icon}</span>
                          <span>{stat.label}</span>
                        </div>
                        <div className="text-white text-2xl font-bold">{stat.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CyberpunkInterface>
            </GlowEffect>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 2.5 }) => {
  const [count, setCount] = useState(0);
  const targetRef = useRef(value);
  
  useGSAP(() => {
    const obj = { value: 0 };
    const endValue = parseInt(value.toString().replace(/,/g, ''));
    
    gsap.to(obj, {
      value: endValue,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        const newValue = Math.floor(obj.value);
        if (newValue !== count) {
          setCount(newValue);
        }
      }
    });
  }, []);
  
  return <span>{count.toLocaleString()}</span>;
};

export default Stats; 