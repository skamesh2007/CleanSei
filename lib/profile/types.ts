export type Badge = {
  name: string;
  icon: React.ReactNode;
};

export type AchievementBadge = Badge & {
  description: string;
  status: "earned" | "locked";
  progress?: number;
  target?: number;
  earnedStyle?: string;
};

export type ActivityStat = {
  label: string;
  value: number;

  max?: number;
  delta?: string;
  tooltip?: string;

  icon?: React.ReactNode;

  theme?: {
    iconBg: string;
    barColor: string;
    badgeBg: string;
    badgeText: string;
  };
};