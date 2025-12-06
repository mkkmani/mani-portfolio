import { ArrowRight } from "lucide-react";

export default function GetInTouch() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative border border-white/10 bg-white/5 p-12 md:p-20">
          <div className="absolute inset-0 bg-accent/5 opacity-20" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
                Ready to start a project?
              </h2>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-lg font-mono">
                Let's collaborate to build something extraordinary. I'm currently available for freelance projects and open to new opportunities.
              </p>
            </div>

            <a
              href="/contact"
              className="group relative px-8 py-4 bg-white text-black font-bold text-sm overflow-hidden hover:bg-accent transition-colors border border-transparent hover:border-accent"
            >
              <span className="relative z-10 flex items-center gap-2 uppercase tracking-wider">
                Get in Touch
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}