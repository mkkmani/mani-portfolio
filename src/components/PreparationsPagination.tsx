import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import Pagination from '@/components/Common/Pagination';

interface Preparation {
  _id: string;
  slug: string;
  topic: string;
  excerpt: string;
  difficulty: string;
}

interface PreparationsListProps {
  preparations: Preparation[];
  isUserSession: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
}

export default function PreparationsList({
  preparations,
  isUserSession,
  total,
  currentPage,
  totalPages,
}: PreparationsListProps) {
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
          COUNT: {total}
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
        {preparations.map((prep) => (
          <Link
            key={prep._id}
            href={`/interview-prep/${prep.slug}`}
            className="group bg-black p-10 hover:bg-white/2 transition-all relative overflow-hidden flex flex-col justify-between min-h-[320px]"
          >
            <div>
              <div className="flex items-center justify-between mb-12">
                <BookOpen size={16} className="text-foreground/20 group-hover:text-accent transition-colors" />
                <span
                  className={`text-[8px] font-black uppercase tracking-[0.3em] ${
                    prep.difficulty === 'Beginner'
                      ? 'text-green-500/60'
                      : prep.difficulty === 'Intermediate'
                        ? 'text-accent'
                        : 'text-red-500/60'
                  }`}
                >
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

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/interview-prep" />
    </div>
  );
}
