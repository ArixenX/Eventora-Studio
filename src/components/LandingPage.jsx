import React, { useState } from 'react';
import { 
  ArrowRight, Users, DollarSign, Calendar, CheckSquare, 
  Sparkles, Sliders, ChevronRight, Layers, Clock, ShieldCheck, Play
} from 'lucide-react';

export default function LandingPage({ onStart, onSelectPreset }) {
  // Live Interactive Micro-Simulator State (Homepage par hi interactive)
  const [simType, setSimType] = useState('Wedding');
  const [simGuests, setSimGuests] = useState(200);
  const [simBudget, setSimBudget] = useState(1200000);
  const [activeTab, setActiveTab] = useState('budget');

  // Math calculated in real-time
  const perGuest = Math.round(simBudget / (simGuests || 1));
  const venueAlloc = Math.round(simBudget * 0.40);
  const diningAlloc = Math.round(simBudget * 0.30);
  const decorAlloc = Math.round(simBudget * 0.18);
  const mediaAlloc = Math.round(simBudget * 0.12);

  const presets = [
    {
      title: "Udaipur Heritage Wedding",
      type: "Wedding",
      location: "Udaipur, India",
      guests: 250,
      budget: 1800000,
      currency: "₹",
      vibe: "Candlelit courtyard, acoustic live sitar & flute, authentic Rajasthani dining."
    },
    {
      title: "Bengaluru Tech Summit & Hackathon",
      type: "Community",
      location: "Bengaluru, India",
      guests: 450,
      budget: 700000,
      currency: "₹",
      vibe: "Modern clean staging, multi-track audio-visuals, live breakout food stations."
    },
    {
      title: "Skyline Terrace 25th Birthday",
      type: "Birthday",
      location: "Mumbai, India",
      guests: 60,
      budget: 180000,
      currency: "₹",
      vibe: "Warm ambient lights, live acoustic jazz, craft mocktail bar, polaroid wall."
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 sm:py-20 space-y-24 select-none">
      
      {/* ─────────────────── 1. HERO HEADER ─────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-[11px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          PlanCraft 2.0 • Autonomous Architecture
        </div>

        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-[1.12]">
          Effortless celebrations. <br />
          <span className="text-neutral-400 dark:text-neutral-500 font-normal">
            Calculated with engineering precision.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Dynamic per-plate budgeting, real-time minute-by-minute run of show, and actionable vendor pipelines.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Launch Studio Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─────────────────── 2. LIVE INTERACTIVE ENGINE SANDBOX ─────────────────── */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#0D0D0D] p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Sandbox Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">Interactive Preview Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">LIVE MATH</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mt-1">Adjust controls to test allocations in real-time</h3>
          </div>

          {/* Quick Category Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            {['Wedding', 'Community', 'Birthday'].map((t) => (
              <button
                key={t}
                onClick={() => setSimType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  simType === t 
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs' 
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Sandbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Interactive Live Sliders (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Guest Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-neutral-600 dark:text-neutral-400">Headcount Capacity</span>
                <span className="font-mono font-semibold text-neutral-900 dark:text-white">{simGuests} Guests</span>
              </div>
              <input
                type="range"
                min="30"
                max="800"
                step="10"
                value={simGuests}
                onChange={(e) => setSimGuests(Number(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white cursor-pointer h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>30 Intimate</span>
                <span>800 Grand</span>
              </div>
            </div>

            {/* Budget Input & Stepper */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-neutral-600 dark:text-neutral-400">Target Capital (₹)</span>
                <span className="font-mono font-semibold text-neutral-900 dark:text-white">₹{simBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="50000"
                value={simBudget}
                onChange={(e) => setSimBudget(Number(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white cursor-pointer h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>₹1 Lakh</span>
                <span>₹50 Lakhs</span>
              </div>
            </div>

            {/* Unit Economics Highlight Card */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Calculated Spend</span>
                <span className="text-xl font-mono font-semibold text-neutral-900 dark:text-white mt-0.5 block">
                  ₹{perGuest.toLocaleString()} <span className="text-xs font-normal text-neutral-500">/ attendee</span>
                </span>
              </div>
              <button
                onClick={() => onSelectPreset({
                  title: `${simType} Blueprint`,
                  type: simType,
                  location: "Select City",
                  guestCount: simGuests,
                  budget: simBudget,
                  currency: "₹",
                  vibe: "Refined ambiance, seamless guest flow, curated dining."
                })}
                className="px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-medium transition flex items-center gap-1.5"
              >
                <span>Apply in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Right: Dynamic Interactive Live Blueprint Canvas (7 Cols) */}
          <div className="lg:col-span-7 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                <span>Simulated Distribution Architecture</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">4 Core Nodes</span>
            </div>

            <div className="space-y-3">
              {[
                { name: "Venue, Accommodations & Power", amt: venueAlloc, pct: 40 },
                { name: "F&B, Live Stations & Gourmet Bars", amt: diningAlloc, pct: 30 },
                { name: "Production, Florals & Ambient Decor", amt: decorAlloc, pct: 18 },
                { name: "Cinematic Media, Sound & Misc", amt: mediaAlloc, pct: 12 }
              ].map((row, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-600 dark:text-neutral-300 text-[11px] font-medium">{row.name}</span>
                    <span className="font-mono text-neutral-900 dark:text-white font-medium text-xs">
                      ₹{row.amt.toLocaleString()} <span className="text-[10px] text-neutral-400">({row.pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-neutral-900 dark:bg-white h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                Zero budget-creep margin verified
              </span>
              <span>100% Capital Accounted</span>
            </div>

          </div>

        </div>

      </div>

      {/* ─────────────────── 3. PRE-CONFIGURED BLUEPRINT CARDS ─────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Curated Blueprint Presets</h3>
            <p className="text-xs text-neutral-500">Click any card to instantly open its full masterplan in the workspace.</p>
          </div>
          <span className="text-xs font-mono text-neutral-400">3 Ready Templates</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presets.map((p, idx) => (
            <div
              key={idx}
              onClick={() => onSelectPreset(p)}
              className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0D0D0D] hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px]">
                  {p.type}
                </span>
                <span className="text-neutral-900 dark:text-white font-semibold">₹{(p.budget / 100000).toFixed(1)}L</span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition">
                  {p.title}
                </h4>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  {p.vibe}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>{p.guests} Guests</span>
                <span className="flex items-center gap-1 text-neutral-900 dark:text-white text-[11px] font-sans font-semibold group-hover:translate-x-1 transition-transform">
                  Load <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────── 4. EDITORIAL PILLARS (Clean Monochrome Grid) ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-200/60 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <DollarSign className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Zero Variance Math</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Eliminate surprise catering and venue overtime charges with algorithmic percentage allocations.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-200/60 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <Clock className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Run of Show Sequencing</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Coordinate sound checks, grand entries, and meal station openings into a synchronized schedule.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-200/60 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Vendor Checkpoints</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Track token advances, menu tasting approvals, and media shot lists in an actionable checklist.
          </p>
        </div>
      </div>

    </div>
  );
}