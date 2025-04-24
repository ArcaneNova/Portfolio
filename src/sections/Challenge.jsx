import { useState } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TitleHeader from "../components/TitleHeader";
import Button from "../components/Button";
import GlowEffect from "../components/GlowEffect";
import CyberpunkInterface from "../components/CyberpunkInterface";
import CubeBackground from "../components/CubeBackground";

const challenges = [
  {
    id: 1,
    title: "100 Days of DSA",
    description: "Solving one Data Structure and Algorithm problem every day for 100 days.",
    progress: 42,
    startDate: "2024-04-01",
    badge: "In Progress",
    posts: [
      { 
        day: 42, 
        caption: "Solved a complex graph problem today! #100DaysOfDSA", 
        image: "/images/challenges/dsa-42.png",
        date: "2024-05-12"
      },
      { 
        day: 41, 
        caption: "Dynamic Programming is getting easier! #100DaysOfDSA", 
        image: "/images/challenges/dsa-41.png",
        date: "2024-05-11"
      },
      { 
        day: 40, 
        caption: "Binary Search Trees are fun! #100DaysOfDSA", 
        image: "/images/challenges/dsa-40.png",
        date: "2024-05-10"
      }
    ]
  },
  {
    id: 2,
    title: "30 Days of ML",
    description: "Building a new machine learning project every day for 30 days.",
    progress: 18,
    startDate: "2024-03-15",
    badge: "Completed",
    posts: [
      { 
        day: 30, 
        caption: "Final day! Built a full recommendation system! #30DaysOfML", 
        image: "/images/challenges/ml-30.png",
        date: "2024-04-13"
      },
      { 
        day: 29, 
        caption: "Exploring reinforcement learning today! #30DaysOfML", 
        image: "/images/challenges/ml-29.png",
        date: "2024-04-12"
      }
    ]
  }
];

const ChallengeCard = ({ challenge }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlowEffect>
      <CyberpunkInterface title={challenge.title}>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end items-center mb-2">
            <span className={`inline-block px-4 py-2 rounded text-sm font-semibold uppercase tracking-wider ${
              challenge.badge === 'Completed' 
                ? 'bg-opacity-20 text-green-400 bg-green-900 border border-green-500'
                : 'bg-opacity-20 text-blue-400 bg-blue-900 border border-blue-500'
            }`}>
              {challenge.badge}
            </span>
          </div>
          
          <p className="text-gray-200 text-opacity-80 text-sm md:text-base leading-relaxed mb-4">
            {challenge.description}
          </p>
          
          <div className="mb-6">
            <div className="h-2 bg-gray-800 bg-opacity-50 rounded overflow-hidden border border-gray-700 border-opacity-30 mb-2">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded shadow-md transition-all duration-1000 ease-out"
                style={{ width: `${(challenge.progress / (challenge.title.includes('100') ? 100 : 30)) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Day {challenge.progress} of {challenge.title.includes('100') ? '100' : '30'}
            </span>
          </div>
          
          <div className="mt-6">
            <h4 className="text-indigo-400 text-sm uppercase tracking-wider font-semibold mb-4 pb-1 border-b border-indigo-500 border-opacity-30 inline-block">
              Recent Updates
            </h4>
            <div className={`overflow-hidden transition-all duration-500 ${expanded ? 'max-h-[2000px]' : 'max-h-[350px]'}`}>
              {challenge.posts.slice(0, expanded ? challenge.posts.length : 2).map((post, index) => (
                <div key={index} className="grid grid-cols-[50px_1fr] gap-4 mb-6 pb-6 border-b border-gray-700 border-opacity-20 last:border-0 last:mb-0 last:pb-0">
                  <div className="flex items-center justify-center h-12 w-12 bg-indigo-900 bg-opacity-20 text-indigo-400 font-semibold text-sm rounded border border-indigo-500 border-opacity-40 font-mono">
                    Day {post.day}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="relative overflow-hidden rounded border border-indigo-500 border-opacity-30 group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-transparent opacity-20 z-10 pointer-events-none"></div>
                      <img 
                        src={post.image} 
                        alt={`Day ${post.day}`} 
                        className="w-full h-[150px] object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{post.caption}</p>
                    <span className="text-gray-500 text-xs font-mono">{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
            {challenge.posts.length > 2 && (
              <button 
                className="mt-4 px-4 py-2 text-indigo-400 text-sm font-semibold border border-indigo-500 border-opacity-30 rounded transition-colors duration-300 hover:bg-indigo-900 hover:bg-opacity-10 flex items-center"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'See Less' : 'See More'}
                <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={expanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      </CyberpunkInterface>
    </GlowEffect>
  );
};

const Challenge = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".cyber-interface",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  return (
    <section id="challenges" className="relative overflow-hidden py-24 px-6 lg:px-8">
      {/* Add the cube background for this section */}
      <CubeBackground density={8} />
      
      <TitleHeader title="My Challenges" subtitle="Track my daily progress on various coding challenges" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 mt-12">
        {challenges.map(challenge => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
      
      <GlowEffect intensity={0.25} className="mt-16">
        <CyberpunkInterface title="NEW_CHALLENGE">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold text-indigo-400 uppercase tracking-wider mb-2">Start a New Challenge</h3>
            <p className="text-gray-300 text-opacity-70 max-w-md mx-auto">Challenge yourself to learn and grow consistently!</p>
            <div className="mt-6">
              <Button 
                text="Create Challenge" 
                className="md:w-60 md:h-14 w-full h-12"
              />
            </div>
          </div>
        </CyberpunkInterface>
      </GlowEffect>
    </section>
  );
};

export default Challenge; 