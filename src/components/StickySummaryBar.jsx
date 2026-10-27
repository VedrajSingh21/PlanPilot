import React from 'react';
import { Printer, Copy, MessageSquare, Bookmark, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../plannerCore.js';

export default function StickySummaryBar({
  snapshot,
  completionPct,
  onOpenRefine,
  onPrint,
  onCopyText,
  onSavePlan,
  onOpenInvite,
  onOpenRunSheet
}) {
  return (
    <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md border-b border-border shadow-xs print-hide py-2.5 px-4 transition-all">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Event Summary & Completion */}
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-sm text-text hidden sm:inline">
            {snapshot.eventName}
          </span>
          <span className="text-text-muted">
            {snapshot.guests} guests · <strong className="text-primary">{formatCurrency(snapshot.totalBudget, snapshot.currency)}</strong>
          </span>

          <div className="flex items-center gap-1.5 pl-2 border-l border-border">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7E9F7A]" />
            <span className="font-semibold text-text">{completionPct}% Tasks Done</span>
          </div>
        </div>

        {/* Center: Jump Links */}
        <div className="hidden lg:flex items-center gap-3 text-text-muted font-medium">
          <a href="#sec-snapshot" className="hover:text-primary transition">Snapshot</a>
          <a href="#sec-budget" className="hover:text-primary transition">Budget</a>
          <a href="#sec-timeline" className="hover:text-primary transition">Timeline</a>
          <a href="#sec-vendors" className="hover:text-primary transition">Vendors</a>
          <a href="#sec-ideas" className="hover:text-primary transition">Ideas</a>
          <a href="#sec-nextsteps" className="hover:text-primary transition">Next Steps</a>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRunSheet}
            className="px-2.5 py-1 rounded-lg bg-surface-soft hover:bg-blush text-text font-medium transition cursor-pointer"
            title="Hour-by-hour day of schedule"
          >
            🕒 Run Sheet
          </button>

          <button
            onClick={onOpenInvite}
            className="px-2.5 py-1 rounded-lg bg-surface-soft hover:bg-blush text-text font-medium transition cursor-pointer"
            title="Invitation wording drafts"
          >
            ✉️ Invites
          </button>

          <button
            onClick={onCopyText}
            className="px-2.5 py-1 rounded-lg bg-surface-soft hover:bg-blush text-text font-medium transition cursor-pointer flex items-center gap-1"
            title="Copy full markdown plan"
          >
            <Copy className="w-3 h-3 text-text-muted" />
            <span>Copy</span>
          </button>

          <button
            onClick={onPrint}
            className="px-2.5 py-1 rounded-lg bg-surface-soft hover:bg-blush text-text font-medium transition cursor-pointer flex items-center gap-1"
            title="Print or Save PDF"
          >
            <Printer className="w-3 h-3 text-text-muted" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={onSavePlan}
            className="px-3 py-1 rounded-lg bg-sage hover:bg-[#C9DEC6] text-text font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Bookmark className="w-3 h-3 text-plum" />
            <span>Save</span>
          </button>

          <button
            onClick={onOpenRefine}
            className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Refine</span>
          </button>
        </div>
      </div>
    </div>
  );
}
