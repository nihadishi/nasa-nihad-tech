import { NextResponse } from 'next/server';
import { trackApiRequest } from '@/lib/apiTracker';

export async function GET(request) {
  try {
    // Use request.nextUrl for Next.js compatibility, fallback to request.url
    const searchParams = request.nextUrl ? request.nextUrl.searchParams : new URL(request.url).searchParams;

    const endpoint = searchParams.get('endpoint') || 'states/all';
    const icao24 = searchParams.get('icao24'); // Optional: filter by aircraft ICAO24
    const lamin = searchParams.get('lamin'); // Optional: min latitude
    const lomin = searchParams.get('lomin'); // Optional: min longitude
    const lamax = searchParams.get('lamax'); // Optional: max latitude
    const lomax = searchParams.get('lomax'); // Optional: max longitude

    let apiUrl = `https://opensky-network.org/api/${endpoint}`;

    // Build query string for optional parameters
    const params = new URLSearchParams();
    if (icao24) params.append('icao24', icao24);
    if (lamin) params.append('lamin', lamin);
    if (lomin) params.append('lomin', lomin);
    if (lamax) params.append('lamax', lamax);
    if (lomax) params.append('lomax', lomax);
    
    if (params.toString()) {
      apiUrl += `?${params.toString()}`;
    }

    console.log('Fetching OpenSky Network API:', apiUrl);

    const controller = new AbortController();
    // Vercel serverless functions have 10s timeout, so use 8s to be safe
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; tech-nasa/1.0)',
      },
      // Add cache control for Vercel
      next: { revalidate: 0 }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenSky API Error:', response.status, errorText);
      
      // Handle rate limiting (429)
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'OpenSky API returned 429', details: 'Too many requests. Please wait before refreshing.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: `OpenSky API returned ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Track successful API request (don't fail if tracking fails)
    try {
      trackApiRequest();
    } catch (trackError) {
      // Silently fail tracking - don't break the API response
      console.error('API tracking error (non-critical):', trackError);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('OpenSky API Error:', error);
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - OpenSky API took too long to respond' },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

