"use client";

import { useState, useEffect, useCallback } from "react";
import type { LiveReport } from "@/lib/home/type";

export function useReportModal() {
  const [selected, setSelected] = useState<LiveReport | null>(null);

  const open  = useCallback((report: LiveReport) => setSelected(report), []);
  const close = useCallback(() => setSelected(null), []);

  // ── Escape key ──
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, close]);

  // ── Prevent body scroll when modal is open ──
  useEffect(() => {
    if (selected) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [selected]);

  return { selected, open, close };
}