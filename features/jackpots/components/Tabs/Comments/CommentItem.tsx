"use client";

import React from 'react';
import { Trash2, User } from 'lucide-react';
import type { Comment } from '../../../types';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
  isOwner?: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
  isOwner = false,
}) => {
  return (
    <div className="px-4 py-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {comment.username || 'Anonymous'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            
            {isOwner && onDelete && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-red-500 hover:text-red-600 transition-colors"
                title="Delete comment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <p className="text-sm text-foreground whitespace-pre-wrap break-words">
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
