'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (sessions.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-white/5">
        <BookOpen size={24} className="text-foreground/10 mb-6" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">
          // NO_LOGS_FOUND_IN_REGISTRY
        </h3>
        <Link
          href="/interview-prep/new"
          className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-white transition-all"
        >
          Initialize Transmission →
        </Link>
      </div>
    );
  }

  return (
    <div className="py-24">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/40">
          [ LOG.ACTIVITY // PERSISTENT ]
        </h2>
      </div>

      <div className="space-y-px bg-white/5 border border-white/5">
        {/* Header Row (Hidden on mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-px bg-white/5">
          <div className="col-span-6 p-6 bg-black text-[8px] font-black text-foreground/20 uppercase tracking-[0.3em]">Module Topic</div>
          <div className="col-span-2 p-6 bg-black text-[8px] font-black text-foreground/20 uppercase tracking-[0.3em]">Complexity</div>
          <div className="col-span-2 p-6 bg-black text-[8px] font-black text-foreground/20 uppercase tracking-[0.3em]">Timestamp</div>
          <div className="col-span-2 p-6 bg-black text-[8px] font-black text-foreground/20 uppercase tracking-[0.3em] text-right">Packets</div>
        </div>

        {sessions.map((session) => (
          <Link
            key={session._id}
            href={`/interview-prep/${session.slug}`}
            className="group grid grid-cols-1 md:grid-cols-12 gap-px bg-white/5 hover:bg-white/[0.05] transition-all items-center relative"
          >
            {/* Topic */}
            <div className="col-span-1 md:col-span-6 p-8 bg-black group-hover:bg-transparent transition-colors">
              <div className="flex items-center gap-6">
                <div className={`
                  w-1 h-8
                  ${session.difficulty === 'Beginner' ? 'bg-green-500/20' :
                    session.difficulty === 'Intermediate' ? 'bg-accent' :
                      'bg-red-500/20'}
                `} />
                <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-accent transition-colors">
                  {session.topic}
                </h3>
              </div>
            </div>

            {/* Difficulty status (Desktop) */}
            <div className="hidden md:block col-span-2 p-8 bg-black group-hover:bg-transparent transition-colors">
              <span className={`
                text-[8px] font-black uppercase tracking-[0.3em]
                ${session.difficulty === 'Beginner' ? 'text-green-500/40' :
                  session.difficulty === 'Intermediate' ? 'text-accent' :
                    'text-red-500/40'}
              `}>
                [ {session.difficulty} ]
              </span>
            </div>

            {/* Date (Desktop) */}
            <div className="hidden md:block col-span-2 p-8 bg-black group-hover:bg-transparent transition-colors text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
              {mounted ? new Date(session.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : '00.00.0000'}
            </div>

            {/* Messages & Action */}
            <div className="hidden md:block col-span-2 p-8 bg-black group-hover:bg-transparent transition-colors text-right">
              <div className="flex items-center justify-end gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 group-hover:text-white transition-colors">
                <span>{session.messages?.length || 0}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden absolute right-8 top-1/2 -translate-y-1/2 text-accent">
              <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
