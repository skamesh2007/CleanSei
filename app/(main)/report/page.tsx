"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ReportPage } from "@/components/report/ReportPage";
import { Skeleton } from "@/components/ui/skeleton";

export default function Report() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-semibold tracking-tight">Report Waste</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Capture and submit a waste sighting to earn points.
        </p>
      </div>
      <ReportPage />
    </div>
  );
}