"use client";

/**
 * Subscribes to the Firestore "reports" collection in real-time,
 * maps raw WasteReport documents → LiveReport UI shape,
 * and keeps the home page in sync automatically.
 */

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";               // ← adjust to your firebase init path
import type { LiveReport } from "@/lib/home/type";
import type { WasteReport } from "@/lib/home/reportType";
import { WASTE_TYPES } from "@/lib/report/types";
import type { WasteType } from "@/lib/report/types";

const REPORTS_LIMIT = 20;

// ─── Firestore doc → LiveReport ───────────────────────────────────────────────

function toRelativeTime(ts: WasteReport["timestamp"]): string {
  const date =
    ts && typeof (ts as any).toDate === "function"
      ? (ts as any).toDate()
      : ts instanceof Date
      ? ts
      : new Date();

  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diff < 60)           return "Just now";
  if (diff < 3600)         return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)        return `${Math.floor(diff / 3600)}h ago`;
  return                   `${Math.floor(diff / 86400)}d ago`;
}

function docToLiveReport(doc: QueryDocumentSnapshot<DocumentData>): LiveReport {
  const d = doc.data();

  const wasteType = isValidWasteType(d.wasteType)
    ? d.wasteType
    : "Other";

  return {
    id:       doc.id,
    title:    d.description || wasteType || "Waste Report",
    img:      d.images?.[0] ?? "",
    type:     wasteType,
    status:   d.status ?? "pending",
    location: d.location?.label ?? "Unknown location",
    time:     toRelativeTime(d.timestamp),
  };
}

function isValidWasteType(value: any): value is WasteType {
  return WASTE_TYPES.some(w => w.label === value);
}
// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLiveReports() {
  const [reports, setReports] = useState<LiveReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "reports"),
      orderBy("timestamp", "desc"),
      limit(REPORTS_LIMIT)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setReports(snapshot.docs.map(docToLiveReport));
        setLoading(false);
      },
      (err) => {
        console.error("[useLiveReports]", err);
        setError("Failed to load reports.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { reports, loading, error };
}