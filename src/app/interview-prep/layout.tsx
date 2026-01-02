import { Metadata } from 'next';
import { generatePageMetadata, getSiteConfig } from '@/lib/seo-config';
import { generateFAQPageSchema } from '@/lib/structured-data';
import { interviewPrepFAQs } from '@/lib/faq-data';

export const metadata: Metadata = generatePageMetadata({
  title: 'AI Interview Preparation | Manikanta Ketha',
  description: 'Master your technical interviews with AI-powered preparation guides by Manikanta Ketha. Interactive interview coaching for MERN Stack, JavaScript, React, and software engineering roles.',
  keywords: [
    'Manikanta Ketha interview prep',
    'AI interview coach',
    'technical interview preparation',
    'MERN Stack interview',
    'JavaScript interview questions',
    'React interview prep',
    'coding interview practice',
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
