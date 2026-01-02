import PublicProjects from '@/components/pages/Projects/PublicProjects';
import { Metadata } from 'next';
import { generatePageMetadata, getSiteConfig } from '@/lib/seo-config';
import { generateBreadcrumbSchema, generateSoftwareSourceCodeSchema } from '@/lib/structured-data';
import { getProjects } from '@/services/api';

export const metadata: Metadata = generatePageMetadata({
  title: 'Projects - Web Development Portfolio | Manikanta Ketha',
  description: 'Explore Manikanta Ketha\'s portfolio of full-stack web development projects built with MERN Stack, Next.js, React, Node.js, and modern technologies. Real-world applications and innovative solutions.',
  keywords: [
    'Manikanta Ketha projects',
    'web development portfolio',
    'MERN Stack projects',
    'Next.js applications',
    'React projects',
    'full stack portfolio',
    'JavaScript projects',
    'TypeScript applications',
  ],
  path: '/projects',
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  const config = getSiteConfig();
  const projects = await getProjects();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' }
  ], config);

  const projectSchemas = projects.map(project => generateSoftwareSourceCodeSchema(project, config));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {projectSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PublicProjects projects={projects} />
    </>
  )
}

