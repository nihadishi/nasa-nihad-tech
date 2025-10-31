'use client';

import { useState, useEffect } from 'react';

export default function MarsWeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSol, setSelectedSol] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.nasa.gov/insight_weather/?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}&feedtype=json&ver=1.0`
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      setWeatherData(data);
      
      if (data.sol_keys && data.sol_keys.length > 0) {
        const latestSol = data.sol_keys[data.sol_keys.length - 1];
        setSelectedSol(latestSol);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  const formatTemperature = (temp) => {
    if (temp === null || temp === undefined) return 'N/A';
    return Math.round(temp);
  };

  const formatDate = (earthDate) => {
    if (!earthDate) return '';
    const date = new Date(earthDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#8B4513] to-[#654321]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Loading Mars Weather Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#8B4513] to-[#654321]">
        <div className="bg-red-900/50 border border-red-500 text-white px-8 py-6 rounded-lg max-w-2xl">
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="mb-4">{error}</p>
          <p className="text-sm opacity-80">Note: The InSight mission has ended and this API may have limited or no data available.</p>
          <button
            onClick={fetchWeatherData}
            className="mt-4 px-6 py-2 bg-white text-red-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData || !weatherData.sol_keys || weatherData.sol_keys.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#8B4513] to-[#654321]">
        <div className="text-center text-white max-w-2xl px-6">
          <h2 className="text-3xl font-bold mb-4">No Data Available</h2>
          <p className="text-lg opacity-90 mb-6">
            The InSight Mars lander mission has concluded. Historical weather data may no longer be available through this API.
          </p>
          <p className="text-sm opacity-75">
            For archived Mars weather data, please visit{' '}
            <a href="https://mars.nasa.gov/insight/weather/" target="_blank" rel="noopener noreferrer" className="underline">
              mars.nasa.gov/insight/weather
            </a>
          </p>
        </div>
      </div>
    );
  }

  const currentSolData = selectedSol && weatherData[selectedSol];
  const solKeys = weatherData.sol_keys || [];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(https://mars.nasa.gov/system/resources/detail_files/25042_PIA23499-16.jpg)',
        backgroundColor: '#8B4513'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Latest Weather<br />at Elysium Planitia
          </h1>
          <p className="text-xl text-white/90 max-w-3xl leading-relaxed drop-shadow-md">
            InSight is taking daily weather measurements (temperature, wind, pressure) on the surface of Mars 
            at Elysium Planitia, a flat, smooth plain near Mars&apos; equator.
          </p>
        </div>

        {currentSolData && (
          <div className="mb-16">
            <div className="border-4 border-white bg-black/80 p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-1">
                  <h2 className="text-6xl font-bold text-white mb-2">Sol {selectedSol}</h2>
                  <p className="text-2xl text-white/80 mb-4">
                    {formatDate(currentSolData.First_UTC)}
                  </p>
                  {currentSolData.Season && (
                    <div className="inline-block bg-white/10 border border-white/30 px-4 py-2 rounded-lg">
                      <span className="text-lg text-white/70">Season: </span>
                      <span className="text-xl font-semibold text-white capitalize">{currentSolData.Season}</span>
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                  {currentSolData.AT && (
                    <>
                      <div className="flex items-baseline gap-4 flex-wrap">
                        <span className="text-3xl text-white/80">High:</span>
                        <span className="text-5xl font-bold text-white">
                          {formatTemperature(celsiusToFahrenheit(currentSolData.AT.mx))}° F
                        </span>
                        <span className="text-2xl text-white/60">
                          | {formatTemperature(currentSolData.AT.mx)}° C
                        </span>
                      </div>
                      
                      <div className="flex items-baseline gap-4 flex-wrap">
                        <span className="text-3xl text-white/80">Low:</span>
                        <span className="text-5xl font-bold text-white">
                          {formatTemperature(celsiusToFahrenheit(currentSolData.AT.mn))}° F
                        </span>
                        <span className="text-2xl text-white/60">
                          | {formatTemperature(currentSolData.AT.mn)}° C
                        </span>
                      </div>
                      
                      <div className="flex items-baseline gap-4 flex-wrap">
                        <span className="text-xl text-white/70">Average:</span>
                        <span className="text-3xl font-semibold text-white">
                          {formatTemperature(celsiusToFahrenheit(currentSolData.AT.av))}° F
                        </span>
                        <span className="text-xl text-white/50">
                          | {formatTemperature(currentSolData.AT.av)}° C
                        </span>
                        <span className="text-sm text-white/50 ml-2">
                          ({currentSolData.AT.ct.toLocaleString()} samples)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentSolData.PRE && (
                  <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white/70 mb-4">Atmospheric Pressure</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-white/60">Average:</span>
                        <div className="text-3xl font-bold text-white">{currentSolData.PRE.av.toFixed(1)} Pa</div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-white/60">Min:</span>
                          <div className="text-white font-semibold">{currentSolData.PRE.mn.toFixed(1)} Pa</div>
                        </div>
                        <div>
                          <span className="text-white/60">Max:</span>
                          <div className="text-white font-semibold">{currentSolData.PRE.mx.toFixed(1)} Pa</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/50 pt-2">
                        {currentSolData.PRE.ct.toLocaleString()} samples
                      </div>
                    </div>
                  </div>
                )}
                
                {currentSolData.HWS && (
                  <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white/70 mb-4">Horizontal Wind Speed</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-white/60">Average:</span>
                        <div className="text-3xl font-bold text-white">{currentSolData.HWS.av.toFixed(2)} m/s</div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-white/60">Min:</span>
                          <div className="text-white font-semibold">{currentSolData.HWS.mn.toFixed(2)} m/s</div>
                        </div>
                        <div>
                          <span className="text-white/60">Max:</span>
                          <div className="text-white font-semibold">{currentSolData.HWS.mx.toFixed(2)} m/s</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/50 pt-2">
                        {currentSolData.HWS.ct.toLocaleString()} samples
                      </div>
                    </div>
                  </div>
                )}
                
                {currentSolData.WD && currentSolData.WD.most_common && (
                  <div className="bg-white/5 border border-white/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white/70 mb-4">Wind Direction</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-white/60">Most Common:</span>
                        <div className="text-4xl font-bold text-white">{currentSolData.WD.most_common.compass_point}</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-white/60">Compass:</span>
                        <div className="text-white font-semibold">{currentSolData.WD.most_common.compass_degrees}°</div>
                      </div>
                      <div className="text-xs text-white/50 pt-2">
                        {currentSolData.WD.most_common.ct.toLocaleString()} samples
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-white/20 text-sm text-white/60">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-white/50">First UTC: </span>
                    <span className="text-white/70">{new Date(currentSolData.First_UTC).toUTCString()}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Last UTC: </span>
                    <span className="text-white/70">{new Date(currentSolData.Last_UTC).toUTCString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-4 border-white bg-black/80 p-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {solKeys.map((sol) => {
              const solData = weatherData[sol];
              const isSelected = sol === selectedSol;
              
              return (
                <button
                  key={sol}
                  onClick={() => setSelectedSol(sol)}
                    className={`flex-shrink-0 p-4 transition-all ${
                      isSelected
                        ? 'bg-white text-black border-4 border-white scale-105'
                        : 'bg-black text-white border-4 border-white hover:bg-white hover:text-black'
                    }`}
                  style={{ minWidth: '140px' }}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white mb-1">Sol {sol}</div>
                    <div className="text-sm text-white/70 mb-3">
                      {formatDate(solData.First_UTC)}
                    </div>
                    
                    {solData.AT ? (
                      <>
                        <div className="text-xs text-white/60 mb-1">High:</div>
                        <div className="text-xl font-bold text-white mb-2">
                          {formatTemperature(celsiusToFahrenheit(solData.AT.mx))}° F
                        </div>
                        
                        <div className="text-xs text-white/60 mb-1">Low:</div>
                        <div className="text-xl font-bold text-white">
                          {formatTemperature(celsiusToFahrenheit(solData.AT.mn))}° F
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-white/50 italic">No data</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm mb-2">
            Data provided by NASA JPL and Cornell University
          </p>
          <a
            href="https://mars.nasa.gov/insight/weather/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:text-white underline text-sm"
          >
            Visit NASA InSight Weather Page →
          </a>
        </div>
      </div>
    </div>
  );
}

