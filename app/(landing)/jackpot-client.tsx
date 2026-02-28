"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import JackpotDetails from "@/features/jackpots/components/JackpotDetails";
import TabsHeader from "@/features/jackpots/components/TabsHeader";
import MatchesTab from "@/features/jackpots/components/Tabs/Matches";
import PredictionsTab from "@/features/jackpots/components/Tabs/Predictions";
import CommentsTab from "@/features/jackpots/components/Tabs/Comments";
import type { Jackpot, Comment, TabType } from "@/features/jackpots/types";
import type { CalendarJackpot } from "@/features/jackpots/components/JackpotCalendar";

// ─── Full page skeleton (initial load) ───
const JackpotSkeleton = () => (
  <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded w-2/3 mx-auto" />
      <div className="h-4 bg-muted rounded w-1/3 mx-auto" />
      <div className="h-32 bg-muted rounded" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded" />
        ))}
      </div>
    </div>
  </div>
);

// ─── Matches skeleton (when switching jackpot) ───
const MatchesSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className={`px-4 py-4 ${i < 5 ? "border-b border-border" : ""}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-6 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
          <div className="h-5 w-20 bg-muted rounded" />
        </div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="h-4 w-28 bg-muted rounded ml-auto" />
          <div className="h-3 w-6 bg-muted rounded" />
          <div className="h-4 w-28 bg-muted rounded mr-auto" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 bg-muted rounded-lg" />
          <div className="h-10 bg-muted rounded-lg" />
          <div className="h-10 bg-muted rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Error ───
const JackpotError = ({ error, onRetry }: { error: string | null; onRetry: () => void }) => (
  <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-lg font-semibold text-foreground mb-2">Failed to load jackpot</h2>
      <p className="text-sm text-muted-foreground mb-4">{error || "Something went wrong."}</p>
      <button onClick={onRetry} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  </div>
);

// ─── Main ───
export default function JackpotTracker() {
  const [activeTab, setActiveTab] = useState<TabType>("matches");
  const [jackpot, setJackpot] = useState<Jackpot | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [switchingJackpot, setSwitchingJackpot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  // Pre-fetched calendar data — loaded once on mount
  const [calendarData, setCalendarData] = useState<CalendarJackpot[]>([]);

  // Pre-fetch all calendar jackpots on mount (only ~170 records)
  useEffect(() => {
    async function prefetchCalendar() {
      try {
        const res = await fetch("/api/jackpots/calendar?all=true");
        if (res.ok) {
          const data: CalendarJackpot[] = await res.json();
          setCalendarData(data);
        }
      } catch (err) {
        console.error("Failed to prefetch calendar data:", err);
      }
    }
    prefetchCalendar();
  }, []);

  const fetchJackpot = useCallback(async (id?: string) => {
    try {
      setError(null);
      // First load = full skeleton, subsequent = switching skeleton
      if (!jackpot) setInitialLoading(true);
      else setSwitchingJackpot(true);

      const url = id ? `/api/jackpots/${id}` : "/api/jackpots/latest";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch jackpot");
      const data = await res.json();
      setJackpot(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jackpot");
    } finally {
      setInitialLoading(false);
      setSwitchingJackpot(false);
    }
  }, [jackpot]);

  useEffect(() => {
    fetchJackpot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectJackpot = useCallback((jackpotId: string) => {
    if (jackpot?._id === jackpotId) return;
    fetchJackpot(jackpotId);
  }, [jackpot?._id, fetchJackpot]);

  const handleAddComment = (text: string) => {
    const c: Comment = {
      _id: `com_${Date.now()}`, jackpotId: jackpot?._id ?? "", userId: "currentUser",
      username: "You", text, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setComments([c, ...comments]);
  };

  const handleDeleteComment = (id: string) => setComments(comments.filter((c) => c._id !== id));

  const handleReplyComment = (parentId: string, text: string) => {
    const reply: Comment = {
      _id: `reply_${Date.now()}`, jackpotId: jackpot?._id ?? "", userId: "currentUser",
      username: "You", text, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      parentId, replies: [],
    };
    setComments((prev) =>
      prev.map((c) => c._id === parentId ? { ...c, replies: [...(c.replies || []), reply] } : c)
    );
  };

  if (initialLoading) return <JackpotSkeleton />;
  if (error || !jackpot) return <JackpotError error={error} onRetry={() => fetchJackpot()} />;

  return (
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      <JackpotDetails
        jackpot={jackpot}
        onSelectJackpot={handleSelectJackpot}
        calendarData={calendarData}
      />
      <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="animate-in fade-in duration-200">
        {switchingJackpot ? (
          <MatchesSkeleton />
        ) : (
          <>
            {activeTab === "matches" && (
              <MatchesTab events={jackpot.events} jackpotId={jackpot._id} jackpotStatus={jackpot.jackpotStatus} />
            )}
            {activeTab === "predictions" && (
              <PredictionsTab predictions={[]} jackpot={jackpot} loading={false} />
            )}
            {activeTab === "comments" && (
              <CommentsTab comments={comments} loading={false} submitting={false} onAddComment={handleAddComment} onDeleteComment={handleDeleteComment} onReplyComment={handleReplyComment} currentUserId="currentUser" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
