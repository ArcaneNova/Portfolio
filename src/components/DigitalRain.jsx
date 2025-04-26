import React, { useRef, useEffect } from 'react';

const DigitalRain = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Technical/binary characters
    const chars = '01010101010101101010101010101010001111000111アイウエオカキクケコサシスセソタチツテト1010010101010110010101';
    
    const streams = [];
    const streamCount = Math.round(canvas.width / 26); // Dynamic stream count based on width
    
    // Initialize streams
    for (let i = 0; i < streamCount; i++) {
      streams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * -1, // Start above canvas
        length: Math.floor(Math.random() * 20) + 5,
        speed: Math.random() * 2 + 1,
        characters: [],
        lastUpdate: 0,
        updateInterval: Math.random() * 500 + 100, // Time between character changes
        active: true,
      });
      
      // Generate initial characters for the stream
      for (let j = 0; j < streams[i].length; j++) {
        streams[i].characters.push(chars.charAt(Math.floor(Math.random() * chars.length)));
      }
    }
    
    const draw = () => {
      // Partially clear the canvas to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const currentTime = Date.now();
      
      // Draw each stream
      streams.forEach((stream, streamIndex) => {
        // Check if stream is active
        if (!stream.active) {
          // Randomly reactivate streams
          if (Math.random() < 0.002) {
            stream.active = true;
            stream.y = Math.random() * canvas.height * -1;
            stream.x = Math.random() * canvas.width;
            stream.speed = Math.random() * 2 + 1;
          }
          return;
        }
        
        // Draw each character in the stream
        for (let i = 0; i < stream.length; i++) {
          const y = stream.y - i * 20;
          
          // Skip if outside canvas
          if (y < -20 || y > canvas.height) continue;
          
          // Calculate character brightness (head is brightest)
          const brightness = i === 0 ? 1 : 1 - (i / stream.length);
          
          // Gradient colors - first character is white/cyan, rest fade to darker cyan
          if (i === 0) {
            ctx.fillStyle = `rgba(220, 255, 255, ${brightness})`;
          } else {
            ctx.fillStyle = `rgba(0, ${Math.floor(180 * brightness + 60)}, ${Math.floor(200 * brightness + 55)}, ${brightness * 0.8})`;
          }
          
          ctx.font = '20px monospace';
          ctx.fillText(stream.characters[i], stream.x, y);
          
          // Randomly change characters over time
          if (currentTime - stream.lastUpdate > stream.updateInterval) {
            if (Math.random() < 0.3) {
              stream.characters[i] = chars.charAt(Math.floor(Math.random() * chars.length));
            }
          }
        }
        
        // Update stream position
        stream.y += stream.speed;
        
        // Update last update time
        if (currentTime - stream.lastUpdate > stream.updateInterval) {
          stream.lastUpdate = currentTime;
        }
        
        // If stream is completely below canvas, reset or deactivate
        if (stream.y - stream.length * 20 > canvas.height) {
          if (Math.random() < 0.3) {
            // Deactivate this stream temporarily
            stream.active = false;
          } else {
            // Reset stream position
            stream.y = Math.random() * canvas.height * -1;
            
            // Occasionally change stream properties
            if (Math.random() < 0.3) {
              stream.x = Math.random() * canvas.width;
              stream.speed = Math.random() * 2 + 1;
              stream.length = Math.floor(Math.random() * 20) + 5;
              
              // Regenerate characters
              stream.characters = [];
              for (let j = 0; j < stream.length; j++) {
                stream.characters.push(chars.charAt(Math.floor(Math.random() * chars.length)));
              }
            }
          }
        }
      });
      
      // Randomly add new streams
      if (streams.length < streamCount && Math.random() < 0.05) {
        const newStream = {
          x: Math.random() * canvas.width,
          y: 0,
          length: Math.floor(Math.random() * 20) + 5,
          speed: Math.random() * 2 + 1,
          characters: [],
          lastUpdate: currentTime,
          updateInterval: Math.random() * 500 + 100,
          active: true,
        };
        
        for (let j = 0; j < newStream.length; j++) {
          newStream.characters.push(chars.charAt(Math.floor(Math.random() * chars.length)));
        }
        
        streams.push(newStream);
      }
      
      requestAnimationFrame(draw);
    };
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    const animationId = requestAnimationFrame(draw);
    
    // Cleanup
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
        zIndex: -9998
      }}
    />
  );
};

export default DigitalRain; 