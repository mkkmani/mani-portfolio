import { Calendar, RefreshCw } from 'lucide-react';

interface LastUpdatedProps {
  datePublished: string;
  dateModified?: string;
  variant?: 'default' | 'compact';
}


export default function LastUpdated({ datePublished, dateModified, variant = 'default' }: LastUpdatedProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 text-sm text-foreground/60">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} />
          {formatDate(datePublished)}
        </span>
        {dateModified && dateModified !== datePublished && (
          <span className="flex items-center gap-1.5">
            <RefreshCw size={14} />
            Updated {formatDate(dateModified)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-sm text-foreground/60 mb-6">
      <span className="flex items-center gap-2">
        <Calendar size={16} />
        Published on {formatDate(datePublished)}
      </span>
      {dateModified && dateModified !== datePublished && (
        <span className="flex items-center gap-2">
          <RefreshCw size={16} className="text-accent" />
          Last updated on {formatDate(dateModified)}
        </span>
      )}
    </div>
  );
}
