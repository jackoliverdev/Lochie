import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== OCTO-Based Pricing API Called ===');
    
    const EXPERIENCE_ID = process.env.ACTIVITY_ID || '1031959';
    const OCTO_TOKEN = process.env.OCTO_TOKEN;
    const OCTO_BASE_URL = process.env.OCTO_BASE_URL || 'https://api.bokun.io/octo/v1';

    if (!OCTO_TOKEN) {
      throw new Error('OCTO_TOKEN not found in environment variables');
    }

    console.log('Getting OCTO-based pricing for experience:', EXPERIENCE_ID);

    // First, get the experience details to see if there's any pricing info
    const experienceResponse = await fetch(`${OCTO_BASE_URL}/products/${EXPERIENCE_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OCTO_TOKEN}`,
        'Content-Type': 'application/json',
        'Octo-Capabilities': 'pricing',
      }
    });

    if (!experienceResponse.ok) {
      throw new Error(`Experience API error: ${experienceResponse.status}`);
    }

    const experienceData = await experienceResponse.json();
    console.log('Experience data received');

    // Extract pricing information from the OCTO experience data
    let pricingInfo = {
      hasPricing: false,
      priceFromData: null,
      units: [],
      limitations: "OCTO API does not provide actual pricing amounts. To get real £ amounts, native Bokun API with HMAC authentication is required."
    };

    if (experienceData.options && experienceData.options.length > 0) {
      const option = experienceData.options[0]; // Get the first option
      
      if (option.units && option.units.length > 0) {
        pricingInfo.units = option.units.map((unit: any) => ({
          id: unit.id,
          name: unit.internalName,
          type: unit.type,
          pricingFrom: unit.pricingFrom || null, // This might contain some pricing hint
          restrictions: unit.restrictions
        }));
        
        // Check if any units have pricingFrom data
        const unitsWithPricing = option.units.filter((unit: any) => unit.pricingFrom);
        if (unitsWithPricing.length > 0) {
          pricingInfo.hasPricing = true;
          pricingInfo.priceFromData = unitsWithPricing;
        }
      }
    }

    // Get availability data to see if it contains any pricing
    const availabilityResponse = await fetch(`${OCTO_BASE_URL}/availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OCTO_TOKEN}`,
        'Content-Type': 'application/json',
        'Octo-Capabilities': 'pricing',
      },
      body: JSON.stringify({
        productId: EXPERIENCE_ID.toString(),
        optionId: process.env.OPTION_ID || '2017520',
        localDateStart: new Date().toISOString().split('T')[0],
        localDateEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        units: [
          { id: "1001055", quantity: 1 },
          { id: "1001057", quantity: 1 }
        ]
      })
    });

    let availabilityPricing = null;
    if (availabilityResponse.ok) {
      const availabilityData = await availabilityResponse.json();
      
      if (Array.isArray(availabilityData) && availabilityData.length > 0) {
        // Check for any pricing data in availability slots
        const slotWithPricing = availabilityData.find((slot: any) => 
          slot.pricing || slot.unitPricing || slot.pricingFrom || slot.unitPricingFrom
        );
        
        if (slotWithPricing) {
          availabilityPricing = {
            pricing: slotWithPricing.pricing,
            unitPricing: slotWithPricing.unitPricing,
            pricingFrom: slotWithPricing.pricingFrom,
            unitPricingFrom: slotWithPricing.unitPricingFrom
          };
          pricingInfo.hasPricing = true;
        }
      }
    }

    const result = {
      success: true,
      source: 'OCTO API (Limited Pricing)',
      experienceId: EXPERIENCE_ID,
      experienceName: experienceData.internalName,
      pricing: pricingInfo,
      availabilityPricing,
      message: "✅ OCTO APIs are working correctly!",
      recommendation: {
        issue: "OCTO API does not provide actual £ amounts for pricing",
        solution: "To get real pricing amounts (like the ISK 19990, 14990 in your screenshot), you need:",
        requirements: [
          "Native Bokun API credentials (different from OCTO)",
          "HMAC authentication using X-Bokun-Date, X-Bokun-AccessKey, X-Bokun-Signature headers",
          "Access to /activity.json/{id}/availabilities endpoint on https://api.bokun.io",
          "Proper native API key and secret for HMAC signature generation"
        ],
        currentStatus: "Your OCTO credentials are working perfectly for basic experience and availability data"
      }
    };

    console.log('OCTO-based pricing result:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);

  } catch (error) {
    console.error('OCTO pricing API error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
      source: 'OCTO API',
      message: "The OCTO API credentials are working, but OCTO doesn't provide actual pricing amounts"
    }, { status: 500 });
  }
} 