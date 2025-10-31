import { formatDate } from './utils';

export default function RBECard({ item, index }) {
  return (
    <div key={index} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
      <div className="border-l-4 border-red-500 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Radiation Belt Enhancement</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.rbeID}</p>
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

        <div className="p-4 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800 mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Radiation belt enhancements are increases in the population of energetic particles trapped in 
                Earth&apos;s Van Allen radiation belts. These can pose significant risks to satellites and spacecraft systems.
              </p>
            </div>
          </div>
        </div>

        {item.linkedEvents && item.linkedEvents.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Linked Events</h4>
            <div className="space-y-2">
              {item.linkedEvents.map((event, i) => {
                const eventType = event.activityID.split('-').slice(-2)[0];
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {event.activityID}
                    </div>
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs font-semibold border border-gray-200 dark:border-gray-700">
                      {eventType}
                    </span>
                  </div>
                );
              })}
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
              className="inline-flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
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
