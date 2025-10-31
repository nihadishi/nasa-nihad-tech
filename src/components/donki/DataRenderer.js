import CMECard from './CMECard';
import GSTCard from './GSTCard';
import FLRCard from './FLRCard';
import IPSCard from './IPSCard';
import SEPCard from './SEPCard';
import MPCCard from './MPCCard';
import RBECard from './RBECard';
import HSSCard from './HSSCard';
import WSAEnlilCard from './WSAEnlilCard';
import NotificationCard from './NotificationCard';
import GenericCard from './GenericCard';

export default function DataRenderer({ apiType, data }) {
  if (!data) return null;

  const renderDataItem = (item, index) => {
    if (apiType === 'CME' || apiType === 'CMEAnalysis') {
      return <CMECard key={index} item={item} index={index} />;
    } else if (apiType === 'GST') {
      return <GSTCard key={index} item={item} index={index} />;
    } else if (apiType === 'FLR') {
      return <FLRCard key={index} item={item} index={index} />;
    } else if (apiType === 'IPS') {
      return <IPSCard key={index} item={item} index={index} />;
    } else if (apiType === 'SEP') {
      return <SEPCard key={index} item={item} index={index} />;
    } else if (apiType === 'MPC') {
      return <MPCCard key={index} item={item} index={index} />;
    } else if (apiType === 'RBE') {
      return <RBECard key={index} item={item} index={index} />;
    } else if (apiType === 'HSS') {
      return <HSSCard key={index} item={item} index={index} />;
    } else if (apiType === 'WSAEnlilSimulations') {
      return <WSAEnlilCard key={index} item={item} index={index} />;
    } else if (apiType === 'notifications') {
      return <NotificationCard key={index} item={item} index={index} />;
    } else {
      return <GenericCard key={index} item={item} index={index} apiType={apiType} />;
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-light mb-6">
        Results ({Array.isArray(data) ? data.length : 1} {Array.isArray(data) && data.length === 1 ? 'entry' : 'entries'})
      </h2>
      
      {Array.isArray(data) ? (
        data.length > 0 ? (
          data.map((item, index) => renderDataItem(item, index))
        ) : (
          <div className="bg-white dark:bg-[#333333] p-6 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
            No data available for the selected date range.
          </div>
        )
      ) : (
        renderDataItem(data, 0)
      )}
    </div>
  );
}

