import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

const HolographicBackground = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true  // Make background transparent
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Grid shader
    const gridSize = 100;
    const gridDivisions = 50;
    
    // Custom shader for holographic grid
    const gridMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00d4ff) },
        uOpacity: { value: 0.15 },
        uIntensity: { value: 1.5 }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          // Add slight wave effect
          pos.z += sin(pos.x * 5.0 + uTime) * 0.05;
          pos.z += cos(pos.y * 5.0 + uTime) * 0.05;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uOpacity;
        uniform float uIntensity;
        
        float gridPattern(vec2 uv, float size) {
          vec2 grid = abs(fract(uv * size - 0.5) - 0.5) / fwidth(uv * size);
          float line = min(grid.x, grid.y);
          return 1.0 - min(line, 1.0);
        }
        
        void main() {
          // Base grid
          float grid1 = gridPattern(vUv, 40.0) * 0.5;
          float grid2 = gridPattern(vUv, 8.0) * 0.25;
          
          // Add glow to edges
          float edgeX = pow(abs(vUv.x - 0.5) * 2.0, 2.0);
          float edgeY = pow(abs(vUv.y - 0.5) * 2.0, 2.0);
          float edgeGlow = (edgeX + edgeY) * 0.5;
          
          // Add time-based oscillation
          float oscillation = sin(uTime * 0.2) * 0.5 + 0.5;
          
          // Combine effects
          float intensity = (grid1 + grid2) * (1.0 - edgeGlow * 0.8) * uIntensity;
          intensity *= (0.8 + oscillation * 0.2);
          
          gl_FragColor = vec4(uColor, intensity * uOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    // Create grid plane
    const gridPlane = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions);
    const grid = new THREE.Mesh(gridPlane, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -1.5;
    scene.add(grid);
    
    // Add cosmic particles
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Position particles in a sphere
      const radius = 10 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i3 + 2] = radius * Math.cos(phi);
      
      particleSizes[i] = Math.random() * 2 + 0.5;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    // Particle shader
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00d4ff) },
        uPixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        varying float vSize;
        uniform float uTime;
        uniform float uPixelRatio;
        
        void main() {
          vSize = size;
          // Slow rotation
          float time = uTime * 0.05;
          vec3 pos = position;
          
          // Rotate positions slightly over time
          float cosTime = cos(time);
          float sinTime = sin(time);
          
          float x = pos.x * cosTime - pos.z * sinTime;
          float z = pos.x * sinTime + pos.z * cosTime;
          
          vec4 mvPosition = modelViewMatrix * vec4(x, pos.y, z, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * uPixelRatio;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vSize;
        uniform vec3 uColor;
        
        void main() {
          // Create a circular particle
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          if (distanceToCenter > 0.5) discard;
          
          // Soften the edges
          float alpha = smoothstep(0.5, 0.4, distanceToCenter);
          gl_FragColor = vec4(uColor, alpha * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Holographic scanline effect
    const scanlineGeometry = new THREE.PlaneGeometry(gridSize, 0.2);
    const scanlineMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00d4ff) }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        uniform float uTime;
        
        void main() {
          float intensity = sin(vUv.x * 20.0 + uTime * 2.0) * 0.5 + 0.5;
          intensity *= (1.0 - abs(vUv.y - 0.5) * 2.0);
          
          gl_FragColor = vec4(uColor, intensity * 0.7);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    
    const scanline = new THREE.Mesh(scanlineGeometry, scanlineMaterial);
    scanline.rotation.x = -Math.PI / 2;
    scanline.position.y = -1.48; // Slightly above grid
    scene.add(scanline);
    
    // Post-processing
    const composer = new EffectComposer(renderer);
    
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8,  // strength
      0.3,  // radius
      0.7   // threshold
    );
    composer.addPass(bloomPass);
    
    // Chromatic aberration effect
    const chromaticAberrationShader = {
      uniforms: {
        tDiffuse: { value: null },
        uOffset: { value: new THREE.Vector2(0.0015, 0.0015) }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 uOffset;
        varying vec2 vUv;
        
        void main() {
          vec4 cr = texture2D(tDiffuse, vUv + uOffset);
          vec4 cg = texture2D(tDiffuse, vUv);
          vec4 cb = texture2D(tDiffuse, vUv - uOffset);
          
          gl_FragColor = vec4(cr.r, cg.g, cb.b, (cr.a + cg.a + cb.a) / 3.0);
        }
      `
    };
    
    const chromaticAberrationPass = new ShaderPass(chromaticAberrationShader);
    composer.addPass(chromaticAberrationPass);
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      composer.setSize(width, height);
      
      particleMaterial.uniforms.uPixelRatio.value = window.devicePixelRatio;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Handle mouse movement for parallax effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let animationFrameId;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      // Update uniforms
      gridMaterial.uniforms.uTime.value = elapsedTime;
      particleMaterial.uniforms.uTime.value = elapsedTime;
      scanlineMaterial.uniforms.uTime.value = elapsedTime;
      
      // Move scanline
      scanline.position.z = Math.sin(elapsedTime * 0.2) * gridSize * 0.4;
      
      // Rotate stars
      particles.rotation.y = elapsedTime * 0.05;
      
      // Smooth parallax effect on camera
      targetX = mouseX * 0.1;
      targetY = mouseY * 0.1;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
      
      // Render
      composer.render();
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      
      // Dispose resources
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
      
      composer.dispose();
      renderer.dispose();
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
};

export default HolographicBackground; 