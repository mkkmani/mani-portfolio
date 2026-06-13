import AllNoteLogs from "@/components/pages/Notelogs";
import { Metadata } from 'next';
import { generatePageMetadata, getSiteConfig } from '@/lib/seo-config';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Notelogs - Technical Articles by Manikanta Ketha',
  description: 'In-depth technical articles, tutorials, and development insights on MERN Stack, Next.js, React, Node.js, MongoDB, and modern web development by Manikanta Ketha. Learn from real-world experience.',
  keywords: [
    'Manikanta Ketha blog',
    'technical blog',
    'MERN Stack tutorials',
    'Next.js articles',
    'React tutorials',
    'Node.js guides',
    'MongoDB tutorials',
    'web development blog',
  ],
  path: '/notelogs',
});

// ISR: cached pages served instantly; tag-based revalidation busts them on publish.
export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AllNoteLogsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const config = getSiteConfig();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Notelogs', url: '/notelogs' }
  ], config);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AllNoteLogs searchParams={params} />
    </>
  );
}