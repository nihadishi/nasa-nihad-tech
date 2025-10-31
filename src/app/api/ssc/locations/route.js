export async function POST(request) {
  try {
    console.log('SSC Locations API proxy called');
    
    const body = await request.json();
    console.log('Request body received, satellites:', body[1]?.Satellites?.[1]?.length || 0);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch('https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    clearTimeout(timeoutId);

    console.log('SSC Locations API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SSC Locations API error:', errorText);
      return Response.json(
        { error: `API returned ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('SSC Locations API success');
    
    return Response.json(data);
  } catch (error) {
    console.error('SSC Locations API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch locations', details: error.toString() },
      { status: 500 }
    );
  }
}

