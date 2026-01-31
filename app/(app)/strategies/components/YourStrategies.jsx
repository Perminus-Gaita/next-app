"use client";
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Play } from 'lucide-react';

export default function YourStrategies() {
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      name: 'Safe Home Favorites',
      description: 'Focus on low-odds home teams with good form',
      rulesCount: 3,
      lastUsed: '2025-01-28',
      accuracy: 78.5
    },
    {
      id: 2,
      name: 'Draw Hunter',
      description: 'Target matches likely to end in draws',
      rulesCount: 4,
      lastUsed: '2025-01-25',
      accuracy: 65.2
    }
  ]);

  const deleteStrategy = (id) => {
    if (confirm('Are you sure you want to delete this strategy?')) {
      setStrategies(strategies.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Saved Strategies</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all">
          <Plus className="w-4 h-4" />
          New Strategy
        </button>
      </div>

      {strategies.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <div className="text-muted-foreground mb-4">
            <p className="text-lg font-medium mb-2">No strategies yet</p>
            <p className="text-sm">Create your first strategy in Strategy Studio</p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all">
            <Plus className="w-5 h-5" />
            Create Strategy
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{strategy.name}</h3>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => deleteStrategy(strategy.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm mb-4">
                <span className="text-muted-foreground">
                  {strategy.rulesCount} rules
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Last used: {strategy.lastUsed}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {strategy.accuracy}%
                  </div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all">
                  <Play className="w-4 h-4" />
                  Load
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
