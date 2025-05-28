import Hero from '@/components/website/home/hero';
import PopularActivities from '@/components/website/home/popular-activities';
import BookingCalendar from '@/components/website/home/booking-calendar';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PopularActivities />
      <BookingCalendar />
    </main>
  );
}
