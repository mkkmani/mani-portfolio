import NoteLogSlug from "@/components/pages/Notelogs/NoteLogSlug";
import { getBlogBySlugServer } from "@/services/api/blogs.server";
import { getPublishedBlogSlugs } from "@/lib/data/blogs";
import { getAbsoluteUrl } from "@/lib/seo-config";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlugServer(slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found | Manikanta Ketha',
      description: 'The requested technical article could not be found.',
      robots: { index: false, follow: true },
    };
  }

  const canonical = getAbsoluteUrl(`/notelogs/${slug}`);
  const ogImageUrl =
    blog.image && blog.image.startsWith('http')
      ? blog.image
      : blog.image && blog.image.startsWith('/')
        ? getAbsoluteUrl(blog.image)
        : getAbsoluteUrl('/og/og-image.png');
  const ogImage = [{ url: ogImageUrl }];

  return {
    title: `${blog.title} | Notelogs by Manikanta Ketha`,
    description: blog.excerpt,
    keywords: blog.tags,
    alternates: { canonical },
    // Drafts must never be indexed even if the URL is shared.
    robots: blog.published ? undefined : { index: false, follow: false },
    openGraph: {
      type: 'article',
      url: canonical,
      title: blog.title,
      description: blog.excerpt,
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt || blog.createdAt,
      tags: blog.tags,
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default function NotelogSlug({ params }: Props) {
  return <NoteLogSlug params={params} />
}