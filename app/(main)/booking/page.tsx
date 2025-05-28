import BookingHero from '@/components/website/booking/hero';
import BookingCalendar from '@/components/website/home/booking-calendar';

export default function BookingPage() {
  return (
    <main className="min-h-screen">
      <BookingHero />
      <BookingCalendar />
    </main>
  );
} 