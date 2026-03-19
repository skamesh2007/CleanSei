import { RefreshCw, Leaf } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { UserStats } from "../../lib/home/type";

type Props = {
  displayName: string | null;
  stats: UserStats;
  refreshing: boolean;
  onRefresh: () => void;
};

export function PageHeader({ displayName, stats, refreshing, onRefresh }: Props) {
  const firstName = displayName?.split(" ")[0] ?? "Welcome";

  return (
    <header className="px-5 pt-10 pb-6">
      <div className="flex items-start justify-between">
        {/* ── Greeting ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Leaf size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-400">
              CleanSei
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
            {firstName}
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 ring-1 ring-amber-500/25 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
              🏆 Eco Warrior
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 ring-1 ring-emerald-500/25 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
              ⭐ {stats.points} pts
            </span>
          </div>
        </div>

        {/* ── Controls + Avatar ── */}
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          <ThemeToggle />
          <div className="relative">
            <img
              src="/images/profile-placeholder.png"
              alt="Profile"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  displayName ?? "U"
                )}&background=10b981&color=fff&size=56`;
              }}
            />
            <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
              {stats.points > 999 ? "1k+" : stats.points}
            </span>
          </div>
        </div>
      </div>

      {/* ── Refresh ── */}
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50 group"
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
  );
}