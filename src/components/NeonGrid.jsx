import React, { useRef, useEffect } from 'react';

const NeonGrid = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    
    // Set canvas to full screen and handle resolution
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Set up the drawing context
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
    };
    
    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Track mouse position for interactive grid
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    
    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation parameters
    const gridSpacing = 80;
    const perspectiveStrength = 0.3;
    let time = 0;
    
    // Main render loop
    const render = () => {
      // Update time for animations
      time += 0.006;
      
      // Smooth mouse tracking
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      
      // Clear canvas for redraw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate grid perspective point (based on mouse)
      const perspectiveOriginX = mouseX;
      const perspectiveOriginY = mouseY;
      
      // Draw horizontal lines
      for (let y = -gridSpacing; y <= canvas.height + gridSpacing; y += gridSpacing) {
        ctx.beginPath();
        
        // Apply sinusoidal wave effect to horizontal lines
        for (let x = 0; x <= canvas.width; x += 1) {
          // Calculate perspective distortion
          const distanceY = y - perspectiveOriginY;
          const distanceX = x - perspectiveOriginX;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          
          // Calculate wave effect based on distance and time
          const waveAmplitude = Math.min(15, distance / 50);
          const frequencyY = 0.02;
          const frequencyTime = 3;
          
          // Apply wave and perspective distortion
          const distortion = Math.sin(distance * frequencyY + time * frequencyTime) * waveAmplitude;
          const perspectiveOffset = distanceY * perspectiveStrength * (distanceX / canvas.width);
          
          // Combine effects
          const finalY = y + distortion + perspectiveOffset;
          
          if (x === 0) {
            ctx.moveTo(x, finalY);
          } else {
            ctx.lineTo(x, finalY);
          }
        }
        
        // Set color with gradient opacity based on distance from center
        const distanceFromCenter = Math.abs(y - canvas.height / 2) / (canvas.height / 2);
        const opacity = Math.max(0.05, 0.2 - distanceFromCenter * 0.15);
        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
        
        ctx.stroke();
      }
      
      // Draw vertical lines
      for (let x = -gridSpacing; x <= canvas.width + gridSpacing; x += gridSpacing) {
        ctx.beginPath();
        
        // Apply sinusoidal wave effect to vertical lines
        for (let y = 0; y <= canvas.height; y += 1) {
          // Calculate perspective distortion
          const distanceX = x - perspectiveOriginX;
          const distanceY = y - perspectiveOriginY;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          
          // Calculate wave effect based on distance and time
          const waveAmplitude = Math.min(15, distance / 50);
          const frequencyX = 0.02;
          const frequencyTime = 2.7;
          
          // Apply wave and perspective distortion
          const distortion = Math.sin(distance * frequencyX + time * frequencyTime) * waveAmplitude;
          const perspectiveOffset = distanceX * perspectiveStrength * (distanceY / canvas.height);
          
          // Combine effects
          const finalX = x + distortion + perspectiveOffset;
          
          if (y === 0) {
            ctx.moveTo(finalX, y);
          } else {
            ctx.lineTo(finalX, y);
          }
        }
        
        // Set color with gradient opacity based on distance from center
        const distanceFromCenter = Math.abs(x - canvas.width / 2) / (canvas.width / 2);
        const opacity = Math.max(0.05, 0.2 - distanceFromCenter * 0.15);
        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
        
        ctx.stroke();
      }
      
      // Draw highlight around mouse position
      const glowRadius = 150 + Math.sin(time * 2) * 50;
      const gradient = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, glowRadius
      );
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
      gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Continue animation
      requestAnimationFrame(render);
    };
    
    // Start animation loop
    const animationId = requestAnimationFrame(render);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
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

export default NeonGrid; 