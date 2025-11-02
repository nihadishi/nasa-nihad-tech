'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text, Stars, useTexture } from '@react-three/drei';
import { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';

function Earth({ children }) {
  const earthGroupRef = useRef();
  
  const [earthTexture, earthBump, earthSpecular] = useTexture([
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
    'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useEffect(() => {
    const animate = () => {
      if (earthGroupRef.current) {
        // Rotate entire Earth group (Earth + satellites + orbits + observer) together
        earthGroupRef.current.rotation.y += 0.0005;
      }
    };
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={earthGroupRef}>
      <Sphere args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          map={earthTexture || null}
          normalMap={earthBump || null}
          roughnessMap={earthSpecular || null}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>
      
      <Sphere args={[1.015, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.01, 16, 100]} />
        <meshBasicMaterial color="#60a5fa" opacity={0.3} transparent />
      </mesh>
      
      {/* All children (satellites, observer, orbits) rotate with Earth */}
      {children}
    </group>
  );
}

function Satellite({ latitude, longitude, altitude = 0, name, color = '#ffffff' }) {
  // Convert lat/lon to 3D position matching Earth texture mapping
  // Standard geographic to 3D Cartesian (Y-up coordinate system)
  const latRad = (latitude * Math.PI) / 180;
  const lonRad = (longitude * Math.PI) / 180;
  // Convert altitude (meters) to relative scale (Earth radius = 6371 km)
  const radius = 1 + (altitude / 6371000);
  
  // Standard conversion: Y-up, X to 0° longitude, Z to 90° East
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = -radius * Math.cos(latRad) * Math.sin(lonRad);

  return (
    <group position={[x, y, z]}>
      <Sphere args={[0.015, 8, 8]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </Sphere>
      <Sphere args={[0.025, 8, 8]}>
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.3}
        />
      </Sphere>
      {name && (
        <Text
          position={[0, 0.05, 0]}
          fontSize={0.05}
          color={color}
          anchorX="center"
          anchorY="middle"
          maxWidth={0.5}
        >
          {name}
        </Text>
      )}
    </group>
  );
}

function OrbitPath({ positions }) {
  const orbitPoints = useMemo(() => {
    if (!positions || positions.length === 0) return [];
    
    return positions.map(pos => {
      // Convert lat/lon to 3D position matching Earth texture mapping
      // Standard geographic to 3D Cartesian (Y-up coordinate system)
      const latRad = (pos.satlatitude * Math.PI) / 180;
      const lonRad = (pos.satlongitude * Math.PI) / 180;
      const radius = 1 + (pos.sataltitude / 6371000);
      
      // Standard conversion: Y-up, X to 0° longitude, Z to 90° East
      return new THREE.Vector3(
        radius * Math.cos(latRad) * Math.cos(lonRad),
        radius * Math.sin(latRad),
        -radius * Math.cos(latRad) * Math.sin(lonRad)
      );
    });
  }, [positions]);

  if (orbitPoints.length === 0) return null;

  const geometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#60a5fa" opacity={0.5} transparent linewidth={2} />
    </line>
  );
}

function Observer({ latitude, longitude }) {
  // Convert lat/lon to 3D position matching Earth texture mapping
  // Standard geographic to 3D Cartesian (Y-up coordinate system)
  const latRad = (latitude * Math.PI) / 180;
  const lonRad = (longitude * Math.PI) / 180;
  const radius = 1.002; // Slightly above Earth surface
  
  // Standard conversion: Y-up, X to 0° longitude, Z to 90° East
  // For equirectangular texture mapping in Three.js
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = -radius * Math.cos(latRad) * Math.sin(lonRad);

  return (
    <group position={[x, y, z]}>
      <Sphere args={[0.02, 8, 8]}>
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
      </Sphere>
      <Sphere args={[0.03, 8, 8]}>
        <meshBasicMaterial 
          color="#00ff00" 
          transparent 
          opacity={0.4}
        />
      </Sphere>
      <Text
        position={[0, 0.05, 0]}
        fontSize={0.04}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        Observer
      </Text>
    </group>
  );
}

export default function N2YO3DViewer({ 
  positions = [], 
  observer = null,
  satellites = [],
  selectedSatellite = null 
}) {
  return (
    <div className="w-full h-[600px] bg-black rounded-lg overflow-hidden border-4 border-slate-700 dark:border-slate-600">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, -3, -5]} intensity={0.4} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        
        <Earth>
          {observer && (
            <Observer latitude={observer.lat} longitude={observer.lng} />
          )}
          
          {positions && positions.length > 0 && (
            <OrbitPath positions={positions} />
          )}
          
          {positions && positions.length > 0 && positions.map((pos, index) => (
            <Satellite
              key={index}
              latitude={pos.satlatitude}
              longitude={pos.satlongitude}
              altitude={pos.sataltitude}
              color={selectedSatellite && selectedSatellite.satid === pos.satid ? '#ff00ff' : '#ffffff'}
            />
          ))}
          
          {satellites && satellites.length > 0 && satellites.map((sat) => {
            // Handle both "above" endpoint format (satlat/satlng/satalt) and positions format
            const lat = sat.satlat !== undefined ? sat.satlat : sat.satlatitude;
            const lng = sat.satlng !== undefined ? sat.satlng : sat.satlongitude;
            const alt = sat.satalt !== undefined ? sat.satalt * 1000 : (sat.sataltitude || 0); // Convert km to meters if needed
            
            return (
              <Satellite
                key={sat.satid}
                latitude={lat}
                longitude={lng}
                altitude={alt}
                name={sat.satname}
                color="#ffff00"
              />
            );
          })}
          
          {selectedSatellite && selectedSatellite.positions && (
            <OrbitPath positions={selectedSatellite.positions} />
          )}
        </Earth>
        
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
  );
}

