import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative min-h-svh flex items-center pt-28 pb-16 md:py-0 overflow-hidden bg-black">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 architectural-grid opacity-20 pointer-events-none" />

      {/* Profile Image - Background Style */}
      <div className="absolute inset-0 md:left-auto md:right-0 md:w-[65%] z-0">
        <Image
          src="/mani.webp"
          alt="Manikanta Ketha"
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 65vw"
          priority
        />
        <div className="md:hidden absolute inset-0 bg-black/45" />
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full md:pl-24">
        <div className="max-w-4xl space-y-8 md:space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-accent font-black block">
              [ SYSTEM.INIT // IDENTITY ]
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-center border-l-2 border-white/10 pl-6 md:pl-8">
              <span className="text-[8px] font-black tracking-[0.3em] text-foreground/50 uppercase">
                v2.0_STABLE
              </span>
              <span className="text-[8px] font-black tracking-[0.3em] text-foreground/50 uppercase">
                LAT_17.5946 N
              </span>
              <span className="text-[8px] font-black tracking-[0.3em] text-foreground/50 uppercase">
                LONG_80.3188 E
              </span>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-5 md:space-y-6">
            <h1 className="text-6xl md:text-[10rem] font-serif uppercase tracking-tighter text-white leading-[0.9]">
              <span className="block">Mani</span>
              <span className="block">kanta</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-light max-w-2xl leading-snug">
              Software Engineer specializing in{" "}
              <span className="text-accent font-medium">full-stack MERN &amp; Next.js</span>{" "}
              - I build AI-powered web products end to end, from real-time backends
              to refined React interfaces.
            </p>
          </div>

          {/* Bio Snippet */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 pt-8 md:pt-12 border-t border-white/10">
            <p className="text-lg md:text-2xl text-white/65 md:text-foreground/50 leading-relaxed font-light lowercase italic">
              architecting digital monoliths through{" "}
              <span className="text-white italic">logical structuralism</span>.
              bridging the gap between high-end aesthetics and complex technical
              systems.
            </p>

            <div className="flex flex-col justify-between gap-8 md:gap-12">
              <div className="flex gap-10 md:gap-12">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-black tracking-[0.3em] text-white/60 md:text-foreground/40 hover:text-white transition-colors"
                >
                  GITHUB
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-black tracking-[0.3em] text-white/60 md:text-foreground/40 hover:text-white transition-colors"
                >
                  LINKEDIN
                </a>
              </div>

              <Link
                href="/projects"
                className="group flex items-center justify-center md:justify-start gap-8 py-5 px-10 md:py-6 md:px-12 bg-white text-black hover:bg-accent hover:text-black transition-all duration-700 w-full md:w-fit"
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
