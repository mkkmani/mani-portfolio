import Home from "@/components/pages/LandingPage";
import { Metadata } from 'next';
import { generatePageMetadata, getSiteConfig } from '@/lib/seo-config';
import { generateBreadcrumbSchema, generateProfilePageSchema } from '@/lib/structured-data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Manikanta Ketha - Full Stack Developer | MERN Stack Expert',
  description: 'Full-stack developer Manikanta Ketha (Mani Kanta) specializing in MERN Stack, Next.js, React, and modern web technologies. Building exceptional digital experiences. Based in India, available worldwide.',
  keywords: [
    'Manikanta Ketha',
    'Mani Kanta',
    'Full Stack Developer',
    'MERN Stack Developer',
    'Next.js Developer',
    'React Developer',
    'Node.js Developer',
    'MongoDB Expert',
    'TypeScript Developer',
    'JavaScript Developer',
    'India Developer',
    'Remote Developer',
    'Software Engineer Manikanta',
    'Web Developer India',
    'Full Stack Expert',
    'manikantaketha',
    'manikantaketha.in',
  ],
  path: '/',
});

export default function HomePage() {
  const config = getSiteConfig();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' }
  ], config);
  const profileSchema = generateProfilePageSchema(config);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <Home />
    </>
  );
}
