"use client";

import React from 'react';
import { formatDate } from '../utils/helpers';
import type { Jackpot } from '../types';

interface JackpotDetailsProps {
  jackpot: Jackpot;
}

const JackpotDetails: React.FC<JackpotDetailsProps> = ({ jackpot }) => {
  const isOpen = jackpot.jackpotStatus === 'Open';
  
  const formatFullAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE').format(Math.round(amount));
  };

  return (
    <div className="p-4 border-y border-border">
      <div className="text-xs text-muted-foreground mb-3 text-center">
        Jackpot #{jackpot.jackpotHumanId} • {formatDate(jackpot.finished)}
      </div>

      <div className="bg-gradient-to-br from-green-500/15 to-green-600/5 border border-green-500/30 rounded-xl p-6 text-center">
        <div className="text-sm text-green-500/80 font-medium mb-2">
          {jackpot.site} MEGA Jackpot Pro {jackpot.events.length}
        </div>

        <div className="text-2xl md:text-3xl font-bold text-green-500">
          {jackpot.currencySign} {formatFullAmount(jackpot.totalPrizePool)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap mt-3">
        <span
          className={`px-3 py-1 rounded text-xs font-semibold ${
            isOpen
              ? 'bg-green-500/20 text-green-500'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {jackpot.jackpotStatus.toUpperCase()}
        </span>
        {jackpot.isLatest && (
          <span className="bg-primary/20 text-primary px-3 py-1 rounded text-xs font-semibold">
            LATEST
          </span>
        )}
      </div>
    </div>
  );
};

export default JackpotDetails;
