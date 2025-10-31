'use client';

import { useState, useEffect } from 'react';
import ExoplanetVisualization from '@/components/ExoplanetVisualization';

export default function ExoplanetsPage() {
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show3D, setShow3D] = useState(false);

  const [discoveryMethod, setDiscoveryMethod] = useState('all');
  const [discoveryFacility, setDiscoveryFacility] = useState('all');
  const [minRadius, setMinRadius] = useState('');
  const [maxRadius, setMaxRadius] = useState('');
  const [minMass, setMinMass] = useState('');
  const [maxMass, setMaxMass] = useState('');
  const [minTemp, setMinTemp] = useState('');
  const [maxTemp, setMaxTemp] = useState('');
  const [transitFlag, setTransitFlag] = useState('all');
  const [limit, setLimit] = useState('50');

  const discoveryMethods = [
    { id: 'all', name: 'All Methods' },
    { id: 'Transit', name: 'Transit' },
    { id: 'Radial Velocity', name: 'Radial Velocity' },
    { id: 'Microlensing', name: 'Microlensing' },
    { id: 'Imaging', name: 'Direct Imaging' },
    { id: 'Transit Timing Variations', name: 'TTV' },
  ];

  const facilities = [
    { id: 'all', name: 'All Facilities' },
    { id: 'Kepler', name: 'Kepler' },
    { id: 'TESS', name: 'TESS' },
    { id: 'K2', name: 'K2' },
    { id: 'CoRoT', name: 'CoRoT' },
  ];

  useEffect(() => {
    fetchPlanets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildQuery = () => {
    const columns = 'pl_name,hostname,pl_rade,pl_bmasse,pl_orbper,pl_eqt,pl_orbsmax,pl_orbeccen,discoverymethod,disc_year,disc_facility,sy_dist,tran_flag,st_mass';
    let query = `select ${columns} from ps where default_flag=1`;
    
    if (discoveryMethod !== 'all') {
      query += ` and discoverymethod='${discoveryMethod}'`;
    }
    
    if (discoveryFacility !== 'all') {
      query += ` and disc_facility LIKE '%${discoveryFacility}%'`;
    }
    
    if (transitFlag !== 'all') {
      query += ` and tran_flag=${transitFlag}`;
    }
    
    if (minRadius) {
      query += ` and pl_rade>=${minRadius}`;
    }
    
    if (maxRadius) {
      query += ` and pl_rade<=${maxRadius}`;
    }
    
    if (minMass) {
      query += ` and pl_bmasse>=${minMass}`;
    }
    
    if (maxMass) {
      query += ` and pl_bmasse<=${maxMass}`;
    }
    
    if (minTemp) {
      query += ` and pl_eqt>=${minTemp}`;
    }
    
    if (maxTemp) {
      query += ` and pl_eqt<=${maxTemp}`;
    }
    
    query += ` order by pl_name asc LIMIT ${limit}`;
    
    return query;
  };

  const fetchPlanets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const query = buildQuery();
      const url = `/api/exoplanets?query=${encodeURIComponent(query)}&format=json`;
      
      console.log('Querying:', query);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format received from API');
      }
      
      setPlanets(data);
      
      if (data.length > 0) {
        setSelectedPlanet(data[0]);
      } else {
        setError('No planets found matching the filters');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlanetType = (radius) => {
    if (!radius) return 'Unknown';
    if (radius < 1.25) return 'Earth-like';
    if (radius < 2) return 'Super-Earth';
    if (radius < 6) return 'Neptune-like';
    return 'Jupiter-like';
  };

  const getPlanetColor = (radius) => {
    if (!radius) return 'border-gray-500';
    if (radius < 1.25) return 'border-blue-500';
    if (radius < 2) return 'border-green-500';
    if (radius < 6) return 'border-cyan-500';
    return 'border-orange-500';
  };

  const formatNumber = (num, decimals = 2) => {
    if (num === null || num === undefined) return 'N/A';
    return parseFloat(num).toFixed(decimals);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 border-b-4 border-black dark:border-white pb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center">Planetary Science</p>
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 uppercase tracking-tight">
            NASA Exoplanet Archive
          </h1>
          <p className="text-center max-w-3xl mx-auto leading-relaxed">
            Explore thousands of confirmed exoplanets discovered by missions like Kepler, TESS, and more. 
            Filter by discovery method, size, temperature, and other characteristics.
          </p>
        </div>

        <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wider">Filters</h2>
              <p className="text-sm font-medium mt-1 text-black/60 dark:text-white/60">
                {planets.length} planet{planets.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShow3D(!show3D)}
                className="relative border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
              >
                {show3D ? 'Hide' : 'Show'} 3D
              </button>
              <button
                onClick={fetchPlanets}
                disabled={loading}
                className="relative border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-sm font-bold uppercase tracking-wider overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-y-0 active:translate-x-0"
              >
                <span className="relative z-10">{loading ? 'Loading...' : 'Apply'}</span>
                <span className="absolute inset-0 flex items-center justify-center text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">
                  {loading ? 'Loading...' : 'Apply'}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                Discovery Method
              </label>
              <select
                value={discoveryMethod}
                onChange={(e) => setDiscoveryMethod(e.target.value)}
                className="w-full p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold uppercase text-sm"
              >
                {discoveryMethods.map((method) => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                Discovery Facility
              </label>
              <select
                value={discoveryFacility}
                onChange={(e) => setDiscoveryFacility(e.target.value)}
                className="w-full p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold uppercase text-sm"
              >
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>{facility.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                Transit Status
              </label>
              <select
                value={transitFlag}
                onChange={(e) => setTransitFlag(e.target.value)}
                className="w-full p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold uppercase text-sm"
              >
                <option value="all">All Planets</option>
                <option value="1">Transiting Only</option>
                <option value="0">Non-Transiting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                Planet Radius (Earth Radii)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minRadius}
                  onChange={(e) => setMinRadius(e.target.value)}
                  className="w-1/2 p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxRadius}
                  onChange={(e) => setMaxRadius(e.target.value)}
                  className="w-1/2 p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                Planet Mass (Earth Masses)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minMass}
                  onChange={(e) => setMinMass(e.target.value)}
                  className="w-1/2 p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxMass}
                  onChange={(e) => setMaxMass(e.target.value)}
                  className="w-1/2 p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                Equilibrium Temp (K)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minTemp}
                  onChange={(e) => setMinTemp(e.target.value)}
                  className="w-1/2 p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxTemp}
                  onChange={(e) => setMaxTemp(e.target.value)}
                  className="w-1/2 p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                Results Limit
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold uppercase text-sm"
              >
                <option value="50">50 planets</option>
                <option value="100">100 planets</option>
                <option value="200">200 planets</option>
                <option value="500">500 planets</option>
              </select>
            </div>
          </div>
        </div>

        {show3D && selectedPlanet && (
          <div className="mb-8">
            <ExoplanetVisualization planetData={selectedPlanet} />
          </div>
        )}

        {error && (
          <div className="border-4 border-red-600 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-6 py-4 mb-8">
            <strong className="font-bold uppercase tracking-wider">Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-12 w-12 border-4 border-black dark:border-white border-t-transparent"></div>
            <p className="mt-4 font-bold uppercase tracking-wider text-sm">Querying exoplanet database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {planets.map((planet, index) => (
              <div
                key={index}
                onClick={() => setSelectedPlanet(planet)}
                className={`border-4 border-black dark:border-white bg-white dark:bg-black transition-all duration-300 cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 ${selectedPlanet === planet ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] -translate-y-1 -translate-x-1' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold uppercase tracking-tight mb-1">
                        {planet.pl_name}
                      </h3>
                      <p className="text-sm font-medium text-black/60 dark:text-white/60">
                        Orbiting {planet.hostname}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="px-3 py-1.5 border-2 border-black dark:border-white bg-white dark:bg-black text-xs font-bold uppercase">
                        {getPlanetType(planet.pl_rade)}
                      </span>
                      {planet.tran_flag === 1 && (
                        <span className="px-3 py-1.5 border-2 border-green-600 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-bold uppercase">
                          Transiting
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Radius</p>
                      <p className="text-lg font-semibold">{formatNumber(planet.pl_rade)} R⊕</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Mass</p>
                      <p className="text-lg font-semibold">{formatNumber(planet.pl_bmasse)} M⊕</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Orbital Period</p>
                      <p className="text-lg font-semibold">{formatNumber(planet.pl_orbper, 1)} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Eq. Temp</p>
                      <p className="text-lg font-semibold">{formatNumber(planet.pl_eqt, 0)} K</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Discovery</p>
                      <p className="text-sm font-medium">{planet.discoverymethod || 'N/A'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{planet.disc_year || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Facility</p>
                      <p className="text-sm font-medium">{planet.disc_facility || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Distance</p>
                      <p className="text-sm font-medium">{formatNumber(planet.sy_dist, 1)} parsecs</p>
                    </div>
                  </div>

                  {planet.pl_orbsmax && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Semi-Major Axis:</span>
                          <span className="ml-2 font-medium">{formatNumber(planet.pl_orbsmax, 3)} AU</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Eccentricity:</span>
                          <span className="ml-2 font-medium">{formatNumber(planet.pl_orbeccen, 3)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Stellar Mass:</span>
                          <span className="ml-2 font-medium">{formatNumber(planet.st_mass, 2)} M☉</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && planets.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#333333] rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No exoplanets found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

