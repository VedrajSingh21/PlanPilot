import React, { useState } from 'react';
import { Sparkles, X, Send, ArrowRight, Wand2 } from 'lucide-react';

export default function RefineDrawer({
  isOpen,
  onClose,
  onApplyRefinement,
  isRefining
}) {
  const [inputText, setInputText] = useState('');

  const chips = [
    { label: '💰 Cut budget 15%', prompt: 'Cut budget 15% and rebalance categories' },
    { label: '⚡ Make it a 2-month rush plan', prompt: 'Make it a 2-month rush plan with compressed timeline' },
    { label: '🥗 Make it vegetarian/Jain-friendly', prompt: 'Make it vegetarian/Jain-friendly with separate catering protocols' },
    { label: '🌧️ Make it outdoor with a rain plan', prompt: 'Make it outdoor with a rain backup and marquee plan' },
    { label: '🕒 Add a day-of run sheet', prompt: 'Add a day-of run sheet' },
    { label: '✉️ Write invitation text', prompt: 'Write invitation text' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onApplyRefinement(inputText.trim());
    setInputText('');
  };

  const handleChipClick = (prompt) => {
    onApplyRefinement(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-border shadow-[0_16px_40px_rgba(91,58,87,0.15)] z-50 flex flex-col transition-all animate-slide-left">
      {/* Drawer Header */}
      <div className="p-5 border-b border-border flex items-center justify-between bg-bg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blush flex items-center justify-center text-lg">
            ✨
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-text">
              Refine with AI
            </h3>
            <p className="text-xs text-text-muted">Instant plan adaptation with preserved budget math</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-soft transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Suggested Chips */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2.5">
            Suggested Refinement Chips:
          </span>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                disabled={isRefining}
                onClick={() => handleChipClick(chip.prompt)}
                className="px-3 py-1.5 rounded-xl bg-surface-soft hover:bg-blush border border-border text-xs font-medium text-text transition cursor-pointer text-left disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton indicator */}
        {isRefining && (
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Balancing budget &amp; re-choreographing celebration...</span>
            </div>
            <div className="h-3 rounded-full bg-border animate-pulse w-3/4" />
            <div className="h-3 rounded-full bg-border animate-pulse w-1/2" />
          </div>
        )}

        {/* Informative Guidance */}
        <div className="p-4 rounded-2xl bg-surface-soft/70 border border-border text-xs text-text-muted leading-relaxed">
          <p className="font-semibold text-text mb-1">💡 What you can ask:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>"Rebalance budget with 10% more on photography"</li>
            <li>"Switch to an intimate 30-person VIP dinner"</li>
            <li>"Add sustainable eco-friendly ideas"</li>
            <li>"Strict Jain dietary options only"</li>
          </ul>
        </div>
      </div>

      {/* Drawer Footer / Input Box */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-bg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRefining}
            placeholder="Type your adjustment request..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-border focus:border-primary text-sm text-text outline-none"
          />
          <button
            type="submit"
            disabled={isRefining || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-sm transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
