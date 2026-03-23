/**
 * Netlify Serverless Function: /api/linkedin-token
 *
 * Proxies the LinkedIn OAuth token exchange because LinkedIn's
 * token endpoint does not support CORS from browsers.
 *
 * Accepts POST { code, client_id, client_secret, redirect_uri }
 * Returns { access_token, expires_in, ... } from LinkedIn
 */
export const handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { code, client_id, client_secret, redirect_uri } = body;

  if (!code || !client_id || !client_secret || !redirect_uri) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields: code, client_id, client_secret, redirect_uri' }),
    };
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id,
      client_secret,
      redirect_uri,
    });

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: err.message }),
    };
  }
};
