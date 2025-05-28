import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Define interfaces for type safety
interface PricingCategory {
  categoryId: string;
  categoryName: string;
  originalPrice: {
    amount: number;
    currency: string;
    display: string;
  };
  convertedPrice: {
    amount: number;
    currency: string;
    display: string;
  };
  availabilityId: string;
  date: string;
}

interface AvailabilityInfo {
  id: string;
  date: string;
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== Native Bokun Pricing API Called ===');
    
    const ACTIVITY_ID = process.env.ACTIVITY_ID || '1031959';
    const ACCESS_KEY = process.env.BOKUN_NATIVE_ACCESS_KEY;
    const SECRET_KEY = process.env.BOKUN_NATIVE_SECRET_KEY;
    const BOOKING_CHANNEL_UUID = process.env.BOKUN_BOOKING_CHANNEL_UUID;
    const BASE_URL = 'https://api.bokun.io';

    if (!ACCESS_KEY || !SECRET_KEY || !BOOKING_CHANNEL_UUID) {
      throw new Error('Missing native Bokun API credentials or booking channel UUID');
    }

    console.log('Activity ID:', ACTIVITY_ID);
    console.log('Access Key:', ACCESS_KEY.substring(0, 10) + '...');
    console.log('Booking Channel UUID:', BOOKING_CHANNEL_UUID);
    console.log('Base URL:', BASE_URL);

    // Create date in the required format: "yyyy-MM-dd HH:mm:ss"
    const now = new Date();
    const utcDate = now.getUTCFullYear() + '-' + 
                    String(now.getUTCMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getUTCDate()).padStart(2, '0') + ' ' +
                    String(now.getUTCHours()).padStart(2, '0') + ':' + 
                    String(now.getUTCMinutes()).padStart(2, '0') + ':' + 
                    String(now.getUTCSeconds()).padStart(2, '0');

    // Create date range for availability (next 7 days)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Build the API path with query parameters
    const path = `/activity.json/${ACTIVITY_ID}/availabilities?start=${startDateStr}&end=${endDateStr}&bookingChannelUuid=${BOOKING_CHANNEL_UUID}&lang=EN&currency=GBP`;
    const httpMethod = 'GET';

    console.log('API Path:', path);
    console.log('HTTP Method:', httpMethod);
    console.log('Date:', utcDate);

    // Create HMAC signature as per Bokun documentation
    // Concatenate: date + accesskey + httpmethod + path
    const stringToSign = utcDate + ACCESS_KEY + httpMethod + path;
    console.log('String to sign:', stringToSign);

    // Create HMAC-SHA1 signature and base64 encode it
    const signature = crypto
      .createHmac('sha1', SECRET_KEY)
      .update(stringToSign)
      .digest('base64');

    console.log('Generated signature:', signature);

    // Set up headers for native Bokun API
    const headers = {
      'X-Bokun-Date': utcDate,
      'X-Bokun-AccessKey': ACCESS_KEY,
      'X-Bokun-Signature': signature,
      'Content-Type': 'application/json;charset=UTF-8'
    };

    console.log('Request headers:', headers);

    // Make the API call
    const fullUrl = BASE_URL + path;
    console.log('Full URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: httpMethod,
      headers
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Raw response (first 500 chars):', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('Native Bokun API Error:', response.status);
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText.substring(0, 200)}`);
    }

    // Parse the JSON response
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed JSON data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error(`Response is not valid JSON: ${responseText.substring(0, 200)}`);
    }

    // Process pricing data with proper typing
    const pricingCategories: PricingCategory[] = [];
    const availabilities: AvailabilityInfo[] = [];

    const pricingResult = {
      success: true,
      source: 'Native Bokun API with Booking Channel',
      activityId: ACTIVITY_ID,
      bookingChannelUuid: BOOKING_CHANNEL_UUID,
      rawData: data,
      pricing: {
        categories: pricingCategories,
        availabilities: availabilities
      },
      message: "✅ Native Bokun API connected successfully!"
    };

    // Extract pricing information from availabilities
    if (Array.isArray(data) && data.length > 0) {
      console.log('=== PROCESSING PRICING DATA ===');
      
      data.forEach((availability: any, index: number) => {
        console.log(`Processing availability ${index + 1}:`, availability.id);
        
        // Access the pricesByRate array which contains the actual pricing
        if (availability.pricesByRate && Array.isArray(availability.pricesByRate)) {
          availability.pricesByRate.forEach((rateGroup: any) => {
            console.log('Rate group found:', rateGroup);
            
            // Access pricePerCategoryUnit which contains the actual prices
            if (rateGroup.pricePerCategoryUnit && Array.isArray(rateGroup.pricePerCategoryUnit)) {
              rateGroup.pricePerCategoryUnit.forEach((priceCategory: any) => {
                console.log('Price category:', priceCategory);
                
                // Get the price amount and currency directly from the API
                const amount = priceCategory.amount.amount;
                const currency = priceCategory.amount.currency;
                
                const category: PricingCategory = {
                  categoryId: priceCategory.id.toString(),
                  categoryName: getPricingCategoryName(priceCategory.id.toString()),
                  originalPrice: {
                    amount: amount,
                    currency: currency,
                    display: `${currency} ${amount.toLocaleString()}`
                  },
                  convertedPrice: {
                    amount: amount,
                    currency: currency,
                    display: currency === 'GBP' ? `£${amount.toFixed(2)}` : `${currency} ${amount.toLocaleString()}`
                  },
                  availabilityId: availability.id,
                  date: availability.localizedDate
                };
                
                pricingCategories.push(category);
              });
            }
          });
        }
        
        // Add availability info
        const availabilityInfo: AvailabilityInfo = {
          id: availability.id,
          date: availability.localizedDate,
          time: availability.startTime,
          available: !availability.unavailable && !availability.soldOut,
          capacity: availability.availabilityCount,
          booked: availability.bookedParticipants
        };
        
        availabilities.push(availabilityInfo);
      });
    }

    // Remove duplicates and organize by category
    const uniqueCategories = pricingCategories.reduce((acc: PricingCategory[], current: PricingCategory) => {
      const existing = acc.find(item => item.categoryId === current.categoryId);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, []);

    pricingResult.pricing.categories = uniqueCategories;

    console.log('Final pricing result:', JSON.stringify(pricingResult, null, 2));
    return NextResponse.json(pricingResult);

  } catch (error) {
    console.error('Native Bokun API error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
      source: 'Native Bokun API',
      message: "❌ Failed to connect to native Bokun API"
    }, { status: 500 });
  }
}

// Helper function to map pricing category IDs to names
function getPricingCategoryName(categoryId: string): string {
  const categoryMap: { [key: string]: string } = {
    '1001055': 'Adult',
    '1001057': 'Child',
    // Add more mappings as needed
  };
  
  return categoryMap[categoryId] || `Category ${categoryId}`;
} 