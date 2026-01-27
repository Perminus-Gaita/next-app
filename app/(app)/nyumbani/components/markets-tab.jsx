"use client";
import React from 'react';

const MarketsTab = () => {
  const dummyMarkets = [
    {
      id: 1,
      title: "UFC 310 Main Event",
      description: "Who will win the main event?",
      totalPool: 5000,
      participants: 45,
      endDate: "2025-02-15",
      options: ["Fighter A", "Fighter B"]
    },
    {
      id: 2,
      title: "Premier League Champions 2025",
      description: "Which team will win the Premier League?",
      totalPool: 12000,
      participants: 120,
      endDate: "2025-05-20",
      options: ["Man City", "Liverpool", "Arsenal"]
    },
    {
      id: 3,
      title: "Bitcoin Price Prediction",
      description: "Will Bitcoin reach $100k by end of Q1 2025?",
      totalPool: 8500,
      participants: 85,
      endDate: "2025-03-31",
      options: ["Yes", "No"]
    }
  ];

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Markets</h2>
      {dummyMarkets.map(market => (
        <div key={market.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{market.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{market.description}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Pool: </span>
              <span className="font-semibold text-gray-900 dark:text-white">${market.totalPool}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Participants: </span>
              <span className="font-semibold text-gray-900 dark:text-white">{market.participants}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Ends: </span>
              <span className="font-semibold text-gray-900 dark:text-white">{market.endDate}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {market.options.map((option, idx) => (
              <button key={idx} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketsTab;
