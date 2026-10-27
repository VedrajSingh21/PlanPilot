import React from 'react';
import { X, Bookmark, Trash2, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../plannerCore.js';

export default function SavedPlansModal({
  isOpen,
  onClose,
  savedPlans,
  onLoadPlan,
  onDeletePlan,
  onClearAll
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-text/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-border shadow-[0_16px_40px_rgba(91,58,87,0.15)] max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-bg">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-xl font-bold text-text">
              My Saved Plans ({savedPlans.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-soft transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {savedPlans.length === 0 ? (
            <div className="py-12 text-center text-text-muted">
              <p className="font-serif text-lg mb-1">No saved plans yet</p>
              <p className="text-xs">Click "Save" on the top bar to save any plan scenario to this list.</p>
            </div>
          ) : (
            savedPlans.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-surface-soft/50 border border-border hover:border-primary/30 transition flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-serif font-bold text-base text-text">
                    {item.plan.snapshot.eventName}
                  </h4>
                  <div className="text-xs text-text-muted mt-0.5">
                    {item.plan.snapshot.guests} guests · <strong className="text-primary">{formatCurrency(item.plan.snapshot.totalBudget, item.plan.snapshot.currency)}</strong> · {item.plan.snapshot.mode}
                  </div>
                  <div className="text-[10px] text-[#A09CA8] mt-1">Saved: {item.timestamp}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { onLoadPlan(item.plan); onClose(); }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-primary hover:text-white border border-border text-xs font-semibold text-text transition shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Load</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePlan(item.id)}
                    className="p-1.5 rounded-xl text-[#A09CA8] hover:text-primary hover:bg-white transition cursor-pointer"
                    title="Delete saved plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {savedPlans.length > 0 && (
          <div className="p-4 border-t border-border bg-bg flex justify-between items-center text-xs">
            <button
              onClick={onClearAll}
              className="text-primary-dark hover:underline cursor-pointer"
            >
              Clear all history
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-border font-medium text-text hover:bg-surface-soft transition cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
