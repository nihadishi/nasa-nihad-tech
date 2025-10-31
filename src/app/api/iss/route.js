import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://api.open-notify.org/iss-now.json', {
      next: { revalidate: 5 } // Cache for 5 seconds
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch ISS data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Calculate velocity (approximate)
    // ISS travels at ~27,600 km/h at ~408 km altitude
    const velocity = 27600;

    return NextResponse.json({
      latitude: parseFloat(data.iss_position.latitude),
      longitude: parseFloat(data.iss_position.longitude),
      timestamp: data.timestamp,
      velocity: velocity
    });

  } catch (error) {
    console.error('ISS API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

