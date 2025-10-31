'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ISS3DViewer = dynamic(() => import('@/components/ISS3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
      <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent"></div>
      <p className="mt-4 font-bold uppercase tracking-wider text-sm">Loading ISS Tracker...</p>
    </div>
  )
});

export default function ISSPage() {
  const [issData, setIssData] = useState(null);
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchISSData = async () => {
      try {
        // Fetch ISS position
        const response = await fetch('/api/iss');
        const data = await response.json();
        setIssData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchAstronauts = async () => {
      try {
        const response = await fetch('/api/iss/astronauts');
        const astroData = await response.json();
        setAstronauts(astroData.people || []);
      } catch (err) {
        console.error('Could not fetch astronauts:', err);
      }
    };

    fetchISSData();
    fetchAstronauts();

    // Update every 5 seconds
    const interval = setInterval(() => {
      fetchISSData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] text-black dark:text-white">
      <section className="border-b-4 border-black dark:border-white bg-white dark:bg-black py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-bold uppercase tracking-widest mb-3">ISS TRACKER</div>
          <h1 className="text-5xl font-bold uppercase tracking-tight md:text-6xl mb-4">
            International Space<br />Station
          </h1>
          <p className="text-lg font-medium max-w-2xl">
            Real-time tracking of the ISS position, altitude, and crew information
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-12 text-center">
              <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent"></div>
              <p className="mt-4 font-bold uppercase tracking-wider">Loading ISS Data...</p>
            </div>
          ) : error ? (
            <div className="border-4 border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/20 p-12 text-center">
              <p className="text-lg font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Error: {error}
              </p>
            </div>
          ) : (
            <>
              {/* Live Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border-4 border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-6 text-center">
                  <div className="text-3xl mb-2">🌍</div>
                  <div className="text-sm font-bold uppercase tracking-wider mb-2">Latitude</div>
                  <div className="text-3xl font-bold">{issData?.latitude?.toFixed(4) || 'N/A'}°</div>
                </div>
                <div className="border-4 border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/20 p-6 text-center">
                  <div className="text-3xl mb-2">🌎</div>
                  <div className="text-sm font-bold uppercase tracking-wider mb-2">Longitude</div>
                  <div className="text-3xl font-bold">{issData?.longitude?.toFixed(4) || 'N/A'}°</div>
                </div>
                <div className="border-4 border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-950/20 p-6 text-center">
                  <div className="text-3xl mb-2">📡</div>
                  <div className="text-sm font-bold uppercase tracking-wider mb-2">Velocity</div>
                  <div className="text-3xl font-bold">{issData?.velocity?.toFixed(0) || 'N/A'} km/h</div>
                </div>
              </div>

              {/* Astronauts */}
              {astronauts.length > 0 && (
                <div className="border-4 border-black dark:border-white bg-white dark:bg-black mb-8 p-6">
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-black dark:border-white">
                    👨‍🚀 Current Crew: {astronauts.length} Astronauts
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {astronauts.map((astro, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-4xl mb-2">👨‍🚀</div>
                        <div className="text-sm font-bold">{astro.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3D Visualization */}
              {issData && (
                <div className="mb-8">
                  <ISS3DViewer issData={issData} />
                </div>
              )}

              {/* Info */}
              <div className="border-4 border-yellow-600 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-3">ℹ️ ISS Facts</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Altitude:</strong> ~408 km (253 miles) above Earth</li>
                  <li><strong>Orbital Speed:</strong> 27,600 km/h (17,100 mph)</li>
                  <li><strong>Orbital Period:</strong> 92.68 minutes (15.5 orbits per day)</li>
                  <li><strong>First Launch:</strong> November 20, 1998</li>
                  <li><strong>Mass:</strong> ~450,000 kg (990,000 lbs)</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

