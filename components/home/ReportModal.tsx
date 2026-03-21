"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, Clock, AlertTriangle, CheckCircle2,
  Loader, Recycle, Newspaper, GlassWater, Wrench,
  Leaf, Cpu, HelpCircle, Inbox, ArrowUpRight, ChevronRight
} from "lucide-react";
import { Badge }     from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { LiveReport } from "@/lib/home/type";
import { getStatusConfig } from "@/lib/home/utils";
import { getLocationName } from "@/lib/home/getLocationName";
import { Button } from "@/components/ui/button";


// ─── Configs ──────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, {
  bg:     string;
  text:   string;
  border: string;
  Icon:   React.FC<{ size?: number; className?: string }>;
}> = {
  plastic:    { bg: "bg-orange-500/10",  text: "text-orange-500",       border: "border-orange-500/20",  Icon: Recycle    },
  paper:      { bg: "bg-sky-500/10",     text: "text-sky-500",          border: "border-sky-500/20",     Icon: Newspaper  },
  glass:      { bg: "bg-cyan-500/10",    text: "text-cyan-500",         border: "border-cyan-500/20",    Icon: GlassWater },
  metal:      { bg: "bg-slate-500/10",   text: "text-slate-500",        border: "border-slate-500/20",   Icon: Wrench     },
  organic:    { bg: "bg-green-500/10",   text: "text-green-500",        border: "border-green-500/20",   Icon: Leaf       },
  electronic: { bg: "bg-violet-500/10",  text: "text-violet-500",       border: "border-violet-500/20",  Icon: Cpu        },
  other:      { bg: "bg-muted",          text: "text-muted-foreground", border: "border-border",         Icon: HelpCircle },
};

const getTypeConfig = (type: string) =>
  TYPE_CONFIG[type.toLowerCase()] ?? TYPE_CONFIG.other;

// ─── Status configs ───────────────────────────────────────────────────────────

const STATUS_DETAIL: Record<string, {
  Icon:  React.FC<{ size?: number; className?: string }>;
  color: string;
  bg:    string;
  label: string;
  desc:  string;
}> = {
  pending: {
    Icon:  Loader,
    color: "text-amber-500",
    bg:    "bg-amber-500/10",
    label: "Awaiting Review",
    desc:  "Queued for review by a local volunteer.",
  },
  in_progress: {
    Icon:  AlertTriangle,
    color: "text-sky-500",
    bg:    "bg-sky-500/10",
    label: "Being Addressed",
    desc:  "A cleanup crew has been assigned.",
  },
  resolved: {
    Icon:  CheckCircle2,
    color: "text-emerald-500",
    bg:    "bg-emerald-500/10",
    label: "Resolved",
    desc:  "Cleaned up. Thank you to everyone involved!",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReportModalProps {
  report:  LiveReport | null;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReportModal({ report, onClose }: ReportModalProps) {
  const [locationName, setLocationName] = useState("Loading...");

  // Reverse-geocode whenever the report's location changes
  useEffect(() => {
    if (!report?.location) { setLocationName("Unknown"); return; }
    const [lat, lon] = report.location.split(",").map((v) => Number(v.trim()));
    if (isNaN(lat) || isNaN(lon)) { setLocationName("Unknown"); return; }
    getLocationName(lat, lon)
      .then(setLocationName)
      .catch(() => setLocationName("Unknown"));
  }, [report?.location]);

  const openInMaps = () => {
    if (!report?.location) return;
    const [lat, lon] = report.location.split(",").map((v) => Number(v.trim()));
    if (!isNaN(lat) && !isNaN(lon))
      window.open(`https://www.google.com/maps?q=${lat},${lon}`, "_blank");
  };

  const tc  = report ? getTypeConfig(report.type ?? "other") : TYPE_CONFIG.other;
  const sc  = report ? getStatusConfig(report.status) : null;
  const sdc = report ? (STATUS_DETAIL[report.status] ?? STATUS_DETAIL.pending) : STATUS_DETAIL.pending;

  return (
    <AnimatePresence>
      {report && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[2000] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <div className="fixed inset-0 z-[2001] flex items-end justify-center pointer-events-none px-3 pb-50">
            <motion.div
              key={`modal-${report.id}`}
              className="pointer-events-auto w-full max-w-md bg-card border border-border/60 rounded-3xl overflow-hidden will-change-transform"
              style={{ boxShadow: "0 -4px 40px rgba(0,0,0,0.18)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 38, mass: 0.75 }}
            >
              {/* ── Hero image (fixed height, never grows) ── */}
              <div className="relative w-full h-44 flex-shrink-0">
                {report.img ? (
                  <motion.img
                    key={report.id}
                    src={report.img}
                    alt={report.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.22, delay: 0.12 }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Inbox size={36} className="text-muted-foreground/30" />
                  </div>
                )}

                {/* Gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                {/* Drag pill */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-9 h-[3px] rounded-full bg-white/25" />

                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-3.5 right-3.5 flex items-center justify-center w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 text-foreground active:scale-95 transition-transform cursor-pointer"
                >
                  <X size={14} />
                </button>

                {/* Status badge */}
                {sc && (
                  <span className={`absolute bottom-3.5 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${sc.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                    {sc.label}
                  </span>
                )}

                {/* Type badge — top-left overlapping hero */}
                <Badge
                  className={`absolute top-3.5 left-3.5 flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 h-auto border rounded-full ${tc.bg} ${tc.text} ${tc.border}`}
                >
                  <tc.Icon size={10} />
                  {report.type ?? "General"}
                </Badge>
              </div>

              {/* ── Body ── */}
              <motion.div
                className="px-5 pt-3.5 pb-5 flex flex-col gap-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {/* Title */}
                <h2 className="text-base font-bold text-foreground leading-snug line-clamp-2">
                  {report.title}
                </h2>

                {/* Meta row — horizontal pills */}
                <div className="flex flex-wrap gap-2">
                  {/* Location */}
                  <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 min-w-0 flex-1">
                    <MapPin size={11} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-[11px] text-foreground font-medium truncate">{locationName}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 flex-shrink-0">
                    <Clock size={11} className="text-muted-foreground" />
                    <span className="text-[11px] text-foreground font-medium whitespace-nowrap">{report.time ?? "—"}</span>
                  </div>

                  {/* Severity (conditional) */}
                  {(report as any).severity && (
                    <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5 flex-shrink-0">
                      <AlertTriangle size={11} className="text-muted-foreground" />
                      <span className="text-[11px] text-foreground font-medium capitalize">{(report as any).severity}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Status card — single compact row */}
                <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${sdc.bg}`}>
                  <sdc.Icon size={16} className={`flex-shrink-0 ${sdc.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${sdc.color}`}>{sdc.label}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">{sdc.desc}</p>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={openInMaps}
                  className="group relative w-full h-10 rounded-xl overflow-hidden border-0 cursor-pointer
                    bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold tracking-wide
                    shadow-[0_2px_8px_rgba(16,185,129,0.28)]
                    hover:shadow-[0_4px_16px_rgba(16,185,129,0.42)]
                    transition-all duration-200 active:scale-[0.97]"
                >
                  {/* shimmer */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />
                  <span className="relative flex items-center justify-between w-full px-1">
                    <span className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-white/15">
                        <MapPin size={11} />
                      </span>
                      View on Google Maps
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                    />
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}