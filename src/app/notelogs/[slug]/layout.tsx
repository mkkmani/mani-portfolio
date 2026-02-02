import { Metadata } from 'next';
import { getBlogBySlugServer } from '@/services/api/blogs.server';
import { getSiteConfig, getAbsoluteUrl } from '@/lib/seo-config';
import { generateBlogPostingSchema, generateBreadcrumbSchema } from '@/lib/structured-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const config = getSiteConfig();

  try {
    const { slug } = await params;
    const blog = await getBlogBySlugServer(slug);

    if (!blog) {
      return {
        title: 'Notelog Not Found',
        description: 'The requested notelog could not be found.',
        robots: {
          index: false,
          follow: false,
        },
        alternates: {
          canonical: getAbsoluteUrl(`/notelogs/${slug}`),
        },
      };
    }

    const description =
      blog.excerpt?.length >= 120
        ? blog.excerpt
        : blog.content?.substring(0, 160).trim() ||
        `Read "${blog.title}" - An in-depth technical article by Manikanta Ketha on web development and modern technologies.`;

    const ogImage = blog.image || config.ogImage;

    const robots = blog.published
      ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      }
      : {
        index: false,
        follow: false,
      };

    return {
      title: `${blog.title.substring(0, 50)} | Notelogs`,
      description: description.substring(0, 160),
      keywords: [...blog.tags, 'Manikanta Ketha', 'Manikanta', 'technical blog'],
      authors: [
        {
          name: config.author.name,
          url: config.author.url,
        },
      ],
      openGraph: {
        type: 'article',
        locale: 'en_US',
        url: getAbsoluteUrl(`/notelogs/${slug}`),
        siteName: config.name,
        title: blog.title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: [config.author.name],
        tags: blog.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description,
        images: [ogImage],
        creator: config.social.twitter,
      },
      robots,
      alternates: {
        canonical: getAbsoluteUrl(`/notelogs/${slug}`),
      },
    };
  } catch (error) {
    console.error('Error generating notelog metadata:', error);

    return {
      title: 'Notelog',
      description: 'Technical articles and insights on web development.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function NotelogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const config = getSiteConfig();
  let structuredData = null;

  try {
    const { slug } = await params;
    const blog = await getBlogBySlugServer(slug);

    if (blog) {
      structuredData = generateBlogPostingSchema(
        {
          ...blog,
          _id: blog._id.toString(),
          createdAt: blog.createdAt || new Date().toISOString(),
          updatedAt: blog.updatedAt || new Date().toISOString(),
        },
        config
      );
    }
  } catch (error) {
    console.error('Error generating structured data:', error);
  }

  let breadcrumbSchema = null;
  try {
    const { slug } = await params;
    const blog = await getBlogBySlugServer(slug);
    if (blog) {
      breadcrumbSchema = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Notelogs', url: '/notelogs' },
        { name: blog.title, url: `/notelogs/${slug}` }
      ], config);
    }
  } catch (e) { }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      {children}
    </>
  );
}
