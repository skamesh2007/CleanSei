import { Trophy, Leaf, Clock, FileText, Users, Star } from "lucide-react";
import type { AchievementBadge, ActivityStat } from "@/lib/profile/types";

export const BADGES: AchievementBadge[] = [
  {
    name: "Top Reporter",
    description: "Filed 10 reports",
    icon: <Trophy size={22} className="text-amber-500" />,
    status: "earned",
  },
  {
    name: "Cleanup Hero",
    description: "Joined 5 cleanups",
    icon: <Leaf size={22} className="text-emerald-500" />,
    status: "earned",
  },
  {
    name: "Early Volunteer",
    description: "First 100 users",
    icon: <Clock size={22} className="text-violet-500" />,
    status: "earned",
  },
  {
    name: "Street Ranger",
    description: "20 reports",
    icon: <Trophy size={22} className="text-gray-400" />,
    status: "locked",
    progress: 10,
    target: 20,
  },
];

export const ACTIVITY_STATS: ActivityStat[] = [
  {
    label: "Reports submitted",
    value: 10,
    max: 30,
    delta: "+2 this week",
    tooltip: "Total reports you have submitted",
    icon: <FileText size={16} className="text-green-600" />,
    theme: {
      iconBg: "bg-green-50",
      barColor: "bg-green-500",
      badgeBg: "bg-green-50",
      badgeText: "text-green-700",
    },
  },
  {
    label: "Cleanups joined",
    value: 12,
    max: 20,
    delta: "Active",
    tooltip: "Number of cleanups you participated in",
    icon: <Users size={16} className="text-emerald-600" />,
    theme: {
      iconBg: "bg-emerald-50",
      barColor: "bg-emerald-500",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
    },
  },
  {
    label: "SwachhPoints earned",
    value: 240,
    max: 500,
    delta: "Warrior",
    tooltip: "Points earned from activities and reports",
    icon: <Star size={16} className="text-amber-500" />,
    theme: {
      iconBg: "bg-amber-50",
      barColor: "bg-amber-500",
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-700",
    },
  },
];