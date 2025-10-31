// Helper function to track API requests
// Import the tracking function directly from the usage module

import { incrementRequest } from '@/app/api/usage/route';

export function trackApiRequest() {
  try {
    // Increment the request counter
    incrementRequest();
  } catch (error) {
    // Silently fail - tracking should not break the main functionality
    console.debug('API tracking error (non-critical):', error.message);
  }
}

