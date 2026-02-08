"use client";

import React from 'react';
import MatchCard from './MatchCard';
import type { JackpotEvent, LocalPick } from '../../../types';

interface MatchesTabProps {
  events: JackpotEvent[];
  jackpotId: string;
  onSelect?: (eventNumber: number, pick: LocalPick) => void;
  jackpotStatus?: string;
}

const MatchesTab: React.FC<MatchesTabProps> = ({
  events,
  jackpotId,
  onSelect,
  jackpotStatus = 'Open',
}) => {
  const isFinished = jackpotStatus === 'Finished' || jackpotStatus === 'Closed';

  return (
    <div className="p-4 space-y-4">
      {events.map((event) => (
        <MatchCard
          key={event.eventNumber}
          event={event}
          jackpotId={jackpotId}
          onSelect={onSelect}
          isFinished={isFinished}
        />
      ))}
    </div>
  );
};

export default MatchesTab;
