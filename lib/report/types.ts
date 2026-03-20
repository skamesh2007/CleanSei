import type { Timestamp } from "firebase/firestore";
import {
  Recycle,
  Newspaper,
  GlassWater,
  Wrench,
  Leaf,
  Cpu,
  HelpCircle,
} from "lucide-react";

// ─── Waste Types ──────────────────────────────────────────────────────────────

export const WASTE_TYPES = [
  { label: "Plastic",    icon: Recycle    },
  { label: "Paper",      icon: Newspaper  },
  { label: "Glass",      icon: GlassWater },
  { label: "Metal",      icon: Wrench     },
  { label: "Organic",    icon: Leaf       },
  { label: "Electronic", icon: Cpu        },
  { label: "Other",      icon: HelpCircle },
] as const;

export type WasteType = (typeof WASTE_TYPES)[number]["label"];

// ─── Camera / UI state ────────────────────────────────────────────────────────

export interface PhotoData {
  /** base64 data-URI from canvas — used locally only, never stored */
  uri: string;
  lat: number | null;
  lng: number | null;
  timestamp: string;
}

export type CameraMode = "idle" | "camera" | "preview";

export type LocationStatus =
  | { state: "pending" }
  | { state: "granted"; lat: number; lng: number }
  | { state: "denied" }
  | { state: "unavailable" };

// ─── Firestore document shape ─────────────────────────────────────────────────

export type Severity = "low" | "medium" | "high";

export type ReportStatus = "pending" | "in_progress" | "resolved";

export interface WasteReport {
  /** Cloudinary secure_url array */
  images: string[];

  description: string;

  wasteType: WasteType;

  severity: Severity;

  status: ReportStatus;

  location: {
    lat: number | null;
    lng: number | null;
    label: string;
  };

  reportedBy: string; // Firebase Auth uid

  timestamp: Timestamp | Date;

  pointsEarned: number;
}