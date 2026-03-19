"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  PlusCircle,
  Search,
  Users,
  MapPin,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

// ─── Data ─────────────────────────────────────────────────────────────────────

const groups = [
  { id: 1, name: "Chennai Central Volunteers", members: 124 },
  { id: 2, name: "Velammal Eco Club",           members: 67  },
  { id: 3, name: "Ward 42 Cleanup Team",        members: 38  },
];

const chatRooms = [
  { name: "Beach Cleanup Drive",   lastMsg: "Tomorrow 7 AM at Marina!",   members: 58 },
  { name: "Plastic-Free Chennai",  lastMsg: "Poster campaign next week.",  members: 94 },
];

const events = [
  { title: "Lake Cleanup Drive",          date: "Nov 2, 2025",  location: "Retteri Lake, Kolathur" },
  { title: "Plastic Collection Marathon", date: "Nov 10, 2025", location: "Marina Beach"           },
];

const contributors = [
  { medal: "🥇", name: "Kamesh",          points: 520, borderColor: "border-amber-400 dark:border-amber-500", bg: "bg-amber-50  dark:bg-amber-950/40"  },
  { medal: "🥈", name: "Mark Zuckerberg", points: 480, borderColor: "border-gray-400  dark:border-gray-500",  bg: "bg-gray-50   dark:bg-gray-800/60"   },
  { medal: "🥉", name: "Elon Musk",       points: 450, borderColor: "border-orange-400 dark:border-orange-500",bg: "bg-orange-50 dark:bg-orange-950/40" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Community() {

  const {user, loading: authLoading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors duration-300">
      <div className="max-w-2xl mx-auto pb-16">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-card px-6 pt-8 pb-5 shadow-sm sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-foreground">
                Community Hub
              </h1>
              <p className="text-sm text-gray-500 dark:text-muted-foreground mt-0.5">
                Connect · Organise · Act
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <MessageCircle size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pt-6 space-y-8">

          {/* ── Your Groups ──────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-foreground">
                🧑‍🤝‍🧑 Your Groups
              </h2>
              <button className="flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                See all <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {groups.map((group) => (
                <button
                  key={group.id}
                  className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 px-4 py-3 rounded-xl text-left hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                >
                  <p className="text-blue-700 dark:text-blue-300 font-medium text-sm whitespace-nowrap">
                    {group.name}
                  </p>
                  <p className="text-blue-500 dark:text-blue-400 text-xs mt-0.5 flex items-center gap-1">
                    <Users size={10} /> {group.members} members
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* ── Chat Rooms ───────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-foreground">
                💬 Chat Rooms
              </h2>
              <button className="flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                See all <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-2">
              {chatRooms.map((chat, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between bg-gray-100 dark:bg-muted border border-gray-200 dark:border-border p-4 rounded-xl hover:bg-gray-200 dark:hover:bg-accent transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-foreground text-sm">
                        {chat.name}
                      </p>
                      <p className="text-gray-500 dark:text-muted-foreground text-xs mt-0.5 truncate max-w-[180px]">
                        {chat.lastMsg}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs block">
                      {chat.members} members
                    </span>
                    <span className="text-gray-400 dark:text-muted-foreground text-[10px]">Tap to join</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Upcoming Events ──────────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-foreground">
                📅 Upcoming Events
              </h2>
              <button className="flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                See all <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {events.map((event, index) => (
                <Card
                  key={index}
                  className="rounded-xl border-l-4 border-l-green-500 dark:border-l-green-400 border-t-0 border-r-0 border-b-0 bg-green-50 dark:bg-green-950/30 shadow-sm border border-green-200 dark:border-green-900/50"
                >
                  <CardContent className="p-4">
                    <p className="font-bold text-gray-800 dark:text-foreground text-base">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <CalendarDays size={13} className="text-green-600 dark:text-green-400" />
                      <span className="text-gray-600 dark:text-muted-foreground text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={13} className="text-green-600 dark:text-green-400" />
                      <span className="text-gray-500 dark:text-muted-foreground text-sm">{event.location}</span>
                    </div>
                    <button className="mt-3 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors">
                      RSVP
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── Top Contributors ─────────────────────────────────────────── */}
          <section>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-foreground mb-3">
              Top Contributors
            </h2>

            <div className="space-y-2">
              {contributors.map((person, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 ${person.bg} ${person.borderColor}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Medal bubble */}
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-lg">
                      {person.medal}
                    </div>
                    {/* Avatar fallback */}
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=3b82f6&color=fff&size=40`}
                      alt={person.name}
                      className="w-9 h-9 rounded-xl object-cover shadow-sm"
                    />
                    <span className="font-semibold text-gray-800 dark:text-foreground text-sm">
                      {person.name}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 shadow px-3 py-1.5 rounded-lg">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {person.points} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Action Buttons ───────────────────────────────────────────── */}
          <div className="flex gap-3 pb-4">
            <Button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full py-3 text-base font-semibold transition-colors">
              <PlusCircle size={20} />
              Create Group
            </Button>
            <Button className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-full py-3 text-base font-semibold transition-colors">
              <Search size={20} />
              Join Group
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}