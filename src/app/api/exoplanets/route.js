export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const format = searchParams.get('format') || 'json';

  if (!query) {
    return Response.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=${format}`;
    
    console.log('Fetching from NASA API:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('NASA API error:', response.status, errorText);
      throw new Error(`NASA API returned ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 500));
      throw new Error('API returned non-JSON response');
    }

    const data = await response.json();
    console.log('Successfully fetched', data.length, 'planets');
    
    return Response.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    
    if (error.name === 'AbortError') {
      return Response.json({ error: 'Request timeout - query took too long' }, { status: 504 });
    }
    
    return Response.json({ error: error.message }, { status: 500 });
  }
}

