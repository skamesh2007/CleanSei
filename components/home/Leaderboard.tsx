import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Contributor } from "../../lib/home/type";

// ─── Rank config ──────────────────────────────────────────────────────────────

const RANK_CONFIG = [
  {
    medal:      "🥇",
    accent:     "from-amber-500/10 to-transparent",
    ring:       "ring-amber-500/30",
    barColor:   "[&>div]:bg-amber-500",
    pointColor: "text-amber-400",
  },
  {
    medal:      "🥈",
    accent:     "from-zinc-400/8 to-transparent",
    ring:       "ring-zinc-400/30",
    barColor:   "[&>div]:bg-zinc-400",
    pointColor: "text-zinc-400",
  },
  {
    medal:      "🥉",
    accent:     "from-orange-600/8 to-transparent",
    ring:       "ring-orange-500/30",
    barColor:   "[&>div]:bg-orange-600",
    pointColor: "text-orange-500",
  },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  contributors: Contributor[];
  onViewAll?: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Leaderboard({ contributors, onViewAll }: Props) {
  const topScore = contributors[0]?.points ?? 1;

  return (
    <TooltipProvider delayDuration={300}>
      <section className="mt-8 px-5">

        {/* ── Section header ── */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Leaderboard</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Top contributors this week</p>
          </div>
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>

        {/* ── Rows ── */}
        <div className="space-y-2">
          {contributors.map((contributor, index) => (
            <ContributorRow
              key={contributor.name}
              contributor={contributor}
              rank={index}
              topScore={topScore}
            />
          ))}
        </div>

      </section>
    </TooltipProvider>
  );
}

// ─── Row sub-component ────────────────────────────────────────────────────────

function ContributorRow({
  contributor,
  rank,
  topScore,
}: {
  contributor: Contributor;
  rank: number;
  topScore: number;
}) {
  const rc  = RANK_CONFIG[rank] ?? RANK_CONFIG[2];
  const pct = Math.round((contributor.points / topScore) * 100);

  const initials = contributor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r ${rc.accent} border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all ${
        contributor.isCurrentUser ? `ring-1 ${rc.ring}` : ""
      }`}
    >
      {/* Ghost rank number */}
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[40px] font-black text-white/[0.04] select-none pointer-events-none tabular-nums leading-none">
        {rank + 1}
      </span>

      {/* Medal */}
      <div className="w-9 h-9 rounded-xl bg-zinc-900/80 flex items-center justify-center text-base flex-shrink-0">
        {rc.medal}
      </div>

      {/* Avatar */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="w-11 h-11 rounded-xl flex-shrink-0 cursor-default">
            <AvatarImage
              src={contributor.image}
              alt={contributor.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-xl bg-emerald-700 text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {contributor.level}
        </TooltipContent>
      </Tooltip>

      {/* Name + level + progress bar */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white truncate leading-tight">
            {contributor.name}
          </span>
          {contributor.isCurrentUser && (
            <Badge className="text-[9px] font-bold px-1.5 py-0 h-4 bg-emerald-500 hover:bg-emerald-500 text-white border-0 rounded-full tracking-wider flex-shrink-0">
              YOU
            </Badge>
          )}
        </div>
        <p className="text-zinc-500 text-[11px] mt-0.5 truncate">
          {contributor.level}
        </p>

        {/* Relative progress bar */}
        <Progress
          value={pct}
          className={`mt-2 h-[3px] bg-white/5 ${rc.barColor}`}
        />
      </div>

      {/* Points chip */}
      <div className="bg-zinc-900/80 border border-zinc-800/60 px-2.5 py-2 rounded-xl flex-shrink-0 text-right">
        <p className={`text-base font-bold tabular-nums leading-tight ${rc.pointColor}`}>
          {contributor.points}
        </p>
        <p className="text-zinc-600 text-[10px]">pts</p>
      </div>
    </div>
  );
}