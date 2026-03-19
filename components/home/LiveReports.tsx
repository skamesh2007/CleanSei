import { MapPin, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusConfig } from "../../lib/home/utils";
import type { LiveReport } from "../../lib/home/type";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  reports: LiveReport[];
  onSeeAll?: () => void;
};

// ─── Waste type color map ──────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { bg: string; text: string }> = {
  plastic:   { bg: "bg-orange-500/10", text: "text-orange-400" },
  mixed:     { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  concrete:  { bg: "bg-zinc-500/10",   text: "text-zinc-400"   },
  organic:   { bg: "bg-green-500/10",  text: "text-green-400"  },
  electronic:{ bg: "bg-violet-500/10", text: "text-violet-400" },
};

const getTypeConfig = (type: string) =>
  TYPE_CONFIG[type.toLowerCase()] ?? { bg: "bg-zinc-500/10", text: "text-zinc-400" };

// ─── Component ────────────────────────────────────────────────────────────────

export function LiveReports({ reports, onSeeAll }: Props) {
  return (
    <section className="mt-8">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between px-5 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Live Reports</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Recently reported issues</p>
        </div>
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          See all <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Horizontal scroll ── */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reports.map((item) => (
          <ReportCard key={item.id} report={item} />
        ))}
      </div>
    </section>
  );
}

// ─── Card sub-component ───────────────────────────────────────────────────────

function ReportCard({ report }: { report: LiveReport }) {
  const { badge, dot, label } = getStatusConfig(report.status);
  const typeConfig = getTypeConfig(report.type ?? "mixed");

  return (
    <button className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-3 w-52 flex-shrink-0 text-left hover:border-zinc-700 hover:-translate-y-0.5 transition-all group">

      {/* ── Image + status badge ── */}
      <div className="relative">
        <img
          src={report.img}
          alt={report.title}
          className="w-full h-28 rounded-xl object-cover bg-zinc-800 block"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/208x112/18181b/3f3f46?text=${encodeURIComponent(
              report.title
            )}`;
          }}
        />

        {/* Status badge */}
        <span
          className={`absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
          {label}
        </span>
      </div>

      {/* ── Content ── */}
      <div className="mt-2.5">
        {/* Title */}
        <p className="text-sm font-semibold text-white truncate group-hover:text-emerald-300 transition-colors">
          {report.title}
        </p>

        {/* Waste type chip */}
        <Badge
          className={`mt-1.5 text-[10px] font-semibold px-2 py-0 h-4 border-0 rounded-full ${typeConfig.bg} ${typeConfig.text}`}
        >
          {report.type ?? "General"}
        </Badge>

        {/* Location + time */}
        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center gap-1 text-[11px] text-zinc-500">
            <MapPin size={9} />
            {report.location}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-500">
            <Clock size={9} />
            {report.time}
          </span>
        </div>
      </div>
    </button>
  );
}