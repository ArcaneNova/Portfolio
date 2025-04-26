import React, { useRef, useEffect } from 'react';

const TechGalaxy = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up canvas dimensions with high DPI support
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Color palette - purples, teals, and pinks with dark background
    const colors = {
      background: '#0a0919', // Very dark blue/purple
      stars: [
        '#ffffff', // White
        '#d1d7ff', // Light blue
        '#ffcad4', // Light pink
        '#b8c0ff'  // Light purple
      ],
      nebula: [
        'rgba(189, 147, 249, 0.3)', // Purple
        'rgba(80, 250, 123, 0.3)',  // Green
        'rgba(255, 121, 198, 0.3)', // Pink
        'rgba(139, 233, 253, 0.3)'  // Cyan
      ],
      tech: [
        '#ff79c6', // Pink
        '#8be9fd', // Cyan
        '#50fa7b', // Green
        '#bd93f9'  // Purple
      ]
    };
    
    // Mouse position for interaction
    let mouseX = undefined;
    let mouseY = undefined;
    let targetX = 0;
    let targetY = 0;
    
    // Star class to represent background stars
    class Star {
      constructor(fast = false) {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * (fast ? 2 : 1) + (fast ? 1 : 0.1);
        this.color = colors.stars[Math.floor(Math.random() * colors.stars.length)];
        this.speed = fast ? (Math.random() * 0.05 + 0.05) : (Math.random() * 0.01 + 0.01);
        this.blinkSpeed = Math.random() * 0.01 + 0.005;
        this.brightness = Math.random();
        this.maxBrightness = Math.random() * 0.3 + 0.7;
        this.blinkDirection = Math.random() > 0.5 ? 1 : -1;
      }
      
      update(offsetX, offsetY) {
        // Parallax movement relative to mouse or automatic drift
        if (mouseX !== undefined) {
          this.x += (offsetX * this.speed);
          this.y += (offsetY * this.speed);
        } else {
          this.x += this.speed * 0.2;
          this.y -= this.speed * 0.1;
        }
        
        // Wrap around edges
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
        
        // Twinkling effect
        this.brightness += this.blinkDirection * this.blinkSpeed;
        if (this.brightness >= this.maxBrightness || this.brightness <= 0.3) {
          this.blinkDirection *= -1;
        }
      }
      
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Apply brightness to color
        const alpha = this.brightness;
        if (this.size > 1) {
          // Larger stars have glow
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
          );
          
          gradient.addColorStop(0, this.color);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.globalAlpha = alpha;
          ctx.fill();
          
          // Draw the core
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        } else {
          ctx.fillStyle = this.color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }
        
        ctx.globalAlpha = 1;
      }
    }
    
    // Nebula cloud class
    class NebulaCloud {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 200 + 100;
        this.color = colors.nebula[Math.floor(Math.random() * colors.nebula.length)];
        this.speed = Math.random() * 0.001 + 0.0005;
        this.angle = Math.random() * Math.PI * 2;
        this.glowAmount = Math.random() * 0.3 + 0.2;
        this.life = Math.random() * 200 + 200;
        this.vertices = [];
        
        // Generate cloud shape
        const vertexCount = Math.floor(Math.random() * 5) + 5;
        for (let i = 0; i < vertexCount; i++) {
          const angle = (i / vertexCount) * Math.PI * 2;
          const distance = this.size * (0.5 + Math.random() * 0.5);
          
          this.vertices.push({
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            pulseFactor: Math.random() * 0.2 + 0.9,
            pulseSpeed: Math.random() * 0.01 + 0.005
          });
        }
      }
      
      update(offsetX, offsetY) {
        // Slow drift movement
        this.x += Math.sin(this.angle) * this.speed * 2;
        this.y += Math.cos(this.angle) * this.speed;
        
        // Very subtle parallax effect
        if (mouseX !== undefined) {
          this.x += offsetX * this.speed * 0.5;
          this.y += offsetY * this.speed * 0.5;
        }
        
        // Pulse vertices for organic movement
        for (let vertex of this.vertices) {
          vertex.pulseFactor += vertex.pulseSpeed;
          if (vertex.pulseFactor > 1.1 || vertex.pulseFactor < 0.9) {
            vertex.pulseSpeed *= -1;
          }
        }
        
        // Reduce life
        this.life -= 0.05;
        
        // Wraparound check
        if (this.x < -this.size) this.x = window.innerWidth + this.size;
        if (this.x > window.innerWidth + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = window.innerHeight + this.size;
        if (this.y > window.innerHeight + this.size) this.y = -this.size;
        
        return this.life > 0;
      }
      
      draw(ctx) {
        if (this.vertices.length < 3) return;
        
        // Draw cloud
        ctx.beginPath();
        
        const fadeEdgeFactor = Math.min(1, this.life / 100);
        
        // Calculate first point
        const firstVertex = this.vertices[0];
        const startX = this.x + firstVertex.x * firstVertex.pulseFactor;
        const startY = this.y + firstVertex.y * firstVertex.pulseFactor;
        
        ctx.moveTo(startX, startY);
        
        // Connect the vertices with curves for smooth shape
        for (let i = 1; i <= this.vertices.length; i++) {
          const currentVertex = this.vertices[i % this.vertices.length];
          const nextVertex = this.vertices[(i + 1) % this.vertices.length];
          
          const currentX = this.x + currentVertex.x * currentVertex.pulseFactor;
          const currentY = this.y + currentVertex.y * currentVertex.pulseFactor;
          
          if (nextVertex) {
            const nextX = this.x + nextVertex.x * nextVertex.pulseFactor;
            const nextY = this.y + nextVertex.y * nextVertex.pulseFactor;
            
            const controlX = (currentX + nextX) / 2;
            const controlY = (currentY + nextY) / 2;
            
            ctx.quadraticCurveTo(currentX, currentY, controlX, controlY);
          } else {
            ctx.lineTo(currentX, currentY);
          }
        }
        
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.glowAmount * fadeEdgeFactor;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Tech element for circuit-like shapes and tech iconography
    class TechElement {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 40 + 20;
        this.color = colors.tech[Math.floor(Math.random() * colors.tech.length)];
        this.speed = Math.random() * 0.4 + 0.2;
        this.life = Math.random() * 100 + 100;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1);
        this.type = Math.floor(Math.random() * 4); // Different tech shape types
        this.pulseSpeed = Math.random() * 0.05 + 0.02;
        this.pulseAmount = 0;
      }
      
      update(offsetX, offsetY) {
        // Movement
        if (mouseX !== undefined) {
          this.x += offsetX * this.speed * 0.01;
          this.y += offsetY * this.speed * 0.01;
        }
        
        // Slow drift
        this.x += Math.cos(this.angle) * this.speed * 0.1;
        this.y += Math.sin(this.angle) * this.speed * 0.1;
        
        // Rotation
        this.angle += this.rotationSpeed;
        
        // Pulse effect
        this.pulseAmount += this.pulseSpeed;
        if (this.pulseAmount > Math.PI * 2) {
          this.pulseAmount = 0;
        }
        
        // Reduce life
        this.life -= 0.2;
        
        // Check if out of bounds
        if (this.x < -this.size || this.x > window.innerWidth + this.size ||
            this.y < -this.size || this.y > window.innerHeight + this.size ||
            this.life <= 0) {
          this.reset();
        }
        
        return true;
      }
      
      draw(ctx) {
        const pulseFactor = 1 + Math.sin(this.pulseAmount) * 0.2;
        const fadeEdgeFactor = Math.min(1, this.life / 20);
        const displaySize = this.size * pulseFactor;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = fadeEdgeFactor * 0.7;
        
        // Draw different tech shapes based on type
        switch(this.type) {
          // Circuit board pattern
          case 0:
            ctx.beginPath();
            ctx.moveTo(-displaySize/2, -displaySize/2);
            ctx.lineTo(displaySize/2, -displaySize/2);
            ctx.lineTo(displaySize/2, displaySize/2);
            ctx.lineTo(-displaySize/2, displaySize/2);
            ctx.closePath();
            
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Add circuit lines
            ctx.beginPath();
            ctx.moveTo(-displaySize/2, 0);
            ctx.lineTo(displaySize/2, 0);
            ctx.moveTo(0, -displaySize/2);
            ctx.lineTo(0, displaySize/2);
            ctx.moveTo(-displaySize/4, -displaySize/2);
            ctx.lineTo(-displaySize/4, -displaySize/4);
            ctx.lineTo(displaySize/4, -displaySize/4);
            ctx.lineTo(displaySize/4, displaySize/4);
            ctx.lineTo(displaySize/2, displaySize/4);
            ctx.stroke();
            
            // Add nodes
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(-displaySize/4, -displaySize/4, 3, 0, Math.PI * 2);
            ctx.arc(displaySize/4, -displaySize/4, 3, 0, Math.PI * 2);
            ctx.arc(displaySize/4, displaySize/4, 3, 0, Math.PI * 2);
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fill();
            break;
            
          // Hexagon tech shape
          case 1:
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = (i / 6) * Math.PI * 2;
              const x = Math.cos(angle) * displaySize/2;
              const y = Math.sin(angle) * displaySize/2;
              
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.closePath();
            
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Inner details
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
              const angle = (i / 3) * Math.PI * 2;
              const x = Math.cos(angle) * displaySize/4;
              const y = Math.sin(angle) * displaySize/4;
              
              ctx.moveTo(0, 0);
              ctx.lineTo(x, y);
            }
            ctx.stroke();
            
            // Center node
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            break;
            
          // Tech rune or symbol
          case 2:
            ctx.beginPath();
            ctx.moveTo(-displaySize/3, -displaySize/2);
            ctx.lineTo(displaySize/3, -displaySize/2);
            ctx.lineTo(displaySize/2, 0);
            ctx.lineTo(displaySize/3, displaySize/2);
            ctx.lineTo(-displaySize/3, displaySize/2);
            ctx.lineTo(-displaySize/2, 0);
            ctx.closePath();
            
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Inner details
            ctx.beginPath();
            ctx.moveTo(-displaySize/3, 0);
            ctx.lineTo(displaySize/3, 0);
            ctx.moveTo(0, -displaySize/3);
            ctx.lineTo(0, displaySize/3);
            ctx.stroke();
            
            // Add highlight
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, displaySize);
            gradient.addColorStop(0, `${this.color}50`);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fill();
            break;
            
          // Data node
          case 3:
            // Circle with spinning arcs
            ctx.beginPath();
            ctx.arc(0, 0, displaySize/2, 0, Math.PI * 2);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Spinning arcs
            const arcCount = 3;
            for (let i = 0; i < arcCount; i++) {
              const arcOffset = (i / arcCount) * Math.PI * 2 + this.angle * 2;
              ctx.beginPath();
              ctx.arc(0, 0, displaySize/2, arcOffset, arcOffset + Math.PI/2);
              ctx.lineWidth = 3;
              ctx.stroke();
            }
            
            // Inner circle
            ctx.beginPath();
            ctx.arc(0, 0, displaySize/4, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}40`;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Center dot
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            break;
        }
        
        ctx.restore();
        ctx.globalAlpha = 1;
      }
    }
    
    // Initialize objects
    const stars = [];
    const fastStars = [];
    const nebulaClouds = [];
    const techElements = [];
    
    // Generate stars (more numerous)
    for (let i = 0; i < 300; i++) {
      stars.push(new Star(false));
    }
    
    // Generate some faster-moving, larger stars
    for (let i = 0; i < 50; i++) {
      fastStars.push(new Star(true));
    }
    
    // Generate nebula clouds
    for (let i = 0; i < 10; i++) {
      nebulaClouds.push(new NebulaCloud());
    }
    
    // Generate tech elements
    for (let i = 0; i < 15; i++) {
      techElements.push(new TechElement());
    }
    
    // Mouse interaction
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      targetX = (mouseX - window.innerWidth / 2) * -0.01;
      targetY = (mouseY - window.innerHeight / 2) * -0.01;
    };
    
    const handleMouseLeave = () => {
      mouseX = undefined;
      mouseY = undefined;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Animation
    let currentOffsetX = 0;
    let currentOffsetY = 0;
    let animationId;
    
    const animate = () => {
      // Smoothly update offset based on mouse position
      if (mouseX !== undefined) {
        currentOffsetX += (targetX - currentOffsetX) * 0.05;
        currentOffsetY += (targetY - currentOffsetY) * 0.05;
      } else {
        // Auto movement when no mouse
        currentOffsetX = Math.sin(Date.now() * 0.0001) * 0.5;
        currentOffsetY = Math.cos(Date.now() * 0.0001) * 0.5;
      }
      
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
      gradient.addColorStop(0, colors.background);
      gradient.addColorStop(1, '#0f0035');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Update and draw nebula clouds (behind stars)
      for (let i = nebulaClouds.length - 1; i >= 0; i--) {
        const cloud = nebulaClouds[i];
        if (!cloud.update(currentOffsetX, currentOffsetY)) {
          nebulaClouds.splice(i, 1);
          nebulaClouds.push(new NebulaCloud());
        } else {
          cloud.draw(ctx);
        }
      }
      
      // Update and draw regular stars
      for (const star of stars) {
        star.update(currentOffsetX, currentOffsetY);
        star.draw(ctx);
      }
      
      // Update and draw fast stars (on top of regular stars)
      for (const star of fastStars) {
        star.update(currentOffsetX * 2, currentOffsetY * 2);
        star.draw(ctx);
      }
      
      // Update and draw tech elements
      for (const element of techElements) {
        element.update(currentOffsetX, currentOffsetY);
        element.draw(ctx);
      }
      
      // Add new nebula cloud occasionally
      if (Math.random() < 0.002) {
        nebulaClouds.push(new NebulaCloud());
      }
      
      // Random tech element pulse effect
      if (Math.random() < 0.01 && techElements.length < 25) {
        techElements.push(new TechElement());
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0"
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: -9999
      }}
    />
  );
};

export default TechGalaxy; 