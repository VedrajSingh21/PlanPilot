import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { PlanRequest } from '../lib/schema';

interface HomeStateProps {
  onGenerate: (data: { prompt: string; details: PlanRequest | null }) => void;
  isLoading?: boolean;
}

export default function HomeState({ onGenerate, isLoading = false }: HomeStateProps) {
  const [prompt, setPrompt] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Optional manual details
  const [details, setDetails] = useState<PlanRequest>({
    eventType: 'wedding',
    guests: 150,
    budget: 1200000,
    currency: 'INR',
    timing: '',
    location: '',
    mode: 'balanced'
  });

  const suggestions = [
    { label: '💍 Wedding', text: "Sister's wedding, 200 guests, 12 lakh, Jaipur, December" },
    { label: '🎂 Birthday', text: 'Surprise 30th birthday, $500, 20 people, I have 2 weeks' },
    { label: '🤝 Community event', text: 'Community Diwali fundraiser for 300 people, tiny budget, volunteers only' },
    { label: '✨ Surprise me', text: 'Help me plan something' }
  ];

  const handleSuggestionClick = (text: string) => {
    setPrompt(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const promptText = prompt.trim();
    if (!promptText && !showDetails) {
      onGenerate({ prompt: 'Help me plan something', details: null });
      return;
    }
    onGenerate({
      prompt: promptText || 'Custom celebration',
      details: showDetails ? details : null
    });
  };

  return (
    <div className="max-w-180 mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 flex flex-col items-center text-center">
      {/* Big Headline - Landmark h1 */}
      <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-text mb-4">
        What are we celebrating?
      </h1>

      {/* Subline */}
      <p className="text-base sm:text-lg text-text-muted max-w-xl mb-9 font-normal leading-relaxed">
        Describe your event in a sentence. AI builds the budget, timeline and checklist.
      </p>

      {/* Modern Large AI Prompt Box */}
      <form onSubmit={handleSubmit} className="w-full text-left mb-4">
        <label htmlFor="main-prompt" className="sr-only">
          Describe your celebration details
        </label>
        <div className="relative rounded-[20px] bg-white border border-border shadow-[0_8px_30px_rgba(91,58,87,0.06)] focus-within:border-primary focus-within:ring-2 focus-within:ring-blush transition-all p-3 sm:p-4">
          <textarea
            id="main-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Sister's wedding, 200 guests, 12 lakh, Jaipur, December"
            className="w-full bg-transparent text-text placeholder:text-text-muted/60 text-base outline-none resize-none pr-12 leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <span className="text-[11px] text-text-muted">
              Press <kbd className="px-1.5 py-0.5 rounded bg-surface-soft font-mono text-[10px]">Enter ↵</kbd> to generate
            </span>

            {/* Coral Arrow Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
              aria-label="Generate event plan"
            >
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>

      {/* Quick Suggestion Chips */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2 mb-6" role="group" aria-label="Sample event prompts">
        {suggestions.map((item, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => handleSuggestionClick(item.text)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-blush/60 border border-border text-text transition-all cursor-pointer shadow-2xs hover:shadow-xs min-h-[36px]"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Collapsible Specific Constraints Toggle */}
      <div className="w-full mb-8">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          aria-expanded={showDetails}
          aria-controls="constraints-panel"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-primary transition cursor-pointer py-1 min-h-[44px]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{showDetails ? 'Hide specific constraints' : '+ Add specific constraints (optional)'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" /> : <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />}
        </button>

        {showDetails && (
          <div id="constraints-panel" className="mt-3 p-5 rounded-[20px] bg-white border border-border shadow-xs text-left grid grid-cols-1 sm:grid-cols-2 gap-4 animate-scale-up">
            {/* Event Type */}
            <div>
              <label htmlFor="input-event-type" className="block text-xs font-bold text-text-muted mb-1">
                Event Type
              </label>
              <select
                id="input-event-type"
                value={details.eventType}
                onChange={(e) => setDetails({ ...details, eventType: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs text-text outline-none focus:border-primary cursor-pointer min-h-[40px]"
              >
                <option value="wedding">Wedding / Reception</option>
                <option value="birthday">Birthday / Milestone Party</option>
                <option value="community">Community / Fundraiser / Festival</option>
              </select>
            </div>

            {/* Mode */}
            <div>
              <label htmlFor="input-planning-mode" className="block text-xs font-bold text-text-muted mb-1">
                Planning Mode
              </label>
              <select
                id="input-planning-mode"
                value={details.mode}
                onChange={(e) => setDetails({ ...details, mode: e.target.value as PlanRequest['mode'] })}
                className="w-full p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs text-text outline-none focus:border-primary cursor-pointer min-h-[40px]"
              >
                <option value="balanced">Balanced (Recommended)</option>
                <option value="budgetSaver">Budget-Saver (Frugal &amp; DIY)</option>
                <option value="luxury">Luxury (High-End &amp; Lavish)</option>
                <option value="lastMinute">Last-Minute (Under 3 weeks)</option>
              </select>
            </div>

            {/* Guest Count */}
            <div>
              <label htmlFor="input-guest-count" className="block text-xs font-bold text-text-muted mb-1">
                Expected Guests
              </label>
              <input
                id="input-guest-count"
                type="number"
                min="5"
                max="5000"
                value={details.guests}
                onChange={(e) => setDetails({ ...details, guests: parseInt(e.target.value, 10) || 0 })}
                className="w-full p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs text-text outline-none focus:border-primary min-h-[40px]"
              />
            </div>

            {/* Budget & Currency */}
            <div>
              <label htmlFor="input-total-budget" className="block text-xs font-bold text-text-muted mb-1">
                Total Budget
              </label>
              <div className="flex gap-2">
                <select
                  aria-label="Currency"
                  value={details.currency}
                  onChange={(e) => setDetails({ ...details, currency: e.target.value })}
                  className="w-20 p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs font-semibold text-text outline-none cursor-pointer min-h-[40px]"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                <input
                  id="input-total-budget"
                  type="number"
                  min="0"
                  value={details.budget}
                  onChange={(e) => setDetails({ ...details, budget: parseInt(e.target.value, 10) || 0 })}
                  className="flex-1 p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs text-text outline-none focus:border-primary min-h-[40px]"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="input-location" className="block text-xs font-bold text-text-muted mb-1">
                City / Region
              </label>
              <input
                id="input-location"
                type="text"
                placeholder="e.g. Jaipur, Rajasthan"
                value={details.location}
                onChange={(e) => setDetails({ ...details, location: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs text-text outline-none focus:border-primary min-h-[40px]"
              />
            </div>

            {/* Timing */}
            <div>
              <label htmlFor="input-timing" className="block text-xs font-bold text-text-muted mb-1">
                Timeline / Target Date
              </label>
              <input
                id="input-timing"
                type="text"
                placeholder="e.g. December 2026 or In 3 months"
                value={details.timing}
                onChange={(e) => setDetails({ ...details, timing: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs text-text outline-none focus:border-primary min-h-[40px]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Discrete Privacy & Independence Notice */}
      <footer role="contentinfo" className="text-xs text-text-muted space-y-1">
        <div>PlanPilot never invents specific vendor names, telephone numbers, or exact prices as facts.</div>
        <div className="text-xs text-text-muted">Typical price ranges are provided as estimates. All budgets sum to 100% exactly.</div>
      </footer>
    </div>
  );
}
