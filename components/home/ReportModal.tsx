"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, Clock, AlertTriangle, CheckCircle2,
  Loader, Recycle, Newspaper, GlassWater, Wrench,
  Leaf, Cpu, HelpCircle, Inbox,
} from "lucide-react";
import { Badge }     from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { LiveReport } from "@/lib/home/type";
import { getStatusConfig } from "@/lib/home/utils";

// ─── Spring config ────────────────────────────────────────────────────────────

const SPRING = { type: "spring", stiffness: 380, damping: 32, mass: 0.9 } as const;

// ─── Type / severity configs ──────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { bg: string; text: string; Icon: React.FC<{ size?: number; className?: string }> }> = {
  plastic:    { bg: "bg-orange-500/10",  text: "text-orange-500",      Icon: Recycle     },
  paper:      { bg: "bg-sky-500/10",     text: "text-sky-500",         Icon: Newspaper   },
  glass:      { bg: "bg-cyan-500/10",    text: "text-cyan-500",        Icon: GlassWater  },
  metal:      { bg: "bg-slate-500/10",   text: "text-slate-500",       Icon: Wrench      },
  organic:    { bg: "bg-green-500/10",   text: "text-green-500",       Icon: Leaf        },
  electronic: { bg: "bg-violet-500/10",  text: "text-violet-500",      Icon: Cpu         },
  other:      { bg: "bg-muted",          text: "text-muted-foreground", Icon: HelpCircle },
};

const getTypeConfig = (type: string) =>
  TYPE_CONFIG[type.toLowerCase()] ?? TYPE_CONFIG.other;

// ─── Meta row ─────────────────────────────────────────────────────────────────

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.FC<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon size={13} />
        {label}
      </span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReportModalProps {
  report:  LiveReport | null;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportModal({ report, onClose }: ReportModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when a new report opens
  useEffect(() => {
    if (report && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [report?.id]);

  const tc = report ? getTypeConfig(report.type ?? "other") : TYPE_CONFIG.other;
  const sc = report ? getStatusConfig(report.status) : null;

  return (
    <AnimatePresence>
      {report && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          {/* ── Modal panel ── */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none px-0 sm:px-4">
            <motion.div
              key={`modal-${report.id}`}
              layoutId={`card-${report.id}`}
              className="pointer-events-auto w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
              style={{ height: "75vh" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.97, y: 30 }}
              transition={SPRING}
            >
              {/* ── Scrollable content ── */}
              <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">

                {/* ── Hero image ── */}
                <motion.div
                  layoutId={`img-${report.id}`}
                  className="relative w-full flex-shrink-0"
                  style={{ height: "42%" }}
                  transition={SPRING}
                >
                  {report.img ? (
                    <img
                      src={report.img}
                      alt={report.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Inbox size={40} className="text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />

                  {/* Drag indicator (mobile) */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/30 sm:hidden" />

                  {/* Close button */}
                  <motion.button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm border border-border text-foreground hover:bg-background transition-colors"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                  >
                    <X size={15} />
                  </motion.button>

                  {/* Status badge on image */}
                  {sc && (
                    <motion.span
                      layoutId={`status-${report.id}`}
                      transition={SPRING}
                      className={`absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${sc.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                      {sc.label}
                    </motion.span>
                  )}
                </motion.div>

                {/* ── Body ── */}
                <motion.div
                  className="px-5 pt-4 pb-8 space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.28 }}
                >
                  {/* Title + type badge */}
                  <div className="flex items-start justify-between gap-3">
                    <motion.h2
                      layoutId={`title-${report.id}`}
                      transition={SPRING}
                      className="text-lg font-bold text-foreground leading-tight flex-1"
                    >
                      {report.title}
                    </motion.h2>

                    <Badge
                      className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 h-auto border-0 rounded-full ${tc.bg} ${tc.text}`}
                    >
                      <tc.Icon size={11} />
                      {report.type ?? "General"}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Meta rows */}
                  <div className="divide-y divide-border">
                    <MetaRow icon={MapPin} label="Location" value={report.location ?? "Unknown"} />
                    <MetaRow icon={Clock}  label="Reported"  value={report.time     ?? "—"} />
                    {(report as any).severity && (
                      <MetaRow
                        icon={AlertTriangle}
                        label="Severity"
                        value={((report as any).severity as string).charAt(0).toUpperCase() +
                               ((report as any).severity as string).slice(1)}
                      />
                    )}
                  </div>

                  <Separator />

                  {/* Status detail */}
                  <StatusDetail status={report.status} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Status detail block ──────────────────────────────────────────────────────

function StatusDetail({ status }: { status: string }) {
  const configs: Record<string, {
    Icon:  React.FC<{ size?: number; className?: string }>;
    color: string;
    bg:    string;
    title: string;
    desc:  string;
  }> = {
    pending: {
      Icon:  Loader,
      color: "text-amber-500",
      bg:    "bg-amber-500/10",
      title: "Awaiting Review",
      desc:  "This report is in the queue and will be reviewed by a local volunteer soon.",
    },
    in_progress: {
      Icon:  AlertTriangle,
      color: "text-sky-500",
      bg:    "bg-sky-500/10",
      title: "Being Addressed",
      desc:  "A cleanup crew has been assigned and is working on resolving this issue.",
    },
    resolved: {
      Icon:  CheckCircle2,
      color: "text-emerald-500",
      bg:    "bg-emerald-500/10",
      title: "Resolved",
      desc:  "Great news — this waste has been cleaned up. Thank you to everyone involved!",
    },
  };

  const cfg = configs[status] ?? configs.pending;

  return (
    <div className={`flex items-start gap-3 rounded-2xl p-4 ${cfg.bg}`}>
      <cfg.Icon size={18} className={`flex-shrink-0 mt-0.5 ${cfg.color}`} />
      <div>
        <p className={`text-sm font-semibold ${cfg.color}`}>{cfg.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{cfg.desc}</p>
      </div>
    </div>
  );
}