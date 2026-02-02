"use client";

import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 md:pt-0 overflow-hidden bg-black">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 architectural-grid opacity-20 pointer-events-none" />

      {/* Profile Image - Background Style */}
      <div className="absolute top-0 right-0 w-full md:w-[65%] h-full z-0 group">
        <Image
          src="/mani.webp"
          alt="Manikanta Ketha"
          fill
          className="object-cover object-top  transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full md:pl-24">
        <div className="max-w-4xl space-y-12">
          {/* Metadata Block */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ SYSTEM.INIT // IDENTITY ]
            </span>
            <div className="flex gap-8 items-center border-l-2 border-white/5 pl-8">
              <span className="text-[8px] font-black tracking-[0.3em] text-foreground/40 uppercase">
                v2.0_STABLE
              </span>
              <span className="text-[8px] font-black tracking-[0.3em] text-foreground/40 uppercase">
                LAT_17.5946 N
              </span>
              <span className="text-[8px] font-black tracking-[0.3em] text-foreground/40 uppercase">
                LONG_80.3188 E
              </span>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-[10rem] font-serif uppercase tracking-tighter text-white leading-[0.9] mix-blend-difference">
              <span className="block">Mani</span>
              <span className="block">kanta</span>
            </h1>
          </div>

          {/* Bio Snippet */}
          <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
            <p className="text-xl md:text-2xl text-foreground/50 leading-relaxed font-light lowercase italic">
              architecting digital monoliths through{" "}
              <span className="text-white italic">logical structuralism</span>.
              bridging the gap between high-end aesthetics and complex technical
              systems.
            </p>

            <div className="flex flex-col justify-between gap-12">
              <div className="flex gap-12">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-black tracking-[0.3em] text-foreground/40 hover:text-white transition-colors"
                >
                  GITHUB
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-black tracking-[0.3em] text-foreground/40 hover:text-white transition-colors"
                >
                  LINKEDIN
                </a>
              </div>

              <Link
                href="/projects"
                className="group flex items-center gap-8 py-6 px-12 bg-white text-black hover:bg-accent hover:text-black transition-all duration-700 w-fit"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                  View Archive
                </span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-4 transition-transform duration-700"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative vertical line */}
      <div className="absolute top-0 right-12 w-px h-full bg-white/5 hidden md:block" />
      <div className="absolute top-0 right-24 w-px h-full bg-white/5 hidden md:block" />
    </section>
  );
}
