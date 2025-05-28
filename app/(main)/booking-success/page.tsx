'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, MapPin, CalendarIcon, Clock, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BookingData {
  booking: any;
  bookingData: any;
  selectedDate: string;
  selectedSlot: any;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking data from session storage
    const pendingBooking = sessionStorage.getItem('pendingBooking');
    if (pendingBooking) {
      try {
        const data = JSON.parse(pendingBooking);
        setBookingData(data);
        // Clear the stored data
        sessionStorage.removeItem('pendingBooking');
      } catch (error) {
        console.error('Error parsing pending booking:', error);
      }
    }
    setLoading(false);
  }, []);

  const sessionId = searchParams?.get('session_id');
  const bookingId = searchParams?.get('booking_id');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your booking information. Please contact us if you need assistance.</p>
          <Link href="/booking">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to Booking
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedDate = new Date(bookingData.selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Your Indonesian Boats experience has been confirmed
          </p>
          <p className="text-lg text-gray-500">
            A confirmation email has been sent to {bookingData.bookingData.customer.email}
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
          
          {/* Booking Reference */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-blue-600 font-medium">Booking Reference</div>
                <div className="text-lg font-bold text-blue-900">{bookingData.booking.supplierReference}</div>
              </div>
              <div>
                <div className="text-sm text-blue-600 font-medium">Booking ID</div>
                <div className="text-lg font-bold text-blue-900">{bookingData.booking.uuid}</div>
              </div>
              <div>
                <div className="text-sm text-blue-600 font-medium">Status</div>
                <div className="text-lg font-bold text-green-600">{bookingData.booking.status}</div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Date</div>
                      <div className="text-gray-600">{selectedDate.toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <div className="font-medium">Time</div>
                      <div className="text-gray-600">{bookingData.selectedSlot.startTime} (8 hours duration)</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Guests</div>
                      <div className="text-gray-600">{bookingData.bookingData.guests} people</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-gray-600">Gili Trawangan, Lombok</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Details</h3>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="space-y-2">
                    <div><strong>Lead Guest:</strong> {bookingData.bookingData.customer.firstName} {bookingData.bookingData.customer.lastName}</div>
                    <div><strong>Email:</strong> {bookingData.bookingData.customer.email}</div>
                    <div><strong>Phone:</strong> {bookingData.bookingData.customer.phone}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">£{bookingData.bookingData.totalPrice}</span>
                  </div>
                  <div className="text-sm text-green-700">
                    {bookingData.bookingData.guests} guests × £{bookingData.bookingData.pricePerPerson} per person
                  </div>
                  <div className="text-sm text-green-600 mt-2">✅ Payment completed via Stripe</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">What's Next?</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Confirmation Email</h4>
              <p className="text-sm text-gray-600">Check your email for detailed booking confirmation and voucher</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-cyan-600" />
              </div>
              <h4 className="font-semibold mb-2">Contact Us</h4>
              <p className="text-sm text-gray-600">Questions? Call us at +44 7936 524299</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Meet Location</h4>
              <p className="text-sm text-gray-600">We'll send meeting point details closer to your trip date</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link href="/booking">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
              Book Another Adventure
            </Button>
          </Link>
          
          <div className="text-sm text-gray-600">
            Booking confirmation sent to: <strong>{bookingData.bookingData.customer.email}</strong>
          </div>
        </div>

      </div>
    </div>
  );
} 