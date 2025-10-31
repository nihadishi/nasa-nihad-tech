import { formatDate } from './utils';

export default function SEPCard({ item, index }) {
  return (
    <div key={index} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
      <div className="border-l-4 border-indigo-500 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Solar Energetic Particle</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.sepID}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Event Time</h4>
          <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(item.eventTime)}</p>
        </div>

        {item.instruments && item.instruments.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Detection Instruments</h4>
            <div className="flex flex-wrap gap-2">
              {item.instruments.map((inst, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-gray-700 font-medium">
                  {inst.displayName}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Solar energetic particles are high-energy particles from the Sun, primarily protons, that can reach Earth 
                and pose risks to spacecraft, astronauts, and even affect radio communications.
              </p>
            </div>
          </div>
        </div>

        {item.linkedEvents && item.linkedEvents.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Linked Events</h4>
            <div className="space-y-2">
              {item.linkedEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {event.activityID}
                </div>
              ))}
            </div>
          </div>
        )}

        {item.sentNotifications && item.sentNotifications.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Sent Notifications ({item.sentNotifications.length})
            </h4>
            <div className="space-y-2">
              {item.sentNotifications.map((notification, i) => (
                <div key={i} className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                          {notification.messageID}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(notification.messageIssueTime)}
                      </p>
                    </div>
                    <a 
                      href={notification.messageURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
                    >
                      View Alert
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span className="text-gray-500 dark:text-gray-500">Submission Time: </span>
          <span className="font-medium text-gray-900 dark:text-white">{formatDate(item.submissionTime)}</span>
        </div>

        {item.link && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
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
