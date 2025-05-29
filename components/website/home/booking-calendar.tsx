'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Star, 
  Phone, 
  ChevronLeft,
  ChevronRight,
  MapPin,
  Waves,
  Anchor,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Minus,
  CreditCard,
  User,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AvailabilitySlot {
  id: string;
  date: number;
  localizedDate: string;
  startTime: string;
  availabilityCount: number;
  bookedParticipants: number;
  minParticipants: number;
  soldOut: boolean;
  unavailable: boolean;
  activityId: number;
  startTimeId: number;
  rates: any[];
  pricesByRate: any[];
}

interface PricingCategory {
  categoryId: string;
  categoryName: string;
  originalPrice: { amount: number; currency: string; display: string };
  convertedPrice: { amount: number; currency: string; display: string };
  availabilityId: string;
  date: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  availability?: AvailabilitySlot[];
  pricing?: PricingCategory[];
  isToday: boolean;
  isPast: boolean;
}

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface BookingDetails {
  selectedSlot: AvailabilitySlot | null;
  guests: number;
  customerInfo: GuestDetails; // Lead guest
  guestDetails: GuestDetails[]; // All guests including lead
  bookingResult?: {
    success: boolean;
    bookingId: string;
    confirmationNumber: string;
    status: string;
    message: string;
  };
}

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [pricing, setPricing] = useState<PricingCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [bookingStep, setBookingStep] = useState(1); // 1: Select Date/Time, 2: Guest Details, 3: Confirmation
  const [booking, setBooking] = useState<BookingDetails>({
    selectedSlot: null,
    guests: 1,
    customerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    guestDetails: [
      { firstName: '', lastName: '', email: '', phone: '' }
    ]
  });

  // Fetch data from APIs
  const fetchBookingData = async () => {
    setLoading(true);
    try {
      const [availabilityResponse, pricingResponse] = await Promise.allSettled([
        fetch('/api/bokun/availability'),
        fetch('/api/bokun/native-pricing')
      ]);

      // Process availability - using native Bokun format
      if (availabilityResponse.status === 'fulfilled' && availabilityResponse.value.ok) {
        const availData = await availabilityResponse.value.json();
        // The native pricing API returns the availability data
        setAvailability([]);
      }

      // Process pricing - using native Bokun format
      if (pricingResponse.status === 'fulfilled' && pricingResponse.value.ok) {
        const pricingData = await pricingResponse.value.json();
        if (pricingData.rawData && Array.isArray(pricingData.rawData)) {
          setAvailability(pricingData.rawData);
        }
        if (pricingData.pricing?.categories) {
          setPricing(pricingData.pricing.categories);
        }
      }
    } catch (error) {
      console.error('Error fetching booking data:', error);
    }
    setLoading(false);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: CalendarDay[] = [];
    const today = new Date();

    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isPast: date < today
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // Find availability for this date - using timestamp matching with validation
      const dayAvailability = availability.filter(slot => {
        try {
          // Validate slot.date exists and is a valid number/string
          if (!slot.date && slot.date !== 0) return false;
          
          const slotDate = new Date(slot.date);
          
          // Check if the Date object is valid
          if (isNaN(slotDate.getTime())) {
            console.warn('Invalid slot date:', slot.date, 'for slot:', slot.id);
            return false;
          }
          
          return slotDate.toISOString().split('T')[0] === dateStr;
        } catch (error) {
          console.error('Error processing slot date:', slot.date, error);
          return false;
        }
      });

      // Find pricing for this date with validation
      const dayPricing = pricing.filter(price => {
        try {
          // Validate price.date exists
          if (!price.date) return false;
          
          const priceDate = new Date(price.date);
          
          // Check if the Date object is valid
          if (isNaN(priceDate.getTime())) {
            console.warn('Invalid price date:', price.date, 'for category:', price.categoryId);
            return false;
          }
          
          return priceDate.toISOString().split('T')[0] === dateStr;
        } catch (error) {
          console.error('Error processing price date:', price.date, error);
          return false;
        }
      });

      days.push({
        date,
        isCurrentMonth: true,
        availability: dayAvailability,
        pricing: dayPricing,
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < today
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isPast: false
      });
    }

    setCalendarDays(days);
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Get availability status for a day
  const getAvailabilityStatus = (day: CalendarDay) => {
    if (!day.availability || day.availability.length === 0) return 'unavailable';
    const hasAvailable = day.availability.some(slot => !slot.soldOut && !slot.unavailable && slot.availabilityCount > 0);
    return hasAvailable ? 'available' : 'limited';
  };

  // Get best price for a day
  const getBestPrice = (day: CalendarDay) => {
    if (!day.pricing || day.pricing.length === 0) return null;
    return day.pricing[0]?.convertedPrice?.display || '£50';
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedDate || !booking.selectedSlot) return 0;
    const dayPricing = calendarDays.find(day => day.date.toDateString() === selectedDate.toDateString())?.pricing?.[0];
    if (!dayPricing) return 50; // fallback price
    return dayPricing.convertedPrice.amount * booking.guests;
  };

  // Handle slot selection
  const selectTimeSlot = (slot: AvailabilitySlot) => {
    setBooking(prev => ({ ...prev, selectedSlot: slot }));
    setBookingStep(2);
  };

  // Handle booking submission
  const submitBooking = async () => {
    if (!booking.selectedSlot || !selectedDate) return;
    
    setLoading(true);
    try {
      // Get pricing for calculation
      const dayPricing = calendarDays.find(day => day.date.toDateString() === selectedDate.toDateString())?.pricing?.[0];
      const pricePerPerson = dayPricing?.convertedPrice?.amount || 50;
      
      const bookingData = {
        activityId: booking.selectedSlot.activityId.toString(),
        startTimeId: booking.selectedSlot.startTimeId,
        date: booking.selectedSlot.date,
        guests: booking.guests,
        customer: booking.customerInfo, // Lead guest for backwards compatibility
        guestDetails: booking.guestDetails, // All guest details
        totalPrice: calculateTotalPrice(),
        pricePerPerson: pricePerPerson
      };

      console.log('Submitting booking data:', bookingData);
      
      // Call the real Bokun booking API
      const response = await fetch('/api/bokun/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      console.log('Booking API response:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Booking failed');
      }

      // Check if payment is required (Stripe checkout)
      if (result.step === 'payment_required' && result.checkout_url) {
        console.log('💳 Redirecting to Stripe checkout:', result.checkout_url);
        
        // Store booking data for when user returns from payment
        sessionStorage.setItem('pendingBooking', JSON.stringify({
          booking: result.booking,
          bookingData: bookingData,
          selectedDate: selectedDate.toISOString(),
          selectedSlot: booking.selectedSlot
        }));
        
        // Redirect to Stripe checkout
        window.location.href = result.checkout_url;
        return;
      }

      // Handle booking without payment (fallback)
      setBooking(prev => ({
        ...prev,
        bookingResult: {
          success: true,
          bookingId: result.booking?.uuid || result.booking?.id || 'Unknown',
          confirmationNumber: result.booking?.supplierReference || 'Unknown',
          status: result.booking?.status || 'Confirmed',
          message: result.message || 'Booking confirmed successfully'
        }
      }));
      
      // Move to confirmation step
      setBookingStep(3);
      
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  // Reset booking
  const resetBooking = () => {
    setBookingStep(1);
    setSelectedDate(null);
    setBooking({
      selectedSlot: null,
      guests: 1,
      customerInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      guestDetails: [
        { firstName: '', lastName: '', email: '', phone: '' }
      ],
      bookingResult: undefined
    });
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, availability, pricing]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section id="booking-calendar" className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-10 right-10 opacity-5">
        <Waves className="w-40 h-40 text-blue-500 animate-pulse" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-5">
        <Anchor className="w-32 h-32 text-cyan-500 animate-float" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-6 py-2 text-blue-600 text-sm font-medium">
            <CalendarIcon className="w-4 h-4" />
            <span>Live Booking System</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Book Your{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                Adventure
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Complete your booking in 3 easy steps. Select your date, choose your time, and confirm your details.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center items-center gap-4 mt-8">
            {[
              { step: 1, label: 'Select Date & Time', icon: CalendarIcon },
              { step: 2, label: 'Guest Details', icon: User },
              { step: 3, label: 'Confirmation', icon: CheckCircle }
            ].map(({ step, label, icon: Icon }) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  bookingStep >= step 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {bookingStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                <span className={`text-sm font-medium ${
                  bookingStep >= step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {label}
                </span>
                {step < 3 && <ArrowRight className="w-4 h-4 text-gray-300 ml-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Calendar Selection */}
        {bookingStep === 1 && (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                
                {/* Calendar Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goToPreviousMonth}
                      className="text-white hover:bg-white/20 rounded-full p-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <div className="text-center">
                      <h3 className="text-2xl font-bold">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </h3>
                      <p className="text-blue-100 text-sm">Indonesian Daily Boat Charter</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goToNextMonth}
                      className="text-white hover:bg-white/20 rounded-full p-2"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {dayNames.map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) => {
                      const status = getAvailabilityStatus(day);
                      const price = getBestPrice(day);
                      const isSelected = selectedDate?.toDateString() === day.date.toDateString();

                      return (
                        <button
                          key={index}
                          onClick={() => day.isCurrentMonth && !day.isPast && status !== 'unavailable' ? setSelectedDate(day.date) : null}
                          disabled={!day.isCurrentMonth || day.isPast || status === 'unavailable'}
                          className={`
                            relative h-20 rounded-xl border-2 transition-all duration-300 hover:scale-105
                            ${!day.isCurrentMonth ? 'text-gray-300 border-transparent' : ''}
                            ${day.isPast ? 'text-gray-400 border-gray-200 cursor-not-allowed' : ''}
                            ${day.isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                            ${isSelected ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' : ''}
                            ${status === 'available' && !day.isPast ? 'border-green-200 bg-green-50 hover:border-green-400' : ''}
                            ${status === 'limited' && !day.isPast ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-400' : ''}
                            ${status === 'unavailable' && !day.isPast ? 'border-gray-200 bg-gray-50' : ''}
                          `}
                        >
                          {/* Date */}
                          <div className="text-sm font-semibold mb-1">
                            {day.date.getDate()}
                          </div>

                          {/* Status Indicator */}
                          {day.isCurrentMonth && !day.isPast && (
                            <div className="absolute top-1 right-1">
                              {status === 'available' && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                              {status === 'limited' && <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>}
                              {status === 'unavailable' && <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                            </div>
                          )}

                          {/* Price */}
                          {price && day.isCurrentMonth && !day.isPast && (
                            <div className="text-xs font-medium text-blue-600 absolute bottom-1 left-1 right-1">
                              {price}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center gap-6 mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Limited</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-600">Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Slots & Details */}
            <div className="space-y-6">
              
              {/* Selected Date Time Slots */}
              {selectedDate && (
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {selectedDate.toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>

                  {/* Available Time Slots */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 mb-3">Available Times</h4>
                    {calendarDays.find(day => day.date.toDateString() === selectedDate.toDateString())?.availability?.map((slot, index) => {
                      const dayPricing = calendarDays.find(day => day.date.toDateString() === selectedDate.toDateString())?.pricing?.[0];
                      const pricePerPerson = dayPricing?.convertedPrice?.display || '£50';
                      
                      return (
                        <button
                          key={index}
                          onClick={() => selectTimeSlot(slot)}
                          disabled={slot.soldOut || slot.unavailable || slot.availabilityCount <= 0}
                          className="w-full border rounded-2xl p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="font-medium">
                                {slot.startTime}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">{pricePerPerson}</div>
                              <div className="text-xs text-gray-500">per person</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {slot.availabilityCount} available
                              </span>
                            </div>
                            {(slot.availabilityCount > 0) && (
                              <ArrowRight className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Adventure Stats</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">4.9★ Rating</div>
                      <div className="text-sm text-gray-500">From 200+ reviews</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">8 Hour Experience</div>
                      <div className="text-sm text-gray-500">Full day adventure</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Up to 8 Guests</div>
                      <div className="text-sm text-gray-500">Private charter</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <div className="font-medium">Gili Trawangan</div>
                      <div className="text-sm text-gray-500">Lombok, Indonesia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Guest Details */}
        {bookingStep === 2 && booking.selectedSlot && selectedDate && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
              
              {/* Booking Summary */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Booking Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div><strong>Date:</strong> {selectedDate.toLocaleDateString('en-GB')}</div>
                    <div><strong>Time:</strong> {booking.selectedSlot.startTime}</div>
                  </div>
                  <div>
                    <div><strong>Duration:</strong> 8 hours</div>
                    <div><strong>Capacity:</strong> {booking.selectedSlot.availabilityCount} available</div>
                  </div>
                </div>
              </div>

              {/* Guest Selection */}
              <div className="mb-8">
                <Label className="text-lg font-semibold mb-4 block">Number of Guests</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newGuestCount = Math.max(1, booking.guests - 1);
                      setBooking(prev => ({ 
                        ...prev, 
                        guests: newGuestCount,
                        guestDetails: prev.guestDetails.slice(0, newGuestCount)
                      }));
                    }}
                    disabled={booking.guests <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-2xl font-bold text-blue-600 min-w-[3rem] text-center">
                    {booking.guests}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newGuestCount = Math.min(8, booking.guests + 1);
                      setBooking(prev => ({ 
                        ...prev, 
                        guests: newGuestCount,
                        guestDetails: [
                          ...prev.guestDetails,
                          ...Array.from({ length: newGuestCount - prev.guestDetails.length }, () => ({
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: ''
                          }))
                        ]
                      }));
                    }}
                    disabled={booking.guests >= 8}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <span className="text-gray-600 ml-4">
                    guests (max 8)
                  </span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="bg-green-50 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold text-green-900">Total Price</div>
                    <div className="text-sm text-green-700">
                      {booking.guests} guests × {calendarDays.find(day => day.date.toDateString() === selectedDate.toDateString())?.pricing?.[0]?.convertedPrice?.display || '£50'}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    £{calculateTotalPrice()}
                  </div>
                </div>
              </div>

              {/* Guest Details Forms */}
              <div className="space-y-8">
                <h4 className="text-lg font-semibold">Guest Details</h4>
                
                {Array.from({ length: booking.guests }, (_, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                    <h5 className="text-md font-semibold mb-4 text-blue-600">
                      {index === 0 ? 'Lead Guest (Main Contact)' : `Guest ${index + 1}`}
                    </h5>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`firstName-${index}`}>First Name</Label>
                        <Input
                          id={`firstName-${index}`}
                          value={booking.guestDetails[index]?.firstName || ''}
                          onChange={(e) => {
                            const newGuestDetails = [...booking.guestDetails];
                            if (!newGuestDetails[index]) {
                              newGuestDetails[index] = { firstName: '', lastName: '', email: '', phone: '' };
                            }
                            newGuestDetails[index].firstName = e.target.value;
                            
                            setBooking(prev => ({
                              ...prev,
                              guestDetails: newGuestDetails,
                              // Keep customerInfo in sync with lead guest
                              customerInfo: index === 0 ? { ...prev.customerInfo, firstName: e.target.value } : prev.customerInfo
                            }));
                          }}
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                        <Input
                          id={`lastName-${index}`}
                          value={booking.guestDetails[index]?.lastName || ''}
                          onChange={(e) => {
                            const newGuestDetails = [...booking.guestDetails];
                            if (!newGuestDetails[index]) {
                              newGuestDetails[index] = { firstName: '', lastName: '', email: '', phone: '' };
                            }
                            newGuestDetails[index].lastName = e.target.value;
                            
                            setBooking(prev => ({
                              ...prev,
                              guestDetails: newGuestDetails,
                              // Keep customerInfo in sync with lead guest
                              customerInfo: index === 0 ? { ...prev.customerInfo, lastName: e.target.value } : prev.customerInfo
                            }));
                          }}
                          placeholder="Enter last name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor={`email-${index}`}>Email Address</Label>
                        <Input
                          id={`email-${index}`}
                          type="email"
                          value={booking.guestDetails[index]?.email || ''}
                          onChange={(e) => {
                            const newGuestDetails = [...booking.guestDetails];
                            if (!newGuestDetails[index]) {
                              newGuestDetails[index] = { firstName: '', lastName: '', email: '', phone: '' };
                            }
                            newGuestDetails[index].email = e.target.value;
                            
                            setBooking(prev => ({
                              ...prev,
                              guestDetails: newGuestDetails,
                              // Keep customerInfo in sync with lead guest
                              customerInfo: index === 0 ? { ...prev.customerInfo, email: e.target.value } : prev.customerInfo
                            }));
                          }}
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                        <Input
                          id={`phone-${index}`}
                          type="tel"
                          value={booking.guestDetails[index]?.phone || ''}
                          onChange={(e) => {
                            const newGuestDetails = [...booking.guestDetails];
                            if (!newGuestDetails[index] ) {
                              newGuestDetails[index] = { firstName: '', lastName: '', email: '', phone: '' };
                            }
                            newGuestDetails[index].phone = e.target.value;
                            
                            setBooking(prev => ({
                              ...prev,
                              guestDetails: newGuestDetails,
                              // Keep customerInfo in sync with lead guest
                              customerInfo: index === 0 ? { ...prev.customerInfo, phone: e.target.value } : prev.customerInfo
                            }));
                          }}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="bg-green-50 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold text-green-900">Total Price</div>
                    <div className="text-sm text-green-700">
                      {booking.guests} guests × {calendarDays.find(day => day.date.toDateString() === selectedDate.toDateString())?.pricing?.[0]?.convertedPrice?.display || '£50'}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    £{calculateTotalPrice()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setBookingStep(1)}
                  className="flex-1"
                >
                  Back to Calendar
                </Button>
                
                <Button
                  onClick={submitBooking}
                  disabled={
                    loading || 
                    booking.guestDetails.length !== booking.guests ||
                    booking.guestDetails.some(guest => 
                      !guest.firstName || !guest.lastName || !guest.email || !guest.phone
                    )
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Complete Booking
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {bookingStep === 3 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for booking with us. We've sent a confirmation email to {booking.customerInfo.email}
              </p>

              {/* Real booking confirmation details */}
              {booking.bookingResult && (
                <div className="bg-green-50 rounded-2xl p-6 mb-8 text-left">
                  <h4 className="font-semibold text-green-900 mb-4">Booking Confirmation</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Booking ID:</strong> {booking.bookingResult.bookingId}</div>
                    <div><strong>Confirmation Number:</strong> {booking.bookingResult.confirmationNumber}</div>
                    <div><strong>Status:</strong> <span className="text-green-600 font-medium">{booking.bookingResult.status}</span></div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left">
                <h4 className="font-semibold text-blue-900 mb-4">Trip Details</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Date:</strong> {selectedDate?.toLocaleDateString('en-GB')}</div>
                  <div><strong>Time:</strong> {booking.selectedSlot && booking.selectedSlot.startTime}</div>
                  <div><strong>Guests:</strong> {booking.guests}</div>
                  <div><strong>Total:</strong> £{calculateTotalPrice()}</div>
                  <div><strong>Contact:</strong> {booking.customerInfo.firstName} {booking.customerInfo.lastName}</div>
                  <div><strong>Phone:</strong> {booking.customerInfo.phone}</div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={resetBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Book Another Adventure
                </Button>
                
                <div className="text-sm text-gray-600">
                  Questions? Call us at <strong>+44 7936 524299</strong>
                </div>

                {/* Display Bokun message if available */}
                {booking.bookingResult?.message && (
                  <div className="text-xs text-green-600 mt-4">
                    {booking.bookingResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Refresh Data Button */}
        <div className="text-center mt-12">
          <Button 
            onClick={fetchBookingData}
            disabled={loading}
            variant="outline"
            size="lg"
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Refreshing Data...
              </>
            ) : (
              <>
                <CalendarIcon className="w-5 h-5 mr-2" />
                Refresh Availability
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar; 