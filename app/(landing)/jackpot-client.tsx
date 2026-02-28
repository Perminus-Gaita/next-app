"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth/client";
import JackpotDetails from "@/features/jackpots/components/JackpotDetails";
import TabsHeader from "@/features/jackpots/components/TabsHeader";
import MatchesTab from "@/features/jackpots/components/Tabs/Matches";
import PredictionsTab from "@/features/jackpots/components/Tabs/Predictions";
import CommentsTab from "@/features/jackpots/components/Tabs/Comments";
import type { Jackpot, Comment, TabType } from "@/features/jackpots/types";

interface CalendarJackpot {
  id: string;
  humanId: number;
  status: string;
  bettingStatus: string | null;
  openedAt: string | null;
  finishedAt: string | null;
  firstKickoff: string | null;
  endDate: string | null;
}

// ─── Skeletons ───
const JackpotSkeleton = () => (
  <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
    <div className="animate-pulse p-6 space-y-4">
      <div className="h-6 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-10 bg-muted rounded" />
      <div className="space-y-3 pt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const MatchesSkeleton = () => (
  <div className="animate-pulse p-4 space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-20 bg-muted rounded-xl" />
    ))}
  </div>
);

const JackpotError = ({ error, onRetry }: { error: string | null; onRetry: () => void }) => (
  <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load jackpot</h3>
      <p className="text-sm text-muted-foreground mb-4">{error || "Something went wrong. Please try again."}</p>
      <button onClick={onRetry} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  </div>
);

// ─── Helpers for optimistic comment tree updates ───
function addCommentToTree(comments: Comment[], newComment: Comment, parentId?: string | null): Comment[] {
  if (!parentId) {
    // Top-level: prepend
    return [newComment, ...comments];
  }
  // Find parent and add as reply
  return comments.map(c => {
    if (c._id === parentId) {
      return { ...c, replies: [...(c.replies || []), newComment] };
    }
    if (c.replies && c.replies.length > 0) {
      return { ...c, replies: addCommentToTree(c.replies, newComment, parentId) };
    }
    return c;
  });
}

function removeCommentFromTree(comments: Comment[], commentId: string): Comment[] {
  return comments
    .map(c => {
      if (c._id === commentId) {
        // If has children, soft-delete (mark as deleted), else remove entirely
        if (c.replies && c.replies.length > 0) {
          return { ...c, text: "[deleted]", deleted: true, username: "[deleted]" };
        }
        return null; // Remove leaf
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: removeCommentFromTree(c.replies, commentId) };
      }
      return c;
    })
    .filter(Boolean) as Comment[];
}

function updateCommentInTree(comments: Comment[], commentId: string, updates: Partial<Comment>): Comment[] {
  return comments.map(c => {
    if (c._id === commentId) {
      return { ...c, ...updates };
    }
    if (c.replies && c.replies.length > 0) {
      return { ...c, replies: updateCommentInTree(c.replies, commentId, updates) };
    }
    return c;
  });
}

// ─── Main ───
export default function JackpotTracker() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("matches");
  const [jackpot, setJackpot] = useState<Jackpot | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [switchingJackpot, setSwitchingJackpot] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Predictions state
  const [predictions, setPredictions] = useState<any[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(false);

  // Calendar data
  const [calendarData, setCalendarData] = useState<CalendarJackpot[]>([]);

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

  // ─── Fetch jackpot ───
  const fetchJackpot = useCallback(async (id?: string) => {
    try {
      setError(null);
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

  useEffect(() => { fetchJackpot(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Fetch comments ───
  const fetchComments = useCallback(async (jackpotId: string) => {
    try {
      setCommentsLoading(true);
      const res = await fetch(`/api/jackpots/${jackpotId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  // ─── Fetch predictions ───
  const fetchPredictions = useCallback(async (jackpotId: string) => {
    try {
      setPredictionsLoading(true);
      const res = await fetch(`/api/jackpots/${jackpotId}/picks`);
      if (res.ok) {
        const data = await res.json();
        setPredictions(data);
      }
    } catch (err) {
      console.error("Failed to fetch predictions:", err);
    } finally {
      setPredictionsLoading(false);
    }
  }, []);

  // Refetch when jackpot changes
  useEffect(() => {
    if (jackpot?._id) {
      fetchComments(jackpot._id);
      fetchPredictions(jackpot._id);
    }
  }, [jackpot?._id, fetchComments, fetchPredictions]);

  const handleSelectJackpot = useCallback((jackpotId: string) => {
    if (jackpot?._id === jackpotId) return;
    fetchJackpot(jackpotId);
  }, [jackpot?._id, fetchJackpot]);

  // ─── OPTIMISTIC: Add comment ───
  const handleAddComment = useCallback(async (text: string) => {
    if (!jackpot?._id || !user) return;

    // Optimistic: immediately show the comment
    const tempId = `temp_${Date.now()}`;
    const optimisticComment: Comment = {
      _id: tempId,
      jackpotId: jackpot._id,
      userId: user.id,
      username: (user as any).username || user.name || "You",
      image: user.image || null,
      text,
      votes: 0,
      userVote: 0,
      parentId: null,
      depth: 0,
      deleted: false,
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComments(prev => addCommentToTree(prev, optimisticComment));
    setCommentSubmitting(true);

    try {
      const res = await fetch(`/api/jackpots/${jackpot._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const real = await res.json();
        // Replace temp with real
        setComments(prev =>
          prev.map(c => c._id === tempId ? { ...real, replies: [] } : c)
        );
      } else {
        // Rollback
        setComments(prev => prev.filter(c => c._id !== tempId));
      }
    } catch {
      // Rollback
      setComments(prev => prev.filter(c => c._id !== tempId));
    } finally {
      setCommentSubmitting(false);
    }
  }, [jackpot?._id, user]);

  // ─── OPTIMISTIC: Reply to comment ───
  const handleReplyComment = useCallback(async (parentId: string, text: string) => {
    if (!jackpot?._id || !user) return;

    const tempId = `temp_reply_${Date.now()}`;
    const optimisticReply: Comment = {
      _id: tempId,
      jackpotId: jackpot._id,
      userId: user.id,
      username: (user as any).username || user.name || "You",
      image: user.image || null,
      text,
      votes: 0,
      userVote: 0,
      parentId,
      depth: 0,
      deleted: false,
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComments(prev => addCommentToTree(prev, optimisticReply, parentId));
    setCommentSubmitting(true);

    try {
      const res = await fetch(`/api/jackpots/${jackpot._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, parentId }),
      });
      if (res.ok) {
        const real = await res.json();
        // Replace temp reply with real one in the tree
        setComments(prev =>
          updateCommentInTree(prev, tempId, { ...real, replies: [] })
        );
      } else {
        setComments(prev => removeCommentFromTree(prev, tempId));
      }
    } catch {
      setComments(prev => removeCommentFromTree(prev, tempId));
    } finally {
      setCommentSubmitting(false);
    }
  }, [jackpot?._id, user]);

  // ─── OPTIMISTIC: Delete comment ───
  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!jackpot?._id) return;

    // Save snapshot for rollback
    const snapshot = comments;
    setComments(prev => removeCommentFromTree(prev, commentId));

    try {
      const res = await fetch(`/api/jackpots/${jackpot._id}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      if (!res.ok) {
        // Rollback
        setComments(snapshot);
      }
    } catch {
      setComments(snapshot);
    }
  }, [jackpot?._id, comments]);

  // ─── OPTIMISTIC: Vote on comment ───
  const handleVoteComment = useCallback(async (commentId: string, direction: 'up' | 'down') => {
    if (!jackpot?._id) return;

    // Optimistic: update score immediately
    const delta = direction === 'up' ? 1 : -1;
    setComments(prev =>
      updateCommentInTree(prev, commentId, {})
    );
    // We let the CommentItem handle its own local vote offset,
    // but still fire the API call
    const value = direction === 'up' ? 1 : -1;

    try {
      await fetch(`/api/jackpots/${jackpot._id}/comments/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, value }),
      });
      // CommentItem already shows the change via localVoteOffset
    } catch {
      // Vote failed silently — CommentItem's local offset already shows it
    }
  }, [jackpot?._id]);

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
              <PredictionsTab predictions={predictions} jackpot={jackpot} loading={predictionsLoading} />
            )}
            {activeTab === "comments" && (
              <CommentsTab
                comments={comments}
                loading={commentsLoading}
                submitting={commentSubmitting}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
                onReplyComment={handleReplyComment}
                onVoteComment={handleVoteComment}
                currentUserId={user?.id}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
