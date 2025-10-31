import { formatDate } from './utils';

export default function NotificationCard({ item, index }) {
  const getTypeColor = (type) => {
    switch(type?.toUpperCase()) {
      case 'CME': return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500' };
      case 'GST': return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500' };
      case 'FLR': return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500' };
      case 'IPS': return { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500' };
      case 'SEP': return { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500' };
      case 'MPC': return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500' };
      case 'RBE': return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-500' };
      case 'HSS': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500' };
      default: return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-500' };
    }
  };

  const getTypeBadgeColor = (type) => {
    switch(type?.toUpperCase()) {
      case 'CME': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'GST': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'FLR': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'IPS': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'SEP': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'MPC': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'RBE': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'HSS': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const extractSummary = (body) => {
    const summaryMatch = body?.match(/## Summary:\n\n([\s\S]*?)(?=\n\n##|$)/);
    return summaryMatch ? summaryMatch[1].trim() : '';
  };

  const extractNotes = (body) => {
    const notesMatch = body?.match(/## Notes:\s*\n\n([\s\S]*?)$/);
    return notesMatch ? notesMatch[1].trim() : '';
  };

  const extractLinks = (body) => {
    const linkMatches = body?.match(/http[s]?:\/\/[^\s]+/g);
    return linkMatches || [];
  };

  const extractGifs = (body) => {
    const linkMatches = body?.match(/http[s]?:\/\/[^\s]+\.gif/gi);
    return linkMatches || [];
  };

  const summary = extractSummary(item.messageBody);
  const notes = extractNotes(item.messageBody);
  const links = extractLinks(item.messageBody);
  const gifs = extractGifs(item.messageBody);
  const otherLinks = links.filter(link => !link.toLowerCase().endsWith('.gif'));
  const colors = getTypeColor(item.messageType);

  return (
    <div key={index} className={`bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300 border-l-4 ${colors.border}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-6 h-6 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Space Weather Notification</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.messageID}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border-l-4 border-amber-500">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1 uppercase tracking-wider">
                Experimental Research Information
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                This consists of preliminary NASA research products. 
                NOAA&apos;s Space Weather Prediction Center is the official U.S. Government source for space weather forecasts.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Issue Time</h4>
            <p className="text-base font-medium text-gray-900 dark:text-white">{formatDate(item.messageIssueTime)}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Event Type</h4>
            <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold border ${getTypeBadgeColor(item.messageType)}`}>
              {item.messageType || 'General'}
            </span>
          </div>
        </div>

        {summary && (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Summary</h4>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">{summary}</p>
            </div>
          </div>
        )}

        {notes && (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Notes</h4>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">{notes}</p>
            </div>
          </div>
        )}

        {gifs.length > 0 && (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Simulation Animations ({gifs.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gifs.map((gif, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <a 
                    href={gif}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={gif} 
                        alt={`Simulation ${i + 1}`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-xs text-gray-600 dark:text-gray-400 break-all font-medium">View full resolution</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherLinks.length > 0 && (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Related Resources ({otherLinks.length})</h4>
            <div className="space-y-2">
              {otherLinks.map((link, i) => (
                <a 
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-xs text-gray-600 dark:text-gray-400 break-all font-medium">{link}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {item.messageURL && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <a 
              href={item.messageURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg} ${colors.text} rounded-lg border ${colors.border} hover:opacity-80 transition-colors font-medium`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Full Notification
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
