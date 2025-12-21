'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue in Next.js
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Create custom aircraft icon - very simple and visible
function createAircraftIcon(heading, onGround) {
  const color = onGround ? '#888888' : '#3B82F6';
  const size = 24;
  
  // Very simple colored circle - guaranteed to be visible
  const html = `<div style="
    width: ${size}px;
    height: ${size}px;
    background-color: ${color};
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.4);
    display: block;
  "></div>`;
  
  return L.divIcon({
    html: html,
    className: 'aircraft-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function OpenSkyMap({ aircraftData }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const hasInitializedBoundsRef = useRef(false);

  // Initialize map - only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) {
      return;
    }

    // Double check to prevent multiple initializations
    if (mapInstanceRef.current) {
      return;
    }

    // Try to get user's location for better initial view, fallback to world view
    const map = L.map(mapRef.current, {
      center: [30, 0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
    });
    
    // Try to center on user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          map.setView([userLat, userLng], 6);
        },
        () => {
          // Silently fail if geolocation denied/unavailable
        }
      );
    }

    // Add OpenStreetMap tiles
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });
    tileLayer.addTo(map);

    mapInstanceRef.current = map;

    // Add coordinate display
    const coordinatesControl = L.control({ position: 'bottomleft' });
    coordinatesControl.onAdd = function () {
      const div = L.DomUtil.create('div', 'leaflet-control-coordinates');
      div.style.background = 'rgba(0, 0, 0, 0.8)';
      div.style.color = 'white';
      div.style.padding = '8px 12px';
      div.style.borderRadius = '4px';
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

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when aircraft data changes - map should already be initialized
  useEffect(() => {
    // Wait for map to be ready
    if (!mapInstanceRef.current) {
      return;
    }

    // If no data, just clear markers
    if (!aircraftData || aircraftData.length === 0) {
      Object.values(markersRef.current).forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = {};
      return;
    }

    const map = mapInstanceRef.current;
    
    // Filter valid aircraft data (no arbitrary limit - show all valid aircraft)
    const displayData = aircraftData.filter(aircraft => {
      return aircraft.latitude !== null && aircraft.longitude !== null &&
             aircraft.latitude !== undefined && aircraft.longitude !== undefined &&
             !isNaN(aircraft.latitude) && !isNaN(aircraft.longitude) &&
             aircraft.latitude >= -90 && aircraft.latitude <= 90 &&
             aircraft.longitude >= -180 && aircraft.longitude <= 180;
    });

    // Remove old markers that are no longer in the data
    const currentIcao24s = new Set(displayData.map(a => a.icao24));
    Object.keys(markersRef.current).forEach(icao24 => {
      if (!currentIcao24s.has(icao24)) {
        map.removeLayer(markersRef.current[icao24]);
        delete markersRef.current[icao24];
      }
    });

    // Helper to create popup content
    const createPopupContent = (aircraft) => {
      const formatAltitude = (meters) => {
        if (meters === null) return 'N/A';
        const feet = meters * 3.28084;
        return `${feet.toFixed(0)} ft (${meters.toFixed(0)} m)`;
      };
      const formatSpeed = (mps) => {
        if (mps === null) return 'N/A';
        const kmh = mps * 3.6;
        return `${kmh.toFixed(0)} km/h`;
      };
      
      return `
        <div style="font-family: system-ui, sans-serif; min-width: 200px;">
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; border-bottom: 2px solid #000; padding-bottom: 4px;">
            ${aircraft.callsign !== 'N/A' ? aircraft.callsign : 'Unknown'}
          </div>
          <div style="font-size: 12px; line-height: 1.6;">
            <div><strong>ICAO24:</strong> ${aircraft.icao24}</div>
            <div><strong>Country:</strong> ${aircraft.origin_country}</div>
            <div><strong>Altitude:</strong> ${formatAltitude(aircraft.baro_altitude || aircraft.geo_altitude)}</div>
            <div><strong>Speed:</strong> ${formatSpeed(aircraft.velocity)}</div>
            ${aircraft.true_track !== null ? `<div><strong>Heading:</strong> ${aircraft.true_track.toFixed(1)}°</div>` : ''}
            ${aircraft.vertical_rate !== null ? `<div><strong>Vertical Rate:</strong> ${(aircraft.vertical_rate * 3.28084).toFixed(0)} ft/min</div>` : ''}
            ${aircraft.squawk ? `<div><strong>Squawk:</strong> ${aircraft.squawk}</div>` : ''}
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ccc;">
              <strong>Status:</strong> <span style="color: ${aircraft.on_ground ? '#888' : '#3B82F6'}; font-weight: bold;">
                ${aircraft.on_ground ? 'On Ground' : 'In Air'}
              </span>
            </div>
          </div>
        </div>
      `;
    };

    // Process markers in batches to prevent UI freeze
    // Smaller batches but process faster for better performance
    const BATCH_SIZE = 100;
    let index = 0;

    const processBatch = () => {
      const end = Math.min(index + BATCH_SIZE, displayData.length);
      
      for (let i = index; i < end; i++) {
        const aircraft = displayData[i];
        const icao24 = aircraft.icao24;
        const position = [aircraft.latitude, aircraft.longitude];
        const heading = aircraft.true_track !== null ? aircraft.true_track : 0;

        if (markersRef.current[icao24]) {
          // Update existing marker - only if position changed significantly
          const marker = markersRef.current[icao24];
          const currentPos = marker.getLatLng();
          const latDiff = Math.abs(currentPos.lat - position[0]);
          const lngDiff = Math.abs(currentPos.lng - position[1]);
          
          if (latDiff > 0.01 || lngDiff > 0.01) {
            marker.setLatLng(position);
            marker.setIcon(createAircraftIcon(heading, aircraft.on_ground));
          }
        } else {
          // Create new marker
          try {
            const icon = createAircraftIcon(heading, aircraft.on_ground);
            const marker = L.marker(position, { icon: icon })
              .bindPopup(createPopupContent(aircraft), { maxWidth: 250 })
              .addTo(map);
            markersRef.current[icao24] = marker;
          } catch (error) {
            // Ignore errors
          }
        }
      }

      index = end;

      if (index < displayData.length) {
        // Process next batch
        setTimeout(processBatch, 0);
      } else {
        // Only adjust bounds on very first load - never after that
        if (!hasInitializedBoundsRef.current && Object.keys(markersRef.current).length > 0) {
          hasInitializedBoundsRef.current = true;
          // Small delay to ensure all markers are rendered
          setTimeout(() => {
            try {
              const markers = Object.values(markersRef.current);
              if (markers.length > 0) {
                const group = L.featureGroup(markers);
                const bounds = group.getBounds();
                if (bounds && bounds.isValid()) {
                  // Fit bounds but don't zoom too far out, and don't zoom too far in
                  map.fitBounds(bounds, { 
                    padding: [50, 50], 
                    maxZoom: 8,
                    animate: true
                  });
                }
              }
            } catch (e) {
              // Ignore
            }
          }, 500);
        }
      }
    };

    // Start processing
    processBatch();
  }, [aircraftData]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '600px',
        background: '#000000',
      }}
      className="border-4 border-black dark:border-white"
    />
  );
}

