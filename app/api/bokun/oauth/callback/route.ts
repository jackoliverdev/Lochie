import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

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

// Simple token storage (in production, use database)
async function storeAccessToken(domain: string, tokenData: any) {
  try {
    const tokenPath = path.join(process.cwd(), '.bokun-tokens.json');
    let tokens = {};
    
    try {
      const existingTokens = await fs.readFile(tokenPath, 'utf-8');
      tokens = JSON.parse(existingTokens);
    } catch {
      // File doesn't exist, start fresh
    }

    tokens = {
      ...tokens,
      [domain]: {
        ...tokenData,
        stored_at: new Date().toISOString()
      }
    };

    await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));
    console.log('✅ Access token stored for domain:', domain);
  } catch (error) {
    console.error('❌ Failed to store access token:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.BOKUN_OAUTH_CLIENT_ID;
    const clientSecret = process.env.BOKUN_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Missing OAuth configuration' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const domain = url.searchParams.get('domain');
    const state = url.searchParams.get('state');
    const timestamp = url.searchParams.get('timestamp');
    const hmac = url.searchParams.get('hmac');
    const code = url.searchParams.get('code');

    console.log('🔍 OAuth Callback Request:', {
      domain,
      state: state?.substring(0, 10) + '...',
      timestamp,
      hmac: hmac?.substring(0, 10) + '...',
      code: code?.substring(0, 10) + '...',
      params: Object.fromEntries(url.searchParams.entries())
    });

    // Verify required parameters
    if (!domain || !state || !timestamp || !hmac || !code) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
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

    // Exchange authorization code for access token
    const tokenUrl = `https://${domain}.bokun.io/appstore/oauth/access_token`;
    const tokenRequest = {
      client_id: clientId,
      client_secret: clientSecret,
      code: code
    };

    console.log('🔄 Exchanging code for access token...');

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tokenRequest)
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Token exchange failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to exchange code for access token', details: errorText },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Access token received:', {
      scope: tokenData.scope,
      vendor_id: tokenData.vendor_id
    });

    // Store the access token
    await storeAccessToken(domain, tokenData);

    // Create success page HTML
    const successHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bokun OAuth Success</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              max-width: 800px; 
              margin: 50px auto; 
              padding: 20px;
              background: #f8fafc;
            }
            .card {
              background: white;
              border-radius: 12px;
              padding: 32px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              margin-bottom: 20px;
            }
            .success { color: #10b981; }
            .info { color: #6b7280; margin-top: 16px; }
            .scopes, .token { 
              background: #f3f4f6; 
              padding: 12px; 
              border-radius: 6px; 
              margin: 16px 0;
              font-family: monospace;
              font-size: 12px;
              word-break: break-all;
            }
            .token {
              background: #fef3c7;
              border: 1px solid #f59e0b;
            }
            .button {
              display: inline-block;
              background: #3b82f6;
              color: white;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              margin-top: 20px;
              margin-right: 10px;
            }
            .copy-btn {
              background: #10b981;
              cursor: pointer;
              border: none;
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              font-size: 12px;
            }
            .env-vars {
              background: #1f2937;
              color: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              margin: 16px 0;
              font-family: monospace;
              font-size: 12px;
              white-space: pre-line;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h2 class="success">✅ Bokun OAuth Authorization Successful!</h2>
            <p>Your Lochie Admin Dashboard is now connected to Bokun.</p>
            
            <div class="info">
              <strong>Domain:</strong> ${domain}<br>
              <strong>Vendor ID:</strong> ${tokenData.vendor_id}<br>
              <strong>Granted Scopes:</strong>
              <div class="scopes">${tokenData.scope}</div>
            </div>
          </div>

          <div class="card">
            <h3>🔧 Production Setup Required</h3>
            <p>To use real booking data in production, add these environment variables to your Vercel dashboard:</p>
            
            <div class="env-vars">BOKUN_ACCESS_TOKEN=${tokenData.access_token}
BOKUN_OAUTH_SCOPES=${tokenData.scope}
BOKUN_VENDOR_ID=${tokenData.vendor_id}</div>
            
            <button class="copy-btn" onclick="copyToClipboard()">📋 Copy Environment Variables</button>
            
            <p style="margin-top: 16px; font-size: 14px; color: #6b7280;">
              1. Go to your <a href="https://vercel.com/dashboard" target="_blank">Vercel Dashboard</a><br>
              2. Select your project → Settings → Environment Variables<br>
              3. Add the three variables above<br>
              4. Redeploy your application
            </p>
          </div>

          <div style="text-align: center;">
            <a href="https://lochie.vercel.app/app" class="button">
              Go to Admin Dashboard
            </a>
            <a href="https://vercel.com/dashboard" class="button" target="_blank">
              Open Vercel Dashboard
            </a>
          </div>

          <script>
            function copyToClipboard() {
              const envVars = \`BOKUN_ACCESS_TOKEN=${tokenData.access_token}
BOKUN_OAUTH_SCOPES=${tokenData.scope}
BOKUN_VENDOR_ID=${tokenData.vendor_id}\`;
              navigator.clipboard.writeText(envVars).then(() => {
                document.querySelector('.copy-btn').textContent = '✅ Copied!';
                setTimeout(() => {
                  document.querySelector('.copy-btn').textContent = '📋 Copy Environment Variables';
                }, 2000);
              });
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(successHtml, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('💥 OAuth callback error:', error);
    
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bokun OAuth Error</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              max-width: 600px; 
              margin: 50px auto; 
              padding: 20px;
              background: #f8fafc;
            }
            .card {
              background: white;
              border-radius: 12px;
              padding: 32px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .error { color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2 class="error">❌ OAuth Authorization Failed</h2>
            <p>There was an error during the OAuth process:</p>
            <pre>${error instanceof Error ? error.message : String(error)}</pre>
            <p>Please try again or contact support.</p>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(errorHtml, {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    });
  }
} 