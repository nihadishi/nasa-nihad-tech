'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Text, Grid } from '@react-three/drei';
import { useMemo, useState } from 'react';
import * as THREE from 'three';

function Planet({ planet, position, scale, color, onHover, onClick, isSelected }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group 
      position={position}
      onPointerEnter={() => {
        setHovered(true);
        onHover && onHover(planet);
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover && onHover(null);
      }}
      onClick={() => onClick && onClick(planet)}
    >
      <Sphere args={[scale, 16, 16]}>
        <meshStandardMaterial 
          color={hovered || isSelected ? '#ffff00' : color}
          emissive={hovered || isSelected ? color : '#000000'}
          emissiveIntensity={hovered || isSelected ? 0.5 : 0}
        />
      </Sphere>
      {/* Glow effect for selected/hovered */}
      {(hovered || isSelected) && (
        <Sphere args={[scale * 1.2, 16, 16]}>
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.3}
          />
        </Sphere>
      )}
      {/* Label */}
      {(hovered || isSelected) && planet.pl_name && (
        <Text
          position={[0, scale + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {planet.pl_name}
        </Text>
      )}
    </group>
  );
}

function Axes({ bounds }) {
  const axisLength = Math.max(...bounds.map(Math.abs)) * 1.5;
  
  return (
    <>
      {/* X axis - Red */}
      <mesh position={[axisLength / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, axisLength]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <Text position={[axisLength / 2 + 0.5, 0, 0]} fontSize={0.5} color="red">
        Orbit Distance
      </Text>
      
      {/* Y axis - Green */}
      <mesh position={[0, axisLength / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, axisLength]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <Text position={[0, axisLength / 2 + 0.5, 0]} fontSize={0.5} color="green">
        Radius
      </Text>
      
      {/* Z axis - Blue */}
      <mesh position={[0, 0, axisLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, axisLength]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <Text position={[0, 0, axisLength / 2 + 0.5]} fontSize={0.5} color="blue">
        Temperature
      </Text>
    </>
  );
}

export default function Exoplanets3DViewer({ planets, selectedPlanet, onPlanetSelect }) {
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [showAxes, setShowAxes] = useState(true);
  
  // Process planets for visualization
  const processedPlanets = useMemo(() => {
    if (!planets || planets.length === 0) return [];
    
    const validPlanets = planets.filter(p => 
      p.pl_orbsmax && p.pl_rade && p.pl_eqt
    );
    
    if (validPlanets.length === 0) return [];
    
    // Calculate bounds for normalization
    const orbits = validPlanets.map(p => parseFloat(p.pl_orbsmax) || 0);
    const radii = validPlanets.map(p => parseFloat(p.pl_rade) || 0);
    const temps = validPlanets.map(p => parseFloat(p.pl_eqt) || 0);
    
    const maxOrbit = Math.max(...orbits);
    const maxRadius = Math.max(...radii);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps.filter(t => t > 0));
    
    // Normalize and position planets
    const scale = 10; // Scale factor for visualization
    
    return validPlanets.map(planet => {
      const orbit = parseFloat(planet.pl_orbsmax) || 0;
      const radius = parseFloat(planet.pl_rade) || 0;
      const temp = parseFloat(planet.pl_eqt) || 0;
      
      // Normalize to 0-10 range
      const x = (orbit / maxOrbit) * scale;
      const y = (radius / maxRadius) * scale;
      const z = maxTemp > minTemp ? ((temp - minTemp) / (maxTemp - minTemp)) * scale : 0;
      
      // Determine color based on temperature
      let color = '#60a5fa'; // Blue (cold)
      if (temp > 500) color = '#fbbf24'; // Yellow (warm)
      if (temp > 1000) color = '#f97316'; // Orange (hot)
      if (temp > 2000) color = '#ef4444'; // Red (very hot)
      
      // Planet size based on radius (normalized)
      const planetSize = Math.max(0.1, Math.min(0.5, (radius / maxRadius) * 0.5));
      
      return {
        ...planet,
        position: [x, y, z],
        color,
        size: planetSize,
        orbit,
        radius,
        temp
      };
    });
  }, [planets]);
  
  const bounds = useMemo(() => {
    if (processedPlanets.length === 0) return [10, 10, 10];
    const positions = processedPlanets.map(p => p.position);
    const xValues = positions.map(p => p[0]);
    const yValues = positions.map(p => p[1]);
    const zValues = positions.map(p => p[2]);
    
    return [
      Math.max(...xValues.map(Math.abs)),
      Math.max(...yValues.map(Math.abs)),
      Math.max(...zValues.map(Math.abs))
    ];
  }, [processedPlanets]);
  
  if (!planets || planets.length === 0) {
    return (
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
        <p className="text-sm text-black/60 dark:text-white/60">
          No planet data available for 3D visualization
        </p>
      </div>
    );
  }
  
  return (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold uppercase tracking-wider mb-4">
          3D Exoplanet Visualization
        </h3>
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={showAxes}
            onChange={(e) => setShowAxes(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-bold uppercase">Show Axes</span>
        </label>
      </div>
      
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="font-bold uppercase">Cold (&lt;500K)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span className="font-bold uppercase">Warm (500-1000K)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
          <span className="font-bold uppercase">Hot (1000-2000K)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="font-bold uppercase">Very Hot (&gt;2000K)</span>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="w-full h-[600px] bg-black">
        <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-10, -10, -10]} intensity={0.3} />
          
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
          
          {showAxes && <Axes bounds={bounds} />}
          
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#6b7280"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#9ca3af"
            fadeDistance={25}
            fadeStrength={1}
          />
          
          {/* Planets */}
          {processedPlanets.map((planet, idx) => (
            <Planet
              key={idx}
              planet={planet}
              position={planet.position}
              scale={planet.size}
              color={planet.color}
              isSelected={selectedPlanet && selectedPlanet.pl_name === planet.pl_name}
              onHover={(p) => setHoveredPlanet(p)}
              onClick={(p) => onPlanetSelect && onPlanetSelect(p)}
            />
          ))}
          
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            minDistance={5}
            maxDistance={50}
          />
        </Canvas>
      </div>
      
      {/* Info */}
      <div className="mt-4 text-xs text-black/60 dark:text-white/60">
        <p>
          <strong>X-axis:</strong> Orbital Distance (AU) • <strong>Y-axis:</strong> Planet Radius (Earth radii) • <strong>Z-axis:</strong> Equilibrium Temperature (K)
        </p>
        <p className="mt-1">
          Click and drag to rotate • Scroll to zoom • Right-click to pan
        </p>
      </div>
    </div>
  );
}

