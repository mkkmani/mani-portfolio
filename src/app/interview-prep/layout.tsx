import { Metadata } from 'next';
import { generatePageMetadata, getSiteConfig } from '@/lib/seo-config';
import { generateFAQPageSchema } from '@/lib/structured-data';
import { interviewPrepFAQs } from '@/lib/faq-data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Interview Preparation | Mani Kanta',
  description: 'AI-powered interview preparation guides and interactive sessions. Get personalized interview coaching and practice with real-world scenarios.',
  keywords: [
    'Interview Preparation',
    'AI Interview Coach',
    'Technical Interview',
    'Coding Interview',
    'Interview Practice',
    'MERN Stack Interview',
    'JavaScript Interview',
    'React Interview',
    'Software Engineer Interview',
  ],
  path: '/interview-prep',
});

export default function PreparationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();
  const faqSchema = generateFAQPageSchema(interviewPrepFAQs, config);

  return (
    <div className="min-h-screen bg-black text-foreground font-sans selection:bg-accent selection:text-black font-cormorant">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </div>
  );
}
