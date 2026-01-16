'use client';

import { Code2, Cpu, Terminal, GitBranch, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const experiences = [
  {
    role: 'SOFTWARE ENGINEER',
    company: 'PURECODE SOFTWARE',
    period: '2025.01 - PRESENT',
    focus: 'ARCHITECTING AI TOOLS',
    description: 'Developing PureCode VS Code extension with Copilot-like AI integration. Architecting real-time MERN stack backends and React frontends for code suggestions. Implementing advanced full-stack analytics to track user engagement.',
    tags: ['VS CODE EXTENSION', 'AI INTEGRATION', 'ANALYTICS', 'NODE.JS', 'MONGODB'],
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
    tags: ['GENERATIVE AI', 'THEME ENGINE', 'SEO', 'NEXT.JS', 'TYPESCRIPT'],
    current: false,
    colSpan: 'md:col-span-1',
    icon: Cpu,
  },
  {
    role: 'QA ENGINEER',
    company: 'PURECODE SOFTWARE',
    period: '2024.05 - 2024.09',
    focus: 'RELIABILITY & TESTING',
    description: 'Tested the accuracy of AI-generated React and Tailwind components. Ensuring high stability standards through automated regression testing and quality assurance patterns.',
    tags: ['AUTOMATION', 'REGRESSION TESTING', 'QUALITY', 'PLAYWRIGHT'],
    current: false,
    colSpan: 'md:col-span-1',
    icon: Terminal,
  },
  {
    role: 'FRONTEND INTERN',
    company: 'PURECODE SOFTWARE',
    period: '2024.01 - 2024.04',
    focus: 'UI FOUNDATIONS',
    description: 'Contributed to the initial dashboard UI and component library. Learned modern React patterns, state management, and industry best practices while collaborating with senior engineers.',
    tags: ['REACT', 'UI LIBRARY', 'DASHBOARD', 'CSS'],
    current: false,
    colSpan: 'md:col-span-2',
    icon: GitBranch,
  },
];

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-4">
            Professional <span className="text-accent">Experience</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed">
            A comprehensive log of my professional journey, technical achievements, and the digital products I've helped build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            const delay = index * 100;
            return (
              <div
                key={index}
                className={`group relative bg-white/[0.02] border border-white/10 hover:border-accent/50 transition-colors duration-300 p-8 ${exp.colSpan} animate-fade-in-up`}
                style={{ animationDelay: `${delay}ms` }}
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-accent transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-accent transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-accent transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-accent transition-colors" />

                <div className="flex flex-col h-full justify-between gap-8">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 border border-white/10 text-accent">
                        <Icon size={20} />
                      </div>
                      <span className="font-mono text-xs text-foreground/40 tracking-wider">
                        {exp.period}
                      </span>
                    </div>
                    {exp.current && (
                      <span className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-1 group-hover:text-accent transition-colors">
                      {exp.role}
                    </h2>
                    <p className="text-sm font-mono text-foreground/60 mb-6 uppercase tracking-wider">
                      @{exp.company} // {exp.focus}
                    </p>
                    <p className="text-foreground/80 leading-relaxed max-w-3xl">
                      {exp.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                    {exp.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono text-foreground/40 bg-white/5 px-2 py-1 uppercase tracking-wider group-hover:text-foreground/60 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 p-12 bg-accent/5 border border-accent/20 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4 uppercase">Let's build something together</h3>
            <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
            <Link
              href="/contact"
              className="px-8 py-4 bg-accent text-background font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all inline-block"
            >
              Get in Touch
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        </div>
      </div>
    </main>
  );
}
