'use client';

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

export default function ApodPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('thisMonth');
  const [actualDate, setActualDate] = useState('');
  const [realCurrentDate, setRealCurrentDate] = useState(null);

  // Fetch the real current date from NASA on component mount
  useEffect(() => {
    const fetchRealDate = async () => {
      try {
        const response = await fetch('/api/apod');
        if (response.ok) {
          const apodData = await response.json();
          // Store the real current date from NASA
          setRealCurrentDate(new Date(apodData.date));
        }
      } catch (err) {
        console.error('Could not fetch real date:', err);
      }
    };
    fetchRealDate();
  }, []);

  // Calculate dates - First day of each month dynamically from real NASA date
  const getDate = useCallback((type) => {
    // Use real date from NASA, or fallback to system date
    const baseDate = realCurrentDate || new Date();
    let targetDate;
    
    switch(type) {
      case 'thisMonth':
        // This will be handled separately (no date parameter)
        targetDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
        break;
      case 'oneMonth':
        // First day of 1 month ago
        targetDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1);
        break;
      case 'twoMonths':
        // First day of 2 months ago
        targetDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 2, 1);
        break;
      case 'threeMonths':
        // First day of 3 months ago
        targetDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 3, 1);
        break;
      default:
        targetDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    }
    
    // Format as YYYY-MM-DD
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = '01'; // Always first day of the month
    
    return `${year}-${month}-${day}`;
  }, [realCurrentDate]);

  useEffect(() => {
    const fetchApod = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let url;
        
        // For "This Month", don't pass a date - let NASA return the latest available
        if (selectedDate === 'thisMonth') {
          url = `/api/apod`;
          console.log('Fetching latest APOD (no date specified)');
        } else {
          const calculatedDate = getDate(selectedDate);
          url = `/api/apod?date=${calculatedDate}`;
          console.log('Fetching APOD for:', selectedDate, '| Date:', calculatedDate, '| URL:', url);
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch APOD (${response.status})`);
        }
        
        const apodData = await response.json();
        
        if (apodData.error) {
          throw new Error(apodData.msg || apodData.error);
        }
        
        setData(apodData);
        setActualDate(apodData.date);
      } catch (err) {
        console.error('APOD Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApod();
  }, [selectedDate, getDate]);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <section className="border-b-4 border-black dark:border-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs font-bold uppercase tracking-widest mb-3">NASA APOD</div>
          <h1 className="text-5xl font-bold uppercase tracking-tight md:text-6xl">
            Astronomy Picture<br />of the Day
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium">
            Daily imagery and videos from NASA&apos;s APOD feed with details and source links.
          </p>
          
          {/* Date Navigation */}
          <div className="mt-8">
            <div className="text-xs font-bold uppercase tracking-wider mb-3">Select Month:</div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedDate('thisMonth')}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-4 transition-all ${
                  selectedDate === 'thisMonth'
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white'
                    : 'border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                }`}
              >
                📅 This Month
              </button>
              <button
                onClick={() => setSelectedDate('oneMonth')}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-4 transition-all ${
                  selectedDate === 'oneMonth'
                    ? 'border-purple-600 dark:border-purple-500 bg-purple-600 dark:bg-purple-500 text-white'
                    : 'border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                }`}
              >
                ⏮️ 1 Month Ago
              </button>
              <button
                onClick={() => setSelectedDate('twoMonths')}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-4 transition-all ${
                  selectedDate === 'twoMonths'
                    ? 'border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white'
                    : 'border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                }`}
              >
                📆 2 Months Ago
              </button>
              <button
                onClick={() => setSelectedDate('threeMonths')}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-4 transition-all ${
                  selectedDate === 'threeMonths'
                    ? 'border-orange-600 dark:border-orange-500 bg-orange-600 dark:bg-orange-500 text-white'
                    : 'border-slate-700 dark:border-slate-600 bg-white dark:bg-black text-black dark:text-white hover:shadow-[4px_4px_0px_0px_rgba(71,85,105,1)] hover:-translate-y-0.5 hover:-translate-x-0.5'
                }`}
              >
                🗓️ 3 Months Ago
              </button>
            </div>
            {actualDate && (
              <div className="mt-4 inline-flex items-center gap-2 border-2 border-slate-700 dark:border-slate-600 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-wider">
                Viewing: {actualDate}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {loading ? (
            <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-12 text-center">
              <div className="inline-block animate-spin h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-lg font-bold uppercase tracking-wider">
                Loading APOD...
              </p>
            </div>
          ) : error || !data ? (
            <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-12 text-center">
              <p className="text-lg font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                {error || 'Unable to load APOD right now. Try again later.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr,1fr]">
              <div className="border-4 border-black dark:border-white bg-zinc-100 dark:bg-zinc-900 p-4">
                {data.media_type === "image" ? (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={data.url || data.hdurl}
                      alt={data.title}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="relative overflow-hidden">
                    <video 
                      controls 
                      poster={data.thumbnail_url || data.url} 
                      className="aspect-video h-auto w-full"
                    >
                      <source src={data.url} />
                    </video>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-8">
                <div className="border-l-4 border-black dark:border-white pl-6">
                  <h2 className="text-3xl font-bold leading-tight mb-3">
                    {data.title}
                  </h2>
                  <div className="text-sm font-bold uppercase tracking-wider">
                    {data.date}
                    {data.copyright && ` · © ${data.copyright}`}
                  </div>
                </div>

                <div className="border-4 border-black dark:border-white bg-zinc-100 dark:bg-zinc-900 p-6">
                  <p className="text-sm leading-relaxed font-medium">
                    {data.explanation}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a 
                    href={data.url || data.hdurl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center justify-center border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-bold uppercase tracking-wider hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
                  >
                    View Media
                  </a>
                  {data.hdurl && (
                    <a 
                      href={data.hdurl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center justify-center border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                      HD Version
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
