import React from 'react';
import { Sparkles, Calendar, CheckSquare, Wallet } from 'lucide-react';

export default function OverviewTab({ concept, budgetSummary, timelineCount, taskCount }) {
  return (
    <div className="space-y-5">
      {/* Concept Card */}
      <div className="rounded-[24px] p-6 sm:p-7 border bg-white dark:bg-[#111726] border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" /> Concept & Theme
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{concept.themeTitle}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{concept.summary}</p>
      </div>

      {/* Highlights & Simple Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 rounded-[24px] p-6 border bg-white dark:bg-[#111726] border-slate-200/80 dark:border-white/[0.08]">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
            Highlights of the Event
          </h4>
          <div className="space-y-3">
            {concept.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{h}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] p-6 border bg-white dark:bg-[#111726] border-slate-200/80 dark:border-white/[0.08] flex flex-col justify-between space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Plan Summary
          </h4>
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] flex justify-between items-center text-xs">
              <span className="text-slate-500 flex items-center gap-2"><Wallet className="w-4 h-4 text-violet-500" /> Budget</span>
              <span className="font-bold text-slate-900 dark:text-white">{budgetSummary}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] flex justify-between items-center text-xs">
              <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4 text-violet-500" /> Schedule</span>
              <span className="font-bold text-slate-900 dark:text-white">{timelineCount} Moments</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] flex justify-between items-center text-xs">
              <span className="text-slate-500 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-violet-500" /> Tasks</span>
              <span className="font-bold text-slate-900 dark:text-white">{taskCount} Items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}