import { Recycle, Newspaper, GlassWater, Wrench, Leaf, Cpu, HelpCircle } from "lucide-react";

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

export interface PhotoData {
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