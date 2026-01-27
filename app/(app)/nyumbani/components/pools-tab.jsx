"use client";
import React from 'react';

const PoolsTab = () => {
  const dummyPools = [
    {
      id: 1,
      name: "Weekly Sports Pool",
      description: "Predict outcomes of 10 major sporting events",
      totalPrize: 10000,
      participants: 250,
      entryFee: 50,
      endDate: "2025-02-01"
    },
    {
      id: 2,
      name: "Champions League Pool",
      description: "Pick the winner and finalists",
      totalPrize: 25000,
      participants: 500,
      entryFee: 100,
      endDate: "2025-05-30"
    }
  ];

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pools</h2>
      {dummyPools.map(pool => (
        <div key={pool.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{pool.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{pool.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Prize: </span>
              <span className="font-semibold text-green-600 dark:text-green-400">${pool.totalPrize}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Entry: </span>
              <span className="font-semibold text-gray-900 dark:text-white">${pool.entryFee}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Participants: </span>
              <span className="font-semibold text-gray-900 dark:text-white">{pool.participants}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Ends: </span>
              <span className="font-semibold text-gray-900 dark:text-white">{pool.endDate}</span>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Join Pool
          </button>
        </div>
      ))}
    </div>
  );
};

export default PoolsTab;
