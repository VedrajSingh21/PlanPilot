import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Square, CheckSquare, ShieldCheck } from 'lucide-react';

export default function VendorsTab({ vendorChecklist, onToggleVendorItem }) {
  // Accordion open/close state: all open by default for scanning, toggleable per category
  const [openCategories, setOpenCategories] = useState(() => {
    const initial = {};
    if (vendorChecklist) {
      vendorChecklist.forEach((_, idx) => {
        initial[idx] = true;
      });
    }
    return initial;
  });

  const toggleCategory = (idx) => {
    setOpenCategories(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const tagStyles = {
    Ask: 'bg-[#EBF5FB] text-[#2980B9] border-[#AED6F1]',
    Confirm: 'bg-[#FFF3CD] text-[#856404] border-[#FFEEBA]',
    Contract: 'bg-sage text-text border-sage',
    Permit: 'bg-[#FADBD8] text-[#922B21] border-[#F5B7B1]',
    Safety: 'bg-blush text-primary-dark border-blush'
  };

  if (!vendorChecklist || vendorChecklist.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted text-sm bg-white rounded-[20px] border border-border">
        No vendor checkpoints found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vendorChecklist.map((cat, cIdx) => {
        const completedCount = cat.items.filter(i => i.completed).length;
        const totalCount = cat.items.length;
        const pct = Math.round((completedCount / (totalCount || 1)) * 100);
        const isOpen = openCategories[cIdx] !== false;

        return (
          <div
            key={cIdx}
            className="rounded-[20px] bg-white border border-border overflow-hidden transition-all shadow-2xs"
          >
            {/* Accordion Header */}
            <button
              type="button"
              onClick={() => toggleCategory(cIdx)}
              className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-bg transition cursor-pointer"
            >
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <span className="font-serif text-base sm:text-lg font-bold text-text">
                  {cat.category}
                </span>
                <span className="text-xs text-text-muted font-medium sm:hidden">
                  {completedCount}/{totalCount} done
                </span>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Thin progress bar */}
                <div className="flex-1 sm:w-36 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-surface-soft overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-text-muted hidden sm:inline">
                    {pct}%
                  </span>
                </div>

                <div className="text-text-muted shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </button>

            {/* Accordion Content */}
            {isOpen && (
              <div className="px-4 pb-5 pt-1 border-t border-border/60 space-y-2">
                {cat.items.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => onToggleVendorItem(item.id)}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                      item.completed
                        ? 'bg-sage/40 border-sage text-text-muted'
                        : 'bg-bg/60 border-border hover:border-primary/40 text-text'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-[#7E9F7A]" />
                      ) : (
                        <Square className="w-4 h-4 text-text-muted" />
                      )}
                    </div>
                    <div className="flex-1 text-xs sm:text-sm">
                      <span className={`inline-block px-1.5 py-0.5 mr-2 rounded text-[10px] font-bold border uppercase ${
                        tagStyles[item.tag] || 'bg-surface-soft text-text-muted'
                      }`}>
                        {item.tag}
                      </span>
                      <span className={`leading-relaxed ${item.completed ? 'line-through text-text-muted' : 'text-text'}`}>
                        {item.task}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Quiet Reminder */}
      <div className="p-3.5 rounded-xl bg-surface-soft/70 border border-border text-xs text-text-muted flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-accent-gold shrink-0" />
        <span>Always request 2–3 written quotes with cancellation terms and sound curfews before signing.</span>
      </div>
    </div>
  );
}
