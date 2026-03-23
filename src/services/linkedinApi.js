/**
 * linkedinApi.js — LinkedIn OAuth 2.0 + Posting Service
 *
 * Flow:
 *  1. User saves their LinkedIn Client ID + Secret in Settings
 *  2. initiateLinkedInOAuth() redirects to LinkedIn login
 *  3. LinkedIn redirects back with ?code=...
 *  4. exchangeCodeForToken() sends code to our /api/linkedin-token proxy
 *  5. We store the access_token in localStorage
 *  6. publishPost(text) uses the token to post to user's personal LinkedIn feed
 */

// ─── Credential helpers (user's own LinkedIn Developer App) ──────────────────

export function getLinkedInCreds() {
  return {
    clientId:
      localStorage.getItem('li_client_id') ||
      import.meta.env.VITE_LINKEDIN_CLIENT_ID ||
      '',
    clientSecret:
      localStorage.getItem('li_client_secret') ||
      import.meta.env.VITE_LINKEDIN_CLIENT_SECRET ||
      '',
    redirectUri:
      localStorage.getItem('li_redirect_uri') ||
      import.meta.env.VITE_LINKEDIN_REDIRECT_URI ||
      window.location.origin,
  };
}

export function saveLinkedInCreds(clientId, clientSecret, redirectUri) {
  localStorage.setItem('li_client_id', clientId);
  localStorage.setItem('li_client_secret', clientSecret);
  localStorage.setItem('li_redirect_uri', redirectUri || window.location.origin);
}

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getLinkedInToken() {
  return localStorage.getItem('li_access_token') || '';
}

export function saveLinkedInToken(token, expiresIn) {
  localStorage.setItem('li_access_token', token);
  const expiry = Date.now() + (expiresIn || 5184000) * 1000; // default 60 days
  localStorage.setItem('li_token_expiry', String(expiry));
}

export function clearLinkedInToken() {
  ['li_access_token', 'li_token_expiry', 'li_profile', 'li_state'].forEach(
    (k) => localStorage.removeItem(k)
  );
}

export function isLinkedInConnected() {
  const token = getLinkedInToken();
  const expiry = Number(localStorage.getItem('li_token_expiry') || 0);
  return !!token && Date.now() < expiry;
}

export function getLinkedInProfile() {
  try {
    return JSON.parse(localStorage.getItem('li_profile') || 'null');
  } catch {
    return null;
  }
}

export function saveLinkedInProfile(profile) {
  localStorage.setItem('li_profile', JSON.stringify(profile));
}

// ─── Proxy helper ──────────────────────────────────────────────────────────────

/**
 * Calls our Netlify proxy function to avoid CORS issues.
 */
async function callLinkedInProxy(endpoint, method = 'GET', body = null) {
  const token = getLinkedInToken();
  if (!token) throw new Error('Not connected to LinkedIn.');

  const res = await fetch('/api/linkedin-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, method, body, token }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || data?.error_description || data?.error || `LinkedIn API error (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

// ─── OAuth flow ───────────────────────────────────────────────────────────────

export function initiateLinkedInOAuth() {
  const { clientId, redirectUri } = getLinkedInCreds();
  if (!clientId) throw new Error('LinkedIn Client ID not set. Go to Settings → LinkedIn Connection.');

  // Generate a random state for CSRF protection
  const state = crypto.randomUUID();
  localStorage.setItem('li_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    // Modern OIDC scopes + w_member_social for posting
    scope: 'openid profile email w_member_social',
  });

  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
}

/**
 * Exchange the authorization code for an access token.
 * This MUST go through a backend function because LinkedIn's token endpoint
 * does not support CORS (browser → LinkedIn directly would be blocked).
 */
export async function exchangeCodeForToken(code, state) {
  // Validate state to prevent CSRF
  const savedState = localStorage.getItem('li_state');
  if (!savedState || savedState !== state) {
    throw new Error('OAuth state mismatch — possible CSRF attack. Please try again.');
  }

  const { clientId, clientSecret, redirectUri } = getLinkedInCreds();

  const res = await fetch('/api/linkedin-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error_description || err?.error || `Token exchange failed (${res.status})`);
  }

  const data = await res.json();
  saveLinkedInToken(data.access_token, data.expires_in);
  localStorage.removeItem('li_state');
  return data.access_token;
}

// ─── Profile fetch ────────────────────────────────────────────────────────────

export async function fetchLinkedInProfile() {
  const data = await callLinkedInProxy('https://api.linkedin.com/v2/userinfo');

  const profile = {
    name: data.name || `${data.given_name || ''} ${data.family_name || ''}`.trim(),
    email: data.email || '',
    picture: data.picture || '',
    sub: data.sub || '', // LinkedIn member URN
  };
  saveLinkedInProfile(profile);
  return profile;
}

// ─── Post publishing ──────────────────────────────────────────────────────────

export async function publishPost(text) {
  const profile = getLinkedInProfile();
  if (!profile?.sub) throw new Error('LinkedIn profile not loaded. Please reconnect.');

  // LinkedIn URN for the user
  const authorUrn = `urn:li:person:${profile.sub}`;

  return await callLinkedInProxy('https://api.linkedin.com/v2/ugcPosts', 'POST', {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  });
}

