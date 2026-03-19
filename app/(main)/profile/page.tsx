"use client";

// ─── THIS FILE IS THE ORCHESTRATOR — keep logic here, UI in components/ ───────

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

import { ProfileHeader }  from "@/components/profile/ProfileHeader";
import { ProfileInfo }    from "@/components/profile/ProfileInfo";
import { SwachhScore }    from "@/components/profile/SwachhScore";
import { Achievements }   from "@/components/profile/Achievements";
import { ActivityStats }  from "@/components/profile/ActivityStats";
import { NftBadges }      from "@/components/profile/NftBadges";

import { BADGES, ACTIVITY_STATS } from "@/data/profile/mock";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  // ── Guards ──
  if (authLoading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-background transition-colors duration-300">
      <div className="max-w-2xl mx-auto pb-16">

        <ProfileHeader onLogout={handleLogout} />

        <div className="px-6 pt-6 space-y-6">
          <ProfileInfo
            displayName={user.displayName ?? "Volunteer"}
            email={user.email}
            photoURL={user.photoURL}
          />

          <SwachhScore
            score={240}
            rank="Rank 3"
            level="Gold"
            nextLevelLabel="Platinum"
            nextLevelScore={300}
            streakDays={5}
            weeklyPoints={[10, 20, 15, 30, 25, 40, 35]}
          />

          <Achievements badges={BADGES} />

          <ActivityStats stats={ACTIVITY_STATS} />

          <NftBadges />

        </div>

      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );
}