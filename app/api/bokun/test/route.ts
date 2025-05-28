import { NextRequest, NextResponse } from 'next/server';
import { bokunGraphQL } from '@/lib/bokun-graphql';

const BOKUN_BASE_URL = 'https://api.bokun.io/octo/v1';
const OCTO_TOKEN = '0cbcf99785cd4ea593c1ab9168f0b63a';

export async function GET() {
  try {
    console.log('🧪 Starting Bokun GraphQL debug test...');
    
    // Check OAuth status
    const oauthStatus = await bokunGraphQL.checkOAuthStatus();
    console.log('OAuth Status:', oauthStatus);

    if (!oauthStatus.isAuthenticated) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated',
        oauthStatus
      });
    }

    // Test basic GraphQL connection
    let connectionTest;
    try {
      connectionTest = await bokunGraphQL.testConnection();
    } catch (error) {
      return NextResponse.json({
        success: false,
        step: 'connection_test',
        error: error instanceof Error ? error.message : String(error),
        oauthStatus
      });
    }

    // Test simple booking query
    let simpleBookingTest;
    try {
      const simpleQuery = `
        query {
          bookings {
            totalCount
          }
        }
      `;
      simpleBookingTest = await bokunGraphQL.query({ query: simpleQuery });
    } catch (error) {
      return NextResponse.json({
        success: false,
        step: 'simple_booking_query',
        error: error instanceof Error ? error.message : String(error),
        connectionTest,
        oauthStatus
      });
    }

    // Test more complex booking query
    let complexBookingTest;
    try {
      complexBookingTest = await bokunGraphQL.getBookings({ limit: 5 });
    } catch (error) {
      return NextResponse.json({
        success: false,
        step: 'complex_booking_query',
        error: error instanceof Error ? error.message : String(error),
        connectionTest,
        simpleBookingTest,
        oauthStatus
      });
    }

    return NextResponse.json({
      success: true,
      message: 'All tests passed!',
      tests: {
        oauthStatus,
        connectionTest: !!connectionTest.data,
        simpleBookingTest,
        complexBookingTest
      }
    });

  } catch (error) {
    console.error('💥 Debug test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Debug test failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 