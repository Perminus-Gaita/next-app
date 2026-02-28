"use client";

import React from "react";
import type { TabType } from "../types";

interface TabsHeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabsHeader: React.FC<TabsHeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: "matches", label: "Matches" },
    { id: "predictions", label: "Picks" },
    { id: "comments", label: "Comments" },
  ];

  return (
    <div className="flex border-b border-border sticky top-0 z-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
            activeTab === tab.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
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
