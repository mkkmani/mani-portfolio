'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Preparation, FilterType } from './types';

export default function InterviewPrepManagement() {
  const router = useRouter();
  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchPreparations();
  }, []);

  const fetchPreparations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview-prep?all=true');
      if (res.ok) setPreparations(await res.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/interview-prep', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, published: !currentStatus })
      });
      if (res.ok) fetchPreparations();
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const filteredPreparations = preparations.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'published') return p.published;
    return !p.published;
  });

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/get-access" className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors mb-4 text-sm font-bold uppercase tracking-wider">
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Interview Prep <span className="text-accent">Management</span>
            </h1>
            <p className="text-foreground/60 text-lg">Manage AI-powered interview preparation topics ({preparations.length})</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          {(['all', 'published', 'draft'] as FilterType[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-accent text-background' : 'border border-foreground/10 text-foreground/60 hover:border-foreground/30'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPreparations.map((prep) => (
              <div key={prep._id} className="border border-foreground/10 bg-foreground/[0.02] p-6 hover:border-accent/30 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold group-hover:text-accent transition-colors mb-2">
                      {prep.topic}
                    </h3>
                    {prep.description && (
                      <p className="text-foreground/60 text-sm leading-relaxed">{prep.description}</p>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 uppercase tracking-wider whitespace-nowrap ${prep.published ? 'bg-accent/20 text-accent' : 'bg-foreground/10 text-foreground/40'}`}>
                    {prep.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-foreground/5 text-xs font-mono text-foreground/40 border border-foreground/5">
                      {prep.slug}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono text-foreground/40">
                      <Calendar size={12} />
                      {new Date(prep.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button onClick={() => handleTogglePublish(prep._id, prep.published)} className="text-xs font-bold uppercase tracking-wider hover:text-accent text-foreground/60 transition-colors">
                      {prep.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link href={`/interview-prep/${prep.slug}`} target="_blank" className="text-accent hover:text-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                      View <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {filteredPreparations.length === 0 && (
              <div className="text-center py-12 text-foreground/40">No preparations found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
