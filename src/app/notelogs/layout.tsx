import { Metadata } from 'next';
import { generatePageMetadata, getSiteConfig } from '@/lib/seo-config';
import { generateBlogSchema } from '@/lib/structured-data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Notelogs',
  description: 'Technical articles, tutorials, and insights on web development, MERN stack, Next.js, and modern technologies. Learn from real-world experiences and best practices.',
  keywords: [
    'technical blog',
    'web development articles',
    'MERN stack tutorials',
    'Next.js guides',
    'React tutorials',
    'full stack development',
    'programming insights',
    'software engineering',
  ],
  path: '/notelogs',
});

export default function NotelogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();

  const structuredData = generateBlogSchema(config);

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
