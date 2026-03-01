"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useJackpot } from "@/features/jackpots/context/JackpotContext";
import CommentsTab from "@/features/jackpots/components/Tabs/Comments";
import { TabSkeleton } from "@/features/jackpots/components/JackpotSkeleton";
import { useAuth } from "@/lib/auth/client";
import type { Comment } from "@/features/jackpots/types";

function addCommentToTree(comments: Comment[], newComment: Comment, parentId?: string | null): Comment[] {
  if (!parentId) return [newComment, ...comments];
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
        if (c.replies && c.replies.length > 0) {
          return { ...c, text: "[deleted]", deleted: true, username: "[deleted]" };
        }
        return null;
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: removeCommentFromTree(c.replies, commentId) };
      }
      return c;
    })
    .filter(Boolean) as Comment[];
}

export default function CommentsPage() {
  const { jackpot, initialLoading, switchingJackpot } = useJackpot();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    if (!jackpot?._id) return;

    async function fetchComments() {
      setCommentsLoading(true);
      try {
        const res = await fetch(`/api/jackpots/${jackpot!._id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    }

    fetchComments();
  }, [jackpot?._id]);

  const handleAddComment = useCallback(async (text: string, parentId?: string) => {
    if (!jackpot?._id) return;
    setCommentSubmitting(true);
    try {
      const res = await fetch(`/api/jackpots/${jackpot._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, parentId }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => addCommentToTree(prev, newComment, parentId));
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setCommentSubmitting(false);
    }
  }, [jackpot?._id]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!jackpot?._id) return;
    try {
      const res = await fetch(`/api/jackpots/${jackpot._id}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments(prev => removeCommentFromTree(prev, commentId));
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  }, [jackpot?._id]);

  const handleReplyComment = useCallback(async (text: string, parentId: string) => {
    await handleAddComment(text, parentId);
  }, [handleAddComment]);

  const handleVoteComment = useCallback(async (commentId: string, direction: "up" | "down") => {
    if (!jackpot?._id) return;
    const value = direction === "up" ? 1 : -1;
    try {
      await fetch(`/api/jackpots/${jackpot._id}/comments/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, value }),
      });
    } catch {
      // Vote failed silently
    }
  }, [jackpot?._id]);

  if (initialLoading || !jackpot) return <TabSkeleton />;
  if (switchingJackpot) return <TabSkeleton />;

  return (
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
  );
}
