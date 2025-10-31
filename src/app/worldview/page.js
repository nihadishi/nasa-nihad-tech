'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const WorldviewMap = dynamic(() => import('@/components/WorldviewMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p className="text-white">Loading Earth Visualization...</p>
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
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">NASA Worldview</h1>
            <p className="text-sm text-gray-300">Interactive Earth Visualization</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300 font-medium">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  console.log('Date changed to:', e.target.value);
                }}
                max={new Date().toISOString().split('T')[0]}
                min="2012-01-01"
                className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm font-mono cursor-pointer hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {showControls ? 'Hide' : 'Show'} Layers
            </button>
          </div>
        </div>
      </div>

      {showControls && (
        <div className="absolute top-24 left-6 z-10 w-80 bg-black/90 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden max-h-[calc(100vh-200px)]">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Layers</h2>
                <p className="text-xs text-gray-400 mt-1">
                  {activeLayers.length} layer{activeLayers.length !== 1 ? 's' : ''} active
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveLayers([]);
                  console.log('All layers cleared');
                }}
                className="px-3 py-1.5 text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md border border-red-600/30 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
            {categories.map((category) => (
              <div key={category} className="border-b border-gray-800 last:border-b-0">
                <div className="px-4 py-2 bg-gray-900/50">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
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
                        className={`w-full p-3 mb-2 rounded-lg text-left transition-all cursor-pointer ${
                          activeLayers.includes(layer.id)
                            ? 'bg-blue-600/20 border-2 border-blue-500 ring-1 ring-blue-400'
                            : 'bg-gray-800/50 border-2 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded ${
                              activeLayers.includes(layer.id) ? 'bg-blue-500' : 'bg-gray-600'
                            }`}
                            style={{
                              backgroundColor: activeLayers.includes(layer.id)
                                ? layer.color
                                : undefined,
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{layer.name}</p>
                            <p className="text-xs text-gray-400">{layer.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700 bg-gray-900/50">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveLayers(['OpenStreetMap', 'Reference_Features', 'Reference_Labels']);
                  console.log('Reset to default layers');
                }}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Reset to Default
              </button>
              <p className="text-xs text-gray-500 text-center">
                OpenStreetMap + Labels + Features
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 right-6 z-10 bg-black/90 backdrop-blur-sm rounded-lg border border-gray-700 p-4 max-w-sm">
        <h3 className="text-sm font-semibold text-white mb-2">About This View</h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          This interactive map displays near real-time satellite imagery from NASA&apos;s Earth
          observing satellites including MODIS and VIIRS. Data is provided by NASA&apos;s Global
          Imagery Browse Services (GIBS).
        </p>
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400">
            Viewing: <span className="text-white font-medium">{formatDate(selectedDate)}</span>
          </p>
        </div>
      </div>

      {selectedDate && (
        <WorldviewMap selectedDate={selectedDate} activeLayers={activeLayers} />
      )}
    </div>
  );
}

