'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const ROVERS = [
  { name: 'curiosity', fullName: 'Curiosity', launch: '2011', landing: '2012' },
  { name: 'opportunity', fullName: 'Opportunity', launch: '2003', landing: '2004', status: 'End of mission 2019' },
  { name: 'spirit', fullName: 'Spirit', launch: '2003', landing: '2004', status: 'End of mission 2010' },
  { name: 'perseverance', fullName: 'Perseverance', launch: '2020', landing: '2021' }
];

const CAMERAS = {
  curiosity: {
    FHAZ: 'Front Hazard Avoidance Camera',
    RHAZ: 'Rear Hazard Avoidance Camera',
    MAST: 'Mast Camera',
    CHEMCAM: 'Chemistry and Camera Complex',
    MAHLI: 'Mars Hand Lens Imager',
    MARDI: 'Mars Descent Imager',
    NAVCAM: 'Navigation Camera'
  },
  perseverance: {
    EDL_RUCAM: 'Rover Up-Look Camera',
    EDL_RDCAM: 'Rover Down-Look Camera',
    EDL_DDCAM: 'Descent Stage Down-Look Camera',
    EDL_PUCAM1: 'Parachute Up-Look Camera A',
    EDL_PUCAM2: 'Parachute Up-Look Camera B',
    NAVCAM_LEFT: 'Navigation Camera - Left',
    NAVCAM_RIGHT: 'Navigation Camera - Right',
    MCZ_LEFT: 'Mast Camera Zoom - Left',
    MCZ_RIGHT: 'Mast Camera Zoom - Right',
    FRONT_HAZCAM_LEFT_A: 'Front Hazard Camera - Left',
    FRONT_HAZCAM_RIGHT_A: 'Front Hazard Camera - Right',
    REAR_HAZCAM_LEFT: 'Rear Hazard Camera - Left',
    REAR_HAZCAM_RIGHT: 'Rear Hazard Camera - Right',
    SKYCAM: 'MEDA Skycam',
    SUPERCAM_RMI: 'SuperCam Remote Micro Imager',
    LCAM: 'Lander Vision System Camera'
  },
  opportunity: {
    FHAZ: 'Front Hazard Avoidance Camera',
    RHAZ: 'Rear Hazard Avoidance Camera',
    NAVCAM: 'Navigation Camera',
    PANCAM: 'Panoramic Camera',
    MINITES: 'Mini-TES'
  },
  spirit: {
    FHAZ: 'Front Hazard Avoidance Camera',
    RHAZ: 'Rear Hazard Avoidance Camera',
    NAVCAM: 'Navigation Camera',
    PANCAM: 'Panoramic Camera',
    MINITES: 'Mini-TES'
  }
};

export default function MarsRoverPage() {
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [selectedSol, setSelectedSol] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalPhotos: 0, sols: [] });

  const fetchPhotos = async () => {
    if (!selectedSol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `/api/mars-photos?rover=${selectedRover}&sol=${selectedSol}${selectedCamera !== 'all' ? `&camera=${selectedCamera}` : ''}`;
      const response = await fetch(url);
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Failed to fetch photos';
        const details = data.details ? ` (${JSON.stringify(data.details).substring(0, 100)})` : '';
        throw new Error(errorMsg + details);
      }
      
      setPhotos(data.photos || []);
      
      if (data.photos) {
        setStats({
          totalPhotos: data.photos.length,
          sols: [...new Set(data.photos.map(p => p.sol))]
        });
      }
    } catch (err) {
      console.error('Mars rover error:', err);
      setError(err.message);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSol) {
      fetchPhotos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRover, selectedSol, selectedCamera]);

  const getAvailableCameras = () => {
    return CAMERAS[selectedRover] || {};
  };

  return (
    <main className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] text-black dark:text-white">
      <section className="border-b-4 border-black dark:border-white bg-gradient-to-br from-red-900 to-red-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-bold uppercase tracking-widest mb-3">MARS ROVER PHOTOS</div>
          <h1 className="text-5xl font-bold uppercase tracking-tight md:text-6xl mb-4">
            Explore Mars<br />Through Rover Eyes
          </h1>
          <p className="text-lg font-medium max-w-2xl">
            Browse thousands of images captured by NASA&apos;s Mars rovers on the Red Planet
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Controls */}
          <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Rover Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                  Select Rover:
                </label>
                <select
                  value={selectedRover}
                  onChange={(e) => {
                    setSelectedRover(e.target.value);
                    setSelectedCamera('all');
                  }}
                  className="w-full border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white px-4 py-3 font-bold uppercase tracking-wider"
                >
                  {ROVERS.map(rover => (
                    <option key={rover.name} value={rover.name}>
                      {rover.fullName} ({rover.landing})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sol Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                  Sol (Mars Day):
                </label>
                <input
                  type="number"
                  value={selectedSol}
                  onChange={(e) => setSelectedSol(e.target.value)}
                  placeholder="e.g., 1000"
                  className="w-full border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white px-4 py-3 font-bold uppercase tracking-wider"
                />
              </div>

              {/* Camera Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                  Camera:
                </label>
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="w-full border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white px-4 py-3 font-bold uppercase tracking-wider"
                >
                  <option value="all">All Cameras</option>
                  {Object.entries(getAvailableCameras()).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rover Info */}
            {ROVERS.find(r => r.name === selectedRover) && (
              <div className="mt-4 pt-4 border-t-2 border-black dark:border-white">
                <div className="text-sm">
                  <strong>{ROVERS.find(r => r.name === selectedRover)?.fullName}</strong>
                  {ROVERS.find(r => r.name === selectedRover)?.status && (
                    <span className="ml-2 text-red-600 dark:text-red-400 font-bold">
                      {ROVERS.find(r => r.name === selectedRover)?.status}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {loading && (
            <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-12 text-center">
              <div className="inline-block animate-spin h-12 w-12 border-4 border-red-600 dark:border-red-500 border-t-transparent mb-4"></div>
              <p className="font-bold uppercase tracking-wider">Loading Mars Photos...</p>
            </div>
          )}

          {error && (
            <div className="border-4 border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/20 p-6 mb-8">
              <p className="font-bold uppercase text-red-600 dark:text-red-400 mb-2">Error: {error}</p>
              <p className="text-xs opacity-70">
                Try a different sol number. For Curiosity, try sols 100-1000. For Perseverance, try sols 50-500.
              </p>
            </div>
          )}

          {!loading && !error && photos.length > 0 && (
            <>
              <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-4 mb-8">
                <p className="font-bold uppercase text-lg">
                  Found {stats.totalPhotos} Photos
                </p>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden group cursor-pointer hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all"
                  >
                    <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
                      <Image
                        src={photo.img_src}
                        alt={`Mars photo ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                    <div className="p-2 text-xs">
                      <div className="font-bold uppercase">Sol {photo.sol}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {photo.camera?.name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && !error && selectedSol && photos.length === 0 && (
            <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-12 text-center">
              <p className="font-bold uppercase tracking-wider text-lg mb-2">
                No photos found for Sol {selectedSol}
              </p>
              <p className="text-sm opacity-70">
                Try a different sol or rover camera combination
              </p>
            </div>
          )}

          {!selectedSol && (
            <div className="border-4 border-yellow-600 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-6">
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3">ℹ️ How to Use</h3>
              <ul className="space-y-2 text-sm">
                <li>1. Select a Mars rover (Curiosity, Perseverance, Opportunity, or Spirit)</li>
                <li>2. Enter a sol (Mars day) number (e.g., 1000 for Curiosity, 600 for Perseverance)</li>
                <li>3. Optionally filter by camera type</li>
                <li>4. Browse the Martian landscape captured by the rover!</li>
              </ul>
              <div className="mt-4 text-xs opacity-70">
                <strong>Tip:</strong> Curiosity has been active for 4000+ sols, Perseverance for 900+ sols
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

