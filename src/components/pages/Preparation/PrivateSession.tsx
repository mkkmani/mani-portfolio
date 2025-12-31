'use client';

import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PrivateSession() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        {/* Lock Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 rounded-full flex items-center justify-center">
              <Lock size={40} className="text-accent" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Private Session
          </h1>
          <p className="text-xl text-foreground/60 mb-2">
            This interview preparation session is currently under review
          </p>
          <p className="text-sm text-foreground/40">
            Sessions are reviewed by our team before being made publicly available
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-white/5 border border-white/10 p-8 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-accent" />
            About Our Platform
          </h2>
          <div className="space-y-4 text-foreground/70">
            <p>
              Our AI-powered interview preparation platform helps you master technical concepts
              through personalized study sessions.
            </p>
            <p>
              All sessions are reviewed to ensure quality before being shared with the community.
              This helps maintain high standards and provides the best learning experience.
            </p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-sm text-foreground/50">
                <strong className="text-foreground/70">Privacy Note:</strong> Generated sessions
                may be published for educational purposes after admin review. For more details,
                see our{' '}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/interview-prep"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/15 border border-white/20 transition-all font-semibold text-center"
          >
            Browse Published Sessions
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/interview-prep/new"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-accent text-black hover:bg-white transition-all font-bold text-center"
          >
            <Sparkles size={18} />
            Create Your Own Session
          </Link>
        </div>
      </div>
    </div>
  );
}
