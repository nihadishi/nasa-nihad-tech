'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Text, useTexture } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Earth() {
  const earthRef = useRef();
  
  // Load Earth texture - using a high-quality Earth texture from a public CDN
  // This uses NASA's Blue Marble texture in equirectangular projection
  const [earthTexture, earthBump, earthSpecular] = useTexture([
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useEffect(() => {
    // Slow rotation
    const animate = () => {
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.0005;
      }
    };
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <group>
      {/* Main Earth sphere with texture */}
      <Sphere ref={earthRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          map={earthTexture || null}
          normalMap={earthBump || null}
          roughnessMap={earthSpecular || null}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Atmospheric glow */}
      <Sphere args={[1.015, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

function ISS({ latitude, longitude }) {
  // Convert lat/lon to 3D position
  const phi = (latitude * Math.PI) / 180;
  const theta = ((longitude + 90) * Math.PI) / 180;
  const radius = 1.05; // Slightly above Earth surface
  
  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.cos(theta);
  const z = radius * Math.sin(theta) * Math.sin(phi);

  return (
    <group position={[x, y, z]}>
      <Sphere args={[0.02, 8, 8]}>
        <meshStandardMaterial color="#ffffff" emissive="#60a5fa" emissiveIntensity={0.5} />
      </Sphere>
      {/* Glow effect */}
      <Sphere args={[0.03, 8, 8]}>
        <meshStandardMaterial 
          color="#60a5fa" 
          transparent 
          opacity={0.3}
        />
      </Sphere>
    </group>
  );
}

function OrbitPath() {
  const points = [];
  const segments = 100;
  
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const radius = 1.05;
    const x = radius * Math.sin(theta);
    const y = radius * Math.cos(theta) * 0.2; // Inclined orbit
    const z = radius * Math.cos(theta) * 0.8;
    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(200));

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#60a5fa" opacity={0.3} transparent />
    </line>
  );
}

export default function ISS3DViewer({ issData }) {
  if (!issData) return null;

  return (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
      <h3 className="text-xl font-bold uppercase tracking-wider mb-4">3D ISS Tracker</h3>
      
      <div className="w-full h-[600px] bg-black">
        <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, -3, -5]} intensity={0.4} />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          
          <Earth />
          <OrbitPath />
          <ISS latitude={issData.latitude} longitude={issData.longitude} />
          
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            minDistance={2}
            maxDistance={8}
          />
        </Canvas>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-600"></div>
          <span className="font-bold uppercase">Earth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white ring-2 ring-blue-400"></div>
          <span className="font-bold uppercase">ISS Position</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-0.5 bg-blue-400 opacity-30"></div>
          <span className="font-bold uppercase">Orbit Path</span>
        </div>
      </div>
    </div>
  );
}

