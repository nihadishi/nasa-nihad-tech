'use client';

import { useState } from 'react';
import N2YO3DViewer from '@/components/N2YO3DViewer';

export default function N2YOPage() {
  const [activeTab, setActiveTab] = useState('above');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Form states for different endpoints
  const [tleForm, setTLEForm] = useState({ id: '25544' }); // ISS by default
  const [positionsForm, setPositionsForm] = useState({
    id: '25544',
    observer_lat: '41.702',
    observer_lng: '-76.014',
    observer_alt: '0',
    seconds: '300'
  });
  const [visualPassesForm, setVisualPassesForm] = useState({
    id: '25544',
    observer_lat: '41.702',
    observer_lng: '-76.014',
    observer_alt: '0',
    days: '10',
    min_visibility: '300'
  });
  const [radioPassesForm, setRadioPassesForm] = useState({
    id: '25544',
    observer_lat: '41.702',
    observer_lng: '-76.014',
    observer_alt: '0',
    days: '10',
    min_elevation: '10'
  });
  const [aboveForm, setAboveForm] = useState({
    observer_lat: '41.702',
    observer_lng: '-76.014',
    observer_alt: '0',
    search_radius: '45',
    category_id: '0'
  });
  const handleSubmit = async (endpoint, formData) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const params = new URLSearchParams({
        endpoint,
        ...formData
      });

      const response = await fetch(`/api/n2yo?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'An error occurred');
        return;
      }

      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const FormSection = ({ title, endpoint, form, setForm, fields, onSubmit }) => (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
      <h2 className="text-xl font-bold uppercase tracking-wider mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-bold uppercase mb-1 text-black dark:text-white">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type || 'text'}
              value={form[field.name] || ''}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {field.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{field.description}</p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onSubmit(endpoint, form)}
        disabled={loading}
        className="px-6 py-3 font-bold uppercase tracking-wider border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] py-8">
      <div className="mx-auto max-w-[1800px] px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-4 text-black dark:text-white">
            N2YO Satellite Tracking
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Track satellites in real-time using N2YO API
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {[
            { id: 'above', label: 'What\'s Above?' },
            { id: 'tle', label: 'TLE (Two Line Elements)' },
            { id: 'positions', label: 'Satellite Positions' },
            { id: 'visualpasses', label: 'Visual Passes' },
            { id: 'radiopasses', label: 'Radio Passes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setData(null);
                setError(null);
              }}
              className={`px-4 py-2 font-bold uppercase tracking-wider border-2 transition-all ${
                activeTab === tab.id
                  ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                  : 'border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Forms */}
        {activeTab === 'above' && (
          <FormSection
            title="What's Above?"
            endpoint="above"
            form={aboveForm}
            setForm={setAboveForm}
            fields={[
              { name: 'observer_lat', label: 'Observer Latitude', placeholder: '41.702', required: true },
              { name: 'observer_lng', label: 'Observer Longitude', placeholder: '-76.014', required: true },
              { name: 'observer_alt', label: 'Observer Altitude (m)', placeholder: '0' },
              { name: 'search_radius', label: 'Search Radius (deg)', placeholder: '45', description: 'Search radius in degrees (max 90)' },
              { name: 'category_id', label: 'Category ID', placeholder: '0', description: '0=All, 1=Amateur radio, 2=Beidou, 3=Brightest, 4=Cubesat, 5=Earth Science, 6=Galileo, 7=Geostationary, 8=GPS, 9=Glonass, 10=Iridium, 11=ISS, 12=LEO, 13=Military, 14=Molniya, 15=Navy, 16=NOAA, 17=O3B, 18=OneWeb, 19=Starlink, 20=Weather' }
            ]}
            onSubmit={handleSubmit}
          />
        )}

        {activeTab === 'tle' && (
          <FormSection
            title="Get TLE (Two Line Elements)"
            endpoint="tle"
            form={tleForm}
            setForm={setTLEForm}
            fields={[
              {
                name: 'id',
                label: 'NORAD ID',
                placeholder: '25544 (ISS)',
                description: 'NORAD catalog number (e.g., 25544 for ISS)',
                required: true
              }
            ]}
            onSubmit={handleSubmit}
          />
        )}

        {activeTab === 'positions' && (
          <FormSection
            title="Get Satellite Positions"
            endpoint="positions"
            form={positionsForm}
            setForm={setPositionsForm}
            fields={[
              { name: 'id', label: 'NORAD ID', placeholder: '25544', required: true },
              { name: 'observer_lat', label: 'Observer Latitude', placeholder: '41.702', required: true },
              { name: 'observer_lng', label: 'Observer Longitude', placeholder: '-76.014', required: true },
              { name: 'observer_alt', label: 'Observer Altitude (m)', placeholder: '0', description: 'Altitude above sea level in meters' },
              { name: 'seconds', label: 'Seconds', placeholder: '300', description: 'Number of future positions (limit 300)' }
            ]}
            onSubmit={handleSubmit}
          />
        )}

        {activeTab === 'visualpasses' && (
          <FormSection
            title="Get Visual Passes"
            endpoint="visualpasses"
            form={visualPassesForm}
            setForm={setVisualPassesForm}
            fields={[
              { name: 'id', label: 'NORAD ID', placeholder: '25544', required: true },
              { name: 'observer_lat', label: 'Observer Latitude', placeholder: '41.702', required: true },
              { name: 'observer_lng', label: 'Observer Longitude', placeholder: '-76.014', required: true },
              { name: 'observer_alt', label: 'Observer Altitude (m)', placeholder: '0' },
              { name: 'days', label: 'Days', placeholder: '10', description: 'Number of days of prediction (max 10)' },
              { name: 'min_visibility', label: 'Min Visibility (sec)', placeholder: '300', description: 'Minimum seconds satellite should be visible' }
            ]}
            onSubmit={handleSubmit}
          />
        )}

        {activeTab === 'radiopasses' && (
          <FormSection
            title="Get Radio Passes"
            endpoint="radiopasses"
            form={radioPassesForm}
            setForm={setRadioPassesForm}
            fields={[
              { name: 'id', label: 'NORAD ID', placeholder: '25544', required: true },
              { name: 'observer_lat', label: 'Observer Latitude', placeholder: '41.702', required: true },
              { name: 'observer_lng', label: 'Observer Longitude', placeholder: '-76.014', required: true },
              { name: 'observer_alt', label: 'Observer Altitude (m)', placeholder: '0' },
              { name: 'days', label: 'Days', placeholder: '10', description: 'Number of days of prediction (max 10)' },
              { name: 'min_elevation', label: 'Min Elevation (deg)', placeholder: '10', description: 'Minimum elevation for highest point of pass' }
            ]}
            onSubmit={handleSubmit}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 border-4 border-red-600 bg-red-50 dark:bg-red-900/20 p-4">
            <p className="font-bold text-red-600 dark:text-red-400">Error: {error}</p>
            {data?.details && (
              <p className="text-sm text-red-500 dark:text-red-300 mt-2">{data.details}</p>
            )}
          </div>
        )}

        {/* Results Display */}
        {data && !error && (
          <div className="mt-6 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-black dark:text-white">
              Results
            </h2>

            {/* 3D Visualization */}
            {(activeTab === 'positions' || activeTab === 'above') && (
              <div className="mb-6">
                <h3 className="text-lg font-bold uppercase mb-4 text-black dark:text-white">
                  3D Visualization
                </h3>
                <N2YO3DViewer
                  positions={activeTab === 'positions' ? data.positions : []}
                  observer={
                    activeTab === 'positions'
                      ? {
                          lat: parseFloat(positionsForm.observer_lat),
                          lng: parseFloat(positionsForm.observer_lng)
                        }
                      : {
                          lat: parseFloat(aboveForm.observer_lat),
                          lng: parseFloat(aboveForm.observer_lng)
                        }
                  }
                  satellites={activeTab === 'above' ? data.above : []}
                />
              </div>
            )}

            {/* Positions Summary */}
            {activeTab === 'positions' && data.positions && data.positions.length > 0 && (() => {
              const positions = data.positions;
              const altitudes = positions.map(p => p.sataltitude);
              const elevations = positions.map(p => p.elevation);
              const minAlt = Math.min(...altitudes);
              const maxAlt = Math.max(...altitudes);
              const avgAlt = altitudes.reduce((a, b) => a + b, 0) / altitudes.length;
              const maxElev = Math.max(...elevations);
              const minElev = Math.min(...elevations);
              const avgElev = elevations.reduce((a, b) => a + b, 0) / elevations.length;
              
              // Calculate total distance traveled (approximate)
              let totalDistance = 0;
              for (let i = 1; i < positions.length; i++) {
                const p1 = positions[i - 1];
                const p2 = positions[i];
                const lat1 = p1.satlatitude * Math.PI / 180;
                const lat2 = p2.satlatitude * Math.PI / 180;
                const dLat = lat2 - lat1;
                const dLon = (p2.satlongitude - p1.satlongitude) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = 6371 * c; // Earth radius in km
                totalDistance += distance;
              }
              
              const firstPos = positions[0];
              const lastPos = positions[positions.length - 1];
              const timeSpan = (lastPos.timestamp - firstPos.timestamp) / 60; // minutes
              
              return (
                <div className="mb-6">
                  <h3 className="text-lg font-bold uppercase mb-4 text-black dark:text-white">
                    Positions Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Positions</p>
                      <p className="text-lg font-bold text-black dark:text-white">{positions.length}</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Min Altitude</p>
                      <p className="text-lg font-bold text-black dark:text-white">{minAlt.toFixed(2)} km</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max Altitude</p>
                      <p className="text-lg font-bold text-black dark:text-white">{maxAlt.toFixed(2)} km</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Altitude</p>
                      <p className="text-lg font-bold text-black dark:text-white">{avgAlt.toFixed(2)} km</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max Elevation</p>
                      <p className="text-lg font-bold text-black dark:text-white">{maxElev.toFixed(2)}°</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Time Span</p>
                      <p className="text-lg font-bold text-black dark:text-white">{timeSpan.toFixed(1)} min</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Distance</p>
                      <p className="text-lg font-bold text-black dark:text-white">{totalDistance.toFixed(2)} km</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Start Position</p>
                      <p className="text-sm font-bold text-black dark:text-white">
                        {firstPos.satlatitude.toFixed(2)}°, {firstPos.satlongitude.toFixed(2)}°
                      </p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">End Position</p>
                      <p className="text-sm font-bold text-black dark:text-white">
                        {lastPos.satlatitude.toFixed(2)}°, {lastPos.satlongitude.toFixed(2)}°
                      </p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Start Time</p>
                      <p className="text-xs font-bold text-black dark:text-white">
                        {new Date(firstPos.timestamp * 1000).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">End Time</p>
                      <p className="text-xs font-bold text-black dark:text-white">
                        {new Date(lastPos.timestamp * 1000).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Eclipsed Count</p>
                      <p className="text-lg font-bold text-black dark:text-white">
                        {positions.filter(p => p.eclipsed).length}
                      </p>
                    </div>
                  </div>
                  
                  {/* Positions Table - All Data */}
                  <div className="mb-6">
                    <h4 className="text-md font-bold uppercase mb-4 text-black dark:text-white">
                      All Positions ({positions.length} total)
                    </h4>
                    <div className="overflow-x-auto border-2 border-black dark:border-white max-h-[600px] overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-200 dark:bg-gray-800 sticky top-0 z-10">
                          <tr>
                            <th className="px-3 py-2 text-left font-bold text-black dark:text-white border-r-2 border-black dark:border-white">#</th>
                            <th className="px-3 py-2 text-left font-bold text-black dark:text-white border-r-2 border-black dark:border-white">Time</th>
                            <th className="px-3 py-2 text-left font-bold text-black dark:text-white border-r-2 border-black dark:border-white">Latitude</th>
                            <th className="px-3 py-2 text-left font-bold text-black dark:text-white border-r-2 border-black dark:border-white">Longitude</th>
                            <th className="px-3 py-2 text-left font-bold text-black dark:text-white border-r-2 border-black dark:border-white">Altitude (km)</th>
                            <th className="px-3 py-2 text-left font-bold text-black dark:text-white border-r-2 border-black dark:border-white">Azimuth (°)</th>
                            <th className="px-3 py-2 text-left font-bold text-black dark:text-white border-r-2 border-black dark:border-white">Elevation (°)</th>
                            <th className="px-3 py-2 text-left font-bold text-black dark:text-white border-r-2 border-black dark:border-white">RA (°)</th>
                            <th className="px-3 py-2 text-left font-bold text-black dark:text-white border-r-2 border-black dark:border-white">Dec (°)</th>
                            <th className="px-3 py-2 text-left font-bold text-black dark:text-white">Eclipsed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {positions.map((pos, idx) => (
                            <tr key={idx} className="border-t-2 border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <td className="px-3 py-2 text-black dark:text-white border-r-2 border-black dark:border-white font-bold">{idx + 1}</td>
                              <td className="px-3 py-2 text-black dark:text-white border-r-2 border-black dark:border-white whitespace-nowrap">
                                {new Date(pos.timestamp * 1000).toLocaleString()}
                              </td>
                              <td className="px-3 py-2 text-black dark:text-white border-r-2 border-black dark:border-white">{pos.satlatitude.toFixed(4)}</td>
                              <td className="px-3 py-2 text-black dark:text-white border-r-2 border-black dark:border-white">{pos.satlongitude.toFixed(4)}</td>
                              <td className="px-3 py-2 text-black dark:text-white border-r-2 border-black dark:border-white">{pos.sataltitude.toFixed(2)}</td>
                              <td className="px-3 py-2 text-black dark:text-white border-r-2 border-black dark:border-white">{pos.azimuth.toFixed(2)}</td>
                              <td className="px-3 py-2 text-black dark:text-white border-r-2 border-black dark:border-white">{pos.elevation.toFixed(2)}</td>
                              <td className="px-3 py-2 text-black dark:text-white border-r-2 border-black dark:border-white">{pos.ra?.toFixed(4) || 'N/A'}</td>
                              <td className="px-3 py-2 text-black dark:text-white border-r-2 border-black dark:border-white">{pos.dec?.toFixed(4) || 'N/A'}</td>
                              <td className="px-3 py-2 text-black dark:text-white text-center">
                                {pos.eclipsed ? (
                                  <span className="text-red-500 font-bold">Yes</span>
                                ) : (
                                  <span className="text-green-500">No</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
                      Scrollable table showing all {positions.length} positions
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Parsed Results for passes */}
            {(activeTab === 'visualpasses' || activeTab === 'radiopasses') && data.passes && (
              <div className="mb-6">
                <h3 className="text-lg font-bold uppercase mb-4 text-black dark:text-white">
                  Passes Summary ({data.passes.length} passes found)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.passes.map((pass, idx) => (
                    <div key={idx} className="border-2 border-black dark:border-white p-4 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] transition-all">
                      <p className="font-bold mb-3 text-lg text-black dark:text-white border-b-2 border-black dark:border-white pb-2">
                        Pass #{idx + 1}
                      </p>
                      
                      <div className="space-y-2 mb-3">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Start</p>
                          <p className="text-sm font-bold text-black dark:text-white">
                            {new Date(pass.startUTC * 1000).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            Azimuth: {pass.startAz?.toFixed(1)}° ({pass.startAzCompass})
                          </p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            Elevation: {pass.startEl?.toFixed(1)}°
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Maximum Elevation</p>
                          <p className="text-sm font-bold text-black dark:text-white">
                            {pass.maxEl?.toFixed(1)}° at {new Date(pass.maxUTC * 1000).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            Azimuth: {pass.maxAz?.toFixed(1)}° ({pass.maxAzCompass})
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">End</p>
                          <p className="text-sm font-bold text-black dark:text-white">
                            {new Date(pass.endUTC * 1000).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            Azimuth: {pass.endAz?.toFixed(1)}° ({pass.endAzCompass})
                          </p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            Elevation: {pass.endEl?.toFixed(1)}°
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-black dark:border-white">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                          <p className="text-sm font-bold text-black dark:text-white">
                            {pass.duration}s ({Math.round(pass.duration / 60)} min)
                          </p>
                        </div>
                        {pass.mag !== undefined && (
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Magnitude</p>
                            <p className="text-sm font-bold text-black dark:text-white">
                              {pass.mag.toFixed(1)}
                            </p>
                          </div>
                        )}
                        {pass.startVisibility && (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Visibility Starts</p>
                            <p className="text-xs font-bold text-black dark:text-white">
                              {new Date(pass.startVisibility * 1000).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Summary */}
            {data.info && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800">
                {data.info.satname && (
                  <p className="font-bold text-black dark:text-white">
                    {data.info.satname}
                  </p>
                )}
                {data.info.satid && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    NORAD ID: {data.info.satid}
                  </p>
                )}
                {data.info.transactionscount !== undefined && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Transactions: {data.info.transactionscount}/60 min
                  </p>
                )}
                {data.info.passescount !== undefined && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Passes Found: {data.info.passescount}
                  </p>
                )}
                {data.info.satellitescount !== undefined && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Satellites Found: {data.info.satellitescount}
                  </p>
                )}
              </div>
            )}

            {/* Above endpoint satellites list */}
            {activeTab === 'above' && data.above && data.above.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold uppercase mb-4 text-black dark:text-white">
                  Satellites Above ({data.above.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {data.above.map((sat) => (
                    <div key={sat.satid} className="border-2 border-black dark:border-white p-4">
                      <p className="font-bold mb-2 text-black dark:text-white">{sat.satname}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">NORAD ID: {sat.satid}</p>
                      {sat.intDesignator && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Designator: {sat.intDesignator}
                        </p>
                      )}
                      {sat.satlat !== undefined && sat.satlng !== undefined && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Position: {sat.satlat.toFixed(2)}°, {sat.satlng.toFixed(2)}°
                        </p>
                      )}
                      {sat.satalt !== undefined && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Altitude: {sat.satalt.toFixed(0)} km
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TLE Display */}
            {activeTab === 'tle' && data.tle && (() => {
              // Handle both escaped and actual newline characters
              let tleString = data.tle;
              if (tleString.includes('\\r\\n')) {
                tleString = tleString.replace(/\\r\\n/g, '\n');
              }
              const tleLines = tleString.split('\n').filter(line => line.trim());
              const line1 = tleLines[0] || '';
              const line2 = tleLines[1] || '';
              
              // Parse TLE Line 1
              const satNumber = line1.substring(2, 7).trim();
              const epochYear = '20' + line1.substring(18, 20);
              const epochDay = parseFloat(line1.substring(20, 32));
              const meanMotionDot = parseFloat(line1.substring(33, 43));
              
              // Parse TLE Line 2 (with safety checks)
              if (!line1 || !line2 || line1.length < 69 || line2.length < 69) {
                return (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold uppercase mb-4 text-black dark:text-white">
                      Two Line Element (TLE)
                    </h3>
                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm whitespace-pre-wrap border-2 border-gray-700">
                      {data.tle.replace(/\\r\\n/g, '\n')}
                    </div>
                  </div>
                );
              }
              
              const inclination = parseFloat(line2.substring(8, 16)) || 0;
              const raan = parseFloat(line2.substring(17, 25)) || 0;
              const eccString = line2.substring(26, 33).trim();
              const eccentricity = parseFloat('0.' + eccString) || 0;
              const argOfPerigee = parseFloat(line2.substring(34, 42)) || 0;
              const meanAnomaly = parseFloat(line2.substring(43, 51)) || 0;
              const meanMotion = parseFloat(line2.substring(52, 63)) || 0;
              
              // Calculate derived values
              const orbitalPeriod = meanMotion > 0 ? 1440 / meanMotion : 0; // minutes
              const semiMajorAxis = meanMotion > 0 ? Math.pow((orbitalPeriod * 60 / (2 * Math.PI)) ** 2 * 398600.4418, 1/3) : 0; // km
              const apogee = semiMajorAxis > 0 ? semiMajorAxis * (1 + eccentricity) - 6371 : 0; // km above Earth
              const perigee = semiMajorAxis > 0 ? semiMajorAxis * (1 - eccentricity) - 6371 : 0; // km above Earth
              
              return (
                <div className="mt-6">
                  <h3 className="text-lg font-bold uppercase mb-4 text-black dark:text-white">
                    Two Line Element (TLE)
                  </h3>
                  
                  {/* Parsed Orbital Parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Inclination</p>
                      <p className="text-lg font-bold text-black dark:text-white">{inclination.toFixed(4)}°</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">RAAN (Right Ascension)</p>
                      <p className="text-lg font-bold text-black dark:text-white">{raan.toFixed(4)}°</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Eccentricity</p>
                      <p className="text-lg font-bold text-black dark:text-white">{eccentricity.toFixed(7)}</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Argument of Perigee</p>
                      <p className="text-lg font-bold text-black dark:text-white">{argOfPerigee.toFixed(4)}°</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Mean Anomaly</p>
                      <p className="text-lg font-bold text-black dark:text-white">{meanAnomaly.toFixed(4)}°</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Mean Motion</p>
                      <p className="text-lg font-bold text-black dark:text-white">{meanMotion.toFixed(8)} rev/day</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Orbital Period</p>
                      <p className="text-lg font-bold text-black dark:text-white">{orbitalPeriod.toFixed(2)} min</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Apogee Altitude</p>
                      <p className="text-lg font-bold text-black dark:text-white">{apogee.toFixed(0)} km</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Perigee Altitude</p>
                      <p className="text-lg font-bold text-black dark:text-white">{perigee.toFixed(0)} km</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Semi-Major Axis</p>
                      <p className="text-lg font-bold text-black dark:text-white">{semiMajorAxis.toFixed(0)} km</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Epoch Date</p>
                      <p className="text-lg font-bold text-black dark:text-white">{epochYear}-{Math.floor(epochDay).toString().padStart(3, '0')}</p>
                    </div>
                    <div className="border-2 border-black dark:border-white p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Mean Motion First Derivative</p>
                      <p className="text-lg font-bold text-black dark:text-white">{meanMotionDot.toExponential(2)}</p>
                    </div>
                  </div>
                  
                  {/* Raw TLE */}
                  <div>
                    <h4 className="text-md font-bold uppercase mb-2 text-black dark:text-white">
                      Raw TLE Data
                    </h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm whitespace-pre-wrap border-2 border-gray-700">
                      {line1}
                      {'\n'}
                      {line2}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

