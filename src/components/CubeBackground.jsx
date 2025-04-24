import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CubeBackground = ({ density = 10 }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Create cubes
    const cubes = [];
    const cubeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    
    // Different materials for variety
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x686de0, wireframe: true, transparent: true, opacity: 0.4 }),
      new THREE.MeshBasicMaterial({ color: 0x686de0, wireframe: true, transparent: true, opacity: 0.3 }),
      new THREE.MeshBasicMaterial({ color: 0xff6b6b, wireframe: true, transparent: true, opacity: 0.3 }),
    ];
    
    // Create a specific number of cubes based on density
    for (let i = 0; i < density; i++) {
      const material = materials[Math.floor(Math.random() * materials.length)];
      const cube = new THREE.Mesh(cubeGeometry, material);
      
      // Position randomly in view
      cube.position.x = (Math.random() - 0.5) * 10;
      cube.position.y = (Math.random() - 0.5) * 10;
      cube.position.z = (Math.random() - 0.5) * 10;
      
      // Random rotation speed
      cube.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        },
        floatSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.005
        }
      };
      
      scene.add(cube);
      cubes.push(cube);
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate and float each cube
      cubes.forEach(cube => {
        cube.rotation.x += cube.userData.rotationSpeed.x;
        cube.rotation.y += cube.userData.rotationSpeed.y;
        cube.rotation.z += cube.userData.rotationSpeed.z;
        
        cube.position.x += cube.userData.floatSpeed.x;
        cube.position.y += cube.userData.floatSpeed.y;
        cube.position.z += cube.userData.floatSpeed.z;
        
        // When cube goes too far, reset to opposite side
        if (Math.abs(cube.position.x) > 5) cube.userData.floatSpeed.x *= -1;
        if (Math.abs(cube.position.y) > 5) cube.userData.floatSpeed.y *= -1;
        if (Math.abs(cube.position.z) > 5) cube.userData.floatSpeed.z *= -1;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // Remove all objects from the scene
      while(scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
      }
      // Dispose of geometries and materials
      cubeGeometry.dispose();
      materials.forEach(material => material.dispose());
      // Dispose of renderer
      renderer.dispose();
    };
  }, [density]);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default CubeBackground; 