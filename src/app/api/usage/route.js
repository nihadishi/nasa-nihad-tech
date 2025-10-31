// Simple in-memory API usage tracker
// In production, consider using Redis or a database

const API_LIMIT = 1000; // requests per hour
let requestLog = [];

function cleanupOldRequests() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  requestLog = requestLog.filter(timestamp => timestamp > oneHourAgo);
}

export function incrementRequest() {
  cleanupOldRequests();
  requestLog.push(Date.now());
}

export function getUsage() {
  cleanupOldRequests();
  return {
    used: requestLog.length,
    limit: API_LIMIT,
    remaining: Math.max(0, API_LIMIT - requestLog.length),
    resetTime: requestLog.length > 0 ? requestLog[0] + 60 * 60 * 1000 : Date.now() + 60 * 60 * 1000
  };
}

// GET: Get current usage stats
export async function GET() {
  try {
    const usage = getUsage();
    return Response.json(usage);
  } catch (error) {
    console.error('Usage API Error:', error);
    return Response.json(
      { error: 'Failed to get usage stats', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Increment request counter
export async function POST() {
  try {
    incrementRequest();
    const usage = getUsage();
    return Response.json(usage);
  } catch (error) {
    console.error('Usage API Error:', error);
    return Response.json(
      { error: 'Failed to track request', details: error.message },
      { status: 500 }
    );
  }
}

