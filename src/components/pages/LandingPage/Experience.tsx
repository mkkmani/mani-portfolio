'use client';

import { Code2, Cpu, Terminal, GitBranch } from 'lucide-react';

const experiences = [
  {
    role: 'SOFTWARE ENGINEER',
    company: 'PURECODE SOFTWARE',
    period: '2025.01 - PRESENT',
    focus: 'ARCHITECTING AI TOOLS',
    description: 'Developing the VS Code extension with Copilot-like AI integration for real-time code suggestions. Implementing advanced analytics to track user engagement and AI performance.',
    tags: ['VS CODE EXTENSION', 'AI INTEGRATION', 'ANALYTICS'],
    current: true,
    colSpan: 'md:col-span-2',
    icon: Code2,
  },
  {
    role: 'FRONTEND DEVELOPER',
    company: 'PURECODE SOFTWARE',
    period: '2024.10 - 2024.12',
    focus: 'AI COMPONENT ENGINE',
    description: 'Engineered the AI component generation flow, enabling text-to-UI transformation. Built the custom theme engine allowing users to apply design systems instantly.',
    tags: ['GENERATIVE AI', 'THEME ENGINE', 'SEO'],
    current: false,
    colSpan: 'md:col-span-1',
    icon: Cpu,
  },
  {
    role: 'QA ENGINEER',
    company: 'PURECODE SOFTWARE',
    period: '2024.05 - 2024.09',
    focus: 'RELIABILITY & TESTING',
    description: 'Tested the accuracy of AI-generated React and Tailwind components. Automated regression testing for the VS Code extension to maintain high stability standards.',
    tags: ['AUTOMATION', 'REGRESSION TESTING', 'QUALITY'],
    current: false,
    colSpan: 'md:col-span-1',
    icon: Terminal,
  },
  {
    role: 'FRONTEND INTERN',
    company: 'PURECODE SOFTWARE',
    period: '2024.01 - 2024.04',
    focus: 'UI FOUNDATIONS',
    description: 'Contributed to the initial dashboard UI and component library. Learned modern React patterns, state management, and industry best practices.',
    tags: ['REACT', 'UI LIBRARY', 'DASHBOARD'],
    current: false,
    colSpan: 'md:col-span-2',
    icon: GitBranch,
  },
];

export default function Experience() {
  return (
    <section className="py-32 px-6 bg-background border-t border-white/5 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-accent font-mono text-sm tracking-widest mb-4">[ CAREER_LOG ]</h2>
            <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">
              Experience
            </h3>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm text-foreground/40 font-mono">
              // LATEST_UPDATE: 2025.01<br />
              // STATUS: ACTIVE
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            const delay = index * 100;
            return (
              <div
                key={index}
                className={`group relative bg-white/[0.02] border border-white/10 hover:border-accent/50 transition-colors duration-300 p-8 ${exp.colSpan} animate-fade-in-up animation-delay-${delay}`}
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-accent transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-accent transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-accent transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-accent transition-colors" />

                <div className="flex flex-col h-full justify-between gap-8">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 border border-white/10  text-accent">
                        <Icon size={20} />
                      </div>
                      <span className="font-mono text-xs text-foreground/40 tracking-wider">
                        {exp.period}
                      </span>
                    </div>
                    {exp.current && (
                      <span className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 bg-accent  animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold mb-1 group-hover:text-accent transition-colors">
                      {exp.role}
                    </h4>
                    <p className="text-sm font-mono text-foreground/60 mb-6">
                      @{exp.company} // {exp.focus}
                    </p>
                    <p className="text-foreground/80 leading-relaxed max-w-2xl">
                      {exp.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                    {exp.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono text-foreground/40 bg-white/5 px-2 py-1  uppercase tracking-wider group-hover:text-foreground/60 transition-colors">
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
