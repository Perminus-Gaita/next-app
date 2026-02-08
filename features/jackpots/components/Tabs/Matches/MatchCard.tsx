"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AtSign } from "lucide-react";
import { usePicksStore } from "@/lib/stores/picks-store";
import type { JackpotEvent, LocalPick } from "@/features/jackpots/types";

interface MatchCardProps {
  event: JackpotEvent;
  jackpotId: string;
  onSelect?: (eventNumber: number, pick: LocalPick) => void;
  isFinished?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  event,
  jackpotId,
  onSelect,
  isFinished = false,
}) => {
  const router = useRouter();
  const { picks, addPick, removePickByEvent } = usePicksStore();

  const existingPick = picks.find((p) => p.eventNumber === event.eventNumber);
  const currentSelection = existingPick?.selection || undefined;

  const handlePickSelect = (pick: LocalPick, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFinished) return;

    // Toggle: if same pick is already selected, unselect it
    if (currentSelection === pick) {
      removePickByEvent(event.eventNumber);
      if (onSelect) onSelect(event.eventNumber, pick);
      return;
    }

    const odds =
      pick === "Home" ? event.odds.home :
      pick === "Draw" ? event.odds.draw :
      event.odds.away;

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

    if (onSelect) onSelect(event.eventNumber, pick);
  };

  const h2hUrl = `/h2h/${jackpotId}/${event.eventNumber}`;

  const handleCardClick = () => {
    router.push(h2hUrl);
  };

  const pickOptions: LocalPick[] = ["Home", "Draw", "Away"];

  return (
    <div
      onClick={handleCardClick}
      className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-colors relative"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-semibold text-muted-foreground">
          Match {event.eventNumber}
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {event.competition}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-sm font-bold flex-1 text-right">{event.competitorHome}</div>
        <div className="text-xs text-muted-foreground px-2">vs</div>
        <div className="text-sm font-bold flex-1 text-left">{event.competitorAway}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {pickOptions.map((pick) => {
          const odds =
            pick === "Home" ? event.odds.home :
            pick === "Draw" ? event.odds.draw :
            event.odds.away;
          const isSelected = currentSelection === pick;

          return (
            <button
              key={pick}
              onClick={(e) => handlePickSelect(pick, e)}
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

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {new Date(event.kickoffTime).toLocaleString()}
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            router.push(h2hUrl);
          }}
          className="flex items-center gap-0.5 text-xs text-primary hover:text-primary/80 cursor-pointer transition-colors"
        >
          <AtSign className="w-3 h-3" />
          <span className="font-semibold">h2h</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
