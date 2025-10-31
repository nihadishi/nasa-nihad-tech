import { trackApiRequest } from '@/lib/apiTracker';

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
    
    // Read response text once (can only read response body once)
    const responseText = await response.text();
    const contentType = response.headers.get('content-type') || '';
    const isXML = contentType.includes('xml') || contentType.includes('text/plain') || responseText.trim().startsWith('<?xml');
    
    // Check if response is XML (error response from TAP service)
    if (isXML || responseText.includes('VOTABLE')) {
      // Parse XML error
      const errorMatch = responseText.match(/<INFO[^>]*value="([^"]+)"[^>]*>/i);
      const sqlErrorMatch = responseText.match(/ORA-\d+:\s*([^<\n]+)/i);
      
      if (sqlErrorMatch) {
        const sqlError = sqlErrorMatch[1].trim();
        console.error('SQL Error in query:', sqlError);
        return Response.json({ 
          error: `SQL Error: ${sqlError}`,
          hint: 'Check your SQL query syntax. Common issues: missing quotes around string values, incorrect column names, or unsupported SQL functions.'
        }, { status: 400 });
      } else if (errorMatch) {
        return Response.json({ 
          error: `API Error: ${errorMatch[1]}`
        }, { status: 400 });
      } else {
        return Response.json({ 
          error: 'API returned XML response (likely an error). Check your SQL query syntax.',
          hint: 'The query may contain syntax errors or use unsupported SQL features.'
        }, { status: 400 });
      }
    }
    
    if (!response.ok) {
      console.error('NASA API error:', response.status, responseText);
      return Response.json({ 
        error: `NASA API returned ${response.status}: ${responseText.substring(0, 200)}`
      }, { status: response.status });
    }

    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText);
      console.log('Successfully fetched', data.length, 'planets');
      
      // Track successful API request
      trackApiRequest();
      
      return Response.json(data);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return Response.json({ 
        error: 'API returned invalid JSON response',
        details: responseText.substring(0, 500)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API Route Error:', error);
    
    if (error.name === 'AbortError') {
      return Response.json({ error: 'Request timeout - query took too long' }, { status: 504 });
    }
    
    return Response.json({ error: error.message }, { status: 500 });
  }
}

