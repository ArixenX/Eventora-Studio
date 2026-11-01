import React from 'react';
import { Sparkles, Sun, Moon, RotateCcw } from 'lucide-react';

export default function Navbar({ isDark, onToggleTheme, isGenerated, onReset }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#080C15]/80 backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-sm shadow-violet-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">PlanCraft</span>
            <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
              AI Event Studio
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Working Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-transform"
            title="Toggle Light/Dark Theme"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          {isGenerated && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-violet-500" />
              <span>Edit Inputs</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}