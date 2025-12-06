'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-black to-black" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none">
            404
          </h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent font-mono text-sm tracking-[1em] uppercase bg-black px-4 border border-accent/20"
          >
            System_Failure
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Lost in the Digital Void?
          </h2>
          <p className="text-foreground/60 mb-12 leading-relaxed">
            The page you are looking for has been moved, deleted, or possibly abducted by aliens.
            Don't worry, I'm... actually, I'm probably just drinking Tea.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="group px-8 py-4 bg-transparent border border-white/10 text-white font-bold hover:border-accent hover:text-accent transition-all w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Go Back
              </span>
            </button>
            <Link
              href="/"
              className="group px-8 py-4 bg-white text-black font-bold hover:bg-accent transition-colors w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <Home size={18} />
                Return Home
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/20" />
      <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/20" />
      <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/20" />
      <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/20" />
    </div>
  );
}
