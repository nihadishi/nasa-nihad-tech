export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint'); // tle, positions, visualpasses, radiopasses, above
    const apiKey = searchParams.get('apiKey') || process.env.N2YO_API_KEY;
    
    if (!apiKey) {
      return Response.json(
        { error: 'N2YO API key is required. Please set N2YO_API_KEY environment variable or provide it as a parameter.' },
        { status: 400 }
      );
    }

    if (!endpoint) {
      return Response.json(
        { error: 'Endpoint parameter is required. Options: tle, positions, visualpasses, radiopasses, above' },
        { status: 400 }
      );
    }

    let url = '';
    const baseUrl = 'https://api.n2yo.com/rest/v1/satellite';

    switch (endpoint) {
      case 'tle': {
        const id = searchParams.get('id');
        if (!id) {
          return Response.json({ error: 'NORAD id is required for TLE endpoint' }, { status: 400 });
        }
        url = `${baseUrl}/tle/${id}&apiKey=${apiKey}`;
        break;
      }

      case 'positions': {
        const id = searchParams.get('id');
        const observerLat = searchParams.get('observer_lat');
        const observerLng = searchParams.get('observer_lng');
        const observerAlt = searchParams.get('observer_alt') || '0';
        const seconds = searchParams.get('seconds') || '60';
        
        if (!id || !observerLat || !observerLng) {
          return Response.json(
            { error: 'NORAD id, observer_lat, and observer_lng are required for positions endpoint' },
            { status: 400 }
          );
        }
        url = `${baseUrl}/positions/${id}/${observerLat}/${observerLng}/${observerAlt}/${seconds}&apiKey=${apiKey}`;
        break;
      }

      case 'visualpasses': {
        const id = searchParams.get('id');
        const observerLat = searchParams.get('observer_lat');
        const observerLng = searchParams.get('observer_lng');
        const observerAlt = searchParams.get('observer_alt') || '0';
        const days = searchParams.get('days') || '10';
        const minVisibility = searchParams.get('min_visibility') || '300';
        
        if (!id || !observerLat || !observerLng) {
          return Response.json(
            { error: 'NORAD id, observer_lat, and observer_lng are required for visualpasses endpoint' },
            { status: 400 }
          );
        }
        url = `${baseUrl}/visualpasses/${id}/${observerLat}/${observerLng}/${observerAlt}/${days}/${minVisibility}&apiKey=${apiKey}`;
        break;
      }

      case 'radiopasses': {
        const id = searchParams.get('id');
        const observerLat = searchParams.get('observer_lat');
        const observerLng = searchParams.get('observer_lng');
        const observerAlt = searchParams.get('observer_alt') || '0';
        const days = searchParams.get('days') || '10';
        const minElevation = searchParams.get('min_elevation') || '10';
        
        if (!id || !observerLat || !observerLng) {
          return Response.json(
            { error: 'NORAD id, observer_lat, and observer_lng are required for radiopasses endpoint' },
            { status: 400 }
          );
        }
        url = `${baseUrl}/radiopasses/${id}/${observerLat}/${observerLng}/${observerAlt}/${days}/${minElevation}&apiKey=${apiKey}`;
        break;
      }

      case 'above': {
        const observerLat = searchParams.get('observer_lat');
        const observerLng = searchParams.get('observer_lng');
        const observerAlt = searchParams.get('observer_alt') || '0';
        const searchRadius = searchParams.get('search_radius') || '45';
        const categoryId = searchParams.get('category_id') || '0';
        
        if (!observerLat || !observerLng) {
          return Response.json(
            { error: 'observer_lat and observer_lng are required for above endpoint' },
            { status: 400 }
          );
        }
        url = `${baseUrl}/above/${observerLat}/${observerLng}/${observerAlt}/${searchRadius}/${categoryId}&apiKey=${apiKey}`;
        break;
      }

      default:
        return Response.json(
          { error: 'Invalid endpoint. Options: tle, positions, visualpasses, radiopasses, above' },
          { status: 400 }
        );
    }

    console.log('Fetching N2YO API:', url);
    
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
      const errorText = await response.text();
      console.error('N2YO API error response:', errorText);
      return Response.json(
        { error: `N2YO API returned ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('N2YO API success');
    
    return Response.json(data);
  } catch (error) {
    console.error('N2YO API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch from N2YO API', details: error.toString() },
      { status: 500 }
    );
  }
}

