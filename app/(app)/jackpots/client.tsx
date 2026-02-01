"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import JackpotDetails from "@/features/jackpots/components/JackpotDetails";
import TabsHeader from "@/features/jackpots/components/TabsHeader";
import MatchesTab from "@/features/jackpots/components/Tabs/Matches";
import PredictionsTab from "@/features/jackpots/components/Tabs/Predictions";
import StatsTab from "@/features/jackpots/components/Tabs/Stats";
import CommentsTab from "@/features/jackpots/components/Tabs/Comments";
import type { 
  Jackpot, 
  Prediction, 
  Comment, 
  Statistics,
  TabType,
  LocalPicks,
  LocalPick 
} from "@/features/jackpots/types";

// ============================================
// DUMMY DATA
// ============================================
const DUMMY_JACKPOT: Jackpot = {
  _id: "jp001",
  jackpotHumanId: "12345",
  site: "SportPesa",
  totalPrizePool: 250000000,
  currencySign: "KSH",
  jackpotStatus: "Open", // Change to "Open" or "Finished" to test different states
  isLatest: true,
  finished: new Date("2026-01-25T10:00:00Z").toISOString(),
  bettingClosesAt: new Date("2026-01-26T10:00:00Z").toISOString(),
  finishedGames: 0, // Change to 10 to test "during" state, 17 for "after" state
  events: [
    {
      eventNumber: 1,
      competitorHome: "Arsenal",
      competitorAway: "Chelsea",
      odds: { home: 2.1, draw: 3.2, away: 3.8 },
      kickoffTime: new Date("2026-01-25T15:00:00Z").toISOString(),
      competition: "Premier League",
    },
    {
      eventNumber: 2,
      competitorHome: "Manchester United",
      competitorAway: "Liverpool",
      odds: { home: 2.5, draw: 3.1, away: 2.9 },
      kickoffTime: new Date("2026-01-25T17:00:00Z").toISOString(),
      competition: "Premier League",
    },
    {
      eventNumber: 3,
      competitorHome: "Barcelona",
      competitorAway: "Real Madrid",
      odds: { home: 2.3, draw: 3.0, away: 3.2 },
      kickoffTime: new Date("2026-01-25T19:00:00Z").toISOString(),
      competition: "La Liga",
    },
    {
      eventNumber: 4,
      competitorHome: "Bayern Munich",
      competitorAway: "Borussia Dortmund",
      odds: { home: 1.9, draw: 3.5, away: 4.2 },
      kickoffTime: new Date("2026-01-25T21:00:00Z").toISOString(),
      competition: "Bundesliga",
    },
    {
      eventNumber: 5,
      competitorHome: "Juventus",
      competitorAway: "AC Milan",
      odds: { home: 2.2, draw: 3.0, away: 3.5 },
      kickoffTime: new Date("2026-01-26T15:00:00Z").toISOString(),
      competition: "Serie A",
    },
    {
      eventNumber: 6,
      competitorHome: "PSG",
      competitorAway: "Marseille",
      odds: { home: 1.8, draw: 3.4, away: 4.5 },
      kickoffTime: new Date("2026-01-26T17:00:00Z").toISOString(),
      competition: "Ligue 1",
    },
    {
      eventNumber: 7,
      competitorHome: "Inter Milan",
      competitorAway: "Napoli",
      odds: { home: 2.4, draw: 3.1, away: 3.0 },
      kickoffTime: new Date("2026-01-26T19:00:00Z").toISOString(),
      competition: "Serie A",
    },
    {
      eventNumber: 8,
      competitorHome: "Ajax",
      competitorAway: "PSV",
      odds: { home: 2.1, draw: 3.3, away: 3.6 },
      kickoffTime: new Date("2026-01-26T21:00:00Z").toISOString(),
      competition: "Eredivisie",
    },
    {
      eventNumber: 9,
      competitorHome: "Benfica",
      competitorAway: "Porto",
      odds: { home: 2.3, draw: 3.2, away: 3.1 },
      kickoffTime: new Date("2026-01-27T15:00:00Z").toISOString(),
      competition: "Primeira Liga",
    },
    {
      eventNumber: 10,
      competitorHome: "Celtic",
      competitorAway: "Rangers",
      odds: { home: 2.2, draw: 3.0, away: 3.5 },
      kickoffTime: new Date("2026-01-27T17:00:00Z").toISOString(),
      competition: "Scottish Premiership",
    },
    {
      eventNumber: 11,
      competitorHome: "Sevilla",
      competitorAway: "Athletic Bilbao",
      odds: { home: 2.0, draw: 3.1, away: 3.9 },
      kickoffTime: new Date("2026-01-27T19:00:00Z").toISOString(),
      competition: "La Liga",
    },
    {
      eventNumber: 12,
      competitorHome: "Dortmund",
      competitorAway: "Leipzig",
      odds: { home: 2.3, draw: 3.2, away: 3.3 },
      kickoffTime: new Date("2026-01-27T21:00:00Z").toISOString(),
      competition: "Bundesliga",
    },
    {
      eventNumber: 13,
      competitorHome: "Lyon",
      competitorAway: "Monaco",
      odds: { home: 2.4, draw: 3.1, away: 3.0 },
      kickoffTime: new Date("2026-01-28T15:00:00Z").toISOString(),
      competition: "Ligue 1",
    },
    {
      eventNumber: 14,
      competitorHome: "Roma",
      competitorAway: "Lazio",
      odds: { home: 2.5, draw: 3.0, away: 2.9 },
      kickoffTime: new Date("2026-01-28T17:00:00Z").toISOString(),
      competition: "Serie A",
    },
    {
      eventNumber: 15,
      competitorHome: "Atletico Madrid",
      competitorAway: "Villarreal",
      odds: { home: 1.9, draw: 3.4, away: 4.0 },
      kickoffTime: new Date("2026-01-28T19:00:00Z").toISOString(),
      competition: "La Liga",
    },
    {
      eventNumber: 16,
      competitorHome: "Leverkusen",
      competitorAway: "Frankfurt",
      odds: { home: 2.1, draw: 3.3, away: 3.5 },
      kickoffTime: new Date("2026-01-28T21:00:00Z").toISOString(),
      competition: "Bundesliga",
    },
    {
      eventNumber: 17,
      competitorHome: "Nice",
      competitorAway: "Lille",
      odds: { home: 2.2, draw: 3.1, away: 3.4 },
      kickoffTime: new Date("2026-01-29T15:00:00Z").toISOString(),
      competition: "Ligue 1",
    },
  ],
  prizes: [
    { jackpotType: "17/17", prize: 150000000, winners: 0 },
    { jackpotType: "16/17", prize: 50000000, winners: 2 },
    { jackpotType: "15/17", prize: 25000000, winners: 15 },
    { jackpotType: "14/17", prize: 10000000, winners: 45 },
    { jackpotType: "13/17", prize: 5000000, winners: 120 },
  ],
};

const DUMMY_PREDICTIONS: Prediction[] = [
  {
    _id: "pred1",
    jackpotId: "jp001",
    userId: "user1",
    username: "JohnDoe",
    picks: [
      { gameNumber: 1, pick: "1" },
      { gameNumber: 2, pick: "X" },
      { gameNumber: 3, pick: "2" },
      { gameNumber: 4, pick: "1" },
      { gameNumber: 5, pick: "X" },
      { gameNumber: 6, pick: "2" },
      { gameNumber: 7, pick: "1" },
      { gameNumber: 8, pick: "X" },
      { gameNumber: 9, pick: "2" },
      { gameNumber: 10, pick: "1" },
      { gameNumber: 11, pick: "X" },
      { gameNumber: 12, pick: "2" },
      { gameNumber: 13, pick: "1" },
      { gameNumber: 14, pick: "X" },
      { gameNumber: 15, pick: "2" },
      { gameNumber: 16, pick: "1" },
      { gameNumber: 17, pick: "X" },
    ],
    score: 14,
    createdAt: new Date("2026-01-24T10:30:00Z").toISOString(),
    updatedAt: new Date("2026-01-24T10:30:00Z").toISOString(),
  },
  {
    _id: "pred2",
    jackpotId: "jp001",
    userId: "user1",
    username: "JohnDoe",
    picks: [
      { gameNumber: 1, pick: "X" },
      { gameNumber: 2, pick: "1" },
      { gameNumber: 3, pick: "1" },
      { gameNumber: 4, pick: "2" },
      { gameNumber: 5, pick: "1" },
      { gameNumber: 6, pick: "X" },
      { gameNumber: 7, pick: "2" },
      { gameNumber: 8, pick: "1" },
      { gameNumber: 9, pick: "X" },
      { gameNumber: 10, pick: "2" },
      { gameNumber: 11, pick: "1" },
      { gameNumber: 12, pick: "X" },
      { gameNumber: 13, pick: "2" },
      { gameNumber: 14, pick: "1" },
      { gameNumber: 15, pick: "X" },
      { gameNumber: 16, pick: "2" },
      { gameNumber: 17, pick: "1" },
    ],
    score: 11,
    createdAt: new Date("2026-01-24T14:15:00Z").toISOString(),
    updatedAt: new Date("2026-01-24T14:15:00Z").toISOString(),
  },
  {
    _id: "pred3",
    jackpotId: "jp001",
    userId: "user1",
    username: "JohnDoe",
    picks: [
      { gameNumber: 1, pick: "2" },
      { gameNumber: 2, pick: "2" },
      { gameNumber: 3, pick: "X" },
      { gameNumber: 4, pick: "X" },
      { gameNumber: 5, pick: "2" },
      { gameNumber: 6, pick: "1" },
      { gameNumber: 7, pick: "X" },
      { gameNumber: 8, pick: "2" },
      { gameNumber: 9, pick: "1" },
      { gameNumber: 10, pick: "X" },
      { gameNumber: 11, pick: "2" },
      { gameNumber: 12, pick: "1" },
      { gameNumber: 13, pick: "X" },
      { gameNumber: 14, pick: "2" },
      { gameNumber: 15, pick: "1" },
      { gameNumber: 16, pick: "X" },
      { gameNumber: 17, pick: "2" },
    ],
    score: 17, // WINNER!
    createdAt: new Date("2026-01-25T08:00:00Z").toISOString(),
    updatedAt: new Date("2026-01-25T08:00:00Z").toISOString(),
  },
  {
    _id: "pred4",
    jackpotId: "jp001",
    userId: "user2",
    username: "JaneSmith",
    picks: [
      { gameNumber: 1, pick: "1" },
      { gameNumber: 2, pick: "1" },
      { gameNumber: 3, pick: "1" },
      { gameNumber: 4, pick: "1" },
      { gameNumber: 5, pick: "1" },
      { gameNumber: 6, pick: "1" },
      { gameNumber: 7, pick: "1" },
      { gameNumber: 8, pick: "1" },
      { gameNumber: 9, pick: "1" },
      { gameNumber: 10, pick: "1" },
      { gameNumber: 11, pick: "1" },
      { gameNumber: 12, pick: "1" },
      { gameNumber: 13, pick: "1" },
      { gameNumber: 14, pick: "1" },
      { gameNumber: 15, pick: "1" },
      { gameNumber: 16, pick: "1" },
      { gameNumber: 17, pick: "1" },
    ],
    score: 13, // BONUS ZONE!
    createdAt: new Date("2026-01-24T11:00:00Z").toISOString(),
    updatedAt: new Date("2026-01-24T11:00:00Z").toISOString(),
  },
  {
    _id: "pred5",
    jackpotId: "jp001",
    userId: "user2",
    username: "JaneSmith",
    picks: [
      { gameNumber: 1, pick: "X" },
      { gameNumber: 2, pick: "X" },
      { gameNumber: 3, pick: "X" },
      { gameNumber: 4, pick: "X" },
      { gameNumber: 5, pick: "X" },
      { gameNumber: 6, pick: "X" },
      { gameNumber: 7, pick: "X" },
      { gameNumber: 8, pick: "X" },
      { gameNumber: 9, pick: "X" },
      { gameNumber: 10, pick: "X" },
      { gameNumber: 11, pick: "X" },
      { gameNumber: 12, pick: "X" },
      { gameNumber: 13, pick: "X" },
      { gameNumber: 14, pick: "X" },
      { gameNumber: 15, pick: "X" },
      { gameNumber: 16, pick: "X" },
      { gameNumber: 17, pick: "X" },
    ],
    score: 9,
    createdAt: new Date("2026-01-24T16:30:00Z").toISOString(),
    updatedAt: new Date("2026-01-24T16:30:00Z").toISOString(),
  },
  {
    _id: "pred6",
    jackpotId: "jp001",
    userId: "user3",
    username: "MikeJones",
    picks: [
      { gameNumber: 1, pick: "2" },
      { gameNumber: 2, pick: "X" },
      { gameNumber: 3, pick: "1" },
      { gameNumber: 4, pick: "2" },
      { gameNumber: 5, pick: "X" },
      { gameNumber: 6, pick: "1" },
      { gameNumber: 7, pick: "2" },
      { gameNumber: 8, pick: "X" },
      { gameNumber: 9, pick: "1" },
      { gameNumber: 10, pick: "2" },
      { gameNumber: 11, pick: "X" },
      { gameNumber: 12, pick: "1" },
      { gameNumber: 13, pick: "2" },
      { gameNumber: 14, pick: "X" },
      { gameNumber: 15, pick: "1" },
      { gameNumber: 16, pick: "2" },
      { gameNumber: 17, pick: "X" },
    ],
    score: 15, // BONUS ZONE!
    createdAt: new Date("2026-01-25T09:45:00Z").toISOString(),
    updatedAt: new Date("2026-01-25T09:45:00Z").toISOString(),
  },
];

const DUMMY_COMMENTS: Comment[] = [
  {
    _id: "com1",
    jackpotId: "jp001",
    userId: "user1",
    username: "JohnDoe",
    text: "Arsenal are looking strong this season! Going with them.",
    createdAt: new Date("2026-01-24T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-01-24T12:00:00Z").toISOString(),
  },
  {
    _id: "com2",
    jackpotId: "jp001",
    userId: "user3",
    username: "MikeJones",
    text: "The El Clasico will be a draw, I can feel it!",
    createdAt: new Date("2026-01-24T11:00:00Z").toISOString(),
    updatedAt: new Date("2026-01-24T11:00:00Z").toISOString(),
  },
  {
    _id: "com3",
    jackpotId: "jp001",
    userId: "user2",
    username: "JaneSmith",
    text: "Bayern are unstoppable at home. Easy win for them.",
    createdAt: new Date("2026-01-24T09:30:00Z").toISOString(),
    updatedAt: new Date("2026-01-24T09:30:00Z").toISOString(),
  },
];

const DUMMY_STATS: Statistics = {
  homeWins: 8,
  draws: 4,
  awayWins: 5,
  averageHomeOdds: 2.1,
  averageDrawOdds: 3.2,
  averageAwayOdds: 3.4,
  totalMatches: 17,
};

// ============================================
// COMPONENTS
// ============================================

const JackpotSkeleton = () => (
  <div className="min-h-screen">
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
      <div className="p-4 border-b border-border">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="flex gap-4 mt-4">
            <div className="h-16 bg-muted rounded flex-1" />
            <div className="h-16 bg-muted rounded flex-1" />
          </div>
        </div>
      </div>
      <div className="flex border-b border-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 py-4 flex justify-center">
            <div className="h-4 bg-muted rounded w-16 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

interface JackpotErrorProps {
  error: string | null;
  onRetry: () => void;
}

const JackpotError: React.FC<JackpotErrorProps> = ({ error, onRetry }) => (
  <div className="min-h-screen">
    <div className="max-w-2xl mx-auto border-x border-border min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Failed to load jackpot
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {error || "Something went wrong. Please try again."}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function JackpotsClient() {
  const [activeTab, setActiveTab] = useState<TabType>("matches");
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [jackpot] = useState<Jackpot>(DUMMY_JACKPOT);
  const [predictions] = useState<Prediction[]>(DUMMY_PREDICTIONS);
  const [comments, setComments] = useState<Comment[]>(DUMMY_COMMENTS);
  const [stats] = useState<Statistics>(DUMMY_STATS);
  const [localPicks, setLocalPicks] = useState<LocalPicks>({});

  const userPicks: LocalPicks = localPicks;

  const handlePickSelect = (eventNumber: number, pick: LocalPick) => {
    setLocalPicks((prev) => ({
      ...prev,
      [eventNumber]: pick,
    }));
  };

  const handleSavePrediction = () => {
    console.log("Saving prediction:", localPicks);
    alert("Prediction saved! (This is dummy data)");
    setLocalPicks({});
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      _id: `com_${Date.now()}`,
      jackpotId: jackpot._id,
      userId: "currentUser",
      username: "You",
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setComments([newComment, ...comments]);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c._id !== commentId));
  };

  const hasUnsavedPicks = Object.keys(localPicks).length > 0;

  if (loading) {
    return <JackpotSkeleton />;
  }

  if (error || !jackpot) {
    return <JackpotError error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto border-x border-border min-h-screen">
        <JackpotDetails jackpot={jackpot} />
        <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="animate-in fade-in duration-200">
          {activeTab === "matches" && (
            <MatchesTab
              events={jackpot.events}
              predictions={userPicks}
              onSelect={handlePickSelect}
              hasUnsavedPicks={hasUnsavedPicks}
              onSavePrediction={handleSavePrediction}
              isSaving={false}
              jackpotStatus={jackpot.jackpotStatus}
            />
          )}

          {activeTab === "predictions" && (
            <PredictionsTab
              predictions={predictions}
              jackpot={jackpot}
              loading={false}
            />
          )}

          {activeTab === "stats" && (
            <StatsTab
              jackpot={jackpot}
              communityPredictions={predictions}
              stats={stats}
              loading={false}
            />
          )}

          {activeTab === "comments" && (
            <CommentsTab
              comments={comments}
              loading={false}
              submitting={false}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              currentUserId="currentUser"
            />
          )}
        </div>
      </div>
    </div>
  );
}
