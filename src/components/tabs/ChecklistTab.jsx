import React from 'react';

export default function ChecklistTab({ checklist, onToggleTask }) {
  const getBadgeColor = (p) => {
    if (p === 'High') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (p === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Execution Checklist</h3>
        <p className="text-xs text-slate-500 mt-0.5">Key vendor and operational milestones to confirm before the day.</p>
      </div>

      <div className="space-y-2">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleTask(item.id)}
            className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition select-none ${
              item.done 
                ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' 
                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => {}}
                className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer pointer-events-none"
              />
              <span className="font-medium">{item.task}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase">{item.category}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getBadgeColor(item.priority)}`}>
                {item.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}