import type { ReportStatus, Severity } from "../../lib/home/type";

export const getStatusConfig = (status: ReportStatus) => {
  const map: Record<string, { badge: string; dot: string; label: string }> = {
    resolved: {
      badge: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
      dot: "bg-emerald-400",
      label: "Resolved",
    },
    in_progress: {
      badge: "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30",
      dot: "bg-sky-400 animate-pulse",
      label: "In Progress",
    },
    pending: {
      badge: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
      dot: "bg-amber-400",
      label: "Attention",
    },
  };

  return (
    map[status] ?? {
      badge: "bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/30",
      dot: "bg-zinc-400",
      label: status,
    }
  );
};

export const getSeverityColor = (severity: Severity): string => {
  const map: Record<Severity, string> = {
    high: "#f87171",
    medium: "#fb923c",
    low: "#34d399",
  };
  return map[severity];
};

export const MAP_BOUNDS = {
  minLat: 13.08,
  maxLat: 13.095,
  minLng: 80.268,
  maxLng: 80.279,
};

export const toMapPercent = (
  lat: number,
  lng: number
): { x: number; y: number } => ({
  x:
    ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
    100,
  y:
    (1 -
      (lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
    100,
});

export const RANK_CONFIG = [
  {
    medal: "🥇",
    accent: "from-amber-500/20 to-amber-600/5",
    ring: "ring-amber-500/40",
  },
  {
    medal: "🥈",
    accent: "from-zinc-400/20 to-zinc-500/5",
    ring: "ring-zinc-400/40",
  },
  {
    medal: "🥉",
    accent: "from-orange-500/20 to-orange-600/5",
    ring: "ring-orange-500/40",
  },
];