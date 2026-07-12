import { HeroSection } from "@/components/public/hero-section";
import { SelectedWorkSection } from "@/components/public/selected-work-section";
import { ServicesSection } from "@/components/public/services-section";
import { TestimonialsSection } from "@/components/public/testimonials-section";
import { ContactSection } from "@/components/public/contact-section";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: "Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Unique Land Developer Pvt. Ltd.",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <HeroSection />
      <SelectedWorkSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
