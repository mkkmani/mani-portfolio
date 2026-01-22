'use client';

import { Code2, Cpu, Terminal, GitBranch } from 'lucide-react';

const experiences = [
  {
    role: 'SOFTWARE ENGINEER',
    company: 'PURECODE SOFTWARE',
    period: '2025.01 - PRESENT',
    focus: 'AI ARCHITECTURE',
    description: 'developing purecode vs code extension with copilot-grade ai interaction. architecting real-time systems and advanced full-stack analytics.',
    tags: ['VS CODE EXTENSION', 'MERN STACK', 'ANALYTICS'],
    current: true,
  },
  {
    role: 'FRONTEND DEVELOPER',
    company: 'PURECODE SOFTWARE',
    period: '2024.10 - 2024.12',
    focus: 'AI COMPONENT ENGINE',
    description: 'engineered text-to-ui transformation engine. built custom theme systems allowing instant application of design tokens.',
    tags: ['GENERATIVE AI', 'THEME ENGINE', 'NEXT.JS', 'TYPESCRIPT'],
    current: false,
  },
  {
    role: 'QA ENGINEER',
    company: 'PURECODE SOFTWARE',
    period: '2024.05 - 2024.09',
    focus: 'RELIABILITY',
    description: 'automated accuracy testing for ai-generated react components. ensuring high stability and performance standards.',
    tags: ['AUTOMATION', 'REGRESSION', 'QUALITY'],
    current: false,
  },
];

export default function Experience() {
  return (
    <section className="py-48 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ LOG.01 // EXPERIENCE ]
            </span>
            <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
              Career Path
            </h3>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/20 md:text-right leading-relaxed">
            // LATEST_UPDATE: 2025.01<br />
            // STATUS: SYSTEM_ACTIVE
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {experiences.map((exp, index) => {
            return (
              <div
                key={index}
                className="group border-t border-white/5 py-12 flex flex-col md:grid md:grid-cols-12 gap-8 hover:bg-white/[0.01] transition-all duration-500 px-4"
              >
                <div className="md:col-span-2 flex flex-col gap-2">
                  <span className="font-black text-[10px] tracking-widest text-foreground/20">
                    {exp.period}
                  </span>
                  {exp.current && (
                    <span className="flex items-center gap-2 text-accent text-[8px] font-black tracking-widest uppercase">
                      <span className="w-1 h-1 bg-accent" />
                      Current
                    </span>
                  )}
                </div>

                <div className="md:col-span-6 flex flex-col gap-4">
                  <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight group-hover:text-accent transition-colors duration-300">
                    {exp.role}
                  </h4>
                  <p className="text-foreground/40 text-sm leading-relaxed max-w-xl lowercase italic">
                    {exp.description}
                  </p>
                </div>

                <div className="md:col-span-4 flex flex-col md:items-end justify-between gap-8 md:text-right">
                  <div className="space-y-1">
                    <span className="block text-[8px] uppercase tracking-[0.3em] font-black text-foreground/40">Company</span>
                    <span className="block text-sm font-black uppercase tracking-widest text-white/80">@{exp.company}</span>
                  </div>

                  <div className="flex flex-wrap md:justify-end gap-3 pt-6">
                    {exp.tags.map((tag, i) => (
                      <span key={i} className="text-[8px] font-black tracking-widest text-foreground/20 border border-white/5 px-2 py-1 uppercase group-hover:border-accent/20 group-hover:text-accent transition-all duration-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
