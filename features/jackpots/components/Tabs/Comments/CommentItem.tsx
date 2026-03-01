"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Trash2 } from 'lucide-react';
import { relativeTime, getDiceBearAvatar } from '../../../utils/helpers';
import type { Comment } from '../../../types';
import Link from 'next/link';

function countDescendants(comment: Comment): number {
  if (!comment.replies?.length) return 0;
  return comment.replies.reduce((sum, c) => sum + 1 + countDescendants(c), 0);
}

/** Check if a comment and ALL descendants are deleted */
function isFullyDeleted(comment: Comment): boolean {
  if (!comment.deleted) return false;
  if (!comment.replies || comment.replies.length === 0) return true;
  return comment.replies.every(child => isFullyDeleted(child));
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  collapsedSet: Set<string>;
  toggleCollapse: (id: string) => void;
  onDelete?: (commentId: string) => void;
  onReply?: (parentId: string, text: string) => void;
  onVote?: (commentId: string, direction: 'up' | 'down') => void;
  currentUserId?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment, depth = 0, collapsedSet, toggleCollapse,
  onDelete, onReply, onVote, currentUserId,
}) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [localVoteState, setLocalVoteState] = useState<number>(comment.userVote || 0);
  const [localScoreOffset, setLocalScoreOffset] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const hasChildren = (comment.replies?.length || 0) > 0;
  const isCollapsed = collapsedSet.has(comment._id);
  const descendantCount = countDescendants(comment);
  const displayVotes = (comment.votes || 0) + localScoreOffset;
  const isOwner = comment.userId === currentUserId;

  // If this comment and all descendants are deleted, don't render
  if (isFullyDeleted(comment)) {
    return null;
  }

  // Filter out fully deleted children
  const visibleReplies = (comment.replies || []).filter(child => !isFullyDeleted(child));

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleSubmitReply = () => {
    if (replyText.trim() && onReply) {
      onReply(comment._id, replyText.trim());
      setReplyText('');
      setReplying(false);
    }
  };

  const handleVote = (dir: 'up' | 'down') => {
    const newValue = dir === 'up' ? 1 : -1;

    if (localVoteState === newValue) {
      // Already voted this way — toggle off (remove vote)
      setLocalScoreOffset(prev => prev - newValue);
      setLocalVoteState(0);
      // Send value=0 to remove the vote — but API expects 1/-1,
      // so we'll send the opposite to toggle. Actually the API supports value=0 for removal.
      // Let's send the same direction and let the backend handle toggle.
      // Actually looking at the API: it checks if existingVote.value !== value → updates
      // If existingVote.value === value → does nothing.
      // We need to send value=0 to remove.
      // But the API validates: value !== 1 && value !== -1 && value !== 0 → error
      // So value=0 is supported for removal!
      onVote?.(comment._id, dir);
      // We need a custom approach: send the actual desired value to the API
      // Let's refactor to use a direct fetch instead of the parent callback
      fetch(getVoteUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: comment._id, value: 0 }),
      }).catch(() => {
        // Rollback on failure
        setLocalScoreOffset(prev => prev + newValue);
        setLocalVoteState(newValue);
      });
      return;
    }

    // Calculate score delta
    const oldValue = localVoteState;
    const scoreDelta = newValue - oldValue;

    setLocalScoreOffset(prev => prev + scoreDelta);
    setLocalVoteState(newValue);

    // Send the actual value to API
    fetch(getVoteUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: comment._id, value: newValue }),
    }).catch(() => {
      // Rollback on failure
      setLocalScoreOffset(prev => prev - scoreDelta);
      setLocalVoteState(oldValue);
    });
  };

  // Get the vote API URL from the comment's jackpotId
  const getVoteUrl = () => {
    return `/api/jackpots/${comment.jackpotId}/comments/vote`;
  };

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete?.(comment._id);
  };

  // If this is a deleted parent with visible children, show placeholder
  if (comment.deleted) {
    return (
      <div style={{ paddingLeft: depth > 0 ? 28 : 0 }}>
        <div style={{ display: 'flex', gap: 10, padding: '10px 0', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <div
              style={{
                width: 32, height: 32, minWidth: 32, borderRadius: '50%',
                border: '2px solid var(--border, #2a2a4a)',
                background: 'var(--muted, #1a1a2e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ color: 'var(--muted-foreground)', fontSize: 12 }}>?</span>
            </div>
            {visibleReplies.length > 0 && !isCollapsed && (
              <button
                data-collapse={comment._id}
                onClick={() => toggleCollapse(comment._id)}
                title="Collapse thread"
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: '2px solid var(--border, #3a3a6a)',
                  background: 'var(--background, #0b0b18)',
                  color: 'var(--muted-foreground, #555)',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, zIndex: 3, transition: 'all 0.15s ease', flexShrink: 0,
                }}
              >−</button>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="text-sm text-muted-foreground italic" style={{ margin: 0 }}>
              [deleted]
            </p>
          </div>
        </div>

        {/* Collapsed indicator */}
        {visibleReplies.length > 0 && isCollapsed && (
          <div style={{ paddingLeft: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0' }}>
              <button
                data-expand={comment._id}
                onClick={() => toggleCollapse(comment._id)}
                title={`Expand ${descendantCount} replies`}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: '2px solid var(--border, #3a3a6a)',
                  background: 'var(--muted, #1a1a3a)',
                  color: 'var(--primary, #7c8aff)',
                  fontSize: 18, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, zIndex: 3, transition: 'all 0.15s ease', flexShrink: 0,
                }}
              >+</button>
              <span className="text-xs text-primary font-medium opacity-80">
                {descendantCount} {descendantCount === 1 ? 'reply' : 'replies'}
              </span>
            </div>
          </div>
        )}

        {/* Expanded children */}
        {visibleReplies.length > 0 && !isCollapsed &&
          visibleReplies.map((child) => (
            <CommentItem key={child._id} comment={child} depth={depth + 1}
              collapsedSet={collapsedSet} toggleCollapse={toggleCollapse}
              onDelete={onDelete} onReply={onReply} onVote={onVote}
              currentUserId={currentUserId} />
          ))
        }
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: depth > 0 ? 28 : 0 }}>
      <div style={{ display: 'flex', gap: 10, padding: '10px 0', alignItems: 'flex-start' }}>
        {/* Left: avatar + collapse */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <Link href={`/${comment.username || 'anonymous'}`}>
            <img
              data-avatar={comment._id}
              src={comment.image || getDiceBearAvatar(comment.username || 'anon')}
              alt=""
              style={{
                width: 32, height: 32, minWidth: 32, borderRadius: '50%',
                border: '2px solid var(--border, #2a2a4a)', zIndex: 2,
                background: 'var(--muted, #1a1a2e)', cursor: 'pointer',
              }}
            />
          </Link>
          {hasChildren && !isCollapsed && (
            <button
              data-collapse={comment._id}
              onClick={() => toggleCollapse(comment._id)}
              title="Collapse thread"
              style={{
                width: 20, height: 20, borderRadius: '50%',
                border: '2px solid var(--border, #3a3a6a)',
                background: 'var(--background, #0b0b18)',
                color: 'var(--muted-foreground, #555)',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0, zIndex: 3, transition: 'all 0.15s ease', flexShrink: 0,
              }}
            >−</button>
          )}
        </div>

        {/* Right: content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/${comment.username || 'anonymous'}`} className="text-sm font-semibold text-foreground hover:underline">
              {comment.username || 'Anonymous'}
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{relativeTime(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word" style={{ margin: 0 }}>
            {comment.text}
          </p>

          <div className="flex items-center gap-3.5 mt-1.5">
            {/* Upvote / Downvote */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => handleVote('up')}
                className={`p-0.5 rounded transition-colors cursor-pointer ${
                  localVoteState === 1 ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={localVoteState === 1 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
              </button>
              <span className={`text-xs font-semibold tabular-nums min-w-6 text-center ${displayVotes > 0 ? 'text-primary' : displayVotes < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {displayVotes}
              </span>
              <button
                onClick={() => handleVote('down')}
                className={`p-0.5 rounded transition-colors cursor-pointer ${
                  localVoteState === -1 ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={localVoteState === -1 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            </div>

            {/* Reply */}
            {onReply && (
              <button onClick={() => setReplying(!replying)} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Reply
              </button>
            )}

            {/* Share */}
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Share
            </button>

            {/* Three dots menu (owner only) */}
            {isOwner && onDelete && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-0.5 rounded transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {menuOpen && (
                  <div className="absolute left-0 top-6 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-muted transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reply input */}
          {replying && (
            <div className="mt-2 flex gap-2">
              <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
                placeholder="Write a reply..." maxLength={500}
                className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <button onClick={handleSubmitReply} disabled={!replyText.trim()}
                className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 disabled:opacity-40">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapsed */}
      {visibleReplies.length > 0 && isCollapsed && (
        <div style={{ paddingLeft: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0' }}>
            <button
              data-expand={comment._id}
              onClick={() => toggleCollapse(comment._id)}
              title={`Expand ${descendantCount} replies`}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                border: '2px solid var(--border, #3a3a6a)',
                background: 'var(--muted, #1a1a3a)',
                color: 'var(--primary, #7c8aff)',
                fontSize: 18, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 0, zIndex: 3, transition: 'all 0.15s ease', flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget;
                t.style.borderColor = 'var(--primary, #7c8aff)';
                t.style.background = 'var(--accent, #252550)';
                t.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.borderColor = 'var(--border, #3a3a6a)';
                t.style.background = 'var(--muted, #1a1a3a)';
                t.style.transform = 'scale(1)';
              }}
            >+</button>
            <span className="text-xs text-primary font-medium opacity-80">
              {descendantCount} {descendantCount === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </div>
      )}

      {/* Expanded children */}
      {visibleReplies.length > 0 && !isCollapsed &&
        visibleReplies.map((child) => (
          <CommentItem key={child._id} comment={child} depth={depth + 1}
            collapsedSet={collapsedSet} toggleCollapse={toggleCollapse}
            onDelete={onDelete} onReply={onReply} onVote={onVote}
            currentUserId={currentUserId} />
        ))
      }
    </div>
  );
};

export default CommentItem;
