'use client';

import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import { TextureLoader } from 'three';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

function Globe({ textureUrl, body }) {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    // For demo, we'll use a single tile or create a basic texture
    // In production, you'd need to stitch multiple tiles together
    const loader = new TextureLoader();
    
    // Try to load the base tile (zoom level 0, tile 0,0)
    const baseUrl = textureUrl.replace('{z}', '0').replace('{y}', '0').replace('{x}', '0');
    
    loader.load(
      baseUrl,
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        loadedTexture.repeat.set(2, 1); // Wrap horizontally for full globe
        setTexture(loadedTexture);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('Texture loading error:', err);
        setError(true);
        setLoading(false);
      }
    );
  }, [textureUrl]);

  // Rotate the globe slowly
  useEffect(() => {
    if (meshRef.current && !loading) {
      const animate = () => {
        meshRef.current.rotation.y += 0.001;
      };
      const interval = setInterval(animate, 16);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Get color based on body
  const getBodyColor = () => {
    switch(body) {
      case 'moon': return '#8b8b8b';
      case 'mars': return '#cd5c5c';
      case 'vesta': return '#a0a0a0';
      default: return '#8b8b8b';
    }
  };

  const getRadius = () => {
    switch(body) {
      case 'moon': return 1.0;
      case 'mars': return 1.2;
      case 'vesta': return 0.8;
      default: return 1.0;
    }
  };

  if (loading) {
    return (
      <Text position={[0, 0, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        Loading Globe...
      </Text>
    );
  }

  if (error || !texture) {
    // Fallback to colored sphere if texture fails
    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[getRadius(), 64, 64]} />
        <meshStandardMaterial 
          color={getBodyColor()}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    );
  }

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[getRadius(), 64, 64]} />
      <meshStandardMaterial 
        map={texture}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

function Atmosphere({ body, radius = 1.0 }) {
  // Only Mars has visible atmosphere
  if (body !== 'mars') return null;
  
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.02, 32, 32]} />
      <meshBasicMaterial 
        color="#ffa07a"
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function AxisHelper() {
  return (
    <>
      {/* Equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.01, 0.002, 16, 100]} />
        <meshBasicMaterial color="#4a9eff" opacity={0.5} transparent />
      </mesh>
      
      {/* North-South axis line */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 2.5, 8]} />
        <meshBasicMaterial color="#ffaa00" opacity={0.3} transparent />
      </mesh>
    </>
  );
}

export default function Trek3DGlobe({ mosaic, body }) {
  const [showAxis, setShowAxis] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);

  const getBodyName = () => {
    switch(body) {
      case 'moon': return 'The Moon';
      case 'mars': return 'Mars';
      case 'vesta': return 'Vesta';
      default: return 'Unknown';
    }
  };

  const getBodyInfo = () => {
    switch(body) {
      case 'moon': 
        return { 
          diameter: '3,474 km',
          mass: '7.34 × 10²² kg',
          gravity: '1.62 m/s²',
          orbitalPeriod: '27.3 days'
        };
      case 'mars': 
        return { 
          diameter: '6,779 km',
          mass: '6.39 × 10²³ kg',
          gravity: '3.71 m/s²',
          orbitalPeriod: '687 days'
        };
      case 'vesta': 
        return { 
          diameter: '525 km',
          mass: '2.59 × 10²⁰ kg',
          gravity: '0.25 m/s²',
          orbitalPeriod: '3.63 years'
        };
      default: 
        return { diameter: 'N/A', mass: 'N/A', gravity: 'N/A', orbitalPeriod: 'N/A' };
    }
  };

  const bodyInfo = getBodyInfo();

  return (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black">
      {/* Controls */}
      <div className="border-b-2 border-slate-700 dark:border-slate-600 p-4 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-1">
              3D Globe View
            </h3>
            <p className="text-xs text-black/60 dark:text-white/60">
              Drag to rotate • Scroll to zoom • Right-click to pan
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowAxis(!showAxis)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                showAxis
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white'
                  : 'border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white hover:shadow-[2px_2px_0px_0px_rgba(71,85,105,1)]'
              }`}
            >
              {showAxis ? '✓' : '○'} Axis
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                showStats
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white'
                  : 'border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white hover:shadow-[2px_2px_0px_0px_rgba(71,85,105,1)]'
              }`}
            >
              {showStats ? '✓' : '○'} Info
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative">
        <div className="w-full h-[600px] bg-black">
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 3, 5]} intensity={1.5} />
            <pointLight position={[-5, -3, -5]} intensity={0.3} />
            
            {/* Stars */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            {/* Globe */}
            <Globe textureUrl={mosaic.endpoint} body={body} />
            
            {/* Atmosphere (Mars only) */}
            <Atmosphere body={body} radius={1.2} />
            
            {/* Axis helpers */}
            {showAxis && <AxisHelper />}
            
            {/* Controls */}
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              rotateSpeed={0.5}
              zoomSpeed={0.8}
              minDistance={1.5}
              maxDistance={10}
              autoRotate={rotationSpeed > 0}
              autoRotateSpeed={rotationSpeed * 0.5}
            />
          </Canvas>
        </div>

        {/* Info Overlay */}
        {showStats && (
          <div className="absolute top-4 left-4 bg-black/80 text-white p-4 border-2 border-white max-w-xs z-10">
            <h4 className="text-lg font-bold uppercase tracking-wider mb-3 border-b border-white/30 pb-2">
              {getBodyName()}
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-white/70">Diameter:</span>
                <span className="font-bold">{bodyInfo.diameter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Mass:</span>
                <span className="font-bold">{bodyInfo.mass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Gravity:</span>
                <span className="font-bold">{bodyInfo.gravity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Orbital Period:</span>
                <span className="font-bold">{bodyInfo.orbitalPeriod}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/30">
              <div className="text-xs text-white/70 mb-1">Mosaic:</div>
              <div className="text-xs font-bold">{mosaic.name}</div>
            </div>
          </div>
        )}

        {/* Rotation Control */}
        <div className="absolute bottom-4 right-4 bg-black/80 text-white p-3 border-2 border-white z-10">
          <div className="text-xs font-bold uppercase mb-2">Auto-Rotate</div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
            className="w-32"
          />
          <div className="text-xs text-center mt-1">
            {rotationSpeed === 0 ? 'Off' : `${rotationSpeed}x`}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="border-t-2 border-slate-700 dark:border-slate-600 p-4 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-400"></div>
            <span className="font-bold uppercase">Equator</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-400"></div>
            <span className="font-bold uppercase">Rotation Axis</span>
          </div>
          {body === 'mars' && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-300 opacity-30"></div>
              <span className="font-bold uppercase">Atmosphere</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t-2 border-slate-700 dark:border-slate-600 text-xs text-black/60 dark:text-white/60">
          <strong>Note:</strong> The 3D globe displays a textured sphere using Trek map data. 
          Due to technical limitations, it shows a simplified representation. For detailed exploration, 
          use the 2D map view which loads high-resolution tiles dynamically.
        </div>
      </div>
    </div>
  );
}

