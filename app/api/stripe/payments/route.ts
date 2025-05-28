import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe not configured - missing STRIPE_SECRET_KEY' },
        { status: 400 }
      );
    }

    const stripe = require('stripe')(stripeSecretKey);

    console.log('💳 Fetching payments from Stripe...');
    
    // Get URL search params for filtering
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 100);
    const status = url.searchParams.get('status');
    
    // Fetch payment intents and checkout sessions
    const [paymentIntents, checkoutSessions] = await Promise.allSettled([
      stripe.paymentIntents.list({
        limit,
        expand: ['data.charges']
      }),
      stripe.checkout.sessions.list({
        limit,
        expand: ['data.payment_intent']
      })
    ]);

    let payments: any[] = [];
    let sessions: any[] = [];

    if (paymentIntents.status === 'fulfilled') {
      payments = paymentIntents.value.data;
    }

    if (checkoutSessions.status === 'fulfilled') {
      sessions = checkoutSessions.value.data;
    }

    // Transform checkout sessions to payment format
    const transformedPayments = sessions.map((session: any) => {
      const paymentIntent = session.payment_intent;
      
      return {
        id: session.id,
        paymentId: `PAY-${session.id.slice(-8)}`,
        bookingId: session.metadata?.booking_uuid || session.metadata?.booking_reference || 'Unknown',
        customerEmail: session.customer_details?.email || 'No email',
        customerName: session.customer_details?.name || 'Unknown Customer',
        amount: session.amount_total ? `£${(session.amount_total / 100).toFixed(2)}` : '£0.00',
        currency: session.currency?.toUpperCase() || 'GBP',
        status: session.payment_status || 'unknown',
        paymentMethod: paymentIntent?.charges?.data?.[0]?.payment_method_details?.type || 'card',
        createdAt: new Date(session.created * 1000).toISOString(),
        paidAt: session.payment_status === 'paid' ? new Date(session.created * 1000).toISOString() : null,
        description: `Indonesian Boats booking payment`,
        stripeCustomerId: session.customer,
        // Raw data for debugging
        _raw: {
          session,
          paymentIntent
        }
      };
    });

    // Calculate summary statistics
    const stats = {
      totalPayments: transformedPayments.length,
      successfulPayments: transformedPayments.filter(p => p.status === 'paid').length,
      pendingPayments: transformedPayments.filter(p => p.status === 'unpaid' || p.status === 'no_payment_required').length,
      failedPayments: transformedPayments.filter(p => p.status === 'failed').length,
      totalRevenue: transformedPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + parseFloat(p.amount.replace('£', '')), 0),
      averageTransactionValue: transformedPayments.length > 0 
        ? transformedPayments
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + parseFloat(p.amount.replace('£', '')), 0) / transformedPayments.filter(p => p.status === 'paid').length
        : 0
    };

    return NextResponse.json({
      success: true,
      data: transformedPayments,
      stats,
      source: 'Stripe API',
      message: `✅ Fetched ${transformedPayments.length} payments successfully`
    });

  } catch (error) {
    console.error('💥 Stripe payments fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch payment data', 
        details: error instanceof Error ? error.message : String(error),
        success: false
      },
      { status: 500 }
    );
  }
} 