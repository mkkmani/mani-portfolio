/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { BlogCard } from "@/components/pages/Notelogs/BlogCard";

export type NotelogType = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  status: "pending" | "approved" | "rejected";
  published: boolean;
  coverImage?: string | null;
  views: number;
  isDiscarded: boolean;
  createdAt?: string;
  updatedAt?: string;
  summary?: string;
};

interface BlogSectionProps {
  posts: NotelogType[];
}

export const BlogSection = async ({ posts }: BlogSectionProps) => {
  if (!posts || posts.length === 0) {
    return (
      <SectionWrapper id="blog">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found.</p>
        </div>
      </SectionWrapper>
    );
  }

  const blogPosts = posts.map((notelog) => ({
    title: notelog.title,
    content: notelog.content,
    summary: notelog.summary,
    excerpt:
      notelog.content?.substring(0, 150) +
        (notelog.content?.length > 150 ? "..." : "") || "No content available",
    date: notelog.createdAt || new Date().toISOString(),
    readTime: Math.ceil(notelog?.content?.length / 2000) + " min read",
    tags: notelog.tags || [],
    slug: notelog.slug,
    coverImage: notelog.coverImage,
    createdAt: notelog.createdAt,
    updatedAt: notelog.updatedAt,
  }));

  return (
    <SectionWrapper id="blog">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Latest Articles
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Thoughts, tutorials, and insights about web development, programming,
          and technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post: any, index: number) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>
    </SectionWrapper>
  );
};
