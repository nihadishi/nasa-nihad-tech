export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studyId = searchParams.get('id') || '';

    if (!studyId) {
      return Response.json(
        { error: 'Study ID is required' },
        { status: 400 }
      );
    }

    const url = `https://osdr.nasa.gov/osdr/data/osd/meta/${studyId}`;
    
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
    console.error('OSDR Metadata API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch study metadata' },
      { status: 500 }
    );
  }
}

