import { NextRequest, NextResponse } from 'next/server';
import { bokunGraphQL } from '@/lib/bokun-graphql';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing enhanced GraphQL query...');
    
    // Test the enhanced query directly
    const enhancedQuery = `
      query GetBookings($first: Int!) {
        bookings(first: $first) {
          totalCount
          edges {
            node {
              id
              confirmationCode
              status
              customer {
                id
                firstName
                lastName
                phoneNumber
                phone
                mobile
                emailAddress
                email
                contactDetails
              }
              payments {
                id
                amount
                currency
                paymentDate
                paymentMethod
                paymentType
              }
              bookingDate
              createdDate
              modifiedDate
              travelDate
              startDate
              endDate
              activity {
                id
                title
                name
              }
              product {
                id
                title
                name
              }
              participants
              participantCount
              guestCount
              totalGuests
              notes
              specialRequests
              language
              currency
            }
          }
        }
      }
    `;

    try {
      console.log('Trying enhanced query...');
      const result = await bokunGraphQL.query({
        query: enhancedQuery,
        variables: { first: 1 }
      });

      return NextResponse.json({
        success: true,
        message: '✅ Enhanced query worked!',
        result: result.data,
        queryUsed: 'enhanced'
      });

    } catch (enhancedError) {
      console.log('Enhanced query failed, testing field by field...');
      
      // Test individual field groups to see which ones cause errors
      const fieldTests = [
        {
          name: 'customer_extended',
          fields: `
            customer {
              id
              firstName
              lastName
              phoneNumber
              phone
              mobile
              emailAddress
              email
              contactDetails
            }
          `
        },
        {
          name: 'payments_extended',
          fields: `
            payments {
              id
              amount
              currency
              paymentDate
              paymentMethod
              paymentType
            }
          `
        },
        {
          name: 'dates',
          fields: `
            bookingDate
            createdDate
            modifiedDate
            travelDate
            startDate
            endDate
          `
        },
        {
          name: 'activity_product',
          fields: `
            activity {
              id
              title
              name
            }
            product {
              id
              title
              name
            }
          `
        },
        {
          name: 'participants',
          fields: `
            participants
            participantCount
            guestCount
            totalGuests
          `
        }
      ];

      const testResults = [];

      for (const test of fieldTests) {
        const testQuery = `
          query GetBookings($first: Int!) {
            bookings(first: $first) {
              edges {
                node {
                  id
                  confirmationCode
                  status
                  ${test.fields}
                }
              }
            }
          }
        `;

        try {
          await bokunGraphQL.query({
            query: testQuery,
            variables: { first: 1 }
          });
          testResults.push({
            test: test.name,
            status: 'success',
            fields: test.fields.trim()
          });
        } catch (testError) {
          testResults.push({
            test: test.name,
            status: 'failed',
            error: testError instanceof Error ? testError.message : String(testError),
            fields: test.fields.trim()
          });
        }
      }

      return NextResponse.json({
        success: false,
        message: '❌ Enhanced query failed',
        enhancedError: enhancedError instanceof Error ? enhancedError.message : String(enhancedError),
        fieldTests: testResults,
        queryUsed: 'field_by_field_testing'
      });
    }

  } catch (error) {
    console.error('❌ Test enhanced error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 