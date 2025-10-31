export async function POST(request) {
  try {
    console.log('SSC Graph API proxy called');
    
    const body = await request.json();
    console.log('Request body received, satellites:', body[1]?.Satellites?.[1]?.length || 0);
    console.log('Trying URL: https://sscweb.gsfc.nasa.gov/WS/sscr/2/graph');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch('https://sscweb.gsfc.nasa.gov/WS/sscr/2/graph', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify(body)
    });

    clearTimeout(timeoutId);

    console.log('SSC Graph API response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SSC Graph API error response:', errorText.substring(0, 500));
      
      return Response.json(
        { 
          error: `Graph API returned ${response.status}. This endpoint may not be available or may require XML format instead of JSON.`,
          details: errorText.substring(0, 200),
          suggestion: 'Try using "Get Locations" instead, which provides coordinate data.'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('SSC Graph API success, response keys:', Object.keys(data));
    
    return Response.json(data);
  } catch (error) {
    console.error('SSC Graph API Error:', error);
    return Response.json(
      { 
        error: 'Failed to connect to SSC Graph API',
        details: error.message,
        suggestion: 'The graph endpoint may not be available. Try "Get Locations" for coordinate data instead.'
      },
      { status: 500 }
    );
  }
}

