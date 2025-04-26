import React, { useEffect, useRef } from 'react';

const CircuitNetwork = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = Math.min(window.devicePixelRatio, 2);
    
    // Network properties - REDUCED node count for less visual distraction
    let nodes = [];
    let connections = [];
    const nodeCount = Math.min(60, Math.max(30, Math.floor(window.innerWidth / 25))); // Reduced node count significantly
    let mouse = { x: undefined, y: undefined, radius: 150 };
    
    // Simplified, more subtle color palette
    const colors = {
      node: {
        base: 'rgba(14, 165, 233, 0.4)',      // Sky blue with reduced opacity
        accent: 'rgba(34, 211, 238, 0.4)',    // Cyan with reduced opacity
        highlight: 'rgba(240, 249, 255, 0.6)', // Very light blue with reduced opacity
        pulse: 'rgba(2, 132, 199, 0.3)',     // Darker blue for pulse with reduced opacity
        major: 'rgba(99, 102, 241, 0.4)',     // Indigo for major nodes with reduced opacity
        terminal: 'rgba(20, 184, 166, 0.4)'   // Teal for terminal nodes with reduced opacity
      },
      line: {
        base: 'rgba(12, 74, 110, 0.2)',      // Dark blue with reduced opacity
        highlight: 'rgba(14, 165, 233, 0.3)', // Sky blue with reduced opacity
        active: 'rgba(56, 189, 248, 0.3)'     // Light blue for active connections with reduced opacity
      },
      data: {
        base: 'rgba(34, 211, 238, 0.3)',      // Cyan with reduced opacity
        highlight: 'rgba(240, 249, 255, 0.4)', // Very light blue with reduced opacity
        special: 'rgba(251, 113, 133, 0.3)'    // Pink for special data packets with reduced opacity
      },
      background: 'rgba(2, 6, 23, 0.1)' // Very dark blue with even more transparency for trail effect
    };
    
    // Calculate distance between nodes
    const getDistance = (node1, node2) => {
      const dx = node1.x - node2.x;
      const dy = node1.y - node2.y;
      return Math.sqrt(dx * dx + dy * dy);
    };
    
    // Find closest nodes for connections - REDUCED connection count
    const findNearbyNodes = (sourceNode, count) => {
      return nodes
        .filter(node => node !== sourceNode)
        .sort((a, b) => {
          const distA = getDistance(sourceNode, a);
          const distB = getDistance(sourceNode, b);
          return distA - distB;
        })
        .slice(0, Math.min(2, count)); // Reduced max connections per node
    };
    
    // Node class with reduced animation intensity
    class Node {
      constructor(x, y, radius, type) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.radius = radius * 0.8; // Smaller radius
        this.type = type; // 'major', 'minor', 'terminal'
        this.color = this.type === 'major' ? colors.node.major : 
                    this.type === 'terminal' ? colors.node.terminal : 
                    colors.node.base;
        this.pulseRadius = 0;
        this.isPulsing = false;
        this.pulseOpacity = 0;
        this.pulseSpeed = 0.6 + Math.random() * 0.4; // Slower pulse
        this.glowing = false;
        this.glowIntensity = 0;
        this.vx = (Math.random() - 0.5) * 0.3; // Reduced movement speed
        this.vy = (Math.random() - 0.5) * 0.3; // Reduced movement speed
        this.friction = 0.98; // Increased friction for more stability
        this.active = Math.random() > 0.6; // Fewer active nodes initially
        this.blinkDuration = 100 + Math.random() * 200; // Longer blink cycles
        this.blinkTimer = Math.random() * this.blinkDuration;
        this.processing = Math.random() > 0.8; // Fewer processing nodes
        this.processingAngle = 0;
        // Reduced oscillation
        this.oscillation = {
          amplitude: 0.1 + Math.random() * 0.3, // Reduced amplitude
          angle: Math.random() * Math.PI * 2,
          speed: 0.005 + Math.random() * 0.01 // Slower oscillation
        };
      }
      
      update() {
        // Handle mouse interaction with reduced intensity
        if (mouse.x !== undefined && mouse.y !== undefined) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            this.glowing = true;
            this.glowIntensity = (1 - (distance / mouse.radius)) * 0.7; // Reduced glow intensity
            
            // Reduced repel effect
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius * 0.7; // Reduced force
            const forceFactor = this.type === 'major' ? 1 : 
                                this.type === 'terminal' ? 1.5 : 2;
            this.vx -= forceDirectionX * force * forceFactor;
            this.vy -= forceDirectionY * force * forceFactor;
          } else {
            this.glowing = false;
            this.glowIntensity = Math.max(0, this.glowIntensity - 0.03);
          }
        }
        
        // Apply velocity with improved friction
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Return to base position with reduced oscillation
        const dx = this.baseX - this.x;
        const dy = this.baseY - this.y;
        
        // Reduced oscillation
        this.oscillation.angle += this.oscillation.speed;
        const oscillationX = Math.cos(this.oscillation.angle) * this.oscillation.amplitude;
        const oscillationY = Math.sin(this.oscillation.angle) * this.oscillation.amplitude;
        
        this.x += dx * 0.03 + oscillationX; // Slower return to base
        this.y += dy * 0.03 + oscillationY; // Slower return to base
        
        // Less frequent blinking
        if (this.active) {
          this.blinkTimer--;
          if (this.blinkTimer <= 0) {
            this.active = Math.random() > 0.3;
            this.blinkTimer = this.blinkDuration;
          }
        } else {
          this.blinkTimer--;
          if (this.blinkTimer <= 0) {
            this.active = Math.random() > 0.7;
            this.blinkTimer = this.blinkDuration * 0.8;
          }
        }
        
        // Reduced pulse frequency and intensity
        if (this.isPulsing) {
          this.pulseRadius += this.pulseSpeed;
          this.pulseOpacity = Math.max(0, (1 - (this.pulseRadius / 60)) * 0.6); // Reduced opacity
          
          if (this.pulseRadius > 60) {
            this.isPulsing = false;
            this.pulseRadius = 0;
            this.pulseOpacity = 0;
          }
        } else if (Math.random() < 0.001 && (this.type === 'major' || this.type === 'terminal')) { // Reduced pulse chance
          this.isPulsing = true;
        }
        
        // Slower processing animation
        if (this.processing) {
          this.processingAngle += 0.02;
          if (this.processingAngle >= Math.PI * 2) {
            this.processingAngle = 0;
            // More likely to stop processing
            if (Math.random() > 0.5) {
              this.processing = false;
            }
          }
        } else if (Math.random() < 0.001) { // Reduced chance to start processing
          this.processing = true;
        }
      }
      
      draw() {
        // Draw pulse effect with enhanced glow
        if (this.isPulsing) {
          const pulseGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.pulseRadius
          );
          
          pulseGradient.addColorStop(0, `rgba(34, 211, 238, 0)`);
          pulseGradient.addColorStop(0.5, `rgba(34, 211, 238, ${this.pulseOpacity * 0.4})`);
          pulseGradient.addColorStop(1, `rgba(34, 211, 238, 0)`);
          
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.pulseRadius, 0, Math.PI * 2);
          ctx.fillStyle = pulseGradient;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 211, 238, ${this.pulseOpacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        
        // Draw base node
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Set color based on type, state and enhanced glowing effect
        if (this.glowing) {
          // Add glow effect with gradient for smoother appearance
          const glow = ctx.createRadialGradient(
            this.x, this.y, this.radius * 0.5,
            this.x, this.y, this.radius * 4
          );
          
          glow.addColorStop(0, `rgba(34, 211, 238, ${0.4 * this.glowIntensity})`);
          glow.addColorStop(0.7, `rgba(34, 211, 238, ${0.1 * this.glowIntensity})`);
          glow.addColorStop(1, 'rgba(34, 211, 238, 0)');
          
          ctx.fillStyle = glow;
          ctx.fill();
          
          // Draw the actual node on top with highlight color
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = colors.node.highlight;
        }
        
        // Terminal nodes have enhanced hollow center
        if (this.type === 'terminal') {
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
          );
          
          gradient.addColorStop(0, this.active ? 'rgba(20, 184, 166, 0.3)' : 'rgba(20, 184, 166, 0.1)');
          gradient.addColorStop(1, this.active ? colors.node.terminal : 'rgba(20, 184, 166, 0.7)');
          
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.strokeStyle = this.active ? colors.node.accent : colors.node.terminal;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          
          // Inner detail
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = this.active ? colors.node.accent : colors.node.terminal;
          ctx.fill();
        } 
        // Major nodes have fancy rendering with enhanced effects
        else if (this.type === 'major') {
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 1.2
          );
          
          gradient.addColorStop(0, this.active ? 'rgba(99, 102, 241, 0.9)' : 'rgba(99, 102, 241, 0.7)');
          gradient.addColorStop(1, this.active ? colors.node.major : 'rgba(99, 102, 241, 0.5)');
          
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Add rings with pulsing effect
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 1.4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(99, 102, 241, ${this.active ? 0.4 : 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(99, 102, 241, ${this.active ? 0.2 : 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          // Processing indicator (rotating segments) with enhanced appearance
          if (this.processing) {
            for (let i = 0; i < 3; i++) {
              const angle = this.processingAngle + (i * Math.PI * 2 / 3);
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.radius * 2.2, angle, angle + 0.7);
              ctx.strokeStyle = `rgba(240, 249, 255, ${this.active ? 0.6 : 0.4})`;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }
        } 
        // Minor nodes with enhanced gradient
        else {
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
          );
          
          gradient.addColorStop(0, this.active ? 'rgba(34, 211, 238, 0.9)' : 'rgba(14, 165, 233, 0.7)');
          gradient.addColorStop(1, this.active ? colors.node.accent : colors.node.base);
          
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
    }
    
    // Connection between nodes with enhanced visuals
    class Connection {
      constructor(startNode, endNode) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.width = 0.5; // Thinner lines
        this.maxWidth = Math.random() * 0.5 + 0.5; // Thinner max width
        this.active = Math.random() > 0.7; // Fewer active connections
        this.blink = Math.random() > 0.9; // Fewer blinking connections
        this.blinkSpeed = 0.05 + Math.random() * 0.05; // Slower blinking
        this.blinkState = 0;
        this.color = colors.line.base;
        this.dataPackets = [];
        this.showData = Math.random() > 0.9; // Fewer connections with data packets
        this.dataSpeed = 0.5 + Math.random() * 1; // Slower data packets
        this.lastPacketTime = 0;
        this.packetInterval = 3000 + Math.random() * 7000; // Longer intervals between packets
      }
      
      update(time) {
        // Randomly activate connections with improved probability
        if (!this.active) {
          const activationChance = this.isTrunk ? 0.002 : 
                                  this.color === 'terminal' ? 0.0015 : 0.001;
          if (Math.random() < activationChance) {
            this.active = true;
            this.progress = 0;
          }
        }
        
        // Update existing connection animation
        if (this.active) {
          this.progress += this.speed;
          
          // Create data packets with improved frequency
          const packetCreationChance = this.startNode.active && this.endNode.active ? 0.8 : 0.4;
          if (time - this.lastPacketTime > this.packetInterval && Math.random() < packetCreationChance) {
            // Special data packets for trunk connections
            const isSpecialPacket = this.isTrunk && Math.random() > 0.7;
            
            this.dataPackets.push({
              position: 0,
              speed: 0.01 + Math.random() * 0.02,
              size: isSpecialPacket ? 3 + Math.random() * 2 : 2 + Math.random() * 1.5,
              special: isSpecialPacket
            });
            this.lastPacketTime = time;
          }
          
          // Reset when done with improved logic
          if (this.progress >= 1) {
            // Different stay-active probabilities based on connection type
            const stayActiveChance = this.isTrunk ? 0.4 : 
                                   this.color === 'terminal' ? 0.3 : 0.2;
            this.active = Math.random() < stayActiveChance;
            this.progress = 0;
            
            // Potentially trigger pulse at end node with improved effect
            const pulseChance = this.isTrunk ? 0.5 : 
                             this.color === 'terminal' ? 0.4 : 0.3;
            if (Math.random() < pulseChance) {
              this.endNode.isPulsing = true;
              this.endNode.pulseRadius = 0;
            }
          }
        }
        
        // Update data packets
        for (let i = this.dataPackets.length - 1; i >= 0; i--) {
          const packet = this.dataPackets[i];
          packet.position += packet.speed;
          
          if (packet.position >= 1) {
            this.dataPackets.splice(i, 1);
          }
        }
      }
      
      draw() {
        const dx = this.endNode.x - this.startNode.x;
        const dy = this.endNode.y - this.startNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Don't draw if too far apart (optimized)
        if (distance > 250) return;
        
        // Calculate line opacity based on distance with smoother falloff
        const opacity = Math.max(0, 1 - Math.pow(distance / 250, 2));
        
        // Get appropriate color based on connection type
        let baseColor, activeColor;
        switch(this.color) {
          case 'major':
            baseColor = `rgba(99, 102, 241, ${opacity * 0.6})`;
            activeColor = `rgba(99, 102, 241, ${opacity * 0.9})`;
            break;
          case 'terminal':
            baseColor = `rgba(20, 184, 166, ${opacity * 0.6})`;
            activeColor = `rgba(20, 184, 166, ${opacity * 0.9})`;
            break;
          default:
            baseColor = `rgba(12, 74, 110, ${opacity * 0.5})`;
            activeColor = `rgba(14, 165, 233, ${opacity * 0.8})`;
        }
        
        // Draw base connection line with gradient for better appearance
        ctx.beginPath();
        ctx.moveTo(this.startNode.x, this.startNode.y);
        ctx.lineTo(this.endNode.x, this.endNode.y);
        
        // Adjust line color based on activity
        if (this.startNode.active && this.endNode.active) {
          ctx.strokeStyle = activeColor;
        } else {
          ctx.strokeStyle = baseColor;
        }
        
        // Check if lineWidth is defined to avoid potential errors
        ctx.lineWidth = this.lineWidth || 1;
        ctx.stroke();
        
        // Draw active connection animation (glowing trail) with enhanced effect
        if (this.active) {
          const startX = this.startNode.x;
          const startY = this.startNode.y;
          const progressX = startX + dx * this.progress;
          const progressY = startY + dy * this.progress;
          
          // Check for NaN or Infinity values before creating gradient
          if (!isFinite(startX) || !isFinite(startY) || !isFinite(progressX) || !isFinite(progressY)) {
            // Skip drawing this part if coordinates are invalid
            return;
          }
          
          // Create gradient for animated part
          try {
            const gradient = ctx.createLinearGradient(
              startX, startY, progressX, progressY
            );
            
            gradient.addColorStop(0, `rgba(34, 211, 238, ${opacity * 0.7})`);
            gradient.addColorStop(1, `rgba(34, 211, 238, ${opacity})`);
            
            // Draw animated part
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(progressX, progressY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = (this.lineWidth || 1) + 1;
            ctx.stroke();
          } catch (error) {
            console.error("Error creating gradient:", error);
          }
        }
        
        // Draw data packets with enhanced visuals and error checking
        this.dataPackets.forEach(packet => {
          const packetX = this.startNode.x + dx * packet.position;
          const packetY = this.startNode.y + dy * packet.position;
          
          // Skip drawing packets with invalid coordinates
          if (!isFinite(packetX) || !isFinite(packetY)) {
            return;
          }
          
          try {
            // Create gradient for packet
            const packetGradient = ctx.createRadialGradient(
              packetX, packetY, 0,
              packetX, packetY, packet.size
            );
            
            if (packet.special) {
              packetGradient.addColorStop(0, 'rgba(251, 113, 133, 1)');
              packetGradient.addColorStop(0.6, 'rgba(251, 113, 133, 0.7)');
              packetGradient.addColorStop(1, 'rgba(251, 113, 133, 0)');
            } else {
              packetGradient.addColorStop(0, 'rgba(240, 249, 255, 1)');
              packetGradient.addColorStop(0.6, 'rgba(240, 249, 255, 0.7)');
              packetGradient.addColorStop(1, 'rgba(240, 249, 255, 0)');
            }
            
            ctx.beginPath();
            ctx.arc(packetX, packetY, packet.size, 0, Math.PI * 2);
            ctx.fillStyle = packetGradient;
            ctx.fill();
          } catch (error) {
            console.error("Error creating packet gradient:", error);
          }
        });
      }
    }
    
    // Initialize network with improved node distribution and error handling
    const initializeNetwork = () => {
      nodes = [];
      connections = [];
      
      try {
        // Create nodes with better distribution
        for (let i = 0; i < nodeCount; i++) {
          // Determine node type with better distribution
          let type = 'minor';
          let radius = 2;
          
          if (i < nodeCount * 0.08) {
            type = 'major';
            radius = 4;
          } else if (i >= nodeCount * 0.08 && i < nodeCount * 0.25) {
            type = 'terminal';
            radius = 3;
          }
          
          // Create node with random position but avoid edges
          const margin = 50;
          const x = margin + Math.random() * (window.innerWidth - margin * 2);
          const y = margin + Math.random() * (window.innerHeight - margin * 2);
          nodes.push(new Node(x, y, radius, type));
        }
        
        // Create connections between nearby nodes with improved logic
        for (let i = 0; i < nodes.length; i++) {
          // Different connection counts based on node type
          const connectionCount = nodes[i].type === 'major' ? 6 : 
                                nodes[i].type === 'terminal' ? 4 : 3;
          
          const nearbyNodes = findNearbyNodes(nodes[i], connectionCount + 3);
          
          // Connect to a subset of nearby nodes
          nearbyNodes.slice(0, connectionCount).forEach(node => {
            // Make sure connection doesn't already exist
            const connectionExists = connections.some(conn => 
              (conn.startNode === nodes[i] && conn.endNode === node) || 
              (conn.startNode === node && conn.endNode === nodes[i])
            );
            
            if (!connectionExists) {
              connections.push(new Connection(nodes[i], node));
            }
          });
        }
        
        // Create network connections with additional safety
        const majorNodes = nodes.filter(node => node.type === 'major');
        if (majorNodes.length > 0) {
          for (let i = 0; i < majorNodes.length; i++) {
            const nextIndex = (i + 1) % majorNodes.length;
            connections.push(new Connection(majorNodes[i], majorNodes[nextIndex]));
            
            if (majorNodes.length > 3) {
              const crossIndex = (i + Math.floor(majorNodes.length / 2)) % majorNodes.length;
              if (Math.abs(i - crossIndex) > 1) {
                connections.push(new Connection(majorNodes[i], majorNodes[crossIndex]));
              }
            }
          }
        }
        
        // Connect terminal nodes with additional safety
        const terminalNodes = nodes.filter(node => node.type === 'terminal');
        for (let i = 0; i < terminalNodes.length; i += 2) {
          if (i + 1 < terminalNodes.length) {
            connections.push(new Connection(terminalNodes[i], terminalNodes[i + 1]));
          }
        }
      } catch (error) {
        console.error("Error initializing network:", error);
      }
    };
    
    // Handle window resize with proper initialization
    const handleResize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      
      // Reset nodes on resize
      initializeNetwork();
    };
    
    // Initialize the canvas and network
    handleResize();
    
    // Set up event listeners
    window.addEventListener('resize', handleResize);
    
    // Enhanced mouse interaction
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseOut = () => {
      mouse.x = undefined;
      mouse.y = undefined;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);
    
    // Animation loop with improved rendering
    let time = 0;
    let animationId;
    
    const animate = () => {
      // Clear with semi-transparent background for trail effect
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      time += 1;
      
      // Update and draw connections first (layer order)
      connections.forEach(connection => {
        connection.update(time);
        connection.draw();
      });
      
      // Update and draw nodes on top
      nodes.forEach(node => {
        node.update();
        node.draw();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute w-full h-full inset-0 z-0 opacity-40" // Reduced overall opacity for subtlety
    />
  );
};

export default CircuitNetwork; 