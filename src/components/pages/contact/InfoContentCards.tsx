import { Zap, MessageCircle, ZapOff } from "lucide-react";

export const engagementCards = [
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "⚡ Lightning Fast",
    description:
      "Faster than a caffeinated squirrel on a sugar rush. I'll respond before you can say 'is this thing on?' (Results may vary, batteries not included).",
    color:
      "from-amber-500/10 to-amber-500/5 hover:from-amber-500/20 hover:to-amber-500/10 transition-all",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-indigo-400" />,
    title: "💬 Not Your Average Bot",
    description:
      "I promise I won't respond with 'I'm sorry, I didn't understand that'... unless you start speaking in binary. Then all bets are off.",
    color:
      "from-indigo-500/10 to-indigo-500/5 hover:from-indigo-500/20 hover:to-indigo-500/10 transition-all",
  },
  {
    icon: <ZapOff className="w-6 h-6 text-rose-400" />,
    title: "😴 24/7? More Like 25/8",
    description:
      "I don't sleep, I don't eat, and I definitely don't take coffee breaks. Your message will be the highlight of my endless digital existence.",
    color:
      "from-rose-500/10 to-rose-500/5 hover:from-rose-500/20 hover:to-rose-500/10 transition-all",
  },
];

export const InfoContentCards = () => {
  return (
    <>
      <div className="hidden lg:flex flex-col justify-center w-full max-w-md space-y-6">
        <div className="text-left space-y-1">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Let's Chat! 💬
          </h2>
          <p className="text-muted-foreground">
            Have something in mind? I'm all ears (or should I say, all
            processors?).
          </p>
        </div>

        <div className="space-y-4">
          {engagementCards.map((card, index) => (
            <div
              key={index}
              className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} border border-border/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-black/10 dark:bg-white/10">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-6">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Available now</span>
          </div>
          <span>•</span>
          <span>Response time: Under 24h</span>
        </div>
      </div>
    </>
  );
};
