import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    const key = process.env.NASA_API_KEY || 'DEMO_KEY';
    let url = `https://api.nasa.gov/planetary/apod?api_key=${key}&thumbs=true`;
    
    // Add date parameter if provided
    if (date) {
      url += `&date=${date}`;
    }
    
    console.log('Fetching NASA APOD:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('NASA API Error:', data);
      return NextResponse.json(
        { error: data.msg || data.error || 'Failed to fetch APOD data', code: data.code },
        { status: response.status }
      );
    }
    
    // Check if NASA API returned an error in the response body
    if (data.error) {
      console.error('NASA API returned error:', data);
      return NextResponse.json(
        { error: data.msg || data.error, code: data.code },
        { status: 400 }
      );
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('APOD API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

