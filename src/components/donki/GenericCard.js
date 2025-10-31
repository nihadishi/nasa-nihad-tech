import { apiTypes } from './utils';

export default function GenericCard({ item, index, apiType }) {
  return (
    <div key={index} className="bg-white dark:bg-[#333333] rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
        <h3 className="text-2xl font-light">{apiTypes.find(t => t.value === apiType)?.label || apiType}</h3>
      </div>
      
      <div className="p-6">
        <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-words bg-gray-50 dark:bg-black/30 p-4 rounded">
          {JSON.stringify(item, null, 2)}
        </pre>
      </div>
    </div>
  );
}

