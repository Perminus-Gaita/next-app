"use client";

import React, { useState, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { formatShortDate, getJackpotDateRange, formatCurrency } from '../utils/helpers';
import MiniCalendar from './MiniCalendar';
import type { Jackpot } from '../types';

interface JackpotDetailsProps {
  jackpot: Jackpot;
}

const JackpotDetails: React.FC<JackpotDetailsProps> = ({ jackpot }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const { start, end } = getJackpotDateRange(jackpot);
  const handleCloseCalendar = useCallback(() => setShowCalendar(false), []);

  return (
    <div className="border-b border-border">
      <div className="p-px" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.05), rgba(34,197,94,0.15))' }}>
        <div className="bg-card p-5 text-center">
          <div className="relative mb-4">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-green-500 transition-colors tracking-wider cursor-pointer border-b border-dashed border-border pb-0.5"
            >
              <Calendar className="w-2.5 h-2.5" />
              {formatShortDate(jackpot.finished)} – {formatShortDate(jackpot.events[0]?.kickoffTime || jackpot.finished)} · #{jackpot.jackpotHumanId}
            </button>
            {showCalendar && <MiniCalendar start={start} end={end} onClose={handleCloseCalendar} status={jackpot.jackpotStatus} isLatest={jackpot.isLatest} />}
          </div>
          <div className="text-sm text-green-500/80 font-medium mb-2">
            {jackpot.site} MEGA Jackpot Pro {jackpot.events.length}
          </div>
          <div className="text-3xl md:text-4xl font-black tracking-tight" style={{
            backgroundImage: 'linear-gradient(to right, #22c55e, #4ade80, #22c55e)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {jackpot.currencySign} {formatCurrency(jackpot.totalPrizePool)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JackpotDetails;
