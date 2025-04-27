import { useRef, useState } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CyberpunkInterface from '../components/CyberpunkInterface';
import GlowEffect from '../components/GlowEffect';

gsap.registerPlugin(ScrollTrigger);

// Skills data with categories
const skillsData = {
  "Programming Languages": [
    { name: "JavaScript", level: 95 },
    { name: "Python", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "C++", level: 80 },
    { name: "Java", level: 75 },
  ],
  "Frontend Development": [
    { name: "React", level: 95 },
    { name: "Next.js", level: 90 },
    { name: "HTML/CSS", level: 95 },
    { name: "Tailwind CSS", level: 90 },
    { name: "Redux", level: 85 },
  ],
  "Backend Development": [
    { name: "Node.js", level: 90 },
    { name: "Express", level: 85 },
    { name: "Django", level: 80 },
    { name: "FastAPI", level: 75 },
    { name: "MongoDB", level: 85 },
  ],
  "Machine Learning & AI": [
    { name: "TensorFlow", level: 85 },
    { name: "PyTorch", level: 80 },
    { name: "Scikit-learn", level: 90 },
    { name: "NLP", level: 75 },
    { name: "Computer Vision", level: 70 },
  ]
};

// Tools data
const toolsData = [
  { name: "VS Code", icon: "vscode.svg" },
  { name: "Git", icon: "git.svg" },
  { name: "Docker", icon: "docker.svg" },
  { name: "AWS", icon: "aws.svg" },
  { name: "GitHub", icon: "github.svg" },
  { name: "Kubernetes", icon: "kubernetes.svg" },
  { name: "Figma", icon: "figma.svg" },
  { name: "Jupyter", icon: "jupyter.svg" },
];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("Programming Languages");
  const sectionRef = useRef(null);
  const skillsBarRef = useRef(null);
  const toolsRef = useRef(null);
  const titleRef = useRef(null);
  
  useGSAP(() => {
    // Check if necessary DOM elements exist before animating
    if (!sectionRef.current) return;
    
    const skillsTitle = document.getElementById('skills-title');
    if (skillsTitle) {
      // Animate section title with more dramatic effect
      gsap.fromTo(
        "#skills-title",
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
    }
    
    const categoryButtons = document.querySelectorAll('.skill-category');
    if (categoryButtons.length > 0) {
      // Animate category buttons with staggered appearance
      gsap.fromTo(
        ".skill-category",
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%"
          }
        }
      );
    }
    
    if (toolsRef.current) {
      const toolItems = toolsRef.current.querySelectorAll('.tool-item');
      if (toolItems.length > 0) {
        // Animate tools with a more playful animation
        gsap.fromTo(
          ".tool-item",
          { opacity: 0, scale: 0.8, y: 20 },
          { 
            opacity: 1, 
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
              trigger: toolsRef.current,
              start: "top 85%"
            }
          }
        );
      }
    }
    
    // Initial animation for skill bars
    animateSkillBars();
  }, []);

  // Animate skill bars when category changes with improved timing
  const animateSkillBars = () => {
    const skillBarFills = document.querySelectorAll('.skill-bar-fill');
    if (skillBarFills.length > 0) {
      gsap.fromTo(
        ".skill-bar-fill",
        { width: 0 },
        { 
          width: "var(--skill-level)", 
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.15,
        }
      );
    }
    
    const skillItems = document.querySelectorAll('.skill-item');
    if (skillItems.length > 0) {
      gsap.fromTo(
        ".skill-item",
        { opacity: 0, x: -30 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
        }
      );
    }
  };
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    
    // Reset and animate skill bars with a slight delay
    gsap.set(".skill-bar-fill", { width: 0 });
    gsap.set(".skill-item", { opacity: 0, x: -30 });
    
    setTimeout(() => {
      animateSkillBars();
    }, 50);
  };

  return (
    <section id="skills" ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950/80"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
        
        {/* Animated elements */}
        <div className="absolute top-40 left-10 w-80 h-80 rounded-full bg-indigo-900/10 blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 z-10 relative">
        {/* Section Title */}
        <div className="text-center mb-20" id="skills-title" ref={titleRef}>
          <CyberpunkInterface>
            <div className="p-6">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent inline-block">
                Skills & Expertise
              </h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                My technical toolkit and proficiency levels across various domains
              </p>
            </div>
          </CyberpunkInterface>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Skills Categories */}
          <div className="lg:col-span-1">
            <div className="space-y-3 sticky top-24">
              {Object.keys(skillsData).map((category, index) => (
                <GlowEffect key={index} intensity={activeCategory === category ? 0.4 : 0.1}>
                  <button
                    className={`skill-category w-full text-left px-5 py-4 rounded-lg transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-indigo-900/90 to-indigo-700/80 text-white font-medium'
                        : 'bg-black/40 text-gray-300 hover:bg-indigo-900/40 backdrop-blur-sm'
                    } border ${activeCategory === category ? 'border-indigo-500/70' : 'border-indigo-500/20'}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <div className="flex items-center">
                      <span className={`h-2.5 w-2.5 rounded-full mr-3 ${activeCategory === category ? 'bg-indigo-400 animate-pulse' : 'bg-indigo-900'}`}></span>
                      {category}
                    </div>
                  </button>
                </GlowEffect>
              ))}
            </div>
          </div>
          
          {/* Skills Visualization */}
          <div className="lg:col-span-4" ref={skillsBarRef}>
            <CyberpunkInterface title={`${activeCategory.toUpperCase()}_PROFICIENCY`}>
              <div className="p-6 space-y-7">
                {skillsData[activeCategory].map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-200 font-medium text-lg">{skill.name}</span>
                      <span className="text-indigo-400 font-mono bg-black/30 px-2 py-0.5 rounded-md text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-gray-800 relative backdrop-blur-sm">
                      <div 
                        className="skill-bar-fill h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full relative"
                        style={{ "--skill-level": `${skill.level}%` }}
                      >
                        <div className="absolute top-0 right-0 h-full w-10 bg-white/10"></div>
                      </div>
                      
                      {/* Skill level markers */}
                      <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-30">
                        <div className="h-full w-px bg-gray-500"></div>
                        <div className="h-full w-px bg-gray-500"></div>
                        <div className="h-full w-px bg-gray-500"></div>
                        <div className="h-full w-px bg-gray-500"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CyberpunkInterface>
          </div>
        </div>
        
        {/* Tools Section */}
        <div className="mt-28" ref={toolsRef}>
          <CyberpunkInterface variant="blue" title="TOOLS_AND_TECHNOLOGIES">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-10 text-center text-blue-200">
                Tools & Technologies I Use Daily
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
                {toolsData.map((tool, index) => (
                  <GlowEffect key={index} intensity={0.25}>
                    <div className="tool-item bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-xl p-5 flex flex-col items-center justify-center transition-all hover:border-blue-400/70 hover:transform hover:-translate-y-1 duration-300">
                      <div className="w-16 h-16 mb-3 bg-black/50 rounded-lg flex items-center justify-center">
                        {/* Placeholder for icon - replace with actual icons */}
                        <span className="text-2xl text-blue-400 font-bold">{tool.name.charAt(0)}</span>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">{tool.name}</span>
                    </div>
                  </GlowEffect>
                ))}
              </div>
            </div>
          </CyberpunkInterface>
        </div>
      </div>
    </section>
  );
};

export default Skills; 