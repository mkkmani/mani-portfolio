import Hero from '@/components/pages/LandingPage/Hero';
import Experience from '@/components/pages/LandingPage/Experience';
import LandingPageProjects from '@/components/pages/LandingPage/LandingPageProjects';
import LandingPageNotelogs from '@/components/pages/LandingPage/LandingPageNotelogs';
import GetInTouch from '@/components/pages/LandingPage/GetInTouch';
import Reveal from '@/components/Common/Reveal';
import FAQSection from '@/components/FAQ/FAQSection';
import { homepageFAQs } from '@/lib/faq-data';
import { getSiteConfig } from '@/lib/seo-config';
import { generateFAQPageSchema } from '@/lib/structured-data';

export default async function Home() {
  const config = getSiteConfig();
  const faqSchema = generateFAQPageSchema(homepageFAQs, config);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Hero />
      <Reveal><Experience /></Reveal>
      <Reveal><LandingPageProjects /></Reveal>
      <Reveal><LandingPageNotelogs /></Reveal>
      <Reveal>
        <FAQSection
          faqs={homepageFAQs}
          description="Common questions about my services, expertise, and how I can help you."
        />
      </Reveal>
      <Reveal><GetInTouch /></Reveal>
    </main>
  );
}
