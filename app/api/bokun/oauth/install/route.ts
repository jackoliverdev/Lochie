import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// HMAC verification helper
function verifyHmac(query: URLSearchParams, secret: string): boolean {
  const hmac = query.get('hmac');
  if (!hmac) return false;

  // Remove hmac from query parameters
  const params = new URLSearchParams(query);
  params.delete('hmac');

  // Sort parameters alphabetically and create query string
  const sortedParams = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // Create HMAC-SHA256 signature
  const expectedHmac = crypto
    .createHmac('sha256', secret)
    .update(sortedParams)
    .digest('hex');

  return hmac === expectedHmac;
}

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.BOKUN_OAUTH_CLIENT_ID;
    const clientSecret = process.env.BOKUN_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.BOKUN_OAUTH_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing OAuth configuration' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const domain = url.searchParams.get('domain');
    const timestamp = url.searchParams.get('timestamp');
    const hmac = url.searchParams.get('hmac');

    console.log('🔍 OAuth Install Request:', {
      domain,
      timestamp,
      hmac: hmac?.substring(0, 10) + '...',
      params: Object.fromEntries(url.searchParams.entries())
    });

    // Verify required parameters
    if (!domain || !timestamp || !hmac) {
      return NextResponse.json(
        { error: 'Missing required parameters: domain, timestamp, hmac' },
        { status: 400 }
      );
    }

    // Verify HMAC signature
    if (!verifyHmac(url.searchParams, clientSecret)) {
      console.error('❌ HMAC verification failed');
      return NextResponse.json(
        { error: 'Invalid HMAC signature' },
        { status: 401 }
      );
    }

    console.log('✅ HMAC verification successful');

    // Generate random state for security
    const state = crypto.randomBytes(32).toString('hex');

    // Store state temporarily (in production, use Redis/database)
    // For now, we'll include it in the authorization URL

    // Required scopes for booking data
    const scopes = [
      'BOOKINGS_READ',
      'CUSTOMERS_READ', 
      'CHECKOUTS_READ',
      'PRODUCTS_READ'
    ].join(',');

    // Build Bokun authorization URL
    const authUrl = new URL(`https://${domain}.bokun.io/appstore/oauth/authorize`);
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);

    console.log('🔗 Redirecting to Bokun authorization:', authUrl.toString());

    // Redirect to Bokun authorization
    return NextResponse.redirect(authUrl.toString());

  } catch (error) {
    console.error('💥 OAuth install error:', error);
    return NextResponse.json(
      { 
        error: 'OAuth installation failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 