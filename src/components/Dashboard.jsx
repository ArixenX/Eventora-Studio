import React, { useState } from 'react';
import { Download, MapPin, Users, Calendar, Sparkles, PieChart, CheckSquare } from 'lucide-react';
import OverviewTab from './tabs/OverviewTab';
import BudgetTab from './tabs/BudgetTab';
import TimelineTab from './tabs/TimelineTab';
import ChecklistTab from './tabs/ChecklistTab';

export default function Dashboard({ eventData, plan, setPlan }) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleToggleTask = (id) => {
    setPlan({
      ...plan,
      checklist: plan.checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'budget', label: 'Budget Plan', icon: PieChart },
    { id: 'timeline', label: 'Day Schedule', icon: Calendar },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto my-6 animate-in fade-in duration-300">
      
      {/* Top Banner Card */}
      <div className="rounded-[28px] p-6 sm:p-8 border bg-white dark:bg-[#111726] border-slate-200/80 dark:border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900/60">
            {eventData.type}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2.5 tracking-tight">
            {eventData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-violet-500" /> {eventData.location}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-violet-500" /> {eventData.guestCount} Guests</span>
            <span>•</span>
            <span className="text-slate-900 dark:text-white font-bold">{eventData.currency}{Number(eventData.budget).toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start md:self-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-xs font-bold text-slate-700 dark:text-slate-200 transition"
        >
          <Download className="w-4 h-4 text-violet-500" />
          <span>Save / Print PDF</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/[0.08] pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.03]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <OverviewTab
            concept={plan.concept}
            budgetSummary={`${eventData.currency}${Number(eventData.budget).toLocaleString()}`}
            timelineCount={plan.timeline.length}
            taskCount={plan.checklist.length}
          />
        )}
        {activeTab === 'budget' && (
          <BudgetTab budget={plan.budget} currency={eventData.currency} />
        )}
        {activeTab === 'timeline' && (
          <TimelineTab timeline={plan.timeline} />
        )}
        {activeTab === 'checklist' && (
          <ChecklistTab checklist={plan.checklist} onToggleTask={handleToggleTask} />
        )}
      </div>

    </div>
  );
}