'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const OpenSkyMap = dynamic(() => import('@/components/OpenSkyMap'), {
  ssr: false,
  loading: () => (
    <div className="border-4 border-black dark:border-white bg-white dark:bg-black h-[600px] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent mb-4"></div>
        <p className="font-bold uppercase tracking-wider text-sm">Loading Map...</p>
      </div>
    </div>
  ),
});

export default function OpenSkyPage() {
  const [aircraftData, setAircraftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    inAir: 0,
    onGround: 0,
  });

  // Parse state vector array to object
  const parseStateVector = (state) => {
    if (!state || state.length < 17) return null;
    return {
      icao24: state[0],
      callsign: state[1]?.trim() || 'N/A',
      origin_country: state[2] || 'Unknown',
      time_position: state[3],
      last_contact: state[4],
      longitude: state[5],
      latitude: state[6],
      baro_altitude: state[7], // meters
      on_ground: state[8],
      velocity: state[9], // m/s
      true_track: state[10], // degrees
      vertical_rate: state[11], // m/s
      sensors: state[12],
      geo_altitude: state[13], // meters
      squawk: state[14],
      spi: state[15],
      position_source: state[16],
    };
  };

  const fetchAircraftData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/opensky?endpoint=states/all');
      const data = await response.json();

      if (data.error) {
        // Handle rate limiting specifically
        if (data.error.includes('429') || data.error.includes('Too many requests')) {
          setError('Rate limit reached. Please wait before refreshing. The map will auto-update in 30 seconds.');
        } else {
          setError(data.error);
        }
        setLoading(false);
        return;
      }

      // Parse states array
      const states = data.states || [];
      const parsedStates = states
        .map(parseStateVector)
        .filter(state => state !== null); // Filter out invalid states

      setAircraftData(parsedStates);
      
      // Calculate statistics
      const inAir = parsedStates.filter(s => !s.on_ground && s.baro_altitude !== null).length;
      const onGround = parsedStates.filter(s => s.on_ground).length;
      
      setStats({
        total: parsedStates.length,
        inAir,
        onGround,
      });

      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAircraftData();
    
    // Auto-refresh every 30 seconds (OpenSky API rate limit: ~10 requests per minute)
    const interval = setInterval(fetchAircraftData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatAltitude = (meters) => {
    if (meters === null) return 'N/A';
    const feet = meters * 3.28084;
    return `${feet.toFixed(0)} ft (${meters.toFixed(0)} m)`;
  };

  const formatSpeed = (mps) => {
    if (mps === null) return 'N/A';
    const kmh = mps * 3.6;
    const mph = mps * 2.237;
    return `${kmh.toFixed(0)} km/h (${mph.toFixed(0)} mph)`;
  };

  const formatCoordinate = (coord) => {
    if (coord === null) return 'N/A';
    return coord.toFixed(4);
  };

  return (
    <main className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] text-black dark:text-white">
      {/* Header Section */}
      <section className="border-b-4 border-black dark:border-white bg-white dark:bg-black py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-bold uppercase tracking-widest mb-3">OPENSKY NETWORK</div>
          <h1 className="text-5xl font-bold uppercase tracking-tight md:text-6xl mb-4">
            ADS-B Aircraft<br />Tracking
          </h1>
          <p className="text-lg font-medium max-w-2xl mb-4">
            Real-time aircraft position data from the OpenSky Network community-based ADS-B receiver network
          </p>
          {lastUpdate && (
            <div className="text-sm font-bold uppercase tracking-wider text-black/60 dark:text-white/60">
              Last Updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border-4 border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-6 text-center">
              <div className="text-3xl mb-2">✈️</div>
              <div className="text-sm font-bold uppercase tracking-wider mb-2">Total Aircraft</div>
              <div className="text-3xl font-bold">{stats.total}</div>
            </div>
            <div className="border-4 border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-950/20 p-6 text-center">
              <div className="text-3xl mb-2">🛫</div>
              <div className="text-sm font-bold uppercase tracking-wider mb-2">In Air</div>
              <div className="text-3xl font-bold">{stats.inAir}</div>
            </div>
            <div className="border-4 border-yellow-600 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-6 text-center">
              <div className="text-3xl mb-2">🛬</div>
              <div className="text-sm font-bold uppercase tracking-wider mb-2">On Ground</div>
              <div className="text-3xl font-bold">{stats.onGround}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm font-bold uppercase tracking-wider">
                Auto-refresh: Every 30 seconds (OpenSky API rate limit)
              </div>
              <button
                onClick={fetchAircraftData}
                disabled={loading}
                className="border-4 border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 text-sm font-bold uppercase tracking-wider hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 disabled:hover:translate-x-0"
              >
                {loading ? 'Loading...' : '🔄 Refresh Now'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="border-4 border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/20 p-6 mb-8">
              <p className="text-lg font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Error: {error}
              </p>
            </div>
          )}

          {/* Map Visualization - Always render to prevent re-initialization */}
          <div className="mb-8">
            <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-4 mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-2">
                🗺️ Live Aircraft Map
              </h2>
              <p className="text-sm text-black/70 dark:text-white/70">
                Click on aircraft markers to view detailed information. Blue icons indicate aircraft in flight, gray icons indicate aircraft on ground.
              </p>
            </div>
            <OpenSkyMap aircraftData={loading ? [] : (aircraftData || [])} />
          </div>

          {/* Loading State */}
          {loading && aircraftData.length === 0 ? (
            <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-12 text-center">
              <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent"></div>
              <p className="mt-4 font-bold uppercase tracking-wider">Loading Aircraft Data...</p>
            </div>
          ) : (
            /* Aircraft Table */
            <div className="border-4 border-black dark:border-white bg-white dark:bg-black overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black dark:bg-white text-white dark:text-black">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-white dark:border-black">Callsign</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-white dark:border-black">Country</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-white dark:border-black">Latitude</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-white dark:border-black">Longitude</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-white dark:border-black">Altitude</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-white dark:border-black">Speed</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-white dark:border-black">Heading</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-white dark:border-black">Vertical Rate</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {aircraftData.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-sm font-bold uppercase tracking-wider">
                        No aircraft data available
                      </td>
                    </tr>
                  ) : (
                    aircraftData.slice(0, 100).map((aircraft, index) => (
                      <tr
                        key={aircraft.icao24 || index}
                        className="border-b-2 border-black dark:border-white hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <td className="px-4 py-3 text-sm font-bold border-r-2 border-black dark:border-white">
                          {aircraft.callsign}
                        </td>
                        <td className="px-4 py-3 text-sm border-r-2 border-black dark:border-white">
                          {aircraft.origin_country}
                        </td>
                        <td className="px-4 py-3 text-sm border-r-2 border-black dark:border-white">
                          {formatCoordinate(aircraft.latitude)}
                        </td>
                        <td className="px-4 py-3 text-sm border-r-2 border-black dark:border-white">
                          {formatCoordinate(aircraft.longitude)}
                        </td>
                        <td className="px-4 py-3 text-sm border-r-2 border-black dark:border-white">
                          {formatAltitude(aircraft.baro_altitude || aircraft.geo_altitude)}
                        </td>
                        <td className="px-4 py-3 text-sm border-r-2 border-black dark:border-white">
                          {formatSpeed(aircraft.velocity)}
                        </td>
                        <td className="px-4 py-3 text-sm border-r-2 border-black dark:border-white">
                          {aircraft.true_track !== null ? `${aircraft.true_track.toFixed(1)}°` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm border-r-2 border-black dark:border-white">
                          {aircraft.vertical_rate !== null ? `${(aircraft.vertical_rate * 3.28084).toFixed(0)} ft/min` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-block px-2 py-1 text-xs font-bold uppercase ${
                            aircraft.on_ground
                              ? 'bg-yellow-600 dark:bg-yellow-500 text-white'
                              : 'bg-green-600 dark:bg-green-500 text-white'
                          }`}>
                            {aircraft.on_ground ? 'On Ground' : 'In Air'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {aircraftData.length > 100 && (
                <div className="px-4 py-4 border-t-2 border-black dark:border-white bg-black/5 dark:bg-white/5 text-center text-sm font-bold uppercase tracking-wider">
                  Showing first 100 of {aircraftData.length} aircraft
                </div>
              )}
            </div>
          )}

          {/* Info Section */}
          <div className="border-4 border-yellow-600 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-6 mt-8">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3">ℹ️ About OpenSky Network</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>OpenSky Network:</strong> A non-profit community-based receiver network collecting ADS-B data</li>
              <li><strong>Data Source:</strong> Real-time aircraft position data from thousands of receivers worldwide</li>
              <li><strong>Coverage:</strong> Global coverage with emphasis on Europe and North America</li>
              <li><strong>Update Rate:</strong> Data updates approximately every 10 seconds</li>
              <li><strong>Limitations:</strong> Not all aircraft transmit ADS-B signals; coverage varies by region</li>
              <li><strong>API:</strong> Public REST API available at <a href="https://opensky-network.org" target="_blank" rel="noopener noreferrer" className="underline font-bold">opensky-network.org</a></li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

