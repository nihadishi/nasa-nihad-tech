import { NextResponse } from 'next/server';
import { trackApiRequest } from '@/lib/apiTracker';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'states/all';
    const icao24 = searchParams.get('icao24'); // Optional: filter by aircraft ICAO24
    const lamin = searchParams.get('lamin'); // Optional: min latitude
    const lomin = searchParams.get('lomin'); // Optional: min longitude
    const lamax = searchParams.get('lamax'); // Optional: max latitude
    const lomax = searchParams.get('lomax'); // Optional: max longitude

    let url = `https://opensky-network.org/api/${endpoint}`;

    // Build query string for optional parameters
    const params = new URLSearchParams();
    if (icao24) params.append('icao24', icao24);
    if (lamin) params.append('lamin', lamin);
    if (lomin) params.append('lomin', lomin);
    if (lamax) params.append('lamax', lamax);
    if (lomax) params.append('lomax', lomax);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log('Fetching OpenSky Network API:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
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

    // Track successful API request
    trackApiRequest();

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
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

