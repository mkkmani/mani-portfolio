import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GetInTouch() {
  return (
    <section className="py-48 px-6 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ LOG.05 // CONNECTION ]
            </span>
            <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
              Start a<br />Project
            </h3>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/20 md:text-right leading-relaxed max-w-xs">
            // OPEN FOR COLLABORATION.<br />
            // CURRENT_LOCATION: REMOTE
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-12 lg:col-span-6 md:col-start-4">
            <p className="text-xl md:text-2xl text-foreground/50 leading-[1.3] font-light lowercase mb-12 italic">
              let's architect your next <span className="text-white italic">digital monolith</span>.
              collaborative building where logic meets high-end aesthetics.
            </p>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-6 px-12 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-accent transition-all duration-500"
            >
              Get in Touch
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}