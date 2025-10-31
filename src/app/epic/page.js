'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function EpicPage() {
  const [collection, setCollection] = useState('natural');
  const [selectedDate, setSelectedDate] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  const collections = [
    { id: 'natural', name: 'Natural Color', icon: '🌍', description: 'True color imagery of Earth' },
    { id: 'enhanced', name: 'Enhanced Color', icon: '🎨', description: 'Enhanced color imagery' },
    { id: 'aerosol', name: 'Aerosol Index', icon: '💨', description: 'UV aerosol index imagery' },
    { id: 'cloud', name: 'Cloud Fraction', icon: '☁️', description: 'Cloud fraction imagery' },
  ];

  useEffect(() => {
    fetchAvailableDates();
  }, [collection]);

  useEffect(() => {
    if (selectedDate) {
      fetchImages();
    } else {
      fetchMostRecent();
    }
  }, [collection, selectedDate]);

  const fetchAvailableDates = async () => {
    try {
      const response = await fetch(`https://epic.gsfc.nasa.gov/api/${collection}/available`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const dates = await response.json();
      setAvailableDates(dates.slice(0, 30));
    } catch (err) {
      console.error('Error fetching available dates:', err);
    }
  };

  const fetchMostRecent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://epic.gsfc.nasa.gov/api/${collection}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setImages(data);
      if (data.length > 0) {
        setSelectedImage(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://epic.gsfc.nasa.gov/api/${collection}/date/${selectedDate}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setImages(data);
      if (data.length > 0) {
        setSelectedImage(data[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image, size = 'jpg') => {
    if (!image) return '';
    const date = new Date(image.date);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    
    const fileExtension = size === 'thumbs' ? 'jpg' : size;
    const imageName = `${image.image}.${fileExtension}`;

    return `https://epic.gsfc.nasa.gov/archive/${collection}/${year}/${month}/${day}/${size}/${imageName}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatCoordinates = (coord) => {
    if (!coord) return 'N/A';
    return `${coord.toFixed(4)}°`;
  };

  const formatPosition = (pos) => {
    if (!pos) return 'N/A';
    return `X: ${pos.x?.toFixed(2) || 'N/A'}, Y: ${pos.y?.toFixed(2) || 'N/A'}, Z: ${pos.z?.toFixed(2) || 'N/A'}`;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-black text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          NASA EPIC
        </h1>
        <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Earth Polychromatic Imaging Camera provides daily full disc imagery of Earth from the DSCOVR satellite, 
          uniquely positioned at the Earth-Sun Lagrange point.
        </p>

        <div className="bg-white dark:bg-[#333333] p-6 rounded-lg shadow-lg mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Collection & Date</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {images.length} image{images.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                Collection Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {collections.map((coll) => (
                  <button
                    key={coll.id}
                    onClick={() => {
                      setCollection(coll.id);
                      setSelectedDate('');
                    }}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      collection === coll.id
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{coll.icon}</span>
                    <span className="text-left">
                      <div className="font-semibold">{coll.name}</div>
                      <div className="text-xs opacity-70">{coll.description}</div>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                Select Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium mb-2"
              >
                <option value="">Most Recent</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Showing last 30 available dates
              </p>
            </div>
          </div>
        </div>


        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Earth imagery...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {selectedImage && (
                <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                  <div className="relative aspect-square bg-black">
                    <img
                      src={getImageUrl(selectedImage, 'png')}
                      alt={selectedImage.caption || 'EPIC Earth image'}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      {selectedImage.caption || 'Earth Full Disc'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {formatDate(selectedImage.date)}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                          Centroid Coordinates
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500 dark:text-gray-400">Latitude:</span> {formatCoordinates(selectedImage.centroid_coordinates?.lat)}</p>
                          <p><span className="text-gray-500 dark:text-gray-400">Longitude:</span> {formatCoordinates(selectedImage.centroid_coordinates?.lon)}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                          Attitude Quaternions
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500 dark:text-gray-400">Q0:</span> {selectedImage.attitude_quaternions?.q0?.toFixed(6) || 'N/A'}</p>
                          <p><span className="text-gray-500 dark:text-gray-400">Q1:</span> {selectedImage.attitude_quaternions?.q1?.toFixed(6) || 'N/A'}</p>
                          <p><span className="text-gray-500 dark:text-gray-400">Q2:</span> {selectedImage.attitude_quaternions?.q2?.toFixed(6) || 'N/A'}</p>
                          <p><span className="text-gray-500 dark:text-gray-400">Q3:</span> {selectedImage.attitude_quaternions?.q3?.toFixed(6) || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                          🛰️ DSCOVR Position (J2000)
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatPosition(selectedImage.dscovr_j2000_position)}</p>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                          🌙 Lunar Position (J2000)
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatPosition(selectedImage.lunar_j2000_position)}</p>
                      </div>

                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                          ☀️ Sun Position (J2000)
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatPosition(selectedImage.sun_j2000_position)}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-3">
                        <a
                          href={getImageUrl(selectedImage, 'png')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                        >
                          Download PNG
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                        <a
                          href={getImageUrl(selectedImage, 'jpg')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                        >
                          Download JPG
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#333333] p-4 rounded-lg shadow-lg sticky top-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Image Timeline
                </h3>
                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedImage?.image === img.image
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(img, 'thumbs')}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {new Date(img.date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs opacity-70 truncate">
                            {img.centroid_coordinates?.lat?.toFixed(2)}°, {img.centroid_coordinates?.lon?.toFixed(2)}°
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && images.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#333333] rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No images available for the selected date and collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

