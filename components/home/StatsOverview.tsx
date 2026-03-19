"use client";

import { FileText, Users, Trophy, TrendingUp, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserStats } from "../../lib/home/type";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatItem = {
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  max: number;
  label: string;
  delta: string;
  deltaIcon?: React.ReactNode;
  valueColor: string;
  deltaColor: string;
  deltaBg: string;
  barColor: string;
  tooltip: string;
};

type Props = { stats: UserStats };

// ─── Component ────────────────────────────────────────────────────────────────

export function StatsOverview({ stats }: Props) {
  const items: StatItem[] = [
    {
      icon:       <FileText size={16} className="text-sky-400" />,
      iconBg:     "bg-sky-500/10",
      value:      stats.reports,
      max:        30,
      label:      "Reports",
      delta:      "+2",
      deltaIcon:  <ArrowUp size={8} className="text-sky-400" />,
      valueColor: "text-sky-400",
      deltaColor: "text-sky-400",
      deltaBg:    "bg-sky-500/10",
      barColor:   "[&>div]:bg-sky-500",
      tooltip:    "2 new reports filed this week",
    },
    {
      icon:       <Users size={16} className="text-emerald-400" />,
      iconBg:     "bg-emerald-500/10",
      value:      stats.cleanups,
      max:        20,
      label:      "Cleanups",
      delta:      "Active",
      valueColor: "text-emerald-400",
      deltaColor: "text-emerald-400",
      deltaBg:    "bg-emerald-500/10",
      barColor:   "[&>div]:bg-emerald-500",
      tooltip:    "You're an active cleanup member",
    },
    {
      icon:       <Trophy size={16} className="text-amber-400" />,
      iconBg:     "bg-amber-500/10",
      value:      stats.points,
      max:        500,
      label:      "Points",
      delta:      "Warrior",
      valueColor: "text-amber-400",
      deltaColor: "text-amber-400",
      deltaBg:    "bg-amber-500/10",
      barColor:   "[&>div]:bg-amber-500",
      tooltip:    "SwachhScore — reach 260 for Champion",
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <section className="px-5 mt-2">

        {/* ── Section header ── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Your Impact</h2>
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <TrendingUp size={12} />
            This week
          </span>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-3 gap-2.5">
          {items.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-3.5 hover:border-zinc-700 transition-colors cursor-default">

                  {/* Icon */}
                  <div className={`${item.iconBg} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
                    {item.icon}
                  </div>

                  {/* Value */}
                  <p className={`text-2xl font-bold ${item.valueColor} tabular-nums leading-none`}>
                    {item.value}
                  </p>

                  {/* Label */}
                  <p className="text-zinc-300 text-xs font-semibold mt-1.5">
                    {item.label}
                  </p>

                  {/* Delta badge */}
                  <Badge
                    className={`mt-1.5 gap-1 text-[10px] font-semibold px-2 py-0 h-4 border-0 rounded-full ${item.deltaBg} ${item.deltaColor}`}
                  >
                    {item.deltaIcon}
                    {item.delta}
                  </Badge>

                  {/* Mini progress bar */}
                  <Progress
                    value={Math.min(Math.round((item.value / item.max) * 100), 100)}
                    className={`mt-2.5 h-[3px] bg-white/5 ${item.barColor}`}
                  />

                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {item.tooltip}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

      </section>
    </TooltipProvider>
  );
}