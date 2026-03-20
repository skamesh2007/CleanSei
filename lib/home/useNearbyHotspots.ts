"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Hotspot } from "@/lib/home/type";
import type { WasteReport } from "@/lib/home/reportType";
import { WASTE_TYPES } from "@/lib/report/types";
import type { WasteType } from "@/lib/report/types";

const HOTSPOTS_LIMIT = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toRelativeTime(ts: WasteReport["timestamp"]): string {
  const date =
    ts && typeof (ts as any).toDate === "function"
      ? (ts as any).toDate()
      : ts instanceof Date
      ? ts
      : new Date();

  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function isValidWasteType(value: any): value is WasteType {
  return WASTE_TYPES.some((w) => w.label === value);
}

function docToHotspot(
  doc: QueryDocumentSnapshot<DocumentData>
): Hotspot | null {
  const d = doc.data() as WasteReport;

  if (d.location?.lat == null || d.location?.lng == null) return null;

  // ✅ FIX: validate before using
  const wasteType: WasteType = isValidWasteType(d.wasteType)
    ? d.wasteType
    : "Other";

  return {
    id: doc.id,
    title: d.description || wasteType || "Waste Report",
    severity: d.severity ?? "low",
    latitude: d.location.lat,
    longitude: d.location.lng,
    distance: d.location.label ?? "Nearby",
    time: toRelativeTime(d.timestamp),
    type: wasteType, // ✅ now correct
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNearbyHotspots() {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "reports"),
      where("status", "in", ["pending", "in_progress"]),
      orderBy("timestamp", "desc"),
      limit(HOTSPOTS_LIMIT)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const mapped = snapshot.docs
          .map(docToHotspot)
          .filter((h): h is Hotspot => h !== null);

        setHotspots(mapped);
        setLoading(false);
      },
      (err) => {
        console.error("[useNearbyHotspots]", err);
        setError("Failed to load hotspots.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { hotspots, loading, error };
}