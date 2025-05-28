import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BookingRequest {
  activityId: string;
  startTimeId: string;
  date: number; // timestamp
  guests: number;
  customer: GuestDetails; // Lead guest for backwards compatibility
  guestDetails: GuestDetails[]; // All guest details
  totalPrice: number;
  pricePerPerson: number;
}

function createHmacSignature(
  utcDate: string,
  accessKey: string,
  method: string,
  path: string,
  secretKey: string
): string {
  // According to docs: date + accessKey + method + path (no body for signature)
  const stringToSign = utcDate + accessKey + method + path;
  return crypto
    .createHmac('sha1', secretKey)
    .update(stringToSign)
    .digest('base64');
}

function formatDateForBokun(timestamp: number): string {
  // Convert timestamp to YYYY-MM-DD format
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
}

function formatDateForBokunAuth(): string {
  // Create UTC date in the required format: "yyyy-MM-dd HH:mm:ss"
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hour = String(now.getUTCHours()).padStart(2, '0');
  const minute = String(now.getUTCMinutes()).padStart(2, '0');
  const second = String(now.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingRequest = await request.json();
    
    console.log('Received booking request:', JSON.stringify(bookingData, null, 2));

    const accessKey = process.env.BOKUN_NATIVE_ACCESS_KEY;
    const secretKey = process.env.BOKUN_NATIVE_SECRET_KEY;
    const baseUrl = 'https://api.bokun.io';
    
    if (!accessKey || !secretKey) {
      return NextResponse.json(
        { error: 'Missing Bokun Native API credentials' },
        { status: 500 }
      );
    }

    console.log('Using Bokun Native API for checkout...');

    // Step 1: Create booking request for checkout options
    const bookingRequest = {
      bookings: [
        {
          activityId: parseInt(bookingData.activityId),
          availabilityId: `${bookingData.startTimeId}_${formatDateForBokun(bookingData.date).replace(/-/g, '')}`,
          pricingCategoryBookings: [
            {
              pricingCategoryId: 1001055, // Adult category
              participantCount: bookingData.guests
            }
          ]
        }
      ],
      currency: "GBP",
      customer: {
        firstName: bookingData.customer.firstName,
        lastName: bookingData.customer.lastName,
        email: bookingData.customer.email,
        phoneNumber: bookingData.customer.phone,
        nationality: "GB",
        country: "GB"
      }
    };

    console.log('Booking request for checkout:', JSON.stringify(bookingRequest, null, 2));

    // Step 1: Get checkout options
    const utcDate = formatDateForBokunAuth();
    const checkoutOptionsPath = '/checkout.json/options/booking-request';
    const checkoutOptionsMethod = 'POST';
    
    const checkoutOptionsSignature = createHmacSignature(
      utcDate,
      accessKey,
      checkoutOptionsMethod,
      checkoutOptionsPath,
      secretKey
    );

    const checkoutOptionsHeaders = {
      'X-Bokun-Date': utcDate,
      'X-Bokun-AccessKey': accessKey,
      'X-Bokun-Signature': checkoutOptionsSignature,
      'Content-Type': 'application/json;charset=UTF-8'
    };

    console.log('=== CHECKOUT OPTIONS REQUEST ===');
    console.log('URL:', baseUrl + checkoutOptionsPath);
    console.log('Method:', checkoutOptionsMethod);
    console.log('Headers:', checkoutOptionsHeaders);
    console.log('Body:', JSON.stringify(bookingRequest, null, 2));

    const checkoutOptionsResponse = await fetch(baseUrl + checkoutOptionsPath, {
      method: checkoutOptionsMethod,
      headers: checkoutOptionsHeaders,
      body: JSON.stringify(bookingRequest)
    });

    const checkoutOptionsText = await checkoutOptionsResponse.text();
    console.log('=== CHECKOUT OPTIONS RESPONSE ===');
    console.log('Status:', checkoutOptionsResponse.status);
    console.log('Headers:', Object.fromEntries(checkoutOptionsResponse.headers.entries()));
    console.log('Body:', checkoutOptionsText);

    if (!checkoutOptionsResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get checkout options',
        details: checkoutOptionsText,
        status: checkoutOptionsResponse.status
      }, { status: 400 });
    }

    let checkoutOptions;
    try {
      checkoutOptions = JSON.parse(checkoutOptionsText);
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in checkout options response',
        details: checkoutOptionsText
      }, { status: 400 });
    }

    console.log('✅ Checkout options received:', JSON.stringify(checkoutOptions, null, 2));

    // For now, return the checkout options so we can see what's available
    // In the next step, we'll implement the actual checkout submission
    return NextResponse.json({
      success: true,
      step: 'checkout_options_received',
      message: 'Retrieved checkout options successfully',
      checkoutOptions: checkoutOptions,
      nextStep: 'Need to implement checkout submission with payment processing'
    });

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 