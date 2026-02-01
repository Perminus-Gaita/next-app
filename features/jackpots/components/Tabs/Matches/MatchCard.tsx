"use client";

import React from "react";
import { usePicksStore } from "@/lib/stores/picks-store";
import type { JackpotEvent, LocalPick } from "@/features/jackpots/types";

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
  isFinished = false 
}) => {
  const { picks, addPick } = usePicksStore();
  
  // Check if this event has a pick in the store
  const existingPick = picks.find((p) => p.eventNumber === event.eventNumber);
  const currentSelection = existingPick?.selection || prediction;

  const handlePickSelect = (pick: LocalPick) => {
    if (isFinished) return;
    
    const odds = 
      pick === "Home" ? event.odds.home :
      pick === "Draw" ? event.odds.draw :
      event.odds.away;

    // Add to Zustand store
    addPick({
      id: `${event.eventNumber}_${pick}`,
      eventNumber: event.eventNumber,
      homeTeam: event.competitorHome,
      awayTeam: event.competitorAway,
      selection: pick,
      odds: odds,
      competition: event.competition,
      kickoffTime: event.kickoffTime,
    });

    // Also call parent handler for local state sync if provided
    if (onSelect) {
      onSelect(event.eventNumber, pick);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-semibold text-muted-foreground">
          Match {event.eventNumber}
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {event.competition}
        </div>
      </div>

      {/* UPDATED: Horizontal team names layout */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-sm font-bold flex-1 text-right">{event.competitorHome}</div>
        <div className="text-xs text-muted-foreground px-2">vs</div>
        <div className="text-sm font-bold flex-1 text-left">{event.competitorAway}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {(["Home", "Draw", "Away"] as LocalPick[]).map((pick) => {
          const odds = 
            pick === "Home" ? event.odds.home :
            pick === "Draw" ? event.odds.draw :
            event.odds.away;
          const isSelected = currentSelection === pick;

          return (
            <button
              key={pick}
              onClick={() => handlePickSelect(pick)}
              disabled={isFinished}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              } ${isFinished ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="block text-xs mb-1">
                {pick === "Home" ? "1" : pick === "Draw" ? "X" : "2"}
              </span>
              <span className="text-base font-bold">{odds.toFixed(2)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-muted-foreground text-center">
        {new Date(event.kickoffTime).toLocaleString()}
      </div>
    </div>
  );
};

export default MatchCard;
