import { useState, useEffect, useRef } from 'react';

const TypewriterEffect = ({ 
  text, 
  speed = 50, 
  startDelay = 300,
  cursorBlinkSpeed = 700,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const characterIndexRef = useRef(0);
  const timerRef = useRef(null);
  const cursorTimerRef = useRef(null);
  const glitchTimerRef = useRef(null);
  const [glitchText, setGlitchText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  
  // ASCII decorations for futuristic effect
  const asciiDecoration = "> ";
  
  // Generate glitch text
  const generateGlitchText = (baseText) => {
    const glitchChars = "!@#$%^&*<>{}[]|/\\~`";
    let result = '';
    const baseLength = baseText.length;
    const insertionPoints = Math.max(1, Math.floor(baseLength / 5));
    
    // Copy the base text
    result = baseText;
    
    // Insert random glitch characters
    for (let i = 0; i < insertionPoints; i++) {
      const pos = Math.floor(Math.random() * baseLength);
      const glitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      result = result.substring(0, pos) + glitchChar + result.substring(pos);
    }
    
    return result;
  };
  
  // Trigger random glitches
  const triggerRandomGlitch = () => {
    if (Math.random() < 0.25 && displayedText.length > 3 && !isGlitching) { // 25% chance
      setIsGlitching(true);
      setGlitchText(generateGlitchText(displayedText));
      
      // Reset glitch after a brief moment
      setTimeout(() => {
        setIsGlitching(false);
      }, 150);
    }
  };

  useEffect(() => {
    // Clear any existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (cursorTimerRef.current) clearInterval(cursorTimerRef.current);
    if (glitchTimerRef.current) clearInterval(glitchTimerRef.current);
    
    // Start typing after delay
    timerRef.current = setTimeout(() => {
      const typeCharacter = () => {
        if (characterIndexRef.current < text.length) {
          setDisplayedText(text.substring(0, characterIndexRef.current + 1));
          characterIndexRef.current += 1;
          
          // Random typing speed variation for more realistic effect
          const randomSpeed = speed * (0.7 + Math.random() * 0.6);
          timerRef.current = setTimeout(typeCharacter, randomSpeed);
          
          // Trigger possible glitch while typing
          triggerRandomGlitch();
        } else {
          setIsCompleted(true);
        }
      };
      
      typeCharacter();
    }, startDelay);
    
    // Setup cursor blinking
    cursorTimerRef.current = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, cursorBlinkSpeed);
    
    // Setup regular glitch checks
    glitchTimerRef.current = setInterval(() => {
      if (displayedText.length > 3) {
        triggerRandomGlitch();
      }
    }, 3000);
    
    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (cursorTimerRef.current) clearInterval(cursorTimerRef.current);
      if (glitchTimerRef.current) clearInterval(glitchTimerRef.current);
    };
  }, [text, speed, startDelay, cursorBlinkSpeed]);

  return (
    <div className={`font-mono ${className}`}>
      <div className="text-xs text-indigo-500 mb-1 opacity-70">DATA_STREAM.INIT</div>
      <div className="flex items-baseline">
        <span className="text-indigo-400 mr-1">{asciiDecoration}</span>
        <span className="text-white">
          {isGlitching ? glitchText : displayedText}
          <span 
            className={`inline-block w-2 h-4 bg-indigo-400 ml-[1px] -mb-[1px] ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}
            style={{ transitionDuration: `${cursorBlinkSpeed/2}ms` }}
          ></span>
        </span>
      </div>
      {isCompleted && (
        <div className="text-xs text-green-500 mt-1">STATUS: VERIFICATION_COMPLETE</div>
      )}
    </div>
  );
};

export default TypewriterEffect; 