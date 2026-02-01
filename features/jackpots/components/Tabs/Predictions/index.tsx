"use client";

import React, { useState, useMemo } from 'react';
import { Loader2, Lock, EyeOff, Trophy, Sparkles, User, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Prediction, Jackpot } from '../../../types';

interface PredictionsTabProps {
  predictions: Prediction[];
  jackpot: Jackpot;
  loading?: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const groupPredictionsByUser = (predictions: Prediction[]) => {
  const grouped = predictions.reduce((acc, pred) => {
    if (!acc[pred.userId]) {
      acc[pred.userId] = {
        userId: pred.userId,
        username: pred.username || 'Anonymous',
        predictions: []
      };
    }
    acc[pred.userId].predictions.push(pred);
    return acc;
  }, {} as Record<string, { userId: string; username: string; predictions: Prediction[] }>);

  return Object.values(grouped);
};

const PredictionsTab: React.FC<PredictionsTabProps> = ({
  predictions,
  jackpot,
  loading = false,
}) => {
  const [currentPredictionIndex, setCurrentPredictionIndex] = useState<Record<string, number>>({});

  const jackpotStatus = jackpot.jackpotStatus;
  const finishedGames = jackpot.finishedGames || 0;
  const totalGames = jackpot.events.length;
  
  const isBeforeStart = jackpotStatus === 'Open' && finishedGames === 0;
  const isDuring = jackpotStatus === 'Open' && finishedGames > 0 && finishedGames < totalGames;
  const isAfter = jackpotStatus === 'Finished' || finishedGames === totalGames;

  const userPredictions = useMemo(() => groupPredictionsByUser(predictions), [predictions]);

  const sortedPredictions = useMemo(() => {
    if (!isAfter) return [];
    return predictions
      .map(pred => ({
        ...pred,
        userPredictions: userPredictions.find(up => up.userId === pred.userId)
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [predictions, userPredictions, isAfter]);

  const sortedUserPredictions = useMemo(() => {
    if (!isDuring) return userPredictions;
    return [...userPredictions].sort((a, b) => {
      const aBest = Math.max(...a.predictions.map(p => p.score || 0));
      const bBest = Math.max(...b.predictions.map(p => p.score || 0));
      return bBest - aBest;
    });
  }, [userPredictions, isDuring]);

  const getCurrentIndex = (userId: string) => currentPredictionIndex[userId] || 0;

  const navigatePrediction = (userId: string, direction: 'prev' | 'next') => {
    const user = userPredictions.find(u => u.userId === userId);
    if (!user) return;
    
    const currentIdx = getCurrentIndex(userId);
    const totalPredictions = user.predictions.length;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIdx + 1) % totalPredictions;
    } else {
      newIndex = currentIdx === 0 ? totalPredictions - 1 : currentIdx - 1;
    }

    setCurrentPredictionIndex(prev => ({
      ...prev,
      [userId]: newIndex
    }));
  };

  const getResultBadge = (correctPicks: number, totalGames: number) => {
    if (correctPicks === totalGames) {
      return { 
        type: 'winner',
        bg: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20', 
        text: 'text-yellow-500', 
        border: 'border-yellow-500',
        label: '🏆 JACKPOT WINNER!',
      };
    }
    if (correctPicks >= 13 && correctPicks <= 17) {
      return { 
        type: 'bonus',
        bg: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20', 
        text: 'text-purple-500', 
        border: 'border-purple-500',
        label: '✨ BONUS ZONE',
      };
    }
    return { 
      type: 'regular',
      bg: '', 
      text: 'text-muted-foreground', 
      border: 'border-border',
      label: null,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="text-muted-foreground mb-2">No predictions yet</div>
        <div className="text-sm text-muted-foreground">
          Be the first to make a prediction!
        </div>
      </div>
    );
  }

  // =========================================================================
  // UI 1: BEFORE JACKPOT STARTS
  // =========================================================================
  if (isBeforeStart) {
    return (
      <div>
        {userPredictions.map((user, idx) => {
          const currentIdx = getCurrentIndex(user.userId);
          const currentPrediction = user.predictions[currentIdx];
          const totalPredictions = user.predictions.length;
          const isLast = idx === userPredictions.length - 1;

          return (
            <div 
              key={user.userId} 
              className={`px-4 py-4 ${!isLast ? 'border-b border-border' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{user.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(currentPrediction.createdAt)}
                    </div>
                  </div>
                </div>

                {totalPredictions > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigatePrediction(user.userId, 'prev')}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <span className="text-xs text-muted-foreground font-medium">
                      {currentIdx + 1} of {totalPredictions}
                    </span>
                    <button
                      onClick={() => navigatePrediction(user.userId, 'next')}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="flex flex-wrap gap-1.5 blur-sm select-none pointer-events-none">
                  {currentPrediction.picks.map((pick) => (
                    <div
                      key={pick.gameNumber}
                      className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1"
                    >
                      <span className="text-xs text-muted-foreground">#{pick.gameNumber}</span>
                      <span className="text-sm font-bold text-foreground">{pick.pick}</span>
                    </div>
                  ))}
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <EyeOff className="w-5 h-5" />
                    <span className="text-sm font-medium">Hidden until jackpot starts</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // =========================================================================
  // UI 2: DURING JACKPOT
  // =========================================================================
  if (isDuring) {
    return (
      <div>
        {sortedUserPredictions.map((user, idx) => {
          const currentIdx = getCurrentIndex(user.userId);
          const currentPrediction = user.predictions[currentIdx];
          const totalPredictions = user.predictions.length;
          const isLast = idx === sortedUserPredictions.length - 1;
          
          const currentScore = currentPrediction.score || 0;
          const accuracy = finishedGames > 0 ? Math.round((currentScore / finishedGames) * 100) : 0;
          const rank = idx + 1;

          return (
            <div 
              key={user.userId} 
              className={`px-4 py-4 ${!isLast ? 'border-b border-border' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">#{rank}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{user.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(currentPrediction.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-500">
                      {currentScore}/{finishedGames}
                    </div>
                    <div className="text-xs text-muted-foreground">{accuracy}%</div>
                  </div>

                  {totalPredictions > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigatePrediction(user.userId, 'prev')}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <ChevronLeft className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <span className="text-xs text-muted-foreground font-medium min-w-[3rem] text-center">
                        {currentIdx + 1} of {totalPredictions}
                      </span>
                      <button
                        onClick={() => navigatePrediction(user.userId, 'next')}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs font-semibold text-green-500 mb-1.5">
                    Finished Games ({finishedGames})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPrediction.picks.slice(0, finishedGames).map((pick) => (
                      <div
                        key={pick.gameNumber}
                        className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded px-2 py-1"
                      >
                        <span className="text-xs text-primary">#{pick.gameNumber}</span>
                        <span className="text-sm font-bold text-primary">{pick.pick}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {currentPrediction.picks.length > finishedGames && (
                  <div className="relative">
                    <div className="text-xs font-semibold text-muted-foreground mb-1.5">
                      Remaining Games ({currentPrediction.picks.length - finishedGames})
                    </div>
                    <div className="flex flex-wrap gap-1.5 blur-sm select-none pointer-events-none opacity-50">
                      {currentPrediction.picks.slice(finishedGames).map((pick) => (
                        <div
                          key={pick.gameNumber}
                          className="flex items-center gap-1 bg-muted/50 rounded px-2 py-1"
                        >
                          <span className="text-xs text-muted-foreground">#{pick.gameNumber}</span>
                          <span className="text-sm font-bold text-foreground">{pick.pick}</span>
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[2px] rounded">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs font-medium">Revealed after games end</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // =========================================================================
  // UI 3: AFTER JACKPOT ENDS
  // =========================================================================
  if (isAfter) {
    return (
      <div>
        {sortedPredictions.map((prediction, index) => {
          const rank = index + 1;
          const badge = getResultBadge(prediction.score || 0, totalGames);
          const accuracy = Math.round(((prediction.score || 0) / totalGames) * 100);
          const isLast = index === sortedPredictions.length - 1;
          
          const userPreds = prediction.userPredictions;
          const predictionNumber = userPreds?.predictions.findIndex(p => p._id === prediction._id) + 1 || 1;
          const totalUserPredictions = userPreds?.predictions.length || 1;

          return (
            <div 
              key={prediction._id} 
              className={`px-4 py-4 ${badge.bg} ${!isLast ? `border-b-2 ${badge.border}` : ''}`}
            >
              {badge.label && (
                <div className={`${badge.text} text-center py-2 mb-3 font-bold text-sm flex items-center justify-center gap-2`}>
                  {badge.type === 'winner' && <Trophy className="w-4 h-4" />}
                  {badge.type === 'bonus' && <Sparkles className="w-4 h-4" />}
                  {badge.label}
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`${badge.type === 'winner' ? 'bg-yellow-500/30 border-2 border-yellow-500' : 'bg-primary/20'} w-10 h-10 rounded-full flex items-center justify-center`}>
                    {badge.type === 'winner' ? (
                      <span className="text-xl">👑</span>
                    ) : (
                      <span className="text-sm font-bold text-primary">#{rank}</span>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-foreground">{prediction.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(prediction.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${badge.type === 'winner' ? 'text-yellow-500' : 'text-green-500'}`}>
                      {prediction.score}/{totalGames}
                    </div>
                    <div className={`text-xs font-semibold ${
                      accuracy >= 80 ? 'text-green-500' : 
                      accuracy >= 60 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {accuracy}%
                    </div>
                  </div>

                  {totalUserPredictions > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigatePrediction(prediction.userId, 'prev')}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <ChevronLeft className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <span className="text-xs text-muted-foreground font-medium min-w-[3rem] text-center">
                        {predictionNumber} of {totalUserPredictions}
                      </span>
                      <button
                        onClick={() => navigatePrediction(prediction.userId, 'next')}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {prediction.picks.map((pick) => (
                  <div
                    key={pick.gameNumber}
                    className={`flex items-center gap-1 rounded px-2 py-1 ${
                      badge.type === 'winner' 
                        ? 'bg-yellow-500/10 border border-yellow-500/30' 
                        : 'bg-primary/10 border border-primary/20'
                    }`}
                  >
                    <span className={`text-xs ${badge.type === 'winner' ? 'text-yellow-500' : 'text-primary'}`}>
                      #{pick.gameNumber}
                    </span>
                    <span className={`text-sm font-bold ${badge.type === 'winner' ? 'text-yellow-500' : 'text-primary'}`}>
                      {pick.pick}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

export default PredictionsTab;
