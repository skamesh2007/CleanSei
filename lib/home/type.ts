export type Severity = "high" | "medium" | "low";
export type ReportStatus = "resolved" | "in_progress" | "pending" | string;

export type Hotspot = {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  severity: Severity;
  type: string;
};

export type LiveReport = {
  id: number;
  img: string;
  title: string;
  status: ReportStatus;
  time: string;
  location: string;
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