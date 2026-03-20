import type { WasteType, ReportStatus, Severity } from "@/lib/report/types";

// ─── Hotspot ──────────────────────────────────────────────────────────────────

export type Hotspot = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  severity: Severity;
  type: WasteType;
  distance?: string;
  time?: string;
  image?: string;
};

// ─── Live Report ──────────────────────────────────────────────────────────────

export type LiveReport = {
  id: string;
  img: string;
  title: string;
  status: ReportStatus;
  time: string;
  location: string;
  type: WasteType; 
};

// ─── Contributor ──────────────────────────────────────────────────────────────

export type Contributor = {
  name: string;
  points: number;
  image: string;
  level: string;
  isCurrentUser?: boolean;
};

// ─── User Stats ───────────────────────────────────────────────────────────────

export type UserStats = {
  reports: number;
  cleanups: number;
  points: number;
};