"use client";

import React, { useState } from 'react';
import { Trash2, Send } from 'lucide-react';
import { relativeTime, getDiceBearAvatar } from '../../../utils/helpers';
import type { Comment } from '../../../types';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
  onReply?: (parentId: string, text: string) => void;
  isOwner?: boolean;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete, onReply, isOwner = false, depth = 0 }) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReply = () => {
    if (replyText.trim() && onReply) {
      onReply(comment._id, replyText.trim());
      setReplyText('');
      setReplying(false);
    }
  };

  return (
    <div className={depth > 0 ? 'ml-4 pl-3 border-l-2 border-border' : ''}>
      <div className="py-3">
        <div className="flex gap-2.5">
          <img
            src={getDiceBearAvatar(comment.username || 'anon')}
            alt=""
            className="w-7 h-7 rounded-full bg-muted flex-shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-foreground">{comment.username || 'Anonymous'}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{relativeTime(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap break-words mb-1.5">{comment.text}</p>
            <div className="flex items-center gap-3">
              {onReply && (
                <button onClick={() => setReplying(!replying)} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Reply
                </button>
              )}
              {isOwner && onDelete && (
                <button onClick={() => onDelete(comment._id)} className="text-xs text-muted-foreground hover:text-red-500 transition-colors">
                  Delete
                </button>
              )}
            </div>
            {replying && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
                  placeholder="Write a reply..."
                  className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  maxLength={500}
                />
                <button onClick={handleSubmitReply} disabled={!replyText.trim()} className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 disabled:opacity-40">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Nested replies */}
      {comment.replies?.map((reply) => (
        <CommentItem key={reply._id} comment={reply} depth={depth + 1} onDelete={onDelete} onReply={onReply} isOwner={reply.userId === (comment as any)._currentUserId} />
      ))}
    </div>
  );
};

export default CommentItem;
