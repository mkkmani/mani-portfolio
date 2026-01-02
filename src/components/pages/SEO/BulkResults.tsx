'use client';

import type { BulkCheckResult } from './types';

interface BulkResultsProps {
  results: BulkCheckResult | null;
}

export default function BulkResults({ results }: BulkResultsProps) {
  if (!results) return null;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-foreground/10 p-4 bg-foreground/[0.02]">
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">
            Total
          </div>
          <div className="text-3xl font-bold text-foreground">{results.total}</div>
        </div>

        <div className="border border-accent/20 p-4 bg-accent/5">
          <div className="text-xs font-bold uppercase tracking-wider text-accent/70 mb-2">
            Valid
          </div>
          <div className="text-3xl font-bold text-accent">{results.valid}</div>
        </div>

        <div className="border border-red-500/20 p-4 bg-red-500/5">
          <div className="text-xs font-bold uppercase tracking-wider text-red-500/70 mb-2">
            Invalid
          </div>
          <div className="text-3xl font-bold text-red-500">{results.invalid}</div>
        </div>

        <div className="border border-foreground/10 p-4 bg-foreground/[0.02]">
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">
            Production
          </div>
          <div className="text-3xl font-bold text-foreground">{results.baseUrlMatches}</div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {results.results.map((item, index) => (
          <div
            key={index}
            className={`p-4 border transition-colors ${item.isValid && item.matchesBaseUrl
                ? 'border-accent/20 bg-accent/5 hover:bg-accent/10'
                : item.isValid
                  ? 'border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04]'
                  : 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10'
              }`}
          >
            <div className="font-mono text-sm text-foreground mb-2">{item.input}</div>
            <div className="font-mono text-xs text-foreground/50 mb-3 break-all">
              {item.absoluteUrl}
            </div>

            <div className="flex gap-2">
              <span
                className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${item.isValid
                    ? 'bg-accent/20 text-accent'
                    : 'bg-red-500/20 text-red-500'
                  }`}
              >
                {item.isValid ? 'Valid' : 'Invalid'}
              </span>

              {item.matchesBaseUrl && (
                <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-foreground/10 text-foreground/70">
                  Production
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
