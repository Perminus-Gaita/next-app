"use client";

import React, { useState } from 'react';
import { Trash2, Send } from 'lucide-react';
import { relativeTime, getDiceBearAvatar } from '../../../utils/helpers';
import type { Comment } from '../../../types';

function countDescendants(comment: Comment): number {
  if (!comment.replies?.length) return 0;
  return comment.replies.reduce((sum, c) => sum + 1 + countDescendants(c), 0);
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
  const [localVoteOffset, setLocalVoteOffset] = useState(0);

  const hasChildren = (comment.replies?.length || 0) > 0;
  const isCollapsed = collapsedSet.has(comment._id);
  const descendantCount = countDescendants(comment);
  const displayVotes = (comment.votes || 0) + localVoteOffset;
  const isOwner = comment.userId === currentUserId;

  const handleSubmitReply = () => {
    if (replyText.trim() && onReply) {
      onReply(comment._id, replyText.trim());
      setReplyText('');
      setReplying(false);
    }
  };

  const handleVote = (dir: 'up' | 'down') => {
    setLocalVoteOffset(prev => dir === 'up' ? prev + 1 : prev - 1);
    onVote?.(comment._id, dir);
  };

  return (
    <div style={{ paddingLeft: depth > 0 ? 28 : 0 }}>
      <div style={{ display: 'flex', gap: 10, padding: '10px 0', alignItems: 'flex-start' }}>
        {/* Left: avatar + collapse */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <img
            data-avatar={comment._id}
            src={getDiceBearAvatar(comment.username || 'anon')}
            alt=""
            style={{
              width: 32, height: 32, minWidth: 32, borderRadius: '50%',
              border: '2px solid var(--border, #2a2a4a)', zIndex: 2,
              background: 'var(--muted, #1a1a2e)',
            }}
          />
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
              onMouseEnter={(e) => {
                const t = e.currentTarget;
                t.style.borderColor = 'var(--primary, #7c8aff)';
                t.style.background = 'var(--muted, #1a1a3a)';
                t.style.color = 'var(--primary, #a8b4ff)';
                t.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.borderColor = 'var(--border, #3a3a6a)';
                t.style.background = 'var(--background, #0b0b18)';
                t.style.color = 'var(--muted-foreground, #555)';
                t.style.transform = 'scale(1)';
              }}
            >−</button>
          )}
        </div>

        {/* Right: content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">{comment.username || 'Anonymous'}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{relativeTime(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word" style={{ margin: 0 }}>
            {comment.text}
          </p>

          <div className="flex items-center gap-3.5 mt-1.5">
            <div className="flex items-center gap-0.5">
              <button onClick={() => handleVote('up')} className="p-0.5 rounded transition-colors text-muted-foreground hover:text-primary cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
              </button>
              <span className={`text-xs font-semibold tabular-nums min-w-6 text-center ${displayVotes > 0 ? 'text-primary' : displayVotes < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {displayVotes}
              </span>
              <button onClick={() => handleVote('down')} className="p-0.5 rounded transition-colors text-muted-foreground hover:text-destructive cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            </div>
            {onReply && <button onClick={() => setReplying(!replying)} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Reply</button>}
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Share</button>
            {isOwner && onDelete && <button onClick={() => onDelete(comment._id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"><Trash2 className="w-3 h-3" /></button>}
          </div>

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
      {hasChildren && isCollapsed && (
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
      {hasChildren && !isCollapsed &&
        comment.replies!.map((child) => (
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
