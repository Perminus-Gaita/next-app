"use client";

import { useState } from "react";

interface Factor { name: string; weight: number; description: string; }

export default function OutcomePredictor({ outcomeType = "home" }: { outcomeType?: "home" | "away" }) {
  const isHome = outcomeType === "home";
  const [factors, setFactors] = useState<Factor[]>([
    { name: "Recent Form", weight: 70, description: isHome ? "Home team last 5 games" : "Away team last 5 games" },
    { name: isHome ? "Home Advantage" : "Away Record", weight: 60, description: isHome ? "Win rate at home ground" : "Win rate away from home" },
    { name: "Head to Head", weight: 50, description: "Historical results between these teams" },
    { name: "Squad Strength", weight: 65, description: "Key players available, no injuries" },
    { name: "Motivation", weight: 55, description: "League position, cup importance" },
  ]);

  const updateWeight = (index: number, weight: number) => {
    const updated = [...factors]; updated[index].weight = weight; setFactors(updated);
  };

  const avgConfidence = factors.reduce((sum, f) => sum + f.weight, 0) / factors.length;
  const getVerdict = (conf: number) => {
    if (conf >= 75) return { text: "Strong confidence", color: "text-green-600 dark:text-green-400" };
    if (conf >= 55) return { text: "Moderate confidence", color: "text-amber-600 dark:text-amber-400" };
    return { text: "Low confidence — consider other outcomes", color: "text-red-600 dark:text-red-400" };
  };
  const verdict = getVerdict(avgConfidence);

  return (
    <div className="p-5 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
        {isHome ? "Home" : "Away"} Win Confidence Builder
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Rate each factor to build your case for a {isHome ? "home" : "away"} win.
      </p>

      <div className="space-y-4 mb-5">
        {factors.map((factor, i) => (
          <div key={factor.name}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{factor.name}</span>
              <span className={`text-sm font-bold ${factor.weight >= 70 ? "text-green-600 dark:text-green-400" : factor.weight >= 40 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                {factor.weight}%
              </span>
            </div>
            <input type="range" min="0" max="100" step="5" value={factor.weight}
              onChange={(e) => updateWeight(i, parseInt(e.target.value))}
              className="w-full accent-slate-700 dark:accent-blue-400" style={{ background: "rgba(0,0,0,0.08)" }} />
            <p className="text-xs text-gray-600 dark:text-gray-400">{factor.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Confidence</span>
          <span className={`text-2xl font-bold ${verdict.color}`}>{avgConfidence.toFixed(0)}%</span>
        </div>
        <p className={`text-sm mt-1 ${verdict.color}`}>{verdict.text}</p>
      </div>
    </div>
  );
}
