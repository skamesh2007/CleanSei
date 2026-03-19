import { Card, CardContent } from "@/components/ui/card";

type Props = {
  score: number;
  maxScore?: number;
  rank: string;
  cityLabel?: string;
  level: string;
  nextLevelLabel: string;
  nextLevelScore: number;
  streakDays: number;
  weeklyPoints: number[]; // 7 values, Mon → Sun
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const CIRCUMFERENCE = 2 * Math.PI * 42; // r = 42

// ─── Component ────────────────────────────────────────────────────────────────

export function SwachhScore({
  score,
  maxScore = 500,
  rank,
  cityLabel = "Chennai",
  level,
  nextLevelLabel,
  nextLevelScore,
  streakDays,
  weeklyPoints,
}: Props) {
  const progress       = Math.min(score / maxScore, 1);
  const dashOffset     = CIRCUMFERENCE * (1 - progress);
  const levelProgress  = Math.min(score / nextLevelScore, 1);
  const weekMax        = Math.max(...weeklyPoints, 1);

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100 dark:border-border bg-white dark:bg-card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 overflow-hidden">

      {/* ── Header band ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between  border-b border-gray-100 dark:border-border px-5 py-3">
        <div className="flex items-center gap-2">
          {/* Star icon */}
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1L10 6H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6H6L8 1Z"
              className="fill-blue-500 dark:fill-blue-400"
            />
          </svg>
          <span className="text-sm font-semibold text-gray-600 dark:text-muted-foreground">
            SwachhScore
          </span>
        </div>
        <span className="text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full">
          Top 5% in {cityLabel}
        </span>
      </div>

      <CardContent className="p-5 space-y-5">

        {/* ── Ring + stat grid ──────────────────────────────────────────── */}
        <div className="flex items-center gap-6">

          {/* Progress ring */}
          <div className="relative flex-shrink-0 w-[104px] h-[104px]">
            <svg width="104" height="104" viewBox="0 0 104 104">
              {/* Track */}
              <circle
                cx="52" cy="52" r="42"
                fill="none"
                className="stroke-gray-100 dark:stroke-gray-700"
                strokeWidth="8"
              />
              {/* Progress arc */}
              <circle
                cx="52" cy="52" r="42"
                fill="none"
                className="stroke-blue-500 dark:stroke-blue-400"
                strokeWidth="8"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 52 52)"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
              {/* Score label */}
              <text
                x="52" y="47"
                textAnchor="middle" dominantBaseline="central"
                className="fill-gray-900 dark:fill-foreground"
                style={{ fontSize: 22, fontWeight: 500, fontFamily: "inherit" }}
              >
                {score}
              </text>
              <text
                x="52" y="65"
                textAnchor="middle" dominantBaseline="central"
                className="fill-gray-400 dark:fill-muted-foreground"
                style={{ fontSize: 11, fontFamily: "inherit" }}
              >
                / {maxScore}
              </text>
            </svg>
          </div>

          {/* 2×2 stat chips */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            <StatChip label="City rank"  value={rank}                    valueClass="text-gray-900 dark:text-foreground text-lg" />
            <StatChip label="Level"      value={level}                   valueClass="text-blue-600 dark:text-blue-400 text-sm" />
            <StatChip label="Next level" value={`${nextLevelScore} pts`} valueClass="text-gray-900 dark:text-foreground text-sm" />
            <StatChip label="Streak"     value={`${streakDays} days`}    valueClass="text-amber-500 dark:text-amber-400 text-sm" />
          </div>
        </div>

        {/* ── Progress to next level ──────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400 dark:text-muted-foreground">
              Progress to {nextLevelLabel}
            </span>
            <span className="text-xs font-semibold text-gray-600 dark:text-foreground">
              {score} / {nextLevelScore}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-700"
              style={{ width: `${levelProgress * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-muted-foreground mt-1">
            {nextLevelScore - score} more points to unlock {nextLevelLabel}
          </p>
        </div>

        {/* ── Weekly sparkline ─────────────────────────────────────────── */}
        <div>
          <p className="text-[11px] text-gray-400 dark:text-muted-foreground mb-2">
            This week
          </p>
          <div className="flex items-end gap-1.5 h-10">
            {weeklyPoints.map((pts, i) => {
              const today = new Date().getDay(); // 0 = Sun
              // Convert to Mon-indexed (Mon=0 … Sun=6)
              const monIndexed = (today + 6) % 7;
              const isToday    = i === monIndexed;
              const barHeight  = Math.max(4, Math.round((pts / weekMax) * 40));

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-full rounded-sm transition-all duration-500 ${
                      isToday
                        ? "bg-blue-500 dark:bg-blue-400"
                        : "bg-blue-200 dark:bg-blue-900/60"
                    }`}
                    style={{ height: barHeight }}
                  />
                  <span
                    className={`text-[10px] ${
                      isToday
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-gray-400 dark:text-muted-foreground"
                    }`}
                  >
                    {DAY_LABELS[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

// ─── Sub-component ─────────────────────────────────────────────────────────────

function StatChip({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-muted rounded-xl px-3 py-2">
      <p className="text-[11px] text-gray-400 dark:text-muted-foreground mb-0.5">
        {label}
      </p>
      <p className={`font-semibold leading-tight ${valueClass}`}>{value}</p>
    </div>
  );
}