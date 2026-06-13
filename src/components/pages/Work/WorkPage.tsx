import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const experiences = [
  {
    role: 'SOFTWARE ENGINEER',
    company: 'PURECODE SOFTWARE',
    period: '2025.01 - PRESENT',
    focus: 'ARCHITECTING AI TOOLS',
    description: 'developing purecode vs code extension with copilot-like ai integration. architecting real-time mern stack backends and react frontends for code suggestions.',
    tags: ['VS CODE', 'AI', 'MERN'],
    current: true,
  },
  {
    role: 'FRONTEND DEVELOPER',
    company: 'PURECODE SOFTWARE',
    period: '2024.10 - 2024.12',
    focus: 'AI COMPONENT ENGINE',
    description: 'engineered the ai component generation flow, enabling text-to-ui transformation. built the custom theme engine.',
    tags: ['GEN-AI', 'NEXT.JS'],
    current: false,
  },
  {
    role: 'QA ENGINEER',
    company: 'PURECODE SOFTWARE',
    period: '2024.05 - 2024.09',
    focus: 'RELIABILITY & TESTING',
    description: 'tested the accuracy of ai-generated react and tailwind components. ensuring high stability standards.',
    tags: ['TESTING', 'QA'],
    current: false,
  },
  {
    role: 'FRONTEND INTERN',
    company: 'PURECODE SOFTWARE',
    period: '2024.01 - 2024.04',
    focus: 'UI FOUNDATIONS',
    description: 'contributed to the initial dashboard ui and component library. learned modern react patterns.',
    tags: ['REACT', 'UI'],
    current: false,
  },
];

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-black pt-8 md:pt-12 pb-24 px-6 md:pl-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ LOG.02 // CAREER ]
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif uppercase tracking-tighter text-white whitespace-nowrap">
              Work History
            </h1>
          </div>

          <Link
            href="/"
            className="group flex items-center gap-3 shrink-0 px-5 py-3 border border-white/10 hover:border-accent hover:bg-accent/5 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 hover:text-accent transition-all duration-500"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>
        </div>

        <div className="mb-32">
          <p className="text-xl md:text-2xl text-foreground/50 leading-[1.3] font-light lowercase max-w-2xl italic">
            a strategic overview of professional engagements. documenting the evolution of <span className="text-white italic">technical proficiency</span> and leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group bg-black p-12 hover:bg-white/2 transition-all relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-12">
                <span className="text-[8px] font-black tracking-[0.5em] text-foreground/20 uppercase">
                  {exp.period}
                </span>
                {exp.current && (
                  <span className="text-[8px] font-black tracking-[0.5em] text-accent uppercase">
                    [ ACTIVE_ENGAGEMENT ]
                  </span>
                )}
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white/90 group-hover:text-white transition-colors">
                  {exp.role}
                </h2>
                <div className="flex items-baseline gap-4">
                  <span className="text-[10px] font-black tracking-widest text-accent uppercase">{exp.company}</span>
                  <span className="text-[10px] font-black tracking-widest text-foreground/20 uppercase">// {exp.focus}</span>
                </div>
                <p className="text-lg text-foreground/40 font-light lowercase leading-relaxed italic max-w-xl">
                  {exp.description}
                </p>
              </div>

              <div className="mt-12 pt-12 border-t border-white/5 flex flex-wrap gap-4">
                {exp.tags.map((tag, i) => (
                  <span key={i} className="text-[8px] font-black tracking-[0.3em] text-foreground/20 uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="py-48 border-t border-white/5 mt-32">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-center md:text-left">
              LOOKING FOR AN<br />ARCHITECT?
            </h2>
            <div className="flex gap-12">
              <Link
                href="/contact"
                className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-accent border-b border-accent/20 pb-2 hover:border-accent transition-all duration-500"
              >
                Inquire
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
