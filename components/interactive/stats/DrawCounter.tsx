"use client";

import { useState } from "react";

interface Match { id: number; home: string; away: string; pick: "H" | "D" | "A" | null; }

const SAMPLE_MATCHES: Match[] = [
  { id: 1, home: "Arsenal", away: "Chelsea", pick: null },
  { id: 2, home: "Man City", away: "Liverpool", pick: null },
  { id: 3, home: "Gor Mahia", away: "AFC Leopards", pick: null },
  { id: 4, home: "Barcelona", away: "Real Madrid", pick: null },
  { id: 5, home: "Bayern", away: "Dortmund", pick: null },
  { id: 6, home: "Juventus", away: "Inter Milan", pick: null },
  { id: 7, home: "PSG", away: "Marseille", pick: null },
  { id: 8, home: "Tottenham", away: "Man United", pick: null },
];

export default function DrawCounter() {
  const [matches, setMatches] = useState<Match[]>(SAMPLE_MATCHES);

  const setPick = (id: number, pick: "H" | "D" | "A") => {
    setMatches(matches.map((m) => m.id === id ? { ...m, pick: m.pick === pick ? null : pick } : m));
  };

  const picked = matches.filter((m) => m.pick !== null);
  const draws = matches.filter((m) => m.pick === "D");
  const homes = matches.filter((m) => m.pick === "H");
  const aways = matches.filter((m) => m.pick === "A");
  const drawPct = picked.length > 0 ? (draws.length / picked.length) * 100 : 0;

  return (
    <div className="p-5 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Free Draw Counter</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Pick your predictions and see your draw distribution.</p>

      <div className="space-y-2 mb-5">
        {matches.map((match) => (
          <div key={match.id} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400 w-5">{match.id}.</span>
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{match.home} vs {match.away}</span>
            <div className="flex gap-1">
              {(["H", "D", "A"] as const).map((pick) => (
                <button key={pick} onClick={() => setPick(match.id, pick)}
                  className={`w-9 h-8 text-xs font-bold rounded transition-colors ${
                    match.pick === pick
                      ? pick === "H" ? "bg-green-600 text-white"
                        : pick === "D" ? "bg-gray-600 text-white"
                        : "bg-amber-600 text-white"
                      : "bg-[#d5d7f4] text-gray-700 dark:bg-white/10 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/20"
                  }`}
                >{pick}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none p-2 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">Picked</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{picked.length}/{matches.length}</p>
        </div>
        <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none p-2 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">Home</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{homes.length}</p>
        </div>
        <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none p-2 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">Draw</p>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-200">{draws.length}</p>
        </div>
        <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none p-2 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">Away</p>
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{aways.length}</p>
        </div>
      </div>

      {picked.length > 0 && (
        <div className="mt-3 rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
          Your slip has {drawPct.toFixed(0)}% draws. Winning slips typically have 2–5 draws in a 17-game slip.
        </div>
      )}
    </div>
  );
}
