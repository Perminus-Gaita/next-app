import type { Jackpot } from '../types';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE').format(Math.round(amount));
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase();
}

export function getJackpotDateRange(jackpot: Jackpot): { start: Date; end: Date } {
  const start = new Date(jackpot.finished);
  const firstKickoff = jackpot.events.reduce(
    (min: string, e: { kickoffTime: string }) => (e.kickoffTime < min ? e.kickoffTime : min),
    jackpot.events[0]?.kickoffTime || jackpot.finished
  );
  return { start, end: new Date(firstKickoff) };
}

export function formatPredictionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function relativeTime(dateString: string): string {
  const ms = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getDiceBearAvatar(seed: string): string {
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}&backgroundColor=c0aede,d1d4f9,b6e3f4,ffd5dc,ffdfbf`;
}
