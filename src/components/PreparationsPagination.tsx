'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
    return null;
  }

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
        <BookOpen size={24} className="text-accent" />
        {isUserSession ? 'Your Study Guides & Sessions' : 'Public Study Guides'}
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPreparations.map((prep) => (
          <Link
            key={prep._id}
            href={`/interview-prep/${prep.slug}`}
            className="group bg-white/5 border border-white/10 p-8 flex flex-col justify-between min-h-[280px] hover:border-accent/50 hover:bg-white/10 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 bg-white/5 flex items-center justify-center group-hover:text-accent transition-colors">
                  <BookOpen size={20} />
                </div>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${prep.difficulty === 'Beginner'
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : prep.difficulty === 'Intermediate'
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                  {prep.difficulty}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2 capitalize">
                {prep.topic}
              </h3>
              {prep.excerpt && !prep.excerpt.startsWith('AI-generated preparation guide') && (
                <p className="text-foreground/60 line-clamp-3 text-sm leading-relaxed">
                  {prep.excerpt}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-foreground/40 group-hover:text-foreground mt-8 transition-colors uppercase tracking-wider">
              Read Guide <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page">
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[40px] h-10 px-3 border font-bold text-sm transition-all ${currentPage === page
                  ? 'bg-accent text-black border-accent'
                  : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent/50'
                  }`}>
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next page">
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Page info */}
      {totalPages > 1 && (
        <div className="mt-4 text-center text-sm text-foreground/50">
          Showing {startIndex + 1}-{Math.min(endIndex, preparations.length)} of {preparations.length} guides
        </div>
      )}
    </div>
  );
}
