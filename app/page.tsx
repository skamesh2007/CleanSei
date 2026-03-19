"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import { PageHeader }     from "../components/home/PageHeader";
import { StatsOverview }  from "../components/home/StatsOverview";
import { NearbyHotspots } from "../components/home/NearbyHotspots";
import { LiveReports }    from "../components/home/LiveReports";
import { Leaderboard }    from "../components/home/Leaderboard";
import { DailyGoal }      from "../components/home/DailyGoal";

import { HOTSPOTS, LIVE_REPORTS, TOP_CONTRIBUTORS } from "../data/home/mock";
import type { UserStats } from "../lib/home/type";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [mounted,    setMounted]    = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userStats,  setUserStats]  = useState<UserStats>({
    reports: 15,
    cleanups: 8,
    points: 340,
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [authLoading, user, router]);

  // Fade-in after mount
  useEffect(() => setMounted(true), []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setUserStats((prev) => ({ ...prev, points: prev.points + 5 }));
      setRefreshing(false);
    }, 1500);
  }, []);

  // ── Loading / auth guard ──
  if (authLoading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <div
      className={`min-h-screen bg-[#0a0a0f] text-zinc-100 transition-opacity duration-700 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Subtle noise texture */}
      <NoiseOverlay />

      <div className="relative z-10 max-w-2xl mx-auto pb-16">
        <PageHeader
          displayName={user.displayName}
          stats={userStats}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        <StatsOverview stats={userStats} />

        <NearbyHotspots hotspots={HOTSPOTS} />

        <LiveReports reports={LIVE_REPORTS} />

        <Leaderboard contributors={TOP_CONTRIBUTORS} />

        <DailyGoal
          current={1}
          target={2}
          reward={50}
        />
      </div>
    </div>
  );
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-zinc-400 text-sm font-medium tracking-wide">
          Loading your dashboard…
        </p>
      </div>
    </div>
  );
}

function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}