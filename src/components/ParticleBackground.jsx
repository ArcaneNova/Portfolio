import { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Particle config
    const particlesArray = [];
    const numberOfParticles = 100;
    
    // Mouse position tracking
    const mouse = {
      x: null,
      y: null,
      radius: 150
    };
    
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });
    
    // Create particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.color = `rgba(104, 109, 224, ${Math.random() * 0.5 + 0.2})`;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      update() {
        // Check if particle is close to mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        
        // Max distance, past that the force is 0
        const maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        
        // If force is negative, set it to 0
        if (force < 0) force = 0;
        
        // Movement based on force
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;
        
        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Return to original position
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
        
        this.draw();
      }
    }
    
    // Initialize particles
    const init = () => {
      particlesArray.length = 0;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    init();
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Connect particles with lines if they're close enough
      const connectParticles = () => {
        for (let a = 0; a < particlesArray.length; a++) {
          for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
              const opacity = 1 - (distance / 120);
              ctx.strokeStyle = `rgba(104, 109, 224, ${opacity * 0.5})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
              ctx.stroke();
            }
          }
        }
      };
      
      connectParticles();
      
      particlesArray.forEach(particle => particle.update());
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
      });
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ParticleBackground; 