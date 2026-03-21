"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth }   from "@/hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageCircle, Bell, Users } from "lucide-react";
import { ChatsTab }         from "@/components/community/Chats";
import { AnnouncementsTab } from "@/components/community/Announcements";
import { CommunityTab }     from "@/components/community/Community";

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [authLoading, user, router]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto w-full">

        {/* ── Header ── */}
        <div className="px-5 pt-8 pb-2 sticky top-0 z-10 bg-background border-b border-border/60">
          <h1 className="text-xl font-bold text-foreground">Community</h1>
          <p className="text-xs text-muted-foreground mt-0.5 mb-4">Connect · Organise · Act</p>

          {/* Shadcn Tabs — just the trigger list, sticky in header */}
          <Tabs defaultValue="chats" className="w-full">
            <TabsList className="w-full h-10 rounded-xl bg-muted p-1 grid grid-cols-3">
              <TabsTrigger
                value="chats"
                className="rounded-lg text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground"
              >
                <MessageCircle size={13} />
                Chats
              </TabsTrigger>
              <TabsTrigger
                value="announcements"
                className="rounded-lg text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground"
              >
                <Bell size={13} />
                Updates
              </TabsTrigger>
              <TabsTrigger
                value="community"
                className="rounded-lg text-xs font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground"
              >
                <Users size={13} />
                Community
              </TabsTrigger>
            </TabsList>

            {/* ── Tab content (below sticky header) ── */}
            <TabsContent value="chats" className="mt-0 focus-visible:outline-none">
              <ChatsTab />
            </TabsContent>
            <TabsContent value="announcements" className="mt-0 focus-visible:outline-none">
              <AnnouncementsTab />
            </TabsContent>
            <TabsContent value="community" className="mt-0 focus-visible:outline-none">
              <CommunityTab />
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  );
}