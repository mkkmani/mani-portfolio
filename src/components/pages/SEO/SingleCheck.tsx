'use client';

import { useState } from 'react';
import type { SeoCheckResult } from './types';

interface SingleCheckProps {
  onCheck: (url: string) => Promise<void>;
  result: SeoCheckResult | null;
  loading: boolean;
}

export default function SingleCheck({ onCheck, result, loading }: SingleCheckProps) {
  const [url, setUrl] = useState('');

  const handleCheck = async () => {
    if (!url.trim()) return;
    await onCheck(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold mb-3 uppercase tracking-wider text-foreground/50">
          Enter URL to Check
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="/notelogs/my-post or https://example.com..."
            className="flex-1 px-4 py-3 bg-background border border-foreground/10 text-foreground placeholder:text-foreground/30 focus:border-accent focus:outline-none transition-colors"
          />
          <button
            onClick={handleCheck}
            disabled={loading || !url.trim()}
            className="px-6 py-3 bg-accent text-background font-bold uppercase tracking-wider hover:bg-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Check'}
          </button>
        </div>
      </div>

      {result && (
        <div className="border border-foreground/10 bg-foreground/[0.02] p-6 space-y-4">
          <h3 className="font-bold uppercase tracking-wider text-foreground/70">Results</h3>

          <div className="space-y-3 text-sm font-mono">
            <div className="flex flex-col gap-1">
              <span className="text-foreground/50">Input:</span>
              <span className="text-foreground/80">{result.input}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-foreground/50">Absolute URL:</span>
              <span className="text-foreground/80 break-all">{result.absoluteUrl}</span>
            </div>

            <div className="pt-3 border-t border-foreground/10 grid grid-cols-2 gap-3">
              <div>
                <span className="text-foreground/50 block mb-1">Valid:</span>
                <span className={result.checks.urlFormat.valid ? 'text-accent' : 'text-red-500'}>
                  {result.checks.urlFormat.valid ? '✓ Yes' : '✗ No'}
                </span>
              </div>

              <div>
                <span className="text-foreground/50 block mb-1">Base URL Match:</span>
                <span className={result.checks.seo.baseUrlMatches ? 'text-accent' : 'text-foreground/50'}>
                  {result.checks.seo.baseUrlMatches ? '✓ Yes' : '− No'}
                </span>
              </div>

              <div>
                <span className="text-foreground/50 block mb-1">Protocol:</span>
                <span className="text-foreground/80">{result.checks.urlFormat.protocol}</span>
              </div>

              <div>
                <span className="text-foreground/50 block mb-1">Environment:</span>
                <span className="text-foreground/80">
                  {result.checks.urlFormat.isLocalhost ? 'Localhost' : 'Production'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
