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
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-[#EDE4DB] shadow-[0_16px_40px_rgba(91,58,87,0.15)] z-50 flex flex-col transition-all animate-slide-left">
      {/* Drawer Header */}
      <div className="p-5 border-b border-[#EDE4DB] flex items-center justify-between bg-[#FBF8F3]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F6DFDB] flex items-center justify-center text-lg">
            ✨
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2B2A33]">
              Refine with AI
            </h3>
            <p className="text-xs text-[#6E6A78]">Instant plan adaptation with preserved budget math</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#6E6A78] hover:text-[#2B2A33] hover:bg-[#F7EFE8] transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Suggested Chips */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6A78] block mb-2.5">
            Suggested Refinement Chips:
          </span>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                disabled={isRefining}
                onClick={() => handleChipClick(chip.prompt)}
                className="px-3 py-1.5 rounded-xl bg-[#F7EFE8] hover:bg-[#F6DFDB] border border-[#EDE4DB] text-xs font-medium text-[#2B2A33] transition cursor-pointer text-left disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton indicator */}
        {isRefining && (
          <div className="p-4 rounded-2xl bg-[#FBF8F3] border border-[#EDE4DB] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D9695F]">
              <div className="w-3.5 h-3.5 border-2 border-[#D9695F] border-t-transparent rounded-full animate-spin" />
              <span>Balancing budget &amp; re-choreographing celebration...</span>
            </div>
            <div className="h-3 rounded-full bg-[#EDE4DB] animate-pulse w-3/4" />
            <div className="h-3 rounded-full bg-[#EDE4DB] animate-pulse w-1/2" />
          </div>
        )}

        {/* Informative Guidance */}
        <div className="p-4 rounded-2xl bg-[#F7EFE8]/70 border border-[#EDE4DB] text-xs text-[#6E6A78] leading-relaxed">
          <p className="font-semibold text-[#2B2A33] mb-1">💡 What you can ask:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>"Rebalance budget with 10% more on photography"</li>
            <li>"Switch to an intimate 30-person VIP dinner"</li>
            <li>"Add sustainable eco-friendly ideas"</li>
            <li>"Strict Jain dietary options only"</li>
          </ul>
        </div>
      </div>

      {/* Drawer Footer / Input Box */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#EDE4DB] bg-[#FBF8F3]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRefining}
            placeholder="Type your adjustment request..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#EDE4DB] focus:border-[#D9695F] text-sm text-[#2B2A33] outline-none"
          />
          <button
            type="submit"
            disabled={isRefining || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#D9695F] hover:bg-[#B9524A] text-white font-medium text-sm transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
