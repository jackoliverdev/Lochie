import fs from 'fs/promises';
import path from 'path';

interface BokunTokenData {
  access_token: string;
  scope: string;
  vendor_id: string;
  stored_at: string;
}

interface GraphQLQuery {
  query: string;
  variables?: Record<string, any>;
}

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

class BokunGraphQLClient {
  private domain: string;
  private accessToken: string | null = null;

  constructor(domain: string = 'jackoliverdev') {
    this.domain = domain;
  }

  // Load access token from storage
  private async loadAccessToken(): Promise<string | null> {
    try {
      // First try environment variable (for production/Vercel)
      const envToken = process.env.BOKUN_ACCESS_TOKEN;
      if (envToken) {
        console.log('✅ Access token loaded from environment variable');
        return envToken;
      }

      // Fallback to file storage (for development)
      const tokenPath = path.join(process.cwd(), '.bokun-tokens.json');
      const tokensContent = await fs.readFile(tokenPath, 'utf-8');
      const tokens = JSON.parse(tokensContent);
      
      const tokenData: BokunTokenData = tokens[this.domain];
      if (!tokenData?.access_token) {
        console.warn('⚠️ No access token found for domain:', this.domain);
        return null;
      }

      console.log('✅ Access token loaded from file storage');
      return tokenData.access_token;
    } catch (error) {
      console.error('❌ Failed to load access token:', error);
      return null;
    }
  }

  // Make authenticated GraphQL request
  async query<T = any>(queryData: GraphQLQuery): Promise<GraphQLResponse<T>> {
    try {
      // Load access token if not cached
      if (!this.accessToken) {
        this.accessToken = await this.loadAccessToken();
        if (!this.accessToken) {
          throw new Error('No access token available. Please complete OAuth flow.');
        }
      }

      const graphqlUrl = `https://${this.domain}.bokun.io/api/graphql`;
      
      console.log('🔍 Making GraphQL request to:', graphqlUrl);
      console.log('📝 Query:', queryData.query.substring(0, 200) + '...');

      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bokun-App-Access-Token': this.accessToken
        },
        body: JSON.stringify(queryData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ GraphQL request failed:', response.status, errorText);
        throw new Error(`GraphQL request failed: ${response.status} ${errorText}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        console.error('❌ GraphQL errors:', result.errors);
        throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`);
      }

      console.log('✅ GraphQL request successful');
      return result;

    } catch (error) {
      console.error('💥 GraphQL client error:', error);
      throw error;
    }
  }

  // Get bookings with GraphQL
  async getBookings(options: {
    limit?: number;
    offset?: number;
    dateFrom?: string;
    dateTo?: string;
  } = {}) {
    const { limit = 20, offset = 0, dateFrom, dateTo } = options;

    const query = `
      query GetBookings($limit: Int, $offset: Int, $dateFrom: String, $dateTo: String) {
        bookings(
          first: $limit
          skip: $offset
          where: {
            ${dateFrom ? `createdAt_gte: "${dateFrom}"` : ''}
            ${dateTo ? `createdAt_lte: "${dateTo}"` : ''}
          }
        ) {
          edges {
            node {
              id
              confirmationCode
              status
              totalPrice {
                amount
                currency
              }
              createdAt
              updatedAt
              customer {
                id
                firstName
                lastName
                email
                phoneNumber
              }
              productBookings {
                id
                product {
                  id
                  title
                }
                startDate
                startTime
                participants
              }
              payments {
                id
                amount {
                  amount
                  currency
                }
                status
                type
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `;

    return this.query({
      query,
      variables: { limit, offset, dateFrom, dateTo }
    });
  }

  // Get customers with GraphQL
  async getCustomers(options: {
    limit?: number;
    offset?: number;
  } = {}) {
    const { limit = 20, offset = 0 } = options;

    const query = `
      query GetCustomers($limit: Int, $offset: Int) {
        customers(first: $limit, skip: $offset) {
          edges {
            node {
              id
              firstName
              lastName
              email
              phoneNumber
              createdAt
              bookings {
                totalCount
              }
            }
          }
        }
      }
    `;

    return this.query({
      query,
      variables: { limit, offset }
    });
  }

  // Check OAuth status
  async checkOAuthStatus(): Promise<{
    isAuthenticated: boolean;
    scopes?: string;
    vendorId?: string;
    domain: string;
  }> {
    try {
      // First check environment variables (for production)
      const envToken = process.env.BOKUN_ACCESS_TOKEN;
      const envVendorId = process.env.BOKUN_VENDOR_ID;
      const envScopes = process.env.BOKUN_OAUTH_SCOPES;
      
      if (envToken) {
        return {
          isAuthenticated: true,
          scopes: envScopes || 'BOOKINGS_READ,CUSTOMERS_READ,CHECKOUTS_READ,PRODUCTS_READ',
          vendorId: envVendorId || 'VmVuZG9yVHlwZToxMjA1OTE',
          domain: this.domain
        };
      }

      // Fallback to file storage (for development)
      const tokenPath = path.join(process.cwd(), '.bokun-tokens.json');
      const tokensContent = await fs.readFile(tokenPath, 'utf-8');
      const tokens = JSON.parse(tokensContent);
      
      const tokenData: BokunTokenData = tokens[this.domain];
      
      return {
        isAuthenticated: !!tokenData?.access_token,
        scopes: tokenData?.scope,
        vendorId: tokenData?.vendor_id,
        domain: this.domain
      };
    } catch {
      return {
        isAuthenticated: false,
        domain: this.domain
      };
    }
  }
}

// Export singleton instance
export const bokunGraphQL = new BokunGraphQLClient();
export { BokunGraphQLClient }; 