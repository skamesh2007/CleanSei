import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatItem = {
  label: string;
  value: number;
};

type Props = {
  displayName: string;
  email: string | null;
  photoURL: string | null;
  level?: string;
  location?: string;
  stats?: StatItem[];
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_STATS: StatItem[] = [
  { label: "Reports",  value: 15  },
  { label: "Cleanups", value: 8   },
  { label: "Points",   value: 340 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileInfo({
  displayName,
  email,
  photoURL,
  level = "Eco Warrior",
  location = "Chennai, Tamil Nadu",
  stats = DEFAULT_STATS,
}: Props) {
  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=1E40AF&color=fff&size=112`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl border border-gray-100 dark:border-border bg-white dark:bg-card overflow-hidden">

      {/* ── Cover band ── */}
      <div className="h-16 bg-gray-50 dark:bg-muted border-b border-gray-100 dark:border-border" />

      {/* ── Body ── */}
      <div className="flex flex-col items-center px-5 pb-5 -mt-14">

        {/* ── Avatar with gradient ring ── */}
        <div
          className="w-[108px] h-[108px] rounded-full p-[3px] flex-shrink-0"
          style={{
            background: "conic-gradient(#10b981, #3b82f6, #10b981)",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 dark:bg-muted border-[3px] border-white dark:border-card">
            <img
              src={photoURL ?? "/images/profile-placeholder.png"}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = avatarFallback;
              }}
            />
          </div>
        </div>

        {/* ── Name + email ── */}
        <div className="mt-3 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground leading-tight">
            {displayName}
          </h2>
          <p className="text-sm text-gray-400 dark:text-muted-foreground mt-1">
            {email ?? "No email"}
          </p>
        </div>

        {/* ── Badges ── */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap justify-center">
          <Badge
            variant="outline"
            className="text-[11px] font-medium border-0 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full px-2.5"
          >
            {level}
          </Badge>
          <Badge
            variant="outline"
            className="text-[11px] font-medium border-0 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full px-2.5"
          >
            Volunteer
          </Badge>
          {location && (
            <Badge
              variant="outline"
              className="text-[11px] font-medium border-0 bg-gray-50 dark:bg-muted text-gray-500 dark:text-muted-foreground rounded-full px-2.5 gap-1"
            >
              <MapPin size={10} />
              {location.split(",")[0]}
            </Badge>
          )}
        </div>

        {/* ── Stats strip ── */}
        <div className="w-full mt-5 rounded-xl border border-gray-100 dark:border-border bg-gray-50 dark:bg-muted overflow-hidden">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex">
                <div className="flex flex-col items-center gap-0.5 py-3 flex-1">
                  <span className="text-lg font-semibold text-gray-900 dark:text-foreground tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-gray-400 dark:text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                {i < stats.length - 1 && (
                  <Separator orientation="vertical" className="h-auto my-2" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}