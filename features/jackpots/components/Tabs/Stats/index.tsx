"use client";

import React from 'react';
import { Loader2, TrendingUp, Trophy } from 'lucide-react';
import BellCurve from './BellCurve';
import type { Jackpot, Prediction, Statistics } from '../../../types';
import { formatCurrency } from '../../../utils/helpers';

interface StatsTabProps {
  jackpot: Jackpot;
  communityPredictions: Prediction[];
  stats?: Statistics | null;
  loading?: boolean;
}

const StatsTab: React.FC<StatsTabProps> = ({
  jackpot,
  communityPredictions,
  stats,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {stats && (
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Outcome Distribution</h3>
          </div>
          <BellCurve stats={stats} />
        </div>
      )}

      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Prize Breakdown</h3>
        </div>
        <div className="space-y-3">
          {jackpot.prizes.map((prize) => {
            const isGrand = prize.jackpotType === '17/17';
            return (
              <div 
                key={prize.jackpotType}
                className={`rounded-lg p-3 ${
                  isGrand 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30'
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`text-xs font-medium mb-0.5 ${isGrand ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                      {isGrand ? '🏆 JACKPOT WINNER' : `${prize.jackpotType} Correct`}
                    </div>
                    <div className={`text-base font-bold ${isGrand ? 'text-yellow-500' : 'text-foreground'}`}>
                      KSH {formatCurrency(prize.prize)}
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-center ${isGrand ? 'bg-yellow-500/20' : 'bg-background'}`}>
                    <div className={`text-base font-bold ${isGrand ? 'text-yellow-500' : 'text-foreground'}`}>
                      {prize.winners}
                    </div>
                    <div className={`text-[10px] ${isGrand ? 'text-yellow-500/70' : 'text-muted-foreground'}`}>
                      {prize.winners === 1 ? 'Winner' : 'Winners'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{jackpot.events.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Matches</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{communityPredictions.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Predictions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
