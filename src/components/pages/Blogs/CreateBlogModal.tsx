'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Eye, Edit3, Calendar, Image as ImageIcon, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editSlug?: string | null;
}

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  tags: '',
  image: '',
  customDate: '',
};

function toDateInput(value?: string | Date | null): string {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

export default function CreateBlogModal({ isOpen, onClose, onSuccess, editSlug }: CreateBlogModalProps) {
  const isEdit = !!editSlug;
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setActiveTab('edit');
    if (!editSlug) {
      setFormData(EMPTY_FORM);
      return;
    }
    let cancelled = false;
    setLoadingPost(true);
    (async () => {
      try {
        const res = await fetch(`/api/blogs/${editSlug}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load post');
        const blog = await res.json();
        if (cancelled) return;
        setFormData({
          title: blog.title || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
          image: blog.image || '',
          customDate: toDateInput(blog.customDate || blog.createdAt),
        });
      } catch {
        if (!cancelled) setError('Could not load this post for editing.');
      } finally {
        if (!cancelled) setLoadingPost(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, editSlug]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit check
        setError('Image size too large. Please upload an image smaller than 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload: Record<string, unknown> = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      image: formData.image,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (formData.customDate) payload.customDate = formData.customDate;
    if (!isEdit) payload.published = false;

    try {
      const res = await fetch(isEdit ? `/api/blogs/${editSlug}` : '/api/blogs', {
        method: isEdit ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData(EMPTY_FORM);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Failed to ${isEdit ? 'update' : 'create'} blog`);
      }
    } catch {
      setError(`An error occurred while ${isEdit ? 'updating' : 'creating'} the blog`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pb-20">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-background border border-white/10 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold uppercase tracking-tight">
            {isEdit ? 'Edit' : 'Create New'} <span className="text-accent">Notelog</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:text-accent transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {loadingPost ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6 border-b border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'edit' ? 'text-accent' : 'text-foreground/40 hover:text-foreground'}`}
              >
                <div className="flex items-center gap-2">
                  <Edit3 size={14} /> Edit
                </div>
                {activeTab === 'edit' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === 'preview' ? 'text-accent' : 'text-foreground/40 hover:text-foreground'}`}
              >
                <div className="flex items-center gap-2">
                  <Eye size={14} /> Preview
                </div>
                {activeTab === 'preview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
              </button>
            </div>

            <form onSubmit={handleSubmit} className={`${activeTab === 'preview' ? 'hidden' : 'space-y-6'}`}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors"
                  placeholder="Enter blog title..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                  Excerpt
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors h-24 resize-none"
                  placeholder="A short summary of the blog post..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                  Content (Markdown)
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors h-64 font-mono text-sm"
                  placeholder="# Start writing..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors"
                    placeholder="Next.js, React, SEO..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                    Header Image (Upload)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video bg-white/5 border border-white/10 hover:border-accent/50 transition-all cursor-pointer flex flex-col items-center justify-center relative group overflow-hidden"
                  >
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Upload preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold uppercase tracking-widest">
                          Change Image
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-foreground/40">
                        <Upload size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Click to upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">
                  Post Date (the date shown on the post)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.customDate}
                    onChange={(e) => setFormData({ ...formData, customDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-accent outline-none transition-colors appearance-none"
                  />
                  <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 border border-white/10 hover:bg-white/5 transition-colors font-bold uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-accent text-background hover:bg-accent/90 transition-colors font-bold uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {loading ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save Changes' : 'Create Post'}
                </button>
              </div>
            </form>

            {activeTab === 'preview' && (
              <div className="space-y-8 animate-fade-in pt-4">
                {formData.image && (
                  <div className="aspect-video w-full bg-white/5 border border-white/10 overflow-hidden relative">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={12} className="text-accent" /> Image Preview
                    </div>
                  </div>
                )}

                <div className="prose prose-invert max-w-none prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
                  <h1 className="text-4xl font-bold mb-4">{formData.title || 'Untitled Blog Post'}</h1>
                  {formData.excerpt && (
                    <p className="text-xl text-foreground/60 italic border-l-4 border-accent pl-6 py-2 mb-8 bg-white/5">
                      {formData.excerpt}
                    </p>
                  )}
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content || '*No content yet...*'}
                    </ReactMarkdown>
                  </div>
                  {formData.customDate && (
                    <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-foreground/40 font-mono uppercase tracking-widest">
                      <Calendar size={12} />
                      Post Date: {new Date(formData.customDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
