"use client";

import React, { useState, useEffect } from "react";
import { useJackpot } from "@/features/jackpots/context/JackpotContext";
import PredictionsTab from "@/features/jackpots/components/Tabs/Predictions";
import { TabSkeleton } from "@/features/jackpots/components/JackpotSkeleton";

export default function PicksPage() {
  const { jackpot, initialLoading, switchingJackpot } = useJackpot();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(true);

  useEffect(() => {
    if (!jackpot?._id) return;

    async function fetchPredictions() {
      setPredictionsLoading(true);
      try {
        const res = await fetch(`/api/jackpots/${jackpot!._id}/predictions`);
        if (res.ok) {
          const data = await res.json();
          setPredictions(data);
        }
      } catch (err) {
        console.error("Failed to fetch predictions:", err);
      } finally {
        setPredictionsLoading(false);
      }
    }

    fetchPredictions();
  }, [jackpot?._id]);

  if (initialLoading || !jackpot) return <TabSkeleton />;
  if (switchingJackpot) return <TabSkeleton />;

  return (
    <PredictionsTab
      predictions={predictions}
      jackpot={jackpot}
      loading={predictionsLoading}
    />
  );
}
