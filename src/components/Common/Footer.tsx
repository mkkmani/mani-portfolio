"use client";

import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/config";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black border-t border-white/5 py-24 px-6 md:pl-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-6 space-y-8">
            <h3 className="text-4xl md:text-6xl font-serif uppercase tracking-tighter text-white">
              Manikanta<br />Ketha
            </h3>
            <p className="text-xl text-foreground/40 font-light lowercase italic leading-relaxed max-w-md">
              architecting digital monoliths at the intersection of <span className="text-white italic">design</span> and <span className="text-white italic">engineering</span>.
            </p>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent">[ NAVIGATION ]</span>
            <ul className="space-y-4">
              <li><Link href="/" className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground/40 hover:text-white transition-colors">Home // 00</Link></li>
              <li><Link href="/work" className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground/40 hover:text-white transition-colors">Work // 01</Link></li>
              <li><Link href="/projects" className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground/40 hover:text-white transition-colors">Projects // 02</Link></li>
              <li><Link href="/notelogs" className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground/40 hover:text-white transition-colors">Notelogs // 04</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-8 text-right md:text-left">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-accent">[ CONNECT ]</span>
            <div className="flex gap-8 justify-end md:justify-start">
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="text-foreground/40 hover:text-accent transition-colors"><Github size={20} /></a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="text-foreground/40 hover:text-accent transition-colors"><Linkedin size={20} /></a>
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-foreground/40 hover:text-accent transition-colors"><Mail size={20} /></a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">
              © {new Date().getFullYear()} Manikanta Ketha // Build_4.1.0
            </p>
            <p className="text-[8px] font-black tracking-[0.2em] text-foreground/10 uppercase">
              All Protocol Rights Reserved.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-white transition-all duration-500"
          >
            Terminal Return
            <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
