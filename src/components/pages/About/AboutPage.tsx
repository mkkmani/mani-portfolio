'use client';

import { ArrowLeft, User, Code, Rocket, Brain, Heart, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const skills = [
  { name: 'MERN Stack', icon: Code },
  { name: 'Next.js 15+', icon: Rocket },
  { name: 'TypeScript', icon: Brain },
  { name: 'AI Integration', icon: Brain },
  { name: 'UI/UX Design', icon: Heart },
  { name: 'Cloud Arch', icon: Globe },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-6 md:pl-24 overflow-hidden relative">
      {/* Decorative Background Grid */}
      <div className="absolute inset-0 architectural-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-12 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ PROFILE.01 // IDENTITY ]
            </span>
            <h1 className="text-6xl md:text-[10rem] font-serif uppercase tracking-tighter text-white leading-[0.8]">
              About<br />Mani
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/20 font-black block mb-4">
              // VERSION_2.0
            </span>
            <span className="text-[10px] uppercase tracking-[0.5em] text-foreground/20 font-black block">
              // UPDATED_JAN_2026
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-px bg-white/5 border border-white/5 mb-24">
          {/* Column 1: Core Narrative */}
          <div className="lg:col-span-4 bg-black p-8 md:p-12 space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent">[ 01 // ORIGIN ]</span>
              <p className="text-xl text-foreground/60 leading-relaxed font-light lowercase italic">
                I am <span className="text-white font-black">Manikanta Ketha</span>, a Software Engineer based in India specializing in the architecture of high-performance digital monoliths.
              </p>
            </div>

            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent">[ 02 // CURRENT ]</span>
              <p className="text-lg text-foreground/40 leading-relaxed font-light lowercase italic">
                Presently engineering AI-driven developer tools at <span className="text-white underline underline-offset-8 decoration-accent/20">PureCode Software</span>. My central mission is the synthesis of complex systems and refined aesthetics.
              </p>
            </div>

            <div className="pt-12 border-t border-white/5">
              <Link
                href="/"
                className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-accent transition-all duration-500"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Return to Root
              </Link>
            </div>
          </div>

          {/* Column 2: The Visual Monolith (Image) */}
          <div className="lg:col-span-4 bg-black relative group">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/mani.webp"
                alt="Manikanta Ketha"
                fill
                className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>

            {/* Image Overlay Elements */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[8px] font-black tracking-widest text-white/50 block font-mono">X: 82.34</span>
                <span className="text-[8px] font-black tracking-widest text-white/50 block font-mono">Y: 19.12</span>
              </div>
              <div className="w-12 h-12 border-r border-b border-accent/40" />
            </div>
          </div>

          {/* Column 3: Philosophy & Expertise */}
          <div className="lg:col-span-4 bg-black p-8 md:p-12 flex flex-col justify-between gap-16">
            <div className="space-y-12">
              <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent">[ 03 // PHILOSOPHY ]</span>
                <p className="text-2xl text-white font-serif italic border-l-2 border-accent/40 pl-8 leading-tight">
                  "code is not just functional; it is structural architecture. every pixel must serve a purpose."
                </p>
              </div>

              <div className="space-y-8">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent">[ 04 // EXPERTISE ]</span>
                <div className="grid grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex flex-col gap-2 group">
                      <skill.icon size={16} className="text-foreground/20 group-hover:text-accent transition-colors" />
                      <span className="text-[10px] font-black tracking-widest uppercase text-foreground/40 group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8 pt-12 border-t border-white/5">
              <div className="grid grid-cols-3 gap-px bg-white/10">
                <div className="h-1 bg-accent" />
                <div className="h-1 bg-white/20" />
                <div className="h-1 bg-white/20" />
              </div>
              <p className="text-[8px] font-black uppercase tracking-[0.5em] text-foreground/20">
                Operational Efficiency: 100%
              </p>
            </div>
          </div>
        </div>

        {/* Footer Link Section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-24 gap-12 border-t border-white/5">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-4xl md:text-6xl font-serif uppercase tracking-tighter text-white leading-[0.9]">
              Deploy the next<br />Digital Monolith.
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/20 leading-relaxed italic lowercase">
              // waiting for command initiation.<br />
              // active status: available for collaboration.
            </p>
          </div>

          <Link
            href="/contact"
            className="group flex items-center gap-8 py-8 px-16 bg-white text-black hover:bg-accent hover:text-black transition-all duration-700"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Initiate Contact</span>
            <ArrowRight size={20} className="group-hover:translate-x-4 transition-transform duration-700" />
          </Link>
        </div>
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute top-0 right-12 w-px h-full bg-white/5 hidden md:block" />
      <div className="absolute top-0 right-24 w-px h-full bg-white/5 hidden md:block" />
    </main>
  );
}
