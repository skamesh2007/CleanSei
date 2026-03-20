import { Flag, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type Props = {
  current:     number;
  target:      number;
  reward:      number;
  onContinue?: () => void;
};

export function DailyGoal({ current, target, reward, onContinue }: Props) {
  const progressPct = Math.round((current / target) * 100);

  return (
    <section className="mt-8 px-5">
      <div className="bg-card border border-border rounded-2xl p-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Flag size={15} className="text-emerald-500" />
            </div>
            <h3 className="text-foreground font-bold text-base">Daily Goal</h3>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            +{reward} pts
          </span>
        </div>

        <p className="text-muted-foreground text-sm mt-1 mb-5">
          Report <strong className="text-foreground">{target} waste spots</strong> today to earn your reward.
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
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
              );
            })}
            <span className="text-muted-foreground text-xs ml-1">
              {current} of {target} completed
            </span>
          </div>
          <span className="text-muted-foreground text-xs">{progressPct}%</span>
        </div>

        {/* ── Progress bar ── */}
        <Progress
          value={progressPct}
          className="h-1.5 mb-5 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400"
        />

        {/* ── CTA ── */}
        <Button
          onClick={onContinue}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
        >
          <AlertCircle size={15} />
          Continue Mission
        </Button>
      </div>
    </section>
  );
}