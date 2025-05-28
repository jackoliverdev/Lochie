import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const EXPERIENCE_ID = process.env.ACTIVITY_ID || '1031959';
  const OCTO_TOKEN = process.env.OCTO_TOKEN;
  const OCTO_BASE_URL = process.env.OCTO_BASE_URL || 'https://api.bokun.io/octo/v1';

  try {
    console.log('=== Bokun OCTO API Debug ===');
    
    if (!OCTO_TOKEN) {
      throw new Error('OCTO_TOKEN not found in environment variables');
    }

    console.log('Experience ID:', EXPERIENCE_ID);
    console.log('OCTO Token:', OCTO_TOKEN.substring(0, 10) + '...');
    console.log('Base URL:', OCTO_BASE_URL);
    
    // Use the correct OCTO API endpoint for products
    const endpoint = `${OCTO_BASE_URL}/products/${EXPERIENCE_ID}`;
    
    console.log('Endpoint:', endpoint);
    
    const headers = {
      'Authorization': `Bearer ${OCTO_TOKEN}`,
      'Content-Type': 'application/json',
      'Octo-Capabilities': 'pricing', // Enable pricing capability
    };
    
    console.log('Headers:', headers);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));
    console.log('Raw response (COMPLETE):', responseText);

    if (!response.ok) {
      console.error('Bokun OCTO API Error:', response.status);
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText.substring(0, 200)}`);
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed JSON data:', JSON.stringify(data, null, 2));
      
      // Log specific pricing information
      if (data.options && data.options.length > 0) {
        console.log('=== PRICING DATA FOUND ===');
        data.options.forEach((option: any, index: number) => {
          console.log(`Option ${index + 1} (ID: ${option.id}):`, option.internalName);
          
          // Check for pricing information in different places
          if (option.units && option.units.length > 0) {
            console.log('Units with pricing:');
            option.units.forEach((unit: any, unitIndex: number) => {
              console.log(`  Unit ${unitIndex + 1} (ID: ${unit.id}):`, unit.internalName, unit.type);
              if (unit.pricingFrom) {
                console.log('  PRICING FROM:', unit.pricingFrom);
              }
              if (unit.pricing) {
                console.log('  PRICING:', unit.pricing);
              }
            });
          }
          
          if (option.pricingCategories) {
            console.log('Pricing Categories:', option.pricingCategories);
          }
          if (option.restrictions) {
            console.log('Restrictions:', option.restrictions);
          }
        });
        
        // Check for default currency and available currencies
        if (data.defaultCurrency) {
          console.log('Default Currency:', data.defaultCurrency);
        }
        if (data.availableCurrencies) {
          console.log('Available Currencies:', data.availableCurrencies);
        }
        if (data.pricingPer) {
          console.log('Pricing Per:', data.pricingPer);
        }
        
      } else {
        console.log('=== NO PRICING DATA FOUND ===');
      }
      
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error(`Response is not valid JSON: ${responseText.substring(0, 200)}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Experience API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch experience data', 
        details: error instanceof Error ? error.message : 'Unknown error',
        octoToken: OCTO_TOKEN,
        experienceId: EXPERIENCE_ID
      },
      { status: 500 }
    );
  }
} 