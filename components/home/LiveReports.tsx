"use client";

import { MapPin, Clock, ChevronRight, Inbox } from "lucide-react";
import { Badge }    from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportModal }     from "@/components/home/ReportModal";
import { useReportModal }  from "@/lib/home/UseReportModal";
import { getStatusConfig } from "../../lib/home/utils";
import type { LiveReport } from "../../lib/home/type";

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { bg: string; text: string }> = {
  plastic:    { bg: "bg-orange-500/10",  text: "text-orange-500"       },
  paper:      { bg: "bg-sky-500/10",     text: "text-sky-500"          },
  glass:      { bg: "bg-cyan-500/10",    text: "text-cyan-500"         },
  metal:      { bg: "bg-slate-500/10",   text: "text-slate-500"        },
  mixed:      { bg: "bg-emerald-500/10", text: "text-emerald-500"      },
  concrete:   { bg: "bg-muted",          text: "text-muted-foreground" },
  organic:    { bg: "bg-green-500/10",   text: "text-green-500"        },
  electronic: { bg: "bg-violet-500/10",  text: "text-violet-500"       },
  other:      { bg: "bg-muted",          text: "text-muted-foreground" },
};

const getTypeConfig = (t: string) =>
  TYPE_CONFIG[t.toLowerCase()] ?? TYPE_CONFIG.other;

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  reports:   LiveReport[];
  loading?:  boolean;
  error?:    string | null;
  onSeeAll?: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LiveReports({ reports, loading, error, onSeeAll }: Props) {
  const { selected, open, close } = useReportModal();

  return (
    <>
      <section className="mt-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Live Reports</h2>
            <p className="text-muted-foreground text-xs mt-0.5">Tap a card to see details</p>
          </div>
          <button
            onClick={onSeeAll}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            See all <ChevronRight size={14} />
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-52 flex-shrink-0 space-y-2">
                <Skeleton className="w-full h-28 rounded-xl" />
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <p className="px-5 text-sm text-destructive">{error}</p>
        )}

        {/* ── Empty ── */}
        {!loading && !error && reports.length === 0 && (
          <div className="px-5 flex flex-col items-center justify-center py-10 text-center gap-2">
            <Inbox size={32} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No reports yet.</p>
            <p className="text-xs text-muted-foreground/60">
              Be the first to report waste in your area!
            </p>
          </div>
        )}

        {/* ── Cards ── */}
        {!loading && !error && reports.length > 0 && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {reports.map((item) => (
              <ReportCard
                key={item.id}
                report={item}
                onClick={() => open(item)}
              />
            ))}
          </div>
        )}
      </section>

      <ReportModal report={selected} onClose={close} />
    </>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
/*
  FIX 5: Removed motion.button + layoutId from every card.
  Each card having layoutId creates a Framer Motion node that constantly
  tracks its position via ResizeObserver even while nothing is animating.
  With 10-20 cards that's 10-20 observers running during scroll.

  Replaced with a plain <button> + CSS active:scale for tap feedback.
  This is instant — no JS involved, handled entirely by the browser compositor.
*/

function ReportCard({
  report,
  onClick,
}: {
  report:  LiveReport;
  onClick: () => void;
}) {
  const { badge, dot, label } = getStatusConfig(report.status);
  const tc = getTypeConfig(report.type ?? "other");

  return (
    <button
      onClick={onClick}
      className="bg-card border border-border rounded-2xl p-3 w-52 flex-shrink-0 text-left active:scale-[0.97] transition-transform duration-100 group"
    >
      {/* Image */}
      <div className="relative">
        {report.img ? (
          <img
            src={report.img}
            alt={report.title}
            className="w-full h-28 rounded-xl object-cover bg-muted block"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://placehold.co/208x112?text=${encodeURIComponent(report.title)}`;
            }}
          />
        ) : (
          <div className="w-full h-28 rounded-xl bg-muted flex items-center justify-center">
            <Inbox size={24} className="text-muted-foreground/30" />
          </div>
        )}

        {/* Status badge */}
        <span
          className={`absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
          {label}
        </span>
      </div>

      {/* Content */}
      <div className="mt-2.5">
        <p className="text-sm font-semibold text-foreground truncate group-active:text-emerald-500 transition-colors">
          {report.title}
        </p>

        <Badge
          className={`mt-1.5 text-[10px] font-semibold px-2 py-0 h-4 border-0 rounded-full ${tc.bg} ${tc.text}`}
        >
          {report.type ?? "General"}
        </Badge>

        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground truncate max-w-[100px]">
            <MapPin size={9} className="flex-shrink-0" />
            {report.location}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground flex-shrink-0">
            <Clock size={9} />
            {report.time}
          </span>
        </div>
      </div>
    </button>
  );
}