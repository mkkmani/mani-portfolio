import { getPreparationBySlugServer } from '@/services/api/preparation.server';
import { getPublishedPreparationSlugs } from '@/lib/data/preparations';
import { notFound } from 'next/navigation';
import AIInteraction from '@/components/pages/Preparation/AIInteraction';
import ClientPrivateSession from '@/components/pages/Content/ClientPrivateSession';
import ClientPublishActionBar from '@/components/pages/Content/ClientPublishActionBar';
import { Metadata } from 'next';
import { getSiteConfig, getAbsoluteUrl } from '@/lib/seo-config';
import { generateBreadcrumbSchema, generateQAPageSchema } from '@/lib/structured-data';

export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getPublishedPreparationSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'new') {
    return {
      title: 'Start New AI Interview Session | Manikanta Ketha',
      description: 'Launch a personalized AI-powered interview preparation session. Practice technical interviews with real-time feedback and coaching by Manikanta Ketha.',
    };
  }

  const preparation = await getPreparationBySlugServer(slug);
  if (!preparation) return {
    title: 'Interview Preparation Guide Not Found',
    description: 'The requested interview preparation guide could not be found.',
  };

  const description = preparation.excerpt?.length >= 120
    ? preparation.excerpt
    : `${preparation.excerpt} Master this interview topic with AI-powered guidance from Manikanta Ketha.`;

  return {
    title: `${preparation.topic.substring(0, 45)} Interview Prep | Manikanta Ketha`,
    description: description.substring(0, 160),
    keywords: [preparation.topic, 'interview preparation', preparation.difficulty, 'Manikanta Ketha', 'AI interview coach'],
    alternates: {
      canonical: getAbsoluteUrl(`/interview-prep/${slug}`),
    },
    robots: preparation.published ? undefined : { index: false, follow: false },
  };
}

export default async function PreparationSlugPage({ params }: Props) {
  const { slug } = await params;
  const config = getSiteConfig();

  let initialData = null;
  const structuredDataScripts = [];

  if (slug !== 'new') {
    initialData = await getPreparationBySlugServer(slug);
    if (!initialData) {
      notFound();
    }

    // Check if user can access content
    const canAccess = initialData.published || initialData.userRole === 'admin' || initialData.userRole === 'owner';

    // If user cannot access, show PrivateSession instead
    if (!canAccess) {
      return (
        <ClientPrivateSession
          contentType="preparation"
          contentId={initialData._id}
          hasExistingRequest={initialData.hasPublishRequest || false}
          requestStatus={initialData.publishRequestStatus}
          canRequestPublish={initialData.canRequestPublish || false}
        />
      );
    }

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Interview Prep', url: '/interview-prep' },
      { name: initialData.topic, url: `/interview-prep/${slug}` }
    ], config);

    const qaSchema = generateQAPageSchema(initialData, config);

    structuredDataScripts.push(breadcrumbSchema, qaSchema);
  } else {
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Interview Prep', url: '/interview-prep' },
      { name: 'New Session', url: '/interview-prep/new' }
    ], config);
    structuredDataScripts.push(breadcrumbSchema);
  }

  return (
    <>
      {structuredDataScripts.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Show publish action bar for admin/owner viewing unpublished content */}
      {initialData && !initialData.published && initialData.userRole && (
        <ClientPublishActionBar
          userRole={initialData.userRole}
          published={initialData.published}
          contentType="preparation"
          contentId={initialData._id}
          contentSlug={initialData.slug}
          canRequestPublish={initialData.canRequestPublish || false}
          hasPublishRequest={initialData.hasPublishRequest || false}
          publishRequestStatus={initialData.publishRequestStatus}
          canPublish={initialData.canPublish || false}
        />
      )}

      <div className="pt-8 md:pt-12">
        <AIInteraction initialData={initialData} readOnly={slug !== 'new'} />
      </div>
    </>
  );
}
