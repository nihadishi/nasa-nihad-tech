'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text, Stars, useTexture } from '@react-three/drei';
import { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';

function Earth() {
  const earthRef = useRef();
  
  // Load Earth texture - using a high-quality Earth texture from a public CDN
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
      
      {/* Equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.01, 16, 100]} />
        <meshBasicMaterial color="#60a5fa" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

function OrbitalPlane({ inclination, raan, eccentricity, semiMajorAxis, argOfPerigee }) {
  // Convert to radians
  const incRad = (inclination * Math.PI) / 180;
  const raanRad = (raan * Math.PI) / 180;
  const argPerigeeRad = (argOfPerigee * Math.PI) / 180;
  
  // Scale factor (Earth radius = 1 in our model, real Earth = 6371 km)
  const scale = semiMajorAxis / 6371;
  
  // Generate orbital ellipse points
  const orbitPoints = useMemo(() => {
    const points = [];
    const numPoints = 120;
    
    for (let i = 0; i <= numPoints; i++) {
      const theta = (i / numPoints) * 2 * Math.PI;
      
      // Calculate position in orbital plane (2D ellipse)
      const r = (scale * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(theta));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      
      // Rotate by argument of perigee
      const x1 = x * Math.cos(argPerigeeRad) - y * Math.sin(argPerigeeRad);
      const y1 = x * Math.sin(argPerigeeRad) + y * Math.cos(argPerigeeRad);
      
      // Rotate by inclination
      const x2 = x1;
      const y2 = y1 * Math.cos(incRad);
      const z2 = y1 * Math.sin(incRad);
      
      // Rotate by RAAN
      const x3 = x2 * Math.cos(raanRad) - y2 * Math.sin(raanRad);
      const y3 = x2 * Math.sin(raanRad) + y2 * Math.cos(raanRad);
      const z3 = z2;
      
      points.push([x3, y3, z3]);
    }
    
    return points;
  }, [inclination, raan, eccentricity, semiMajorAxis, argOfPerigee, scale, incRad, raanRad, argPerigeeRad]);
  
  // Calculate satellite position at mean anomaly
  const satellitePosition = useMemo(() => {
    if (orbitPoints.length > 0) {
      // For simplicity, use a point along the orbit
      const index = Math.floor(orbitPoints.length / 4);
      return orbitPoints[index];
    }
    return [0, 0, 0];
  }, [orbitPoints]);
  
  // Calculate apogee and perigee positions
  const apogeePos = useMemo(() => {
    const r = scale * (1 + eccentricity);
    const x = r * Math.cos(argPerigeeRad + Math.PI);
    const y = r * Math.sin(argPerigeeRad + Math.PI);
    
    const x2 = x * Math.cos(incRad);
    const y2 = y * Math.cos(incRad);
    const z2 = y * Math.sin(incRad);
    
    const x3 = x2 * Math.cos(raanRad) - y2 * Math.sin(raanRad);
    const y3 = x2 * Math.sin(raanRad) + y2 * Math.cos(raanRad);
    const z3 = z2;
    
    return [x3, y3, z3];
  }, [scale, eccentricity, argPerigeeRad, incRad, raanRad]);
  
  const perigeePos = useMemo(() => {
    const r = scale * (1 - eccentricity);
    const x = r * Math.cos(argPerigeeRad);
    const y = r * Math.sin(argPerigeeRad);
    
    const x2 = x * Math.cos(incRad);
    const y2 = y * Math.cos(incRad);
    const z2 = y * Math.sin(incRad);
    
    const x3 = x2 * Math.cos(raanRad) - y2 * Math.sin(raanRad);
    const y3 = x2 * Math.sin(raanRad) + y2 * Math.cos(raanRad);
    const z3 = z2;
    
    return [x3, y3, z3];
  }, [scale, eccentricity, argPerigeeRad, incRad, raanRad]);
  
  return (
    <group>
      {/* Orbital path */}
      <Line
        points={orbitPoints}
        color="#fbbf24"
        lineWidth={3}
      />
      
      {/* Satellite */}
      <Sphere args={[0.08, 16, 16]} position={satellitePosition}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </Sphere>
      
      {/* Apogee marker */}
      <Sphere args={[0.05, 8, 8]} position={apogeePos}>
        <meshStandardMaterial color="#dc2626" />
      </Sphere>
      <Text
        position={[apogeePos[0], apogeePos[1] + 0.2, apogeePos[2]]}
        fontSize={0.15}
        color="#dc2626"
        anchorX="center"
        anchorY="middle"
      >
        Apogee
      </Text>
      
      {/* Perigee marker */}
      <Sphere args={[0.05, 8, 8]} position={perigeePos}>
        <meshStandardMaterial color="#16a34a" />
      </Sphere>
      <Text
        position={[perigeePos[0], perigeePos[1] + 0.2, perigeePos[2]]}
        fontSize={0.15}
        color="#16a34a"
        anchorX="center"
        anchorY="middle"
      >
        Perigee
      </Text>
      
      {/* Line from Earth to satellite */}
      <Line
        points={[[0, 0, 0], satellitePosition]}
        color="#64748b"
        lineWidth={1}
        dashed
        dashScale={20}
        dashSize={0.5}
        gapSize={0.5}
      />
    </group>
  );
}

function parseTLE(line1, line2) {
  // Parse TLE Line 1
  const epochYear = line1.substring(18, 20);
  const epochDay = parseFloat(line1.substring(20, 32));
  
  // Parse TLE Line 2
  const inclination = parseFloat(line2.substring(8, 16));
  const raan = parseFloat(line2.substring(17, 25));
  const eccentricity = parseFloat('0.' + line2.substring(26, 33));
  const argOfPerigee = parseFloat(line2.substring(34, 42));
  const meanAnomaly = parseFloat(line2.substring(43, 51));
  const meanMotion = parseFloat(line2.substring(52, 63));
  
  // Calculate orbital period and semi-major axis
  const orbitalPeriod = 1440 / meanMotion; // in minutes
  const semiMajorAxis = Math.pow((orbitalPeriod * 60 / (2 * Math.PI)) ** 2 * 398600.4418, 1/3); // km
  
  return {
    inclination,
    raan,
    eccentricity,
    argOfPerigee,
    meanAnomaly,
    meanMotion,
    semiMajorAxis
  };
}

export default function TLE3DViewer({ tleData }) {
  if (!tleData || !tleData.line1 || !tleData.line2) {
    return (
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
        <p className="text-sm text-black/60 dark:text-white/60">No TLE data to visualize</p>
      </div>
    );
  }
  
  const orbitalParams = parseTLE(tleData.line1, tleData.line2);
  
  return (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold uppercase tracking-wider mb-2">
          3D Orbital Model
        </h3>
        <p className="text-xs text-black/60 dark:text-white/60">
          Drag to rotate • Scroll to zoom • Right-click to pan
        </p>
      </div>
      
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="font-bold uppercase">Earth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-yellow-500"></div>
          <span className="font-bold uppercase">Orbit Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span className="font-bold uppercase">Satellite</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-700"></div>
          <span className="font-bold uppercase">Apogee</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-600"></div>
          <span className="font-bold uppercase">Perigee</span>
        </div>
      </div>
      
      {/* Orbital Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-xs border-2 border-slate-700 dark:border-slate-600 p-3 bg-slate-50 dark:bg-slate-950">
        <div>
          <p className="text-black/60 dark:text-white/60">Inclination</p>
          <p className="font-bold">{orbitalParams.inclination.toFixed(2)}°</p>
        </div>
        <div>
          <p className="text-black/60 dark:text-white/60">Eccentricity</p>
          <p className="font-bold">{orbitalParams.eccentricity.toFixed(6)}</p>
        </div>
        <div>
          <p className="text-black/60 dark:text-white/60">Period</p>
          <p className="font-bold">{(1440 / orbitalParams.meanMotion).toFixed(2)} min</p>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="w-full h-[600px] border-2 border-slate-700 dark:border-slate-600 bg-black">
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, -3, -5]} intensity={0.4} />
          
          {/* Stars background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Earth */}
          <Earth />
          
          {/* Orbital path and satellite */}
          <OrbitalPlane
            inclination={orbitalParams.inclination}
            raan={orbitalParams.raan}
            eccentricity={orbitalParams.eccentricity}
            semiMajorAxis={orbitalParams.semiMajorAxis}
            argOfPerigee={orbitalParams.argOfPerigee}
          />
          
          {/* Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            minDistance={2}
            maxDistance={15}
          />
        </Canvas>
      </div>
      
      {/* Info */}
      <div className="mt-4 text-xs text-black/60 dark:text-white/60">
        <p>
          <strong>Note:</strong> This is a simplified visualization of the orbital path calculated from TLE data. 
          The satellite position shown is representative. Earth radius is normalized to 1 unit.
        </p>
      </div>
    </div>
  );
}

