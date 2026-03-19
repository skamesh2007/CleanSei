import { Card, CardContent } from "@/components/ui/card";
import type { ActivityStat } from "../../lib/profile/types";

type Props = {
  stats: ActivityStat[];
};

export function ActivityStats({ stats }: Props) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-3">
        📈 Activity Stats
      </h2>
      <div className="space-y-2">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-xl shadow-sm border border-gray-100 dark:border-border bg-white dark:bg-card"
          >
            <CardContent className="p-4 flex items-center justify-between">
              <span className="text-base font-medium text-gray-500 dark:text-muted-foreground">
                {stat.label}
              </span>
              <span className="text-base font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                {stat.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}