'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t-2 border-white/10 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-3xl font-black mb-4">
              MANI<span className="text-accent">.</span>
            </h3>
            <p className="text-foreground/60 mb-6 max-w-md leading-relaxed">
              Full-stack developer crafting exceptional digital experiences with modern web technologies.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border-2 border-white/10 hover:border-accent hover:text-accent transition-all"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border-2 border-white/10 hover:border-accent hover:text-accent transition-all"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:manikantaketha1@gmail.com"
                className="p-3 border-2 border-white/10 hover:border-accent hover:text-accent transition-all"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-foreground/60 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-foreground/60 hover:text-accent transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground/60 hover:text-accent transition-colors">
                  Notelogs
                </Link>
              </li>
              <li>
                <Link href="/interview-prep" className="text-foreground/60 hover:text-accent transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link href="/get-access" className="text-foreground/60 hover:text-accent transition-colors">
                  Get Access
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Get In Touch</h4>
            <ul className="space-y-3 text-foreground/60">
              <li>
                <a href="mailto:contact@manikanta.dev" className="hover:text-accent transition-colors">
                  contact@manikanta.dev
                </a>
              </li>
              <li>Available for freelance</li>
              <li>Remote worldwide</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t-2 border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/40 text-sm">
            © {new Date().getFullYear()} Manikanta. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="p-3 border-2 border-white/10 hover:border-accent hover:text-accent transition-all group"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
