import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from "../components/NavBar.jsx";
import Footer from '../components/Footer';
import CyberpunkInterface from '../components/CyberpunkInterface';
import GlowEffect from '../components/GlowEffect';
import HolographicBackground from '../components/HolographicBackground';
import TechParticlesGrid from '../components/TechParticlesGrid';
import { FaQuoteLeft, FaQuoteRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

// Profile image
const profileImage = "/pic/mdarshadnoor-smile.png";

const journeyData = [
  {
    year: '2013',
    title: 'Early Fascination with Technology',
    description: 'Since my childhood I had a keen interest in computers and technology. I learned to use computers when I was in 1st standard. My uncle had a xerox photocopy shop and after school I often spent my time learning computer skills and doing simple tasks like downloading and printing, nothing more fancy. When a teacher asked in GK class what I wanted to become, I used to say "I want to become a software engineer," even though I didn\'t know the definition of a software engineer and had just heard the term from my friend. Alhamdulillah, today that dream has become reality. Everytime I think about this, I feel so blessed and it gives me energy.',
    achievement: 'First interaction with computers in 1st standard',
    color: 'from-blue-400 to-indigo-600',
    icon: '💻',
    image: '/journey/childhood.jpg'
  },
  {
    year: '2014-2016',
    title: 'Digital Explorer & First Website',
    description: 'I started my internet journey in 2014 and created my first Facebook account with help from my friend Aftab Chand. After using Facebook for some time, I started understanding how Google, Facebook, and other websites worked. I wondered if I could build a custom website for myself, just to show off. I wasn\'t good in English, so when I searched on Google about how to create a website, the articles were only available in English and I had neither technical knowledge nor English skills to understand them. I created a blogspot website on Blogger (Google\'s platform) and started posting random general knowledge content. Fortunately, I was studying in an English-medium school, so over time I was able to understand English better. By reading articles, I managed to build my first website on May 16, 2016. I launched blogginghindi.com which was built on WordPress and I started writing articles to earn money from the internet.',
    achievement: 'Created first website on May 16, 2016',
    color: 'from-indigo-500 to-purple-600',
    icon: '🌐',
    image: '/journey/digital.jpg'
  },
  {
    year: '2018',
    title: 'First Earnings & Google Conference',
    description: 'After working consistently for 2 years and writing more than 300 articles on my website, I received my first payment in 2018. I was very happy because this was my life\'s first earning, around $100+. At the same time, other people who were doing full-time blogging were earning more than 2 lakh rupees monthly. But since I was studying, I couldn\'t do full-time blogging. I didn\'t want to give up on education at such an early age. I attended a Google Search Conference hosted by Google, which was a magical moment for me. I had always dreamed of working with Google, and somehow I was able to contribute to Google, which is why we received an invitation. My friend Aftab Chand and I went to Patna. This was the first time I left my city. I was doing all these things out of curiosity; otherwise, I wouldn\'t even have fit in with the group of older people—I was the youngest one there.',
    achievement: 'First income from digital content',
    color: 'from-pink-500 to-red-600',
    icon: '💰',
    image: '/journey/earnings.jpg'
  },
  {
    year: '2019',
    title: 'First Laptop & Server Management',
    description: 'I passed my 10th examination and purchased my first laptop, proudly using my own earned money. That same year, I got the highest traffic on my website. In a single day, I generated $348 (around 20,000+ INR), but my website server went down because of the high traffic. Since my 10th exam was about to be held, I had to give up my phone and everything for 2 months. I couldn\'t migrate the server, so the website\'s traffic declined (because Google doesn\'t rank unavailable websites). It was a golden opportunity—if I had been able to capitalize on it, I could easily have made 10 lakh rupees monthly from that traffic. Other bloggers (from Odisha and other states) grabbed similar opportunities and made more than 10 lakh rupees per month at that time. I missed this opportunity because I had no laptop, and managing a website from a mobile phone was impossible. Later, I migrated my website to Digital Ocean servers to handle millions of visitors simultaneously.',
    achievement: 'Website reached peak traffic',
    color: 'from-red-500 to-orange-600',
    icon: '💻',
    image: '/journey/laptop.jpg'
  },
  {
    year: '2020',
    title: 'Pandemic Opportunity',
    description: 'In 2020, when lockdown occurred, I was preparing for the JEE Mains examination. My coaching center was closed with no classes running. I decided to create a new website focusing on government schemes. The government was launching many new schemes (like sending money to people\'s accounts), and people were searching for information on Google. So I created a website where I wrote about these government schemes. After consistent day and night work, the website became successful with more than 100K daily visitors. I earned between 70K to 150K+ rupees monthly. Some others were able to generate more than 20 lakh rupees monthly on similar topics.',
    achievement: 'Created successful government schemes website',
    color: 'from-orange-500 to-yellow-600',
    icon: '🔍',
    image: '/journey/pandemic.jpg'
  },
  {
    year: '2021',
    title: 'First Startup Attempt',
    description: 'Since I was generating a good amount of money, I got a great idea and decided to start working on it. I formed a small team and began developing my startup idea. The concept was to build an EdTech startup for all state board students in India. Every state has its own education board like Bihar Board, UP Board, etc. My idea was to provide study materials for students from all these different boards. My team and I started working on this idea from my home. We worked 15+ hours daily to achieve our target. I passed my 12th exam in 2021, but took a 1-year break for JEE preparation and to work on this idea.',
    achievement: 'Formed a team for EdTech startup',
    color: 'from-yellow-500 to-green-600',
    icon: '🚀',
    image: '/journey/startup.jpg'
  },
  {
    year: '2022',
    title: 'Pivot to Education',
    description: 'After working for a year on this idea, we weren\'t able to achieve our target. My team was small and the idea was very big—even giants like Byju\'s aren\'t able to work on such a broad scope. The startup failed, and I had invested more than 5 lakh rupees in this idea. My government scheme website\'s traffic was also declining, and my earnings were decreasing month by month. I decided to pursue education because I knew learning new skills would be best; I could earn a good amount now, but that might not be sustainable in the future. So I took admission at Lovely Professional University. In my first year, I spent too much time and energy on unnecessary things. But everything happens for a reason. Maybe Allah wanted to test me, so He put me through difficulties. Nevertheless, we should learn from our mistakes—everything is written.',
    achievement: 'Started Bachelor\'s in Computer Science',
    color: 'from-green-500 to-teal-600',
    icon: '📚',
    image: '/journey/education.jpg'
  },
  {
    year: '2023',
    title: 'Balancing Act',
    description: 'In college, I tried to manage my studies while continuing work on my side projects. Managing studies, especially when pursuing computer science engineering, is very challenging. You have to learn new programming languages and tackle new concepts. Since I had good experience with technologies and knew programming languages like PHP, JavaScript (a little), HTML, CSS, etc., I was good at programming. However, I struggled with soft skills and couldn\'t speak confidently in front of people. I also performed only at an average level in theoretical subjects.',
    achievement: 'Applied past tech experience to college studies',
    color: 'from-teal-500 to-cyan-600',
    icon: '⚖️',
    image: '/journey/balance.jpg'
  },
  {
    year: '2024',
    title: 'Tech Exploration',
    description: 'I explored many programming languages and deepened my web development skills. Since I already had a good foundation in web development and was working on numerous web development projects, I decided to take machine learning as my minor subject in college. They teach artificial intelligence and machine learning courses going forward, which is crucial as machine learning is the future.',
    achievement: 'Chose Machine Learning as minor specialization',
    color: 'from-cyan-500 to-blue-600',
    icon: '🔬',
    image: '/journey/tech.jpg'
  },
  {
    year: '2025',
    title: 'Skill Integration',
    description: 'I now have good experience in web development, machine learning, and app development (Android and iOS). I have a solid foundation in DevOps and Cloud Engineering. I try to keep learning because I know in tech, everything is linked together. To build a complete product, I need knowledge across different skills. But mastering everything is impossible for any human being, so I create priority lists and focus on the most important things.',
    achievement: 'Integrated multiple technology domains',
    color: 'from-blue-500 to-indigo-600',
    icon: '🔄',
    image: '/journey/integration.jpg'
  },
  {
    year: 'Now',
    title: 'Continuous Growth',
    description: 'I am continuously learning DSA because it is the foundation for building logical solutions in the programming world. It makes you a better software engineer and enables you to build things from scratch without depending on external libraries. I have specific goals and continuously work toward them. I have ideas that need development and am also preparing for dream package placements (in case the ideas don\'t work out). Inshallah, I will remain consistent until I achieve success. I know that you shouldn\'t always focus only on outcomes—just give 100% effort, and even if things don\'t work out as planned, you\'ll have satisfaction. Even if you don\'t achieve the level of success you dreamed of, you\'ll have the great feeling of having tried your best when you\'re on your deathbed. So don\'t ever give up.',
    achievement: 'Focusing on DSA and innovative projects',
    color: 'from-indigo-500 to-violet-600',
    icon: '📈',
    image: '/journey/growth.jpg'
  }
];

// Skills data
const skills = [
  { name: 'Web Development', level: 90, color: 'from-blue-500 to-indigo-600' },
  { name: 'Database Management', level: 80, color: 'from-indigo-500 to-purple-600' },
  { name: 'Server Management', level: 85, color: 'from-purple-500 to-pink-600' },
  { name: 'Content Creation', level: 95, color: 'from-pink-500 to-red-600' },
  { name: 'Machine Learning', level: 65, color: 'from-red-500 to-orange-600' },
  { name: 'App Development', level: 70, color: 'from-orange-500 to-yellow-600' },
  { name: 'DSA', level: 75, color: 'from-yellow-500 to-green-600' },
  { name: 'DevOps', level: 65, color: 'from-green-500 to-teal-600' }
];

// Inspirational quotes data
const inspirationalQuotes = [
  {
    quote: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    source: "Stanford Commencement Address",
    color: "from-blue-400 to-purple-600"
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    source: "Entrepreneur",
    color: "from-indigo-500 to-blue-600"
  },
  {
    quote: "It's not about ideas. It's about making ideas happen.",
    author: "Scott Belsky",
    source: "Founder of Behance",
    color: "from-purple-500 to-pink-600"
  },
  {
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    source: "U.S. President",
    color: "from-green-500 to-blue-600"
  },
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    source: "Management Consultant",
    color: "from-orange-500 to-red-600"
  },
  {
    quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    source: "Former President of South Africa",
    color: "from-yellow-500 to-orange-600"
  },
  {
    quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
    source: "Former British Prime Minister",
    color: "from-red-500 to-pink-600"
  },
  {
    quote: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
    source: "Inventor",
    color: "from-green-500 to-teal-600"
  },
  {
    quote: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    source: "Musician",
    color: "from-blue-500 to-indigo-600"
  },
  {
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    source: "Hockey Player",
    color: "from-purple-500 to-violet-600"
  },
  {
    quote: "I didn't fail the test. I just found 100 ways to do it wrong.",
    author: "Benjamin Franklin",
    source: "Founding Father",
    color: "from-teal-500 to-green-600"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    source: "Former First Lady",
    color: "from-pink-500 to-purple-600"
  },
  {
    quote: "If you're going through hell, keep going.",
    author: "Winston Churchill",
    source: "Former British Prime Minister",
    color: "from-red-600 to-orange-600"
  },
  {
    quote: "The harder I work, the luckier I get.",
    author: "Gary Player",
    source: "Professional Golfer",
    color: "from-indigo-600 to-blue-600"
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    source: "Philosopher",
    color: "from-green-600 to-teal-600"
  }
];

// Movie quotes data
const movieQuotes = [
  {
    quote: "You got a dream, you gotta protect it. People can't do something themselves, they wanna tell you you can't do it.",
    author: "Chris Gardner (Will Smith)",
    source: "The Pursuit of Happyness",
    color: "from-blue-500 to-indigo-600"
  },
  {
    quote: "Oh yes, the past can hurt. But you can either run from it, or learn from it.",
    author: "Rafiki",
    source: "The Lion King",
    color: "from-orange-500 to-red-600"
  },
  {
    quote: "Don't ever let somebody tell you you can't do something. Not even me. You got a dream, you gotta protect it.",
    author: "Chris Gardner (Will Smith)",
    source: "The Pursuit of Happyness",
    color: "from-blue-600 to-purple-600"
  },
  {
    quote: "Life moves pretty fast. If you don't stop and look around once in a while, you could miss it.",
    author: "Ferris Bueller",
    source: "Ferris Bueller's Day Off",
    color: "from-green-500 to-teal-600"
  },
  {
    quote: "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it.",
    author: "Jordan Belfort (Leonardo DiCaprio)",
    source: "The Wolf of Wall Street",
    color: "from-red-500 to-pink-600"
  },
  {
    quote: "Sometimes it is the people no one can imagine anything of who do the things no one can imagine.",
    author: "Alan Turing (Benedict Cumberbatch)",
    source: "The Imitation Game",
    color: "from-indigo-500 to-blue-600"
  },
  {
    quote: "I'm not interested in money. I just want to be wonderful.",
    author: "Marilyn Monroe",
    source: "My Week with Marilyn",
    color: "from-pink-500 to-purple-600"
  },
  {
    quote: "I don't want to survive. I want to live.",
    author: "Solomon Northup (Chiwetel Ejiofor)",
    source: "12 Years a Slave",
    color: "from-yellow-600 to-orange-600"
  },
  {
    quote: "Nobody is gonna hit as hard as life. But it ain't about how hard you hit. It's about how hard you can get hit and keep moving forward.",
    author: "Rocky Balboa (Sylvester Stallone)",
    source: "Rocky Balboa",
    color: "from-red-600 to-orange-600"
  },
  {
    quote: "Great men are not born great, they grow great.",
    author: "Mario Puzo",
    source: "The Godfather",
    color: "from-gray-600 to-gray-800"
  }
];

// Combine all quotes
const allQuotes = [...inspirationalQuotes, ...movieQuotes];

// Create a simple ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// Timeline Marker Component with 3D Effect - Make it more responsive
const TimelineMarker = ({ year, color, active, onClick }) => (
  <motion.div 
    className={`cursor-pointer relative z-20 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full 
      ${active 
        ? 'scale-110 shadow-lg shadow-blue-500/30' 
        : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${color} opacity-20 blur-sm`}></div>
    <div className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-black border-2 border-white/10 flex items-center justify-center
      ${active ? 'shadow-inner shadow-blue-500/50' : ''}`}>
      <div className={`text-xs sm:text-sm font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {year}
      </div>
    </div>
  </motion.div>
);

// SkillBar Component with Animation
const SkillBar = ({ name, level, color, index }) => {
  const barRef = useRef(null);
  
  useGSAP(() => {
    gsap.fromTo(
      barRef.current,
      { width: 0 },
      { 
        width: `${level}%`, 
        duration: 1.5,
        delay: 0.1 * index,
        ease: "power2.out",
        scrollTrigger: {
          trigger: barRef.current,
          start: "top 90%",
        }
      }
    );
  }, []);

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-white font-medium">{name}</span>
        <span className="text-blue-300">{level}%</span>
      </div>
      <div className="h-3 bg-black-300 rounded-full overflow-hidden">
        <div 
          ref={barRef}
          className={`h-full bg-gradient-to-r ${color} rounded-full w-0`}
        ></div>
      </div>
    </div>
  );
};

// Interactive TimeLine Component - Make it mobile responsive
const InteractiveTimeline = ({ data, onSelect }) => {
  const [hoveredYear, setHoveredYear] = useState(null);
  const timelineRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div ref={timelineRef} className="relative mb-8 px-2">
      {/* Timeline bar */}
      <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-blue-800/50 via-purple-800/50 to-blue-800/50 transform -translate-y-1/2"></div>
      
      {isMobile ? (
        // Mobile scrollable timeline
        <div className="flex items-center relative py-4 overflow-x-auto hide-scrollbar pb-6">
          <div className="flex space-x-6 px-4">
            {data.map((entry, index) => (
              <TimelineMarker 
                key={entry.year}
                year={entry.year}
                color={entry.color}
                active={hoveredYear === entry.year}
                onClick={() => {
                  setHoveredYear(entry.year);
                  onSelect(index);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        // Desktop timeline
        <div className="flex justify-between items-center relative">
          {data.map((entry, index) => (
            <TimelineMarker 
              key={entry.year}
              year={entry.year}
              color={entry.color}
              active={hoveredYear === entry.year}
              onClick={() => {
                setHoveredYear(entry.year);
                onSelect(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Card flip component for journey entries
const FlipCard = ({ entry }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      className="w-full h-96 relative perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div 
        className="w-full h-full relative preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden">
          <GlowEffect color="blue" intensity="medium">
            <div className="h-full rounded-xl overflow-hidden bg-black-200/80 backdrop-blur-sm border border-blue-600/30 p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${entry.color} flex items-center justify-center text-xl`}>
                  {entry.icon}
                </div>
                <div className="ml-4">
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${entry.color} bg-clip-text text-transparent`}>
                    {entry.year}
                  </h3>
                  <h4 className="text-white font-semibold">{entry.title}</h4>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden relative">
                <div className="bg-gradient-to-b from-transparent via-black-300/0 to-black-300/90 absolute bottom-0 left-0 right-0 h-16 z-10"></div>
                <p className="text-gray-300 text-sm line-clamp-6">{entry.description.substring(0, 150)}...</p>
              </div>
              
              <div className="mt-4 text-center">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-900/30 text-blue-300 border border-blue-700/50">
                  {entry.achievement}
                </span>
                <p className="text-blue-400 mt-3 text-sm">Flip for full story</p>
              </div>
            </div>
          </GlowEffect>
        </div>
        
        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden rotateY-180">
          <GlowEffect color="purple" intensity="low">
            <div className="h-full rounded-xl overflow-hidden bg-black-200/80 backdrop-blur-sm border border-purple-600/30 p-6 flex flex-col">
              <h4 className={`text-xl font-bold mb-3 bg-gradient-to-r ${entry.color} bg-clip-text text-transparent`}>
                {entry.title} - {entry.year}
              </h4>
              
              <div className="flex-1 overflow-auto custom-scrollbar pr-2">
                <p className="text-gray-300 text-sm">{entry.description}</p>
              </div>
              
              <div className="mt-4 text-center">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-900/30 text-purple-300 border border-purple-700/50">
                  {entry.achievement}
                </span>
              </div>
            </div>
          </GlowEffect>
        </div>
      </motion.div>
    </div>
  );
};

// 3D Interactive Journey Card
const Journey3DCard = ({ entry, index, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isActive ? 1 : 0, 
        y: isActive ? 0 : 50,
        scale: isActive ? 1 : 0.9 
      }}
      transition={{ duration: 0.5 }}
      className={`w-full ${isActive ? 'block' : 'hidden'}`}
    >
      <FlipCard entry={entry} />
    </motion.div>
  );
};

// Custom Hook for parallax effect
const useParallax = (factor = 0.1) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (window.innerWidth / 2 - e.clientX) * factor;
      const y = (window.innerHeight / 2 - e.clientY) * factor;
      setPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [factor]);
  
  return position;
};

// Stat Counter Component
const StatCounter = ({ value, label, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  
  useGSAP(() => {
    let start = 0;
    const end = parseInt(value);
    const incrementTime = (duration / end) * 1000;
    
    const counter = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(counter);
    }, incrementTime);
    
    return () => clearInterval(counter);
  }, { scope: counterRef });
  
  return (
    <div ref={counterRef} className="text-center">
      <div className="text-4xl font-bold text-white mb-2">{count}+</div>
      <div className="text-blue-400 text-sm">{label}</div>
    </div>
  );
};

// Sliding Quote Component
const QuoteSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const quoteRef = useRef(null);
  const intervalRef = useRef(null);
  
  // Go to next quote
  const nextQuote = () => {
    setDirection('next');
    setCurrentIndex(prevIndex => 
      prevIndex === allQuotes.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // Go to previous quote
  const prevQuote = () => {
    setDirection('prev');
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? allQuotes.length - 1 : prevIndex - 1
    );
  };
  
  // Auto rotate quotes
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextQuote();
    }, 8000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex]);
  
  // Reset timer when manually navigating
  const handleManualNav = (callback) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    callback();
    intervalRef.current = setInterval(() => {
      nextQuote();
    }, 8000);
  };
  
  // Animation variants for framer motion
  const variants = {
    enter: (direction) => ({
      x: direction === 'next' ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction === 'next' ? -500 : 500,
      opacity: 0
    })
  };
  
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative overflow-hidden py-12">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            ref={quoteRef}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            className="flex flex-col items-center"
          >
            <GlowEffect color="blue" intensity="medium">
              <div className={`relative bg-black-300/50 backdrop-blur-md p-8 rounded-2xl border border-${allQuotes[currentIndex].color.split(' ')[0].replace('from-', '')}-500/30 overflow-hidden`}>
                <div className="absolute -top-10 -left-10 text-7xl opacity-10">
                  <FaQuoteLeft />
                </div>
                <div className="absolute -bottom-10 -right-10 text-7xl opacity-10">
                  <FaQuoteRight />
                </div>
                
                <div className="relative z-10">
                  <blockquote className="text-xl md:text-2xl text-center font-light mb-6 text-blue-50">
                    "{allQuotes[currentIndex].quote}"
                  </blockquote>
                  
                  <div className="text-center">
                    <h3 className={`text-lg md:text-xl font-semibold bg-gradient-to-r ${allQuotes[currentIndex].color} bg-clip-text text-transparent mb-1`}>
                      {allQuotes[currentIndex].author}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {allQuotes[currentIndex].source}
                    </p>
                  </div>
                </div>
              </div>
            </GlowEffect>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={() => handleManualNav(prevQuote)}
          className="bg-black/50 backdrop-blur-sm text-white rounded-full p-2 transform -translate-x-1/2 hover:bg-black/70 transition-colors focus:outline-none"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={() => handleManualNav(nextQuote)}
          className="bg-black/50 backdrop-blur-sm text-white rounded-full p-2 transform translate-x-1/2 hover:bg-black/70 transition-colors focus:outline-none"
        >
          <FaChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Progress indicators */}
      <div className="mt-4 flex justify-center gap-2">
        {allQuotes.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 'next' : 'prev');
              setCurrentIndex(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-blue-500 w-5' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const MyJourney = () => {
  const [selectedJourney, setSelectedJourney] = useState(0);
  const parallax = useParallax(0.02);
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  
  // Add style for 3D card effect and responsiveness
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .perspective-1000 { perspective: 1000px; }
      .preserve-3d { transform-style: preserve-3d; }
      .backface-hidden { backface-visibility: hidden; }
      .rotateY-180 { transform: rotateY(180deg); }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.5); border-radius: 2px; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useGSAP(() => {
    // Initial animations
    gsap.fromTo(
      ".hero-title",
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      ".hero-subtitle",
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
      }
    );
    
    // Stats counter animation
    gsap.fromTo(
      ".stats-counter",
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        }
      }
    );
    
    // Quote animation
    gsap.fromTo(
      ".quote-card",
      { opacity: 0, scale: 0.9 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".quote-card",
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        <HolographicBackground intensity={0.2} />
        <ErrorBoundary>
          <TechParticlesGrid count={50} />
        </ErrorBoundary>
      </div>

      {/* Navigation */}
      <Navbar />

      <main className="container mx-auto px-2 sm:px-4 py-12 relative">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center py-20">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            style={{ 
              x: parallax.x * -1, 
              y: parallax.y * -1 
            }}
          >
            <CyberpunkInterface 
              title="PERSONAL ODYSSEY" 
              subtitle="SYS.JOURNEY.LOG" 
              className="mb-8"
            />
            
            {/* Add profile image */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-70 animate-pulse"></div>
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-white/30">
                  <img 
                    src={profileImage} 
                    alt="Md Arshad Noor" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute inset-0 bg-blue-500/10"></div>
                </div>
              </div>
            </div>
            
            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                My Digital Evolution
              </span>
            </h1>
            
            <p className="hero-subtitle text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
              From a curious child with a dream to a software engineer building the future.
              This is my journey of growth, challenges, and constant evolution.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a 
                href="#journey"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/20 animate-pulse"
              >
                Explore My Journey
              </a>
            </motion.div>
          </motion.div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <span className="text-blue-400 text-sm mb-2">Scroll Down</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 rounded-full border-2 border-blue-400 flex justify-center pt-1"
            >
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-3 bg-blue-400 rounded-full opacity-75"
              />
            </motion.div>
          </div>
        </section>
        
        {/* Quote Section - Make more responsive */}
        <section className="mb-20 md:mb-32">
          <div className="quote-card max-w-4xl mx-auto">
            <GlowEffect color="blue" intensity="high">
              <div className="bg-black-300/30 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-blue-500/20">
                <div className="text-4xl md:text-6xl text-blue-500/30 font-serif mb-4">"</div>
                <blockquote className="text-xl md:text-3xl italic font-light text-center mb-6 text-blue-50">
                You got a dream, you gotta protect it. People can't do something themselves, they wanna tell you you can't do it.
                </blockquote>
                <div className="text-center">
                  <span className="inline-block px-4 py-2 rounded-full bg-blue-900/40 text-blue-300 font-semibold text-sm md:text-base">
                  The Pursuit of Happyness
                  </span>
                </div>
              </div>
            </GlowEffect>
          </div>
        </section>
        
        {/* NEW: Sliding Quotes Section */}
        <section className="mb-20 md:mb-32">
          <CyberpunkInterface 
            title="INSPIRATIONAL_QUOTES" 
            subtitle="WISDOM.DATABASE" 
            className="mb-8 md:mb-12"
          />
          
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Words That Ignite Greatness
            </h2>
            
            <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto text-sm md:text-base">
              A collection of powerful quotes that have inspired entrepreneurs, visionaries, and changemakers throughout history. Swipe through for wisdom that might spark your next big idea.
            </p>
            
            {/* Quote Slider Component */}
            <QuoteSlider />
          </div>
        </section>
        
        {/* Stats Section - Improve mobile layout */}
        <section ref={statsRef} className="mb-20 md:mb-32">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Journey in Numbers
            </h2>
            
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              <div className="stats-counter">
                <StatCounter value="11" label="Years of Tech Journey" />
              </div>
              <div className="stats-counter">
                <StatCounter value="300" label="Blog Articles Written" />
              </div>
              <div className="stats-counter">
                <StatCounter value="100000" label="Website Visitors" />
              </div>
              <div className="stats-counter">
                <StatCounter value="8" label="Tech Skills Mastered" />
              </div>
            </div>
          </div>
        </section>
      
        {/* Interactive Journey Section - Fix mobile view */}
        <section id="journey" className="mb-20 md:mb-32">
          <CyberpunkInterface 
            title="TIMELINE" 
            subtitle="EXPERIENCE.LOG" 
            className="mb-8 md:mb-12"
          />
          
          <div className="max-w-6xl mx-auto">
            {/* Timeline Navigation */}
            <div className="px-0 md:px-6">
              <InteractiveTimeline 
                data={journeyData} 
                onSelect={setSelectedJourney} 
              />
            </div>
            
            {/* Journey Content */}
            <div className="mt-8 md:mt-16 px-2">
              <AnimatePresence mode="wait">
                {journeyData.map((entry, index) => (
                  <Journey3DCard 
                    key={entry.year}
                    entry={entry}
                    index={index}
                    isActive={selectedJourney === index}
                  />
                ))}
              </AnimatePresence>
            </div>
            
            {/* Navigation Arrows - Improve mobile placement */}
            <div className="flex justify-between mt-6 md:mt-8 px-2 md:px-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-900/50 border border-blue-600/30 flex items-center justify-center text-blue-400 hover:bg-blue-800/50 transition-colors"
                onClick={() => setSelectedJourney(prev => (prev === 0 ? journeyData.length - 1 : prev - 1))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-900/50 border border-blue-600/30 flex items-center justify-center text-blue-400 hover:bg-blue-800/50 transition-colors"
                onClick={() => setSelectedJourney(prev => (prev === journeyData.length - 1 ? 0 : prev + 1))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </div>
        </section>
        
        {/* Skills Section - Better mobile layout */}
        <section className="mb-20 md:mb-32 px-2">
          <CyberpunkInterface 
            title="SKILL MATRIX" 
            subtitle="ABILITY.DATA" 
            className="mb-8 md:mb-12"
          />
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 md:gap-y-2">
              {skills.map((skill, index) => (
                <SkillBar 
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={skill.color}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Lessons Learned Section - Mobile friendly */}
        <section className="mb-20 md:mb-32 px-2">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Key Lessons From My Journey
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <GlowEffect color="purple" intensity="low">
              <div className="h-full bg-black-200/50 backdrop-blur-sm p-5 md:p-6 rounded-xl border border-purple-600/20">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mb-4 md:mb-6 flex items-center justify-center text-xl md:text-2xl">
                  🔄
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Consistency is Key</h3>
                <p className="text-gray-300 text-sm md:text-base">
                  Working consistently for two years led to my first payment. Progress compounds over time. Stay persistent even when results aren't immediate.
                </p>
              </div>
            </GlowEffect>
            
            <GlowEffect color="blue" intensity="low">
              <div className="h-full bg-black-200/50 backdrop-blur-sm p-5 md:p-6 rounded-xl border border-blue-600/20">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 mb-4 md:mb-6 flex items-center justify-center text-xl md:text-2xl">
                  💡
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Balance Education & Skills</h3>
                <p className="text-gray-300 text-sm md:text-base">
                  I didn't give up on education despite earning well from my websites. The foundation of formal education combined with practical skills is powerful.
                </p>
              </div>
            </GlowEffect>
            
            <GlowEffect color="pink" intensity="low">
              <div className="h-full bg-black-200/50 backdrop-blur-sm p-5 md:p-6 rounded-xl border border-pink-600/20">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-pink-600 to-red-600 mb-4 md:mb-6 flex items-center justify-center text-xl md:text-2xl">
                  🚀
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Embrace Failure</h3>
                <p className="text-gray-300 text-sm md:text-base">
                  My startup attempt didn't succeed, but I gained invaluable experience. Failure is a stepping stone to success, not the end of the journey.
                </p>
              </div>
            </GlowEffect>
          </div>
        </section>
        
        {/* Call to Action - Improve mobile layout */}
        <section className="mb-16 md:mb-20 px-2">
          <div className="max-w-4xl mx-auto">
            <GlowEffect color="blue" intensity="medium">
              <div className="bg-black-300/70 p-6 md:p-10 rounded-2xl border border-blue-600/30 backdrop-blur-md relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-600/10 blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-purple-600/10 blur-xl"></div>
                
                <div className="relative">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    What's Next on My Journey?
                  </h2>
                  
                  <div className="text-blue-50 mb-6 md:mb-8 space-y-3 md:space-y-4 text-sm md:text-base">
                    <p>
                      I'm continuously learning DSA to build stronger programming foundations. Working on innovative ideas while
                      preparing for dream opportunities. The journey continues.
                    </p>
                    
                    <p>
                      Feeling so grateful for having such supportive people in my life and those who love me unexpectedly. 
                      I'm not surrounded by many people, but those who are in my life are the best—they've supported me through all my ups and downs.
                    </p>
                    
                    <p>
                      Thank you for reading this far. If you're working on any idea and need a partner, feel free to connect. 
                      I would love to work on great ideas together.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="#contact"
                      className="inline-block px-6 md:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/20 w-full sm:w-auto text-center text-sm md:text-base"
                    >
                      Get in Touch
                    </motion.a>
                    
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="#projects"
                      className="inline-block px-6 md:px-8 py-3 bg-transparent border-2 border-blue-600/50 text-blue-400 font-bold rounded-full hover:bg-blue-900/20 transition-all duration-300 w-full sm:w-auto text-center text-sm md:text-base"
                    >
                      See My Projects
                    </motion.a>
                  </div>
                </div>
              </div>
            </GlowEffect>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Custom CSS for 3D Perspective Effects */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotateY-180 {
          transform: rotateY(180deg);
        }
        .line-clamp-6 {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MyJourney;