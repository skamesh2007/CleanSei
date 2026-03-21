"use client";

import { Bell, Pin, ChevronRight } from "lucide-react";
import { Badge }      from "@/components/ui/badge";
import { Separator }  from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button }     from "@/components/ui/button";

type Announcement = {
  id:       number;
  title:    string;
  body:     string;
  author:   string;
  time:     string;
  pinned:   boolean;
  tag:      string;
  tagVariant: "default" | "secondary" | "outline" | "destructive";
  tagClass: string;
};

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title:   "Lake Cleanup Drive — Nov 2",
    body:    "Join us at Retteri Lake, Kolathur at 7 AM. Gloves and bags provided. Bring water!",
    author:  "Chennai Central Volunteers",
    time:    "2h ago",
    pinned:  true,
    tag:     "Event",
    tagVariant: "outline",
    tagClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
  },
  {
    id: 2,
    title:   "Plastic Collection Marathon — Nov 10",
    body:    "Marina Beach, 6–9 AM. Top 3 collectors win prizes. Register by Nov 8.",
    author:  "Plastic-Free Chennai",
    time:    "Yesterday",
    pinned:  false,
    tag:     "Event",
    tagVariant: "outline",
    tagClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
  },
  {
    id: 3,
    title:   "New Recycling Drop-off Point Added",
    body:    "A new e-waste drop-off point has been added near Velachery Bus Stand. Open Mon–Sat.",
    author:  "Admin",
    time:    "3d ago",
    pinned:  false,
    tag:     "Update",
    tagVariant: "outline",
    tagClass: "border-sky-500/30 bg-sky-500/10 text-sky-500",
  },
  {
    id: 4,
    title:   "Community Guidelines Updated",
    body:    "Please read our updated community guidelines before posting in group chats.",
    author:  "Admin",
    time:    "1w ago",
    pinned:  false,
    tag:     "Notice",
    tagVariant: "outline",
    tagClass: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  },
];

export function AnnouncementsTab() {
  const pinned = ANNOUNCEMENTS.filter((a) => a.pinned);
  const rest   = ANNOUNCEMENTS.filter((a) => !a.pinned);

  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="px-4 pt-4 pb-6 space-y-5">

        {/* Pinned section */}
        {pinned.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5">
              <Pin size={11} className="text-muted-foreground" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Pinned</span>
            </div>
            {pinned.map((a) => <AnnouncementCard key={a.id} item={a} pinned />)}
          </div>
        )}

        <Separator />

        {/* Recent section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Bell size={11} className="text-muted-foreground" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Recent</span>
            </div>
            <Button variant="ghost" size="sm" className="h-auto py-0 px-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 hover:bg-transparent gap-0.5">
              See all <ChevronRight size={13} />
            </Button>
          </div>
          {rest.map((a) => <AnnouncementCard key={a.id} item={a} />)}
        </div>

      </div>
    </ScrollArea>
  );
}

function AnnouncementCard({ item, pinned }: { item: Announcement; pinned?: boolean }) {
  return (
    <Card className={`rounded-2xl border ${pinned ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-card"}`}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-foreground leading-snug flex-1">{item.title}</p>
          <Badge variant="outline" className={`text-[10px] font-semibold rounded-full flex-shrink-0 ${item.tagClass}`}>
            {item.tag}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
        <Separator />
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[11px] text-muted-foreground/70">{item.author}</span>
          <span className="text-[11px] text-muted-foreground/70">{item.time}</span>
        </div>
      </CardContent>
    </Card>
  );
}