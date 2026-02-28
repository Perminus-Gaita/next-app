"use client";

import { useState } from "react";

export default function MoneyPlanner() {
  const [amount, setAmount] = useState(100000000);
  const tax = amount * 0.2;
  const afterTax = amount - tax;
  const emergency = afterTax * 0.1;
  const investment = afterTax * 0.4;
  const realEstate = afterTax * 0.25;
  const personal = afterTax * 0.15;
  const charity = afterTax * 0.1;
  const monthlyFromInvestment = (investment * 0.12) / 12;

  const presets = [
    { label: "50M", value: 50000000 },
    { label: "100M", value: 100000000 },
    { label: "200M", value: 200000000 },
    { label: "400M", value: 400000000 },
  ];

  const formatM = (n: number) => {
    if (n >= 1000000) return `KSH ${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `KSH ${(n / 1000).toFixed(0)}K`;
    return `KSH ${n.toFixed(0)}`;
  };

  return (
    <div className="p-5 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Jackpot Money Planner</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((p) => (
          <button key={p.value} onClick={() => setAmount(p.value)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              amount === p.value
                ? "bg-slate-700 text-white dark:bg-blue-600"
                : "bg-[#d5d7f4] text-gray-700 dark:bg-white/10 dark:text-gray-300"
            }`}
          >KSH {p.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-white shadow-sm dark:bg-red-500/20 dark:shadow-none p-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Withholding Tax (20%)</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatM(tax)}</p>
        </div>
        <div className="rounded-lg bg-white shadow-sm dark:bg-green-500/20 dark:shadow-none p-3 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">You Receive</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatM(afterTax)}</p>
        </div>
      </div>

      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Suggested Allocation</p>
      <div className="space-y-2 mb-4">
        {[
          { label: "Emergency Fund (10%)", amount: emergency, color: "bg-blue-500" },
          { label: "Investments (40%)", amount: investment, color: "bg-green-500" },
          { label: "Real Estate (25%)", amount: realEstate, color: "bg-purple-500" },
          { label: "Personal & Family (15%)", amount: personal, color: "bg-amber-500" },
          { label: "Charity & Community (10%)", amount: charity, color: "bg-pink-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`} />
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.label}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatM(item.amount)}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-sm dark:bg-white/10 dark:shadow-none px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
        If you invest {formatM(investment)} at 12% annual return, you earn roughly <strong>{formatM(monthlyFromInvestment)}/month</strong> in passive income.
      </div>
    </div>
  );
}
