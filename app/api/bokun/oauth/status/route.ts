import { NextResponse } from 'next/server';
import { bokunGraphQL } from '@/lib/bokun-graphql';

export async function GET() {
  try {
    const status = await bokunGraphQL.checkOAuthStatus();
    
    return NextResponse.json({
      success: true,
      ...status,
      timestamp: new Date().toISOString(),
      nextSteps: status.isAuthenticated 
        ? ['OAuth is active', 'GraphQL API available', 'Real booking data accessible']
        : [
            'Install app in Bokun extranet',
            'Complete OAuth authorization',
            'Get access to real booking data'
          ]
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 