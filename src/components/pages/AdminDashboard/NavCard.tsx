'use client';

import Link from 'next/link';
import type { NavCard } from './types';

interface NavCardProps {
  card: NavCard;
}

export default function DashboardNavCard({ card }: NavCardProps) {
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      className="group relative border border-foreground/10 bg-foreground/[0.02] p-8 hover:border-accent/30 hover:bg-foreground/[0.04] transition-all"
    >
      {/* Icon */}
      <div className="mb-6">
        <Icon className="w-12 h-12 text-foreground/40 group-hover:text-accent transition-colors" />
      </div>

      {/* Title & Description */}
      <h3 className="text-2xl font-bold mb-2 uppercase tracking-wider group-hover:text-accent transition-colors">
        {card.label}
      </h3>
      <p className="text-foreground/60 text-sm leading-relaxed mb-6">
        {card.description}
      </p>

      {/* Stats */}
      {card.stats && (
        <div className="flex gap-4 pt-4 border-t border-foreground/10">
          <div>
            <div className="text-2xl font-bold text-accent">{card.stats.total}</div>
            <div className="text-xs text-foreground/40 uppercase tracking-wider">Total</div>
          </div>
          {card.stats.published !== undefined && (
            <div>
              <div className="text-2xl font-bold text-foreground">{card.stats.published}</div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">Published</div>
            </div>
          )}
          {card.stats.unread !== undefined && (
            <div>
              <div className="text-2xl font-bold text-foreground">{card.stats.unread}</div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">Unread</div>
            </div>
          )}
        </div>
      )}

      {/* Hover Arrow */}
      <div className="absolute bottom-8 right-8 text-foreground/20 group-hover:text-accent group-hover:translate-x-1 transition-all">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
