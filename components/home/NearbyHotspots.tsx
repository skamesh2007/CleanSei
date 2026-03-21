"use client";

import { useState }   from "react";
import dynamic         from "next/dynamic";
import { ChevronRight, MapPin, Clock, MapPinOff } from "lucide-react";
import { Badge }     from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton }  from "@/components/ui/skeleton";
import { getSeverityColor } from "../../lib/home/utils";
import type { Hotspot } from "../../lib/home/type";

const HotspotsMap = dynamic(
  () => import("@/components/home/Hotspotsmap").then((m) => m.HotspotsMap),
  {
    ssr:     false,
    loading: () => <Skeleton className="w-full h-[180px] rounded-none" />,
  }
);

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

export function NearbyHotspots({ hotspots, loading, error, onViewAll }: Props) {
  const activeCount = hotspots.length;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleRowClick(id: string) {
    // Toggle off if already selected
    setSelectedId((prev) => (prev === id ? null : id));
  }

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

      {/* ── Loading ── */}
      {loading && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <Skeleton className="w-full h-[180px] rounded-none" />
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
          <div className="relative">
            <HotspotsMap hotspots={hotspots} selectedId={selectedId} height={180} />
            <div className="absolute top-2.5 left-2.5 z-[1000] flex items-center gap-1.5 bg-background/90 border border-border rounded-lg px-2.5 py-1 pointer-events-none">
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
              const cfg        = SEVERITY_CONFIG[spot.severity];
              const isSelected = spot.id === selectedId;

              return (
                <div key={spot.id}>
                  <button
                    onClick={() => handleRowClick(spot.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${isSelected
                        ? "bg-accent/50"
                        : "hover:bg-accent/50 active:bg-accent/70"
                      }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: getSeverityColor(spot.severity),
                        boxShadow: isSelected
                          ? `0 0 0 3px ${getSeverityColor(spot.severity)}30, 0 0 8px ${getSeverityColor(spot.severity)}60`
                          : `0 0 6px ${getSeverityColor(spot.severity)}80`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate transition-colors ${isSelected ? "text-foreground" : "text-foreground"}`}>
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