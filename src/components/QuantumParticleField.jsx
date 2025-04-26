import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

const QuantumParticleField = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Camera with cinematic parameters
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    
    // Optimized renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create quantum field particles
    const particleCount = Math.min(10000, window.innerWidth * 5);
    const particleGeometry = new THREE.BufferGeometry();
    
    // Generate particle positions and attributes
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const randomness = new Float32Array(particleCount * 3);
    
    // Customize particle arrangement into a network structure
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Create branching network pattern
      const radius = Math.random() * 60;
      const randomizeFactor = Math.random();
      const branch = (i % 4);
      
      // Depending on branch, set different spatial distributions
      let x, y, z;
      
      if (branch === 0) {
        // Horizontal branch
        x = Math.sin(randomizeFactor * Math.PI * 2) * radius;
        y = Math.cos(randomizeFactor * Math.PI * 2) * (radius * 0.25);
        z = (Math.random() - 0.5) * 10;
      } else if (branch === 1) {
        // Vertical branch
        x = Math.sin(randomizeFactor * Math.PI * 2) * (radius * 0.25);
        y = Math.cos(randomizeFactor * Math.PI * 2) * radius;
        z = (Math.random() - 0.5) * 10;
      } else if (branch === 2) {
        // Spiral branch
        const spiralFactor = randomizeFactor * 10;
        x = Math.sin(spiralFactor) * (radius * 0.5);
        y = Math.cos(spiralFactor) * (radius * 0.5);
        z = (randomizeFactor - 0.5) * 20;
      } else {
        // Central cluster
        x = (Math.random() - 0.5) * 15;
        y = (Math.random() - 0.5) * 15;
        z = (Math.random() - 0.5) * 15;
      }
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      // Add movement randomness
      randomness[i3] = Math.random() * 2 - 1;
      randomness[i3 + 1] = Math.random() * 2 - 1;
      randomness[i3 + 2] = Math.random() * 2 - 1;
      
      // Use futuristic tech colors with sci-fi gradients
      const colorChoice = Math.floor(Math.random() * 5);
      if (colorChoice === 0) {
        // Cyan
        colors[i3] = 0;
        colors[i3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorChoice === 1) {
        // Blue
        colors[i3] = 0;
        colors[i3 + 1] = 0.5 + Math.random() * 0.3;
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorChoice === 2) {
        // Purple
        colors[i3] = 0.5 + Math.random() * 0.3;
        colors[i3 + 1] = 0.2 + Math.random() * 0.2;
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorChoice === 3) {
        // Electric blue
        colors[i3] = 0.1 + Math.random() * 0.1;
        colors[i3 + 1] = 0.6 + Math.random() * 0.3;
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        // White/light blue hints
        colors[i3] = 0.8 + Math.random() * 0.2;
        colors[i3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i3 + 2] = 1.0;
      }
      
      // Vary particle sizes for depth
      scales[i] = Math.random() * 1.5 + 0.5;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    particleGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
    
    // Advanced particle shader
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float aScale;
        attribute vec3 aColor;
        attribute vec3 aRandomness;
        
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSize;
        
        varying vec3 vColor;
        
        void main() {
          // Position with time-based movement
          vec3 pos = position;
          
          // Add subtle wave motion
          float angle = uTime * 0.2;
          
          // Add animated displacement based on randomness
          pos.x += sin(angle + position.z * 0.25) * aRandomness.x * 2.0;
          pos.y += cos(angle + position.x * 0.25) * aRandomness.y * 2.0;
          pos.z += sin(angle * 0.4 + position.y * 0.25) * aRandomness.z * 2.0;
          
          // Project to screen space
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Calculate point size based on depth and scale
          gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z) * uPixelRatio;
          gl_Position = projectionMatrix * mvPosition;
          
          // Pass color to fragment shader
          vColor = aColor;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create smooth circular particle with soft edge
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          if (distanceToCenter > 0.5) discard;
          
          // Add glow falloff
          float strength = 1.0 - distanceToCenter * 2.0;
          strength = pow(strength, 1.5);
          
          vec3 color = vColor;
          
          // Add slight color variation based on strength
          color += vec3(strength * 0.2);
          
          gl_FragColor = vec4(color, strength * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 15 }
      }
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // Add connection lines between particles
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x4299e0,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });
    
    // Create connections between particles that are close to each other
    const connectParticles = () => {
      // This is computationally expensive, so we only do it once at init
      const linesGeometry = new THREE.BufferGeometry();
      const linesPositions = [];
      
      // Sample some particles to connect (not all, for performance)
      const step = Math.floor(particleCount / 200);
      
      for (let i = 0; i < particleCount; i += step) {
        const i3 = i * 3;
        const v1 = new THREE.Vector3(
          positions[i3],
          positions[i3 + 1],
          positions[i3 + 2]
        );
        
        // Find nearby particles
        for (let j = i + step; j < particleCount; j += step) {
          const j3 = j * 3;
          const v2 = new THREE.Vector3(
            positions[j3],
            positions[j3 + 1],
            positions[j3 + 2]
          );
          
          // Only connect if they're close enough
          if (v1.distanceTo(v2) < 15) {
            linesPositions.push(v1.x, v1.y, v1.z);
            linesPositions.push(v2.x, v2.y, v2.z);
          }
        }
      }
      
      linesGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linesPositions, 3)
      );
      
      const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
      scene.add(lines);
      
      return lines;
    };
    
    const lines = connectParticles();
    
    // Add minimal ambient light for depth
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Responsive sizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animate with optimized rendering
    let animationId = null;
    const clock = new THREE.Clock();
    let lastRenderTime = 0;
    const renderInterval = 1 / 30; // 30fps target for performance
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const currentTime = clock.getElapsedTime();
      const deltaTime = currentTime - lastRenderTime;
      
      // Throttle rendering for performance
      if (deltaTime > renderInterval) {
        lastRenderTime = currentTime - (deltaTime % renderInterval);
        
        // Update uniforms
        particleMaterial.uniforms.uTime.value = currentTime;
        
        // Add subtle camera movement
        camera.position.x = Math.sin(currentTime * 0.1) * 3;
        camera.position.y = Math.cos(currentTime * 0.1) * 3;
        camera.lookAt(0, 0, 0);
        
        // Animate opacity of connection lines
        linesMaterial.opacity = 0.04 + Math.sin(currentTime * 0.5) * 0.03;
        
        // Render scene
        renderer.render(scene, camera);
      }
    };
    
    animate();
    
    // Interactive particle response to mouse
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleMouseMove = (event) => {
      // Convert mouse position to normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Use raycaster to find particles that intersect with the mouse
      raycaster.setFromCamera(mouse, camera);
      
      // Adjust the camera position slightly based on mouse for parallax
      gsap.to(camera.position, {
        x: mouse.x * 5,
        y: mouse.y * 5,
        duration: 2,
        ease: "power2.out"
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up resources on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0" 
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: -9998
      }}
    />
  );
};

export default QuantumParticleField; 