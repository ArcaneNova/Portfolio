import { useRef } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import CyberpunkInterface from '../components/CyberpunkInterface';
import GlowEffect from '../components/GlowEffect';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  {
    year: "2019",
    title: "Passed 10th & Got My First Computer",
    description: "Passed my 10th examination and got 81% marks.Got my first computer and started learning HTML & CSS, beginning my journey in tech.",
    icon: "💻",
    color: "from-blue-400 to-cyan-300"
  },
  {
    year: "2021",
    title: "Passed 12th",
    description: "Passed my 12th examination and got 71% marks.",
    icon: "🎓",
    color: "from-indigo-500 to-blue-400"
  },
  {
    year: "2022",
    title: "Started My Bachelor's Degree",
    description: "Started my Bachelor's degree in Computer Science, focusing on algorithms and programming fundamentals.",
    icon: "🚀",
    color: "from-violet-500 to-indigo-400"
  },
  {
    year: "2024",
    title: "ML/AI Focus",
    description: "Shifted focus to Machine Learning and Artificial Intelligence, by taking machine learning as minor subject.",
    icon: "🧠",
    color: "from-purple-500 to-violet-400"
  },
  // {
  //   year: "2022",
  //   title: "Senior Developer",
  //   description: "Promoted to Senior Software Engineer, leading projects and mentoring junior developers.",
  //   icon: "👨‍💻",
  //   color: "from-rose-500 to-purple-400"
  // },
  // {
  //   year: "2024",
  //   title: "SaaS Startup",
  //   description: "Launched my own SaaS product, applying all the skills gathered through the years.",
  //   icon: "🌟",
  //   color: "from-blue-500 to-green-400"
  // }
];

const achievementData = [
  {
    title: "SIH 2024 Grand Finalist",
    date: "December 2024",
    description: "Build a machine learning model to forecast delhi's electricity demand based on current time and weather and other conditions.",
    image: "/achievements/hackathon.jpg"
  },
  {
    title: "AIU Aveshan Winner",
    date: "2025",
    description: "Build a farmer, vendor and consumer platform to sell and buy products directly from farmers to vendors (thela wala) to consumers.",
    image: "/achievements/opensource.jpg"
  },
  {
    title: "Code-a-fest winner (3rd)",
    date: "2024",
    description: "Won 3rd prize in Code-a-fest 2024. Where we build law-aware, a platform to help people to understand their rights and responsibilities.",
    image: "/achievements/conference.jpg"
  }
];

const About = () => {
  const timelineRef = useRef(null);
  const sectionRef = useRef(null);
  const profileRef = useRef(null);
  const achievementsRef = useRef(null);
  
  useGSAP(() => {
    // Animate section title
    gsap.fromTo(
      "#about-title",
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        }
      }
    );
    
    // Animate profile image
    gsap.fromTo(
      profileRef.current,
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%"
        }
      }
    );
    
    // Animate bio text
    gsap.fromTo(
      ".bio-text",
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%"
        }
      }
    );
    
    // Animate timeline
    gsap.fromTo(
      ".timeline-item",
      { opacity: 0, x: -30 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.5,
        stagger: 0.15,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%"
        }
      }
    );
    
    // Animate achievements
    gsap.fromTo(
      ".achievement-card",
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        stagger: 0.2,
        scrollTrigger: {
          trigger: achievementsRef.current,
          start: "top 80%"
        }
      }
    );
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16" id="about-title">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-100 bg-clip-text text-transparent inline-block">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-100 to-blue-50 mx-auto rounded-full"></div>
        </div>

        {/* Profile Photo - Visible on small screens only */}
        <div className="flex justify-center mb-12 lg:hidden">
          <div ref={profileRef} className="relative">
            <GlowEffect color="blue-100" intensity="high" className="rounded-full">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-blue-100/30">
                <img 
                  src="/profile.png" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                
                {/* Scanline effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-full h-20 bg-blue-100/10 animate-scan"></div>
                </div>
                
                {/* Holographic data overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black-100/80 to-transparent p-2">
                  <div className="text-xs font-mono text-blue-100 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-100 mr-2 animate-pulse"></span>
                    <span>SYS.ID: DEV_1337</span>
                  </div>
                </div>
              </div>
            </GlowEffect>
            
            {/* Tech specs badge */}
            <div className="absolute -top-3 -right-3 bg-black-100/80 backdrop-blur-sm text-blue-100 text-xs font-mono py-1 px-2 rounded border border-blue-100/30 animate-pulse">
              <span>STATUS: ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Bio */}
          <div className="lg:col-span-2">
            <CyberpunkInterface title="BIOGRAPHY">
              <div className="space-y-6 p-6">
                <p className="bio-text text-blue-50 leading-relaxed">
                  I'm a software engineer with a passion for building innovative applications that solve real-world problems. My journey in tech began in 2012 when I got my first computer and discovered the world of programming.
                </p>
                
                <p className="bio-text text-blue-50 leading-relaxed">
                  With expertise spanning web development, machine learning, and app development, I bring a diverse skill set to every project. I believe in writing clean, efficient code and creating intuitive user experiences.
                </p>
                
                <p className="bio-text text-blue-50 leading-relaxed">
                  When I'm not coding, I enjoy participating in hackathons, contributing to open-source projects, and mentoring aspiring developers. I'm constantly learning and exploring new technologies to stay at the cutting edge.
                </p>
                
                <div className="bio-text pt-4 border-t border-blue-100/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-blue-100 text-sm font-semibold mb-2">Location</h4>
                      <p className="text-white">Bihar, India</p>
                    </div>
                    <div>
                      <h4 className="text-blue-100 text-sm font-semibold mb-2">Education</h4>
                      <p className="text-white">B.Tech in Computer Science</p>
                    </div>
                    <div>
                      <h4 className="text-blue-100 text-sm font-semibold mb-2">Experience</h4>
                      <p className="text-white">3+ Years</p>
                    </div>
                    <div>
                      <h4 className="text-blue-100 text-sm font-semibold mb-2">Languages</h4>
                      <p className="text-white">English, Hindi</p>
                    </div>
                  </div>
                </div>
              </div>
            </CyberpunkInterface>
          </div>
          
          {/* Right Column - Profile Image (desktop only) */}
          <div className="hidden lg:block">
            <div ref={profileRef} className="relative">
              <GlowEffect color="blue-100" intensity="high" className="rounded-xl">
                <CyberpunkInterface title="IDENTITY">
                  <div className="p-4 flex flex-col items-center space-y-4">
                    {/* Profile image with effects */}
                    <div className="relative w-64 h-64 rounded-xl overflow-hidden border-2 border-blue-100/30">
                      <img 
                        src="/profile.png" 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Scanline effect */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-full h-20 bg-blue-100/10 animate-scan"></div>
                      </div>
                      
                      {/* Corner decorations */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-100"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-100"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-100"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-100"></div>
                    </div>
                    
                    {/* Data display */}
                    <div className="w-full space-y-2 font-mono text-sm">
                      <div className="flex justify-between text-blue-50">
                        <span>NAME:</span>
                        <span className="text-white">MD ARSHAD NOOR</span>
                      </div>
                      <div className="flex justify-between text-blue-50">
                        <span>ROLE:</span>
                        <span className="text-white">SOFTWARE ENGINEER</span>
                      </div>
                      <div className="flex justify-between text-blue-50">
                        <span>STATUS:</span>
                        <span className="text-green-400 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </CyberpunkInterface>
              </GlowEffect>
            </div>
          </div>
        </div>
        
        {/* Journey Timeline */}
        <div className="mt-20" ref={timelineRef}>
          <h3 className="text-2xl font-bold mb-8 text-center text-white">
            My <span className="text-blue-100">Journey</span>
          </h3>
          
          <div className="relative">
            {/* Central timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-blue-400 to-blue-100 z-0"></div>
            
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div 
                  key={index} 
                  className={`timeline-item relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Content */}
                  <motion.div 
                    className={`w-full md:w-5/12 relative z-10 ${
                      index % 2 === 0 ? 'md:pr-10' : 'md:pl-10'
                    }`}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <GlowEffect intensity="medium">
                      <CyberpunkInterface>
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xl font-bold text-white">{event.title}</h4>
                            <div className={`bg-gradient-to-r ${event.color} text-black font-bold text-sm py-1 px-3 rounded-md`}>
                              {event.year}
                            </div>
                          </div>
                          <p className="text-blue-50">{event.description}</p>
                        </div>
                      </CyberpunkInterface>
                    </GlowEffect>
                  </motion.div>
                  
                  {/* Center point */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                    <motion.div 
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${event.color} flex items-center justify-center text-xl shadow-lg border-2 border-white/10`}
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      {event.icon}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Achievements Section */}
        <div className="mt-24" ref={achievementsRef}>
          <h3 className="text-2xl font-bold mb-8 text-center text-white">
            Achievements & <span className="text-blue-100">Recognition</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievementData.map((achievement, index) => (
              <motion.div 
                key={index} 
                className="achievement-card"
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <GlowEffect intensity="low">
                  <CyberpunkInterface>
                    <div className="p-4 space-y-3">
                      <div className="h-48 bg-black-200 rounded-lg overflow-hidden mb-3 relative">
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/30 text-6xl">
                          {index === 0 ? "🏆" : index === 1 ? "💻" : "🎤"}
                        </div>
                        
                        {/* Data overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black-100/80 text-blue-100 text-xs font-mono p-2">
                          <div className="flex justify-between">
                            <span>{achievement.date}</span>
                            <span className="animate-pulse">REC.{index + 1}</span>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-bold text-white leading-tight">
                        {achievement.title}
                      </h4>
                      
                      <p className="text-blue-50 text-sm">
                        {achievement.description}
                      </p>
                    </div>
                  </CyberpunkInterface>
                </GlowEffect>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 



