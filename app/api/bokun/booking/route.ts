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
    
    console.log('🎯 Received booking request:', JSON.stringify(bookingData, null, 2));

    const octoToken = process.env.OCTO_TOKEN;
    const baseUrl = 'https://api.bokun.io';
    
    if (!octoToken) {
      return NextResponse.json(
        { error: 'Missing OCTO API credentials' },
        { status: 500 }
      );
    }

    console.log('🚀 Using OCTO API for checkout flow...');

    // Step 1: Create booking reservation (ON_HOLD) 
    const bookingReservationRequest = {
      productId: bookingData.activityId,
      optionId: "2017520", // Your option ID
      availabilityId: `${formatDateForBokun(bookingData.date)}_${bookingData.startTimeId}`,
      unitItems: Array.from({ length: bookingData.guests }, (_, index) => ({
        unitId: "1001055" // Adult pricing category
      })),
      expirationMinutes: 30,
      notes: `Website booking for ${bookingData.guests} guest(s)`
    };

    console.log('📋 Creating OCTO booking reservation...');
    console.log('Request:', JSON.stringify(bookingReservationRequest, null, 2));

    const reservationResponse = await fetch(`${baseUrl}/octo/v1/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${octoToken}`,
        'Content-Type': 'application/json',
        'Octo-Capabilities': 'pricing'
      },
      body: JSON.stringify(bookingReservationRequest)
    });

    if (!reservationResponse.ok) {
      const errorText = await reservationResponse.text();
      console.error('❌ Reservation failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to create booking reservation', details: errorText },
        { status: reservationResponse.status }
      );
    }

    const reservationData = await reservationResponse.json();
    console.log('✅ Reservation created:', JSON.stringify(reservationData, null, 2));

    // Step 2: Confirm booking with contact details
    const confirmationRequest = {
      resellerReference: `WEB-${Date.now()}`,
      contact: {
        fullName: `${bookingData.customer.firstName} ${bookingData.customer.lastName}`,
        firstName: bookingData.customer.firstName,
        lastName: bookingData.customer.lastName,
        emailAddress: bookingData.customer.email,
        phoneNumber: bookingData.customer.phone,
        country: "GB"
      },
      unitItems: bookingData.guestDetails.map((guest, index) => ({
        unitId: "1001055",
        contact: {
          fullName: `${guest.firstName} ${guest.lastName}`,
          firstName: guest.firstName,
          lastName: guest.lastName,
          emailAddress: guest.email,
          phoneNumber: guest.phone,
          country: "GB"
        }
      })),
      emailReceipt: true
    };

    console.log('📧 Confirming OCTO booking...');
    console.log('Request:', JSON.stringify(confirmationRequest, null, 2));

    const confirmationResponse = await fetch(`${baseUrl}/octo/v1/bookings/${reservationData.uuid}/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${octoToken}`,
        'Content-Type': 'application/json',
        'Octo-Capabilities': 'pricing'
      },
      body: JSON.stringify(confirmationRequest)
    });

    if (!confirmationResponse.ok) {
      const errorText = await confirmationResponse.text();
      console.error('❌ Confirmation failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to confirm booking', details: errorText },
        { status: confirmationResponse.status }
      );
    }

    const confirmedBooking = await confirmationResponse.json();
    console.log('🎉 Booking confirmed successfully!');
    console.log('Final booking:', JSON.stringify(confirmedBooking, null, 2));

    // Now create Stripe payment session for the booking (if configured)
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      console.log('⚠️ No Stripe secret key configured, returning booking without payment');
      return NextResponse.json({
        success: true,
        step: "booking_confirmed_no_payment",
        message: "Booking confirmed successfully (Stripe not configured)",
        booking: confirmedBooking,
        next_step: "Configure STRIPE_SECRET_KEY in .env to enable payment processing"
      });
    }

    const stripe = require('stripe')(stripeSecretKey);

    // Create Stripe checkout session
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Indonesian Boats Experience - ${bookingData.guests} guests`,
            description: `Booking for ${formatDateForBokun(bookingData.date)} at ${bookingData.startTimeId}`
          },
          unit_amount: Math.round(bookingData.totalPrice * 100) // Convert to pence
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${confirmedBooking.uuid}`,
      cancel_url: `${origin}/booking-cancelled?booking_id=${confirmedBooking.uuid}`,
      metadata: {
        booking_uuid: confirmedBooking.uuid,
        booking_reference: confirmedBooking.supplierReference
      }
    });

    console.log('💳 Stripe checkout session created:', checkoutSession.id);

    return NextResponse.json({
      success: true,
      step: "payment_required",
      message: "Booking created successfully, payment required",
      booking: confirmedBooking,
      checkout_url: checkoutSession.url,
      session_id: checkoutSession.id
    });

  } catch (error) {
    console.error('💥 Booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 