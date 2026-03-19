export type Severity = "high" | "medium" | "low";

export type ReportStatus =
  | "resolved"
  | "in_progress"
  | "pending"
  | "unknown";

export type Hotspot = {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  severity: Severity;
  type: string;
  distance?: string;
  time?: string;
};

export type LiveReport = {
  id: number;
  img: string;
  title: string;
  status: ReportStatus;
  time: string;
  location: string;
  type?: string; // ✅ merged properly
};

export type Contributor = {
  name: string;
  points: number;
  image: string;
  level: string;
  isCurrentUser?: boolean;
};

export type UserStats = {
  reports: number;
  cleanups: number;
  points: number;
};