import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://api.open-notify.org/astros.json', {
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch astronaut data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Filter only ISS astronauts
    const issAstronauts = data.people.filter(person => person.craft === 'ISS');

    return NextResponse.json({
      people: issAstronauts,
      number: issAstronauts.length
    });

  } catch (error) {
    console.error('Astronaut API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

