import type { Badge } from "../../lib/profile/types";

type Props = {
  badges: Badge[];
};

export function Achievements({ badges }: Props) {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-3">
        🏅 Achievements
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {badges.map((badge) => (
          <button
            key={badge.name}
            className="flex-shrink-0 w-36 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-2xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
          >
            {badge.icon}
            <span className="text-sm font-semibold text-gray-800 dark:text-foreground mt-2 text-center leading-tight">
              {badge.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}