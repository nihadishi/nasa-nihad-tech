import { apiTypes } from './utils';

export default function FilterPanel({
  apiType,
  setApiType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  loading,
  fetchData,
  cmeSpeed,
  setCmeSpeed,
  cmeHalfAngle,
  setCmeHalfAngle,
  cmeCatalog,
  setCmeCatalog,
  cmeMostAccurate,
  setCmeMostAccurate,
  ipsLocation,
  setIpsLocation,
  ipsCatalog,
  setIpsCatalog,
  notificationType,
  setNotificationType
}) {
  const renderExtraParams = () => {
    if (apiType === 'CMEAnalysis') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Speed (km/s)</label>
            <input
              type="number"
              value={cmeSpeed}
              onChange={(e) => setCmeSpeed(e.target.value)}
              className="w-full p-2 rounded bg-white dark:bg-[#333333] border border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Half Angle (degrees)</label>
            <input
              type="number"
              value={cmeHalfAngle}
              onChange={(e) => setCmeHalfAngle(e.target.value)}
              className="w-full p-2 rounded bg-white dark:bg-[#333333] border border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Catalog</label>
            <select
              value={cmeCatalog}
              onChange={(e) => setCmeCatalog(e.target.value)}
              className="w-full p-2 rounded bg-white dark:bg-[#333333] border border-gray-300 dark:border-gray-600"
            >
              <option value="ALL">ALL</option>
              <option value="SWRC_CATALOG">SWRC Catalog</option>
              <option value="JANG_ET_AL_CATALOG">Jang et al. Catalog</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={cmeMostAccurate}
              onChange={(e) => setCmeMostAccurate(e.target.checked)}
              className="w-4 h-4 mr-2"
            />
            <label className="text-sm font-medium">Most Accurate Only</label>
          </div>
        </div>
      );
    }
    
    if (apiType === 'IPS') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <select
              value={ipsLocation}
              onChange={(e) => setIpsLocation(e.target.value)}
              className="w-full p-2 rounded bg-white dark:bg-[#333333] border border-gray-300 dark:border-gray-600"
            >
              <option value="ALL">ALL</option>
              <option value="Earth">Earth</option>
              <option value="MESSENGER">MESSENGER</option>
              <option value="STEREO A">STEREO A</option>
              <option value="STEREO B">STEREO B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Catalog</label>
            <select
              value={ipsCatalog}
              onChange={(e) => setIpsCatalog(e.target.value)}
              className="w-full p-2 rounded bg-white dark:bg-[#333333] border border-gray-300 dark:border-gray-600"
            >
              <option value="ALL">ALL</option>
              <option value="SWRC_CATALOG">SWRC Catalog</option>
              <option value="WINSLOW_MESSENGER_ICME_CATALOG">Winslow MESSENGER ICME Catalog</option>
            </select>
          </div>
        </div>
      );
    }
    
    if (apiType === 'notifications') {
      return (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Notification Type</label>
          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            className="w-full p-2 rounded bg-white dark:bg-[#333333] border border-gray-300 dark:border-gray-600"
          >
            <option value="all">All</option>
            <option value="FLR">Solar Flare (FLR)</option>
            <option value="SEP">Solar Energetic Particle (SEP)</option>
            <option value="CME">Coronal Mass Ejection (CME)</option>
            <option value="IPS">Interplanetary Shock (IPS)</option>
            <option value="MPC">Magnetopause Crossing (MPC)</option>
            <option value="GST">Geomagnetic Storm (GST)</option>
            <option value="RBE">Radiation Belt Enhancement (RBE)</option>
            <option value="report">Report</option>
          </select>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#333333] p-8 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-light mb-6">Select Data Type</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">API Type</label>
        <select
          value={apiType}
          onChange={(e) => setApiType(e.target.value)}
          className="w-full p-3 rounded bg-white dark:bg-black border border-gray-300 dark:border-gray-600"
        >
          {apiTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 rounded bg-white dark:bg-black border border-gray-300 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 rounded bg-white dark:bg-black border border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>

      {renderExtraParams()}

      <button
        onClick={fetchData}
        disabled={loading}
        className="w-full mt-6 bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
    </div>
  );
}

