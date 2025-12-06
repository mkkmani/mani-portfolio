import { Metadata } from 'next';
import dbConnect from '@/server/db';
import Blog from '@/server/models/Blog';
import { getSiteConfig } from '@/lib/seo-config';
import { generateBlogPostingSchema } from '@/lib/structured-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const config = getSiteConfig();

  try {
    const { slug } = await params;

    await dbConnect();
    const blog = await Blog.findOne({ slug }).lean();

    if (!blog) {
      return {
        title: 'Notelog Not Found',
        description: 'The requested notelog could not be found.',
        robots: {
          index: false,
          follow: false,
        },
        alternates: {
          canonical: `/notelogs/${slug}`,
        },
      };
    }

    const description =
      blog.excerpt ||
      blog.content?.substring(0, 160).trim() ||
      'Read this article on Mani Kanta\'s blog';

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
      title: blog.title,
      description,
      keywords: blog.tags,
      authors: [
        {
          name: config.author.name,
          url: config.author.url,
        },
      ],
      openGraph: {
        type: 'article',
        locale: 'en_US',
        url: `/notelogs/${slug}`,
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
        publishedTime: blog.createdAt?.toISOString(),
        modifiedTime: blog.updatedAt?.toISOString(),
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
        canonical: `/notelogs/${slug}`,
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

    await dbConnect();

    const blog = await Blog.findOne({ slug }).lean();

    if (blog) {
      structuredData = generateBlogPostingSchema(
        {
          ...blog,
          _id: blog._id.toString(),
          createdAt: blog.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: blog.updatedAt?.toISOString() || new Date().toISOString(),
        },
        config
      );
    }
  } catch (error) {
    console.error('Error generating structured data:', error);
  }

  return (
    <>
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
