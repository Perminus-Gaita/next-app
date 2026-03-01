"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface JackpotTabsNavProps {
  jackpotId: string;
}

const tabs = [
  { segment: "", label: "Matches" },
  { segment: "/picks", label: "Picks" },
  { segment: "/comments", label: "Comments" },
];

const JackpotTabsNav: React.FC<JackpotTabsNavProps> = ({ jackpotId }) => {
  const pathname = usePathname();
  const basePath = `/j/${jackpotId}`;

  const isActive = (segment: string) => {
    const fullPath = `${basePath}${segment}`;
    if (segment === "") {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname.startsWith(fullPath);
  };

  return (
    <div className="flex border-b border-border sticky top-0 z-10">
      {tabs.map((tab) => (
        <Link
          key={tab.segment}
          href={`${basePath}${tab.segment}`}
          className={`flex-1 py-4 text-sm font-medium transition-colors relative text-center ${
            isActive(tab.segment)
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.label}
          {isActive(tab.segment) && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-primary rounded-t-full" />
          )}
        </Link>
      ))}
    </div>
  );
};

export default JackpotTabsNav;
