import React, { useRef, useEffect } from 'react';

const TechParticlesGrid = ({ count = 120 }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    
    // Mouse tracking for interactive effects
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    
    // Particle system
    let particles = [];
    let connections = [];
    const maxParticles = window.innerWidth < 768 ? Math.min(60, count) : count;
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
      
      // Initialize some data packets
      for (let i = 0; i < maxParticles / 10; i++) {
        const particle = particles[Math.floor(Math.random() * particles.length)];
        particle.hasPacket = true;
      }
    };
    
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
    
    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Function to update connections
    const updateConnections = () => {
      // Remove inactive connections
      connections = connections.filter(connection => connection.active);
      
      // Create new connections
      for (let i = 0; i < particles.length; i++) {
        const particle1 = particles[i];
        
        // Skip if not active
        if (!particle1.active) continue;
        
        for (let j = i + 1; j < particles.length; j++) {
          const particle2 = particles[j];
          
          // Skip if not active
          if (!particle2.active) continue;
          
          // Calculate distance
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connect if within range and not already connected
          if (distance < connectionDistance) {
            // Check if connection already exists
            const connectionExists = connections.some(
              conn => (conn.start === particle1 && conn.end === particle2) || 
                     (conn.start === particle2 && conn.end === particle1)
            );
            
            if (!connectionExists && Math.random() > 0.95) { // Random chance to create connection
              connections.push(new Connection(particle1, particle2));
            }
          }
        }
      }
    };
    
    // Draw grid pattern
    const drawGrid = (time) => {
      const gridSize = 40;
      const gridOffsetX = -(targetMouseX % gridSize);
      const gridOffsetY = -(targetMouseY % gridSize);
      
      // Smooth mouse following
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;
      
      // Draw grid lines
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = gridOffsetX; x < window.innerWidth; x += gridSize) {
        // Calculate distance to mouse X to determine if it's a highlight line
        const distanceX = Math.abs(x - mouseX);
        const isHighlight = distanceX < gridSize / 2;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, window.innerHeight);
        ctx.strokeStyle = isHighlight ? colors.gridHighlight : colors.grid;
        ctx.globalAlpha = isHighlight ? 0.3 : 0.15;
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = gridOffsetY; y < window.innerHeight; y += gridSize) {
        // Calculate distance to mouse Y to determine if it's a highlight line
        const distanceY = Math.abs(y - mouseY);
        const isHighlight = distanceY < gridSize / 2;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(window.innerWidth, y);
        ctx.strokeStyle = isHighlight ? colors.gridHighlight : colors.grid;
        ctx.globalAlpha = isHighlight ? 0.3 : 0.15;
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
    };
    
    // Main render loop
    const render = () => {
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(15, 14, 23, 0.1)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Draw grid background
      drawGrid();
      
      // Update and draw connections
      updateConnections();
      for (const connection of connections) {
        connection.update();
        connection.draw(ctx, mouseX, mouseY);
      }
      
      // Update and draw particles
      for (const particle of particles) {
        particle.update();
        particle.draw(ctx, mouseX, mouseY);
      }
      
      // Spawn new particles to replace inactive ones
      if (particles.length < maxParticles) {
        particles.push(new Particle());
      }
      
      // Request next frame
      requestAnimationFrame(render);
    };
    
    // Start animation
    initializeParticles();
    render();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [count]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default TechParticlesGrid; 