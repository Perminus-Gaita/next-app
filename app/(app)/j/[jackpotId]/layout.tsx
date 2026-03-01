"use client";

import React from "react";
import { useParams } from "next/navigation";
import { JackpotProvider, useJackpot } from "@/features/jackpots/context/JackpotContext";
import JackpotDetails from "@/features/jackpots/components/JackpotDetails";
import JackpotTabsNav from "@/features/jackpots/components/JackpotTabsNav";
import JackpotError from "@/features/jackpots/components/JackpotError";
import { JackpotSkeleton } from "@/features/jackpots/components/JackpotSkeleton";

function JackpotLayoutInner({ children }: { children: React.ReactNode }) {
  const { jackpot, initialLoading, switchingJackpot, error, calendarData, switchJackpot, refetch } = useJackpot();

  // First load — show full skeleton
  if (initialLoading) return <JackpotSkeleton />;

  // Error with no data at all
  if (error && !jackpot) return <JackpotError error={error} onRetry={refetch} />;

  // We have jackpot data (possibly stale during switch) — always show header
  if (!jackpot) return <JackpotSkeleton />;

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      <JackpotDetails
        jackpot={jackpot}
        onSelectJackpot={switchJackpot}
        calendarData={calendarData}
      />
      <JackpotTabsNav jackpotId={jackpot._id} />
      <div className="animate-in fade-in duration-200">
        {children}
      </div>
    </div>
  );
}

export default function JackpotLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const jackpotId = params.jackpotId as string;

  return (
    <JackpotProvider jackpotId={jackpotId}>
      <JackpotLayoutInner>{children}</JackpotLayoutInner>
    </JackpotProvider>
  );
}
