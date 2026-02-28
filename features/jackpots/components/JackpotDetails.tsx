"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import {
  formatShortDate,
  getJackpotDateRange,
  formatCurrency,
} from "../utils/helpers";
import JackpotCalendar from "./JackpotCalendar";
import type { Jackpot } from "../types";

interface JackpotDetailsProps {
  jackpot: Jackpot;
  onSelectJackpot?: (jackpotId: string) => void;
}

// ─── Prize Carousel ───
function PrizeCarousel({ prizes, currencySign, site }: {
  prizes: Jackpot["prizes"];
  currencySign: string;
  site: string;
}) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sorted = [...prizes].sort((a, b) => {
    const aNum = parseInt(a.jackpotType.split("/")[0], 10);
    const bNum = parseInt(b.jackpotType.split("/")[0], 10);
    return bNum - aNum;
  });

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % sorted.length);
    }, 7000);
  }, [sorted.length]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const goTo = (idx: number) => {
    setActive(idx);
    resetTimer();
  };

  if (sorted.length === 0) return null;

  const current = sorted[active];
  const gamesNum = current.jackpotType.split("/")[0];

  return (
    <div>
      <div className="text-sm text-green-500/80 font-medium mb-2">
        {site} MEGA Jackpot {gamesNum}
      </div>
      <div
        className="text-3xl md:text-4xl font-black tracking-tight"
        style={{
          backgroundImage: "linear-gradient(to right, #22c55e, #4ade80, #22c55e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {currencySign} {formatCurrency(current.prize)}
      </div>
      {sorted.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {sorted.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === active
                  ? "w-5 h-1.5 bg-green-500"
                  : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ───
const JackpotDetails: React.FC<JackpotDetailsProps> = ({
  jackpot,
  onSelectJackpot,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const handleCloseCalendar = useCallback(() => setShowCalendar(false), []);

  const handleSelectJackpot = useCallback(
    (jackpotId: string) => {
      setShowCalendar(false);
      onSelectJackpot?.(jackpotId);
    },
    [onSelectJackpot]
  );

  return (
    <div className="border-b border-border">
      <div
        className="p-px"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.05), rgba(34,197,94,0.15))",
        }}
      >
        <div className="bg-card p-5 text-center">
          <div className="relative mb-4">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-green-500 transition-colors tracking-wider cursor-pointer border-b border-dashed border-border pb-0.5"
            >
              <Calendar className="w-2.5 h-2.5" />
              {formatShortDate(jackpot.finished)} –{" "}
              {formatShortDate(
                jackpot.events[0]?.kickoffTime || jackpot.finished
              )}{" "}
              · #{jackpot.jackpotHumanId}
            </button>
            {showCalendar && (
              <JackpotCalendar
                currentJackpotId={jackpot._id}
                onSelectJackpot={handleSelectJackpot}
                onClose={handleCloseCalendar}
              />
            )}
          </div>
          <PrizeCarousel
            prizes={jackpot.prizes}
            currencySign={jackpot.currencySign}
            site={jackpot.site}
          />
        </div>
      </div>
    </div>
  );
};

export default JackpotDetails;
