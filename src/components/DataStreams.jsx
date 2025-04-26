import React, { useRef, useEffect } from 'react';

const DataStreams = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full screen with correct resolution
    const handleResize = () => {
      const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      
      // Reset chars on resize
      initializeStreams();
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Define tech-looking characters (mix of code symbols, letters, and numbers)
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>?/*-+!@#$%^&()~';
    
    // Set the font size and calculate the number of columns
    const fontSize = 14;
    let columns;
    let drops = []; // Array to store the Y position of each stream
    let streamLengths = []; // Length of each stream
    let streamSpeeds = []; // Speed of each drop
    let charSets = []; // Character set for each column
    
    // Initialize streams
    function initializeStreams() {
      columns = Math.floor(window.innerWidth / fontSize);
      drops = [];
      streamLengths = [];
      streamSpeeds = [];
      charSets = [];
      
      // Initialize each stream's position and properties
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100; // Start above the canvas at random positions
        streamLengths[i] = 5 + Math.floor(Math.random() * 15); // Random length between 5-20
        streamSpeeds[i] = 0.5 + Math.random() * 1.5; // Random speed
        
        // Assign a set of characters to each column for consistency
        const columnChars = [];
        for (let j = 0; j < streamLengths[i]; j++) {
          columnChars.push(characters.charAt(Math.floor(Math.random() * characters.length)));
        }
        charSets[i] = columnChars;
      }
    }
    
    initializeStreams();
    
    // Function to draw the streams
    function draw() {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Iterate through each column
      for (let i = 0; i < columns; i++) {
        // Skip some columns randomly to create sparse effect
        if (Math.random() < 0.005) {
          drops[i] = 0; // Reset a random stream
          
          // Assign new characters
          const columnChars = [];
          for (let j = 0; j < streamLengths[i]; j++) {
            columnChars.push(characters.charAt(Math.floor(Math.random() * characters.length)));
          }
          charSets[i] = columnChars;
        }
        
        // Draw characters in the stream
        for (let j = 0; j < streamLengths[i]; j++) {
          const y = drops[i] - j * fontSize;
          
          // Skip if above the canvas
          if (y < 0) continue;
          
          // Skip if below the canvas
          if (y > window.innerHeight) continue;
          
          // Vary the color: brighter at the head, fading towards the tail
          const alpha = (1 - j / streamLengths[i]) * 0.9;
          let r = 0;
          let g = Math.floor(150 + 105 * (1 - j / streamLengths[i]));
          let b = Math.floor(200 + 55 * (1 - j / streamLengths[i]));
          
          // Lead character is brightest
          if (j === 0) {
            r = 200;
            g = 255;
            b = 255;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
          } else {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          }
          
          // Set the font
          ctx.font = `${fontSize}px monospace`;
          
          // Randomly change some characters for dynamic effect
          if (Math.random() < 0.01) {
            charSets[i][j] = characters.charAt(Math.floor(Math.random() * characters.length));
          }
          
          // Draw the character
          ctx.fillText(charSets[i][j], i * fontSize, y);
        }
        
        // Move the stream down
        drops[i] += streamSpeeds[i];
        
        // Reset the stream if it's gone past the bottom with some randomness
        if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.99) {
          drops[i] = Math.random() * -100;
          streamSpeeds[i] = 0.5 + Math.random() * 1.5; // Randomize speed again
        }
      }
      
      requestAnimationFrame(draw);
    }
    
    const animationId = requestAnimationFrame(draw);
    
    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 bg-transparent"
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: -9997
      }}
    />
  );
};

export default DataStreams; 