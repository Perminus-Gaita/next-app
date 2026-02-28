"use client";

import { useState, useRef } from "react";

export default function FakeWinnerCard() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("221,000,000");
  const [jackpotType, setJackpotType] = useState("Mega Jackpot");
  const displayName = name || "Your Name";

  return (
    <div className="p-5 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Jackpot Winner Card Generator</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create a fun shareable card. For entertainment only!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name"
            className="w-full px-3 py-2 rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none text-gray-900 dark:text-white text-sm border-0 outline-none placeholder:text-gray-500 dark:placeholder:text-gray-500" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Amount (KSH)</label>
          <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100,000,000"
            className="w-full px-3 py-2 rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none text-gray-900 dark:text-white text-sm border-0 outline-none placeholder:text-gray-500 dark:placeholder:text-gray-500" />
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {["Midweek Jackpot", "Mega Jackpot"].map((type) => (
          <button key={type} onClick={() => setJackpotType(type)}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
              jackpotType === type ? "bg-slate-700 text-white dark:bg-blue-600" : "bg-[#d5d7f4] text-gray-700 dark:bg-white/10 dark:text-gray-400"
            }`}
          >{type}</button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-6 text-white text-center shadow-lg">
        <p className="text-xs uppercase tracking-widest opacity-80 mb-1">SportPesa {jackpotType}</p>
        <p className="text-2xl font-bold mb-1">🏆 JACKPOT WINNER 🏆</p>
        <div className="my-4 py-3 border-t border-b border-white/20">
          <p className="text-lg opacity-90">Congratulations</p>
          <p className="text-3xl font-extrabold mt-1">{displayName}</p>
        </div>
        <p className="text-sm opacity-80 mb-1">You have won</p>
        <p className="text-4xl font-extrabold text-yellow-300">KSH {amount}</p>
        <p className="text-xs opacity-60 mt-4">For entertainment purposes only.</p>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-3">Screenshot and share with your friends!</p>
    </div>
  );
}
