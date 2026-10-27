import React from 'react';
import { Sparkles, Bookmark, Settings, Heart } from 'lucide-react';

export default function Header({ savedCount, onOpenSaved, onOpenSettings, planSource }) {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF8F3]/90 backdrop-blur-md border-b border-[#EDE4DB] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D9695F] to-[#F6DFDB] flex items-center justify-center shadow-[0_4px_16px_rgba(217,105,95,0.25)] text-xl">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2B2A33]">
                PlanPilot
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-full bg-[#F6DFDB] text-[#B9524A] border border-[#F6DFDB]">
                AI Planner
              </span>
            </div>
            <p className="text-xs text-[#6E6A78] hidden sm:block">Warm · Organized · Practical Event Blueprints</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {planSource === 'template' && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F7EFE8] text-[#6E6A78] border border-[#EDE4DB]">
              <span className="w-2 h-2 rounded-full bg-[#C9A25B]" />
              Smart Template Mode
            </span>
          )}

          {planSource === 'gemini' && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#DCE8DA] text-[#2B2A33] border border-[#DCE8DA]">
              <Sparkles className="w-3.5 h-3.5 text-[#5B3A57]" />
              Gemini AI Connected
            </span>
          )}

          <button
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#EDE4DB] text-sm font-medium text-[#2B2A33] hover:bg-[#F7EFE8] hover:border-[#D9695F]/30 transition shadow-xs"
          >
            <Bookmark className="w-4 h-4 text-[#D9695F]" />
            <span>Saved Plans</span>
            <span className="px-1.5 py-0.2 rounded-md bg-[#F6DFDB] text-[#B9524A] text-xs font-semibold">
              {savedCount}
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white border border-[#EDE4DB] text-[#6E6A78] hover:text-[#2B2A33] hover:bg-[#F7EFE8] transition shadow-xs"
            title="Configure Gemini API Key"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
