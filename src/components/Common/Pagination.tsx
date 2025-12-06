import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  pages.push(1);

  if (currentPage > 3) {
    pages.push('...');
  }

  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (currentPage < totalPages - 2) {
    if (!pages.includes('...')) {
      pages.push('...');
    }
  }

  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 py-12">
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="flex items-center gap-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 transition-all text-sm"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </Link>
      ) : (
        <div className="flex items-center gap-1 px-4 py-2 bg-white/5 border border-white/5 text-foreground/30 text-sm cursor-not-allowed">
          <ChevronLeft size={16} />
          <span>Previous</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-foreground/40">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={`${basePath}?page=${pageNum}`}
              className={`px-4 py-2 text-sm border transition-all ${isActive
                  ? 'bg-accent text-black border-accent font-medium'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-accent/50'
                }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="flex items-center gap-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 transition-all text-sm"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <div className="flex items-center gap-1 px-4 py-2 bg-white/5 border border-white/5 text-foreground/30 text-sm cursor-not-allowed">
          <span>Next</span>
          <ChevronRight size={16} />
        </div>
      )}
    </div>
  );
}
