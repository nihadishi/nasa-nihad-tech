import { formatDate } from './utils';

export default function FLRCard({ item, index }) {
  return (
    <div key={index} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
      <div className="border-l-4 border-yellow-500 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Solar Flare</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.flrID}</p>
            </div>
          </div>
          {item.classType && (
            <span className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg text-xl font-bold border border-yellow-200 dark:border-yellow-800">
              {item.classType}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Begin Time</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(item.beginTime)}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Peak Time</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(item.peakTime)}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">End Time</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(item.endTime)}</p>
          </div>
        </div>

        {item.sourceLocation && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Source Location</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">{item.sourceLocation}</p>
          </div>
        )}

        {item.activeRegionNum && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Active Region</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">AR {item.activeRegionNum}</p>
          </div>
        )}

        {item.instruments && item.instruments.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Instruments</h4>
            <div className="flex flex-wrap gap-2">
              {item.instruments.map((inst, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-gray-700 font-medium">
                  {inst.displayName}
                </span>
              ))}
            </div>
          </div>
        )}

        {item.link && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
            >
              View Full Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
