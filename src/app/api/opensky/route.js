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

    // Vercel serverless functions have 10s timeout, use 7s to be safe and allow processing time
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; tech-nasa/1.0)',
        },
        // Add cache to reduce API calls
        next: { revalidate: 30 } // Cache for 30 seconds
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
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError' || controller.signal.aborted) {
        return NextResponse.json(
          { 
            error: 'Request timeout', 
            details: 'OpenSky API took too long to respond (>7s). The API may be slow or overloaded. Please try again later.',
            suggestion: 'This is a known issue with the OpenSky API. Consider refreshing in a moment.'
          },
          { status: 504 }
        );
      }
      
      throw fetchError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('OpenSky API Error:', error);
    
    // This catch handles any errors not caught in the inner try-catch
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      return NextResponse.json(
        { 
          error: 'Request timeout', 
          details: 'OpenSky API took too long to respond. The API may be slow or overloaded.',
          suggestion: 'Please try again in a moment. OpenSky API has rate limits and can be slow during peak times.'
        },
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

