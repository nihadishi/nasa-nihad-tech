'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const WorldviewMap = dynamic(() => import('@/components/WorldviewMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <div className="inline-block animate-spin h-12 w-12 border-4 border-black dark:border-white border-t-transparent mb-4"></div>
        <p className="text-black dark:text-white font-bold uppercase tracking-wider text-sm">Loading Earth Visualization...</p>
      </div>
    </div>
  ),
});

const getYesterdayDate = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

export default function WorldviewPage() {
  const [selectedDate, setSelectedDate] = useState(getYesterdayDate());
  const [activeLayers, setActiveLayers] = useState([
    'OpenStreetMap',
    'Reference_Features',
    'Reference_Labels',
  ]);
  const [showControls, setShowControls] = useState(true);
  const [showAbout, setShowAbout] = useState(true);

  const availableLayers = [
    {
      id: 'OpenStreetMap',
      name: 'OpenStreetMap',
      category: 'Base Maps',
      description: 'Standard street map (always available)',
      color: '#95A5A6',
    },
    {
      id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
      name: 'VIIRS True Color',
      category: 'Satellite Imagery',
      description: 'VIIRS SNPP True Color imagery',
      color: '#4A90E2',
    },
    {
      id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
      name: 'MODIS Terra',
      category: 'Satellite Imagery',
      description: 'MODIS Terra True Color imagery',
      color: '#E24A4A',
    },
    {
      id: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
      name: 'MODIS Aqua',
      category: 'Satellite Imagery',
      description: 'MODIS Aqua True Color imagery',
      color: '#4AE2E2',
    },
    {
      id: 'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
      name: 'VIIRS NOAA-20',
      category: 'Satellite Imagery',
      description: 'VIIRS NOAA-20 True Color imagery',
      color: '#9B4AE2',
    },
    {
      id: 'VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1',
      name: 'VIIRS Night Color',
      category: 'Satellite Imagery',
      description: 'False color nighttime imagery',
      color: '#FF6B6B',
    },
    {
      id: 'BlueMarble_NextGeneration',
      name: 'Blue Marble',
      category: 'Base Maps',
      description: 'NASA Blue Marble next generation',
      color: '#3498DB',
    },
    {
      id: 'Reference_Features',
      name: 'Borders & Roads',
      category: 'Overlays',
      description: 'Political boundaries and roads',
      color: '#888888',
    },
    {
      id: 'Reference_Labels',
      name: 'Place Labels',
      category: 'Overlays',
      description: 'City and place labels',
      color: '#666666',
    },
    {
      id: 'Coastlines',
      name: 'Coastlines',
      category: 'Overlays',
      description: 'Coastline boundaries',
      color: '#555555',
    },
  ];

  const toggleLayer = (layerId) => {
    setActiveLayers((prev) =>
      prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const categories = [...new Set(availableLayers.map((l) => l.category))];

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 bg-[#F5F5F0] dark:bg-[#1a1a1a] border-b-4 border-slate-700 dark:border-slate-600">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight text-black dark:text-white">NASA Worldview</h1>
            <p className="text-xs font-medium uppercase tracking-wider text-black/60 dark:text-white/60">Interactive Earth Visualization</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase text-black dark:text-white">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  console.log('Date changed to:', e.target.value);
                }}
                max={new Date().toISOString().split('T')[0]}
                min="2012-01-01"
                className="px-3 py-2 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white text-sm font-bold cursor-pointer focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowControls(!showControls)}
              className="relative border-4 border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
            >
              {showControls ? 'Hide' : 'Show'} Layers
            </button>
          </div>
        </div>
      </div>

      {showControls && (
        <div className="absolute top-24 left-6 z-10 w-80 border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden max-h-[calc(100vh-200px)]">
          <div className="p-4 border-b-4 border-black dark:border-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-black dark:text-white">Layers</h2>
                <p className="text-xs font-medium mt-1 text-black/60 dark:text-white/60">
                  {activeLayers.length} layer{activeLayers.length !== 1 ? 's' : ''} active
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveLayers([]);
                  console.log('All layers cleared');
                }}
                className="px-3 py-1.5 text-xs border-2 border-red-600 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-bold uppercase hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
            {categories.map((category) => (
              <div key={category} className="border-b-2 border-black dark:border-white last:border-b-0">
                <div className="px-4 py-2 bg-black/5 dark:bg-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                    {category}
                  </h3>
                </div>
                <div className="p-2">
                  {availableLayers
                    .filter((layer) => layer.category === category)
                    .map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => {
                          toggleLayer(layer.id);
                          console.log('Toggled layer:', layer.id, 'Active:', !activeLayers.includes(layer.id));
                        }}
                        className={`w-full p-3 mb-2 border-2 text-left transition-all cursor-pointer ${
                          activeLayers.includes(layer.id)
                            ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] -translate-y-0.5 -translate-x-0.5'
                            : 'border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 border-2 border-black dark:border-white ${
                              activeLayers.includes(layer.id) ? 'bg-current' : 'bg-transparent'
                            }`}
                            style={{
                              backgroundColor: activeLayers.includes(layer.id)
                                ? layer.color
                                : undefined,
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-bold">{layer.name}</p>
                            <p className="text-xs opacity-70 font-medium">{layer.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t-4 border-black dark:border-white">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveLayers(['OpenStreetMap', 'Reference_Features', 'Reference_Labels']);
                  console.log('Reset to default layers');
                }}
                className="w-full px-3 py-2 border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black text-sm font-bold uppercase tracking-wider transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
              >
                Reset to Default
              </button>
              <p className="text-xs font-medium text-center text-black/60 dark:text-white/60">
                OpenStreetMap + Labels + Features
              </p>
            </div>
          </div>
        </div>
      )}

      {showAbout && (
        <div className="absolute bottom-6 right-6 z-10 border-4 border-black dark:border-white bg-white dark:bg-black p-4 max-w-sm">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">About This View</h3>
            <button
              onClick={() => setShowAbout(false)}
              className="border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white w-6 h-6 flex items-center justify-center font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              ×
            </button>
          </div>
          <p className="text-xs leading-relaxed text-black dark:text-white">
            This interactive map displays near real-time satellite imagery from NASA&apos;s Earth
            observing satellites including MODIS and VIIRS. Data is provided by NASA&apos;s Global
            Imagery Browse Services (GIBS).
          </p>
          <div className="mt-3 pt-3 border-t-2 border-black dark:border-white">
            <p className="text-xs font-medium text-black/60 dark:text-white/60">
              Viewing: <span className="text-black dark:text-white font-bold">{formatDate(selectedDate)}</span>
            </p>
          </div>
        </div>
      )}

      {selectedDate && (
        <WorldviewMap selectedDate={selectedDate} activeLayers={activeLayers} />
      )}
    </div>
  );
}

