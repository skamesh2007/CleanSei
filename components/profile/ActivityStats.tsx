"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileText,
  Users,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityStat = {
  label: string;
  value: number;
  /** Max value used to compute the progress bar fill (e.g. monthly goal) */
  max: number;
  /** Short contextual chip shown next to the value */
  delta: string;
  /** Tooltip shown on hover explaining the delta */
  tooltip: string;
  icon: React.ReactNode;
  /** Tailwind color classes for the icon background and bar */
  theme: {
    iconBg: string;
    barColor: string;
    badgeBg: string;
    badgeText: string;
  };
};

type Props = {
  stats: ActivityStat[];
  lastUpdated?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ActivityStats({ stats, lastUpdated = "Today" }: Props) {
  return (
    <TooltipProvider delayDuration={200}>
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">

        <Card className="rounded-2xl border border-gray-100 dark:border-border bg-white dark:bg-card overflow-hidden shadow-sm">

          {/* ── Header ── */}
          <CardHeader className="px-4 py-3 border-b border-gray-100 dark:border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-500 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-800 dark:text-foreground">
                  Activity stats
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-muted-foreground">
                This month
              </span>
            </div>
          </CardHeader>

          {/* ── Rows ── */}
          <CardContent className="p-0">
            {stats.map((stat, index) => (
              <div key={stat.label}>
                <StatRow stat={stat} />
                {index < stats.length - 1 && (
                  <Separator className="mx-4 w-auto" />
                )}
              </div>
            ))}
          </CardContent>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-border">
            <span className="text-[11px] text-gray-400 dark:text-muted-foreground">
              Last updated: {lastUpdated}
            </span>
            <span className="text-[11px] text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">
              View full history
            </span>
          </div>

        </Card>
      </section>
    </TooltipProvider>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────

function StatRow({ stat }: { stat: ActivityStat }) {
  const pct = Math.min(Math.round((stat.value / stat.max) * 100), 100);

  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors">

      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.theme.iconBg}`}
      >
        {stat.icon}
      </div>

      {/* Label + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-gray-500 dark:text-muted-foreground truncate">
            {stat.label}
          </span>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {/* Delta badge with tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold px-2 py-0 h-5 border-0 cursor-default ${stat.theme.badgeBg} ${stat.theme.badgeText}`}
                >
                  {stat.delta}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {stat.tooltip}
              </TooltipContent>
            </Tooltip>

            {/* Value */}
            <span className="text-base font-semibold text-gray-900 dark:text-foreground tabular-nums min-w-[28px] text-right">
              {stat.value}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <Progress
          value={pct}
          className={`h-1 bg-gray-100 dark:bg-muted [&>div]:${stat.theme.barColor}`}
        />
      </div>

    </div>
  );
}