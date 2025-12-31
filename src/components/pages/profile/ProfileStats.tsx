interface ProfileStatsProps {
  stats: {
    totalSessions: number;
    mostCommonDifficulty: string;
    totalMessages: number;
    joinedDate: string;
  };
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-white/10">
      <div>
        <p className="text-sm text-zinc-500 font-medium mb-1">Total Sessions</p>
        <p className="text-2xl font-semibold text-white tracking-tight">{stats.totalSessions}</p>
      </div>

      <div>
        <p className="text-sm text-zinc-500 font-medium mb-1">Top Level</p>
        <p className="text-2xl font-semibold text-white tracking-tight">{stats.mostCommonDifficulty}</p>
      </div>

      <div>
        <p className="text-sm text-zinc-500 font-medium mb-1">Engagement</p>
        <p className="text-2xl font-semibold text-white tracking-tight">{stats.totalMessages} <span className="text-sm text-zinc-600 font-normal">msgs</span></p>
      </div>

      <div>
        <p className="text-sm text-zinc-500 font-medium mb-1">Joined</p>
        <p className="text-lg font-medium text-white tracking-tight mt-1">{stats.joinedDate}</p>
      </div>
    </div>
  );
}
