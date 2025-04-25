import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { styles } from "../styles";

gsap.registerPlugin(ScrollTrigger);

// Higher Order Component to wrap sections with consistent styling and animations
const SectionWrapper = (Component, idName) => {
  function HOC() {
    const sectionRef = useRef(null);

    useEffect(() => {
      const ctx = gsap.context(() => {
        // Create animations for section entry
        gsap.fromTo(
          sectionRef.current,
          { 
            opacity: 0,
            y: 50
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom-=10%",
            },
          }
        );
      });

      return () => ctx.revert(); // Clean up animations when component unmounts
    }, []);

    return (
      <section
        ref={sectionRef}
        className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
        id={idName}
      >
        <span className="hash-span" id={`#${idName}`}>
          &nbsp;
        </span>

        <Component />
      </section>
    );
  }

  return HOC;
};

export default SectionWrapper; 