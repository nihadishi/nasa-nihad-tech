'use client';

import { useState, useEffect } from 'react';

export default function EonetPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [status, setStatus] = useState('open');
  const [days, setDays] = useState('30');
  const [limit, setLimit] = useState('50');

  const categories = [
    { id: 'all', name: 'All Events', icon: '🌍' },
    { id: 'wildfires', name: 'Wildfires', icon: '🔥' },
    { id: 'storms', name: 'Storms', icon: '🌪️' },
    { id: 'floods', name: 'Floods', icon: '🌊' },
    { id: 'volcanoes', name: 'Volcanoes', icon: '🌋' },
    { id: 'drought', name: 'Drought', icon: '☀️' },
    { id: 'earthquakes', name: 'Earthquakes', icon: '🏔️' },
    { id: 'seaLakeIce', name: 'Sea/Lake Ice', icon: '🧊' },
    { id: 'severeStorms', name: 'Severe Storms', icon: '⛈️' },
    { id: 'snow', name: 'Snow', icon: '❄️' },
    { id: 'dustHaze', name: 'Dust & Haze', icon: '💨' },
    { id: 'landslides', name: 'Landslides', icon: '⛰️' },
  ];

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, status, days, limit]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = 'https://eonet.gsfc.nasa.gov/api/v3/events';
      const params = new URLSearchParams();
      
      if (status !== 'all') {
        params.append('status', status);
      }
      
      if (days && days !== 'all') {
        params.append('days', days);
      }
      
      if (limit) {
        params.append('limit', limit);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      let filteredEvents = result.events || [];
      
      if (selectedCategory !== 'all') {
        filteredEvents = filteredEvents.filter(event => 
          event.categories.some(cat => cat.id === selectedCategory)
        );
      }
      
      setEvents(filteredEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (categoryId) => {
    const colors = {
      wildfires: 'border-orange-500 bg-orange-100 dark:bg-orange-900/30',
      storms: 'border-blue-500 bg-blue-100 dark:bg-blue-900/30',
      floods: 'border-cyan-500 bg-cyan-100 dark:bg-cyan-900/30',
      volcanoes: 'border-red-500 bg-red-100 dark:bg-red-900/30',
      drought: 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
      earthquakes: 'border-purple-500 bg-purple-100 dark:bg-purple-900/30',
      seaLakeIce: 'border-sky-500 bg-sky-100 dark:bg-sky-900/30',
      severeStorms: 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30',
      snow: 'border-slate-500 bg-slate-100 dark:bg-slate-900/30',
      dustHaze: 'border-amber-500 bg-amber-100 dark:bg-amber-900/30',
      landslides: 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/30',
    };
    return colors[categoryId] || 'border-gray-500 bg-gray-100 dark:bg-gray-900/30';
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#1a1a1a] text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 border-b-4 border-black dark:border-white pb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Natural Events</p>
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4">EONET</h1>
          <p className="text-sm font-medium uppercase tracking-wider text-black/60 dark:text-white/60">
            Earth Observatory Natural Event Tracker
          </p>
          <p className="mt-6 leading-relaxed max-w-4xl">
            Track natural events happening around the world in near real-time. EONET provides a curated source 
            of continuously updated natural event metadata, including wildfires, storms, volcanoes, and more.
          </p>
        </div>

        <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wider">Filters</h2>
              <p className="text-sm font-medium mt-1 text-black/60 dark:text-white/60">
                {events.length} event{events.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="relative border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-bold uppercase tracking-wider overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-y-0 active:translate-x-0"
            >
              <span className="relative z-10">{loading ? 'Loading...' : 'Refresh'}</span>
              <span className="absolute inset-0 flex items-center justify-center text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">
                {loading ? 'Loading...' : 'Refresh'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold mb-3 uppercase tracking-wider">
                Event Status
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatus('all')}
                  className={`relative border-4 border-black dark:border-white px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    status === 'all'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -translate-y-0.5 -translate-x-0.5'
                      : 'bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatus('open')}
                  className={`relative border-4 border-black dark:border-white px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    status === 'open'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -translate-y-0.5 -translate-x-0.5'
                      : 'bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatus('closed')}
                  className={`relative border-4 border-black dark:border-white px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    status === 'closed'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -translate-y-0.5 -translate-x-0.5'
                      : 'bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                  }`}
                >
                  Closed
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-3 uppercase tracking-wider">
                Time Range
              </label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold uppercase text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
                <option value="60">Last 60 days</option>
                <option value="90">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-3 uppercase tracking-wider">
                Max Results
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full p-2.5 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-bold uppercase text-sm"
              >
                <option value="10">10 events</option>
                <option value="25">25 events</option>
                <option value="50">50 events</option>
                <option value="100">100 events</option>
                <option value="250">250 events</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-3 uppercase tracking-wider">
              Event Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative border-4 border-black dark:border-white px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -translate-y-0.5 -translate-x-0.5'
                      : 'bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="border-4 border-red-600 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-6 py-4 mb-8">
            <strong className="font-bold uppercase tracking-wider">Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-12 w-12 border-4 border-black dark:border-white border-t-transparent"></div>
            <p className="mt-4 font-bold uppercase tracking-wider text-sm">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="border-4 border-black dark:border-white bg-white dark:bg-black transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {event.categories.map((cat) => (
                          <span
                            key={cat.id}
                            className="px-2.5 py-1 border-2 border-black dark:border-white bg-white dark:bg-black text-xs font-bold uppercase"
                          >
                            {cat.title}
                          </span>
                        ))}
                      </div>
                    </div>
                    {!event.closed ? (
                      <span className="shrink-0 px-3 py-1 border-2 border-green-600 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-bold uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="shrink-0 px-3 py-1 border-2 border-black dark:border-white bg-white dark:bg-black text-xs font-bold uppercase">
                        Closed
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Started:</span> {formatDate(event.geometry[0]?.date)}
                      </span>
                    </div>
                    {event.closed && (
                      <div className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Ended:</span> {formatDate(event.geometry[event.geometry.length - 1]?.date)}
                        </span>
                      </div>
                    )}
                    {event.geometry[0]?.coordinates && (
                      <div className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Location:</span> {event.geometry[0].coordinates[1].toFixed(2)}°, {event.geometry[0].coordinates[0].toFixed(2)}°
                        </span>
                      </div>
                    )}
                  </div>

                  {event.sources && event.sources.length > 0 && (
                    <div className="pt-4 border-t-2 border-black dark:border-white">
                      <p className="text-xs font-bold uppercase tracking-wider mb-3">
                        Sources ({event.sources.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {event.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-bold uppercase"
                          >
                            {source.id}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-center py-12 border-4 border-black dark:border-white bg-white dark:bg-black">
            <p className="font-bold uppercase tracking-wider text-sm">
              No events found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

