import { ChevronRight } from "lucide-react";
import { RANK_CONFIG } from "../../lib/home/utils";
import type { Contributor } from "../../lib/home/type";

type Props = { contributors: Contributor[] };

export function Leaderboard({ contributors }: Props) {
  return (
    <section className="mt-8 px-5">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Leaderboard</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Top contributors this week</p>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-2.5">
        {contributors.map((contributor, index) => (
          <ContributorRow
            key={contributor.name}
            contributor={contributor}
            rank={index}
          />
        ))}
      </div>
    </section>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────────

function ContributorRow({
  contributor,
  rank,
}: {
  contributor: Contributor;
  rank: number;
}) {
  const rc = RANK_CONFIG[rank];

  return (
    <div
      className={`relative flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${rc.accent} border border-zinc-800/80 ${
        contributor.isCurrentUser ? `ring-1 ${rc.ring}` : ""
      } hover:border-zinc-700 transition-all`}
    >
      {/* Medal */}
      <div className="w-9 h-9 rounded-xl bg-zinc-900/80 flex items-center justify-center text-lg flex-shrink-0">
        {rc.medal}
      </div>

      {/* Avatar */}
      <img
        src={contributor.image}
        alt={contributor.name}
        className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            contributor.name
          )}&background=10b981&color=fff&size=44`;
        }}
      />

      {/* Name + level */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-white truncate">
            {contributor.name}
          </span>
          {contributor.isCurrentUser && (
            <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wider flex-shrink-0">
              YOU
            </span>
          )}
        </div>
        <p className="text-zinc-400 text-xs mt-0.5">{contributor.level}</p>
      </div>

      {/* Points chip */}
      <div className="bg-zinc-900/80 border border-zinc-800 px-3 py-2 rounded-xl flex-shrink-0">
        <span className="font-bold text-base text-white tabular-nums">
          {contributor.points}
        </span>
        <span className="text-zinc-500 text-[10px] ml-0.5">pts</span>
      </div>
    </div>
  );
}