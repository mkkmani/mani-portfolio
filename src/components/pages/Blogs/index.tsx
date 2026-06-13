'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BlogList from './BlogList';
import CreateBlogModal from './CreateBlogModal';
import type { Blog, FilterType } from './types';
import { Plus } from 'lucide-react';

export default function BlogsManagement() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs?all=true', {
        credentials: 'include'
      });
      if (res.ok) {
        setBlogs(await res.json());
      } else if (res.status === 401) {
        router.push('/get-access/login');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ _id: id, published: !currentStatus })
      });

      if (res.ok) {
        fetchBlogs();
      } else if (res.status === 401) {
        router.push('/get-access/login');
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleToggleFavourite = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ _id: id, favourite: !currentStatus })
      });

      if (res.ok) {
        fetchBlogs();
      } else if (res.status === 401) {
        router.push('/get-access/login');
      }
    } catch (error) {
      console.error('Toggle favourite error:', error);
    }
  };

  const filteredBlogs = blogs.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'published') return b.published;
    return !b.published;
  });

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/get-access"
              className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors mb-4 text-sm font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Notelogs <span className="text-accent">Management</span>
            </h1>
            <p className="text-foreground/60 text-lg">
              Manage your blog posts and articles ({blogs.length})
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-bold uppercase tracking-widest text-xs hover:bg-accent/90 transition-colors"
          >
            <Plus size={16} />
            Add Notelog
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8">
          {(['all', 'published', 'draft'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${filter === f
                ? 'bg-accent text-background'
                : 'border border-foreground/10 text-foreground/60 hover:border-foreground/30'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <BlogList
            blogs={filteredBlogs}
            onTogglePublish={handleTogglePublish}
            onToggleFavourite={handleToggleFavourite}
            onEdit={(slug) => setEditSlug(slug)}
          />
        )}

        <CreateBlogModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchBlogs}
        />

        {/* Edit (same modal, prefilled from the selected post) */}
        <CreateBlogModal
          isOpen={!!editSlug}
          editSlug={editSlug}
          onClose={() => setEditSlug(null)}
          onSuccess={fetchBlogs}
        />
      </div>
    </div>
  );
}
