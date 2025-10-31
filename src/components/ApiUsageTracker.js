'use client';

import { useState, useEffect } from 'react';

export default function ApiUsageTracker() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchUsage, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !usage) {
    return (
      <span className="text-xs opacity-60">
        API Limit: Loading...
      </span>
    );
  }

  const percentage = (usage.used / usage.limit) * 100;
  const isWarning = percentage >= 80;
  const isCritical = percentage >= 95;

  // Calculate time until reset
  const resetTime = new Date(usage.resetTime);
  const now = new Date();
  const minutesUntilReset = Math.max(0, Math.floor((resetTime - now) / 1000 / 60));

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wider">
        API Limit:
      </span>
      <div className="flex items-center gap-2">
        <div className="relative w-24 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-300 ${
              isCritical
                ? 'bg-red-600'
                : isWarning
                ? 'bg-yellow-600'
                : 'bg-green-600'
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
        <span
          className={`text-xs font-bold ${
            isCritical
              ? 'text-red-600 dark:text-red-400'
              : isWarning
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-green-600 dark:text-green-400'
          }`}
        >
          {usage.remaining} / {usage.limit}
        </span>
      </div>
      {minutesUntilReset > 0 && (
        <span className="text-xs opacity-60">
          (resets in {minutesUntilReset}m)
        </span>
      )}
    </div>
  );
}

