import { formatDate } from './utils';

export default function WSAEnlilCard({ item, index }) {
  return (
    <div key={index} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
      <div className="border-l-4 border-violet-500 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">WSA+ENLIL Simulation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.simulationID}</p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg text-xs font-semibold border border-violet-200 dark:border-violet-800">
            MODEL
          </span>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Model Completion</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(item.modelCompletionTime)}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Simulation Range</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">{item.au} AU</p>
          </div>
        </div>

        {item.estimatedShockArrivalTime && (
          <div className="mb-6 p-4 bg-violet-50/50 dark:bg-violet-900/10 rounded-lg border border-violet-200 dark:border-violet-800">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">Estimated Shock Arrival</h4>
                <p className="text-lg font-semibold text-violet-600 dark:text-violet-400">{formatDate(item.estimatedShockArrivalTime)}</p>
              </div>
            </div>
          </div>
        )}

        {(item.kp_18 || item.kp_90 || item.kp_135 || item.kp_180) && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">Predicted Kp Index</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {item.kp_18 !== null && (
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">18 hours</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.kp_18}</p>
                </div>
              )}
              {item.kp_90 !== null && (
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">90 hours</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.kp_90}</p>
                </div>
              )}
              {item.kp_135 !== null && (
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">135 hours</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.kp_135}</p>
                </div>
              )}
              {item.kp_180 !== null && (
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">180 hours</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.kp_180}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg text-center border ${item.isEarthGB ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800'}`}>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">Earth Glancing Blow</p>
            <p className={`text-lg font-bold ${item.isEarthGB ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>
              {item.isEarthGB ? 'YES' : 'NO'}
            </p>
          </div>
          <div className={`p-4 rounded-lg text-center border ${item.isEarthMinorImpact ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800'}`}>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">Earth Minor Impact</p>
            <p className={`text-lg font-bold ${item.isEarthMinorImpact ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300'}`}>
              {item.isEarthMinorImpact ? 'YES' : 'NO'}
            </p>
          </div>
        </div>

        {item.cmeInputs && item.cmeInputs.length > 0 && (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">CME Inputs</h4>
            {item.cmeInputs.map((cme, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{cme.cmeid}</span>
                  {cme.isMostAccurate && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium border border-green-200 dark:border-green-800">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Most Accurate
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Start Time</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{formatDate(cme.cmeStartTime)}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Speed</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{cme.speed} km/s</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Half Angle</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{cme.halfAngle}°</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{cme.latitude}°, {cme.longitude}°</p>
                  </div>
                </div>

                {cme.ipsList && cme.ipsList.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Associated Interplanetary Shocks</p>
                    <div className="space-y-2">
                      {cme.ipsList.map((ips, j) => (
                        <div key={j} className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">{ips.location}</span>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {formatDate(ips.eventTime)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {item.impactList && item.impactList.length > 0 && (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Predicted Impacts</h4>
            <div className="space-y-2">
              {item.impactList.map((impact, i) => (
                <div key={i} className={`p-4 rounded-lg border ${impact.isGlancingBlow ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-gray-900 dark:text-white">{impact.location}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(impact.arrivalTime)}
                      </p>
                    </div>
                    {impact.isGlancingBlow && (
                      <span className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 rounded-lg text-xs font-semibold border border-yellow-200 dark:border-yellow-800">
                        Glancing Blow
                      </span>
                    )}
                    {impact.isMinorImpact && (
                      <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-800">
                        Minor Impact
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                WSA+ENLIL is a sophisticated physics-based model that simulates the propagation of coronal mass ejections 
                through the heliosphere, predicting their arrival times and potential impacts on Earth and spacecraft.
              </p>
            </div>
          </div>
        </div>

        {item.link && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              View Full Simulation Details
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
