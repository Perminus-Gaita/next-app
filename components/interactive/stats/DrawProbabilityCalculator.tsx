"use client";

import { useState } from "react";

const LEAGUES = [
  { name: "Premier League", drawRate: 23.4, matches: 380 },
  { name: "La Liga", drawRate: 22.1, matches: 380 },
  { name: "Serie A", drawRate: 25.8, matches: 380 },
  { name: "Bundesliga", drawRate: 22.7, matches: 306 },
  { name: "Ligue 1", drawRate: 24.2, matches: 380 },
  { name: "Kenya PL", drawRate: 26.1, matches: 306 },
];

export default function DrawProbabilityCalculator() {
  const [drawOddsMin, setDrawOddsMin] = useState(2.8);
  const [drawOddsMax, setDrawOddsMax] = useState(3.6);
  const [selectedLeague, setSelectedLeague] = useState(0);

  const league = LEAGUES[selectedLeague];
  const impliedProbMin = (1 / drawOddsMax) * 100;
  const impliedProbMax = (1 / drawOddsMin) * 100;
  const avgImplied = (impliedProbMin + impliedProbMax) / 2;
  const diff = league.drawRate - avgImplied;

  return (
    <div className="p-5 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        Draw Probability by League & Odds Range
      </h3>

      <div className="flex flex-wrap gap-2 mb-5">
        {LEAGUES.map((l, i) => (
          <button key={l.name} onClick={() => setSelectedLeague(i)}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
              i === selectedLeague
                ? "bg-slate-700 text-white dark:bg-blue-600"
                : "bg-[#d5d7f4] text-gray-700 dark:bg-white/10 dark:text-gray-300"
            }`}
          >{l.name}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Draw Odds From</label>
          <input type="range" min="1.5" max="5" step="0.1" value={drawOddsMin}
            onChange={(e) => setDrawOddsMin(Math.min(parseFloat(e.target.value), drawOddsMax - 0.1))}
            className="w-full accent-slate-700 dark:accent-blue-400" style={{ background: "rgba(0,0,0,0.08)" }} />
          <span className="text-lg font-bold text-gray-900 dark:text-white">{drawOddsMin.toFixed(1)}</span>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Draw Odds To</label>
          <input type="range" min="1.5" max="8" step="0.1" value={drawOddsMax}
            onChange={(e) => setDrawOddsMax(Math.max(parseFloat(e.target.value), drawOddsMin + 0.1))}
            className="w-full accent-slate-700 dark:accent-blue-400" style={{ background: "rgba(0,0,0,0.08)" }} />
          <span className="text-lg font-bold text-gray-900 dark:text-white">{drawOddsMax.toFixed(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none p-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Actual Draw Rate</p>
          <p className="text-xl font-bold text-violet-600 dark:text-blue-400">{league.drawRate}%</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{league.name}</p>
        </div>
        <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none p-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Odds Imply</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{avgImplied.toFixed(1)}%</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{impliedProbMin.toFixed(1)}–{impliedProbMax.toFixed(1)}%</p>
        </div>
        <div className={`rounded-lg shadow-sm dark:shadow-none p-3 text-center ${
          diff > 0 ? "bg-white dark:bg-green-500/20" : "bg-white dark:bg-red-500/20"
        }`}>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Edge</p>
          <p className={`text-xl font-bold ${diff > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{diff > 0 ? "Value zone" : "No value"}</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400">
        Based on historical data from top leagues. Draw rates vary by season and matchday context.
      </p>
    </div>
  );
}
