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
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-black text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          NASA Exoplanet Archive
        </h1>
        <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Explore thousands of confirmed exoplanets discovered by missions like Kepler, TESS, and more. 
          Filter by discovery method, size, temperature, and other characteristics.
        </p>

        <div className="bg-white dark:bg-[#333333] p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filters</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {planets.length} planet{planets.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShow3D(!show3D)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                {show3D ? 'Hide' : 'Show'} 3D View
              </button>
              <button
                onClick={fetchPlanets}
                disabled={loading}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 font-medium"
              >
                {loading ? 'Loading...' : 'Apply Filters'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Discovery Method
              </label>
              <select
                value={discoveryMethod}
                onChange={(e) => setDiscoveryMethod(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
              >
                {discoveryMethods.map((method) => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Discovery Facility
              </label>
              <select
                value={discoveryFacility}
                onChange={(e) => setDiscoveryFacility(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
              >
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>{facility.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Transit Status
              </label>
              <select
                value={transitFlag}
                onChange={(e) => setTransitFlag(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
              >
                <option value="all">All Planets</option>
                <option value="1">Transiting Only</option>
                <option value="0">Non-Transiting</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Planet Radius (Earth Radii)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minRadius}
                  onChange={(e) => setMinRadius(e.target.value)}
                  className="w-1/2 p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxRadius}
                  onChange={(e) => setMaxRadius(e.target.value)}
                  className="w-1/2 p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Planet Mass (Earth Masses)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minMass}
                  onChange={(e) => setMinMass(e.target.value)}
                  className="w-1/2 p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxMass}
                  onChange={(e) => setMaxMass(e.target.value)}
                  className="w-1/2 p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Equilibrium Temp (K)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minTemp}
                  onChange={(e) => setMinTemp(e.target.value)}
                  className="w-1/2 p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxTemp}
                  onChange={(e) => setMaxTemp(e.target.value)}
                  className="w-1/2 p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Results Limit
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium"
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
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Querying exoplanet database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {planets.map((planet, index) => (
              <div
                key={index}
                onClick={() => setSelectedPlanet(planet)}
                className={`bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 ${getPlanetColor(planet.pl_rade)} ${selectedPlanet === planet ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {planet.pl_name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Orbiting {planet.hostname}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700">
                        {getPlanetType(planet.pl_rade)}
                      </span>
                      {planet.tran_flag === 1 && (
                        <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium border border-green-200 dark:border-green-800">
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

