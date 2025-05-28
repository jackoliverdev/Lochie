import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const EXPERIENCE_ID = process.env.ACTIVITY_ID || '1031959';
  const OPTION_ID = process.env.OPTION_ID || '2017520';
  const OCTO_TOKEN = process.env.OCTO_TOKEN;
  const OCTO_BASE_URL = process.env.OCTO_BASE_URL || 'https://api.bokun.io/octo/v1';

  try {
    console.log('=== Bokun OCTO Availability API Debug ===');
    
    if (!OCTO_TOKEN) {
      throw new Error('OCTO_TOKEN not found in environment variables');
    }

    console.log('Experience ID:', EXPERIENCE_ID);
    console.log('Option ID:', OPTION_ID);
    console.log('OCTO Token:', OCTO_TOKEN.substring(0, 10) + '...');
    console.log('Base URL:', OCTO_BASE_URL);
    
    // Use the correct OCTO API endpoint for availability
    const endpoint = `${OCTO_BASE_URL}/availability`;
    
    console.log('Endpoint:', endpoint);
    
    const headers = {
      'Authorization': `Bearer ${OCTO_TOKEN}`,
      'Content-Type': 'application/json',
      'Octo-Capabilities': 'pricing', // Enable pricing capability
    };
    
    console.log('Headers:', headers);
    
    // Create the request body for availability check with units to get pricing
    const requestBody = {
      productId: EXPERIENCE_ID.toString(),
      optionId: OPTION_ID,
      localDateStart: new Date().toISOString().split('T')[0], // Today
      localDateEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next 7 days
      // Add units to request pricing information
      units: [
        {
          id: "1001055", // Adults unit ID
          quantity: 1
        },
        {
          id: "1001057", // Children unit ID  
          quantity: 1
        }
      ]
    };
    
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));
    console.log('Raw response (COMPLETE):', responseText);

    if (!response.ok) {
      console.error('Bokun OCTO Availability API Error:', response.status);
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText.substring(0, 200)}`);
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed JSON data:', JSON.stringify(data, null, 2));
      
      // Log specific pricing information in availability
      if (Array.isArray(data) && data.length > 0) {
        console.log('=== AVAILABILITY PRICING DATA ===');
        data.forEach((slot: any, index: number) => {
          console.log(`Slot ${index + 1} (ID: ${slot.id}):`);
          console.log(`  Start: ${slot.localDateTimeStart}`);
          console.log(`  Status: ${slot.status}`);
          console.log(`  Vacancies: ${slot.vacancies}/${slot.capacity}`);
          
          if (slot.unitPricing) {
            console.log('  UNIT PRICING:', slot.unitPricing);
          }
          if (slot.pricing) {
            console.log('  TOTAL PRICING:', slot.pricing);
          }
          if (slot.unitPricingFrom) {
            console.log('  UNIT PRICING FROM:', slot.unitPricingFrom);
          }
          if (slot.pricingFrom) {
            console.log('  TOTAL PRICING FROM:', slot.pricingFrom);
          }
        });
      } else {
        console.log('=== NO AVAILABILITY SLOTS FOUND ===');
      }
      
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error(`Response is not valid JSON: ${responseText.substring(0, 200)}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Availability API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch availability data', 
        details: error instanceof Error ? error.message : 'Unknown error',
        octoToken: OCTO_TOKEN,
        experienceId: EXPERIENCE_ID,
        optionId: OPTION_ID
      },
      { status: 500 }
    );
  }
} 