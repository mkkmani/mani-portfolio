'use client';

import Link from 'next/link';
import { Star, ArrowRight, Calendar } from 'lucide-react';
import type { Blog } from './types';

interface BlogListProps {
  blogs: Blog[];
  onTogglePublish: (id: string, currentStatus: boolean) => Promise<void>;
  onToggleFavourite: (id: string, currentStatus: boolean) => Promise<void>;
}

export default function BlogList({ blogs, onTogglePublish, onToggleFavourite }: BlogListProps) {
  return (
    <div className="grid gap-4">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="group border border-foreground/10 bg-foreground/[0.02] p-6 hover:border-accent/30 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold group-hover:text-accent transition-colors">
              {blog.title}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavourite(blog._id, blog.favourite)}
                className={`p-2 transition-all ${blog.favourite
                    ? 'bg-accent text-background'
                    : 'border border-foreground/10 text-foreground/40 hover:text-foreground'
                  }`}
                title={blog.favourite ? 'Remove from favourites' : 'Add to favourites'}
              >
                <Star size={14} fill={blog.favourite ? 'currentColor' : 'none'} />
              </button>
              <span
                className={`text-xs font-bold px-3 py-1.5 uppercase tracking-wider ${blog.published
                    ? 'bg-accent/20 text-accent'
                    : 'bg-foreground/10 text-foreground/40'
                  }`}
              >
                {blog.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>

          <p className="text-foreground/60 text-sm leading-relaxed mb-6 border-l-2 border-foreground/10 pl-4 italic">
            {blog.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-foreground/5 text-xs font-mono text-foreground/40 border border-foreground/5">
                {blog.slug}
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-foreground/40">
                <Calendar size={12} />
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onTogglePublish(blog._id, blog.published)}
                className="text-xs font-bold uppercase tracking-wider hover:text-accent text-foreground/60 transition-colors"
              >
                {blog.published ? 'Unpublish' : 'Publish'}
              </button>
              <Link
                href={`/notelogs/${blog.slug}`}
                target="_blank"
                className="text-accent hover:text-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                View Post <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {blogs.length === 0 && (
        <div className="text-center py-12 text-foreground/40">
          <p>No blogs found</p>
        </div>
      )}
    </div>
  );
}
