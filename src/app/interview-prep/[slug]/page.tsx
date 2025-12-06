import { getPreparationBySlug } from '@/services/api/preparation';
import { notFound } from 'next/navigation';
import AIInteraction from '@/components/pages/Preparation/AIInteraction';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'new') {
    return {
      title: 'Start New Session | Interview Preparation',
      description: 'Start a new AI-powered interview preparation session.',
    };
  }

  const preparation = await getPreparationBySlug(slug);
  if (!preparation) return {};

  return {
    title: `${preparation.title} | Interview Preparation`,
    description: preparation.excerpt,
  };
}

export default async function PreparationSlugPage({ params }: Props) {
  const { slug } = await params;

  let initialData = null;
  if (slug !== 'new') {
    initialData = await getPreparationBySlug(slug);
    if (!initialData) {
      notFound();
    }
  }

  return (
    <div className="pt-24 md:pt-32">
      <AIInteraction initialData={initialData} readOnly={slug !== 'new'} />
    </div>
  );
}
