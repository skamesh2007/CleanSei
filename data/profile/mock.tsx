import { Trophy, Leaf, Clock } from "lucide-react";
import type { Badge, ActivityStat } from "../../lib/profile/types";

export const BADGES: Badge[] = [
  {
    name: "Top Reporter",
    icon: <Trophy size={40} className="text-emerald-400" />,
  },
  {
    name: "Cleanup Hero",
    icon: <Leaf size={40} className="text-emerald-400" />,
  },
  {
    name: "Early Volunteer",
    icon: <Clock size={40} className="text-emerald-400" />,
  },
];

export const ACTIVITY_STATS: ActivityStat[] = [
  { label: "Reports Submitted", value: 10 },
  { label: "Cleanups Joined", value: 12 },
  { label: "Total Hours Volunteered", value: 28 },
];