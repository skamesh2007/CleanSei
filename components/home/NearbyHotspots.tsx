import { ChevronRight, MapPin, Clock, MapPinOff } from "lucide-react";
import { Badge }     from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton }  from "@/components/ui/skeleton";
import { getSeverityColor, toMapPercent } from "../../lib/home/utils";
import type { Hotspot } from "../../lib/home/type";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  hotspots:   Hotspot[];
  loading?:   boolean;
  error?:     string | null;
  onViewAll?: () => void;
};

const SEVERITY_CONFIG = {
  high:   { badge: "bg-red-500/10 text-red-500 border-red-500/20"             },
  medium: { badge: "bg-orange-500/10 text-orange-500 border-orange-500/20"    },
  low:    { badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function NearbyHotspots({ hotspots, loading, error, onViewAll }: Props) {
  const activeCount = hotspots.length;

  return (
    <section className="mt-8 px-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Nearby Hotspots</h2>
          <p className="text-muted-foreground text-xs mt-0.5">
            {loading
              ? "Loading active reports…"
              : `${activeCount} active report${activeCount !== 1 ? "s" : ""} near you`}
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          View all <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <Skeleton className="w-full h-40 rounded-none" />
          <Separator />
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="w-2 h-2 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-2/3 rounded" />
                  <Skeleton className="h-2.5 w-1/2 rounded" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && hotspots.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-2 text-center">
          <MapPinOff size={28} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No active hotspots nearby.</p>
          <p className="text-xs text-muted-foreground/60">All reported issues are resolved!</p>
        </div>
      )}

      {/* ── Map + list ── */}
      {!loading && !error && hotspots.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">

          {/* Map */}
          <div className="relative w-full h-40">
            <iframe
              title="Hotspots Map"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(0.5) contrast(1.1)" }}
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=80.265%2C13.078%2C80.280%2C13.092&layer=mapnik&marker=13.0827%2C80.2707"
            />

            {/* Severity pins */}
            {hotspots.map((spot) => {
              const pos   = toMapPercent(spot.latitude, spot.longitude);
              const color = getSeverityColor(spot.severity);
              return (
                <div
                  key={spot.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  title={spot.title}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 border-background relative z-10"
                    style={{ backgroundColor: color }}
                  />
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-60"
                    style={{ backgroundColor: color }}
                  />
                </div>
              );
            })}

            {/* Active count pill */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-background/85 border border-border rounded-lg px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-foreground">
                {activeCount} active
              </span>
            </div>
          </div>

          <Separator />

          {/* List */}
          <div>
            {hotspots.map((spot, index) => {
              const cfg = SEVERITY_CONFIG[spot.severity];
              return (
                <div key={spot.id}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 active:bg-accent/70 transition-colors">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: getSeverityColor(spot.severity),
                        boxShadow:       `0 0 6px ${getSeverityColor(spot.severity)}80`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {spot.title}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin size={9} />
                          {spot.distance ?? "Nearby"}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock size={9} />
                          {spot.time ?? "Recently"}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold capitalize rounded-full px-2.5 h-5 ${cfg.badge}`}
                    >
                      {spot.severity}
                    </Badge>
                  </button>
                  {index < hotspots.length - 1 && <Separator className="mx-4 w-auto" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}