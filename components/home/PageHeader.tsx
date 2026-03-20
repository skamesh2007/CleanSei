"use client";

import { RefreshCw, Leaf } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserStats } from "../../lib/home/type";

type Props = {
  displayName: string | null;
  photoURL?:   string | null;
  stats:       UserStats;
  refreshing:  boolean;
  onRefresh:   () => void;
};

export function PageHeader({
  displayName,
  photoURL,
  stats,
  refreshing,
  onRefresh,
}: Props) {
  const firstName = displayName?.split(" ")[0] ?? "Welcome";
  const initials  = displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
  });

  return (
    <TooltipProvider delayDuration={300}>
      <header className="px-5 pt-10 pb-6">
        <div className="flex items-start justify-between">

          {/* ── Left: brand + greeting + badges ── */}
          <div className="flex-1 min-w-0">

            {/* Brand */}
            <div className="flex items-center gap-2 mb-1">
              <Leaf size={14} className="text-emerald-500" />
              <span className="text-xs font-semibold tracking-widest uppercase text-emerald-500">
                CleanSei
              </span>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
              {firstName}
            </h1>

            {/* Date */}
            <p className="text-muted-foreground text-sm mt-0.5">{today}</p>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="gap-1.5 text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/15 text-amber-500 border border-amber-500/20 rounded-full px-3 py-1 cursor-default">
                    🏆 Eco Warrior
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Your current volunteer level
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="gap-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 rounded-full px-3 py-1 cursor-default">
                    ⭐ {stats.points} pts
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Your SwachhScore — keep reporting!
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* ── Right: avatar ── */}
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            <div className="relative">
              <Avatar className="w-14 h-14 rounded-2xl ring-2 ring-emerald-500/30">
                <AvatarImage
                  src={photoURL ?? "/images/profile-placeholder.png"}
                  alt={displayName ?? "Profile"}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-2xl bg-emerald-600 text-white text-sm font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Points bubble */}
              <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-background">
                {stats.points > 999 ? "1k+" : stats.points}
              </span>
            </div>
          </div>
        </div>

        {/* ── Refresh ── */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 group"
        >
          <RefreshCw
            size={11}
            className={`transition-transform group-hover:rotate-180 duration-500 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          {refreshing ? "Refreshing…" : "Refresh data"}
        </button>
      </header>
    </TooltipProvider>
  );
}