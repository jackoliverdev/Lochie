import { NextRequest, NextResponse } from 'next/server';

const BOKUN_BASE_URL = 'https://api.bokun.io/octo/v1';
const OCTO_TOKEN = '0cbcf99785cd4ea593c1ab9168f0b63a';

export async function GET() {
  const testEndpoints = [
    '/products',
    '/supplier',
    '/products/1031959',
    '/products/1031959/availability',
    '/capabilities'
  ];

  const results = [];

  for (const path of testEndpoints) {
    try {
      console.log(`Testing OCTO endpoint: ${path}`);
      
      const response = await fetch(`${BOKUN_BASE_URL}${path}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${OCTO_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      
      results.push({
        endpoint: path,
        status: response.status,
        contentType: response.headers.get('content-type'),
        isJSON: responseText.startsWith('{') || responseText.startsWith('['),
        responsePreview: responseText.substring(0, 200),
        success: response.ok
      });
      
    } catch (error) {
      results.push({
        endpoint: path,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return NextResponse.json({
    message: 'Bokun OCTO API endpoint tests',
    baseUrl: BOKUN_BASE_URL,
    octoToken: OCTO_TOKEN,
    results
  });
} 