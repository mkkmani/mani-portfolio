import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact - Get In Touch | Manikanta Ketha',
  description: 'Contact Manikanta Ketha for freelance web development projects, collaboration opportunities, or technical consultations. Full-stack MERN developer available for remote work worldwide.',
  keywords: [
    'Contact Manikanta Ketha',
    'hire full stack developer',
    'MERN developer for hire',
    'freelance web developer',
    'remote developer India',
  ],
  path: '/contact',
});

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <ContactForm />
    </main>
  );
}
