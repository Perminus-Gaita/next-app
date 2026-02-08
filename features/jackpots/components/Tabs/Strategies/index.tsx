"use client";

import React from 'react';
import { Zap, TrendingUp, BarChart3, Shuffle, Check } from 'lucide-react';
import { usePicksStore } from '@/lib/stores/picks-store';

interface StrategiesTabProps {
  onRunStrategy?: (strategyId: string) => void;
  isRunning?: boolean;
}

const strategies = [
  {
    id: 'favorites',
    name: 'Back Favorites',
    description: 'Selects the outcome with the lowest odds (most likely) for each match.',
    icon: TrendingUp,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/50',
  },
  {
    id: 'value',
    name: 'Value Picks',
    description: 'Finds value by selecting mid-range odds — not the favorite, not the longshot.',
    icon: BarChart3,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/50',
  },
  {
    id: 'balanced',
    name: 'Balanced Mix',
    description: 'Creates an even distribution of Home, Draw, and Away picks across matches.',
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/50',
  },
  {
    id: 'random',
    name: 'Lucky Dip',
    description: 'Randomly selects an outcome for each match. Pure luck!',
    icon: Shuffle,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/50',
  },
];

const StrategiesTab: React.FC<StrategiesTabProps> = ({ onRunStrategy, isRunning = false }) => {
  const { selectedStrategy, setSelectedStrategy } = usePicksStore();

  const handleSelect = (strategyId: string) => {
    setSelectedStrategy(strategyId);
  };

  return (
    <div className="p-4 space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Select a strategy then hit <span className="font-semibold text-foreground">Run Strategy</span> above.
      </p>

      {strategies.map((strategy) => {
        const Icon = strategy.icon;
        const isSelected = selectedStrategy === strategy.id;

        return (
          <button
            key={strategy.id}
            onClick={() => handleSelect(strategy.id)}
            disabled={isRunning}
            className={`w-full text-left bg-card border rounded-xl p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isSelected
                ? `${strategy.border} border-2`
                : 'border-border hover:border-primary/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${strategy.bg}`}>
                <Icon className={`w-5 h-5 ${strategy.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{strategy.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{strategy.description}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StrategiesTab;
