"use client";

import React from "react";
import { useJackpot } from "@/features/jackpots/context/JackpotContext";
import MatchesTab from "@/features/jackpots/components/Tabs/Matches";
import { TabSkeleton } from "@/features/jackpots/components/JackpotSkeleton";

export default function MatchesPage() {
  const { jackpot, initialLoading, switchingJackpot } = useJackpot();

  if (initialLoading || !jackpot) return <TabSkeleton />;
  if (switchingJackpot) return <TabSkeleton />;

  return (
    <MatchesTab
      events={jackpot.events}
      jackpotId={jackpot._id}
      jackpotStatus={jackpot.jackpotStatus}
    />
  );
}
