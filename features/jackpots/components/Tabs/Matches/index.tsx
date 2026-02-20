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

const MatchesTab: React.FC<MatchesTabProps> = ({ events, jackpotId, onSelect, jackpotStatus = 'Open' }) => {
  const isFinished = jackpotStatus === 'Finished' || jackpotStatus === 'Closed';
  return (
    <div>
      {events.map((event, index) => (
        <MatchCard key={event.eventNumber} event={event} jackpotId={jackpotId} onSelect={onSelect} isFinished={isFinished} isLast={index === events.length - 1} />
      ))}
    </div>
  );
};

export default MatchesTab;
