import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Users, Sparkles, MapPin, IndianRupee, Check, Calendar } from 'lucide-react';

export default function Wizard({ eventData, setEventData, onSubmit, loading }) {
  const [step, setStep] = useState(1);

  const categories = [
    { id: 'Wedding', title: 'Wedding & Reception', note: 'Ceremonies, dinners, and family rituals' },
    { id: 'Birthday', title: 'Birthday & Milestone', note: 'Private bashes and themed celebrations' },
    { id: 'Community', title: 'College & Community Fest', note: 'Meetups, cultural nights, and hackathons' },
    { id: 'Corporate', title: 'Corporate & Dinners', note: 'Product launches, annual galas, and mixers' }
  ];

  const perHead = Math.round(Number(eventData.budget || 0) / (Number(eventData.guestCount) || 1));

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-6">
      
      {/* LEFT: Full Width Configuration Deck (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: 1, label: '1. Event Basics' },
            { num: 2, label: '2. Scale & Budget' },
            { num: 3, label: '3. Style & Needs' }
          ].map((item) => (
            <div
              key={item.num}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                step === item.num
                  ? 'border-violet-500 bg-violet-50/80 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300'
                  : step > item.num
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === item.num ? 'bg-violet-600 text-white' : step > item.num ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {step > item.num ? '✓' : item.num}
              </span>
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: EVENT DETAILS */}
        {step === 1 && (
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Tell us about your event</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Start by giving your celebration a name and choosing the right category.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">Event Name</label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  placeholder="e.g. Raj & Simran's Wedding Reception"
                  className="w-full px-4 py-3 rounded-2xl border text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">Select Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setEventData({ ...eventData, type: c.id })}
                      className={`p-4 rounded-2xl border text-left transition ${
                        eventData.type === c.id
                          ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/40 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className={`text-sm font-bold ${eventData.type === c.id ? 'text-violet-700 dark:text-violet-300' : 'text-slate-800 dark:text-slate-200'}`}>
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{c.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">Location / City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={eventData.location}
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                    placeholder="e.g. Kolkata, India"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 flex items-center gap-2 transition"
              >
                Set Scale & Budget <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GUESTS & BUDGET */}
        {step === 2 && (
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Estimate numbers & budget</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Gives the AI realistic boundaries to allocate venue, food, and decor.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">Estimated Guest Count</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="number"
                    value={eventData.guestCount}
                    onChange={(e) => setEventData({ ...eventData, guestCount: Number(e.target.value) })}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">Total Expected Budget</label>
                <div className="grid grid-cols-4 gap-3">
                  <select
                    value={eventData.currency}
                    onChange={(e) => setEventData({ ...eventData, currency: e.target.value })}
                    className="col-span-1 px-3 py-3 rounded-2xl border text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="₹">₹ INR</option>
                    <option value="$">$ USD</option>
                    <option value="€">€ EUR</option>
                  </select>
                  <input
                    type="number"
                    value={eventData.budget}
                    onChange={(e) => setEventData({ ...eventData, budget: Number(e.target.value) })}
                    className="col-span-3 px-4 py-3 rounded-2xl border text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Calculated Per-Guest Spend:</span>
                <span className="font-bold text-violet-600 dark:text-violet-400 text-sm">
                  {eventData.currency}{perHead.toLocaleString()} / guest
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 flex items-center gap-2 transition"
              >
                Next: Vibe & Style <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VIBE & REQUESTS */}
        {step === 3 && (
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">What vibe do you want?</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Mention special themes, music genres, food varieties, or special entries.</p>
            </div>

            <div>
              <textarea
                rows={4}
                value={eventData.vibe}
                onChange={(e) => setEventData({ ...eventData, vibe: e.target.value })}
                placeholder="e.g. Warm amber candle lighting, live acoustic Hindi/English songs, delicious starter counters, and simple elegant photo spots."
                className="w-full p-4 rounded-2xl border text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:bg-white dark:focus:bg-slate-800 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={onSubmit}
                disabled={loading}
                className="px-8 py-3.5 rounded-2xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/30 flex items-center gap-2.5 transition active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {loading ? 'Generating Masterplan...' : 'Generate Complete Event Plan'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* RIGHT: Responsive Live Plan Preview (5 Cols) */}
      <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Live Snapshot</span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">{eventData.title || "Untitled Celebration"}</h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> {eventData.location || "City not set"} • {eventData.type}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 block">Total Capacity</span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">{eventData.guestCount} Guests</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 block">Total Budget</span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">{eventData.currency}{Number(eventData.budget).toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-violet-50/60 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40">
          <span className="text-xs font-bold text-violet-700 dark:text-violet-300 block mb-1">Theme & Vision Input</span>
          <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
            "{eventData.vibe || "No specific instructions provided yet."}"
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Realtime configuration synced and ready.</span>
        </div>
      </div>

    </div>
  );
}