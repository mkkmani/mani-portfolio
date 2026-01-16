'use client';

import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SOCIAL_LINKS } from '@/lib/config';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-accent" />
              <span className="text-accent uppercase tracking-[0.2em] text-sm font-medium">Portfolio 2026</span>
            </div>

            {/* Visually Hidden H1 for SEO */}
            <h1 className="sr-only">Manikanta Ketha - Full Stack MERN Developer | Next.js Expert</h1>

            <div className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight mb-8" aria-hidden="true">
              <span className="block text-foreground">MANI</span>
              <span className="block text-foreground/40">KANTA</span>
            </div>

            <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl leading-relaxed mb-12 font-light">
              Crafting digital experiences where <span className="text-accent italic">aesthetics</span> meet <span className="text-white font-medium">functionality</span>.
              Specializing in building exceptional web applications with a focus on human-centered design.
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
                  aria-label="Visit Manikanta Ketha's GitHub profile"
                  title="GitHub Profile - Manikanta Ketha"
                  className="p-2 hover:text-accent transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Manikanta Ketha's LinkedIn profile"
                  title="LinkedIn Profile - Manikanta Ketha"
                  className="p-2 hover:text-accent transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <Link
                  href="/contact"
                  aria-label="Contact Manikanta Ketha"
                  title="Contact Manikanta Ketha"
                  className="p-2 hover:text-accent transition-colors"
                >
                  <Mail size={20} />
                </Link>
              </div>
            </div>
          </div>

          <div
            className="hidden lg:flex flex-col justify-center items-end animate-fade-in"
            style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
          >
            <div className="relative group">
              <div className="absolute -top-12 -right-12 text-right">
                <div className="space-y-1 mb-6">
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-bold">Location</span>
                  <span className="block text-sm font-medium">India</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-bold">Available For</span>
                  <span className="block text-sm font-medium text-accent">Freelance Projects</span>
                </div>
              </div>

              <div className="relative w-[380px] h-[480px] grayscale group-hover:grayscale-0 transition-all duration-700 border border-white/10 p-3 bg-white/5 backdrop-blur-sm">
                <Image
                  src="/mani.png"
                  alt="Manikanta Ketha - Full Stack Developer"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/20 transition-colors pointer-events-none" />
              </div>

              <div className="absolute -bottom-6 -left-6 w-24 h-24 border border-white/10 -z-10 bg-accent/5 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
