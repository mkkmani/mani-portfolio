'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface Preparation {
  _id: string;
  slug: string;
  topic: string;
  excerpt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface PreparationsPaginationProps {
  preparations: Preparation[];
  isUserSession: boolean;
}

const ITEMS_PER_PAGE = 9;

export default function PreparationsPagination({
  preparations,
  isUserSession
}: PreparationsPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(preparations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPreparations = preparations.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (preparations.length === 0) {
    return (
      <div className="py-24 border border-dashed border-white/10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">
          // NO_LOGS_FOUND_IN_REGISTRY
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-tighter text-white">
          {isUserSession ? 'Personal Registry' : 'Public Archives'}
        </h2>
        <span className="text-[10px] font-black tracking-[0.3em] text-foreground/20 uppercase">
          COUNT: {preparations.length}
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
        {currentPreparations.map((prep) => (
          <Link
            key={prep._id}
            href={`/interview-prep/${prep.slug}`}
            className="group bg-black p-10 hover:bg-white/[0.02] transition-all relative overflow-hidden flex flex-col justify-between min-h-[320px]"
          >
            <div>
              <div className="flex items-center justify-between mb-12">
                <BookOpen size={16} className="text-foreground/20 group-hover:text-accent transition-colors" />
                <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${prep.difficulty === 'Beginner' ? 'text-green-500/60' :
                    prep.difficulty === 'Intermediate' ? 'text-accent' : 'text-red-500/60'
                  }`}>
                  [ {prep.difficulty} ]
                </span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-6 group-hover:text-accent transition-colors">
                {prep.topic}
              </h3>
              {prep.excerpt && (
                <p className="text-sm text-foreground/40 font-light lowercase leading-relaxed italic line-clamp-3">
                  {prep.excerpt}
                </p>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 group-hover:text-white transition-all">
              Initialize
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pt-12 flex flex-col items-center gap-12">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-4 border border-white/10 hover:border-accent disabled:opacity-20 transition-all text-white"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 flex items-center justify-center text-[10px] font-black transition-all ${currentPage === page ? 'bg-white text-black' : 'border border-white/5 text-foreground/40 hover:border-white/20'
                    }`}
                >
                  {page.toString().padStart(2, '0')}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-4 border border-white/10 hover:border-accent disabled:opacity-20 transition-all text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="text-[8px] font-black uppercase tracking-[0.5em] text-foreground/20">
            PAGE {currentPage} // {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}
