import WorkPage from '@/components/pages/Work/WorkPage';
import { Metadata } from 'next';
import { generatePageMetadata, getSiteConfig } from '@/lib/seo-config';
import { generateBreadcrumbSchema, generateWorkPageSchema } from '@/lib/structured-data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Work Experience - Professional Journey | Manikanta Ketha',
  description: 'Detailed professional experience and career history of Manikanta Ketha, a Full Stack Developer specializing in MERN stack, AI tools, and scalable web solutions.',
  keywords: [
    'Manikanta Ketha work',
    'professional experience',
    'software engineer career',
    'PureCode Software experience',
    'MERN stack projects',
    'web developer history',
    'full stack work log',
  ],
  path: '/work',
});

// Experiences data for structured data
const experiences = [
  {
    role: 'Software Engineer',
    company: 'PureCode Software',
    description: 'Developing PureCode VS Code extension with Copilot-like AI integration. Architecting real-time MERN stack backends and React frontends for code suggestions.',
  },
  {
    role: 'Frontend Developer',
    company: 'PureCode Software',
    description: 'Engineered the AI component generation flow, enabling text-to-UI transformation. Built the custom theme engine.',
  },
  {
    role: 'QA Engineer',
    company: 'PureCode Software',
    description: 'Tested the accuracy of AI-generated React and Tailwind components. Ensuring high stability standards.',
  },
  {
    role: 'Frontend Intern',
    company: 'PureCode Software',
    description: 'Contributed to the initial dashboard UI and component library. Learned modern React patterns.',
  },
];

export default function Page() {
  const config = getSiteConfig();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Work', url: '/work' }
  ], config);
  const workSchema = generateWorkPageSchema(config, experiences);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workSchema) }}
      />
      <WorkPage />
    </>
  );
}
