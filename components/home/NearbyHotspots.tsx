import { ChevronRight } from "lucide-react";
import { getSeverityColor, toMapPercent } from "../../lib/home/utils";
import type { Hotspot } from "../../lib/home/type";

const LEGEND = [
  { color: "bg-red-400",     label: "High"   },
  { color: "bg-orange-400",  label: "Medium" },
  { color: "bg-emerald-400", label: "Low"    },
];

type Props = { hotspots: Hotspot[] };

export function NearbyHotspots({ hotspots }: Props) {
  return (
    <section className="mt-8 px-5">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Nearby Hotspots</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Waste reports in your area</p>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl overflow-hidden">
        {/* ── Map ── */}
        <div className="relative w-full h-44">
          <iframe
            title="Hotspots Map"
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: "grayscale(0.6) brightness(0.85) contrast(1.1)",
            }}
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=80.265%2C13.078%2C80.280%2C13.092&layer=mapnik&marker=13.0827%2C80.2707"
          />

          {/* Severity pins */}
          {hotspots.map((spot) => {
            const pos = toMapPercent(spot.latitude, spot.longitude);
            return (
              <div
                key={spot.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                title={spot.title}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-[#0a0a0f] shadow-lg"
                  style={{ backgroundColor: getSeverityColor(spot.severity) }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-60"
                  style={{ backgroundColor: getSeverityColor(spot.severity) }}
                />
              </div>
            );
          })}
        </div>

        {/* ── Legend ── */}
        <div className="flex justify-around px-4 py-3 border-t border-zinc-800/80">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 ${color} rounded-full`} />
              <span className="text-zinc-400 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}