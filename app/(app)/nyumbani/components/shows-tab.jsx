"use client";
import React from 'react';

const ShowsTab = () => {
  const dummyShows = [
    {
      id: 1,
      title: "Sports Analysis Weekly",
      creator: "SportsMaster",
      videos: 48,
      subscribers: 15000,
      totalLength: "24 hours",
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      title: "Betting Tips & Tricks",
      creator: "BetExpert",
      videos: 35,
      subscribers: 12500,
      totalLength: "18 hours",
      lastUpdated: "1 week ago"
    }
  ];

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Shows</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyShows.map(show => (
          <div key={show.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-600"></div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{show.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">By {show.creator}</p>
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div>{show.videos} videos</div>
                <div>{show.totalLength}</div>
                <div>{show.subscribers} subscribers</div>
                <div>Updated {show.lastUpdated}</div>
              </div>
              <button className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Watch Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowsTab;
