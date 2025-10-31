'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D viewer to avoid SSR issues with Three.js
const TLE3DViewer = dynamic(() => import('@/components/TLE3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
      <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent"></div>
      <p className="mt-4 font-bold uppercase tracking-wider text-sm">Loading 3D Model...</p>
    </div>
  )
});

function parseTLE(line1, line2) {
  // Parse TLE Line 1
  const satNumber = line1.substring(2, 7).trim();
  const classification = line1.substring(7, 8);
  const intlDesignator = line1.substring(9, 17).trim();
  const epochYear = line1.substring(18, 20);
  const epochDay = parseFloat(line1.substring(20, 32));
  const meanMotionDot = parseFloat(line1.substring(33, 43));
  const meanMotionDotDot = parseFloat(line1.substring(44, 52));
  const bstar = parseFloat(line1.substring(53, 61));
  const ephemerisType = line1.substring(62, 63);
  const elementNumber = line1.substring(64, 68).trim();

  // Parse TLE Line 2
  const inclination = parseFloat(line2.substring(8, 16));
  const raan = parseFloat(line2.substring(17, 25)); // Right Ascension of Ascending Node
  const eccentricity = parseFloat('0.' + line2.substring(26, 33));
  const argOfPerigee = parseFloat(line2.substring(34, 42));
  const meanAnomaly = parseFloat(line2.substring(43, 51));
  const meanMotion = parseFloat(line2.substring(52, 63));
  const revNumber = line2.substring(63, 68).trim();

  // Calculate some derived values
  const orbitalPeriod = 1440 / meanMotion; // in minutes
  const semiMajorAxis = Math.pow((orbitalPeriod * 60 / (2 * Math.PI)) ** 2 * 398600.4418, 1/3); // km
  const apogee = semiMajorAxis * (1 + eccentricity) - 6371; // km above Earth surface
  const perigee = semiMajorAxis * (1 - eccentricity) - 6371; // km above Earth surface

  return {
    satNumber,
    classification,
    intlDesignator,
    epochYear: '20' + epochYear,
    epochDay,
    meanMotionDot,
    meanMotionDotDot,
    bstar,
    ephemerisType,
    elementNumber,
    inclination,
    raan,
    eccentricity,
    argOfPerigee,
    meanAnomaly,
    meanMotion,
    revNumber,
    orbitalPeriod,
    semiMajorAxis,
    apogee,
    perigee
  };
}

function OrbitalVisualization({ tleData }) {
  if (!tleData) return null;

  const parsed = parseTLE(tleData.line1, tleData.line2);
  
  // Create visual representations
  const inclinationPercent = (parsed.inclination / 180) * 100;
  const eccentricityPercent = parsed.eccentricity * 100;
  const meanAnomalyPercent = (parsed.meanAnomaly / 360) * 100;
  const argPerigeePercent = (parsed.argOfPerigee / 360) * 100;
  const raanPercent = (parsed.raan / 360) * 100;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Inclination */}
      <div className="border-2 border-slate-700 dark:border-slate-600 p-4 bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider">Inclination</h4>
          <span className="text-xl font-bold">{parsed.inclination.toFixed(4)}°</span>
        </div>
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 border-2 border-slate-700 dark:border-slate-600">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
            style={{ width: `${inclinationPercent}%` }}
          />
        </div>
        <p className="text-xs text-black/60 dark:text-white/60 mt-2">
          Orbital plane angle relative to equator (0-180°)
        </p>
      </div>

      {/* Eccentricity */}
      <div className="border-2 border-slate-700 dark:border-slate-600 p-4 bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider">Eccentricity</h4>
          <span className="text-xl font-bold">{parsed.eccentricity.toFixed(7)}</span>
        </div>
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 border-2 border-slate-700 dark:border-slate-600">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
            style={{ width: `${Math.min(eccentricityPercent * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-black/60 dark:text-white/60 mt-2">
          Orbit shape (0 = circle, approaching 1 = ellipse)
        </p>
      </div>

      {/* Mean Anomaly */}
      <div className="border-2 border-slate-700 dark:border-slate-600 p-4 bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider">Mean Anomaly</h4>
          <span className="text-xl font-bold">{parsed.meanAnomaly.toFixed(4)}°</span>
        </div>
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 border-2 border-slate-700 dark:border-slate-600">
          <div 
            className="h-full bg-gradient-to-r from-green-600 to-green-400"
            style={{ width: `${meanAnomalyPercent}%` }}
          />
        </div>
        <p className="text-xs text-black/60 dark:text-white/60 mt-2">
          Position in orbit (0-360°)
        </p>
      </div>

      {/* RAAN */}
      <div className="border-2 border-slate-700 dark:border-slate-600 p-4 bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider">RAAN</h4>
          <span className="text-xl font-bold">{parsed.raan.toFixed(4)}°</span>
        </div>
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 border-2 border-slate-700 dark:border-slate-600">
          <div 
            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
            style={{ width: `${raanPercent}%` }}
          />
        </div>
        <p className="text-xs text-black/60 dark:text-white/60 mt-2">
          Right Ascension of Ascending Node (0-360°)
        </p>
      </div>

      {/* Orbital Period */}
      <div className="border-2 border-slate-700 dark:border-slate-600 p-4 bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider">Orbital Period</h4>
          <span className="text-xl font-bold">{parsed.orbitalPeriod.toFixed(2)} min</span>
        </div>
        <div className="mt-2 text-sm">
          <p className="text-black/80 dark:text-white/80">
            ≈ {(parsed.orbitalPeriod / 60).toFixed(2)} hours
          </p>
          <p className="text-xs text-black/60 dark:text-white/60">
            Time to complete one orbit
          </p>
        </div>
      </div>

      {/* Altitude */}
      <div className="border-2 border-slate-700 dark:border-slate-600 p-4 bg-white dark:bg-black">
        <div className="mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Altitude Range</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-bold text-green-600 dark:text-green-400">Perigee:</span>
              <span className="text-lg font-bold">{parsed.perigee.toFixed(2)} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-bold text-red-600 dark:text-red-400">Apogee:</span>
              <span className="text-lg font-bold">{parsed.apogee.toFixed(2)} km</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-black/60 dark:text-white/60 mt-2">
          Lowest and highest points above Earth
        </p>
      </div>
    </div>
  );
}

function TLECard({ tleData, onSelect }) {
  const parsed = parseTLE(tleData.line1, tleData.line2);
  
  return (
    <div 
      className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 hover:shadow-[6px_6px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all cursor-pointer"
      onClick={() => onSelect(tleData)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wider mb-1">{tleData.name}</h3>
          <p className="text-xs text-black/60 dark:text-white/60">SAT #{tleData.satelliteId}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {parsed.intlDesignator}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-xs text-black/60 dark:text-white/60">Inclination</p>
          <p className="font-bold">{parsed.inclination.toFixed(2)}°</p>
        </div>
        <div>
          <p className="text-xs text-black/60 dark:text-white/60">Period</p>
          <p className="font-bold">{parsed.orbitalPeriod.toFixed(2)} min</p>
        </div>
        <div>
          <p className="text-xs text-black/60 dark:text-white/60">Perigee</p>
          <p className="font-bold">{parsed.perigee.toFixed(0)} km</p>
        </div>
        <div>
          <p className="text-xs text-black/60 dark:text-white/60">Apogee</p>
          <p className="font-bold">{parsed.apogee.toFixed(0)} km</p>
        </div>
      </div>

      <div className="border-t-2 border-slate-700 dark:border-slate-600 pt-3">
        <p className="text-xs font-mono text-black/60 dark:text-white/60 mb-1">{tleData.line1}</p>
        <p className="text-xs font-mono text-black/60 dark:text-white/60">{tleData.line2}</p>
      </div>
    </div>
  );
}

export default function TLEPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tleResults, setTleResults] = useState([]);
  const [selectedTLE, setSelectedTLE] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTLE = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setTleResults([]);
    setSelectedTLE(null);

    try {
      // Correct API endpoint format: /api/tle?search={query}
      const response = await fetch(`https://tle.ivanstanojevic.me/api/tle?search=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let results = [];
      if (Array.isArray(data)) {
        results = data;
      } else if (data.member && Array.isArray(data.member)) {
        results = data.member;
      }
      
      if (!results || results.length === 0) {
        setError('No satellites found matching your search');
      } else {
        setTleResults(results);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch TLE data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTLE = async () => {
    setLoading(true);
    setError(null);
    setTleResults([]);
    setSelectedTLE(null);

    try {
      const response = await fetch('https://tle.ivanstanojevic.me/api/tle');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let results = [];
      if (Array.isArray(data)) {
        results = data;
      } else if (data.member && Array.isArray(data.member)) {
        results = data.member;
      }
      
      // Limit to first 50 for performance
      setTleResults(results.slice(0, 50));
    } catch (err) {
      setError(err.message || 'Failed to fetch TLE data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 border-b-4 border-slate-700 dark:border-slate-600 pb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Orbital Elements</p>
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4">TLE Database</h1>
          <p className="text-sm font-medium uppercase tracking-wider text-black/60 dark:text-white/60">
            Two-Line Element Sets
          </p>
          <p className="mt-6 leading-relaxed max-w-4xl">
            Search and explore up-to-date Two-Line Element (TLE) sets for Earth-orbiting satellites. 
            TLE data encodes orbital parameters and is updated daily from CelesTrak.
          </p>
        </div>

        {/* Search Section */}
        <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6 border-b-2 border-slate-700 dark:border-slate-600 pb-2">
            Search Satellites
          </h2>

          <form onSubmit={searchTLE} className="mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter satellite name (e.g., ISS, STARLINK, HUBBLE)"
                className="flex-1 p-3 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white font-bold placeholder:text-black/40 dark:placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={loading}
                className="border-4 border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          <button
            onClick={fetchAllTLE}
            disabled={loading}
            className="w-full border-2 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white px-6 py-2 text-xs font-bold uppercase tracking-wider hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:opacity-50"
          >
            Or Browse All Satellites (First 50)
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="border-4 border-red-600 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-6 py-4 mb-8">
            <strong className="font-bold uppercase tracking-wider">Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent"></div>
            <p className="mt-4 font-bold uppercase tracking-wider text-sm">Loading TLE data...</p>
          </div>
        )}

        {/* Selected TLE Detail View */}
        {selectedTLE && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold uppercase tracking-wider">
                {selectedTLE.name}
              </h2>
              <button
                onClick={() => setSelectedTLE(null)}
                className="border-2 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
              >
                ← Back to Results
              </button>
            </div>

            <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 mb-6">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-4">TLE Data</h3>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 border-2 border-slate-700 dark:border-slate-600 font-mono text-sm mb-4">
                <p className="mb-1">{selectedTLE.name}</p>
                <p className="mb-1 text-blue-600 dark:text-blue-400">{selectedTLE.line1}</p>
                <p className="text-green-600 dark:text-green-400">{selectedTLE.line2}</p>
              </div>
              <button
                onClick={() => {
                  const text = `${selectedTLE.name}\n${selectedTLE.line1}\n${selectedTLE.line2}`;
                  navigator.clipboard.writeText(text);
                }}
                className="border-2 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
              >
                📋 Copy to Clipboard
              </button>
            </div>

            {/* 3D Orbital Model */}
            <div className="mb-6">
              <TLE3DViewer tleData={selectedTLE} />
            </div>

            {/* Orbital Parameters Graphs */}
            <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6">Orbital Parameters</h3>
              <OrbitalVisualization tleData={selectedTLE} />
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !selectedTLE && tleResults.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
              Search Results ({tleResults.length})
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {tleResults.map((tle, index) => (
                <TLECard 
                  key={index} 
                  tleData={tle} 
                  onSelect={setSelectedTLE}
                />
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        {!loading && tleResults.length === 0 && !error && (
          <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8 text-center">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4">About TLE Data</h3>
            <p className="text-sm text-black/70 dark:text-white/70 max-w-2xl mx-auto mb-6">
              Two-Line Element (TLE) sets are a standard format for describing satellite orbits. 
              Each TLE contains orbital parameters like inclination, eccentricity, and mean motion 
              that can be used to calculate satellite positions at any given time.
            </p>
            <p className="text-xs text-black/60 dark:text-white/60">
              Data provided by CelesTrak via <a href="http://tle.ivanstanojevic.me" target="_blank" rel="noopener noreferrer" className="underline">tle.ivanstanojevic.me</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

