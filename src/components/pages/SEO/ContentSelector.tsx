'use client';

import type { ContentItem } from './types';

interface ContentSelectorProps {
  blogs: ContentItem[];
  preparations: ContentItem[];
  selectedUrls: string[];
  onToggle: (slug: string, type: 'blog' | 'prep') => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export default function ContentSelector({
  blogs,
  preparations,
  selectedUrls,
  onToggle,
  onSelectAll,
  onClearSelection
}: ContentSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onSelectAll}
          className="px-4 py-2 bg-accent text-background font-bold uppercase tracking-wider text-sm hover:bg-accent/90 transition-colors"
        >
          Select All Published
        </button>
        <button
          onClick={onClearSelection}
          className="px-4 py-2 border border-foreground/10 text-foreground/70 font-bold uppercase tracking-wider text-sm hover:bg-foreground/5 transition-colors"
        >
          Clear ({selectedUrls.length})
        </button>
      </div>

      {/* Blogs Section */}
      <div>
        <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-foreground/70">
          Blogs <span className="text-foreground/40">({blogs.length})</span>
        </h3>
        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
          {blogs.map((blog) => {
            const url = `/notelogs/${blog.slug}`;
            const isSelected = selectedUrls.includes(url);

            return (
              <label
                key={blog.slug}
                className={`flex items-center gap-3 p-3 border cursor-pointer transition-all ${isSelected
                    ? 'border-accent/30 bg-accent/5'
                    : 'border-foreground/10 bg-foreground/[0.02] hover:border-foreground/20 hover:bg-foreground/[0.04]'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(blog.slug, 'blog')}
                  className="w-4 h-4 accent-accent cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{blog.title}</div>
                  <div className="text-xs font-mono text-foreground/40 truncate">{url}</div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${blog.published
                      ? 'bg-accent/20 text-accent'
                      : 'bg-foreground/10 text-foreground/40'
                    }`}
                >
                  {blog.published ? 'Published' : 'Draft'}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Preparations Section */}
      <div>
        <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-foreground/70">
          Interview Prep <span className="text-foreground/40">({preparations.length})</span>
        </h3>
        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
          {preparations.map((prep) => {
            const url = `/interview-prep/${prep.slug}`;
            const isSelected = selectedUrls.includes(url);

            return (
              <label
                key={prep.slug}
                className={`flex items-center gap-3 p-3 border cursor-pointer transition-all ${isSelected
                    ? 'border-accent/30 bg-accent/5'
                    : 'border-foreground/10 bg-foreground/[0.02] hover:border-foreground/20 hover:bg-foreground/[0.04]'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(prep.slug, 'prep')}
                  className="w-4 h-4 accent-accent cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{prep.topic}</div>
                  <div className="text-xs font-mono text-foreground/40 truncate">{url}</div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${prep.published
                      ? 'bg-accent/20 text-accent'
                      : 'bg-foreground/10 text-foreground/40'
                    }`}
                >
                  {prep.published ? 'Published' : 'Draft'}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
