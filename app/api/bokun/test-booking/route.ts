import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface EndpointTestResult {
  endpoint: string;
  status?: number;
  ok?: boolean;
  responseLength?: number;
  responsePreview?: string;
  isJson?: boolean;
  parsedData?: any;
  parseError?: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Bokun booking API endpoints...');
    
    const ACCESS_KEY = process.env.BOKUN_NATIVE_ACCESS_KEY;
    const SECRET_KEY = process.env.BOKUN_NATIVE_SECRET_KEY;
    
    if (!ACCESS_KEY || !SECRET_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Missing native Bokun API credentials'
      });
    }

    // Test with a known confirmation code from the GraphQL response
    const confirmationCode = 'JAC-65400954'; // From the previous test
    
    // Create date in the required format
    const now = new Date();
    const utcDate = now.getUTCFullYear() + '-' + 
                    String(now.getUTCMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getUTCDate()).padStart(2, '0') + ' ' +
                    String(now.getUTCHours()).padStart(2, '0') + ':' + 
                    String(now.getUTCMinutes()).padStart(2, '0') + ':' + 
                    String(now.getUTCSeconds()).padStart(2, '0');

    // Test different potential endpoints
    const testEndpoints = [
      `/booking.json/${confirmationCode}`,
      `/booking/${confirmationCode}`,
      `/bookings.json/${confirmationCode}`,
      `/bookings/${confirmationCode}`,
      `/booking.json?confirmationCode=${confirmationCode}`,
      `/booking.json?id=${confirmationCode}`
    ];

    const results: EndpointTestResult[] = [];

    for (const path of testEndpoints) {
      try {
        const httpMethod = 'GET';
        
        // Create HMAC signature
        const stringToSign = utcDate + ACCESS_KEY + httpMethod + path;
        const signature = crypto
          .createHmac('sha1', SECRET_KEY)
          .update(stringToSign)
          .digest('base64');

        // Set up headers
        const headers = {
          'X-Bokun-Date': utcDate,
          'X-Bokun-AccessKey': ACCESS_KEY,
          'X-Bokun-Signature': signature,
          'Content-Type': 'application/json;charset=UTF-8'
        };

        const url = `https://api.bokun.io${path}`;
        console.log(`Testing: ${url}`);
        
        const response = await fetch(url, {
          method: httpMethod,
          headers
        });

        const responseText = await response.text();
        
        const result: EndpointTestResult = {
          endpoint: path,
          status: response.status,
          ok: response.ok,
          responseLength: responseText.length,
          responsePreview: responseText.substring(0, 200),
          isJson: (() => {
            try {
              JSON.parse(responseText);
              return true;
            } catch {
              return false;
            }
          })()
        };

        // If we get a successful response, try to parse it
        if (response.ok && responseText.length > 0) {
          try {
            const data = JSON.parse(responseText);
            result.parsedData = data;
          } catch (e) {
            result.parseError = e instanceof Error ? e.message : String(e);
          }
        }

        results.push(result);

      } catch (error) {
        results.push({
          endpoint: path,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking API endpoint testing complete',
      testConfirmationCode: confirmationCode,
      hmacCredentials: {
        hasAccessKey: !!ACCESS_KEY,
        hasSecretKey: !!SECRET_KEY,
        accessKeyPrefix: ACCESS_KEY?.substring(0, 10) + '...'
      },
      testResults: results
    });

  } catch (error) {
    console.error('❌ Test booking API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 