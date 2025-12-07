'use client';

import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/config';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10 relative">
        <div
          className="max-w-4xl animate-fade-in-up"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-accent" />
            <span className="text-accent uppercase tracking-[0.2em] text-sm font-medium">Portfolio 2025</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight mb-8">
            <span className="block text-foreground">MANI</span>
            <span className="block text-foreground/40">KANTA</span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl leading-relaxed mb-12 font-light">
            Crafting digital experiences where <span className="text-accent italic">aesthetics</span> meet <span className="text-white font-medium">functionality</span>.
            Full-stack developer specializing in building exceptional web applications.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#projects"
              className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-bold hover:bg-accent transition-colors"
            >
              View Projects
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="flex items-center gap-4 px-6 py-4 border border-white/10 bg-white/5 backdrop-blur-sm">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit GitHub profile"
                className="p-2 hover:text-accent transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit LinkedIn profile"
                className="p-2 hover:text-accent transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                aria-label="Send email"
                className="p-2 hover:text-accent transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div
          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 animate-fade-in"
          style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
        >
          <div className="flex flex-col gap-8 text-right">
            <div className="space-y-2">
              <span className="block text-xs uppercase tracking-widest text-foreground/40">Location</span>
              <span className="block text-lg">India</span>
            </div>
            <div className="space-y-2">
              <span className="block text-xs uppercase tracking-widest text-foreground/40">Available For</span>
              <span className="block text-lg text-accent">Freelance Projects</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
