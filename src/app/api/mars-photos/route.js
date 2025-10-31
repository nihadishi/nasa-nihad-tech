import { NextResponse } from 'next/server';
import { trackApiRequest } from '@/lib/apiTracker';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rover = searchParams.get('rover') || 'curiosity';
    const sol = searchParams.get('sol');
    const camera = searchParams.get('camera');
    
    if (!sol) {
      return NextResponse.json(
        { error: 'Sol parameter is required' },
        { status: 400 }
      );
    }

    const key = process.env.NASA_API_KEY || 'DEMO_KEY';
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${key}`;
    
    if (camera && camera !== 'all') {
      url += `&camera=${camera}`;
    }

    console.log('Fetching Mars photos:', url.replace(key, '[REDACTED]'));
    console.log('API Key present:', !!key);
    console.log('API Key length:', key?.length || 0);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 0 }
      });
      
      clearTimeout(timeoutId);
      
      // Check content type first
      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);
      
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 200));
        return NextResponse.json(
          { error: 'NASA API returned invalid format. Please check API key and URL.', contentType: contentType },
          { status: 500 }
        );
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Mars API Error:', data);
        return NextResponse.json(
          { error: data.errors?.[0] || data.error || 'Failed to fetch Mars photos', details: data },
          { status: response.status }
        );
      }

      console.log('Mars photos fetched successfully:', data.photos?.length || 0);
      
      // Track successful API request
      trackApiRequest();
      
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout - NASA API took too long to respond');
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Mars Photos API Error:', error);
    console.error('Error stack:', error.stack);
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

