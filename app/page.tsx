"use client";

import { ThemeToggle } from "@/components/theme-toggle";

import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Users,
  Trophy,
  MapPin,
  Clock,
  ChevronRight,
  Flag,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

// ─── Types ────────────────────────────────────────────────────────────────────

type Hotspot = {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  severity: "high" | "medium" | "low";
  type: string;
};

type ReportStatus = "resolved" | "in_progress" | "pending" | string;

type LiveReport = {
  id: number;
  img: string;
  title: string;
  status: ReportStatus;
  time: string;
  location: string;
};

type User = {
  name: string;
  points: number;
  image: string;
  level: string;
  isCurrentUser?: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusClasses = (status: ReportStatus) => {
  switch (status) {
    case "resolved":
      return {
        badge:
          "bg-green-50 dark:bg-green-950/60 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400",
        label: "Resolved",
      };
    case "in_progress":
      return {
        badge:
          "bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400",
        label: "In Progress",
      };
    case "pending":
      return {
        badge:
          "bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400",
        label: "Attention Needed",
      };
    default:
      return {
        badge:
          "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300",
        label: status,
      };
  }
};

const getSeverityColor = (severity: Hotspot["severity"]) =>
  severity === "high" ? "#ef4444" : severity === "medium" ? "#f59e0b" : "#10b981";

const rankConfig = [
  {
    medal: "🥇",
    borderColor: "border-amber-400 dark:border-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    medal: "🥈",
    borderColor: "border-gray-400 dark:border-gray-500",
    bg: "bg-gray-50 dark:bg-gray-800/60",
  },
  {
    medal: "🥉",
    borderColor: "border-orange-400 dark:border-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/40",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {

  const {user, loading: authLoading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);


  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({ reports: 15, cleanups: 8, points: 340 });

  // Toggle dark class on <html>

  const hotspots: Hotspot[] = [
    { id: 1, latitude: 13.0827, longitude: 80.2707, title: "Overflowing Bin",    severity: "high",   type: "plastic"  },
    { id: 2, latitude: 13.0877, longitude: 80.274,  title: "Littered Area",      severity: "medium", type: "mixed"    },
    { id: 3, latitude: 13.085,  longitude: 80.272,  title: "Construction Waste", severity: "high",   type: "concrete" },
  ];

  const liveReports: LiveReport[] = [
    { id: 1, img: "/images/overflow-bin.png",  title: "Overflowing Dustbin", status: "pending",     time: "5 min ago",   location: "1.2 km away" },
    { id: 2, img: "/images/street-waste.png",  title: "Street Waste",        status: "resolved",    time: "2 hours ago", location: "0.8 km away" },
    { id: 3, img: "/images/plastic-dump.png",  title: "Plastic Dump",        status: "in_progress", time: "15 min ago",  location: "2.1 km away" },
  ];

  const topContributors: User[] = [
    { name: "Kamesh",          points: 520, image: "/images/profile-placeholder.png", level: "Eco Warrior",      isCurrentUser: true },
    { name: "Mark Zuckerberg", points: 480, image: "/images/mark.png",                level: "Cleanup Champion"                      },
    { name: "Elon Musk",       points: 450, image: "/images/elon.png",                level: "Eco Hero"                              },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setUserStats((prev) => ({ ...prev, points: prev.points + 5 }));
      setRefreshing(false);
    }, 1500);
  }, []);

  const mapBounds = { minLat: 13.08, maxLat: 13.095, minLng: 80.268, maxLng: 80.279 };
  const toPercent = (lat: number, lng: number) => ({
    x: ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100,
    y: (1 - (lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100,
  });

  if (authLoading) return <p className="p-6">Loading...</p>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors duration-300">
      <div className="max-w-2xl mx-auto pb-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-card px-6 pt-8 pb-5 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-muted-foreground font-medium">
                Hello {user.displayName || "User"},
              </p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground mt-0.5">
                {user.displayName || "Eco Enthusiast"}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  🏆 Eco Warrior
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                  ⭐ {userStats.points} pts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut(auth)
                  router.push("/auth/login")
                }}
              >
                Logout
              </Button>

              {/* Dark / Light toggle */}
              <ThemeToggle />

              {/* Profile avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src="/images/profile-placeholder.png"
                  alt="Profile"
                  className="w-16 h-16 rounded-2xl border-4 border-white dark:border-card shadow object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://ui-avatars.com/api/?name=Kamesh+S&background=3b82f6&color=fff&size=64";
                  }}
                />
                <span className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 dark:text-foreground w-8 h-8 rounded-full flex items-center justify-center shadow text-xs font-bold text-gray-800">
                  {userStats.points}
                </span>
              </div>
            </div>
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground transition-colors disabled:opacity-60"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing…" : "Pull to refresh"}
          </button>
        </div>

        {/* ── Stats Overview ──────────────────────────────────────────────── */}
        <section className="px-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-foreground mb-4">
            Your Impact
          </h2>
          <div className="grid grid-cols-3 gap-3">

            <Card className="rounded-2xl shadow-sm border border-gray-100 dark:border-border bg-white dark:bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-xl">
                    <FileText size={20} className="text-blue-500 dark:text-blue-400" />
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">
                    {userStats.reports}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-foreground font-semibold mt-3 text-sm">Reports</p>
                <p className="text-gray-400 dark:text-muted-foreground text-xs mt-0.5">+2 this week</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-gray-100 dark:border-border bg-white dark:bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-xl">
                    <Users size={20} className="text-green-500 dark:text-green-400" />
                  </div>
                  <span className="text-green-600 dark:text-green-400 text-lg font-bold">
                    {userStats.cleanups}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-foreground font-semibold mt-3 text-sm">Cleanups</p>
                <p className="text-gray-400 dark:text-muted-foreground text-xs mt-0.5">Active member</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-gray-100 dark:border-border bg-white dark:bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-xl">
                    <Trophy size={20} className="text-amber-500 dark:text-amber-400" />
                  </div>
                  <span className="text-amber-600 dark:text-amber-400 text-lg font-bold">
                    {userStats.points}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-foreground font-semibold mt-3 text-sm">Points</p>
                <p className="text-gray-400 dark:text-muted-foreground text-xs mt-0.5">SwachhScore</p>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* ── Nearby Hotspots ─────────────────────────────────────────────── */}
        <Card className="mt-8 mx-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border bg-white dark:bg-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">
                  Nearby Hotspots
                </h2>
                <p className="text-gray-500 dark:text-muted-foreground text-sm mt-0.5">
                  Waste reports in your area
                </p>
              </div>
              <button className="flex items-center gap-1 bg-gray-100 dark:bg-muted px-3 py-2 rounded-full text-sm font-semibold text-gray-700 dark:text-foreground hover:bg-gray-200 dark:hover:bg-accent transition-colors">
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-gray-100 dark:border-border">
              <iframe
                title="Hotspots Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=80.265%2C13.078%2C80.280%2C13.092&layer=mapnik&marker=13.0827%2C80.2707"
              />
              {hotspots.map((spot) => {
                const pos = toPercent(spot.latitude, spot.longitude);
                return (
                  <div
                    key={spot.id}
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      backgroundColor: getSeverityColor(spot.severity),
                    }}
                    title={spot.title}
                  />
                );
              })}
            </div>

            <div className="flex justify-between mt-4 px-1">
              {[
                { color: "bg-red-500",   label: "High Priority" },
                { color: "bg-amber-500", label: "Medium"        },
                { color: "bg-green-500", label: "Low"           },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 ${color} rounded-full`} />
                  <span className="text-gray-600 dark:text-muted-foreground text-sm">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Live Reports ────────────────────────────────────────────────── */}
        <section className="mt-8">
          <div className="flex items-center justify-between px-6 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">
                Live Reports
              </h2>
              <p className="text-gray-500 dark:text-muted-foreground text-sm mt-0.5">
                Recently reported issues
              </p>
            </div>
            <button className="flex items-center gap-1 bg-gray-100 dark:bg-muted px-3 py-2 rounded-full text-sm font-semibold text-gray-700 dark:text-foreground hover:bg-gray-200 dark:hover:bg-accent transition-colors">
              See All <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {liveReports.map((item) => {
              const { badge, label } = getStatusClasses(item.status);
              return (
                <button
                  key={item.id}
                  className="bg-white dark:bg-card rounded-2xl p-4 w-64 flex-shrink-0 shadow-sm border border-gray-100 dark:border-border text-left hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-36 rounded-xl object-cover bg-gray-100 dark:bg-muted"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://placehold.co/256x144/e5e7eb/9ca3af?text=${encodeURIComponent(item.title)}`;
                      }}
                    />
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold ${badge}`}>
                      {label}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="font-bold text-gray-900 dark:text-foreground text-base truncate">
                      {item.title}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="flex items-center gap-1 text-gray-500 dark:text-muted-foreground text-xs">
                        <MapPin size={12} /> {item.location}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500 dark:text-muted-foreground text-xs">
                        <Clock size={12} /> {item.time}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Leaderboard ─────────────────────────────────────────────────── */}
        <Card className="mt-8 mx-6 rounded-2xl shadow-lg border border-gray-100 dark:border-border bg-white dark:bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  Leaderboard
                </h2>
                <p className="text-gray-500 dark:text-muted-foreground text-sm mt-0.5">
                  Top contributors this week
                </p>
              </div>
              <button className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-4 py-2.5 rounded-full text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {topContributors.map((user, index) => {
                const rc = rankConfig[index];
                return (
                  <div
                    key={index}
                    className={`flex items-center p-4 rounded-2xl border-2 ${rc.bg} ${rc.borderColor}`}
                  >
                    {/* Medal */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl shadow-sm bg-white dark:bg-gray-800">
                      {rc.medal}
                    </div>

                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-xl overflow-hidden mr-4 flex-shrink-0 shadow-sm ${
                        user.isCurrentUser ? "ring-2 ring-white/60 dark:ring-white/20" : ""
                      }`}
                    >
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=48`;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-gray-900 dark:text-foreground truncate">
                          {user.name}
                        </span>
                        {user.isCurrentUser && (
                          <span className="bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tracking-wide flex-shrink-0">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-muted-foreground text-sm mt-0.5">
                        {user.level}
                      </p>
                    </div>

                    {/* Points */}
                    <div className="bg-white dark:bg-gray-800 shadow px-3 py-2 rounded-lg ml-2">
                      <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                        {user.points}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Daily Goal ──────────────────────────────────────────────────── */}
        <section className="mt-8 mx-6">
          <Card className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Flag size={18} className="text-blue-500 dark:text-blue-400" />
                <h3 className="text-gray-900 dark:text-foreground font-bold text-lg">
                  Daily Goal
                </h3>
              </div>
              <p className="text-gray-600 dark:text-muted-foreground text-sm mb-4">
                Report 2 waste spots today
              </p>

              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-xs font-bold">
                    1
                  </span>
                  <span className="text-gray-500 dark:text-muted-foreground text-sm">of</span>
                  <span className="w-6 h-6 bg-gray-100 dark:bg-muted rounded-full flex items-center justify-center text-gray-600 dark:text-foreground text-xs font-bold">
                    2
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">+50</p>
                  <p className="text-gray-400 dark:text-muted-foreground text-xs">points</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 dark:bg-muted rounded-full mb-4 overflow-hidden">
                <div className="h-full w-1/2 bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-500" />
              </div>

              <Button className="w-full bg-gray-900 dark:bg-foreground dark:text-background hover:bg-gray-800 dark:hover:bg-gray-200 text-white rounded-xl py-3 font-semibold transition-colors">
                Continue Mission
              </Button>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}