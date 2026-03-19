import { FileText, Users, Trophy, TrendingUp } from "lucide-react";
import type { UserStats } from "../../lib/home/type";

type StatItem = {
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  label: string;
  sub: string;
  valueColor: string;
};

type Props = { stats: UserStats };

export function StatsOverview({ stats }: Props) {
  const items: StatItem[] = [
    {
      icon: <FileText size={18} className="text-sky-400" />,
      iconBg: "bg-sky-500/10",
      value: stats.reports,
      label: "Reports",
      sub: "+2 this week",
      valueColor: "text-sky-400",
    },
    {
      icon: <Users size={18} className="text-emerald-400" />,
      iconBg: "bg-emerald-500/10",
      value: stats.cleanups,
      label: "Cleanups",
      sub: "Active",
      valueColor: "text-emerald-400",
    },
    {
      icon: <Trophy size={18} className="text-amber-400" />,
      iconBg: "bg-amber-500/10",
      value: stats.points,
      label: "Points",
      sub: "SwachhScore",
      valueColor: "text-amber-400",
    },
  ];

  return (
    <section className="px-5 mt-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Your Impact</h2>
        <span className="text-xs text-zinc-500 flex items-center gap-1">
          <TrendingUp size={12} /> This week
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-4 hover:border-zinc-700 transition-colors"
          >
            <div
              className={`${item.iconBg} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}
            >
              {item.icon}
            </div>
            <p className={`text-2xl font-bold ${item.valueColor} tabular-nums`}>
              {item.value}
            </p>
            <p className="text-zinc-300 text-xs font-semibold mt-1">{item.label}</p>
            <p className="text-zinc-600 text-[11px] mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}