"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ─── Types ───
export interface CalendarJackpot {
  id: string;
  humanId: number;
  status: string;
  bettingStatus: string | null;
  openedAt: string | null;
  finishedAt: string | null;
  firstKickoff: string | null;
  endDate: string | null;
}

interface JackpotCalendarProps {
  currentJackpotId?: string;
  onSelectJackpot: (jackpotId: string) => void;
  onClose: () => void;
  preloadedData?: CalendarJackpot[];
}

const DAYS_HDR = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseDate(s: string | null): Date | null {
  if (!s) return null;
  const d = s.substring(0, 10);
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function toKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isDateEqual(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getRangeEnd(jp: CalendarJackpot): Date | null {
  if (jp.status === "OPEN") return parseDate(jp.endDate);
  return jp.finishedAt ? parseDate(jp.finishedAt) : parseDate(jp.endDate);
}

// Returns the jackpot owning a day. Newer (higher humanId) wins on overlapping days.
function getJackpotForDay(date: Date, jackpots: CalendarJackpot[]): CalendarJackpot | null {
  let best: CalendarJackpot | null = null;
  for (const jp of jackpots) {
    const openDay = parseDate(jp.openedAt);
    const endDay = getRangeEnd(jp);
    if (openDay && endDay && date >= openDay && date <= endDay) {
      if (!best || jp.humanId > best.humanId) best = jp;
    }
  }
  return best;
}

// ─── Kickoff Ring — centered with inset:0 margin:auto, no translate conflict ───
function KickoffRing() {
  return (
    <>
      <style>{`
        @keyframes kring {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.0); opacity: 0; }
        }
      `}</style>
      <span
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: "70%",
          aspectRatio: "1",
          borderRadius: "50%",
          border: "2px solid #4ade80",
          pointerEvents: "none",
          animation: "kring 2s ease-out infinite",
        }}
      />
    </>
  );
}

function getCellClasses(opts: {
  isSel: boolean;
  isHov: boolean;
  isOpenAt: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isSng: boolean;
  todayHere: boolean;
}): string {
  const { isSel, isHov, isOpenAt, isRangeStart, isRangeEnd, isSng, todayHere } = opts;
  const base = "relative flex flex-col items-center justify-center aspect-square cursor-pointer font-mono select-none text-[13px] transition-all duration-100";

  let radius = "rounded-md";
  if ((isSel || isHov) && !isSng) {
    if (isRangeStart) radius = "rounded-l-md rounded-r-sm";
    else if (isRangeEnd) radius = "rounded-l-sm rounded-r-md";
    else radius = "rounded-sm";
  }

  let state = "";
  if (isSel) {
    state = "bg-green-500/13 text-green-400 font-semibold border border-green-500/22 shadow-[0_1px_4px_rgba(34,197,94,0.06)]";
  } else if (isHov) {
    state = "bg-muted/60 text-foreground font-medium border border-muted-foreground/20";
  } else if (isOpenAt) {
    state = "bg-muted/70 border border-border/80 text-muted-foreground";
  } else {
    state = "bg-muted/30 border border-border/30 text-muted-foreground";
  }

  const todayCls = todayHere ? "!text-orange-500 !font-bold" : "";
  return `${base} ${radius} ${state} ${todayCls}`;
}

export default function JackpotCalendar({ currentJackpotId, onSelectJackpot, onClose, preloadedData }: JackpotCalendarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date(), []);
  const todayKey = toKey(today);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [allJackpots, setAllJackpots] = useState<CalendarJackpot[]>([]);
  const [selectedJackpot, setSelectedJackpot] = useState<CalendarJackpot | null>(null);
  const [hoveredJpId, setHoveredJpId] = useState<string | null>(null);
  const [loading, setLoading] = useState(!preloadedData);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Initialize from preloaded data or fetch as fallback
  useEffect(() => {
    if (preloadedData && preloadedData.length > 0) {
      const sorted = [...preloadedData].sort((a, b) => a.humanId - b.humanId);
      setAllJackpots(sorted);

      const current = sorted.find((j) => j.id === currentJackpotId);
      const active = sorted.find((j) => j.status === "OPEN");
      const initial = current || active || sorted[sorted.length - 1];
      if (initial) {
        setSelectedJackpot(initial);
        const d = parseDate(initial.openedAt);
        if (d) { setMonth(d.getMonth()); setYear(d.getFullYear()); }
      }
      setLoading(false);
      return;
    }

    async function fetchAll() {
      try {
        const res = await fetch("/api/jackpots/calendar?all=true");
        if (res.ok) {
          const data: CalendarJackpot[] = await res.json();
          const sorted = [...data].sort((a, b) => a.humanId - b.humanId);
          setAllJackpots(sorted);

          const current = sorted.find((j) => j.id === currentJackpotId);
          const active = sorted.find((j) => j.status === "OPEN");
          const initial = current || active || sorted[sorted.length - 1];
          if (initial) {
            setSelectedJackpot(initial);
            const d = parseDate(initial.openedAt);
            if (d) { setMonth(d.getMonth()); setYear(d.getFullYear()); }
          }
        }
      } catch (err) {
        console.error("Failed to fetch all jackpots:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [currentJackpotId, preloadedData]);

  // Client-side month filtering (replaces per-month API call)
  const jackpots = useMemo(() => {
    if (allJackpots.length === 0) return [];
    const mStart = new Date(year, month, 1);
    const mEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return allJackpots.filter((jp) => {
      if (!jp.openedAt) return false;
      const rangeStart = new Date(jp.openedAt);
      const rangeEnd = jp.endDate
        ? new Date(jp.endDate)
        : jp.finishedAt
          ? new Date(jp.finishedAt)
          : rangeStart;
      return rangeStart <= mEnd && rangeEnd >= mStart;
    });
  }, [allJackpots, year, month]);

  const firstDow = new Date(year, month, 1).getDay();
  const dim = new Date(year, month + 1, 0).getDate();
  const cells = useMemo(() => {
    const c: (Date | null)[] = [];
    for (let i = 0; i < firstDow; i++) c.push(null);
    for (let i = 1; i <= dim; i++) c.push(new Date(year, month, i));
    while (c.length % 7 !== 0) c.push(null);
    return c;
  }, [year, month, dim, firstDow]);

  const prevM = useCallback(() => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1);
  }, [month]);
  const nextM = useCallback(() => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1);
  }, [month]);
  const goToday = useCallback(() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }, [today]);

  const sorted = allJackpots;
  const cidx = sorted.findIndex((j) => j.id === selectedJackpot?.id);

  const navJp = useCallback((dir: number) => {
    const next = sorted[cidx + dir];
    if (next) {
      setSelectedJackpot(next);
      onSelectJackpot(next.id);
      const d = parseDate(next.openedAt);
      if (d) { setMonth(d.getMonth()); setYear(d.getFullYear()); }
    }
  }, [sorted, cidx, onSelectJackpot]);

  const handleClick = useCallback((date: Date | null) => {
    if (!date) return;
    const jp = getJackpotForDay(date, jackpots);
    if (jp) { setSelectedJackpot(jp); onSelectJackpot(jp.id); }
  }, [jackpots, onSelectJackpot]);

  return (
    <div ref={ref} className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-[calc(100vw-1.5rem)] max-w-[320px] animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        {/* Month nav */}
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <button onClick={prevM} className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-colors text-sm">‹</button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{MONTHS[month]} {year}</span>
            <button onClick={goToday} className="text-[8px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/25 rounded px-1.5 py-0.5 cursor-pointer tracking-wider hover:bg-orange-500/20 transition-colors">TODAY</button>
          </div>
          <button onClick={nextM} className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-colors text-sm">›</button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 px-2 mb-0.5">
          {DAYS_HDR.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-medium text-muted-foreground/50 py-0.5 font-mono">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className={`grid grid-cols-7 px-2 pb-1.5 gap-0.75 transition-opacity duration-200 ${loading ? "opacity-50" : "opacity-100"}`}>
          {cells.map((date, i) => {
            if (!date) return <div key={i} className="aspect-square" />;

            const dayKey = toKey(date);
            const jp = getJackpotForDay(date, jackpots);
            const isAct = jp?.status === "OPEN";
            const openAtDate = jp ? parseDate(jp.openedAt) : null;
            const isOpenAt = !!(jp && openAtDate && isDateEqual(date, openAtDate));
            const rangeStartDate = openAtDate;
            const rangeEndFull = jp ? getRangeEnd(jp) : null;
            const lastOfMonth = new Date(year, month + 1, 0);
            const clampedEnd = rangeEndFull && rangeEndFull > lastOfMonth ? lastOfMonth : rangeEndFull;
            const isRangeStart = !!(jp && rangeStartDate && isDateEqual(date, rangeStartDate));
            const isRangeEnd = !!(jp && clampedEnd && isDateEqual(date, clampedEnd));
            const isSng = isRangeStart && isRangeEnd;
            const isSel = !!(jp && selectedJackpot?.id === jp.id);
            const isHov = !!(jp && hoveredJpId === jp.id && !isSel);
            const todayHere = dayKey === todayKey;
            const kickoffDate = jp ? parseDate(jp.firstKickoff) : null;
            const isKickoff = !!(jp && isAct && isSel && kickoffDate && isDateEqual(date, kickoffDate));

            let hashColor = "text-muted-foreground/40";
            if (isAct) hashColor = "text-green-500";
            else if (isSel) hashColor = "text-green-400";

            return (
              <div
                key={i}
                onClick={() => handleClick(date)}
                onMouseEnter={() => jp && !isSel && setHoveredJpId(jp.id)}
                onMouseLeave={() => setHoveredJpId(null)}
                className={getCellClasses({ isSel, isHov, isOpenAt, isRangeStart, isRangeEnd, isSng, todayHere })}
              >
                {todayHere && (
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[6px] font-extrabold text-orange-500 tracking-wide leading-none">TODAY</div>
                )}
                {isKickoff && <KickoffRing />}
                <span className="leading-none">{date.getDate()}</span>
                {isOpenAt && (
                  <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[6px] font-bold whitespace-nowrap transition-colors ${hashColor}`}>
                    #{jp.humanId}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom nav */}
        {selectedJackpot && (
          <div className="border-t border-border px-3 py-2.5 flex items-center justify-between">
            <button onClick={() => navJp(-1)} disabled={cidx <= 0} className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors ${cidx > 0 ? "bg-muted/50 border border-border text-muted-foreground hover:text-foreground" : "text-transparent cursor-default"}`}>‹</button>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-foreground font-mono">#{selectedJackpot.humanId}</span>
              {selectedJackpot.status === "OPEN" ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-500 border border-green-500/25">OPEN</span>
              ) : (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">DONE</span>
              )}
            </div>
            <button onClick={() => navJp(1)} disabled={cidx >= sorted.length - 1} className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors ${cidx < sorted.length - 1 ? "bg-muted/50 border border-border text-muted-foreground hover:text-foreground" : "text-transparent cursor-default"}`}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}
