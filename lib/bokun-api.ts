// Bokun API Integration
const BOKUN_BASE_URL = 'https://api.bokun.io';
const ACCESS_KEY = '1249959917e94e92a4c4bde70f624a44';
const SECRET_KEY = 'ee1720dd9371470db5af5fa08e0f09b8';

// Create basic auth header
const createAuthHeader = () => {
  const credentials = btoa(`${ACCESS_KEY}:${SECRET_KEY}`);
  return `Basic ${credentials}`;
};

// Generic API request function
async function bokunRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${BOKUN_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': createAuthHeader(),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Bokun API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export interface AvailabilityRequest {
  experienceId: string;
  date: string; // YYYY-MM-DD format
  currency?: string;
}

export interface BookingRequest {
  experienceId: string;
  date: string;
  startTime: string;
  adults: number;
  children?: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

// Check availability for a specific experience and date
export async function checkAvailability(request: AvailabilityRequest) {
  try {
    const endpoint = `/experience/${request.experienceId}/availability/${request.date}`;
    return await bokunRequest(endpoint);
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
}

// Get experience details
export async function getExperience(experienceId: string) {
  try {
    const endpoint = `/experience/${experienceId}`;
    return await bokunRequest(endpoint);
  } catch (error) {
    console.error('Error getting experience:', error);
    throw error;
  }
}

// Create a new booking
export async function createBooking(request: BookingRequest) {
  try {
    const endpoint = '/booking';
    return await bokunRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// Get booking details
export async function getBooking(bookingId: string) {
  try {
    const endpoint = `/booking/${bookingId}`;
    return await bokunRequest(endpoint);
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
}

// Your experience ID from the widget
export const BOAT_CHARTER_ID = '1031959';

// Example usage:
export async function getBoatCharterAvailability(date: string) {
  return checkAvailability({
    experienceId: BOAT_CHARTER_ID,
    date: date,
    currency: 'GBP'
  });
} 