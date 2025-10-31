'use client';

import { useEffect, useRef, useState } from 'react';

export default function ExoplanetVisualization({ planetData }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (!canvasRef.current || !planetData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = 600 * 2;
    ctx.scale(2, 2);

    const centerX = width / 4;
    const centerY = height / 4;
    
    const starRadius = 30;
    const orbitRadius = Math.min(
      (planetData.pl_orbsmax || 1) * 80,
      Math.min(centerX, centerY) - 80
    );
    
    const planetRadius = Math.max(
      (planetData.pl_rade || 1) * 3,
      5
    );

    let angle = 0;
    const orbitSpeed = 0.01 / (planetData.pl_orbper || 365);

    const getPlanetColor = (radius) => {
      if (!radius) return '#888888';
      if (radius < 1.25) return '#4A90E2';
      if (radius < 2) return '#50C878';
      if (radius < 6) return '#5DADE2';
      return '#F39C12';
    };

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width / 2, height / 2);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
      ctx.stroke();

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, starRadius);
      gradient.addColorStop(0, '#FFF8DC');
      gradient.addColorStop(0.5, '#FFD700');
      gradient.addColorStop(1, '#FFA500');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, starRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      const planetX = centerX + Math.cos(angle) * orbitRadius;
      const planetY = centerY + Math.sin(angle) * orbitRadius;

      const planetGradient = ctx.createRadialGradient(
        planetX - planetRadius / 3,
        planetY - planetRadius / 3,
        0,
        planetX,
        planetY,
        planetRadius
      );
      planetGradient.addColorStop(0, getPlanetColor(planetData.pl_rade));
      planetGradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = planetGradient;
      ctx.beginPath();
      ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(planetX, planetY);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(planetData.hostname || 'Star', centerX, centerY + starRadius + 15);
      ctx.fillText(planetData.pl_name || 'Planet', planetX, planetY + planetRadius + 15);

      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width / 2;
        const y = Math.random() * height / 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(x, y, 1, 1);
      }

      angle += orbitSpeed * 5;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [planetData]);

  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="border-l-4 border-purple-500 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Orbital Visualization</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Simplified 2D representation of the planetary system</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <canvas 
          ref={canvasRef}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
          style={{ height: '300px' }}
        />

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Orbital Period</p>
            <p className="text-lg font-semibold">{planetData.pl_orbper ? `${planetData.pl_orbper.toFixed(1)} days` : 'N/A'}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Semi-Major Axis</p>
            <p className="text-lg font-semibold">{planetData.pl_orbsmax ? `${planetData.pl_orbsmax.toFixed(3)} AU` : 'N/A'}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Eccentricity</p>
            <p className="text-lg font-semibold">{planetData.pl_orbeccen ? planetData.pl_orbeccen.toFixed(3) : 'N/A'}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Stellar Mass</p>
            <p className="text-lg font-semibold">{planetData.st_mass ? `${planetData.st_mass.toFixed(2)} M☉` : 'N/A'}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Planet Classification</h4>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-xs">Earth-like (&lt;1.25 R⊕)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-xs">Super-Earth (1.25-2 R⊕)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
              <span className="text-xs">Neptune-like (2-6 R⊕)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-xs">Jupiter-like (&gt;6 R⊕)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

