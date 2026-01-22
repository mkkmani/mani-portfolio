interface ProfileStatsProps {
  stats: {
    totalSessions: number;
    mostCommonDifficulty: string;
    totalMessages: number;
    joinedDate: string;
  };
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    { label: 'Total Sessions', value: stats.totalSessions, type: 'count' },
    { label: 'High Score', value: stats.mostCommonDifficulty, type: 'difficulty' },
    { label: 'Engagement', value: stats.totalMessages, type: 'messages' },
    { label: 'Registry Date', value: stats.joinedDate, type: 'date' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border-b border-white/5">
      {statItems.map((item, index) => (
        <div key={index} className="p-12 bg-black hover:bg-white/[0.02] transition-colors relative group">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-foreground/20 mb-6 group-hover:text-foreground/40 transition-colors">
            {item.label}
          </p>
          <p className="text-3xl font-black text-white group-hover:text-accent transition-colors flex items-baseline gap-2">
            {item.value}
            {item.type === 'messages' && (
              <span className="text-[10px] text-foreground/20 font-light lowercase italic tracking-normal">msgs</span>
            )}
          </p>

          <div className="absolute top-4 right-4 w-1 h-1 bg-white/5 group-hover:bg-accent transition-colors" />
        </div>
      ))}
    </div>
  );
}
