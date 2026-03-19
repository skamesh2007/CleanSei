import type { Badge } from "../../lib/profile/types";
import type { AchievementBadge } from "../../lib/profile/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeStatus = "earned" | "locked";


type Props = {
  badges: AchievementBadge[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Achievements({ badges }: Props) {
  const earnedCount = badges.filter((b) => b.status === "earned").length;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MedalIcon />
          <h2 className="text-base font-semibold text-gray-800 dark:text-foreground">
            Achievements
          </h2>
        </div>
        <span className="text-xs text-gray-400 dark:text-muted-foreground bg-gray-50 dark:bg-muted border border-gray-100 dark:border-border px-2.5 py-0.5 rounded-full">
          {earnedCount} / {badges.length} earned
        </span>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {badges.map((badge) =>
          badge.status === "earned" ? (
            <EarnedCard key={badge.name} badge={badge} />
          ) : (
            <LockedCard key={badge.name} badge={badge} />
          )
        )}
      </div>
    </section>
  );
}

// ─── Earned card ──────────────────────────────────────────────────────────────

function EarnedCard({ badge }: { badge: AchievementBadge }) {
  return (
    <div className="group bg-white dark:bg-card border border-gray-100 dark:border-border rounded-2xl p-3.5 flex flex-col items-center gap-2.5 hover:-translate-y-0.5 transition-transform cursor-pointer">
      {/* Icon container */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-50 dark:bg-muted">
        {badge.icon}
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-[13px] font-semibold text-gray-800 dark:text-foreground leading-tight">
          {badge.name}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-muted-foreground mt-0.5">
          {badge.description}
        </p>
      </div>

      {/* Earned pill */}
      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${badge.earnedStyle ?? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
        Earned
      </span>
    </div>
  );
}

// ─── Locked card ──────────────────────────────────────────────────────────────

function LockedCard({ badge }: { badge: AchievementBadge }) {
  const pct =
    badge.progress != null && badge.target
      ? Math.min(Math.round((badge.progress / badge.target) * 100), 100)
      : 0;

  return (
    <div className="bg-gray-50 dark:bg-muted/50 border border-gray-100 dark:border-border rounded-2xl p-3.5 flex flex-col items-center gap-2.5 opacity-60">
      {/* Locked icon */}
      <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-muted flex items-center justify-center flex-shrink-0">
        <LockIcon />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-[13px] font-semibold text-gray-500 dark:text-muted-foreground leading-tight">
          {badge.name}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-muted-foreground mt-0.5">
          {badge.description}
        </p>
      </div>

      {/* Progress bar */}
      {badge.progress != null && badge.target != null && (
        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-gray-400 dark:text-muted-foreground">
              {badge.progress} / {badge.target}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-muted-foreground">
              {pct}%
            </span>
          </div>
          <div className="w-full h-1 bg-gray-200 dark:bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 dark:bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tiny SVG icons ───────────────────────────────────────────────────────────

function MedalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2L9.5 6H14L10.5 8.5L12 13L8 10.5L4 13L5.5 8.5L2 6H6.5L8 2Z"
        className="fill-amber-500 dark:fill-amber-400"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-300 dark:text-muted-foreground">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}