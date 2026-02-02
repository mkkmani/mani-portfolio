import AboutPage from '@/components/pages/About/AboutPage';
import { Metadata } from 'next';
import { generatePageMetadata, getSiteConfig } from '@/lib/seo-config';
import { generateBreadcrumbSchema, generateAboutPageSchema } from '@/lib/structured-data';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Me - Full Stack Developer Profile | Manikanta Ketha',
  description: 'Learn more about Manikanta Ketha, a specialized Full Stack MERN developer and software engineer building exceptional digital experiences with Next.js and React.',
  keywords: [
    'About Manikanta Ketha',
    'Manikanta bio',
    'full stack developer profile',
    'software engineer India',
    'MERN stack expert',
    'web development expertise',
  ],
  path: '/about',
});

export default function Page() {
  const config = getSiteConfig();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ], config);
  const aboutSchema = generateAboutPageSchema(config);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutPage />
    </>
  );
}
