"use client";

import { ThemeToggle } from "@/components/theme-toggle";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Trophy,
  Leaf,
  Clock,
  Pencil,
  LogOut,
  ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

// ─── Types ────────────────────────────────────────────────────────────────────

type Badge = {
  name: string;
  icon: React.ReactNode;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const badges: Badge[] = [
  { name: "Top Reporter",     icon: <Trophy size={40} className="text-emerald-400" /> },
  { name: "Cleanup Hero",     icon: <Leaf   size={40} className="text-emerald-400" /> },
  { name: "Early Volunteer",  icon: <Clock  size={40} className="text-emerald-400" /> },
];

const activityStats = [
  { label: "Reports Submitted",      value: 10 },
  { label: "Cleanups Joined",        value: 12 },
  { label: "Total Hours Volunteered",value: 28 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Profile() {

  const {user, loading: authLoading} = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!authLoading && !user) {
        router.push("/auth/login");
      }
    }, [authLoading, user, router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-background transition-colors duration-300">
      <div className="max-w-2xl mx-auto pb-16">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-card px-6 pt-8 pb-5 shadow-sm sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-foreground">
              Profile
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                aria-label="Settings"
                className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
              >
                <Settings size={20} className="text-blue-700 dark:text-blue-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pt-6 space-y-6">

          {/* ── Profile Info ─────────────────────────────────────────────── */}
          <div
            className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {/* Avatar with green ring */}
            <div className="p-1 rounded-full border-4 border-emerald-400 dark:border-emerald-500 shadow-md">
              <img
                src="/images/profile-placeholder.png"
                alt="Kamesh S"
                className="w-28 h-28 rounded-full object-cover bg-gray-200 dark:bg-muted"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://ui-avatars.com/api/?name=Kamesh+S&background=1E40AF&color=fff&size=112";
                }}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-foreground mt-3">
              KAMESH S
            </h2>
            <p className="text-gray-500 dark:text-muted-foreground mt-1 text-base">
              Chennai, Tamil Nadu
            </p>
            <span className="mt-2 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full">
              Volunteer
            </span>
          </div>

          {/* ── SwachhScore ──────────────────────────────────────────────── */}
          <Card
            className="rounded-2xl shadow-sm border border-gray-100 dark:border-border bg-white dark:bg-card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
          >
            <CardContent className="p-5 flex flex-col items-center">
              <p className="text-lg font-semibold text-gray-500 dark:text-muted-foreground">
                SwachhScore
              </p>
              <p className="text-6xl font-extrabold text-blue-700 dark:text-blue-400 my-2 tabular-nums">
                240
              </p>
              <p className="text-sm text-gray-500 dark:text-muted-foreground">
                Rank: #3 in Chennai
              </p>
            </CardContent>
          </Card>

          {/* ── Achievements ─────────────────────────────────────────────── */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-3">
              🏅 Achievements
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {badges.map((badge, index) => (
                <button
                  key={index}
                  className="flex-shrink-0 w-36 bg-white dark:bg-card border border-gray-100 dark:border-border rounded-2xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
                >
                  {badge.icon}
                  <span className="text-sm font-semibold text-gray-800 dark:text-foreground mt-2 text-center leading-tight">
                    {badge.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ── Activity Stats ───────────────────────────────────────────── */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-3">
              📈 Activity Stats
            </h2>
            <div className="space-y-2">
              {activityStats.map((stat, index) => (
                <Card
                  key={index}
                  className="rounded-xl shadow-sm border border-gray-100 dark:border-border bg-white dark:bg-card"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="text-base font-medium text-gray-500 dark:text-muted-foreground">
                      {stat.label}
                    </span>
                    <span className="text-base font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                      {stat.value}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── NFT Badges ───────────────────────────────────────────────── */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-3">
              🖼️ NFT Badges <span className="text-xs font-normal text-gray-400 dark:text-muted-foreground ml-1">(Coming Soon)</span>
            </h2>
            <Card className="rounded-2xl border border-dashed border-gray-300 dark:border-border bg-white dark:bg-card opacity-60">
              <CardContent className="p-5 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-muted flex items-center justify-center">
                  <ImageIcon size={24} className="text-gray-400 dark:text-muted-foreground" />
                </div>
                <p className="text-base text-gray-500 dark:text-muted-foreground text-center">
                  Collect unique digital badges for your contributions!
                </p>
              </CardContent>
            </Card>
          </section>

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 pb-4">
            <Button className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full py-3 text-base font-semibold transition-colors">
              <Pencil size={20} />
              Edit Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-500 dark:text-red-400 rounded-full py-3 text-base font-semibold transition-colors border border-red-100 dark:border-red-900/50"

              onClick={async () => {
                  await signOut(auth)
                  router.push("/auth/login")
                }}
            >
              <LogOut size={20} />
              Logout
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}