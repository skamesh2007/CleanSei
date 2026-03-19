import { Flag, AlertCircle } from "lucide-react";

type Props = {
  current: number;
  target: number;
  reward: number;
  onContinue?: () => void;
};

export function DailyGoal({ current, target, reward, onContinue }: Props) {
  const progressPct = Math.round((current / target) * 100);

  return (
    <section className="mt-8 px-5">
      <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Flag size={15} className="text-emerald-400" />
            </div>
            <h3 className="text-white font-bold text-base">Daily Goal</h3>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            +{reward} pts
          </span>
        </div>

        <p className="text-zinc-400 text-sm mt-1 mb-5">
          Report <strong className="text-white">{target} waste spots</strong> today to earn your reward.
        </p>

        {/* ── Step indicators ── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {Array.from({ length: target }, (_, i) => {
              const done = i < current;
              return (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    done
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
              );
            })}
            <span className="text-zinc-400 text-xs ml-1">
              {current} of {target} completed
            </span>
          </div>
          <span className="text-zinc-500 text-xs">{progressPct}%</span>
        </div>

        {/* ── Progress bar ── */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* ── CTA ── */}
        <button
          onClick={onContinue}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl py-3 font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <AlertCircle size={15} />
          Continue Mission
        </button>
      </div>
    </section>
  );
}