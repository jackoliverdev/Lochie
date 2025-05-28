import { NextRequest, NextResponse } from 'next/server';
import { bokunGraphQL } from '@/lib/bokun-graphql';

interface TransformedBooking {
  id: string;
  bookingId: string;
  confirmationNumber: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  paymentStatus: string;
  amount: string;
  tripType: string;
  createdAt?: string;
  updatedAt?: string;
  _raw: any;
}

// Transform GraphQL booking data to our admin format
function transformGraphQLBooking(booking: any): TransformedBooking {
  const customer = booking.customer || {};
  const productBooking = booking.productBookings?.[0] || {};
  const payment = booking.payments?.[0] || {};
  
  return {
    id: booking.id,
    bookingId: `JAC-${booking.confirmationCode || booking.id?.slice(-6) || 'UNKNOWN'}`,
    confirmationNumber: booking.confirmationCode || 'TBC',
    customerName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown Customer',
    email: customer.email || 'No email provided',
    phone: customer.phoneNumber || 'No phone provided',
    date: productBooking.startDate || booking.createdAt?.split('T')[0] || 'TBC',
    time: productBooking.startTime || 'TBC',
    guests: productBooking.participants || 1,
    status: (booking.status || 'confirmed').toLowerCase().replace('_', ' '),
    paymentStatus: payment.status?.toLowerCase() === 'paid' || booking.status?.toLowerCase() === 'confirmed' ? 'paid' : 'pending',
    amount: booking.totalPrice?.amount ? `£${booking.totalPrice.amount.toFixed(2)}` : '£50.00',
    tripType: productBooking.product?.title || 'Full Day Charter',
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    _raw: booking
  };
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching Bokun bookings via GraphQL...');

    // Check OAuth status first
    const oauthStatus = await bokunGraphQL.checkOAuthStatus();
    console.log('OAuth Status:', oauthStatus);

    // Get URL search params for filtering
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');

    if (!oauthStatus.isAuthenticated) {
      // Return OAuth required response with instructions
      return NextResponse.json({
        success: false,
        data: [],
        stats: {
          total: 0,
          confirmed: 0,
          pending: 0,
          cancelled: 0,
          totalRevenue: 0
        },
        pagination: {
          total: 0,
          showing: 0,
          limit: limit
        },
        source: 'Bokun GraphQL API - OAuth Required',
        message: '🔐 OAuth authentication required for real Bokun booking data',
        oauthRequired: true,
        authStatus: oauthStatus,
        instructions: {
          step1: 'Install the Bokun app in your vendor account',
          step2: 'Visit the app store in your Bokun extranet',
          step3: 'Click Install for "Lochie Admin Dashboard"',
          step4: 'Complete the OAuth authorization flow',
          installUrl: `https://${oauthStatus.domain}.bokun.io/extranet/apps/new?app=lochie-admin-dashboard`
        }
      });
    }

    try {
      // Fetch real booking data via GraphQL
      console.log('🔍 Attempting to fetch bookings with GraphQL...');
      console.log('Parameters:', { limit, offset, dateFrom, dateTo });
      
      const graphqlResponse = await bokunGraphQL.getBookings({
        limit,
        offset,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
      });

      console.log('GraphQL Response received:', {
        hasData: !!graphqlResponse.data,
        hasBookings: !!graphqlResponse.data?.bookings,
        hasEdges: !!graphqlResponse.data?.bookings?.edges,
        edgesLength: graphqlResponse.data?.bookings?.edges?.length,
        totalCount: graphqlResponse.data?.bookings?.totalCount
      });

      if (!graphqlResponse.data?.bookings) {
        console.warn('⚠️ No bookings data in GraphQL response');
        // Return empty but successful response if no bookings exist
        return NextResponse.json({
          success: true,
          data: [],
          stats: { total: 0, confirmed: 0, pending: 0, cancelled: 0, totalRevenue: 0 },
          pagination: { total: 0, showing: 0, limit, offset, hasNextPage: false },
          source: 'Bokun GraphQL API',
          message: '✅ Connected successfully - No bookings found in system',
          authStatus: oauthStatus,
          debug: {
            graphqlResponse: graphqlResponse,
            note: 'No bookings.edges found - this might be normal if no bookings exist'
          }
        });
      }

      // Handle case where bookings exist but edges is empty or undefined
      const edges = graphqlResponse.data.bookings.edges || [];
      const totalCount = graphqlResponse.data.bookings.totalCount || 0;

      // Transform GraphQL data to our admin format
      const bookings = edges.map((edge: any) => 
        transformGraphQLBooking(edge.node)
      );

      // Calculate summary statistics
      const stats = {
        total: totalCount,
        confirmed: bookings.filter((b: TransformedBooking) => b.status === 'confirmed').length,
        pending: bookings.filter((b: TransformedBooking) => b.status === 'pending' || b.status === 'on hold').length,
        cancelled: bookings.filter((b: TransformedBooking) => b.status === 'cancelled').length,
        totalRevenue: bookings
          .filter((b: TransformedBooking) => b.paymentStatus === 'paid')
          .reduce((sum: number, b: TransformedBooking) => sum + parseFloat(b.amount.replace('£', '')), 0)
      };

      console.log(`✅ Fetched ${bookings.length} bookings from Bokun GraphQL (total: ${totalCount})`);

      return NextResponse.json({
        success: true,
        data: bookings,
        stats,
        pagination: {
          total: totalCount,
          showing: bookings.length,
          limit: limit,
          offset: offset,
          hasNextPage: graphqlResponse.data.bookings.pageInfo?.hasNextPage || false
        },
        source: 'Bokun GraphQL API',
        message: `✅ Fetched ${bookings.length} bookings successfully (${totalCount} total)`,
        authStatus: oauthStatus,
        apiInfo: {
          endpoint: `https://${oauthStatus.domain}.bokun.io/api/graphql`,
          method: 'GraphQL with OAuth',
          scopes: oauthStatus.scopes,
          filters: { limit, offset, dateFrom, dateTo }
        }
      });

    } catch (graphqlError) {
      console.error('❌ GraphQL error:', graphqlError);
      
      // If GraphQL fails, return helpful error info
      return NextResponse.json({
        success: false,
        data: [],
        stats: { total: 0, confirmed: 0, pending: 0, cancelled: 0, totalRevenue: 0 },
        source: 'Bokun GraphQL API - Error',
        message: '❌ Failed to fetch booking data from Bokun',
        error: graphqlError instanceof Error ? graphqlError.message : String(graphqlError),
        authStatus: oauthStatus,
        troubleshooting: {
          possibleCauses: [
            'OAuth token may have expired',
            'Insufficient permissions (check scopes)',
            'GraphQL schema may have changed',
            'Network connectivity issues'
          ],
          solutions: [
            'Re-authorize the app in Bokun',
            'Check OAuth scopes include BOOKINGS_READ',
            'Contact Bokun support if issues persist'
          ]
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('💥 Bokun bookings API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error),
        source: 'Bokun Booking API',
        success: false
      },
      { status: 500 }
    );
  }
} 