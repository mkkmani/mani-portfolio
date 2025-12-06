import Projects from '@/components/pages/Projects';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  return <Projects />
}

