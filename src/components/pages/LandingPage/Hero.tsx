'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
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
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:text-accent transition-colors">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:text-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:hello@example.com" className="p-2 hover:text-accent transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2"
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
        </motion.div>

      </div>

    </section>
  );
}
