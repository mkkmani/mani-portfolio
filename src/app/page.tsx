import { Seo } from '@/components/seo/Seo';
import { HeroSection } from '@/components/pages/Home/HeroSection';

export const metadata = {
  title: 'Mani | Full Stack Developer',
  description: 'Experienced Full Stack Developer specializing in modern web technologies. Check out my portfolio and projects.',
  keywords: ['Full Stack Developer', 'Web Developer', 'React', 'Node.js', 'TypeScript', 'Portfolio'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Mani | Full Stack Developer',
    description: 'Experienced Full Stack Developer specializing in modern web technologies. Check out my portfolio and projects.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mani - Full Stack Developer',
      },
    ],
    siteName: 'Mani - Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mani | Full Stack Developer',
    description: 'Experienced Full Stack Developer specializing in modern web technologies.',
    images: ['/images/og-image.jpg'],
  },
};

export default function HomePage() {
  return (
    <>
      <Seo 
        title="Mani | Full Stack Developer"
        description="Experienced Full Stack Developer specializing in modern web technologies. Check out my portfolio and projects."
        path="/"
      />
      <main className="min-h-screen">
        <HeroSection />
      </main>
    </>
  );
}
