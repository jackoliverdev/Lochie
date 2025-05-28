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

// Enhanced function to fetch detailed booking info via REST API
async function fetchDetailedBookingInfo(confirmationCode: string, accessToken: string, domain: string) {
  try {
    const restApiUrl = `https://${domain}.bokun.io/booking.json/${confirmationCode}`;
    
    const response = await fetch(restApiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn(`⚠️ REST API call failed for booking ${confirmationCode}: ${response.status}`);
      return null;
    }

    const detailedBooking = await response.json();
    return detailedBooking;
  } catch (error) {
    console.warn(`⚠️ Failed to fetch detailed info for booking ${confirmationCode}:`, error);
    return null;
  }
}

// Transform GraphQL booking data enhanced with REST API details
function transformEnhancedBooking(graphqlBooking: any, restApiBooking: any = null): TransformedBooking {
  const customer = graphqlBooking.customer || {};
  const payment = graphqlBooking.payments?.[0] || {};
  
  // Use REST API data if available, fallback to GraphQL data
  const restCustomer = restApiBooking?.customer || {};
  const restActivityBooking = restApiBooking?.activityBookings?.[0] || {};
  const restProduct = restActivityBooking?.activity || {};
  
  return {
    id: graphqlBooking.id || 'unknown',
    bookingId: `JAC-${graphqlBooking.confirmationCode || graphqlBooking.id?.slice(-6) || 'UNKNOWN'}`,
    confirmationNumber: graphqlBooking.confirmationCode || 'TBC',
    customerName: `${customer.firstName || restCustomer.firstName || ''} ${customer.lastName || restCustomer.lastName || ''}`.trim() || 'Unknown Customer',
    email: restCustomer.email || 'Email not available', // REST API should have email
    phone: customer.phoneNumber || restCustomer.phoneNumber || 'No phone provided',
    date: restActivityBooking.startDate || 'Date TBC', // REST API should have dates
    time: restActivityBooking.startTime || 'Time TBC', // REST API should have times
    guests: restActivityBooking.participants || 1, // REST API should have participant count
    status: (graphqlBooking.status || restApiBooking?.status || 'confirmed').toLowerCase().replace('_', ' '),
    paymentStatus: payment.amount || restApiBooking?.paidAmount ? 'paid' : 'pending',
    amount: payment.amount ? `£${parseFloat(payment.amount).toFixed(2)}` : 
            restApiBooking?.totalPrice ? `£${parseFloat(restApiBooking.totalPrice).toFixed(2)}` : '£50.00',
    tripType: restProduct.title || 'Full Day Charter', // REST API should have product title
    createdAt: restApiBooking?.created || graphqlBooking.createdAt,
    updatedAt: restApiBooking?.lastModified || graphqlBooking.updatedAt,
    _raw: {
      graphql: graphqlBooking,
      restApi: restApiBooking
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching Bokun bookings via hybrid GraphQL + REST approach...');

    // Check OAuth status first
    const oauthStatus = await bokunGraphQL.checkOAuthStatus();
    console.log('OAuth Status:', oauthStatus);

    // Get URL search params for filtering
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10'); // Reduce default for REST API calls
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const enhanced = url.searchParams.get('enhanced') !== 'false'; // Enable enhancement by default

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
        source: 'Bokun Hybrid API - OAuth Required',
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
      // Step 1: Fetch basic booking data via GraphQL
      console.log('🔍 Step 1: Fetching bookings list with GraphQL...');
      console.log('Parameters:', { limit, offset, dateFrom, dateTo, enhanced });
      
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
        return NextResponse.json({
          success: true,
          data: [],
          stats: { total: 0, confirmed: 0, pending: 0, cancelled: 0, totalRevenue: 0 },
          pagination: { total: 0, showing: 0, limit, offset, hasNextPage: false },
          source: 'Bokun Hybrid API',
          message: '✅ Connected successfully - No bookings found in system',
          authStatus: oauthStatus
        });
      }

      const edges = graphqlResponse.data.bookings.edges || [];
      const totalCount = graphqlResponse.data.bookings.totalCount || 0;

      // Step 2: Enhanced mode - fetch detailed info for each booking via REST API
      let bookings: TransformedBooking[] = [];
      
      if (enhanced && edges.length > 0) {
        console.log('🔍 Step 2: Enhancing with REST API calls for detailed booking info...');
        
        // Get access token for REST API calls
        const accessToken = process.env.BOKUN_ACCESS_TOKEN;
        if (!accessToken) {
          throw new Error('Access token not available for REST API calls');
        }

        // Fetch detailed info for each booking
        const enhancementPromises = edges.map(async (edge: any) => {
          const graphqlBooking = edge.node;
          const confirmationCode = graphqlBooking.confirmationCode;
          
          if (!confirmationCode) {
            return transformEnhancedBooking(graphqlBooking);
          }

          const detailedBooking = await fetchDetailedBookingInfo(
            confirmationCode, 
            accessToken, 
            oauthStatus.domain
          );

          return transformEnhancedBooking(graphqlBooking, detailedBooking);
        });

        bookings = await Promise.all(enhancementPromises);
        console.log(`✅ Enhanced ${bookings.length} bookings with REST API data`);
      } else {
        // Basic mode - use only GraphQL data
        console.log('📝 Using basic GraphQL data only...');
        bookings = edges.map((edge: any) => transformEnhancedBooking(edge.node));
      }

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

      console.log(`✅ Fetched ${bookings.length} bookings from Bokun Hybrid API (total: ${totalCount})`);

      return NextResponse.json({
        success: true,
        data: bookings,
        stats,
        pagination: {
          total: totalCount,
          showing: bookings.length,
          limit: limit,
          offset: offset,
          hasNextPage: false
        },
        source: enhanced ? 'Bokun Hybrid API (GraphQL + REST)' : 'Bokun GraphQL API',
        message: enhanced 
          ? `✅ Enhanced booking data retrieved! GraphQL list + REST API details for ${bookings.length} bookings.`
          : `✅ Basic booking data retrieved via GraphQL for ${bookings.length} bookings.`,
        authStatus: oauthStatus,
        apiInfo: {
          graphqlEndpoint: `https://${oauthStatus.domain}.bokun.io/api/graphql`,
          restApiEndpoint: `https://${oauthStatus.domain}.bokun.io/booking.json/`,
          method: enhanced ? 'Hybrid (GraphQL + REST)' : 'GraphQL only',
          scopes: oauthStatus.scopes,
          filters: { limit, offset, dateFrom, dateTo, enhanced },
          enhancementNote: enhanced 
            ? 'Using REST API calls to get complete booking details (emails, dates, products, etc.)'
            : 'Add ?enhanced=true to get complete booking details via REST API'
        }
      });

    } catch (graphqlError) {
      console.error('❌ Hybrid API error:', graphqlError);
      
      return NextResponse.json({
        success: false,
        data: [],
        stats: { total: 0, confirmed: 0, pending: 0, cancelled: 0, totalRevenue: 0 },
        source: 'Bokun Hybrid API - Error',
        message: '❌ Failed to fetch booking data from Bokun',
        error: graphqlError instanceof Error ? graphqlError.message : String(graphqlError),
        authStatus: oauthStatus,
        troubleshooting: {
          possibleCauses: [
            'OAuth token may have expired',
            'Insufficient permissions (check scopes)',
            'GraphQL or REST API connectivity issues',
            'Rate limiting on API calls'
          ],
          solutions: [
            'Re-authorize the app in Bokun',
            'Check OAuth scopes include BOOKINGS_READ',
            'Try with ?enhanced=false for GraphQL-only mode',
            'Contact Bokun support if issues persist'
          ]
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('💥 Bokun hybrid API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error),
        source: 'Bokun Hybrid API',
        success: false
      },
      { status: 500 }
    );
  }
} 