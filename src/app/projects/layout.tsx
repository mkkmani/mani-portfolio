import { Metadata } from 'next';
import { generatePageMetadata, getSiteConfig } from '@/lib/seo-config';
import { generateProjectsSchema } from '@/lib/structured-data';
import { getProjects } from '@/services/api';

export const metadata: Metadata = generatePageMetadata({
  title: 'Projects',
  description: 'Explore my portfolio of web development projects showcasing expertise in MERN stack, Next.js, and modern technologies. View live demos and source code.',
  keywords: [
    'web development projects',
    'portfolio',
    'MERN stack projects',
    'Next.js applications',
    'React projects',
    'full stack projects',
    'open source',
  ],
  path: '/projects',
});


export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();
  const projects = await getProjects();

  const structuredData = generateProjectsSchema(projects, config);

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
