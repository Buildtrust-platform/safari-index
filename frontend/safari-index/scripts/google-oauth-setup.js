#!/usr/bin/env node
/**
 * Google OAuth Setup Script
 *
 * Run this once to get a refresh token for Google Calendar access.
 *
 * Prerequisites:
 * 1. Go to Google Cloud Console: https://console.cloud.google.com
 * 2. Create a project or select existing one
 * 3. Enable Google Calendar API
 * 4. Create OAuth 2.0 credentials (Web application type)
 * 5. Add http://localhost:3333/callback as an authorized redirect URI
 *
 * Usage:
 *   GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy node scripts/google-oauth-setup.js
 *
 * After completing the OAuth flow, add the refresh token to your env vars:
 *   GOOGLE_REFRESH_TOKEN=zzz
 */

const http = require('http');
const { URL } = require('url');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3333/callback';
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing required environment variables:');
  console.error('  GOOGLE_CLIENT_ID');
  console.error('  GOOGLE_CLIENT_SECRET');
  console.error('');
  console.error('Usage:');
  console.error('  GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy node scripts/google-oauth-setup.js');
  process.exit(1);
}

// Build authorization URL
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

console.log('');
console.log('='.repeat(60));
console.log('Google Calendar OAuth Setup');
console.log('='.repeat(60));
console.log('');
console.log('1. Open this URL in your browser:');
console.log('');
console.log(authUrl.toString());
console.log('');
console.log('2. Sign in with the Google account that owns your calendar');
console.log('3. Grant calendar access permissions');
console.log('4. You will be redirected back here automatically');
console.log('');
console.log('Waiting for callback on http://localhost:3333 ...');
console.log('');

// Start local server to receive callback
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3333');

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end(`<h1>Error</h1><p>${error}</p>`);
      console.error('OAuth error:', error);
      process.exit(1);
    }

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h1>Error</h1><p>No authorization code received</p>');
      return;
    }

    // Exchange code for tokens
    try {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json();

      if (tokens.error) {
        throw new Error(tokens.error_description || tokens.error);
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>Success!</title></head>
          <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #059669;">✓ OAuth Setup Complete</h1>
            <p>Add this to your environment variables:</p>
            <pre style="background: #f3f4f6; padding: 16px; border-radius: 8px; overflow-x: auto;">GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
            <p style="color: #6b7280; font-size: 14px;">You can close this window.</p>
          </body>
        </html>
      `);

      console.log('');
      console.log('='.repeat(60));
      console.log('SUCCESS! Add this to your environment:');
      console.log('='.repeat(60));
      console.log('');
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
      console.log('');
      console.log('For Amplify, add this in the Environment Variables section.');
      console.log('');

      // Close server after a short delay
      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 1000);

    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h1>Error</h1><p>${err.message}</p>`);
      console.error('Token exchange failed:', err.message);
      process.exit(1);
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3333, () => {
  // Server started, waiting for callback
});

// Handle ctrl+c
process.on('SIGINT', () => {
  console.log('\nCancelled.');
  server.close();
  process.exit(0);
});
