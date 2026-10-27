import React from 'react';
import { Sparkles, Calendar, Users, DollarSign, MapPin, Feather, SlidersHorizontal, Check } from 'lucide-react';
import { CURRENCY_SYMBOLS } from '../plannerCore.js';

export default function SmartIntake({
  form,
  onChange,
  onSubmit,
  isLoading,
  loadingPhase
}) {
  const eventTypes = [
    { id: 'wedding', label: '💍 Wedding' },
    { id: 'birthday', label: '🎂 Birthday / Milestone' },
    { id: 'community', label: '🤝 Community / Fundraiser' }
  ];

  const guestRanges = [
    { label: 'Under 30', value: 25 },
    { label: '30–80', value: 50 },
    { label: '80–200', value: 150 },
    { label: '200+', value: 300 }
  ];

  const timingOptions = [
    { id: 'under_3_weeks', label: '⚡ Under 3 weeks' },
    { id: '1_3_months', label: '⏳ 1–3 months' },
    { id: '3_6_months', label: '🗓️ 3–6 months' },
    { id: '6_plus_months', label: '🏰 6+ months' }
  ];

  const modes = [
    { id: 'budgetSaver', label: '🟢 Budget-Saver', desc: 'DIY tips & smart compromises' },
    { id: 'balanced', label: '🔵 Balanced', desc: 'Optimal blend of style & cost' },
    { id: 'luxury', label: '🟣 Luxury', desc: 'Premium styling & bespoke touches' },
    { id: 'lastMinute', label: '⚡ Last-Minute', desc: 'Urgent 7-day priority checklist' }
  ];

  return (
    <section id="intake-card" className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-9 shadow-[0_8px_30px_rgba(91,58,87,0.06)] relative overflow-hidden">
        {/* Soft top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary via-blush to-accent-gold" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-7 pb-5 border-b border-border">
          <div>
            <h2 className="font-serif text-2xl font-bold text-text">
              Tell PlanPilot About Your Celebration
            </h2>
            <p className="text-sm text-text-muted mt-0.5">
              Select what you know, or leave blanks—we'll make realistic assumptions you can tweak anytime.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-soft text-plum border border-border">
            Single-Card Smart Intake
          </span>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* 1. Event Type Chips */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
              1. Event Type
            </label>
            <div className="flex flex-wrap gap-2.5">
              {eventTypes.map(t => {
                const active = form.eventType === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => onChange('eventType', t.id)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      active
                        ? 'bg-primary text-white shadow-[0_4px_14px_rgba(217,105,95,0.25)] border-transparent'
                        : 'bg-surface-soft text-text border border-border hover:bg-blush'
                    }`}
                  >
                    <span>{t.label}</span>
                    {active && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Guest Count & Budget (Two columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guests */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  2. Guest Count
                </label>
                <span className="text-sm font-bold text-text">
                  {form.guests} Guests
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2.5">
                {guestRanges.map(g => {
                  const active = form.guests === g.value;
                  return (
                    <button
                      type="button"
                      key={g.label}
                      onClick={() => onChange('guests', g.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? 'bg-text text-white'
                          : 'bg-surface-soft text-text-muted hover:bg-blush'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={form.guests}
                onChange={e => onChange('guests', parseInt(e.target.value, 10))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Budget */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-accent-gold" />
                  3. Total Target Budget
                </label>
                <div className="flex items-center gap-1.5">
                  <select
                    value={form.currency}
                    onChange={e => onChange('currency', e.target.value)}
                    className="text-xs font-semibold bg-surface-soft border border-border rounded-lg px-2 py-1 text-text outline-none cursor-pointer"
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                    <option value="CAD">C$ CAD</option>
                    <option value="AUD">A$ AUD</option>
                  </select>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif text-lg font-bold text-text-muted">
                  {CURRENCY_SYMBOLS[form.currency] || '$'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={form.budget}
                  onChange={e => onChange('budget', Math.max(0, parseInt(e.target.value, 10) || 0))}
                  placeholder="Enter budget ceiling"
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-surface-soft/70 border border-border focus:border-primary focus:bg-white text-text font-semibold text-base outline-none transition"
                />
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">
                ~{CURRENCY_SYMBOLS[form.currency] || '$'}{Math.round(form.budget / (form.guests || 1))} per guest average
              </p>
            </div>
          </div>

          {/* 3. Timing Chips & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
                4. Timeline Horizon
              </label>
              <div className="grid grid-cols-2 gap-2">
                {timingOptions.map(t => {
                  const active = form.timing === t.id;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => onChange('timing', t.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                        active
                          ? 'bg-text text-white shadow-xs'
                          : 'bg-surface-soft text-text border border-border hover:bg-blush'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
                City / Region &amp; Date (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => onChange('location', e.target.value)}
                    placeholder="e.g. Jaipur, Pune, NY"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-surface-soft/70 border border-border focus:bg-white outline-none"
                  />
                </div>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="date"
                    value={form.date || ''}
                    onChange={e => onChange('date', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-surface-soft/70 border border-border focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Free-Text Vibe, Theme, Dietary, Accessibility */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Vibe, Theme, Culture, Dietary or Accessibility Needs
            </label>
            <textarea
              rows={2}
              value={form.freeText}
              onChange={e => onChange('freeText', e.target.value)}
              placeholder="e.g. Royal heritage Rajasthani sangeet, pure vegetarian & Jain food needed, wheelchair ramp at venue, sunset pheras..."
              className="w-full p-3.5 rounded-2xl bg-surface-soft/50 border border-border focus:border-primary focus:bg-white text-sm text-text outline-none transition resize-none placeholder:text-text-muted/70"
            />
          </div>

          {/* 5. Planning Mode Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-plum" />
              Planning Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {modes.map(m => {
                const active = form.mode === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => onChange('mode', m.id)}
                    className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                      active
                        ? 'bg-bg border-primary shadow-xs ring-1 ring-primary'
                        : 'bg-surface-soft/60 border-border hover:bg-blush/50'
                    }`}
                  >
                    <div className="font-semibold text-xs text-text mb-0.5">{m.label}</div>
                    <div className="text-[10px] text-text-muted leading-tight">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-medium text-base shadow-[0_8px_24px_rgba(217,105,95,0.25)] hover:shadow-[0_12px_28px_rgba(217,105,95,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{loadingPhase || 'Crafting your personalized plan...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Celebration Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
