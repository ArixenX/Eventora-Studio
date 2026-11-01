import React from 'react';

export default function BudgetTab({ budget, currency }) {
  return (
    <div className="rounded-2xl bg-[#0D121F] border border-white/[0.08] p-6 md:p-8 space-y-6">
      <div>
        <h3 className="text-lg font-display font-bold text-white">Capital Allocation Matrix</h3>
        <p className="text-xs text-slate-400 mt-1">Balanced distribution designed to prevent operational overruns.</p>
      </div>

      <div className="space-y-5">
        {budget.map((item, idx) => (
          <div key={idx} className="space-y-2 p-3.5 rounded-xl bg-white/[0.015] border border-white/[0.04]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">{item.category}</span>
              <span className="font-mono text-slate-300 font-semibold">
                {currency}{item.allocated.toLocaleString()} <span className="text-violet-400">({item.percentage}%)</span>
              </span>
            </div>
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            {item.tip && (
              <p className="text-[11px] text-slate-400 italic">Strategy: {item.tip}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}