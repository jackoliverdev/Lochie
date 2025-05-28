'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BookingCancelledPage() {
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking data from session storage if available
    const pendingBooking = sessionStorage.getItem('pendingBooking');
    if (pendingBooking) {
      try {
        const data = JSON.parse(pendingBooking);
        setBookingData(data);
      } catch (error) {
        console.error('Error parsing pending booking:', error);
      }
    }
    setLoading(false);
  }, []);

  const bookingId = searchParams?.get('booking_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Cancellation Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
          <p className="text-xl text-gray-600 mb-2">
            Your payment was cancelled and no charges were made
          </p>
          <p className="text-lg text-gray-500">
            Your booking has been reserved but not confirmed
          </p>
        </div>

        {/* Cancellation Details Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
          
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What Happened?</h3>
            <p className="text-gray-600 mb-4">
              You cancelled the payment process before it was completed. Don't worry - no charges were made to your card.
            </p>
            
            {bookingId && (
              <div className="bg-orange-50 rounded-xl p-4 mb-6">
                <div className="text-sm text-orange-600 font-medium mb-1">Booking Reference (Unpaid)</div>
                <div className="text-lg font-bold text-orange-900">{bookingId}</div>
                <div className="text-sm text-orange-700 mt-2">
                  This booking is held for 30 minutes but requires payment to be confirmed
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-3">Your Options:</h4>
              
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h5 className="font-medium text-blue-900 mb-2">Try Again</h5>
                  <p className="text-sm text-blue-700 mb-3">
                    Return to the booking page and complete your reservation
                  </p>
                  <Link href="/booking">
                    <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Booking
                    </Button>
                  </Link>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Need Help?</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Contact us if you experienced any issues during the payment process
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <a href="tel:+447936524299" className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Call Us</span>
                    </a>
                    <a href="mailto:hello@indonesianboats.com" className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Email Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Secure Payment Processing</h4>
            <p className="text-sm text-gray-600 mb-4">
              All payments are processed securely through Stripe. Your card information is never stored on our servers.
            </p>
            
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>🔒 SSL Encrypted</span>
              <span>💳 Stripe Secure</span>
              <span>🛡️ PCI Compliant</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 