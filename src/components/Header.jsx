import React from 'react';
import { Sparkles, Bookmark, Settings, Heart } from 'lucide-react';

export default function Header({ savedCount, onOpenSaved, onOpenSettings, planSource }) {
  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-primary to-blush flex items-center justify-center shadow-[0_4px_16px_rgba(217,105,95,0.25)] text-xl">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-text">
                PlanPilot
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-full bg-blush text-primary-dark border border-blush">
                AI Planner
              </span>
            </div>
            <p className="text-xs text-text-muted hidden sm:block">Warm · Organized · Practical Event Blueprints</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {planSource === 'template' && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-soft text-text-muted border border-border">
              <span className="w-2 h-2 rounded-full bg-accent-gold" />
              Smart Template Mode
            </span>
          )}

          {planSource === 'gemini' && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sage text-text border border-sage">
              <Sparkles className="w-3.5 h-3.5 text-plum" />
              Gemini AI Connected
            </span>
          )}

          <button
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-border text-sm font-medium text-text hover:bg-surface-soft hover:border-primary/30 transition shadow-xs"
          >
            <Bookmark className="w-4 h-4 text-primary" />
            <span>Saved Plans</span>
            <span className="px-1.5 py-0.2 rounded-md bg-blush text-primary-dark text-xs font-semibold">
              {savedCount}
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white border border-border text-text-muted hover:text-text hover:bg-surface-soft transition shadow-xs"
            title="Configure Gemini API Key"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
