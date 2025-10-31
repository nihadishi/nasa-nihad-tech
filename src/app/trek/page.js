'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const TrekMap = dynamic(() => import('@/components/TrekMap'), {
  ssr: false,
  loading: () => (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center h-[600px] flex items-center justify-center">
      <div>
        <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent mb-4"></div>
        <p className="font-bold uppercase tracking-wider text-sm">Loading Map...</p>
      </div>
    </div>
  )
});

const Trek3DGlobe = dynamic(() => import('@/components/Trek3DGlobe'), {
  ssr: false,
  loading: () => (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 text-center h-[600px] flex items-center justify-center">
      <div>
        <div className="inline-block animate-spin h-12 w-12 border-4 border-purple-600 dark:border-purple-500 border-t-transparent mb-4"></div>
        <p className="font-bold uppercase tracking-wider text-sm">Loading 3D Globe...</p>
      </div>
    </div>
  )
});

const MOON_MOSAICS = [
  {
    id: 'lro_wac',
    name: 'LRO WAC Global Mosaic',
    description: 'Lunar Reconnaissance Orbiter Wide Angle Camera - High resolution global mosaic',
    endpoint: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    projection: 'Equirectangular',
    capabilities: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'lro_wac_color',
    name: 'LRO WAC Color Mosaic',
    description: 'Color-enhanced lunar surface from LRO WAC',
    endpoint: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Color/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    projection: 'Equirectangular',
    capabilities: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Color/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'clementine',
    name: 'Clementine UVVIS Mosaic',
    description: 'Clementine UVVIS visible light mosaic',
    endpoint: 'https://trek.nasa.gov/tiles/Moon/EQ/Clementine_UVVIS_Global_2ppd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    projection: 'Equirectangular',
    capabilities: 'https://trek.nasa.gov/tiles/Moon/EQ/Clementine_UVVIS_Global_2ppd/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'lola_elevation',
    name: 'LOLA Elevation Model',
    description: 'Lunar Orbiter Laser Altimeter - Grayscale elevation data',
    endpoint: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_Shade_Global_128ppd_v04/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    projection: 'Equirectangular',
    capabilities: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_Shade_Global_128ppd_v04/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'lola_hillshade',
    name: 'LOLA Color Hillshade',
    description: 'Color-coded elevation hillshade from LOLA',
    endpoint: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_ClrShade_Global_128ppd_v04/1.0.0/default/default028mm/{z}/{y}/{x}.png',
    projection: 'Equirectangular',
    capabilities: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_ClrShade_Global_128ppd_v04/1.0.0/WMTSCapabilities.xml'
  }
];

const MARS_MOSAICS = [
  {
    id: 'viking_color',
    name: 'Viking Color Mosaic',
    description: 'Global color mosaic from Viking missions',
    endpoint: 'https://trek.nasa.gov/tiles/Mars/EQ/Viking_Color_Mosaic_merged_MDIM21/1.0.0/default/default028mm/{z}/{x}/{y}.jpg',
    projection: 'Global',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/Viking_Color_Mosaic_merged_MDIM21/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'mola_color',
    name: 'MOLA Color Hillshade',
    description: 'Mars Orbiter Laser Altimeter - Color-coded elevation',
    endpoint: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd/1.0.0/default/default028mm/{z}/{x}/{y}.jpg',
    projection: 'Global',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'mola_gray',
    name: 'MOLA Grayscale',
    description: 'Mars Orbiter Laser Altimeter - Grayscale elevation',
    endpoint: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_clon0dd/1.0.0/default/default028mm/{z}/{x}/{y}.jpg',
    projection: 'Global',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_clon0dd/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'themis_day',
    name: 'THEMIS Infrared Day',
    description: 'Thermal Emission Imaging System - Daytime infrared',
    endpoint: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_THEMIS_Day_IR_mosaic_clon0dd/1.0.0/default/default028mm/{z}/{x}/{y}.jpg',
    projection: 'Global',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_THEMIS_Day_IR_mosaic_clon0dd/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'ctx_curiosity',
    name: 'CTX Mosaic - Curiosity Landing Site',
    description: 'High-resolution Context Camera mosaic of Gale Crater',
    endpoint: 'https://trek.nasa.gov/tiles/Mars/EQ/Curiosity_Landing_Site_CTX_Mosaic/1.0.0/default/default028mm/{z}/{x}/{y}.jpg',
    projection: 'Regional',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/Curiosity_Landing_Site_CTX_Mosaic/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'moc_atlas',
    name: 'MOC Atlas Mosaic',
    description: 'Mars Orbiter Camera - Global atlas',
    endpoint: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOC_AtlasMosaicV2_clon0dd/1.0.0/default/default028mm/{z}/{x}/{y}.jpg',
    projection: 'Global',
    capabilities: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOC_AtlasMosaicV2_clon0dd/1.0.0/WMTSCapabilities.xml'
  }
];

const VESTA_MOSAICS = [
  {
    id: 'vesta_lamo',
    name: 'Vesta LAMO Global Mosaic',
    description: 'Low Altitude Mapping Orbit - Global mosaic',
    endpoint: 'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_FC_LAMO_Global_74ppd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    projection: 'Global',
    capabilities: 'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_FC_LAMO_Global_74ppd/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'vesta_dtm',
    name: 'Vesta HAMO DTM',
    description: 'High Altitude Mapping Orbit - Digital Terrain Model',
    endpoint: 'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_DTM_DLR_Global_48ppd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    projection: 'Global',
    capabilities: 'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_DTM_DLR_Global_48ppd/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'vesta_geology',
    name: 'Vesta Geology Map',
    description: 'Geological feature mapping',
    endpoint: 'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_Geology_Global_32ppd_IAU/1.0.0/default/default028mm/{z}/{y}/{x}.png',
    projection: 'Global',
    capabilities: 'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_Geology_Global_32ppd_IAU/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'vesta_color_hillshade',
    name: 'Vesta Color Hillshade',
    description: 'Color-coded elevation hillshade',
    endpoint: 'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_ClrShade_DLR_Global_48ppd_IAU/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    projection: 'Global',
    capabilities: 'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_ClrShade_DLR_Global_48ppd_IAU/1.0.0/WMTSCapabilities.xml'
  },
  {
    id: 'vesta_true_color',
    name: 'Vesta True Color',
    description: 'True color composite from Dawn mission',
    endpoint: 'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_TrueClr_DLR_global_74ppd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
    projection: 'Global',
    capabilities: 'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_TrueClr_DLR_global_74ppd/1.0.0/WMTSCapabilities.xml'
  }
];

export default function TrekPage() {
  const [selectedBody, setSelectedBody] = useState('moon');
  const [selectedMosaic, setSelectedMosaic] = useState(MOON_MOSAICS[0]);
  const [showInfo, setShowInfo] = useState(true);
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'

  const handleBodyChange = (body) => {
    setSelectedBody(body);
    if (body === 'moon') {
      setSelectedMosaic(MOON_MOSAICS[0]);
    } else if (body === 'mars') {
      setSelectedMosaic(MARS_MOSAICS[0]);
    } else if (body === 'vesta') {
      setSelectedMosaic(VESTA_MOSAICS[0]);
    }
  };

  const getMosaics = () => {
    switch (selectedBody) {
      case 'moon':
        return MOON_MOSAICS;
      case 'mars':
        return MARS_MOSAICS;
      case 'vesta':
        return VESTA_MOSAICS;
      default:
        return MOON_MOSAICS;
    }
  };

  const currentMosaics = getMosaics();

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] text-black dark:text-white">
      <div className="max-w-[1800px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 border-b-4 border-slate-700 dark:border-slate-600 pb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Planetary Mapping</p>
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4">NASA Trek</h1>
          <p className="text-sm font-medium uppercase tracking-wider text-black/60 dark:text-white/60">
            Moon • Mars • Vesta WMTS
          </p>
          <p className="mt-6 leading-relaxed max-w-4xl">
            Explore high-resolution map mosaics of the Moon, Mars, and asteroid Vesta using NASA&apos;s 
            Trek WMTS (Web Map Tile Service). View imagery from missions including LRO, Viking, HiRISE, 
            and Dawn with interactive map controls.
          </p>
        </div>

        {/* Body Selection Tabs */}
        <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black mb-8">
          <div className="grid grid-cols-3">
            <button
              onClick={() => handleBodyChange('moon')}
              className={`p-6 text-lg font-bold uppercase tracking-wider transition-all border-r-2 border-slate-700 dark:border-slate-600 ${
                selectedBody === 'moon'
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'bg-white dark:bg-black text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              🌙 Moon
            </button>
            <button
              onClick={() => handleBodyChange('mars')}
              className={`p-6 text-lg font-bold uppercase tracking-wider transition-all border-r-2 border-slate-700 dark:border-slate-600 ${
                selectedBody === 'mars'
                  ? 'bg-red-600 dark:bg-red-500 text-white'
                  : 'bg-white dark:bg-black text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              🔴 Mars
            </button>
            <button
              onClick={() => handleBodyChange('vesta')}
              className={`p-6 text-lg font-bold uppercase tracking-wider transition-all ${
                selectedBody === 'vesta'
                  ? 'bg-purple-600 dark:bg-purple-500 text-white'
                  : 'bg-white dark:bg-black text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              🪨 Vesta
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Mosaic Selector */}
          <div className="lg:col-span-1">
            <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 sticky top-20">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b-2 border-slate-700 dark:border-slate-600 pb-2">
                Available Mosaics
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {currentMosaics.map((mosaic) => (
                  <button
                    key={mosaic.id}
                    onClick={() => setSelectedMosaic(mosaic)}
                    className={`w-full text-left p-3 text-sm font-bold uppercase tracking-wider transition-all border-2 ${
                      selectedMosaic.id === mosaic.id
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white'
                        : 'border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                    }`}
                  >
                    <div className="text-xs mb-1 opacity-80">{mosaic.projection}</div>
                    {mosaic.name}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t-2 border-slate-700 dark:border-slate-600 space-y-2">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="w-full border-2 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
                >
                  {showInfo ? '👁️ Hide Info' : '👁️ Show Info'}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setViewMode('2d')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-2 ${
                      viewMode === '2d'
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white'
                        : 'border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white hover:shadow-[2px_2px_0px_0px_rgba(71,85,105,1)]'
                    }`}
                  >
                    🗺️ 2D
                  </button>
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-2 ${
                      viewMode === '3d'
                        ? 'border-purple-600 dark:border-purple-500 bg-purple-600 dark:bg-purple-500 text-white'
                        : 'border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white hover:shadow-[2px_2px_0px_0px_rgba(71,85,105,1)]'
                    }`}
                  >
                    🌍 3D
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Map Display */}
          <div className="lg:col-span-3">
            {/* Info Panel */}
            {showInfo && (
              <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-6 mb-6">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-2">
                  {selectedMosaic.name}
                </h3>
                <p className="text-sm text-black/70 dark:text-white/70 mb-4">
                  {selectedMosaic.description}
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-black/60 dark:text-white/60 mb-1">Projection</p>
                    <p className="font-bold">{selectedMosaic.projection}</p>
                  </div>
                  <div>
                    <p className="text-black/60 dark:text-white/60 mb-1">Body</p>
                    <p className="font-bold uppercase">{selectedBody}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-black/60 dark:text-white/60 mb-1">WMTS Endpoint</p>
                    <p className="font-mono text-xs break-all bg-slate-100 dark:bg-slate-900 p-2 border border-slate-700 dark:border-slate-600">
                      {selectedMosaic.endpoint}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <a
                      href={selectedMosaic.capabilities}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block border-2 border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
                    >
                      📄 View WMTS Capabilities XML
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Map - 2D or 3D */}
            {viewMode === '2d' ? (
              <TrekMap mosaic={selectedMosaic} body={selectedBody} />
            ) : (
              <Trek3DGlobe mosaic={selectedMosaic} body={selectedBody} />
            )}

            {/* Controls Info */}
            <div className="mt-4 border-2 border-slate-700 dark:border-slate-600 bg-blue-50 dark:bg-blue-950/20 p-4">
              <p className="text-xs text-black/70 dark:text-white/70">
                <strong className="font-bold">🗺️ Map Controls:</strong> Drag to pan • Scroll to zoom • 
                Double-click to zoom in • Shift + Drag to zoom to area. 
                <a 
                  href="https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline ml-2"
                >
                  View Full API Documentation →
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black p-8">
          <h3 className="text-2xl font-bold uppercase tracking-wider mb-6">About NASA Trek APIs</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-bold uppercase tracking-wider mb-3">🌙 Moon Trek</h4>
              <p className="text-sm text-black/70 dark:text-white/70">
                Features data from the Lunar Reconnaissance Orbiter (LRO), Clementine, and other lunar missions. 
                Includes high-resolution imagery, elevation models, and color mosaics.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold uppercase tracking-wider mb-3">🔴 Mars Trek</h4>
              <p className="text-sm text-black/70 dark:text-white/70">
                Contains Viking, CTX, HiRISE, THEMIS, and MOLA data. Explore landing sites, thermal imaging, 
                and detailed regional mosaics at various resolutions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold uppercase tracking-wider mb-3">🪨 Vesta Trek</h4>
              <p className="text-sm text-black/70 dark:text-white/70">
                Dawn mission data including global mosaics, digital terrain models, and geological mapping 
                of the second-largest asteroid in our solar system.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t-2 border-slate-700 dark:border-slate-600">
            <p className="text-xs text-black/60 dark:text-white/60">
              API provided by NASA Solar System Exploration Research Virtual Institute (SSERVI) and JPL Trek team. 
              All tile services use OGC WMTS standard protocol.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

