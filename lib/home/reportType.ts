/**
 * Shared Firestore document type for WasteReport.
 * Kept in lib/home so home feature doesn't cross-import from the report feature.
 */

import type { Timestamp } from "firebase/firestore";

export type Severity     = "low" | "medium" | "high";
export type ReportStatus = "pending" | "in_progress" | "resolved";

export interface WasteReport {
  images:       string[];
  description:  string;
  wasteType:    string;
  severity:     Severity;
  status:       ReportStatus;
  location: {
    lat:   number | null;
    lng:   number | null;
    label: string;
  };
  reportedBy:   string;
  timestamp:    Timestamp | Date;
  pointsEarned: number;
}