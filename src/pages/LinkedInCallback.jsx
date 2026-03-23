import React, { useEffect, useState } from 'react';
import { exchangeCodeForToken, fetchLinkedInProfile } from '../services/linkedinApi';

/**
 * LinkedInCallback — handles the redirect back from LinkedIn after OAuth
 * Shown when the URL contains ?code=...&state=...
 * After processing, clears the query params and signals parent to show Settings.
 */
const LinkedInCallback = ({ onDone }) => {
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');

      if (error) {
        setStatus('error');
        setMessage(params.get('error_description') || 'LinkedIn denied access.');
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing code or state in callback URL.');
        return;
      }

      try {
        await exchangeCodeForToken(code, state);
        await fetchLinkedInProfile();
        setStatus('success');
        // Clean up URL then redirect to settings after short delay
        window.history.replaceState({}, '', window.location.pathname);
        setTimeout(() => onDone('settings'), 1500);
      } catch (err) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    run();
  }, [onDone]);

  return (
    <div className="min-h-screen bg-[#fbf9f4] dark:bg-[#0e0e0c] flex items-center justify-center">
      <div className="bg-white dark:bg-[#1e1e1c] rounded-3xl p-10 shadow-xl border border-[#b1b3a9]/10 dark:border-white/5 max-w-sm w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[#0077B5] flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-anthracite dark:text-white mb-2">Connecting to LinkedIn…</h2>
            <p className="text-sm text-[#5e6058]">Exchanging authorization code for access token</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-emerald-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h2 className="text-xl font-extrabold text-anthracite dark:text-white mb-2">Connected! 🎉</h2>
            <p className="text-sm text-[#5e6058]">Your LinkedIn account is linked. Redirecting…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
            </div>
            <h2 className="text-xl font-extrabold text-anthracite dark:text-white mb-2">Connection Failed</h2>
            <p className="text-sm text-red-500 mb-5">{message}</p>
            <button
              onClick={() => onDone('settings')}
              className="px-6 py-2.5 bg-anthracite text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
            >
              Back to Settings
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LinkedInCallback;
