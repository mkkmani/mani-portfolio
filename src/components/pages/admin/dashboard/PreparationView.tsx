import { ArrowRight, MessageSquare } from "lucide-react";
import { IPreparation } from "@/services/api/preparation";

interface PreparationViewProps {
  preparations: IPreparation[];
  filter: 'all' | 'published' | 'draft';
  handleTogglePublish: (id: string, currentStatus: boolean) => void;
}

export default function PreparationView({ preparations, filter, handleTogglePublish }: PreparationViewProps) {
  const filteredPreparations = preparations.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'published') return p.published;
    if (filter === 'draft') return !p.published;
    return true;
  });

  return (
    <div className="grid gap-4">
      {filteredPreparations.map((prep) => (
        <div key={prep._id} className="group bg-black border border-white/10 p-6 hover:border-accent/50 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors">
              {prep.topic}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider border ${prep.published ? 'text-accent border-accent' : 'text-yellow-500 border-yellow-500'
                }`}>
                {prep.published ? 'Published' : 'Draft'}
              </span>
              <span className="text-[10px] font-bold px-2 py-1 uppercase tracking-wider border border-white/20 text-foreground/60">
                {prep.difficulty}
              </span>
            </div>
          </div>

          <p className="text-foreground/60 text-sm leading-relaxed mb-6 font-serif italic border-l-2 border-white/10 pl-4 line-clamp-2">
            {prep.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-white/5 text-[10px] font-mono text-foreground/40 border border-white/5">
                {prep.slug}
              </span>
              <span className="text-[10px] font-mono text-foreground/40">
                {new Date(prep.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-foreground/40">
                <MessageSquare size={10} />
                {prep.messages.length}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleTogglePublish(prep._id, prep.published)}
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-all ${prep.published
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                  }`}
              >
                {prep.published ? 'Unpublish' : 'Publish'}
              </button>
              <a
                href={`/interview-prep/${prep.slug}`}
                target="_blank"
                className="text-accent hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                View Session <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      ))}

      {filteredPreparations.length === 0 && (
        <div className="text-center py-20 text-foreground/40 border border-dashed border-white/10  font-serif italic">
          No preparation topics found.
        </div>
      )}
    </div>
  );
}
