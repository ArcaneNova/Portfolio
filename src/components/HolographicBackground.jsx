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
    
    // Renderer setup with appropriate pixel ratio limits for performance
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    // Limit pixel ratio for better performance
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Neural network node visualization (advanced grid)
    const createNeuralGrid = () => {
      // Grid shader with enhanced visuals
      const gridSize = 120;
      const gridDivisions = 40;
      
      // Custom shader for neural network grid
      const gridMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(0x4a00e0) },
          uColor2: { value: new THREE.Color(0x0084ff) },
          uOpacity: { value: 0.12 },
          uIntensity: { value: 1.2 }
        },
        vertexShader: `
          varying vec2 vUv;
          uniform float uTime;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Add subtle wave effects
            float wave = sin(pos.x * 3.0 + uTime * 0.2) * cos(pos.y * 2.0 + uTime * 0.2) * 0.05;
            pos.z += wave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform float uTime;
          uniform float uOpacity;
          uniform float uIntensity;
          
          float gridPattern(vec2 uv, float size) {
            vec2 grid = abs(fract(uv * size - 0.5) - 0.5) / fwidth(uv * size);
            float line = min(grid.x, grid.y);
            return 1.0 - min(line, 1.0);
          }
          
          void main() {
            // Base grid - primary
            float grid1 = gridPattern(vUv, 40.0) * 0.4;
            // Secondary grid - finer detail
            float grid2 = gridPattern(vUv, 8.0) * 0.2;
            
            // Glow effects for edges
            float edgeDist = max(
              abs(vUv.x - 0.5) * 2.0,
              abs(vUv.y - 0.5) * 2.0
            );
            float edgeGlow = pow(edgeDist, 1.5) * 0.5;
            
            // Pulse effect based on time
            float pulse = (sin(uTime * 0.2) * 0.5 + 0.5) * 0.2 + 0.8;
            
            // Final intensity calculation
            float intensity = (grid1 + grid2) * (1.0 - edgeGlow) * pulse * uIntensity;
            
            // Color gradient based on position
            vec3 color = mix(uColor1, uColor2, vUv.y);
            
            gl_FragColor = vec4(color, intensity * uOpacity);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      
      const gridPlane = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions);
      const grid = new THREE.Mesh(gridPlane, gridMaterial);
      grid.rotation.x = -Math.PI / 2;
      grid.position.y = -2;
      scene.add(grid);
      
      return gridMaterial;
    };
    
    // Digital circuit pattern effect
    const createCircuitLines = () => {
      const linesGeometry = new THREE.BufferGeometry();
      const linesCount = 60;
      const positions = new Float32Array(linesCount * 6); // 3 points per vertex, 2 vertices per line
      const colors = new Float32Array(linesCount * 6); // RGB for each vertex
      
      for (let i = 0; i < linesCount; i++) {
        const i6 = i * 6;
        
        // Generate random circuit-like lines
        const x1 = (Math.random() - 0.5) * 30;
        const y1 = (Math.random() - 0.5) * 30;
        const z1 = (Math.random() - 0.5) * 10;
        
        // Second point is either horizontal or vertical from first (circuit-like)
        const isHorizontal = Math.random() > 0.5;
        const length = Math.random() * 5 + 2;
        
        const x2 = isHorizontal ? x1 + length : x1;
        const y2 = isHorizontal ? y1 : y1 + length;
        const z2 = z1;
        
        // Line start
        positions[i6] = x1;
        positions[i6 + 1] = y1;
        positions[i6 + 2] = z1;
        
        // Line end
        positions[i6 + 3] = x2;
        positions[i6 + 4] = y2;
        positions[i6 + 5] = z2;
        
        // Set color (cyan to blue gradient)
        const colorValue1 = Math.random() * 0.3 + 0.7; // Brightness variation
        colors[i6] = 0; // R
        colors[i6 + 1] = Math.random() * 0.5 + 0.5; // G
        colors[i6 + 2] = colorValue1; // B
        
        colors[i6 + 3] = 0; // R
        colors[i6 + 4] = Math.random() * 0.5 + 0.5; // G
        colors[i6 + 5] = colorValue1; // B
      }
      
      linesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      linesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const linesMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      });
      
      const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
      scene.add(lines);
      
      return lines;
    };
    
    // Create data nodes at circuit intersections
    const createDataNodes = () => {
      const nodeCount = 40;
      const nodeGeometry = new THREE.BufferGeometry();
      const nodePositions = new Float32Array(nodeCount * 3);
      const nodeSizes = new Float32Array(nodeCount);
      const nodeColors = new Float32Array(nodeCount * 3);
      
      for (let i = 0; i < nodeCount; i++) {
        const i3 = i * 3;
        
        // Position nodes in 3D space
        nodePositions[i3] = (Math.random() - 0.5) * 30;
        nodePositions[i3 + 1] = (Math.random() - 0.5) * 30;
        nodePositions[i3 + 2] = (Math.random() - 0.5) * 10;
        
        // Vary sizes
        nodeSizes[i] = Math.random() * 2 + 0.5;
        
        // Assign colors (blue-cyan palette)
        nodeColors[i3] = 0; // R
        nodeColors[i3 + 1] = Math.random() * 0.7 + 0.3; // G
        nodeColors[i3 + 2] = Math.random() * 0.3 + 0.7; // B
      }
      
      nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
      nodeGeometry.setAttribute('size', new THREE.BufferAttribute(nodeSizes, 1));
      nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
      
      const nodeMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: pixelRatio }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vSize;
          uniform float uTime;
          uniform float uPixelRatio;
          
          void main() {
            vSize = size;
            vColor = color;
            
            // Subtle movement based on time
            vec3 pos = position;
            pos.x += sin(uTime * 0.5 + position.z) * 0.2;
            pos.y += cos(uTime * 0.3 + position.x) * 0.2;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (200.0 / -mvPosition.z) * uPixelRatio;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vSize;
          
          void main() {
            // Create a circular point with soft edge
            float distToCenter = length(gl_PointCoord - vec2(0.5));
            if (distToCenter > 0.5) discard;
            
            // Soften edges and add glow
            float strength = 1.0 - (distToCenter * 2.0);
            strength = pow(strength, 1.5);
            
            // Apply color with glow effect
            gl_FragColor = vec4(vColor, strength * 0.7);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
      scene.add(nodes);
      
      return nodeMaterial;
    };
    
    // Add subtle technological ambient particles
    const createAmbientParticles = () => {
      const particleCount = 200;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleSizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Disperse particles within a spherical volume
        const radius = 20 + Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i3 + 2] = radius * Math.cos(phi);
        
        // Small particles for background effect
        particleSizes[i] = Math.random() * 1 + 0.2;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
      
      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x0084ff) },
          uPixelRatio: { value: pixelRatio }
        },
        vertexShader: `
          attribute float size;
          varying float vSize;
          uniform float uTime;
          uniform float uPixelRatio;
          
          void main() {
            vSize = size;
            
            // Slow rotation effect
            float angle = uTime * 0.05;
            mat3 rotationMatrix = mat3(
              cos(angle), 0, sin(angle),
              0, 1, 0,
              -sin(angle), 0, cos(angle)
            );
            
            vec3 pos = rotationMatrix * position;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z) * uPixelRatio;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying float vSize;
          uniform vec3 uColor;
          
          void main() {
            // Create soft particles
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            
            // Soften the edge
            float opacity = smoothstep(0.5, 0.2, d);
            gl_FragColor = vec4(uColor, opacity * 0.3);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      
      return particleMaterial;
    };
    
    // Add scanning effect plane
    const createScanEffect = () => {
      const scanGeometry = new THREE.PlaneGeometry(100, 0.5);
      const scanMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x4a00e0) }
        },
        vertexShader: `
          varying vec2 vUv;
          
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
            // Create scan line effect with pulse
            float intensity = sin(vUv.x * 10.0 + uTime * 3.0) * 0.5 + 0.5;
            intensity *= smoothstep(1.0, 0.0, abs(vUv.y - 0.5) * 2.0);
            
            gl_FragColor = vec4(uColor, intensity * 0.4);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      
      const scanPlane = new THREE.Mesh(scanGeometry, scanMaterial);
      scanPlane.rotation.x = -Math.PI / 2;
      scanPlane.position.y = -1.8; // Just above the grid
      scene.add(scanPlane);
      
      return { mesh: scanPlane, material: scanMaterial };
    };
    
    // Create all elements
    const gridMaterial = createNeuralGrid();
    const circuitLines = createCircuitLines();
    const nodeMaterial = createDataNodes();
    const particleMaterial = createAmbientParticles();
    const scanEffect = createScanEffect();
    
    // Set up post-processing
    const composer = new EffectComposer(renderer);
    
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Use moderate bloom settings for better performance
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.7,  // strength
      0.4,  // radius
      0.85   // threshold
    );
    composer.addPass(bloomPass);
    
    // Subtle chromatic aberration for futuristic feel
    const chromaticAberrationShader = {
      uniforms: {
        tDiffuse: { value: null },
        uOffset: { value: new THREE.Vector2(0.001, 0.001) }
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
    
    // Handle window resize efficiently
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      composer.setSize(width, height);
      
      // Update uniforms that depend on screen dimensions
      nodeMaterial.uniforms.uPixelRatio.value = pixelRatio;
      particleMaterial.uniforms.uPixelRatio.value = pixelRatio;
    };
    
    // Throttle resize for performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    });
    
    // Smooth mouse parallax effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation with performance optimization
    let animationFrameId;
    const clock = new THREE.Clock();
    let lastRenderTime = 0;
    const renderInterval = 1 / 30; // cap at 30fps for performance
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const currentTime = clock.getElapsedTime();
      const deltaTime = currentTime - lastRenderTime;
      
      // Throttle rendering for performance
      if (deltaTime > renderInterval) {
        lastRenderTime = currentTime - (deltaTime % renderInterval);
        
        // Update uniforms
        gridMaterial.uniforms.uTime.value = currentTime;
        nodeMaterial.uniforms.uTime.value = currentTime;
        particleMaterial.uniforms.uTime.value = currentTime;
        scanEffect.material.uniforms.uTime.value = currentTime;
        
        // Move scan plane
        scanEffect.mesh.position.z = Math.sin(currentTime * 0.15) * 40;
        
        // Rotate circuit lines
        circuitLines.rotation.y = currentTime * 0.02;
        
        // Smooth camera parallax
        targetX = mouseX * 0.2;
        targetY = mouseY * 0.2;
        camera.position.x += (targetX - camera.position.x) * 0.03;
        camera.position.y += (targetY - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);
        
        // Render scene with composer
        composer.render();
      }
    };
    
    animate();
    
    // Clean up resources on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (resizeTimeout) clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
      
      // Dispose all resources
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
      composer.dispose();
      
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
        zIndex: -9999
      }}
    />
  );
};

export default HolographicBackground; 