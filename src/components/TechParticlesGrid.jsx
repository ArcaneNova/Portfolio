import React, { useRef, useEffect } from 'react';

const TechParticlesGrid = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    
    // Set canvas to full screen and handle high DPI displays
    const handleResize = () => {
      const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      
      // Reset particles on resize
      initializeParticles();
      
      // Set the font once
      ctx.font = '12px monospace';
    };
    
    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Mouse tracking for interactive effects
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    
    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Particle system
    let particles = [];
    let connections = [];
    const maxParticles = window.innerWidth < 768 ? 60 : 120;
    const connectionDistance = window.innerWidth < 768 ? 150 : 200;
    
    // Tech symbols for node labels
    const techSymbols = [
      '01', '10', 'Δt', '∑', 'Ω', '∞', 'λ', 'π', 'φ', 'Ψ', '⚡', '◉', '⌘', '⚙', '✧'
    ];
    
    // Color theme - deep purples, blues, and cyans
    const colors = {
      background: '#0f0e17',
      grid: 'rgba(76, 0, 255, 0.15)',
      gridHighlight: 'rgba(128, 90, 213, 0.25)',
      particleBase: '#4361ee',
      particleHighlight: '#4cc9f0',
      connectionBase: 'rgba(67, 97, 238, 0.15)',
      connectionHighlight: 'rgba(76, 201, 240, 0.8)',
      symbolBase: '#f72585',
      symbolHighlight: '#7209b7'
    };
    
    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        // Position
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        
        // Velocity
        this.vx = Math.random() * 0.3 - 0.15;
        this.vy = Math.random() * 0.3 - 0.15;
        
        // Size
        this.size = Math.random() * 3 + 2;
        
        // Status
        this.active = true;
        
        // Random tech symbol
        this.symbol = techSymbols[Math.floor(Math.random() * techSymbols.length)];
        
        // Display status
        this.showSymbol = Math.random() > 0.8; // Only some particles show symbols
        this.pulse = Math.random() * 1000; // For size pulsation
        
        // Data packet
        this.hasPacket = false;
        this.packetColor = colors.symbolHighlight;
        this.packetDestination = null;
        this.packetProgress = 0;
      }
      
      update(time) {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary check with bounce
        if (this.x < 0 || this.x > window.innerWidth) {
          this.vx *= -1;
          this.x = Math.max(0, Math.min(this.x, window.innerWidth));
        }
        
        if (this.y < 0 || this.y > window.innerHeight) {
          this.vy *= -1;
          this.y = Math.max(0, Math.min(this.y, window.innerHeight));
        }
        
        // Update pulse for animation
        this.pulse += 0.01;
        
        // Update data packet
        if (this.hasPacket && this.packetDestination) {
          this.packetProgress += 0.02;
          if (this.packetProgress >= 1) {
            this.hasPacket = false;
            this.packetDestination.hasPacket = true;
            this.packetDestination.packetProgress = 0;
            this.packetDestination.packetDestination = this.findRandomNeighbor();
          }
        }
      }
      
      findRandomNeighbor() {
        // Find connections where this particle is a start
        const neighbors = connections.filter(c => c.start === this).map(c => c.end);
        if (neighbors.length === 0) return null;
        return neighbors[Math.floor(Math.random() * neighbors.length)];
      }
      
      draw(ctx, mouseX, mouseY) {
        // Calculate distance to mouse
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isNearMouse = distance < 150;
        
        // Base size with pulsation
        const pulseFactor = Math.sin(this.pulse) * 0.2 + 1;
        const displaySize = this.size * pulseFactor;
        
        // Draw particle
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, displaySize * 2
        );
        
        const baseColor = isNearMouse ? colors.particleHighlight : colors.particleBase;
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, displaySize * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw core
        ctx.beginPath();
        ctx.fillStyle = isNearMouse ? '#ffffff' : baseColor;
        ctx.arc(this.x, this.y, displaySize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw symbol if active
        if (this.showSymbol) {
          ctx.fillStyle = isNearMouse ? colors.symbolHighlight : colors.symbolBase;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.symbol, this.x, this.y);
        }
        
        // If has data packet, show it as a small dot
        if (this.hasPacket) {
          ctx.beginPath();
          ctx.fillStyle = this.packetColor;
          ctx.arc(this.x + displaySize * 1.5, this.y - displaySize * 1.5, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    // Connection class for lines between particles
    class Connection {
      constructor(start, end) {
        this.start = start;
        this.end = end;
        this.age = 0;
        this.maxAge = Math.random() * 50 + 50; // Random lifespan
        this.active = true;
      }
      
      update() {
        this.age++;
        if (this.age > this.maxAge) {
          this.active = false;
        }
      }
      
      draw(ctx, mouseX, mouseY) {
        const dx1 = this.start.x - mouseX;
        const dy1 = this.start.y - mouseY;
        const distanceStart = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        
        const dx2 = this.end.x - mouseX;
        const dy2 = this.end.y - mouseY;
        const distanceEnd = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        
        const isNearMouse = distanceStart < 150 || distanceEnd < 150;
        
        // Calculate opacity based on age
        const ageOpacity = Math.min(1, (this.maxAge - this.age) / this.maxAge);
        
        // Draw connection line
        ctx.beginPath();
        ctx.strokeStyle = isNearMouse ? 
          `rgba(76, 201, 240, ${ageOpacity * 0.8})` : 
          `rgba(67, 97, 238, ${ageOpacity * 0.15})`;
        ctx.lineWidth = isNearMouse ? 2 : 1;
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
        
        // If one of the particles has a data packet traveling to the other,
        // draw the packet in transit
        if (this.start.hasPacket && this.start.packetDestination === this.end) {
          const progress = this.start.packetProgress;
          const packetX = this.start.x + (this.end.x - this.start.x) * progress;
          const packetY = this.start.y + (this.end.y - this.start.y) * progress;
          
          ctx.beginPath();
          ctx.fillStyle = this.start.packetColor;
          ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    // Initialize particles
    const initializeParticles = () => {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
      }
      
      // Initialize some with data packets
      for (let i = 0; i < maxParticles / 10; i++) {
        const p = particles[Math.floor(Math.random() * particles.length)];
        p.hasPacket = true;
      }
      
      // Initially create connections
      connections = [];
      updateConnections();
    };
    
    // Function to update connections between particles
    const updateConnections = () => {
      // Remove inactive connections
      connections = connections.filter(c => c.active);
      
      // Check for new connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          
          // Calculate distance
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Create connection if close enough and not too many exist
          if (distance < connectionDistance && connections.length < maxParticles * 2) {
            // Check if this connection already exists
            const exists = connections.some(c => 
              (c.start === p1 && c.end === p2) || 
              (c.start === p2 && c.end === p1)
            );
            
            if (!exists && Math.random() > 0.7) {
              connections.push(new Connection(p1, p2));
              
              // If p1 has a packet but no destination, set p2 as destination
              if (p1.hasPacket && !p1.packetDestination) {
                p1.packetDestination = p2;
              }
            }
          }
        }
      }
    };
    
    // Initialize
    initializeParticles();
    
    // Draw the grid pattern
    const drawGrid = (time) => {
      const gridSize = 50;
      const gridOpacity = 0.15;
      
      // Calculate grid origin based on mouse (subtle parallax)
      const gridOffsetX = (mouseX - window.innerWidth / 2) * 0.02;
      const gridOffsetY = (mouseY - window.innerHeight / 2) * 0.02;
      
      // Draw vertical lines
      for (let x = 0; x < window.innerWidth; x += gridSize) {
        const offsetX = x + gridOffsetX % gridSize;
        
        // Distance from mouse for highlighting
        const distFromMouse = Math.abs(offsetX - mouseX);
        const isHighlighted = distFromMouse < 100;
        
        ctx.beginPath();
        ctx.strokeStyle = isHighlighted ? colors.gridHighlight : colors.grid;
        ctx.lineWidth = isHighlighted ? 2 : 1;
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, canvas.height);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y < window.innerHeight; y += gridSize) {
        const offsetY = y + gridOffsetY % gridSize;
        
        // Distance from mouse for highlighting
        const distFromMouse = Math.abs(offsetY - mouseY);
        const isHighlighted = distFromMouse < 100;
        
        ctx.beginPath();
        ctx.strokeStyle = isHighlighted ? colors.gridHighlight : colors.grid;
        ctx.lineWidth = isHighlighted ? 2 : 1;
        ctx.moveTo(0, offsetY);
        ctx.lineTo(canvas.width, offsetY);
        ctx.stroke();
      }
      
      // Draw radial highlight around mouse
      const gradient = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, 150
      );
      gradient.addColorStop(0, 'rgba(76, 201, 240, 0.1)');
      gradient.addColorStop(1, 'rgba(76, 201, 240, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 150, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Main render loop
    let time = 0;
    const render = () => {
      time += 0.01;
      
      // Smooth mouse tracking
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      
      // Clear canvas with background
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      drawGrid(time);
      
      // Update particles
      particles.forEach(p => p.update(time));
      
      // Update and manage connections
      if (time % 1 < 0.02) {
        updateConnections();
      }
      connections.forEach(c => c.update());
      
      // Draw connections first (behind particles)
      connections.forEach(c => c.draw(ctx, mouseX, mouseY));
      
      // Draw particles
      particles.forEach(p => p.draw(ctx, mouseX, mouseY));
      
      // Request next frame
      requestAnimationFrame(render);
    };
    
    // Start animation
    const animationId = requestAnimationFrame(render);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: -9999,
        background: '#0f0e17'
      }}
    />
  );
};

export default TechParticlesGrid; 