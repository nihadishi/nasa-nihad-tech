'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the 3D viewer to avoid SSR issues with Three.js
const Satellite3DViewer = dynamic(() => import('@/components/Satellite3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
      <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent"></div>
      <p className="mt-4 font-bold uppercase tracking-wider text-sm">Loading 3D Viewer...</p>
    </div>
  )
});

// Import the charts component
const SatelliteCharts = dynamic(() => import('@/components/SatelliteCharts'), {
  ssr: false,
  loading: () => (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center">
      <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent"></div>
      <p className="mt-4 font-bold uppercase tracking-wider text-sm">Loading Charts...</p>
    </div>
  )
});

export default function SSCPage() {
  const [satellites, setSatellites] = useState([]);
  const [selectedSatellites, setSelectedSatellites] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [coordinateSystem, setCoordinateSystem] = useState('GEO');
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSatellites, setLoadingSatellites] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSatellites();
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    setStartDate(yesterday.toISOString().slice(0, 16));
    setEndDate(now.toISOString().slice(0, 16));
  }, []);

  const fetchSatellites = async () => {
    setLoadingSatellites(true);
    setError(null);
    
    try {
      console.log('🛰️ Starting satellite fetch...');
      console.log('URL: https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories');
      
      const response = await fetch('https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ Response received! Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Data received. Type:', typeof data, 'Is array:', Array.isArray(data));
      
      let observatories = [];
      
      if (Array.isArray(data) && data.length > 1 && data[1] && data[1].Observatory) {
        const obs = data[1].Observatory;
        if (Array.isArray(obs) && obs.length > 1 && obs[0] === 'java.util.ArrayList') {
          observatories = obs[1] || [];
        }
      } else if (data.Observatory) {
        const obs = data.Observatory;
        if (Array.isArray(obs) && obs.length > 1 && obs[0] === 'java.util.ArrayList') {
          observatories = obs[1] || [];
        } else if (Array.isArray(obs)) {
          observatories = obs;
        }
      }
      
      console.log('🎉 SUCCESS! Loaded', observatories.length, 'satellites');
      if (observatories.length > 0) {
        console.log('First satellite:', observatories[0]);
      }
      
      setSatellites(observatories);
      setLoadingSatellites(false);
      
      if (observatories.length === 0) {
        setError('API responded but no satellites found. The SSC API may be experiencing issues.');
      }
    } catch (err) {
      console.error('❌ FETCH FAILED:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      setError(`Cannot connect to SSC API. Please check your internet connection or try again later. Error: ${err.message}`);
      setLoadingSatellites(false);
    }
  };

  const toggleSatellite = (satId) => {
    setSelectedSatellites(prev => 
      prev.includes(satId) 
        ? prev.filter(id => id !== satId)
        : [...prev, satId]
    );
  };

  const fetchLocations = async () => {
    if (selectedSatellites.length === 0) {
      setError('Please select at least one satellite');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const satelliteSpecs = selectedSatellites.map(id => [
        "gov.nasa.gsfc.sscweb.schema.SatelliteSpecification",
        {
          "Id": id,
          "ResolutionFactor": 1
        }
      ]);

      const coordinateOptions = [
        ["gov.nasa.gsfc.sscweb.schema.FilteredCoordinateOptions", { "CoordinateSystem": coordinateSystem, "Component": "X" }],
        ["gov.nasa.gsfc.sscweb.schema.FilteredCoordinateOptions", { "CoordinateSystem": coordinateSystem, "Component": "Y" }],
        ["gov.nasa.gsfc.sscweb.schema.FilteredCoordinateOptions", { "CoordinateSystem": coordinateSystem, "Component": "Z" }],
        ["gov.nasa.gsfc.sscweb.schema.FilteredCoordinateOptions", { "CoordinateSystem": coordinateSystem, "Component": "LAT" }],
        ["gov.nasa.gsfc.sscweb.schema.FilteredCoordinateOptions", { "CoordinateSystem": coordinateSystem, "Component": "LON" }],
        ["gov.nasa.gsfc.sscweb.schema.FilteredCoordinateOptions", { "CoordinateSystem": coordinateSystem, "Component": "LOCAL_TIME" }]
      ];

      const requestBody = [
        "gov.nasa.gsfc.sscweb.schema.DataRequest",
        {
          "Description": "Location request",
          "TimeInterval": [
            "gov.nasa.gsfc.sscweb.schema.TimeInterval",
            {
              "Start": ["javax.xml.datatype.XMLGregorianCalendar", new Date(startDate).toISOString()],
              "End": ["javax.xml.datatype.XMLGregorianCalendar", new Date(endDate).toISOString()]
            }
          ],
          "Satellites": ["java.util.ArrayList", satelliteSpecs],
          "OutputOptions": [
            "gov.nasa.gsfc.sscweb.schema.OutputOptions",
            {
              "AllLocationFilters": false,
              "CoordinateOptions": ["java.util.ArrayList", coordinateOptions],
              "MinMaxPoints": 2
            }
          ]
        }
      ];

      const response = await fetch('/api/ssc/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setLocationData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch location data');
    } finally {
      setLoading(false);
    }
  };


  const formatCoordinate = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] text-black dark:text-white" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 border-b-4 border-slate-700 dark:border-slate-600 pb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Satellite Tracking</p>
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4">NASA SSC</h1>
          <p className="text-sm font-medium uppercase tracking-wider text-black/60 dark:text-white/60">
            Satellite Situation Center
          </p>
          <p className="mt-6 leading-relaxed max-w-4xl">
            Access real-time and historical spacecraft location data from NASA&apos;s Satellite Situation Center. 
            Track satellites and spacecraft across multiple coordinate systems.
          </p>
        </div>

        <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-6 border-b-2 border-slate-700 dark:border-slate-600 pb-2">
            Query Parameters
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                Start Date/Time
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
                End Date/Time
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
              Coordinate System
            </label>
            <select
              value={coordinateSystem}
              onChange={(e) => setCoordinateSystem(e.target.value)}
              className="w-full p-2.5 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white font-bold"
            >
              <option value="GEO">Geographic (GEO)</option>
              <option value="GM">Geomagnetic (GM)</option>
              <option value="GSE">Geocentric Solar Ecliptic (GSE)</option>
              <option value="GSM">Geocentric Solar Magnetospheric (GSM)</option>
              <option value="SM">Solar Magnetic (SM)</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold mb-4 uppercase tracking-wider">
              Select Satellites ({selectedSatellites.length} selected)
            </label>
            <div className="max-h-64 overflow-y-auto border-4 border-slate-700 dark:border-slate-600 p-4">
              {loadingSatellites ? (
                <div className="text-center py-8 text-black/60 dark:text-white/60">
                  <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-600 dark:border-blue-500 border-t-transparent mb-2"></div>
                  <p className="text-sm font-bold uppercase">Loading satellites...</p>
                  <p className="text-xs mt-2">This may take a few seconds</p>
                </div>
              ) : satellites.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm font-bold uppercase mb-4">No satellites loaded</p>
                  <button
                    onClick={fetchSatellites}
                    className="border-2 border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
                  >
                    Retry Loading
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {satellites.map((sat, index) => {
                    const satId = sat[1]?.Id || sat.Id;
                    const satName = sat[1]?.Name || sat.Name || satId;
                    
                    return (
                      <button
                        key={satId || index}
                        onClick={() => toggleSatellite(satId)}
                        className={`p-2 text-xs font-bold uppercase transition-all border-2 ${
                          selectedSatellites.includes(satId)
                            ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white shadow-[2px_2px_0px_0px_rgba(37,99,235,1)]'
                            : 'border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white hover:shadow-[2px_2px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                        }`}
                      >
                        {satName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={fetchLocations}
            disabled={loading || selectedSatellites.length === 0}
            className="w-full relative border-4 border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 hover:-translate-x-1"
          >
            {loading ? 'Fetching Data...' : 'Get Locations & Visualize'}
          </button>

          <div className="mt-4 p-4 border-2 border-slate-700 dark:border-slate-600 bg-blue-50 dark:bg-blue-950/20">
            <p className="text-xs text-black/70 dark:text-white/70">
              <strong className="font-bold">💡 Tip:</strong> After fetching locations, you&apos;ll see interactive 3D trajectory visualization, 
              time-series charts, and detailed coordinate data. The SSC Graph API is currently unavailable, but our visualizations 
              provide superior interactive analysis!
            </p>
          </div>
        </div>

        {error && (
          <div className="border-4 border-red-600 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-6 py-4 mb-8">
            <strong className="font-bold uppercase tracking-wider">Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent"></div>
            <p className="mt-4 font-bold uppercase tracking-wider text-sm">Loading location data...</p>
          </div>
        )}

        {!loading && locationData?.[1]?.Result?.[1] && (
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">
              Location Results
            </h2>

            {/* 3D Visualization */}
            <div className="mb-8">
              <Satellite3DViewer locationData={locationData} />
            </div>

            {/* 2D Charts */}
            <div className="mb-8">
              <SatelliteCharts locationData={locationData} coordinateSystem={coordinateSystem} />
            </div>
            
            {/* Data Tables */}
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4">
              Detailed Coordinate Data
            </h3>
            
            {(locationData[1].Result[1].Data?.[1] || []).map((satDataArray, index) => {
              const satData = satDataArray[1];
              if (!satData || !satData.Id) return null;
              
              const coords = satData.Coordinates?.[1]?.[0]?.[1];
              const times = satData.Time?.[1] || [];
              
              return (
                <div
                  key={index}
                  className="mb-8 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6"
                >
                  <h3 className="text-xl font-bold mb-4 border-l-4 border-blue-600 dark:border-blue-500 pl-4">
                    {satData.Id}
                  </h3>

                  {coords && (
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider mb-3">
                        {coordinateSystem} Coordinates
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b-2 border-slate-700 dark:border-slate-600">
                              <th className="text-left p-2 font-bold uppercase text-xs">Time</th>
                              <th className="text-right p-2 font-bold uppercase text-xs">X</th>
                              <th className="text-right p-2 font-bold uppercase text-xs">Y</th>
                              <th className="text-right p-2 font-bold uppercase text-xs">Z</th>
                              <th className="text-right p-2 font-bold uppercase text-xs">Lat</th>
                              <th className="text-right p-2 font-bold uppercase text-xs">Lon</th>
                            </tr>
                          </thead>
                          <tbody>
                            {times.slice(0, 10).map((timeArray, idx) => {
                              const time = timeArray[1] || timeArray;
                              const xValues = coords.X?.[1] || [];
                              const yValues = coords.Y?.[1] || [];
                              const zValues = coords.Z?.[1] || [];
                              const latValues = coords.Latitude?.[1] || [];
                              const lonValues = coords.Longitude?.[1] || [];
                              
                              return (
                                <tr key={idx} className="border-b border-slate-700/30 dark:border-slate-600/30">
                                  <td className="p-2 font-mono text-xs">{time}</td>
                                  <td className="p-2 text-right font-mono">{formatCoordinate(xValues[idx])}</td>
                                  <td className="p-2 text-right font-mono">{formatCoordinate(yValues[idx])}</td>
                                  <td className="p-2 text-right font-mono">{formatCoordinate(zValues[idx])}</td>
                                  <td className="p-2 text-right font-mono">{formatCoordinate(latValues[idx])}</td>
                                  <td className="p-2 text-right font-mono">{formatCoordinate(lonValues[idx])}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {times.length > 10 && (
                        <p className="text-sm mt-2 text-black/60 dark:text-white/60">
                          Showing 10 of {times.length} data points
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

