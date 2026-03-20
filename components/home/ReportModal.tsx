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

// ─── Configs ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, {
  bg:   string;
  text: string;
  Icon: React.FC<{ size?: number; className?: string }>;
}> = {
  plastic:    { bg: "bg-orange-500/10",  text: "text-orange-500",       Icon: Recycle    },
  paper:      { bg: "bg-sky-500/10",     text: "text-sky-500",          Icon: Newspaper  },
  glass:      { bg: "bg-cyan-500/10",    text: "text-cyan-500",         Icon: GlassWater },
  metal:      { bg: "bg-slate-500/10",   text: "text-slate-500",        Icon: Wrench     },
  organic:    { bg: "bg-green-500/10",   text: "text-green-500",        Icon: Leaf       },
  electronic: { bg: "bg-violet-500/10",  text: "text-violet-500",       Icon: Cpu        },
  other:      { bg: "bg-muted",          text: "text-muted-foreground", Icon: HelpCircle },
};

const getTypeConfig = (type: string) =>
  TYPE_CONFIG[type.toLowerCase()] ?? TYPE_CONFIG.other;

// ─── MetaRow ──────────────────────────────────────────────────────────────────

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon:  React.FC<{ size?: number; className?: string }>;
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

// ─── StatusDetail ─────────────────────────────────────────────────────────────

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
      desc:  "This report is queued and will be reviewed by a local volunteer soon.",
    },
    in_progress: {
      Icon:  AlertTriangle,
      color: "text-sky-500",
      bg:    "bg-sky-500/10",
      title: "Being Addressed",
      desc:  "A cleanup crew has been assigned and is working on this.",
    },
    resolved: {
      Icon:  CheckCircle2,
      color: "text-emerald-500",
      bg:    "bg-emerald-500/10",
      title: "Resolved",
      desc:  "This waste has been cleaned up. Thank you to everyone involved!",
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

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReportModalProps {
  report:  LiveReport | null;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportModal({ report, onClose }: ReportModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (report && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [report?.id]);

  const tc = report ? getTypeConfig(report.type ?? "other") : TYPE_CONFIG.other;
  const sc = report ? getStatusConfig(report.status) : null;

  return (
    <AnimatePresence>
      {report && (
        <>
          {/*
            ── Backdrop ──────────────────────────────────────────────────────
            FIX 1: Removed backdrop-blur-md entirely.
            backdrop-filter forces a full offscreen compositing pass on every
            frame on Adreno 610 (Snapdragon 662). A solid semi-transparent
            bg is visually near-identical and costs nothing.
          */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={onClose}
          />

          {/*
            ── Modal panel ───────────────────────────────────────────────────
            FIX 2: Replaced layoutId morph with a simple translateY slide-up.
            layoutId forces Framer Motion to track and interpolate the bounding
            box every frame (getBoundingClientRect calls mid-animation = layout
            thrash). A plain y animation is a single GPU transform with zero
            layout reads.

            FIX 3: Removed shadow-2xl.
            Large box-shadows are repainted on every frame during a transform
            on Android. Replaced with a top border line for visual separation.
          */}
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none px-3 pb-25">
            <motion.div
              key={`modal-${report.id}`}
              className="pointer-events-auto w-full max-w-md bg-card border border-border rounded-3xl overflow-hidden will-change-transform shadow-[0_-2px_24px_rgba(0,0,0,0.10)]"
              style={{ height: "75vh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36, mass: 0.8 }}
            >
              <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">

                {/*
                  ── Hero image ────────────────────────────────────────────
                  FIX 4: Removed layoutId from the image.
                  Morphing a large img element via layoutId composites the
                  image texture on every frame. Now it's a static element
                  that fades in after the panel slides up.
                */}
                <div className="relative w-full flex-shrink-0" style={{ height: "42%" }}>
                  {report.img ? (
                    <motion.img
                      key={report.id}
                      src={report.img}
                      alt={report.title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.15 }}
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

                  {/* Drag handle */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/30" />

                  {/* Close — plain button, no whileHover (saves a compositor layer) */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-background/70 border border-border text-foreground active:scale-95 transition-transform"
                  >
                    <X size={15} />
                  </button>

                  {/* Status badge */}
                  {sc && (
                    <span
                      className={`absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${sc.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                      {sc.label}
                    </span>
                  )}
                </div>

                {/* ── Body ── */}
                <motion.div
                  className="px-5 pt-4 pb-8 space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold text-foreground leading-tight flex-1">
                      {report.title}
                    </h2>
                    <Badge
                      className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 h-auto border-0 rounded-full ${tc.bg} ${tc.text}`}
                    >
                      <tc.Icon size={11} />
                      {report.type ?? "General"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="divide-y divide-border">
                    <MetaRow icon={MapPin} label="Location" value={report.location ?? "Unknown"} />
                    <MetaRow icon={Clock}  label="Reported"  value={report.time     ?? "—"} />
                    {(report as any).severity && (
                      <MetaRow
                        icon={AlertTriangle}
                        label="Severity"
                        value={
                          ((report as any).severity as string).charAt(0).toUpperCase() +
                          ((report as any).severity as string).slice(1)
                        }
                      />
                    )}
                  </div>

                  <Separator />

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