import { ChevronRight, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getSeverityColor, toMapPercent } from "../../lib/home/utils";
import type { Hotspot } from "../../lib/home/type";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  hotspots: Hotspot[];
  onViewAll?: () => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG = {
  high:   { badge: "bg-red-500/10 text-red-400 border-red-500/20",    glow: "#f87171" },
  medium: { badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", glow: "#fb923c" },
  low:    { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", glow: "#34d399" },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function NearbyHotspots({ hotspots, onViewAll }: Props) {
  const activeCount = hotspots.length;

  return (
    <section className="mt-8 px-5">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Nearby Hotspots</h2>
          <p className="text-zinc-500 text-xs mt-0.5">
            {activeCount} active report{activeCount !== 1 ? "s" : ""} near you
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View all <ChevronRight size={14} />
        </button>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl overflow-hidden">

        {/* ── Map ── */}
        <div className="relative w-full h-40">
          <iframe
            title="Hotspots Map"
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: "grayscale(0.65) brightness(0.8) contrast(1.15)",
            }}
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=80.265%2C13.078%2C80.280%2C13.092&layer=mapnik&marker=13.0827%2C80.2707"
          />

          {/* Pulsing severity pins */}
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
                  className="w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0f] relative z-10"
                  style={{ backgroundColor: color }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-60"
                  style={{ backgroundColor: color }}
                />
              </div>
            );
          })}

          {/* Active count pill overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-zinc-950/85 border border-zinc-800/60 rounded-lg px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-zinc-200">
              {activeCount} active
            </span>
          </div>
        </div>

        <Separator className="bg-zinc-800/80" />

        {/* ── Hotspot list ── */}
        <div>
          {hotspots.map((spot, index) => {
            const cfg = SEVERITY_CONFIG[spot.severity];
            return (
              <div key={spot.id}>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors">

                  {/* Severity dot */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: getSeverityColor(spot.severity),
                      boxShadow: `0 0 6px ${getSeverityColor(spot.severity)}80`,
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {spot.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                        <MapPin size={9} />
                        {spot.distance ?? "Nearby"}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                        <Clock size={9} />
                        {spot.time ?? "Recently"}
                      </span>
                    </div>
                  </div>

                  {/* Severity badge */}
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold capitalize rounded-full px-2.5 h-5 ${cfg.badge}`}
                  >
                    {spot.severity}
                  </Badge>
                </button>

                {index < hotspots.length - 1 && (
                  <Separator className="bg-zinc-800/50 mx-4 w-auto" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}