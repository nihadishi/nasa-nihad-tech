"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";

const AsteroidOrbit3D = dynamic(() => import("@/components/AsteroidOrbit3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center border-4 border-black dark:border-white bg-zinc-900">
      <div className="text-sm font-bold uppercase tracking-wider text-white">Loading 3D...</div>
    </div>
  ),
});

const getDefaultDates = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    start: today.toISOString().split("T")[0],
    end: tomorrow.toISOString().split("T")[0]
  };
};

export default function AsteroidsPage() {
  const [view, setView] = useState("feed");
  const [feedData, setFeedData] = useState(null);
  const [lookupId, setLookupId] = useState("3542519");
  const [lookupData, setLookupData] = useState(null);
  const [browseData, setBrowseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const key = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
      const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${key}`);
      if (!res.ok) {
        console.error("Feed API error:", res.status, await res.text());
        setFeedData(null);
      } else {
        const data = await res.json();
        setFeedData(data);
      }
    } catch (error) {
      console.error("Feed fetch error:", error);
      setFeedData(null);
    }
    setLoading(false);
  };

  const fetchLookup = async (asteroidId = lookupId) => {
    setLoading(true);
    try {
      const key = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
      const res = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${key}`);
      if (!res.ok) {
        console.error("Lookup API error:", res.status, await res.text());
        setLookupData(null);
      } else {
        const data = await res.json();
        setLookupData(data);
        setLookupId(asteroidId);
      }
    } catch (error) {
      console.error("Lookup fetch error:", error);
      setLookupData(null);
    }
    setLoading(false);
  };

  const handleAsteroidClick = (asteroidId) => {
    setView("lookup");
    fetchLookup(asteroidId);
  };

  const fetchBrowse = async () => {
    setLoading(true);
    try {
      const key = process.env.NEXT_PUBLIC_NASA_API_KEY || "DEMO_KEY";
      const res = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${key}`);
      if (!res.ok) {
        console.error("Browse API error:", res.status, await res.text());
        setBrowseData(null);
      } else {
        const data = await res.json();
        setBrowseData(data);
      }
    } catch (error) {
      console.error("Browse fetch error:", error);
      setBrowseData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (view === "feed" && startDate && endDate) {
      fetchFeed();
    } else if (view === "lookup") {
      fetchLookup();
    } else if (view === "browse") {
      fetchBrowse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchFeed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(Math.round(num));
  };

  return (
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <section className="border-b-4 border-black dark:border-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-bold uppercase tracking-widest mb-3">NASA NeoWs API</div>
          <h1 className="text-5xl font-bold uppercase tracking-tight md:text-6xl">Near Earth Objects</h1>
          <p className="mt-6 max-w-2xl text-lg font-medium">Real-time data on asteroids and their closest approach dates to Earth from NASA JPL.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setView("feed")}
              className={`relative border-4 border-black dark:border-white px-6 py-3 text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 ${
                view === "feed"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -translate-y-1 -translate-x-1"
                  : "bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setView("lookup")}
              className={`relative border-4 border-black dark:border-white px-6 py-3 text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 ${
                view === "lookup"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -translate-y-1 -translate-x-1"
                  : "bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
              }`}
            >
              Lookup
            </button>
            <button
              onClick={() => setView("browse")}
              className={`relative border-4 border-black dark:border-white px-6 py-3 text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 ${
                view === "browse"
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] -translate-y-1 -translate-x-1"
                  : "bg-white text-black dark:bg-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
              }`}
            >
              Browse
            </button>
          </div>

          {view === "feed" && (
            <div>
              <div className="mb-6 border-4 border-black dark:border-white bg-white dark:bg-black p-8">
                <h3 className="mb-6 text-2xl font-bold uppercase tracking-wider">Search by Date Range</h3>
                <p className="mb-4 text-xs text-zinc-600 dark:text-zinc-400">Maximum 7 days range allowed</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="mb-1.5 block text-xs text-zinc-600 dark:text-zinc-400">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        const start = new Date(e.target.value);
                        const end = new Date(endDate);
                        const diffTime = Math.abs(end - start);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays > 7) {
                          const newEnd = new Date(start);
                          newEnd.setDate(newEnd.getDate() + 7);
                          setEndDate(newEnd.toISOString().split("T")[0]);
                        }
                      }}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="mb-1.5 block text-xs text-zinc-600 dark:text-zinc-400">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        const start = new Date(startDate);
                        const end = new Date(e.target.value);
                        const diffTime = Math.abs(end - start);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays > 7) {
                          const newEnd = new Date(start);
                          newEnd.setDate(newEnd.getDate() + 7);
                          setEndDate(newEnd.toISOString().split("T")[0]);
                        } else {
                          setEndDate(e.target.value);
                        }
                      }}
                      min={startDate}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={fetchFeed}
                      disabled={loading}
                      className="relative border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-sm font-bold uppercase tracking-wider overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-y-0 active:translate-x-0"
                    >
                      <span className="relative z-10">{loading ? "Loading..." : "Search"}</span>
                      {/* <div className="absolute inset-0 bg-white dark:bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div> */}
                      <span className="absolute inset-0 flex items-center justify-center text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">
                        {loading ? "Loading..." : "Search"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {feedData && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Results</h3>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Total: {feedData.element_count} asteroids
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(feedData.near_earth_objects || {}).map(([date, asteroids]) =>
                      asteroids.map((asteroid) => {
                        const approach = asteroid.close_approach_data?.[0];
                        const diameter = asteroid.estimated_diameter;
                        return (
                          <div
                            key={asteroid.id}
                            className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 cursor-pointer"
                          >
                            <div className="mb-4 flex items-start justify-between gap-3">
                              <div>
                                <button
                                  onClick={() => handleAsteroidClick(asteroid.id)}
                                  className="text-left transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  <h4 className="text-lg font-semibold leading-tight">{asteroid.name}</h4>
                                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">ID: {asteroid.id} • Click for 3D view</div>
                                </button>
                              </div>
                              {asteroid.is_potentially_hazardous_asteroid && (
                                <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                  Hazardous
                                </span>
                              )}
                            </div>

                            <div className="mb-4 space-y-3">
                              <div>
                                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Physical Properties</h5>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Absolute Magnitude:</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{asteroid.absolute_magnitude_h}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Diameter (min):</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {formatNumber(diameter?.meters?.estimated_diameter_min || 0)} m
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Diameter (max):</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {formatNumber(diameter?.meters?.estimated_diameter_max || 0)} m
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Sentry Object:</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {asteroid.is_sentry_object ? "Yes" : "No"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Close Approach Data</h5>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Date & Time:</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {approach?.close_approach_date_full || date}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Orbiting Body:</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {approach?.orbiting_body || "Earth"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Velocity (km/h):</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {formatNumber(approach?.relative_velocity?.kilometers_per_hour || 0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Velocity (km/s):</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {formatNumber(approach?.relative_velocity?.kilometers_per_second || 0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Miss Distance (km):</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {formatNumber(approach?.miss_distance?.kilometers || 0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Miss Distance (lunar):</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {parseFloat(approach?.miss_distance?.lunar || 0).toFixed(2)} LD
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Miss Distance (AU):</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {parseFloat(approach?.miss_distance?.astronomical || 0).toFixed(6)} AU
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <a
                                href={asteroid.nasa_jpl_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
                              >
                                JPL Data
                              </a>
                              <button
                                onClick={() => handleAsteroidClick(asteroid.id)}
                                className="flex-1 rounded-lg border border-blue-500 bg-blue-500 px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-blue-600 dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                              >
                                View 3D Details
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {view === "lookup" && (
            <div>
              <div className="mb-6 border-4 border-black dark:border-white bg-white dark:bg-black p-8">
                <h3 className="mb-6 text-2xl font-bold uppercase tracking-wider">Lookup by SPK-ID</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <label className="mb-1.5 block text-xs text-zinc-600 dark:text-zinc-400">Asteroid SPK-ID</label>
                    <input
                      type="text"
                      value={lookupId}
                      onChange={(e) => setLookupId(e.target.value)}
                      placeholder="e.g. 3542519"
                      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={fetchLookup}
                      disabled={loading}
                      className="relative border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-sm font-bold uppercase tracking-wider overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-y-0 active:translate-x-0"
                    >
                      <span className="relative z-10">{loading ? "Loading..." : "Lookup"}</span>
                      <div className="absolute inset-0 bg-white dark:bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">
                        {loading ? "Loading..." : "Lookup"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {lookupData && (
                <div className="space-y-6">
                  <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6">
                    <h3 className="mb-6 text-2xl font-bold uppercase tracking-wider">3D Orbital Visualization</h3>
                    <Suspense fallback={<div className="flex h-[500px] w-full items-center justify-center border-4 border-black dark:border-white bg-zinc-900"><div className="text-sm font-bold uppercase tracking-wider text-white">Loading 3D model...</div></div>}>
                      <AsteroidOrbit3D 
                        orbitalData={lookupData.orbital_data} 
                        asteroidName={lookupData.name}
                      />
                    </Suspense>
                    <div className="mt-4 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <p className="font-medium">Interactive Controls:</p>
                      <div className="grid gap-2 md:grid-cols-3">
                        <div>🖱️ <span className="font-medium">Rotate:</span> Click & drag</div>
                        <div>🔍 <span className="font-medium">Zoom:</span> Scroll wheel</div>
                        <div>✋ <span className="font-medium">Pan:</span> Right-click & drag</div>
                      </div>
                      <p className="mt-2 text-[11px]">
                        Visualization shows real orbital mechanics with perihelion (closest point, green) and aphelion (farthest point, purple) markers. Grid represents the ecliptic plane.
                      </p>
                    </div>
                  </div>

                  {showDetails && (
                    <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6">
                      <div className="mb-6 flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold">{lookupData.name}</h3>
                          <div className="mt-1 space-y-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                            <div>SPK-ID: {lookupData.id}</div>
                            <div>NEO Reference ID: {lookupData.neo_reference_id}</div>
                            {lookupData.designation && <div>Designation: {lookupData.designation}</div>}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {lookupData.is_potentially_hazardous_asteroid && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              Potentially Hazardous
                            </span>
                          )}
                          {lookupData.is_sentry_object && (
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                              Sentry Object
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Physical Properties</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Absolute Magnitude:</span>
                            <span className="font-medium">{lookupData.absolute_magnitude_h}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Diameter (min):</span>
                            <span className="font-medium">
                              {formatNumber(lookupData.estimated_diameter?.meters?.estimated_diameter_min || 0)} m
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Diameter (max):</span>
                            <span className="font-medium">
                              {formatNumber(lookupData.estimated_diameter?.meters?.estimated_diameter_max || 0)} m
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Diameter (feet):</span>
                            <span className="font-medium">
                              {formatNumber(lookupData.estimated_diameter?.feet?.estimated_diameter_max || 0)} ft
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Observation Data</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Orbit ID:</span>
                            <span className="font-medium">{lookupData.orbital_data?.orbit_id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">First Observed:</span>
                            <span className="font-medium">{lookupData.orbital_data?.first_observation_date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Last Observed:</span>
                            <span className="font-medium">{lookupData.orbital_data?.last_observation_date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Data Arc:</span>
                            <span className="font-medium">{lookupData.orbital_data?.data_arc_in_days} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Observations Used:</span>
                            <span className="font-medium">{lookupData.orbital_data?.observations_used}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Orbit Uncertainty:</span>
                            <span className="font-medium">{lookupData.orbital_data?.orbit_uncertainty}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Determination Date:</span>
                            <span className="font-medium">{lookupData.orbital_data?.orbit_determination_date}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Orbital Elements</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Eccentricity:</span>
                            <span className="font-medium">{lookupData.orbital_data?.eccentricity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Semi-major Axis:</span>
                            <span className="font-medium">{lookupData.orbital_data?.semi_major_axis} AU</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Inclination:</span>
                            <span className="font-medium">{lookupData.orbital_data?.inclination}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Asc. Node Long.:</span>
                            <span className="font-medium">{lookupData.orbital_data?.ascending_node_longitude}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Orbital Period:</span>
                            <span className="font-medium">{parseFloat(lookupData.orbital_data?.orbital_period || 0).toFixed(2)} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Perihelion Dist.:</span>
                            <span className="font-medium">{lookupData.orbital_data?.perihelion_distance} AU</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Perihelion Arg.:</span>
                            <span className="font-medium">{lookupData.orbital_data?.perihelion_argument}°</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Additional Elements</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Aphelion Dist.:</span>
                            <span className="font-medium">{lookupData.orbital_data?.aphelion_distance} AU</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Perihelion Time:</span>
                            <span className="font-medium">{lookupData.orbital_data?.perihelion_time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Mean Anomaly:</span>
                            <span className="font-medium">{lookupData.orbital_data?.mean_anomaly}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Mean Motion:</span>
                            <span className="font-medium">{lookupData.orbital_data?.mean_motion}°/day</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Epoch Osculation:</span>
                            <span className="font-medium">{lookupData.orbital_data?.epoch_osculation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Min. Orbit Intersect.:</span>
                            <span className="font-medium">{lookupData.orbital_data?.minimum_orbit_intersection} AU</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-600 dark:text-zinc-400">Jupiter Tisserand:</span>
                            <span className="font-medium">{lookupData.orbital_data?.jupiter_tisserand_invariant}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {lookupData.orbital_data?.orbit_class && (
                      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                        <h4 className="mb-2 text-sm font-semibold">Orbit Classification</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex gap-2">
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">{lookupData.orbital_data.orbit_class.orbit_class_type}</span>
                            <span className="text-zinc-600 dark:text-zinc-400">— {lookupData.orbital_data.orbit_class.orbit_class_description}</span>
                          </div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            Range: {lookupData.orbital_data.orbit_class.orbit_class_range}
                          </div>
                          {lookupData.orbital_data?.equinox && (
                            <div className="text-xs text-zinc-600 dark:text-zinc-400">
                              Equinox: {lookupData.orbital_data.equinox}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    </div>
                  )}

                  <div className="border-4 border-black dark:border-white bg-zinc-100 dark:bg-zinc-900 p-6">
                    <div className="flex gap-3">
                      <a
                        href={lookupData.nasa_jpl_url}
                        target="_blank"
                        rel="noreferrer"
                        className="relative inline-flex items-center justify-center border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-bold uppercase tracking-wider overflow-hidden group transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-y-0 active:translate-x-0"
                      >
                        <span className="relative z-10">View on JPL</span>
                        <div className="absolute inset-0 bg-white dark:bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                        <span className="absolute inset-0 flex items-center justify-center text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">
                          View on JPL
                        </span>
                      </a>
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="relative border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white px-6 py-3 text-sm font-bold uppercase tracking-wider overflow-hidden group transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
                      >
                        <span className="relative z-10">{showDetails ? "Hide" : "Show"} Details</span>
                        <div className="absolute inset-0 bg-black dark:bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                        <span className="absolute inset-0 flex items-center justify-center text-white dark:text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">
                          {showDetails ? "Hide" : "Show"} Details
                        </span>
                      </button>
                    </div>
                  </div>

                  {showDetails && lookupData.close_approach_data && lookupData.close_approach_data.length > 0 && (
                    <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6">
                      <h4 className="mb-6 text-2xl font-bold uppercase tracking-wider">All Close Approaches ({lookupData.close_approach_data.length})</h4>
                      <div className="space-y-3">
                        {lookupData.close_approach_data.map((approach, index) => (
                          <div key={index} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="font-semibold">{approach.close_approach_date_full}</span>
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">Orbiting: {approach.orbiting_body}</span>
                            </div>
                            <div className="grid gap-3 text-xs md:grid-cols-2 lg:grid-cols-4">
                              <div>
                                <div className="text-zinc-600 dark:text-zinc-400">Velocity (km/h)</div>
                                <div className="font-medium">{formatNumber(approach.relative_velocity?.kilometers_per_hour || 0)}</div>
                              </div>
                              <div>
                                <div className="text-zinc-600 dark:text-zinc-400">Velocity (km/s)</div>
                                <div className="font-medium">{parseFloat(approach.relative_velocity?.kilometers_per_second || 0).toFixed(4)}</div>
                              </div>
                              <div>
                                <div className="text-zinc-600 dark:text-zinc-400">Velocity (mph)</div>
                                <div className="font-medium">{formatNumber(approach.relative_velocity?.miles_per_hour || 0)}</div>
                              </div>
                              <div>
                                <div className="text-zinc-600 dark:text-zinc-400">Epoch Date</div>
                                <div className="font-medium">{approach.epoch_date_close_approach}</div>
                              </div>
                              <div>
                                <div className="text-zinc-600 dark:text-zinc-400">Miss Distance (km)</div>
                                <div className="font-medium">{formatNumber(approach.miss_distance?.kilometers || 0)}</div>
                              </div>
                              <div>
                                <div className="text-zinc-600 dark:text-zinc-400">Miss Distance (miles)</div>
                                <div className="font-medium">{formatNumber(approach.miss_distance?.miles || 0)}</div>
                              </div>
                              <div>
                                <div className="text-zinc-600 dark:text-zinc-400">Lunar Distance (LD)</div>
                                <div className="font-medium">{parseFloat(approach.miss_distance?.lunar || 0).toFixed(4)}</div>
                              </div>
                              <div>
                                <div className="text-zinc-600 dark:text-zinc-400">Astronomical (AU)</div>
                                <div className="font-medium">{parseFloat(approach.miss_distance?.astronomical || 0).toFixed(6)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {view === "browse" && (
            <div>
              {browseData && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Browse Asteroids</h3>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Page {browseData.page?.number || 1} of {browseData.page?.total_pages || 1}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {browseData.near_earth_objects?.map((asteroid) => {
                      const diameter = asteroid.estimated_diameter;
                      return (
                        <div
                          key={asteroid.id}
                          className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 cursor-pointer"
                        >
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                              <button
                                onClick={() => handleAsteroidClick(asteroid.id)}
                                className="text-left transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                <h4 className="text-lg font-semibold leading-tight">{asteroid.name}</h4>
                                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">ID: {asteroid.id} • Click for 3D view</div>
                              </button>
                            </div>
                            {asteroid.is_potentially_hazardous_asteroid && (
                              <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                Hazardous
                              </span>
                            )}
                          </div>

                          <div className="mb-4 space-y-3">
                            <div>
                              <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Physical Properties</h5>
                              <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-zinc-600 dark:text-zinc-400">Absolute Magnitude:</span>
                                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{asteroid.absolute_magnitude_h}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-600 dark:text-zinc-400">Diameter (min):</span>
                                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {formatNumber(diameter?.meters?.estimated_diameter_min || 0)} m
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-600 dark:text-zinc-400">Diameter (max):</span>
                                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {formatNumber(diameter?.meters?.estimated_diameter_max || 0)} m
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-600 dark:text-zinc-400">Diameter (feet):</span>
                                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {formatNumber(diameter?.feet?.estimated_diameter_max || 0)} ft
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-zinc-600 dark:text-zinc-400">Sentry Object:</span>
                                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {asteroid.is_sentry_object ? "Yes" : "No"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {asteroid.close_approach_data && asteroid.close_approach_data.length > 0 && (
                              <div>
                                <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                  Close Approaches ({asteroid.close_approach_data.length})
                                </h5>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Next Approach:</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {asteroid.close_approach_data[0]?.close_approach_date}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-600 dark:text-zinc-400">Orbiting Body:</span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                      {asteroid.close_approach_data[0]?.orbiting_body}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <a
                              href={asteroid.nasa_jpl_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
                            >
                              JPL Data
                            </a>
                            <button
                              onClick={() => handleAsteroidClick(asteroid.id)}
                              className="flex-1 rounded-lg border border-blue-500 bg-blue-500 px-3 py-2 text-center text-xs font-medium text-white transition-colors hover:bg-blue-600 dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                              View 3D Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

