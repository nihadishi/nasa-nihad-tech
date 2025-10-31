export async function GET(request) {
  try {
    const url = 'https://osdr.nasa.gov/geode-py/ws/api/experiments';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return Response.json(
        { error: `API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('OSDR Experiments API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch experiments' },
      { status: 500 }
    );
  }
}

