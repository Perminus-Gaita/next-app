"use client";

import React, { useState, useEffect } from "react";
import { useJackpot } from "@/features/jackpots/context/JackpotContext";
import StatsTab from "@/features/jackpots/components/Tabs/Stats";
import { TabSkeleton } from "@/features/jackpots/components/JackpotSkeleton";

export default function StatsPage() {
  const { jackpot, initialLoading, switchingJackpot } = useJackpot();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!jackpot?._id) return;

    async function fetchStats() {
      setStatsLoading(true);
      try {
        const [predRes, statsRes] = await Promise.all([
          fetch(`/api/jackpots/${jackpot!._id}/picks`),
          fetch(`/api/jackpots/${jackpot!._id}/stats`),
        ]);

        if (predRes.ok) {
          const predData = await predRes.json();
          setPredictions(predData);
        }
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setStatsLoading(false);
      }
    }

    fetchStats();
  }, [jackpot?._id]);

  if (initialLoading || !jackpot) return <TabSkeleton />;
  if (switchingJackpot) return <TabSkeleton />;

  return (
    <StatsTab
      jackpot={jackpot}
      communityPredictions={predictions}
      stats={stats}
      loading={statsLoading}
    />
  );
}
