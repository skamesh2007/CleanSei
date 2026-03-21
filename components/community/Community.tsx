"use client";

import { Users, CalendarDays, MapPin, ChevronRight, PlusCircle, Search } from "lucide-react";
import { Badge }      from "@/components/ui/badge";
import { Button }     from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator }  from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── Data ─────────────────────────────────────────────────────────────────────

const GROUPS = [
  { id: 1, name: "Chennai Central Volunteers", members: 124, initials: "CC", colorClass: "bg-violet-500/10 text-violet-500" },
  { id: 2, name: "Velammal Eco Club",           members: 67,  initials: "VE", colorClass: "bg-sky-500/10 text-sky-500"      },
  { id: 3, name: "Ward 42 Cleanup Team",        members: 38,  initials: "W4", colorClass: "bg-amber-500/10 text-amber-500"  },
];

const EVENTS = [
  { id: 1, title: "Lake Cleanup Drive",          date: "Nov 2, 2025",  location: "Retteri Lake, Kolathur" },
  { id: 2, title: "Plastic Collection Marathon", date: "Nov 10, 2025", location: "Marina Beach"           },
];

const CONTRIBUTORS = [
  { rank: 1, medal: "🥇", name: "Kamesh",          points: 520 },
  { rank: 2, medal: "🥈", name: "Mark Zuckerberg", points: 480 },
  { rank: 3, medal: "🥉", name: "Elon Musk",        points: 450 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function CommunityTab() {
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="px-4 pt-4 pb-6 space-y-6">

        {/* ── Groups ── */}
        <section className="space-y-3">
          <SectionHeader title="Your Groups" />

          {/* Horizontal scroll strip */}
          <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
            {GROUPS.map((g) => (
              <Card key={g.id} className="flex-shrink-0 w-40 rounded-2xl border-border cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-3.5 space-y-2">
                  <Avatar className={`w-9 h-9 rounded-xl ${g.colorClass}`}>
                    <AvatarFallback className={`rounded-xl text-xs font-bold ${g.colorClass}`}>
                      {g.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">{g.name}</p>
                  <div className="flex items-center gap-1">
                    <Users size={10} className="text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{g.members} members</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex gap-2.5">
            <Button variant="outline" className="flex-1 h-9 rounded-xl text-xs font-semibold gap-1.5 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500">
              <PlusCircle size={13} /> Create Group
            </Button>
            <Button variant="outline" className="flex-1 h-9 rounded-xl text-xs font-semibold gap-1.5">
              <Search size={13} /> Find Groups
            </Button>
          </div>
        </section>

        <Separator />

        {/* ── Events ── */}
        <section className="space-y-3">
          <SectionHeader title="Upcoming Events" />
          <div className="space-y-2.5">
            {EVENTS.map((event) => (
              <Card key={event.id} className="rounded-2xl border-border">
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-sm font-bold text-foreground">{event.title}</p>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={11} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">{event.location}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="flex-shrink-0 h-8 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold"
                  >
                    RSVP
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── Top Contributors ── */}
        <section className="space-y-3">
          <SectionHeader title="Top Contributors" />
          <div className="space-y-2">
            {CONTRIBUTORS.map((person) => (
              <Card key={person.rank} className="rounded-2xl border-border">
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="text-lg w-6 flex-shrink-0">{person.medal}</span>
                  <Avatar className="w-9 h-9 rounded-xl flex-shrink-0">
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=10b981&color=fff&size=40`}
                      alt={person.name}
                    />
                    <AvatarFallback className="rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                      {person.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="flex-1 text-sm font-semibold text-foreground truncate">{person.name}</p>
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-bold text-xs rounded-lg">
                    {person.points} pts
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </ScrollArea>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      {onSeeAll && (
        <Button variant="ghost" size="sm" onClick={onSeeAll} className="h-auto py-0 px-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 hover:bg-transparent gap-0.5">
          See all <ChevronRight size={13} />
        </Button>
      )}
    </div>
  );
}