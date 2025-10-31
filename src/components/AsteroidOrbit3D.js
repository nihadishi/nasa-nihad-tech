"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, Line, Html, MeshDistortMaterial, useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Sun() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={3} distance={50} decay={1} />
      <Sphere ref={meshRef} args={[0.5, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#FFA500"
          emissive="#FF6B00"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </Sphere>
      <Sphere args={[0.55, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#FFA500" transparent opacity={0.2} />
      </Sphere>
    </group>
  );
}

function Earth({ position }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.18, 64, 64]}>
        <meshStandardMaterial 
          color="#2B5F9E"
          roughness={0.6}
          metalness={0.4}
        />
      </Sphere>
      <Sphere args={[0.22, 32, 32]}>
        <meshBasicMaterial color="#4A90E2" transparent opacity={0.1} />
      </Sphere>
    </group>
  );
}

function Asteroid({ position, name, diameter }) {
  const meshRef = useRef();
  const size = Math.max(0.06, Math.min(0.15, diameter / 500));
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[size, 32, 32]}>
        <MeshDistortMaterial
          color="#E74C3C"
          roughness={0.9}
          metalness={0.1}
          distort={0.3}
          speed={2}
        />
      </Sphere>
      <Sphere args={[size + 0.02, 16, 16]}>
        <meshBasicMaterial color="#FF6B6B" transparent opacity={0.15} />
      </Sphere>
    </group>
  );
}

function OrbitPath({ orbitalData, color = "#888888", lineWidth = 2 }) {
  const points = useMemo(() => {
    if (!orbitalData) return [];
    
    const a = parseFloat(orbitalData.semi_major_axis) || 1;
    const e = parseFloat(orbitalData.eccentricity) || 0;
    const inc = (parseFloat(orbitalData.inclination) || 0) * Math.PI / 180;
    const omega = (parseFloat(orbitalData.perihelion_argument) || 0) * Math.PI / 180;
    const Omega = (parseFloat(orbitalData.ascending_node_longitude) || 0) * Math.PI / 180;
    
    const numPoints = 300;
    const pts = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const theta = (i / numPoints) * 2 * Math.PI;
      const r = a * (1 - e * e) / (1 + e * Math.cos(theta));
      
      const xOrbit = r * Math.cos(theta);
      const yOrbit = r * Math.sin(theta);
      
      const x = xOrbit * (Math.cos(omega) * Math.cos(Omega) - Math.sin(omega) * Math.sin(Omega) * Math.cos(inc)) -
                yOrbit * (Math.sin(omega) * Math.cos(Omega) + Math.cos(omega) * Math.sin(Omega) * Math.cos(inc));
      const y = xOrbit * (Math.cos(omega) * Math.sin(Omega) + Math.sin(omega) * Math.cos(Omega) * Math.cos(inc)) -
                yOrbit * (Math.sin(omega) * Math.sin(Omega) - Math.cos(omega) * Math.cos(Omega) * Math.cos(inc));
      const z = xOrbit * Math.sin(omega) * Math.sin(inc) + yOrbit * Math.cos(omega) * Math.sin(inc);
      
      pts.push(new THREE.Vector3(x, z, y));
    }
    
    return pts;
  }, [orbitalData]);

  if (points.length === 0) return null;

  return (
    <Line 
      points={points} 
      color={color} 
      lineWidth={lineWidth}
      transparent
      opacity={0.8}
      dashed={false}
    />
  );
}

function EarthOrbit() {
  const points = useMemo(() => {
    const numPoints = 200;
    const pts = [];
    const radius = 1;
    
    for (let i = 0; i <= numPoints; i++) {
      const theta = (i / numPoints) * 2 * Math.PI;
      pts.push(new THREE.Vector3(
        radius * Math.cos(theta),
        0,
        radius * Math.sin(theta)
      ));
    }
    
    return pts;
  }, []);

  return (
    <Line 
      points={points} 
      color="#4A90E2" 
      lineWidth={1.5}
      opacity={0.6} 
      transparent 
    />
  );
}

function OrbitalPlane({ orbitalData }) {
  const geometry = useMemo(() => {
    const geo = new THREE.CircleGeometry(3, 64);
    return geo;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <primitive object={geometry} />
      <meshBasicMaterial 
        color="#1a1a2e" 
        transparent 
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function PerihelionAphelionMarkers({ orbitalData }) {
  const positions = useMemo(() => {
    if (!orbitalData) return { perihelion: [0, 0, 0], aphelion: [0, 0, 0] };
    const a = parseFloat(orbitalData.semi_major_axis) || 1;
    const e = parseFloat(orbitalData.eccentricity) || 0;
    const inc = (parseFloat(orbitalData.inclination) || 0) * Math.PI / 180;
    const omega = (parseFloat(orbitalData.perihelion_argument) || 0) * Math.PI / 180;
    const Omega = (parseFloat(orbitalData.ascending_node_longitude) || 0) * Math.PI / 180;

    const rPeri = a * (1 - e);
    const rAph = a * (1 + e);

    const calcPosition = (r, theta) => {
      const xOrbit = r * Math.cos(theta);
      const yOrbit = r * Math.sin(theta);
      
      const x = xOrbit * (Math.cos(omega) * Math.cos(Omega) - Math.sin(omega) * Math.sin(Omega) * Math.cos(inc)) -
                yOrbit * (Math.sin(omega) * Math.cos(Omega) + Math.cos(omega) * Math.sin(Omega) * Math.cos(inc));
      const y = xOrbit * (Math.cos(omega) * Math.sin(Omega) + Math.sin(omega) * Math.cos(Omega) * Math.cos(inc)) -
                yOrbit * (Math.sin(omega) * Math.sin(Omega) - Math.cos(omega) * Math.cos(Omega) * Math.cos(inc));
      const z = xOrbit * Math.sin(omega) * Math.sin(inc) + yOrbit * Math.cos(omega) * Math.sin(inc);
      
      return [x, z, y];
    };

    return {
      perihelion: calcPosition(rPeri, 0),
      aphelion: calcPosition(rAph, Math.PI)
    };
  }, [orbitalData]);

  if (!orbitalData) return null;

  return (
    <>
      <Sphere args={[0.04, 16, 16]} position={positions.perihelion}>
        <meshBasicMaterial color="#00FF00" transparent opacity={0.8} />
      </Sphere>
      
      <Sphere args={[0.04, 16, 16]} position={positions.aphelion}>
        <meshBasicMaterial color="#FF00FF" transparent opacity={0.8} />
      </Sphere>
    </>
  );
}

function InfoPanel({ orbitalData }) {
  if (!orbitalData) return null;

  return (
    <Html position={[0, 3.5, 0]} center>
      <div className="pointer-events-none rounded-xl border-2 border-white/30 bg-black/90 p-4 shadow-2xl backdrop-blur-xl" style={{ minWidth: '320px' }}>
        <div className="mb-2 border-b border-white/20 pb-2 text-center text-sm font-bold text-white">
          ORBITAL PARAMETERS
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div className="text-zinc-300">Semi-major axis:</div>
          <div className="font-bold text-white">{parseFloat(orbitalData.semi_major_axis).toFixed(4)} AU</div>
          
          <div className="text-zinc-300">Eccentricity:</div>
          <div className="font-bold text-white">{parseFloat(orbitalData.eccentricity).toFixed(6)}</div>
          
          <div className="text-zinc-300">Inclination:</div>
          <div className="font-bold text-white">{parseFloat(orbitalData.inclination).toFixed(2)}°</div>
          
          <div className="text-zinc-300">Orbital Period:</div>
          <div className="font-bold text-white">{parseFloat(orbitalData.orbital_period).toFixed(1)} days</div>
          
          <div className="text-zinc-300">Orbit Class:</div>
          <div className="font-bold text-cyan-400">{orbitalData.orbit_class?.orbit_class_type}</div>
        </div>
      </div>
    </Html>
  );
}

function Scene({ orbitalData, asteroidName }) {
  const { asteroidPosition, diameter } = useMemo(() => {
    if (!orbitalData) return { asteroidPosition: [1.5, 0, 0], diameter: 50 };
    
    const a = parseFloat(orbitalData.semi_major_axis) || 1.5;
    const e = parseFloat(orbitalData.eccentricity) || 0;
    const meanAnomaly = (parseFloat(orbitalData.mean_anomaly) || 0) * Math.PI / 180;
    
    let E = meanAnomaly;
    for (let i = 0; i < 10; i++) {
      E = meanAnomaly + e * Math.sin(E);
    }
    
    const trueAnomaly = 2 * Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    );
    
    const r = a * (1 - e * e) / (1 + e * Math.cos(trueAnomaly));
    const inc = (parseFloat(orbitalData.inclination) || 0) * Math.PI / 180;
    const omega = (parseFloat(orbitalData.perihelion_argument) || 0) * Math.PI / 180;
    const Omega = (parseFloat(orbitalData.ascending_node_longitude) || 0) * Math.PI / 180;
    
    const theta = trueAnomaly;
    const xOrbit = r * Math.cos(theta);
    const yOrbit = r * Math.sin(theta);
    
    const x = xOrbit * (Math.cos(omega) * Math.cos(Omega) - Math.sin(omega) * Math.sin(Omega) * Math.cos(inc)) -
              yOrbit * (Math.sin(omega) * Math.cos(Omega) + Math.cos(omega) * Math.sin(Omega) * Math.cos(inc));
    const y = xOrbit * (Math.cos(omega) * Math.sin(Omega) + Math.sin(omega) * Math.cos(Omega) * Math.cos(inc)) -
              yOrbit * (Math.sin(omega) * Math.sin(Omega) - Math.cos(omega) * Math.cos(Omega) * Math.cos(inc));
    const z = xOrbit * Math.sin(omega) * Math.sin(inc) + yOrbit * Math.cos(omega) * Math.sin(inc);
    
    return { asteroidPosition: [x, z, y], diameter: 50 };
  }, [orbitalData]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#444444" />
      <Stars radius={300} depth={60} count={8000} factor={5} saturation={0} fade speed={1} />
      
      <OrbitalPlane orbitalData={orbitalData} />
      
      <Sun />
      <Earth position={[1, 0, 0]} />
      <Asteroid position={asteroidPosition} name={asteroidName} diameter={diameter} />
      
      <EarthOrbit />
      <OrbitPath orbitalData={orbitalData} color="#E74C3C" lineWidth={2.5} />
      <PerihelionAphelionMarkers orbitalData={orbitalData} />
      
      <InfoPanel orbitalData={orbitalData} />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={25}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
      
      <gridHelper args={[10, 20, "#333333", "#1a1a1a"]} rotation={[0, 0, 0]} position={[0, -0.01, 0]} />
    </>
  );
}

export default function AsteroidOrbit3D({ orbitalData, asteroidName }) {
  if (!orbitalData) return null;

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-black shadow-2xl dark:border-zinc-800">
      <Canvas 
        camera={{ position: [0, 6, 10], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <Scene orbitalData={orbitalData} asteroidName={asteroidName} />
      </Canvas>
      
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 text-[10px]">
        <div className="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-black/70 px-2.5 py-1.5 backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-orange-500"></div>
          <span className="text-orange-300">Sun</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-black/70 px-2.5 py-1.5 backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span className="text-blue-300">Earth</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-black/70 px-2.5 py-1.5 backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <span className="text-red-300">Asteroid</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-black/70 px-2.5 py-1.5 backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-green-300">Perihelion</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-black/70 px-2.5 py-1.5 backdrop-blur-md">
          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          <span className="text-purple-300">Aphelion</span>
        </div>
      </div>
    </div>
  );
}

