import NoteLogSlug from "@/components/pages/Notelogs/NoteLogSlug";
import { getBlogBySlug } from "@/services/api/blogs";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found | Manikanta Ketha',
      description: 'The requested technical article could not be found.',
    };
  }

  return {
    title: `${blog.title} | Notelogs by Manikanta Ketha`,
    description: blog.excerpt,
    keywords: blog.tags,
    openGraph: {
      type: 'article',
      title: blog.title,
      description: blog.excerpt,
      images: blog.image ? [{ url: blog.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: blog.image ? [blog.image] : undefined,
    },
  };
}

export default function NotelogSlug({ params }: Props) {
  return <NoteLogSlug params={params} />
}