import { MapPin, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusConfig } from "../../lib/home/utils";
import type { LiveReport } from "../../lib/home/type";

type Props = {
  reports:  LiveReport[];
  onSeeAll?: () => void;
};

const TYPE_CONFIG: Record<string, { bg: string; text: string }> = {
  plastic:    { bg: "bg-orange-500/10",  text: "text-orange-500"  },
  mixed:      { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  concrete:   { bg: "bg-muted",          text: "text-muted-foreground" },
  organic:    { bg: "bg-green-500/10",   text: "text-green-500"   },
  electronic: { bg: "bg-violet-500/10",  text: "text-violet-500"  },
};

const getTypeConfig = (type: string) =>
  TYPE_CONFIG[type.toLowerCase()] ?? { bg: "bg-muted", text: "text-muted-foreground" };

export function LiveReports({ reports, onSeeAll }: Props) {
  return (
    <section className="mt-8">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between px-5 mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Live Reports</h2>
          <p className="text-muted-foreground text-xs mt-0.5">Recently reported issues</p>
        </div>
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
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

function ReportCard({ report }: { report: LiveReport }) {
  const { badge, dot, label } = getStatusConfig(report.status);
  const typeConfig = getTypeConfig(report.type ?? "mixed");

  return (
    <button className="bg-card border border-border rounded-2xl p-3 w-52 flex-shrink-0 text-left hover:border-border/60 hover:-translate-y-0.5 hover:bg-accent/40 transition-all group">

      {/* ── Image + status badge ── */}
      <div className="relative">
        <img
          src={report.img}
          alt={report.title}
          className="w-full h-28 rounded-xl object-cover bg-muted block"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/208x112?text=${encodeURIComponent(
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
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-emerald-500 transition-colors">
          {report.title}
        </p>

        <Badge
          className={`mt-1.5 text-[10px] font-semibold px-2 py-0 h-4 border-0 rounded-full ${typeConfig.bg} ${typeConfig.text}`}
        >
          {report.type ?? "General"}
        </Badge>

        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin size={9} />
            {report.location}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock size={9} />
            {report.time}
          </span>
        </div>
      </div>
    </button>
  );
}