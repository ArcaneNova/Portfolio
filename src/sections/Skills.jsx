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
  
  useGSAP(() => {
    // Animate section title
    gsap.fromTo(
      "#skills-title",
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
    
    // Animate category buttons
    gsap.fromTo(
      ".skill-category",
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%"
        }
      }
    );
    
    // Animate tools
    gsap.fromTo(
      ".tool-item",
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: toolsRef.current,
          start: "top 85%"
        }
      }
    );
    
    // Initial animation for skill bars
    animateSkillBars();
  }, []);

  // Animate skill bars when category changes
  const animateSkillBars = () => {
    gsap.fromTo(
      ".skill-bar-fill",
      { width: 0 },
      { 
        width: "var(--skill-level)", 
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
      }
    );
    
    gsap.fromTo(
      ".skill-item",
      { opacity: 0, x: -20 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.5,
        stagger: 0.1,
      }
    );
  };
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    
    // Reset and animate skill bars with a slight delay
    gsap.set(".skill-bar-fill", { width: 0 });
    gsap.set(".skill-item", { opacity: 0, x: -20 });
    
    setTimeout(() => {
      animateSkillBars();
    }, 50);
  };

  return (
    <section id="skills" ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16" id="skills-title">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent inline-block">
            Skills & Tools
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Skills Categories */}
          <div className="lg:col-span-1">
            <div className="space-y-2 sticky top-20">
              {Object.keys(skillsData).map((category, index) => (
                <button
                  key={index}
                  className={`skill-category w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-black/30 text-gray-300 hover:bg-indigo-900/30'
                  } border border-indigo-500/30`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Skills Visualization */}
          <div className="lg:col-span-4" ref={skillsBarRef}>
            <CyberpunkInterface title={`${activeCategory.toUpperCase()}_SKILLS`}>
              <div className="space-y-6">
                {skillsData[activeCategory].map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-200 font-medium">{skill.name}</span>
                      <span className="text-indigo-400 font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-gray-800">
                      <div 
                        className="skill-bar-fill h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full"
                        style={{ "--skill-level": `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CyberpunkInterface>
          </div>
        </div>
        
        {/* Tools Section */}
        <div className="mt-20" ref={toolsRef}>
          <h3 className="text-2xl font-bold mb-8 text-center text-gray-200">
            Tools & Technologies I Use
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
            {toolsData.map((tool, index) => (
              <GlowEffect key={index} intensity={0.2}>
                <div className="tool-item bg-black/20 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:border-indigo-500/60">
                  <div className="w-16 h-16 mb-3 bg-black/30 rounded-lg flex items-center justify-center">
                    {/* Placeholder for icon - replace with actual icons */}
                    <span className="text-2xl text-indigo-400">{tool.name.charAt(0)}</span>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">{tool.name}</span>
                </div>
              </GlowEffect>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills; 