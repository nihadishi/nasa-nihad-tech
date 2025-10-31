'use client';

import { useState, useEffect } from 'react';
import FilterPanel from '@/components/donki/FilterPanel';
import DataRenderer from '@/components/donki/DataRenderer';
import InfoSection from '@/components/donki/InfoSection';

export default function DonkiPage() {
  const [apiType, setApiType] = useState('notifications');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [cmeSpeed, setCmeSpeed] = useState('0');
  const [cmeHalfAngle, setCmeHalfAngle] = useState('0');
  const [cmeCatalog, setCmeCatalog] = useState('ALL');
  const [cmeMostAccurate, setCmeMostAccurate] = useState(true);
  
  const [ipsLocation, setIpsLocation] = useState('ALL');
  const [ipsCatalog, setIpsCatalog] = useState('ALL');
  
  const [notificationType, setNotificationType] = useState('all');

  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    setStartDate(oneWeekAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    setData(null);
    setError(null);
  }, [apiType]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `https://api.nasa.gov/DONKI/${apiType}?startDate=${startDate}&endDate=${endDate}&api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`;
      
      if (apiType === 'CMEAnalysis') {
        url += `&mostAccurateOnly=${cmeMostAccurate}&speed=${cmeSpeed}&halfAngle=${cmeHalfAngle}&catalog=${cmeCatalog}`;
      } else if (apiType === 'IPS') {
        url += `&location=${ipsLocation}&catalog=${ipsCatalog}`;
      } else if (apiType === 'notifications') {
        url += `&type=${notificationType}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] dark:bg-black text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-light mb-4">DONKI</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Space Weather Database Of Notifications, Knowledge, Information
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            DONKI is a comprehensive on-line tool for space weather forecasters, scientists, 
            and the general space science community. It chronicles daily interpretations of 
            space weather observations, analysis, models, forecasts, and notifications.
          </p>
        </div>

        <FilterPanel
          apiType={apiType}
          setApiType={setApiType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          loading={loading}
          fetchData={fetchData}
          cmeSpeed={cmeSpeed}
          setCmeSpeed={setCmeSpeed}
          cmeHalfAngle={cmeHalfAngle}
          setCmeHalfAngle={setCmeHalfAngle}
          cmeCatalog={cmeCatalog}
          setCmeCatalog={setCmeCatalog}
          cmeMostAccurate={cmeMostAccurate}
          setCmeMostAccurate={setCmeMostAccurate}
          ipsLocation={ipsLocation}
          setIpsLocation={setIpsLocation}
          ipsCatalog={ipsCatalog}
          setIpsCatalog={setIpsCatalog}
          notificationType={notificationType}
          setNotificationType={setNotificationType}
        />

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {data && <DataRenderer apiType={apiType} data={data} />}

        {!data && !loading && <InfoSection />}
      </div>
    </div>
  );
}
