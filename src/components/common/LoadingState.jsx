import React from 'react';
import { Loader2, Sparkles, Layers, Cpu } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_40px_rgba(124,58,237,0.4)] animate-pulse">
          <Cpu className="w-8 h-8 text-violet-300" />
        </div>
        <Loader2 className="w-20 h-20 text-violet-500 absolute -top-2 -left-2 animate-spin opacity-40" />
      </div>

      <div className="space-y-2 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Gemini GenAI Engine Online</span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Synthesizing Production Matrix</h3>
        <p className="text-xs text-slate-400 leading-relaxed font-mono">
          Running per-head catering optimizations, synchronizing milestone timeline, and drafting vendor checklists...
        </p>
      </div>
    </div>
  );
}