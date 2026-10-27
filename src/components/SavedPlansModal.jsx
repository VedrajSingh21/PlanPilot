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
    <div className="fixed inset-0 z-50 bg-[#2B2A33]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#EDE4DB] shadow-[0_16px_40px_rgba(91,58,87,0.15)] max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EDE4DB] flex items-center justify-between bg-[#FBF8F3]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#D9695F]" />
            <h3 className="font-serif text-xl font-bold text-[#2B2A33]">
              My Saved Plans ({savedPlans.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#6E6A78] hover:text-[#2B2A33] hover:bg-[#F7EFE8] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {savedPlans.length === 0 ? (
            <div className="py-12 text-center text-[#6E6A78]">
              <p className="font-serif text-lg mb-1">No saved plans yet</p>
              <p className="text-xs">Click "Save" on the top bar to save any plan scenario to this list.</p>
            </div>
          ) : (
            savedPlans.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#F7EFE8]/50 border border-[#EDE4DB] hover:border-[#D9695F]/30 transition flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-serif font-bold text-base text-[#2B2A33]">
                    {item.plan.snapshot.eventName}
                  </h4>
                  <div className="text-xs text-[#6E6A78] mt-0.5">
                    {item.plan.snapshot.guests} guests · <strong className="text-[#D9695F]">{formatCurrency(item.plan.snapshot.totalBudget, item.plan.snapshot.currency)}</strong> · {item.plan.snapshot.mode}
                  </div>
                  <div className="text-[10px] text-[#A09CA8] mt-1">Saved: {item.timestamp}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { onLoadPlan(item.plan); onClose(); }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#D9695F] hover:text-white border border-[#EDE4DB] text-xs font-semibold text-[#2B2A33] transition shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Load</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePlan(item.id)}
                    className="p-1.5 rounded-xl text-[#A09CA8] hover:text-[#D9695F] hover:bg-white transition cursor-pointer"
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
          <div className="p-4 border-t border-[#EDE4DB] bg-[#FBF8F3] flex justify-between items-center text-xs">
            <button
              onClick={onClearAll}
              className="text-[#B9524A] hover:underline cursor-pointer"
            >
              Clear all history
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#EDE4DB] font-medium text-[#2B2A33] hover:bg-[#F7EFE8] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
