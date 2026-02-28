"use client";

import { useState } from "react";

interface Site { name: string; rating: number; jackpotTypes: string[]; minStake: string; payout: string; app: boolean; sms: boolean; highlight?: string; }

const SITES: Site[] = [
  { name: "SportPesa", rating: 4.5, jackpotTypes: ["Midweek", "Mega", "Grand"], minStake: "KSH 99", payout: "Fast (24-72hrs)", app: true, sms: true, highlight: "Most popular in Kenya" },
  { name: "Betika", rating: 4.2, jackpotTypes: ["Midweek", "Grand"], minStake: "KSH 99", payout: "Fast (24-48hrs)", app: true, sms: true, highlight: "Great bonuses" },
  { name: "mCHEZA", rating: 3.8, jackpotTypes: ["Weekly Jackpot"], minStake: "KSH 50", payout: "Medium (48-72hrs)", app: true, sms: true },
  { name: "Odibets", rating: 3.9, jackpotTypes: ["Daily Jackpot"], minStake: "KSH 50", payout: "Fast (24hrs)", app: true, sms: false },
  { name: "BetWay", rating: 4.0, jackpotTypes: ["Super Jackpot"], minStake: "KSH 100", payout: "Medium (48hrs)", app: true, sms: false, highlight: "International brand" },
];

export default function SiteComparison({ variant = "jackpot" }: { variant?: "jackpot" | "apps" | "reviews" }) {
  const [sortBy, setSortBy] = useState<"rating" | "name">("rating");
  const sorted = [...SITES].sort((a, b) => sortBy === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name));

  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {variant === "apps" ? "Jackpot Results Apps" : variant === "reviews" ? "Betting Site Reviews" : "Jackpot Sites Compared"}
        </h3>
        <div className="flex gap-1">
          {(["rating", "name"] as const).map((s) => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-3 py-1 text-xs rounded-full ${
                sortBy === s ? "bg-slate-700 text-white dark:bg-blue-600" : "bg-[#d5d7f4] text-gray-700 dark:bg-white/10 dark:text-gray-400"
              }`}
            >{s === "rating" ? "By Rating" : "A–Z"}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((site) => (
          <div key={site.name} className="p-3 rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{site.name}</span>
                {site.highlight && <span className="ml-2 text-xs text-violet-600 dark:text-blue-400">{site.highlight}</span>}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{site.rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
              <span>Min: {site.minStake}</span><span>Payout: {site.payout}</span>
              <span>{site.app ? "📱 App" : ""} {site.sms ? "💬 SMS" : ""}</span>
            </div>
            <div className="flex gap-1 mt-2">
              {site.jackpotTypes.map((type) => (
                <span key={type} className="text-xs px-2 py-0.5 bg-violet-100/50 dark:bg-white/5 rounded-full text-gray-600 dark:text-gray-300">{type}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
