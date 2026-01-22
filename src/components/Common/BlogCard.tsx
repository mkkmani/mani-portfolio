'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface BlogCardProps {
  blog: {
    title: string;
    slug: string;
    excerpt: string;
    createdAt: string;
    customDate?: string | Date;
    tags: string[];
  };
  index: number;
}

export default function BlogCard({ blog, index }: BlogCardProps) {
  const date = new Date(blog.customDate || blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article itemScope itemType="https://schema.org/BlogPosting" className="group">
      <Link
        href={`/notelogs/${blog.slug}`}
        title={`${blog.title} - Notelog by Manikanta Ketha`}
        className="block space-y-6"
      >
        <div className="flex justify-between items-start gap-4 pb-4 border-b border-white/5 group-hover:border-accent/40 transition-colors duration-500">
          <div className="space-y-1">
            <span className="text-[9px] font-black tracking-[0.3em] text-foreground/20 uppercase block">
              {date}
            </span>
            <h3 className="text-2xl md:text-3xl font-serif leading-tight group-hover:text-accent transition-colors duration-300" itemProp="headline">
              {blog.title}
            </h3>
          </div>
          <ArrowUpRight
            size={20}
            className="text-foreground/20 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0"
          />
        </div>

        <p className="text-foreground/40 text-sm leading-relaxed lowercase italic line-clamp-2" itemProp="description">
          {blog.excerpt}
        </p>

        <div className="flex gap-4">
          {blog.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[8px] font-black tracking-[0.2em] text-accent/40 uppercase"
            >
              #{tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
