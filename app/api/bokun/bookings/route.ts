import { NextRequest, NextResponse } from 'next/server';
import { bokunGraphQL } from '@/lib/bokun-graphql';
import crypto from 'crypto';

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

// Enhanced function to fetch detailed booking info via REST API with HMAC authentication
async function fetchDetailedBookingInfo(confirmationCode: string, domain: string) {
  try {
    const ACCESS_KEY = process.env.BOKUN_NATIVE_ACCESS_KEY;
    const SECRET_KEY = process.env.BOKUN_NATIVE_SECRET_KEY;
    
    if (!ACCESS_KEY || !SECRET_KEY) {
      console.warn('⚠️ Missing native Bokun API credentials for enhanced booking data');
      return null;
    }

    // Create date in the required format: "yyyy-MM-dd HH:mm:ss"
    const now = new Date();
    const utcDate = now.getUTCFullYear() + '-' + 
                    String(now.getUTCMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getUTCDate()).padStart(2, '0') + ' ' +
                    String(now.getUTCHours()).padStart(2, '0') + ':' + 
                    String(now.getUTCMinutes()).padStart(2, '0') + ':' + 
                    String(now.getUTCSeconds()).padStart(2, '0');

    // Build the API path for booking details
    const path = `/booking.json/${confirmationCode}`;
    const httpMethod = 'GET';

    // Create HMAC signature
    const stringToSign = utcDate + ACCESS_KEY + httpMethod + path;
    const signature = crypto
      .createHmac('sha1', SECRET_KEY)
      .update(stringToSign)
      .digest('base64');

    // Set up headers for native Bokun API
    const headers = {
      'X-Bokun-Date': utcDate,
      'X-Bokun-AccessKey': ACCESS_KEY,
      'X-Bokun-Signature': signature,
      'Content-Type': 'application/json;charset=UTF-8'
    };

    const restApiUrl = `https://api.bokun.io${path}`;
    console.log(`🔍 Fetching detailed booking via HMAC: ${restApiUrl}`);
    
    const response = await fetch(restApiUrl, {
      method: httpMethod,
      headers
    });

    if (!response.ok) {
      console.warn(`⚠️ HMAC REST API call failed for booking ${confirmationCode}: ${response.status}`);
      return null;
    }

    const detailedBooking = await response.json();
    console.log(`✅ Enhanced booking data received for ${confirmationCode}`);
    return detailedBooking;
  } catch (error) {
    console.warn(`⚠️ Failed to fetch detailed info for booking ${confirmationCode}:`, error);
    return null;
  }
}

// Transform GraphQL booking data enhanced with any available fields
function transformEnhancedBooking(graphqlBooking: any, restApiBooking: any = null): TransformedBooking {
  const customer = graphqlBooking.customer || {};
  const payment = graphqlBooking.payments?.[0] || {};
  const activity = graphqlBooking.activity || graphqlBooking.product || {};
  
  // Use REST API data if available, fallback to GraphQL data
  const restCustomer = restApiBooking?.customer || {};
  const restActivityBooking = restApiBooking?.activityBookings?.[0] || {};
  const restProduct = restActivityBooking?.activity || {};
  
  // Extract email from multiple possible GraphQL fields
  const email = customer.email || customer.emailAddress || restCustomer.email || 'Email not available';
  
  // Extract phone from multiple possible GraphQL fields
  const phone = customer.phoneNumber || customer.phone || customer.mobile || restCustomer.phoneNumber || 'No phone provided';
  
  // Extract dates from multiple possible GraphQL fields
  const date = graphqlBooking.travelDate || graphqlBooking.startDate || graphqlBooking.bookingDate || 
               restActivityBooking.startDate || 'Date TBC';
  
  // Extract product/activity name
  const tripType = activity.title || activity.name || restProduct.title || 'Full Day Charter';
  
  // Extract participant count from multiple possible fields
  const guests = graphqlBooking.totalGuests || graphqlBooking.participantCount || 
                 graphqlBooking.guestCount || restActivityBooking.participants || 1;
  
  // Extract payment amount with currency
  const paymentAmount = payment.amount;
  const currency = payment.currency || graphqlBooking.currency || 'GBP';
  const amount = paymentAmount ? 
    `${currency === 'GBP' ? '£' : currency + ' '}${parseFloat(paymentAmount).toFixed(2)}` : 
    restApiBooking?.totalPrice ? `£${parseFloat(restApiBooking.totalPrice).toFixed(2)}` : '£50.00';
  
  return {
    id: graphqlBooking.id || 'unknown',
    bookingId: `JAC-${graphqlBooking.confirmationCode || graphqlBooking.id?.slice(-6) || 'UNKNOWN'}`,
    confirmationNumber: graphqlBooking.confirmationCode || 'TBC',
    customerName: `${customer.firstName || restCustomer.firstName || ''} ${customer.lastName || restCustomer.lastName || ''}`.trim() || 'Unknown Customer',
    email,
    phone,
    date,
    time: 'Time TBC', // GraphQL doesn't seem to have time fields
    guests,
    status: (graphqlBooking.status || restApiBooking?.status || 'confirmed').toLowerCase().replace('_', ' '),
    paymentStatus: paymentAmount || restApiBooking?.paidAmount ? 'paid' : 'pending',
    amount,
    tripType,
    createdAt: graphqlBooking.createdDate || graphqlBooking.modifiedDate || restApiBooking?.created,
    updatedAt: graphqlBooking.modifiedDate || restApiBooking?.lastModified,
    _raw: {
      graphql: graphqlBooking,
      restApi: restApiBooking,
      extractedFields: {
        hasEmail: !!customer.email || !!customer.emailAddress,
        hasPhone: !!customer.phoneNumber || !!customer.phone || !!customer.mobile,
        hasDate: !!graphqlBooking.travelDate || !!graphqlBooking.startDate || !!graphqlBooking.bookingDate,
        hasActivity: !!activity.title || !!activity.name,
        hasGuests: !!graphqlBooking.totalGuests || !!graphqlBooking.participantCount || !!graphqlBooking.guestCount,
        hasCurrency: !!payment.currency || !!graphqlBooking.currency
      }
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
        
        // Fetch detailed info for each booking
        const enhancementPromises = edges.map(async (edge: any) => {
          const graphqlBooking = edge.node;
          const confirmationCode = graphqlBooking.confirmationCode;
          
          if (!confirmationCode) {
            return transformEnhancedBooking(graphqlBooking);
          }

          const detailedBooking = await fetchDetailedBookingInfo(
            confirmationCode, 
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