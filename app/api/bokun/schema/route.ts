import { NextResponse } from 'next/server';
import { bokunGraphQL } from '@/lib/bokun-graphql';

export async function GET() {
  try {
    console.log('🔍 Introspecting Bokun GraphQL schema...');
    
    // Check OAuth status
    const oauthStatus = await bokunGraphQL.checkOAuthStatus();
    if (!oauthStatus.isAuthenticated) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      });
    }

    // Introspection query to discover schema
    const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          queryType { name }
          mutationType { name }
          subscriptionType { name }
          types {
            ...FullType
          }
        }
      }

      fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
          name
          description
          args {
            ...InputValue
          }
          type {
            ...TypeRef
          }
          isDeprecated
          deprecationReason
        }
        inputFields {
          ...InputValue
        }
        interfaces {
          ...TypeRef
        }
        enumValues(includeDeprecated: true) {
          name
          description
          isDeprecated
          deprecationReason
        }
        possibleTypes {
          ...TypeRef
        }
      }

      fragment InputValue on __InputValue {
        name
        description
        type { ...TypeRef }
        defaultValue
      }

      fragment TypeRef on __Type {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await bokunGraphQL.query({ query: introspectionQuery });
    
    if (!result.data?.__schema) {
      throw new Error('No schema data returned');
    }

    // Extract relevant types for bookings
    const schema = result.data.__schema;
    const types = schema.types;
    
    // Find Booking-related types
    const bookingType = types.find((t: any) => t.name === 'Booking');
    const customerType = types.find((t: any) => t.name === 'Customer');
    const queryType = types.find((t: any) => t.name === schema.queryType.name);
    
    // Find the bookings query field
    const bookingsField = queryType?.fields?.find((f: any) => f.name === 'bookings');

    return NextResponse.json({
      success: true,
      schema: {
        queryType: schema.queryType,
        bookingType: {
          name: bookingType?.name,
          fields: bookingType?.fields?.map((f: any) => ({
            name: f.name,
            type: f.type,
            description: f.description
          }))
        },
        customerType: {
          name: customerType?.name,
          fields: customerType?.fields?.map((f: any) => ({
            name: f.name,
            type: f.type,
            description: f.description
          }))
        },
        bookingsQueryField: {
          name: bookingsField?.name,
          args: bookingsField?.args?.map((a: any) => ({
            name: a.name,
            type: a.type,
            description: a.description,
            defaultValue: a.defaultValue
          })),
          type: bookingsField?.type,
          description: bookingsField?.description
        }
      },
      // Also include some other useful types
      otherTypes: types
        .filter((t: any) => t.name?.toLowerCase().includes('booking') || 
                           t.name?.toLowerCase().includes('customer') ||
                           t.name?.toLowerCase().includes('payment'))
        .map((t: any) => ({
          name: t.name,
          kind: t.kind,
          fields: t.fields?.slice(0, 10)?.map((f: any) => f.name) // Just field names for brevity
        }))
    });

  } catch (error) {
    console.error('❌ Schema introspection failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 