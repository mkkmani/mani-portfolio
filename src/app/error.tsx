"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-8">
        <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
          [ ERROR // SYSTEM_FAULT ]
        </span>
        <h1 className="text-5xl md:text-7xl font-serif uppercase tracking-tighter text-white">
          Something
          <br />
          broke
        </h1>
        <p className="text-foreground/40 font-light lowercase italic">
          an unexpected error occurred while rendering this page.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={reset}
            className="px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] hover:bg-accent transition-all"
          >
            Retry
          </button>
          <Link
            href="/"
            className="px-8 py-4 border border-white/10 text-foreground/60 font-black text-[10px] uppercase tracking-[0.4em] hover:border-accent hover:text-accent transition-all"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
