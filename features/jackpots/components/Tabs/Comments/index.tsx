"use client";

import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import CommentItem from './CommentItem';
import type { Comment } from '../../../types';

interface CommentsTabProps {
  comments: Comment[];
  loading?: boolean;
  submitting?: boolean;
  onAddComment?: (text: string) => void;
  onDeleteComment?: (commentId: string) => void;
  currentUserId?: string;
}

const CommentsTab: React.FC<CommentsTabProps> = ({
  comments,
  loading = false,
  submitting = false,
  onAddComment,
  onDeleteComment,
  currentUserId,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Comment Input */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Add a comment..."
            className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={500}
            disabled={submitting}
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim() || submitting}
            className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {newComment.length}/500
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="text-muted-foreground mb-2">No comments yet</div>
          <div className="text-sm text-muted-foreground">
            Be the first to comment!
          </div>
        </div>
      ) : (
        comments.map((comment, idx) => {
          const isLast = idx === comments.length - 1;
          return (
            <div key={comment._id} className={`${!isLast ? 'border-b border-border' : ''}`}>
              <CommentItem
                comment={comment}
                onDelete={onDeleteComment}
                isOwner={comment.userId === currentUserId}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default CommentsTab;
