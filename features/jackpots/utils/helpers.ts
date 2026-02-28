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
  // Start = openedAt if available, else finished minus 6 days
  let start: Date;
  if (jackpot.openedAt) {
    start = new Date(jackpot.openedAt);
  } else {
    start = new Date(jackpot.finished);
    start.setDate(start.getDate() - 6);
  }

  // End = finishedAt for finished jackpots, else last kickoff + 90min
  let end: Date;
  if (jackpot.jackpotStatus === 'Finished' && jackpot.finished) {
    end = new Date(jackpot.finished);
  } else {
    const lastKickoff = jackpot.events.reduce(
      (max: string, e: { kickoffTime: string }) =>
        e.kickoffTime > max ? e.kickoffTime : max,
      jackpot.events[0]?.kickoffTime || jackpot.finished
    );
    end = new Date(lastKickoff);
    end.setMinutes(end.getMinutes() + 90);
  }

  return { start, end };
}

export function formatDateRange(jackpot: Jackpot): string {
  const { start, end } = getJackpotDateRange(jackpot);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase();
  return fmt(start) + ' – ' + fmt(end);
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
