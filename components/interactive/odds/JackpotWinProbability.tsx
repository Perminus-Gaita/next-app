"use client";

import { useState } from "react";

export default function JackpotWinProbability() {
  const [totalGames, setTotalGames] = useState(17);
  const [doubleChanceGames, setDoubleChanceGames] = useState(0);

  const singleOutcomeProb = 1 / 3;
  const doubleOutcomeProb = 2 / 3;
  const probability =
    Math.pow(singleOutcomeProb, totalGames - doubleChanceGames) *
    Math.pow(doubleOutcomeProb, doubleChanceGames);
  const oneIn = Math.round(1 / probability);
  const percentage = probability * 100;
  const baseCost = 99;
  const totalCost = baseCost * Math.pow(2, doubleChanceGames);

  return (
    <div className="p-5 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Jackpot Win Probability Calculator
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Games in Jackpot</label>
          <div className="flex gap-2">
            {[13, 17, 20].map((n) => (
              <button key={n}
                onClick={() => { setTotalGames(n); setDoubleChanceGames(Math.min(doubleChanceGames, n)); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  totalGames === n
                    ? "bg-slate-700 text-white dark:bg-blue-600"
                    : "bg-[#d5d7f4] text-gray-700 dark:bg-white/10 dark:text-gray-300"
                }`}
              >{n} games</button>
            ))}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {totalGames === 13 ? "Midweek Jackpot" : totalGames === 17 ? "Mega Jackpot" : "Mega Jackpot Pro"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Double Chance Games: {doubleChanceGames}</label>
          <input type="range" min="0" max={totalGames} step="1" value={doubleChanceGames}
            onChange={(e) => setDoubleChanceGames(parseInt(e.target.value))}
            className="w-full accent-slate-700 dark:accent-blue-400"
            style={{ background: "rgba(0,0,0,0.08)" }} />
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>0 (cheapest)</span><span>{totalGames} (best odds)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none p-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Odds</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">1 in {oneIn.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none p-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Probability</p>
          <p className="text-lg font-bold text-violet-600 dark:text-blue-400">
            {percentage < 0.001 ? percentage.toExponential(2) : percentage.toFixed(4)}%
          </p>
        </div>
        <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none p-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Bet Cost</p>
          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">KSH {totalCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
        {doubleChanceGames === 0 ? (
          <span>With no double chances, you need all {totalGames} predictions correct from 3 options each.</span>
        ) : (
          <span>Adding {doubleChanceGames} double chance game{doubleChanceGames > 1 ? "s" : ""} improves your odds by {Math.round(Math.pow(2, doubleChanceGames))}x but costs KSH {totalCost.toLocaleString()} instead of KSH {baseCost}.</span>
        )}
      </div>
    </div>
  );
}
