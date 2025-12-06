import { getPreparations } from '@/services/api/preparation';
import Link from 'next/link';
import { BrainCircuit, ArrowRight, BookOpen } from 'lucide-react';
import FAQSection from '@/components/FAQ/FAQSection';
import { interviewPrepFAQs } from '@/lib/faq-data';

export const dynamic = 'force-dynamic';

export default async function PreparationPage() {
  const preparations = await getPreparations();

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-0 py-24 md:py-32">
      <div className="mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-6 border border-accent/20">
          <BrainCircuit size={14} />
          AI Interview Prep
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
          Master Your <span className="text-accent">Interview</span>
        </h1>
        <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
          Explore curated preparation guides or start a new interactive session with our AI interviewer.
        </p>
      </div>

      {preparations.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <BookOpen size={24} className="text-accent" />
            Your Study Guides & Sessions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preparations.map((prep) => (
              <Link
                key={prep._id}
                href={`/interview-prep/${prep.slug}`}
                className="group bg-white/5 border border-white/10 p-8 flex flex-col justify-between min-h-[280px] hover:border-accent/50 hover:bg-white/10 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 bg-white/5 flex items-center justify-center group-hover:text-accent transition-colors">
                      <BookOpen size={20} />
                    </div>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${prep.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      prep.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                      {prep.difficulty}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                    {prep.topic}
                  </h3>
                  <p className="text-foreground/60 line-clamp-3 text-sm leading-relaxed">
                    {prep.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground/40 group-hover:text-foreground mt-8 transition-colors uppercase tracking-wider">
                  Read Guide <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-16 mt-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <BrainCircuit size={24} className="text-accent" />
          Start a New Practice Session
        </h2>
        <Link
          href="/interview-prep/new"
          className="group relative overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5"
        >
          <div className="relative z-10 text-center md:text-left flex-1">
            <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight text-foreground group-hover:text-accent transition-colors">
              Custom AI Interview Session
            </h3>
            <p className="text-foreground/60 font-medium leading-relaxed">
              Launch a personalized interview session tailored to your topic and difficulty level.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3 font-bold mt-6 text-accent uppercase tracking-wider text-sm">
              <span className="bg-accent text-black px-5 py-2.5 hover:bg-white transition-colors flex items-center gap-2">
                Begin Setup <ArrowRight size={16} />
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-accent/20">
              <BrainCircuit size={40} className="text-accent" />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>
      </div>

      <FAQSection
        faqs={interviewPrepFAQs}
        title="Interview Prep FAQs"
        description="Common questions about AI-powered interview preparation."
      />
    </main>
  );
}
