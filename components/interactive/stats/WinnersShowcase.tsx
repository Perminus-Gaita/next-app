"use client";

import { useState } from "react";

interface Winner { name: string; amount: string; amountNum: number; year: string; type: string; games: number; correct: number; note?: string; }

const WINNERS: Winner[] = [
  { name: "Samuel Abisai", amount: "KSH 221M", amountNum: 221000000, year: "2017", type: "Mega Jackpot", games: 17, correct: 17, note: "Largest individual SportPesa winner" },
  { name: "Gordon Ogada", amount: "KSH 230M", amountNum: 230000000, year: "2018", type: "Mega Jackpot", games: 17, correct: 17, note: "Record jackpot at the time" },
  { name: "Cosmas Korir", amount: "KSH 208M", amountNum: 208000000, year: "2019", type: "Mega Jackpot", games: 17, correct: 17 },
  { name: "Lenyora Benson", amount: "KSH 50M", amountNum: 50000000, year: "2020", type: "Midweek Jackpot", games: 13, correct: 13, note: "Midweek jackpot winner" },
  { name: "Anonymous (Nairobi)", amount: "KSH 172M", amountNum: 172000000, year: "2021", type: "Mega Jackpot", games: 17, correct: 17 },
  { name: "Multiple Winners", amount: "KSH 424M (shared)", amountNum: 424000000, year: "2023", type: "Mega Jackpot", games: 17, correct: 17, note: "Largest total pot, shared" },
];

export default function WinnersShowcase() {
  const [sortBy, setSortBy] = useState<"year" | "amount">("year");
  const sorted = [...WINNERS].sort((a, b) => sortBy === "year" ? parseInt(b.year) - parseInt(a.year) : b.amountNum - a.amountNum);
  const totalPaid = WINNERS.reduce((sum, w) => sum + w.amountNum, 0);

  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">SportPesa Jackpot Winners</h3>
        <div className="flex gap-1">
          {(["year", "amount"] as const).map((s) => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-3 py-1 text-xs rounded-full ${
                sortBy === s ? "bg-slate-700 text-white dark:bg-blue-600" : "bg-[#d5d7f4] text-gray-700 dark:bg-white/10 dark:text-gray-400"
              }`}
            >By {s === "year" ? "Year" : "Amount"}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {sorted.map((winner, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {winner.year.slice(-2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{winner.name}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{winner.year}</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{winner.type} · {winner.correct}/{winner.games} correct</div>
              {winner.note && <p className="text-xs text-violet-600 dark:text-blue-400 mt-0.5">{winner.note}</p>}
            </div>
            <span className="text-sm font-bold text-green-600 dark:text-green-400 flex-shrink-0">{winner.amount}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-sm dark:bg-green-500/20 dark:shadow-none px-4 py-2 text-center">
        <p className="text-xs text-gray-600 dark:text-gray-400">Total Paid Out</p>
        <p className="text-lg font-bold text-green-600 dark:text-green-400">KSH {(totalPaid / 1000000000).toFixed(1)}B+</p>
      </div>
    </div>
  );
}
