import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, MapPin, Users, DollarSign, SlidersHorizontal } from 'lucide-react';

export default function HomeState({ onGenerate }) {
  const [prompt, setPrompt] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Optional details
  const [details, setDetails] = useState({
    eventType: 'wedding',
    guests: 150,
    budget: 1200000,
    currency: 'INR',
    date: '',
    location: '',
    mode: 'balanced'
  });

  const suggestions = [
    { label: '💍 Wedding', text: "Sister's wedding, 200 guests, 12 lakh, Jaipur, December" },
    { label: '🎂 Birthday', text: 'Surprise 30th birthday, $500, 20 people, I have 2 weeks' },
    { label: '🤝 Community event', text: 'Community Diwali fundraiser for 300 people, tiny budget, volunteers only' },
    { label: '✨ Surprise me', text: 'Help me plan something' }
  ];

  const handleSuggestionClick = (text) => {
    setPrompt(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      {/* Big Headline */}
      <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-text mb-4">
        What are we celebrating?
      </h1>

      {/* Subline */}
      <p className="text-base sm:text-lg text-text-muted max-w-xl mb-9 font-normal leading-relaxed">
        Describe your event in a sentence. AI builds the budget, timeline and checklist.
      </p>

      {/* Modern Large AI Prompt Box */}
      <form onSubmit={handleSubmit} className="w-full text-left mb-4">
        <div className="relative rounded-[20px] bg-white border border-border shadow-[0_8px_30px_rgba(91,58,87,0.06)] focus-within:border-primary focus-within:ring-2 focus-within:ring-blush transition-all p-3 sm:p-4">
          <textarea
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
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Generate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* 4 Small Suggestion Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 w-full">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestionClick(s.text)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-blush/60 border border-border text-xs font-medium text-text transition cursor-pointer shadow-2xs"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Collapsed Link: "Add details (optional)" */}
      <div className="w-full text-center mb-10">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary transition cursor-pointer py-1"
        >
          <span>{showDetails ? 'Hide details' : 'Add details (optional)'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Collapsible 2-Column Grid */}
        {showDetails && (
          <div className="mt-4 p-5 rounded-[20px] bg-white border border-border shadow-[0_8px_30px_rgba(91,58,87,0.06)] text-left grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            {/* Event Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Event Category
              </label>
              <select
                value={details.eventType}
                onChange={(e) => setDetails({ ...details, eventType: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs font-medium text-text outline-none"
              >
                <option value="wedding">💍 Wedding &amp; Reception</option>
                <option value="birthday">🎂 Birthday / Milestone</option>
                <option value="community">🤝 Community / Fundraiser</option>
              </select>
            </div>

            {/* Guest Count */}
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Headcount (Guests)</span>
              </label>
              <input
                type="number"
                min="5"
                max="2000"
                value={details.guests}
                onChange={(e) => setDetails({ ...details, guests: parseInt(e.target.value, 10) || 50 })}
                className="w-full p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs font-medium text-text outline-none"
              />
            </div>

            {/* Budget & Currency */}
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-accent-gold" />
                <span>Budget &amp; Currency</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={details.currency}
                  onChange={(e) => setDetails({ ...details, currency: e.target.value })}
                  className="p-2 rounded-xl bg-surface-soft/70 border border-border text-xs font-bold text-text outline-none"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={details.budget}
                  onChange={(e) => setDetails({ ...details, budget: parseInt(e.target.value, 10) || 0 })}
                  className="flex-1 p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs font-medium text-text outline-none"
                />
              </div>
            </div>

            {/* City / Date */}
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-plum" />
                <span>City / Region</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Jaipur, Pune, NY"
                value={details.location}
                onChange={(e) => setDetails({ ...details, location: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-surface-soft/70 border border-border text-xs font-medium text-text outline-none"
              />
            </div>

            {/* Planning Mode */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                <span>Planning Mode</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'balanced', label: '🔵 Balanced' },
                  { id: 'budgetSaver', label: '🟢 Budget-Saver' },
                  { id: 'luxury', label: '🟣 Luxury' },
                  { id: 'lastMinute', label: '⚡ Last-Minute' }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setDetails({ ...details, mode: m.id })}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition cursor-pointer ${
                      details.mode === m.id
                        ? 'bg-bg border-primary text-primary font-bold'
                        : 'bg-surface-soft/60 border-border text-text-muted'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tiny Footer Line */}
      <p className="text-xs text-text-muted mt-auto">
        Prices are estimates. Always get 2–3 quotes.
      </p>
    </div>
  );
}
