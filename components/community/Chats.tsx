"use client";

import { useState } from "react";
import { MessageCircle, Plus, Search } from "lucide-react";
import { Input }      from "@/components/ui/input";
import { Button }     from "@/components/ui/button";
import { Badge }      from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator }  from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatRoom = {
  id:      number;
  name:    string;
  lastMsg: string;
  members: number;
  unread:  number;
  time:    string;
};

const CHAT_ROOMS: ChatRoom[] = [
  { id: 1, name: "Beach Cleanup Drive",   lastMsg: "Tomorrow 7 AM at Marina!",        members: 58,  unread: 3, time: "9:41 AM"   },
  { id: 2, name: "Plastic-Free Chennai",  lastMsg: "Poster campaign next week.",       members: 94,  unread: 0, time: "Yesterday" },
  { id: 3, name: "Ward 42 Cleanup Team",  lastMsg: "Great work everyone 👏",           members: 38,  unread: 1, time: "Mon"       },
  { id: 4, name: "Velammal Eco Club",     lastMsg: "New event posted, check it out.",  members: 67,  unread: 0, time: "Sun"       },
  { id: 5, name: "Marina Shoreline",      lastMsg: "Photos from Sunday's drive!",      members: 112, unread: 7, time: "Sat"       },
];

export function ChatsTab() {
  const [search, setSearch] = useState("");

  const filtered = CHAT_ROOMS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col">

      {/* Search */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats…"
            className="pl-8 h-9 rounded-xl bg-muted border-0 text-sm focus-visible:ring-1 focus-visible:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* List */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="pb-2">
          {filtered.map((chat, i) => (
            <div key={chat.id}>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 active:bg-accent transition-colors text-left">

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-11 h-11 rounded-2xl">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="rounded-2xl bg-emerald-500/10 text-emerald-600 text-sm font-bold">
                      {chat.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {chat.unread > 0 && (
                    <Badge className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-emerald-500 hover:bg-emerald-500 border-2 border-background rounded-full flex items-center justify-center leading-none">
                      {chat.unread}
                    </Badge>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{chat.name}</p>
                    <span className="text-[11px] text-muted-foreground flex-shrink-0">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground truncate">{chat.lastMsg}</p>
                    <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">{chat.members} members</span>
                  </div>
                </div>

              </button>
              {i < filtered.length - 1 && <Separator className="mx-4 w-auto" />}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
              <MessageCircle size={32} className="text-muted-foreground/25" />
              <p className="text-sm text-muted-foreground">No chats found</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* New Chat button */}
      <div className="px-4 pb-4 pt-3">
        <Button className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm gap-2 shadow-[0_4px_14px_rgba(16,185,129,0.25)]">
          <Plus size={15} />
          New Chat
        </Button>
      </div>

    </div>
  );
}