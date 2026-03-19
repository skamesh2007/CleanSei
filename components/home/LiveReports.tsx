import { MapPin, Clock, ChevronRight } from "lucide-react";
import { getStatusConfig } from "../../lib/home/utils";
import type { LiveReport } from "../../lib/home/type";

type Props = { reports: LiveReport[] };

export function LiveReports({ reports }: Props) {
  return (
    <section className="mt-8">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between px-5 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Live Reports</h2>
          <p className="text-zinc-500 text-xs mt-0.5">Recently reported issues</p>
        </div>
        <button className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
          See All <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Horizontal scroll cards ── */}
      <div className="flex gap-4 overflow-x-auto pb-2 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reports.map((item) => (
          <ReportCard key={item.id} report={item} />
        ))}
      </div>
    </section>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────────

function ReportCard({ report }: { report: LiveReport }) {
  const { badge, dot, label } = getStatusConfig(report.status);

  return (
    <button className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-3.5 w-60 flex-shrink-0 text-left hover:border-zinc-700 transition-all hover:-translate-y-0.5 group">
      {/* Image + status badge */}
      <div className="relative">
        <img
          src={report.img}
          alt={report.title}
          className="w-full h-32 rounded-xl object-cover bg-zinc-800"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/240x128/18181b/52525b?text=${encodeURIComponent(
              report.title
            )}`;
          }}
        />
        <span
          className={`absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          {label}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3">
        <p className="font-bold text-white text-sm truncate group-hover:text-emerald-300 transition-colors">
          {report.title}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="flex items-center gap-1 text-zinc-500 text-[11px]">
            <MapPin size={10} /> {report.location}
          </span>
          <span className="flex items-center gap-1 text-zinc-500 text-[11px]">
            <Clock size={10} /> {report.time}
          </span>
        </div>
      </div>
    </button>
  );
}