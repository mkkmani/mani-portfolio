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

interface ContentListProps {
  title: string;
  type: 'blog' | 'prep';
  urlPrefix: string;
  items: ContentItem[];
  selectedUrls: string[];
  onToggle: (slug: string, type: 'blog' | 'prep') => void;
}

function ContentList({ title, type, urlPrefix, items, selectedUrls, onToggle }: ContentListProps) {
  return (
    <div className="border border-foreground/10 bg-foreground/2 flex flex-col min-h-0">
      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70 px-4 py-3 border-b border-foreground/10 flex items-center justify-between">
        {title}
        <span className="text-foreground/40">{items.length}</span>
      </h3>
      <div className="p-2 space-y-1.5 max-h-104 overflow-y-auto custom-scrollbar">
        {items.length === 0 && (
          <div className="text-center py-8 text-sm text-foreground/30">No content</div>
        )}
        {items.map((item) => {
          const label = item.title ?? item.topic ?? item.slug;
          const url = `${urlPrefix}/${item.slug}`;
          const isSelected = selectedUrls.includes(url);

          return (
            <label
              key={item.slug}
              className={`flex items-center gap-3 p-2.5 border cursor-pointer transition-all ${isSelected
                ? 'border-accent/30 bg-accent/5'
                : 'border-transparent hover:border-foreground/10 hover:bg-foreground/4'
                }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(item.slug, type)}
                className="w-4 h-4 accent-accent cursor-pointer shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground truncate">{label}</div>
                <div className="text-xs font-mono text-foreground/40 truncate">{url}</div>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 ${item.published
                  ? 'bg-accent/20 text-accent'
                  : 'bg-foreground/10 text-foreground/40'
                  }`}
              >
                {item.published ? 'Published' : 'Draft'}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
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
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap items-center">
        <button
          onClick={onSelectAll}
          className="px-4 py-2 border border-foreground/20 text-foreground/70 font-bold uppercase tracking-wider text-xs hover:bg-foreground/5 transition-colors"
        >
          Select All Published
        </button>
        <button
          onClick={onClearSelection}
          className="px-4 py-2 border border-foreground/10 text-foreground/50 font-bold uppercase tracking-wider text-xs hover:bg-foreground/5 transition-colors"
        >
          Clear
        </button>
        <span className="text-xs text-foreground/40 uppercase tracking-wider">
          {selectedUrls.length} selected
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ContentList
          title="Blogs"
          type="blog"
          urlPrefix="/notelogs"
          items={blogs}
          selectedUrls={selectedUrls}
          onToggle={onToggle}
        />
        <ContentList
          title="Interview Prep"
          type="prep"
          urlPrefix="/interview-prep"
          items={preparations}
          selectedUrls={selectedUrls}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
}
