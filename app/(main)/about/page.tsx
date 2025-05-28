import { AboutHero } from "@/components/website/about/hero";
import { CompanyHistory } from "@/components/website/about/timeline";
import { ContactForm } from "@/components/website/about/contact-form";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AboutHero />
      <CompanyHistory />
      <ContactForm />
    </div>
  );
} 