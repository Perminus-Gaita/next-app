"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2, Send } from 'lucide-react';
import CommentItem from './CommentItem';
import type { Comment } from '../../../types';

interface CommentsTabProps {
  comments: Comment[];
  loading?: boolean;
  submitting?: boolean;
  onAddComment?: (text: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onReplyComment?: (parentId: string, text: string) => void;
  onVoteComment?: (commentId: string, direction: 'up' | 'down') => void;
  currentUserId?: string;
}

function useCanvasLines(
  containerRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  comments: Comment[],
  collapsedSet: Set<string>
) {
  const draw = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const style = getComputedStyle(document.documentElement);
    const borderHsl = style.getPropertyValue('--border')?.trim();
    ctx.strokeStyle = borderHsl ? `hsl(${borderHsl})` : '#3a3a6a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function center(el: Element) {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - rect.left, y: r.top + r.height / 2 - rect.top };
    }
    function bottom(el: Element) {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - rect.left, y: r.top + r.height - rect.top };
    }

    function drawCurve(from: { x: number; y: number }, to: { x: number; y: number }, alpha = 1) {
      if (!ctx) return;
      const r = Math.min(10, Math.abs(to.y - from.y), Math.abs(to.x - from.x));
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(from.x, to.y - r);
      ctx.quadraticCurveTo(from.x, to.y, from.x + r, to.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function traverse(comment: Comment) {
      if (!comment.replies?.length) return;
      const avatarEl = container!.querySelector(`[data-avatar="${comment._id}"]`);
      if (!avatarEl) return;

      if (collapsedSet.has(comment._id)) {
        const expandBtn = container!.querySelector(`[data-expand="${comment._id}"]`);
        if (expandBtn) drawCurve({ ...bottom(avatarEl), y: bottom(avatarEl).y + 2 }, center(expandBtn), 0.5);
        return;
      }

      const collapseBtn = container!.querySelector(`[data-collapse="${comment._id}"]`);
      if (!collapseBtn) return;
      const startPos = { ...center(collapseBtn), y: center(collapseBtn).y + 12 };

      comment.replies.forEach((child) => {
        const childAvatar = container!.querySelector(`[data-avatar="${child._id}"]`);
        if (!childAvatar) return;
        drawCurve(startPos, center(childAvatar));
        traverse(child);
      });
    }

    comments.forEach(traverse);
  }, [comments, collapsedSet, containerRef, canvasRef]);

  useEffect(() => {
    const timer = setTimeout(draw, 30);
    window.addEventListener('resize', draw);
    return () => { clearTimeout(timer); window.removeEventListener('resize', draw); };
  }, [draw]);
}

const CommentsTab: React.FC<CommentsTabProps> = ({
  comments, loading = false, submitting = false,
  onAddComment, onDeleteComment, onReplyComment, onVoteComment, currentUserId,
}) => {
  const [newComment, setNewComment] = useState('');
  const [collapsedSet, setCollapsedSet] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topLevelComments = comments.filter(c => !c.parentId);

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  useCanvasLines(containerRef, canvasRef, topLevelComments, collapsedSet);

  const handleSubmit = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="px-4 py-3">
        <div className="flex gap-2">
          <input type="text" value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Add a comment..."
            className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={500} disabled={submitting} />
          <button onClick={handleSubmit} disabled={!newComment.trim() || submitting}
            className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {topLevelComments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="text-muted-foreground mb-2">No comments yet</div>
          <div className="text-sm text-muted-foreground">Be the first to comment!</div>
        </div>
      ) : (
        <div ref={containerRef} className="px-4 pb-4 relative">
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 1 }} />
          {topLevelComments.map((comment, idx) => (
            <div key={comment._id} className={idx < topLevelComments.length - 1 ? 'border-b border-border' : ''}>
              <CommentItem comment={comment} depth={0}
                collapsedSet={collapsedSet} toggleCollapse={toggleCollapse}
                onDelete={onDeleteComment} onReply={onReplyComment}
                onVote={onVoteComment} currentUserId={currentUserId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsTab;
