import { Clock, BookOpen } from 'lucide-react';

interface ReadingTimeProps {
  content: string;
  variant?: 'default' | 'compact';
}


export default function ReadingTime({ content, variant = 'default' }: ReadingTimeProps) {
  const text = content
    .replace(/[#*`_~\[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  const wordCount = text.split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / 225);

  if (variant === 'compact') {
    return (
      <span className="flex items-center gap-1.5 text-sm text-foreground/60">
        <Clock size={14} />
        {readingTimeMinutes} min read
      </span>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm text-foreground/60">
      <span className="flex items-center gap-1.5">
        <BookOpen size={16} />
        {wordCount.toLocaleString()} words
      </span>
      <span className="flex items-center gap-1.5">
        <Clock size={16} />
        {readingTimeMinutes} min read
      </span>
    </div>
  );
}
