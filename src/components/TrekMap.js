'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function TrekMap({ mosaic, body }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentLayerRef = useRef(null);
  
  // State for visualization data
  const [mapData, setMapData] = useState({
    center: [0, 0],
    zoom: 1,
    bounds: null,
    tilesLoading: 0,
    tilesLoaded: 0,
    tilesFailed: 0,
    mouseCoords: null,
    lastTileUrl: null,
    lastError: null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize map only once
    if (!mapInstanceRef.current && mapRef.current) {
      // Use EPSG:4326 (standard lat/lon) for Trek tiles
      // This is the standard geographic coordinate system
      mapInstanceRef.current = L.map(mapRef.current, {
        crs: L.CRS.EPSG4326, // Standard geographic projection for planetary maps
        center: [0, 0],
        zoom: 1,
        minZoom: 0,
        maxZoom: 8,
        maxBounds: [[-90, -180], [90, 180]],
        attributionControl: true
      });

      // Add attribution
      mapInstanceRef.current.attributionControl.addAttribution(
        '&copy; NASA Trek | SSERVI | JPL'
      );

      // Add event listeners for data visualization
      mapInstanceRef.current.on('moveend', () => {
        const center = mapInstanceRef.current.getCenter();
        const bounds = mapInstanceRef.current.getBounds();
        setMapData(prev => ({
          ...prev,
          center: [center.lat.toFixed(4), center.lng.toFixed(4)],
          bounds: {
            north: bounds.getNorth().toFixed(4),
            south: bounds.getSouth().toFixed(4),
            east: bounds.getEast().toFixed(4),
            west: bounds.getWest().toFixed(4)
          }
        }));
      });

      mapInstanceRef.current.on('zoomend', () => {
        setMapData(prev => ({
          ...prev,
          zoom: mapInstanceRef.current.getZoom()
        }));
      });

      mapInstanceRef.current.on('mousemove', (e) => {
        setMapData(prev => ({
          ...prev,
          mouseCoords: [e.latlng.lat.toFixed(4), e.latlng.lng.toFixed(4)]
        }));
      });

      mapInstanceRef.current.on('mouseout', () => {
        setMapData(prev => ({
          ...prev,
          mouseCoords: null
        }));
      });
    }

    // Update tile layer when mosaic changes
    if (mapInstanceRef.current && mosaic) {
      // Remove existing layer
      if (currentLayerRef.current) {
        mapInstanceRef.current.removeLayer(currentLayerRef.current);
      }

      // NASA Trek tiles use standard Leaflet format {z}/{x}/{y}
      let tileUrl = mosaic.endpoint;
      
      // Create new tile layer
      const tileLayer = L.tileLayer(tileUrl, {
        attribution: `${mosaic.name} | NASA`,
        tms: false, // Standard Leaflet tile format
        noWrap: false, // Allow wrapping for global views
        bounds: [[-90, -180], [90, 180]],
        minZoom: 0,
        maxZoom: 8,
        errorTileUrl: '', // Don't show missing tiles
        crossOrigin: 'anonymous', // Enable CORS
      });

      // Track tile loading events
      tileLayer.on('loading', () => {
        setMapData(prev => ({
          ...prev,
          tilesLoading: prev.tilesLoading + 1
        }));
      });

      tileLayer.on('tileloadstart', () => {
        setMapData(prev => ({
          ...prev,
          tilesLoading: prev.tilesLoading + 1
        }));
      });

      tileLayer.on('tileload', (e) => {
        setMapData(prev => ({
          ...prev,
          tilesLoading: Math.max(0, prev.tilesLoading - 1),
          tilesLoaded: prev.tilesLoaded + 1,
          lastTileUrl: e.url,
          lastError: null
        }));
      });

      tileLayer.on('tileerror', (e) => {
        console.error('Tile load error:', e.url);
        setMapData(prev => ({
          ...prev,
          tilesLoading: Math.max(0, prev.tilesLoading - 1),
          tilesFailed: prev.tilesFailed + 1,
          lastError: e.url
        }));
      });

      tileLayer.addTo(mapInstanceRef.current);
      currentLayerRef.current = tileLayer;

      // Reset view
      mapInstanceRef.current.setView([0, 0], 1);
      
      // Reset tile counters after layer is set up
      setTimeout(() => {
        setMapData(prev => ({
          ...prev,
          tilesLoading: 0,
          tilesLoaded: 0,
          tilesFailed: 0
        }));
      }, 0);
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current && currentLayerRef.current) {
        mapInstanceRef.current.removeLayer(currentLayerRef.current);
      }
    };
  }, [mosaic, body]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="border-4 border-slate-700 dark:border-slate-600 bg-white dark:bg-black">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-[600px] bg-black relative"
        style={{ 
          cursor: 'grab',
          background: '#000' 
        }}
      >
        {/* Coordinate Display Overlay */}
        {mapData.mouseCoords && (
          <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 text-xs font-mono border-2 border-white z-[1000] pointer-events-none">
            <div className="font-bold mb-1">Mouse Position</div>
            <div>Lat: {mapData.mouseCoords[0]}°</div>
            <div>Lon: {mapData.mouseCoords[1]}°</div>
          </div>
        )}

        {/* Loading Indicator */}
        {mapData.tilesLoading > 0 && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 text-xs font-bold uppercase z-[1000] pointer-events-none animate-pulse">
            Loading Tiles... ({mapData.tilesLoading})
          </div>
        )}
      </div>

      {/* Map Statistics Panel */}
      <div className="border-t-2 border-slate-700 dark:border-slate-600 p-4 bg-slate-50 dark:bg-slate-950">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* Center Coordinates */}
          <div>
            <div className="text-black/60 dark:text-white/60 mb-1 font-bold uppercase">Center</div>
            <div className="font-mono text-sm">
              <div>{mapData.center[0]}° N</div>
              <div>{mapData.center[1]}° E</div>
            </div>
          </div>

          {/* Zoom Level */}
          <div>
            <div className="text-black/60 dark:text-white/60 mb-1 font-bold uppercase">Zoom Level</div>
            <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">
              {mapData.zoom}
            </div>
            <div className="text-black/50 dark:text-white/50 text-xs">/ 8 max</div>
          </div>

          {/* Tiles Loaded */}
          <div>
            <div className="text-black/60 dark:text-white/60 mb-1 font-bold uppercase">Tiles Loaded</div>
            <div className="font-bold text-2xl text-green-600 dark:text-green-400">
              {mapData.tilesLoaded}
            </div>
            {mapData.tilesFailed > 0 && (
              <div className="text-red-600 dark:text-red-400 text-xs font-bold">
                ⚠️ {mapData.tilesFailed} failed
              </div>
            )}
          </div>

          {/* View Bounds */}
          <div>
            <div className="text-black/60 dark:text-white/60 mb-1 font-bold uppercase">Bounds</div>
            {mapData.bounds && (
              <div className="font-mono text-xs">
                <div>N: {mapData.bounds.north}°</div>
                <div>S: {mapData.bounds.south}°</div>
                <div>E: {mapData.bounds.east}°</div>
                <div>W: {mapData.bounds.west}°</div>
              </div>
            )}
          </div>
        </div>

        {/* Zoom Level Visual Indicator */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-bold uppercase text-black/60 dark:text-white/60">
              Resolution
            </div>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((level) => (
              <div
                key={level}
                className={`flex-1 h-2 transition-all ${
                  level <= mapData.zoom
                    ? 'bg-blue-600 dark:bg-blue-400'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title={`Zoom level ${level}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-black/50 dark:text-white/50 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Debug Info */}
        {(mapData.lastTileUrl || mapData.lastError) && (
          <div className="mt-4 pt-4 border-t-2 border-slate-700 dark:border-slate-600">
            <div className="text-xs">
              {mapData.lastTileUrl && (
                <div className="mb-2">
                  <div className="text-black/60 dark:text-white/60 mb-1 font-bold uppercase">Last Loaded</div>
                  <div className="font-mono text-xs break-all bg-green-50 dark:bg-green-950/20 p-2 border border-green-600 dark:border-green-400">
                    {mapData.lastTileUrl.substring(0, 100)}...
                  </div>
                </div>
              )}
              {mapData.lastError && (
                <div>
                  <div className="text-black/60 dark:text-white/60 mb-1 font-bold uppercase">Last Error</div>
                  <div className="font-mono text-xs break-all bg-red-50 dark:bg-red-950/20 p-2 border border-red-600 dark:border-red-400">
                    {mapData.lastError.substring(0, 100)}...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

