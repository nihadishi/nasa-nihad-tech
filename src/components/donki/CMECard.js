import { formatDate } from './utils';

export default function CMECard({ item, index }) {
  return (
    <div key={index} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
      <div className="border-l-4 border-orange-500 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Coronal Mass Ejection</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.activityID}</p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700">
            {item.catalog}
          </span>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Start Time</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(item.startTime)}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Source Location</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">{item.sourceLocation || 'N/A'}</p>
          </div>
          {item.activeRegionNum && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Active Region</h4>
              <p className="text-base font-medium text-gray-900 dark:text-white">AR {item.activeRegionNum}</p>
            </div>
          )}
        </div>

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

        {item.note && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Analysis Note</h4>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.note}</p>
          </div>
        )}

        {item.cmeAnalyses && item.cmeAnalyses.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">CME Analysis</h4>
            {item.cmeAnalyses.map((analysis, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50/50 dark:bg-gray-900/30">
                {analysis.isMostAccurate && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium border border-green-200 dark:border-green-800 mb-3">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Most Accurate
                  </span>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Speed</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.speed} km/s</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Half Angle</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.halfAngle}°</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Latitude</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.latitude}°</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Longitude</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.longitude}°</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div><span className="text-gray-500 dark:text-gray-400">Type:</span> <span className="font-medium text-gray-900 dark:text-white">{analysis.type || 'N/A'}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Technique:</span> <span className="font-medium text-gray-900 dark:text-white">{analysis.measurementTechnique || 'N/A'}</span></div>
                  <div><span className="text-gray-500 dark:text-gray-400">Feature Code:</span> <span className="font-medium text-gray-900 dark:text-white">{analysis.featureCode || 'N/A'}</span></div>
                </div>

                {analysis.note && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">{analysis.note}</p>
                )}

                {analysis.enlilList && analysis.enlilList.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">WSA-ENLIL Simulation</h5>
                    {analysis.enlilList.map((enlil, j) => (
                      <div key={j} className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                            <span className="text-gray-500 dark:text-gray-400 text-xs">Model Completion</span>
                            <p className="font-medium text-gray-900 dark:text-white mt-1">{formatDate(enlil.modelCompletionTime)}</p>
                          </div>
                          {enlil.estimatedShockArrivalTime && (
                            <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                              <span className="text-gray-500 dark:text-gray-400 text-xs">Est. Shock Arrival</span>
                              <p className="font-medium text-gray-900 dark:text-white mt-1">{formatDate(enlil.estimatedShockArrivalTime)}</p>
                            </div>
                          )}
                        </div>

                        {enlil.impactList && enlil.impactList.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Predicted Impacts</p>
                            <div className="space-y-2">
                              {enlil.impactList.map((impact, k) => (
                                <div key={k} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{impact.location}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                      {formatDate(impact.arrivalTime)}
                                    </p>
                                  </div>
                                  {impact.isGlancingBlow && (
                                    <span className="text-xs px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-md border border-amber-200 dark:border-amber-800 font-medium">
                                      Glancing Blow
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            View Full Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
