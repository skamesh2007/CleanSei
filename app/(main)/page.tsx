"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import { PageHeader }     from "@/components/home/PageHeader";
import { StatsOverview }  from "@/components/home/StatsOverview";
import { NearbyHotspots } from "@/components/home/NearbyHotspots";
import { LiveReports }    from "@/components/home/LiveReports";
import { Leaderboard }    from "@/components/home/Leaderboard";
import { DailyGoal }      from "@/components/home/DailyGoal";
import { Skeleton }       from "@/components/ui/skeleton";

import { useLiveReports }              from "@/lib/home/UseliveReports";
import { HOTSPOTS, TOP_CONTRIBUTORS }  from "@/data/home/mock";   // mock removed for live reports
import type { UserStats }              from "@/lib/home/type";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [mounted,    setMounted]    = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userStats,  setUserStats]  = useState<UserStats>({
    reports:  15,
    cleanups: 8,
    points:   340,
  });

  // ── Real-time reports from Firestore ──
  const { reports, loading: reportsLoading, error: reportsError } = useLiveReports();

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [authLoading, user, router]);

  useEffect(() => setMounted(true), []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setUserStats((prev) => ({ ...prev, points: prev.points + 5 }));
      setRefreshing(false);
    }, 1500);
  }, []);

  if (authLoading) return <LoadingScreen />;
  if (!user)       return null;

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-opacity duration-700 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative z-10 max-w-2xl mx-auto pb-16">
        <PageHeader
          displayName={user.displayName}
          stats={userStats}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        <StatsOverview  stats={userStats} />

        <NearbyHotspots hotspots={HOTSPOTS} />

        {/* ── Live from Firestore ── */}
        <LiveReports
          reports={reports}
          loading={reportsLoading}
          error={reportsError}
        />

        <Leaderboard    contributors={TOP_CONTRIBUTORS} />

        <DailyGoal      current={1} target={2} reward={50} />
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-40 h-4 rounded" />
      </div>
    </div>
  );
}