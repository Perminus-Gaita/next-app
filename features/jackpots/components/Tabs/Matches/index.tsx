"use client";

import React from 'react';
import MatchCard from './MatchCard';
import type { JackpotEvent, LocalPicks, LocalPick } from '../../../types';

interface MatchesTabProps {
  events: JackpotEvent[];
  predictions?: LocalPicks;
  onSelect?: (eventNumber: number, pick: LocalPick) => void;
  jackpotStatus?: string;
}

const MatchesTab: React.FC<MatchesTabProps> = ({
  events,
  predictions = {},
  onSelect,
  jackpotStatus = 'Open',
}) => {
  const isFinished = jackpotStatus === 'Finished' || jackpotStatus === 'Closed';

  return (
    <div>
      {events.map((event, idx) => {
        const isLast = idx === events.length - 1;
        return (
          <div key={event.eventNumber} className={`${!isLast ? 'border-b border-border' : ''}`}>
            <MatchCard
              event={event}
              prediction={predictions[event.eventNumber]}
              onSelect={onSelect}
              isFinished={isFinished}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MatchesTab;
