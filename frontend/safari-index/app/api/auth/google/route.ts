/**
 * Google OAuth Callback Handler
 *
 * GET /api/auth/google?code=xxx - Exchange auth code for tokens
 * GET /api/auth/google?start=1 - Redirect to Google OAuth
 *
 * This is a one-time setup endpoint to get the refresh token.
 * Protect with OPS_KEY in production.
 */

import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const start = searchParams.get('start');
  const opsKey = searchParams.get('key');

  // Require OPS_KEY for security
  if (process.env.OPS_KEY && opsKey !== process.env.OPS_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' },
      { status: 500 }
    );
  }

  // Get the redirect URI from the current request
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/google`;

  // Start OAuth flow
  if (start) {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', SCOPES.join(' '));
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    // Pass through OPS_KEY in state
    if (opsKey) {
      authUrl.searchParams.set('state', opsKey);
    }

    return NextResponse.redirect(authUrl.toString());
  }

  // Handle callback with auth code
  if (code) {
    try {
      // Get OPS_KEY from state parameter
      const state = searchParams.get('state');

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json();

      if (tokens.error) {
        return new NextResponse(
          `<html>
            <head><title>OAuth Error</title></head>
            <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #dc2626;">OAuth Error</h1>
              <p>${tokens.error_description || tokens.error}</p>
            </body>
          </html>`,
          { headers: { 'Content-Type': 'text/html' } }
        );
      }

      // Success - show the refresh token
      return new NextResponse(
        `<html>
          <head><title>OAuth Success</title></head>
          <body style="font-family: system-ui; padding: 40px; max-width: 700px; margin: 0 auto;">
            <h1 style="color: #059669;">✓ Google Calendar Connected</h1>
            <p>Add this environment variable to Amplify:</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <code style="font-size: 12px; word-break: break-all;">GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</code>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              After adding the env var, trigger a new deployment for the booking system to work.
            </p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
            <p style="color: #9ca3af; font-size: 12px;">
              This page can be closed. The refresh token is long-lived and only needs to be set once.
            </p>
          </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    } catch (error) {
      return new NextResponse(
        `<html>
          <head><title>OAuth Error</title></head>
          <body style="font-family: system-ui; padding: 40px;">
            <h1 style="color: #dc2626;">Error</h1>
            <p>${error instanceof Error ? error.message : 'Token exchange failed'}</p>
          </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
  }

  // Show instructions
  return new NextResponse(
    `<html>
      <head><title>Google Calendar Setup</title></head>
      <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
        <h1>Google Calendar OAuth Setup</h1>
        <p>This endpoint helps you get a refresh token for the booking system.</p>
        <h2>Setup Steps:</h2>
        <ol>
          <li>Go to <a href="https://console.cloud.google.com/apis/credentials">Google Cloud Console</a></li>
          <li>Edit your OAuth client ID</li>
          <li>Add this redirect URI: <code>${redirectUri}</code></li>
          <li>Save, then click the button below</li>
        </ol>
        <a href="/api/auth/google?start=1${process.env.OPS_KEY ? '&key=' + process.env.OPS_KEY : ''}"
           style="display: inline-block; padding: 12px 24px; background: #f59e0b; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">
          Connect Google Calendar
        </a>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}

export const dynamic = 'force-dynamic';
