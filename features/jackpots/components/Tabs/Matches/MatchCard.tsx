"use client";

import React from 'react';
import type { JackpotEvent, LocalPick } from '../../../types';

interface MatchCardProps {
  event: JackpotEvent;
  prediction?: LocalPick;
  onSelect?: (eventNumber: number, pick: LocalPick) => void;
  isFinished?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  event,
  prediction,
  onSelect,
  isFinished = false,
}) => {
  const getButtonStyle = (pick: LocalPick) => {
    const isSelected = prediction === pick;
    const baseStyle = "flex flex-col items-center justify-center p-2 rounded-lg transition-all";

    if (isFinished) {
      if (event.result) {
        const resultMap: Record<'1' | 'X' | '2', LocalPick> = {
          '1': 'Home',
          'X': 'Draw',
          '2': 'Away'
        };
        const correctPick = resultMap[event.result];
        if (pick === correctPick) {
          return `${baseStyle} bg-green-500/20 border-2 border-green-500 text-green-500`;
        }
      }
      return `${baseStyle} bg-muted/50 text-muted-foreground cursor-not-allowed`;
    }

    if (isSelected) {
      return `${baseStyle} bg-primary text-primary-foreground border-2 border-primary`;
    }

    return `${baseStyle} bg-muted hover:bg-muted/70 text-foreground border-2 border-transparent`;
  };

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="bg-primary/15 text-primary px-2 py-1 rounded text-xs font-semibold">
          #{event.eventNumber}
        </span>
        <span className="text-xs text-muted-foreground">{event.competition}</span>
      </div>

      {/* Team names - horizontal */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <div className="text-sm font-semibold text-foreground text-right flex-1">
          {event.competitorHome}
        </div>
        <div className="text-xs text-muted-foreground px-2">vs</div>
        <div className="text-sm font-semibold text-foreground text-left flex-1">
          {event.competitorAway}
        </div>
      </div>

      {isFinished && event.score && (
        <div className="mb-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">Final Score</div>
          <div className="text-lg font-bold text-primary">
            {event.score.home} - {event.score.away}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {(['Home', 'Draw', 'Away'] as LocalPick[]).map((pick) => {
          const odds = event.odds[pick.toLowerCase() as keyof typeof event.odds] || '-';
          return (
            <button
              key={pick}
              onClick={() => !isFinished && onSelect?.(event.eventNumber, pick)}
              disabled={isFinished}
              className={getButtonStyle(pick)}
            >
              <span className="text-xs font-medium uppercase opacity-70">
                {pick === 'Home' ? '1' : pick === 'Draw' ? 'X' : '2'}
              </span>
              <span className="text-base font-bold">{odds}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-muted-foreground text-center" suppressHydrationWarning>
        {new Date(event.kickoffTime).toLocaleString()}
      </div>
    </div>
  );
};

export default MatchCard;
