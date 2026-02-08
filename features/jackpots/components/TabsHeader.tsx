"use client";

import React from 'react';
import type { TabType } from '../types';

interface TabsHeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabsHeader: React.FC<TabsHeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'matches', label: 'Matches' },
    { id: 'strategies', label: 'Strategies' },
    { id: 'stats', label: 'Stats' },
    { id: 'predictions', label: 'Predictions' },
    { id: 'comments', label: 'Comments' },
  ];

  return (
    <div className="flex border-b border-border bg-card sticky top-0 z-10 overflow-x-auto scrollbar-none">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 min-w-fit py-4 px-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
            activeTab === tab.id
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-primary rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default TabsHeader;
