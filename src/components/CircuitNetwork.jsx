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
    
    // Network properties
    let nodes = [];
    let connections = [];
    const nodeCount = Math.min(150, Math.max(70, Math.floor(window.innerWidth / 12)));
    let mouse = { x: undefined, y: undefined, radius: 180 };
    
    // Enhanced color palette (tech-focused with more vibrant colors)
    const colors = {
      node: {
        base: '#0ea5e9',      // Sky blue
        accent: '#22d3ee',    // Cyan
        highlight: '#f0f9ff', // Very light blue
        pulse: '#0284c7',     // Darker blue for pulse
        major: '#6366f1',     // Indigo for major nodes
        terminal: '#14b8a6'   // Teal for terminal nodes
      },
      line: {
        base: '#0c4a6e',      // Dark blue
        highlight: '#0ea5e9', // Sky blue
        active: '#38bdf8'     // Light blue for active connections
      },
      data: {
        base: '#22d3ee',      // Cyan
        highlight: '#f0f9ff', // Very light blue
        special: '#fb7185'    // Pink for special data packets
      },
      background: 'rgba(2, 6, 23, 0.2)' // Very dark blue with transparency for trail effect
    };
    
    // Calculate distance between nodes
    const getDistance = (node1, node2) => {
      const dx = node1.x - node2.x;
      const dy = node1.y - node2.y;
      return Math.sqrt(dx * dx + dy * dy);
    };
    
    // Find closest nodes for connections
    const findNearbyNodes = (sourceNode, count) => {
      return nodes
        .filter(node => node !== sourceNode)
        .sort((a, b) => {
          const distA = getDistance(sourceNode, a);
          const distB = getDistance(sourceNode, b);
          return distA - distB;
        })
        .slice(0, count);
    };
    
    // Node class with enhanced visuals
    class Node {
      constructor(x, y, radius, type) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.radius = radius;
        this.type = type; // 'major', 'minor', 'terminal'
        this.color = this.type === 'major' ? colors.node.major : 
                    this.type === 'terminal' ? colors.node.terminal : 
                    colors.node.base;
        this.pulseRadius = 0;
        this.isPulsing = false;
        this.pulseOpacity = 0;
        this.pulseSpeed = 0.8 + Math.random() * 0.6;
        this.glowing = false;
        this.glowIntensity = 0;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.friction = 0.96;
        this.active = Math.random() > 0.4;
        this.blinkDuration = 50 + Math.random() * 150;
        this.blinkTimer = Math.random() * this.blinkDuration;
        this.processing = Math.random() > 0.6;
        this.processingAngle = 0;
        // Add slight oscillation effect
        this.oscillation = {
          amplitude: 0.2 + Math.random() * 0.8,
          angle: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.02
        };
      }
      
      update() {
        // Handle mouse interaction
        if (mouse.x !== undefined && mouse.y !== undefined) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            this.glowing = true;
            this.glowIntensity = 1 - (distance / mouse.radius);
            
            // Repel from mouse with smoother effect
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const forceFactor = this.type === 'major' ? 1.5 : 
                                this.type === 'terminal' ? 2.5 : 3;
            this.vx -= forceDirectionX * force * forceFactor;
            this.vy -= forceDirectionY * force * forceFactor;
          } else {
            this.glowing = false;
            this.glowIntensity = Math.max(0, this.glowIntensity - 0.05);
          }
        }
        
        // Apply velocity with improved friction
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Return to base position with oscillation effect
        const dx = this.baseX - this.x;
        const dy = this.baseY - this.y;
        
        // Add oscillation
        this.oscillation.angle += this.oscillation.speed;
        const oscillationX = Math.cos(this.oscillation.angle) * this.oscillation.amplitude;
        const oscillationY = Math.sin(this.oscillation.angle) * this.oscillation.amplitude;
        
        this.x += dx * 0.05 + oscillationX;
        this.y += dy * 0.05 + oscillationY;
        
        // Handle blinking for active nodes with improved randomization
        if (this.active) {
          this.blinkTimer--;
          if (this.blinkTimer <= 0) {
            this.active = Math.random() > 0.25;
            this.blinkTimer = this.blinkDuration;
          }
        } else {
          this.blinkTimer--;
          if (this.blinkTimer <= 0) {
            this.active = Math.random() > 0.6;
            this.blinkTimer = this.blinkDuration * 0.8;
          }
        }
        
        // Handle pulse animation with enhanced effect
        if (this.isPulsing) {
          this.pulseRadius += this.pulseSpeed;
          this.pulseOpacity = Math.max(0, 1 - (this.pulseRadius / 60));
          
          if (this.pulseRadius > 60) {
            this.isPulsing = false;
            this.pulseRadius = 0;
            this.pulseOpacity = 0;
          }
        } else if (Math.random() < 0.002 && (this.type === 'major' || this.type === 'terminal')) {
          this.isPulsing = true;
        }
        
        // Update processing animation with variable speed
        if (this.processing) {
          this.processingAngle += 0.03 + Math.random() * 0.02;
          if (this.processingAngle >= Math.PI * 2) {
            this.processingAngle = 0;
            // Randomly stop or continue processing
            if (Math.random() > 0.7) {
              this.processing = false;
            }
          }
        } else if (Math.random() < 0.002) {
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
        this.active = false;
        this.progress = 0;
        this.speed = 0.02 + Math.random() * 0.04;
        this.dataPackets = [];
        this.lastPacketTime = 0;
        this.packetInterval = 40 + Math.random() * 200;
        this.lineWidth = 1;
        
        // Special connections between different node types
        if (startNode.type === 'major' && endNode.type === 'major') {
          this.lineWidth = 2;
          this.isTrunk = true;
          this.color = 'major';
        } else if (startNode.type === 'terminal' || endNode.type === 'terminal') {
          this.lineWidth = 1.5;
          this.isTrunk = false;
          this.color = 'terminal';
        } else {
          this.isTrunk = false;
          this.color = 'normal';
        }
        
        // Higher activation chance for major connections
        if (this.isTrunk) {
          this.active = Math.random() > 0.5;
        }
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
        
        // Trunk connections are thicker
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        
        // Draw active connection animation (glowing trail) with enhanced effect
        if (this.active) {
          const startX = this.startNode.x;
          const startY = this.startNode.y;
          const progressX = startX + dx * this.progress;
          const progressY = startY + dy * this.progress;
          
          // Create gradient for animated part
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
          ctx.lineWidth = this.lineWidth + 1;
          ctx.stroke();
        }
        
        // Draw data packets with enhanced visuals
        this.dataPackets.forEach(packet => {
          const packetX = this.startNode.x + dx * packet.position;
          const packetY = this.startNode.y + dy * packet.position;
          
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
        });
      }
    }
    
    // Initialize network with improved node distribution
    const initializeNetwork = () => {
      nodes = [];
      connections = [];
      
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
      
      // Create a network backbone between major nodes
      const majorNodes = nodes.filter(node => node.type === 'major');
      for (let i = 0; i < majorNodes.length; i++) {
        const nextIndex = (i + 1) % majorNodes.length;
        connections.push(new Connection(majorNodes[i], majorNodes[nextIndex]));
        
        // Add some cross-connections for a more complex network
        if (majorNodes.length > 3) {
          const crossIndex = (i + Math.floor(majorNodes.length / 2)) % majorNodes.length;
          if (Math.abs(i - crossIndex) > 1) {
            connections.push(new Connection(majorNodes[i], majorNodes[crossIndex]));
          }
        }
      }
      
      // Connect some terminal nodes directly to create interesting paths
      const terminalNodes = nodes.filter(node => node.type === 'terminal');
      for (let i = 0; i < terminalNodes.length; i += 2) {
        if (i + 1 < terminalNodes.length) {
          connections.push(new Connection(terminalNodes[i], terminalNodes[i + 1]));
        }
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
      className="fixed inset-0 bg-slate-950"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -2,
        display: 'block'
      }}
    />
  );
};

export default CircuitNetwork; 