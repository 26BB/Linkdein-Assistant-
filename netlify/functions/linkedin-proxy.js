/**
 * Netlify Serverless Function: /api/linkedin-proxy
 * 
 * Proxies generic LinkedIn API requests to avoid CORS issues in the browser.
 * 
 * Accepts:
 *  POST { endpoint, method, body, token }
 * 
 * Returns the response from LinkedIn.
 */
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { endpoint, method = 'GET', body: linkedinBody, token } = body;

  if (!endpoint || !token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields: endpoint, token' }),
    };
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `https://api.linkedin.com${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: method !== 'GET' ? JSON.stringify(linkedinBody) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy error', details: err.message }),
    };
  }
};
