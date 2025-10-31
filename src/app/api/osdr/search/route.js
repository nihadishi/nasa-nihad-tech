export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term') || '';
    const from = searchParams.get('from') || '0';
    const size = searchParams.get('size') || '20';
    const type = searchParams.get('type') || 'cgene';

    const url = `https://osdr.nasa.gov/osdr/data/search?term=${encodeURIComponent(term)}&from=${from}&size=${size}&type=${type}`;
    
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
    console.error('OSDR Search API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch search results' },
      { status: 500 }
    );
  }
}

