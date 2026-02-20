"use client";

import React, { useRef, useEffect } from 'react';

interface MiniCalendarProps {
  start: Date;
  end: Date;
  onClose: () => void;
  status: string;
  isLatest: boolean;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ start, end, onClose, status, isLatest }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const year = start.getFullYear();
  const month = start.getMonth();
  const monthName = start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isInRange = (day: number | null): boolean => {
    if (!day) return false;
    const d = new Date(year, month, day);
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return d >= s && d <= e;
  };

  const isStartDay = (day: number | null) => day === start.getDate() && month === start.getMonth();
  const isEndDay = (day: number | null) => day === end.getDate() && month === end.getMonth();

  return (
    <div
      ref={ref}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-card border border-border rounded-xl p-4 shadow-2xl w-72 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground">{monthName}</span>
        <div className="flex items-center gap-1.5">
          {status === 'Open' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/20 text-green-500">OPEN</span>}
          {status === 'Closed' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">CLOSED</span>}
          {status === 'Finished' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">FINISHED</span>}
          {isLatest && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary">LATEST</span>}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] text-muted-foreground font-medium py-1">{d}</div>
        ))}
        {days.map((day, i) => {
          const inRange = isInRange(day);
          const isS = isStartDay(day);
          const isE = isEndDay(day);
          return (
            <div key={i} className={`text-xs py-1.5 transition-all ${
              !day ? '' : inRange
                ? `font-bold ${isS || isE ? 'bg-green-500 text-white rounded-md' : 'bg-green-500/20 text-green-600 dark:text-green-400'}`
                : 'text-muted-foreground'
            }`}>{day || ''}</div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        <div className="text-[10px] text-muted-foreground"><span className="inline-block w-2 h-2 rounded-sm bg-green-500 mr-1 align-middle" />Opens</div>
        <div className="text-[10px] text-muted-foreground"><span className="inline-block w-2 h-2 rounded-sm bg-green-500 mr-1 align-middle" />First Kickoff</div>
      </div>
    </div>
  );
};

export default MiniCalendar;
