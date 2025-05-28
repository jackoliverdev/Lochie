import ExperiencesHero from '@/components/website/experiences/hero';
import ActivitiesGrid from '@/components/website/experiences/activities-grid';
import BookingCalendar from '@/components/website/home/booking-calendar';

export default function ExperiencesPage() {
  return (
    <main className="min-h-screen">
      <ExperiencesHero />
      <ActivitiesGrid />
      <BookingCalendar />
    </main>
  );
} 