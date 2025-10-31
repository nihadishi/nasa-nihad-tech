import { formatDate } from './utils';

export default function GSTCard({ item, index }) {
  return (
    <div key={index} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
      <div className="border-l-4 border-purple-500 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Geomagnetic Storm</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.gstID}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Start Time</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(item.startTime)}</p>
          </div>
          {item.allKpIndex && item.allKpIndex.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Peak Kp Index</h4>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{Math.max(...item.allKpIndex.map(k => k.kpIndex))}</p>
            </div>
          )}
        </div>

        {item.allKpIndex && item.allKpIndex.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Kp Index Timeline</h4>
            <div className="space-y-2">
              {item.allKpIndex.map((kp, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-48 font-medium">
                    {formatDate(kp.observedTime)}
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden border border-gray-300 dark:border-gray-600">
                      <div 
                        className={`h-full transition-all flex items-center justify-end pr-2 ${
                          kp.kpIndex < 3 ? 'bg-green-500' :
                          kp.kpIndex < 5 ? 'bg-yellow-500' :
                          kp.kpIndex < 7 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(kp.kpIndex / 9) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-white">{kp.kpIndex}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
              className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
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
