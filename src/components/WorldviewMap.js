'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function WorldviewMap({ selectedDate, activeLayers }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({});

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 3,
      minZoom: 1,
      maxZoom: 18,
      worldCopyJump: true,
      zoomControl: true,
      preferCanvas: false,
      renderer: L.canvas({ tolerance: 0 }),
    });
    
    mapInstanceRef.current = map;

    L.control.scale({ imperial: false, metric: true }).addTo(map);

    const coordinatesControl = L.control({ position: 'bottomleft' });
    coordinatesControl.onAdd = function () {
      const div = L.DomUtil.create('div', 'leaflet-control-coordinates');
      div.style.background = 'rgba(0, 0, 0, 0.8)';
      div.style.color = 'white';
      div.style.padding = '8px 12px';
      div.style.borderRadius = '8px';
      div.style.fontSize = '12px';
      div.style.fontFamily = 'monospace';
      div.innerHTML = 'Lat: 0.0000, Lon: 0.0000';
      return div;
    };
    coordinatesControl.addTo(map);

    map.on('mousemove', function (e) {
      const coordsDiv = document.querySelector('.leaflet-control-coordinates');
      if (coordsDiv) {
        coordsDiv.innerHTML = `Lat: ${e.latlng.lat.toFixed(4)}, Lon: ${e.latlng.lng.toFixed(4)}`;
      }
    });
    
    console.log('Map initialized successfully');

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedDate) return;

    const map = mapInstanceRef.current;
    const dateStr = selectedDate.replace(/-/g, '');

    const layerConfigs = {
      'OpenStreetMap': {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: { 
          tileSize: 256, 
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap contributors'
        },
      },
      'VIIRS_SNPP_CorrectedReflectance_TrueColor': {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
        options: { tileSize: 256, maxZoom: 18, maxNativeZoom: 9, crossOrigin: true, className: 'crisp-tiles' },
      },
      'MODIS_Terra_CorrectedReflectance_TrueColor': {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
        options: { tileSize: 256, maxZoom: 18, maxNativeZoom: 9, crossOrigin: true, className: 'crisp-tiles' },
      },
      'MODIS_Aqua_CorrectedReflectance_TrueColor': {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
        options: { tileSize: 256, maxZoom: 18, maxNativeZoom: 9, crossOrigin: true, className: 'crisp-tiles' },
      },
      'VIIRS_NOAA20_CorrectedReflectance_TrueColor': {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_NOAA20_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
        options: { tileSize: 256, maxZoom: 18, maxNativeZoom: 9, crossOrigin: true, className: 'crisp-tiles' },
      },
      'VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1': {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
        options: { tileSize: 256, maxZoom: 18, maxNativeZoom: 9, crossOrigin: true, className: 'crisp-tiles' },
      },
      'BlueMarble_NextGeneration': {
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
        options: { tileSize: 256, maxZoom: 18, maxNativeZoom: 8, crossOrigin: true, className: 'crisp-tiles' },
      },
      'Reference_Features': {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Reference_Features_15m/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`,
        options: { tileSize: 256, maxZoom: 18, maxNativeZoom: 9, opacity: 0.8, crossOrigin: true },
      },
      'Reference_Labels': {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Reference_Labels_15m/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`,
        options: { tileSize: 256, maxZoom: 18, maxNativeZoom: 9, opacity: 0.9, crossOrigin: true },
      },
      'Coastlines': {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Coastlines_15m/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`,
        options: { tileSize: 256, maxZoom: 18, maxNativeZoom: 9, opacity: 0.7, crossOrigin: true },
      },
    };

    Object.keys(layerConfigs).forEach((layerId) => {
      const shouldBeActive = activeLayers.includes(layerId);
      const existingLayer = layersRef.current[layerId];
      
      if (shouldBeActive && !existingLayer) {
        const config = layerConfigs[layerId];
        const layer = L.tileLayer(config.url, {
          ...config.options,
          attribution: config.options.attribution || '&copy; NASA EOSDIS GIBS',
        });
        
        let tileCount = 0;
        let errorCount = 0;
        
        layer.on('tileloadstart', function() {
          tileCount++;
        });
        
        layer.on('tileload', function() {
          console.log(`🟢 Tile loaded for ${layerId} (${tileCount} total)`);
        });
        
        layer.on('tileerror', function(e) {
          errorCount++;
          console.error(`🔴 Tile error for ${layerId}:`, e.tile.src, `(${errorCount} errors)`);
        });
        
        layer.addTo(map);
        layersRef.current[layerId] = layer;
        console.log('✅ Added layer:', layerId, 'URL pattern:', config.url.substring(0, 100) + '...');
      } else if (!shouldBeActive && existingLayer) {
        map.removeLayer(existingLayer);
        delete layersRef.current[layerId];
        console.log('❌ Removed layer:', layerId);
      }
    });
    
    console.log('Current active layers on map:', Object.keys(layersRef.current));
  }, [selectedDate, activeLayers]);

  return (
    <div
      ref={mapRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: '#000000',
        zIndex: 0,
      }}
    />
  );
}

