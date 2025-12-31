'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowUpRight, BookOpen } from 'lucide-react';

interface Session {
  _id: string;
  slug: string;
  topic: string;
  difficulty: string;
  excerpt?: string;
  createdAt: string;
  messages: any[];
}

interface SessionsListProps {
  sessions: Session[];
}

export default function SessionsList({ sessions }: SessionsListProps) {
  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (sessions.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <BookOpen size={20} className="text-zinc-500" />
        </div>
        <h3 className="text-sm font-medium text-white mb-1">No sessions found</h3>
        <p className="text-sm text-zinc-500 mb-4">You haven't started any interview preparations yet.</p>
        <Link
          href="/interview-prep/new"
          className="text-sm font-medium text-accent hover:underline"
        >
          Start a new session
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
      </div>

      <div className="space-y-1">
        {/* Header Row (Hidden on mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          <div className="col-span-6">Topic</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Messages</div>
        </div>

        {sessions.map((session) => (
          <Link
            key={session._id}
            href={`/interview-prep/${session.slug}`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4 rounded-lg hover:bg-white/5 transition-colors items-center border border-transparent hover:border-white/5"
          >
            {/* Topic & Excerpt */}
            <div className="col-span-1 md:col-span-6">
              <div className="flex items-center gap-3">
                <div className={`
                  w-2 h-2 rounded-full shrink-0
                  ${session.difficulty === 'Beginner' ? 'bg-emerald-500' :
                    session.difficulty === 'Intermediate' ? 'bg-amber-500' :
                      'bg-rose-500'}
                `} />
                <div>
                  <h3 className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                    {session.topic}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5 md:hidden">
                    {mounted ? new Date(session.createdAt).toLocaleDateString() : ''} • {session.difficulty}
                  </p>
                </div>
              </div>
            </div>

            {/* Difficulty status (Desktop) */}
            <div className="hidden md:block col-span-2">
              <span className={`
                text-xs px-2 py-1 rounded font-medium
                ${session.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500' :
                  session.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-rose-500/10 text-rose-500'}
              `}>
                {session.difficulty}
              </span>
            </div>

            {/* Date (Desktop) */}
            <div className="hidden md:block col-span-2 text-sm text-zinc-400">
              {mounted ? new Date(session.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : <span className="opacity-0">Loading...</span>}
            </div>

            {/* Messages & Action */}
            <div className="hidden md:block col-span-2 text-right">
              <div className="flex items-center justify-end gap-2 text-sm text-zinc-400">
                <span>{session.messages?.length || 0}</span>
                <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* Mobile Action Icon */}
            <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600">
              <ArrowUpRight size={16} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
