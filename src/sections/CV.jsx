import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaDownload, FaEye } from "react-icons/fa";
import CyberpunkInterface from "../components/CyberpunkInterface";
import { styles } from "../styles";
import HologramButton from "../components/HologramButton";


gsap.registerPlugin(ScrollTrigger);

const CVSection = () => {
  const cvRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the CV section
      gsap.fromTo(
        cvRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cvRef.current,
            start: "top bottom-=100",
          },
        }
      );

      // Animate features
      const features = featuresRef.current.querySelectorAll(".feature-item");
      gsap.fromTo(
        features,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top bottom-=50",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative isolate">
      <CyberpunkInterface>
        <div ref={cvRef} className="flex flex-col lg:flex-row gap-6 px-1">
          <div className="lg:w-1/2">
            <h2 className={`${styles.sectionHeadText} mb-4 text-center lg:text-left`}>
              Professional Resume
            </h2>
            <div ref={featuresRef} className="mb-8">
              <div className="feature-item flex items-center gap-3 mb-3">
                <div className="h-2 w-2 rounded-full bg-tertiary flex-shrink-0"></div>
                <p className="text-secondary text-[17px]">
                  Professionally crafted and formatted for readability
                </p>
              </div>
              <div className="feature-item flex items-center gap-3 mb-3">
                <div className="h-2 w-2 rounded-full bg-tertiary flex-shrink-0"></div>
                <p className="text-secondary text-[17px]">
                  Optimized for Applicant Tracking Systems (ATS)
                </p>
              </div>
              <div className="feature-item flex items-center gap-3 mb-3">
                <div className="h-2 w-2 rounded-full bg-tertiary flex-shrink-0"></div>
                <p className="text-secondary text-[17px]">
                  Quantified achievements and metrics for impact
                </p>
              </div>
              <div className="feature-item flex items-center gap-3 mb-3">
                <div className="h-2 w-2 rounded-full bg-tertiary flex-shrink-0"></div>
                <p className="text-secondary text-[17px]">
                  Clean, modern design with professional formatting
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <HologramButton 
                onClick={() => window.open('/ats-resume.html', '_blank')}
                icon={<FaEye className="mr-2" />}
                text="View Resume"
              />
              <HologramButton 
                onClick={() => window.open('/resume.pdf', '_blank')}
                icon={<FaDownload className="mr-2" />}
                text="Download PDF"
                variant="secondary"
              />
            </div>
          </div>
          <div className="lg:w-1/2 shadow-lg border border-tertiary/30 rounded-lg overflow-hidden h-[500px]">
            <iframe 
              src="/ats-resume.html" 
              title="Resume Preview"
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>
        </div>
      </CyberpunkInterface>
    </div>
  );
};

export default CVSection;