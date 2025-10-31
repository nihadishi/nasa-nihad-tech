export async function GET(request) {
  try {
    console.log('Fetching SSC observatories...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    clearTimeout(timeoutId);

    console.log('SSC API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SSC API error response:', errorText);
      return Response.json(
        { error: `API returned ${response.status}: ${errorText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');
    console.log('SSC API content-type:', contentType);

    const data = await response.json();
    console.log('SSC Observatories response structure:', {
      isArray: Array.isArray(data),
      keys: typeof data === 'object' ? Object.keys(data) : null,
      firstElement: Array.isArray(data) ? data[0] : null
    });
    
    return Response.json(data);
  } catch (error) {
    console.error('SSC Observatories API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch observatories', details: error.toString() },
      { status: 500 }
    );
  }
}

