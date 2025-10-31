'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Text, Grid, PerspectiveCamera, useTexture } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
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
    </group>
  );
}

function Axes() {
  return (
    <>
      {/* X axis - Red */}
      <Line
        points={[[-15, 0, 0], [15, 0, 0]]}
        color="red"
        lineWidth={2}
      />
      <Text position={[16, 0, 0]} fontSize={0.5} color="red">
        X
      </Text>
      
      {/* Y axis - Green */}
      <Line
        points={[[0, -15, 0], [0, 15, 0]]}
        color="green"
        lineWidth={2}
      />
      <Text position={[0, 16, 0]} fontSize={0.5} color="green">
        Y
      </Text>
      
      {/* Z axis - Blue */}
      <Line
        points={[[0, 0, -15], [0, 0, 15]]}
        color="blue"
        lineWidth={2}
      />
      <Text position={[0, 0, 16]} fontSize={0.5} color="blue">
        Z
      </Text>
    </>
  );
}

function SatelliteTrajectory({ points, color = "#fbbf24", name, showPoints = true }) {
  if (!points || points.length === 0) return null;

  // Scale down the coordinates (assuming they're in Earth radii or similar large units)
  const scaledPoints = points.map(([x, y, z]) => [
    x / 1000, // Scale factor - adjust based on your coordinate system
    y / 1000,
    z / 1000
  ]);

  return (
    <>
      {/* Trajectory line */}
      <Line
        points={scaledPoints}
        color={color}
        lineWidth={3}
      />
      
      {/* Show individual points along trajectory */}
      {showPoints && scaledPoints.map((point, idx) => (
        <Sphere key={idx} args={[0.1, 8, 8]} position={point}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </Sphere>
      ))}
      
      {/* Label at the end of trajectory */}
      {scaledPoints.length > 0 && name && (
        <Text
          position={[
            scaledPoints[scaledPoints.length - 1][0],
            scaledPoints[scaledPoints.length - 1][1] + 0.5,
            scaledPoints[scaledPoints.length - 1][2]
          ]}
          fontSize={0.4}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </>
  );
}

export default function Satellite3DViewer({ locationData }) {
  const [showEarth, setShowEarth] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showPoints, setShowPoints] = useState(false);

  if (!locationData?.[1]?.Result?.[1]) {
    return (
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
        <p className="text-sm text-black/60 dark:text-white/60">No data to visualize</p>
      </div>
    );
  }

  const satellites = locationData[1].Result[1].Data?.[1] || [];
  const colors = ['#fbbf24', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Extract trajectory data for each satellite
  const trajectories = satellites.map((satDataArray, idx) => {
    const satData = satDataArray[1];
    if (!satData || !satData.Id) return null;

    const coords = satData.Coordinates?.[1]?.[0]?.[1];
    if (!coords) return null;

    const xValues = coords.X?.[1] || [];
    const yValues = coords.Y?.[1] || [];
    const zValues = coords.Z?.[1] || [];

    const points = xValues.map((x, i) => [
      parseFloat(x) || 0,
      parseFloat(yValues[i]) || 0,
      parseFloat(zValues[i]) || 0
    ]);

    return {
      name: satData.Id,
      points,
      color: colors[idx % colors.length]
    };
  }).filter(Boolean);

  if (trajectories.length === 0) {
    return (
      <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
        <p className="text-sm text-black/60 dark:text-white/60">No valid trajectory data found</p>
      </div>
    );
  }

  return (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wider mb-2">
            3D Trajectory Visualization
          </h3>
          <p className="text-xs text-black/60 dark:text-white/60">
            Use mouse to rotate, scroll to zoom, right-click to pan
          </p>
        </div>
        
        <div className="flex gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEarth}
              onChange={(e) => setShowEarth(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="font-bold uppercase tracking-wider">Earth</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAxes}
              onChange={(e) => setShowAxes(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="font-bold uppercase tracking-wider">Axes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPoints}
              onChange={(e) => setShowPoints(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="font-bold uppercase tracking-wider">Points</span>
          </label>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-3">
        {trajectories.map((traj, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div 
              className="w-6 h-1 rounded"
              style={{ backgroundColor: traj.color }}
            />
            <span className="text-xs font-bold uppercase tracking-wider">
              {traj.name}
            </span>
          </div>
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-[600px] border-2 border-slate-700 dark:border-slate-600 bg-black">
        <Canvas>
          <PerspectiveCamera makeDefault position={[20, 20, 20]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
          <directionalLight position={[-10, -10, -10]} intensity={0.4} />
          
          {/* Grid */}
          <Grid
            args={[30, 30]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#6b7280"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#9ca3af"
            fadeDistance={40}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={false}
          />
          
          {/* Earth representation */}
          {showEarth && <Earth />}
          
          {/* Coordinate axes */}
          {showAxes && <Axes />}
          
          {/* Satellite trajectories */}
          {trajectories.map((traj, idx) => (
            <SatelliteTrajectory
              key={idx}
              points={traj.points}
              color={traj.color}
              name={traj.name}
              showPoints={showPoints}
            />
          ))}
          
          {/* Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
          />
        </Canvas>
      </div>

      {/* Info */}
      <div className="mt-4 text-xs text-black/60 dark:text-white/60">
        <p>
          <strong>Note:</strong> Coordinates are scaled down for visualization. 
          Original values may be in Earth radii or kilometers depending on the coordinate system selected.
        </p>
      </div>
    </div>
  );
}

