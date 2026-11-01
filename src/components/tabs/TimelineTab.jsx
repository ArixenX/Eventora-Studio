import React from 'react';

export default function TimelineTab({ timeline }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-900">Run of Show (Day Schedule)</h3>
        <p className="text-xs text-slate-500 mt-0.5">Hour-by-hour operational breakdown for smooth logistics.</p>
      </div>

      <div className="relative border-l border-slate-200 ml-3 space-y-6">
        {timeline.map((slot, idx) => (
          <div key={idx} className="ml-6 relative">
            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
            <span className="text-[11px] font-bold text-indigo-600 tracking-wider uppercase">{slot.time}</span>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5">{slot.title}</h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{slot.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}