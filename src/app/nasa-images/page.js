'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const API_BASE = 'https://images-api.nasa.gov';

export default function NASAImagesPage() {
  const [searchParams, setSearchParams] = useState({
    q: '',
    center: '',
    description: '',
    keywords: '',
    location: '',
    photographer: '',
    title: '',
    year_start: '',
    year_end: '',
    page: 1,
    page_size: 24
  });

  const [activeMediaType, setActiveMediaType] = useState('image');
  const [loadingImages, setLoadingImages] = useState({});

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const nasaCenters = ['ARC', 'GRC', 'GSFC', 'HQ', 'JPL', 'JSC', 'KSC', 'LARC', 'MSFC', 'NSSDCA', 'SSC'];
  const popularAlbums = ['apollo', 'mars', 'hubble', 'earth', 'iss', 'shuttle'];

  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performSearch = async (overrideParams = null, retry = 0) => {
    setLoading(true);
    setError(null);
    if (retry === 0) {
      setResults(null);
    }

    try {
      const params = new URLSearchParams();
      const paramsToUse = overrideParams || searchParams;
      
      Object.entries(paramsToUse).forEach(([key, value]) => {
        if (value && key !== 'page_size') {
          params.append(key, value);
        }
      });
      
      params.append('media_type', activeMediaType);
      
      const pageSize = paramsToUse.page_size || searchParams.page_size;
      if (pageSize) {
        params.append('page_size', pageSize);
      }

      let url;
      if (params.toString()) {
        url = `${API_BASE}/search?${params.toString()}`;
      } else {
        url = `${API_BASE}/search?q=nasa&media_type=${activeMediaType}&page_size=${pageSize}`;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status === 404 && retry < 2) {
          console.log(`Retry attempt ${retry + 1} due to 404...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return performSearch(overrideParams, retry + 1);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.collection || !data.collection.items) {
        throw new Error('Invalid response format from API');
      }
      
      setResults(data.collection);
      setRetryCount(0);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout. The API took too long to respond. Please try again.');
      } else if (err.message.includes('404') && retry < 2) {
        console.log(`Retry attempt ${retry + 1} due to error...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return performSearch(overrideParams, retry + 1);
      } else {
        setError(err.message);
        setRetryCount(retry);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadItemDetails = async (nasaId, retry = 0) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const assetResponse = await fetch(`${API_BASE}/asset/${nasaId}`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      
      clearTimeout(timeout);

      if (!assetResponse.ok) {
        if (assetResponse.status === 404 && retry < 2) {
          await new Promise(resolve => setTimeout(resolve, 500));
          return loadItemDetails(nasaId, retry + 1);
        }
        throw new Error(`Failed to load asset details: ${assetResponse.status}`);
      }

      const assetData = await assetResponse.json();
      
      let metadata = null;
      try {
        const metadataResponse = await fetch(`${API_BASE}/metadata/${nasaId}`);
        const metadataLocation = await metadataResponse.json();
        if (metadataLocation.location) {
          const metaResponse = await fetch(metadataLocation.location);
          metadata = await metaResponse.json();
        }
      } catch (e) {
        console.log('No metadata available');
      }

      let captions = null;
      try {
        const captionsResponse = await fetch(`${API_BASE}/captions/${nasaId}`);
        captions = await captionsResponse.json();
      } catch (e) {
        console.log('No captions available');
      }

      setItemDetails({
        assets: assetData.collection?.items || [],
        metadata,
        captions
      });
    } catch (err) {
      console.error('Error loading details:', err);
      setItemDetails({
        assets: [],
        metadata: null,
        captions: null,
        error: err.message
      });
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setItemDetails(null);
    loadItemDetails(item.data[0].nasa_id);
  };

  const handleInputChange = (key, value) => {
    setSearchParams(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    const newParams = { ...searchParams, page: newPage };
    setSearchParams(newParams);
    performSearch(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAlbumSearch = (album) => {
    setAlbumName(album);
    const newParams = { ...searchParams, q: album, page: 1 };
    setSearchParams(newParams);
    performSearch(newParams);
  };

  const handleMediaTypeChange = (type) => {
    setActiveMediaType(type);
    const newParams = { ...searchParams, page: 1 };
    setSearchParams(newParams);
    performSearchWithMediaType(newParams, type);
  };

  const performSearchWithMediaType = async (params, mediaType, retry = 0) => {
    setLoading(true);
    setError(null);
    if (retry === 0) {
      setResults(null);
    }

    try {
      const urlParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value && key !== 'page_size') {
          urlParams.append(key, value);
        }
      });
      
      urlParams.append('media_type', mediaType);
      
      const pageSize = params.page_size || searchParams.page_size;
      if (pageSize) {
        urlParams.append('page_size', pageSize);
      }

      let url;
      if (urlParams.toString()) {
        url = `${API_BASE}/search?${urlParams.toString()}`;
      } else {
        url = `${API_BASE}/search?q=nasa&media_type=${mediaType}&page_size=${pageSize}`;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status === 404 && retry < 2) {
          console.log(`Retry attempt ${retry + 1} due to 404...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return performSearchWithMediaType(params, mediaType, retry + 1);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.collection || !data.collection.items) {
        throw new Error('Invalid response format from API');
      }
      
      setResults(data.collection);
      setRetryCount(0);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout. The API took too long to respond. Please try again.');
      } else if (err.message.includes('404') && retry < 2) {
        console.log(`Retry attempt ${retry + 1} due to error...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return performSearchWithMediaType(params, mediaType, retry + 1);
      } else {
        setError(err.message);
        setRetryCount(retry);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchParams({
      q: '',
      center: '',
      description: '',
      keywords: '',
      location: '',
      photographer: '',
      title: '',
      year_start: '',
      year_end: '',
      page: 1,
      page_size: 24
    });
    setAlbumName('');
    setActiveMediaType('image');
  };

  const getPreviewImage = (item) => {
    const link = item.links?.find(l => l.rel === 'preview');
    return link?.href || '/logo.svg';
  };

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'image': return '🖼️';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            NASA Image & Video Library
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Search through thousands of NASA images, videos, and audio files. Explore missions, 
            planets, astronauts, and more from NASA&apos;s extensive media archive.
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Media Type:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleMediaTypeChange('image')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeMediaType === 'image'
                      ? 'bg-white text-black'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  🖼️ Images
                </button>
                <button
                  onClick={() => handleMediaTypeChange('video')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeMediaType === 'video'
                      ? 'bg-white text-black'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  🎥 Videos
                </button>
                <button
                  onClick={() => handleMediaTypeChange('audio')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeMediaType === 'audio'
                      ? 'bg-white text-black'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  🎵 Audio
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-4 mb-4">
              <div className="flex-1 min-w-[300px]">
                <label className="block text-sm text-gray-400 mb-2">Search Query</label>
                <input
                  type="text"
                  value={searchParams.q}
                  onChange={(e) => handleInputChange('q', e.target.value)}
                  placeholder="apollo 11, mars rover, hubble..."
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white"
                  onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                />
              </div>

              <button
                onClick={() => performSearch()}
                className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Search
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>

              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Clear All
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={searchParams.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Search in titles..."
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <input
                    type="text"
                    value={searchParams.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Search in descriptions..."
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Keywords</label>
                  <input
                    type="text"
                    value={searchParams.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    placeholder="moon, landing, astronaut..."
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">NASA Center</label>
                  <select
                    value={searchParams.center}
                    onChange={(e) => handleInputChange('center', e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-white"
                  >
                    <option value="">All Centers</option>
                    {nasaCenters.map(center => (
                      <option key={center} value={center}>{center}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Location</label>
                  <input
                    type="text"
                    value={searchParams.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Kennedy Space Center..."
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Photographer</label>
                  <input
                    type="text"
                    value={searchParams.photographer}
                    onChange={(e) => handleInputChange('photographer', e.target.value)}
                    placeholder="Photographer name..."
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Year Start</label>
                  <input
                    type="text"
                    value={searchParams.year_start}
                    onChange={(e) => handleInputChange('year_start', e.target.value)}
                    placeholder="YYYY"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Year End</label>
                  <input
                    type="text"
                    value={searchParams.year_end}
                    onChange={(e) => handleInputChange('year_end', e.target.value)}
                    placeholder="YYYY"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Results Per Page</label>
                  <select
                    value={searchParams.page_size}
                    onChange={(e) => handleInputChange('page_size', e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-white"
                  >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Popular Albums:</p>
            <div className="flex flex-wrap gap-2">
              {popularAlbums.map(album => (
                <button
                  key={album}
                  onClick={() => handleAlbumSearch(album)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    albumName === album
                      ? 'bg-white text-black'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {album.charAt(0).toUpperCase() + album.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p className="text-gray-400">Loading media...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 px-6 py-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold mb-2">Error Loading Results:</p>
                <p className="mb-4">{error}</p>
                <p className="text-sm text-red-400 mb-3">
                  The NASA Images API can be temporarily unavailable. This is normal.
                </p>
                <button
                  onClick={() => performSearch()}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {results && !loading && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-gray-400">
                  {results.metadata?.total_hits?.toLocaleString() || 0} results found
                  {albumName && <span className="ml-2 text-white">in album: {albumName}</span>}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Showing: {activeMediaType === 'image' ? '🖼️ Images' : activeMediaType === 'video' ? '🎥 Videos' : '🎵 Audio'} only
                </p>
              </div>
              <div className="flex items-center gap-4">
                {results.links?.find(l => l.rel === 'prev') && (
                  <button
                    onClick={() => handlePageChange(searchParams.page - 1)}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    ← Previous
                  </button>
                )}
                <span className="text-gray-400">Page {searchParams.page}</span>
                {results.links?.find(l => l.rel === 'next') && (
                  <button
                    onClick={() => handlePageChange(searchParams.page + 1)}
                    className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {results.items?.map((item, index) => {
                const data = item.data[0];
                const itemKey = `${data.nasa_id}-${index}`;
                return (
                  <div
                    key={itemKey}
                    onClick={() => handleItemClick(item)}
                    className="group cursor-pointer bg-white dark:bg-black border-4 border-black dark:border-white overflow-hidden transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
                  >
                    <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                      {loadingImages[itemKey] !== false && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                          <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black dark:border-white border-t-transparent dark:border-t-transparent mb-3"></div>
                            <p className="text-sm font-medium text-black dark:text-white uppercase tracking-wider">
                              Loading...
                            </p>
                          </div>
                        </div>
                      )}
                      <Image
                        src={getPreviewImage(item)}
                        alt={data.title || 'NASA media'}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          loadingImages[itemKey] !== false ? 'opacity-0 scale-110' : 'opacity-100 scale-100 group-hover:scale-105'
                        }`}
                        unoptimized
                        onLoadingComplete={() => {
                          setLoadingImages(prev => ({ ...prev, [itemKey]: false }));
                        }}
                        onError={() => {
                          setLoadingImages(prev => ({ ...prev, [itemKey]: false }));
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 text-xs font-bold uppercase tracking-widest border-2 border-black dark:border-white">
                        {data.media_type}
                      </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-black border-t-4 border-black dark:border-white">
                      <h3 className="font-bold text-lg mb-3 line-clamp-2 text-black dark:text-white leading-tight">
                        {data.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        {data.date_created && (
                          <p className="text-black dark:text-white font-medium">
                            {new Date(data.date_created).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        )}
                        {data.center && (
                          <span className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                            {data.center}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {selectedItem && (
          <div
            className="fixed inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-50 overflow-y-auto"
            onClick={() => setSelectedItem(null)}
          >
            <div className="min-h-screen px-4 py-12">
              <div
                className="max-w-7xl mx-auto bg-white dark:bg-black border-8 border-black dark:border-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between p-8 border-b-4 border-black dark:border-white">
                  <h2 className="text-3xl font-bold text-black dark:text-white pr-8 leading-tight">
                    {selectedItem.data[0].title}
                  </h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black text-3xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors border-2 border-black dark:border-white"
                  >
                    ×
                  </button>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 border-4 border-black dark:border-white overflow-hidden">
                        <Image
                          src={getPreviewImage(selectedItem)}
                          alt={selectedItem.data[0].title}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      {itemDetails?.assets && itemDetails.assets.length > 0 && (
                        <div className="bg-zinc-100 dark:bg-zinc-900 border-4 border-black dark:border-white p-6">
                          <h3 className="font-bold text-xl mb-4 text-black dark:text-white uppercase tracking-wider">
                            Downloads
                          </h3>
                          <div className="space-y-3 max-h-80 overflow-y-auto">
                            {itemDetails.assets.map((asset, idx) => (
                              <a
                                key={idx}
                                href={asset.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all text-sm font-medium break-all"
                              >
                                ↓ {asset.href.split('/').pop()}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="font-bold text-2xl mb-6 text-black dark:text-white uppercase tracking-wider border-b-4 border-black dark:border-white pb-3">
                          Details
                        </h3>
                        <div className="space-y-5">
                          <div className="border-l-4 border-black dark:border-white pl-4">
                            <span className="text-sm font-bold text-black/60 dark:text-white/60 uppercase tracking-wider block mb-1">
                              NASA ID
                            </span>
                            <p className="text-black dark:text-white font-mono text-lg">
                              {selectedItem.data[0].nasa_id}
                            </p>
                          </div>
                          
                          {selectedItem.data[0].date_created && (
                            <div className="border-l-4 border-black dark:border-white pl-4">
                              <span className="text-sm font-bold text-black/60 dark:text-white/60 uppercase tracking-wider block mb-1">
                                Date Created
                              </span>
                              <p className="text-black dark:text-white text-lg font-medium">
                                {new Date(selectedItem.data[0].date_created).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          )}

                          {selectedItem.data[0].center && (
                            <div className="border-l-4 border-black dark:border-white pl-4">
                              <span className="text-sm font-bold text-black/60 dark:text-white/60 uppercase tracking-wider block mb-1">
                                NASA Center
                              </span>
                              <p className="text-black dark:text-white text-lg font-medium">
                                {selectedItem.data[0].center}
                              </p>
                            </div>
                          )}

                          {selectedItem.data[0].media_type && (
                            <div className="border-l-4 border-black dark:border-white pl-4">
                              <span className="text-sm font-bold text-black/60 dark:text-white/60 uppercase tracking-wider block mb-1">
                                Media Type
                              </span>
                              <p className="text-black dark:text-white text-lg font-medium capitalize">
                                {selectedItem.data[0].media_type}
                              </p>
                            </div>
                          )}

                          {selectedItem.data[0].photographer && (
                            <div className="border-l-4 border-black dark:border-white pl-4">
                              <span className="text-sm font-bold text-black/60 dark:text-white/60 uppercase tracking-wider block mb-1">
                                Photographer
                              </span>
                              <p className="text-black dark:text-white text-lg font-medium">
                                {selectedItem.data[0].photographer}
                              </p>
                            </div>
                          )}

                          {selectedItem.data[0].location && (
                            <div className="border-l-4 border-black dark:border-white pl-4">
                              <span className="text-sm font-bold text-black/60 dark:text-white/60 uppercase tracking-wider block mb-1">
                                Location
                              </span>
                              <p className="text-black dark:text-white text-lg font-medium">
                                {selectedItem.data[0].location}
                              </p>
                            </div>
                          )}

                          {selectedItem.data[0].description && (
                            <div className="border-l-4 border-black dark:border-white pl-4">
                              <span className="text-sm font-bold text-black/60 dark:text-white/60 uppercase tracking-wider block mb-1">
                                Description
                              </span>
                              <p className="text-black dark:text-white leading-relaxed mt-2">
                                {selectedItem.data[0].description}
                              </p>
                            </div>
                          )}

                          {selectedItem.data[0].keywords && selectedItem.data[0].keywords.length > 0 && (
                            <div className="border-l-4 border-black dark:border-white pl-4">
                              <span className="text-sm font-bold text-black/60 dark:text-white/60 uppercase tracking-wider block mb-3">
                                Keywords
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {selectedItem.data[0].keywords.map((keyword, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {(itemDetails?.captions?.location || itemDetails?.metadata) && (
                        <div className="space-y-4">
                          {itemDetails?.captions?.location && (
                            <div className="bg-zinc-100 dark:bg-zinc-900 border-4 border-black dark:border-white p-6">
                              <h3 className="font-bold text-lg mb-3 text-black dark:text-white uppercase tracking-wider">
                                Captions
                              </h3>
                              <a
                                href={itemDetails.captions.location}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                              >
                                Download Captions
                              </a>
                            </div>
                          )}

                          {itemDetails?.metadata && (
                            <div className="bg-zinc-100 dark:bg-zinc-900 border-4 border-black dark:border-white p-6">
                              <h3 className="font-bold text-lg mb-2 text-black dark:text-white uppercase tracking-wider">
                                Extended Metadata
                              </h3>
                              <p className="text-sm text-black/70 dark:text-white/70">
                                Additional technical metadata is available for this asset.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

