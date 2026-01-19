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
  const delay = index * 100;
  return (
    <article className={`animate-fade-in-up animation-delay-${delay}`} itemScope itemType="https://schema.org/BlogPosting">
      <Link
        href={`/notelogs/${blog.slug}`}
        title={`${blog.title} - Notelog by Manikanta Ketha`}
        className="group block h-full bg-black border border-white/10 p-6 hover:border-accent/50 transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="text-[10px] font-mono text-accent uppercase tracking-widest mb-4">
            {new Date(blog.customDate || blog.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>

          <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-accent transition-colors line-clamp-2" itemProp="headline">
            {blog.title}
          </h3>

          <p className="text-sm text-foreground/60 leading-relaxed mb-6 line-clamp-3 flex-grow" itemProp="description">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex gap-2">
              {blog.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono px-2 py-1 bg-white/5 text-foreground/50 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            <ArrowUpRight
              size={18}
              className="text-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
