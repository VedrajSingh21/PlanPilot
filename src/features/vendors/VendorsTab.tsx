import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Square,
  CheckSquare,
  ShieldCheck,
  Mail,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { VendorCategory, formatCurrency } from '../../lib/schema';
import VendorMessageModal from './VendorMessageModal';

interface VendorsTabProps {
  vendorChecklist: VendorCategory[];
  currency: string;
  eventName: string;
  eventType: string;
  guests: number;
  location: string;
  dateOrTiming: string;
  onToggleVendorItem: (itemId: string) => void;
  onUpdateCategoryStatus: (catIdx: number, status: VendorCategory['status']) => void;
  onUpdateQuoteAmount: (catIdx: number, amount: number | null) => void;
  onCopyText: (text: string, msg: string) => void;
}

const tagStyles: Record<string, string> = {
  Ask: 'bg-[#EBF5FB] text-[#2980B9] border-[#AED6F1]',
  Confirm: 'bg-[#FFF3CD] text-[#856404] border-[#FFEEBA]',
  Contract: 'bg-sage text-text border-sage',
  Permit: 'bg-[#FADBD8] text-[#922B21] border-[#F5B7B1]',
  Safety: 'bg-blush text-primary-dark border-blush'
};

export default function VendorsTab({
  vendorChecklist,
  currency,
  eventName,
  eventType,
  guests,
  location,
  dateOrTiming,
  onToggleVendorItem,
  onUpdateCategoryStatus,
  onUpdateQuoteAmount,
  onCopyText
}: VendorsTabProps) {
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [draftModal, setDraftModal] = useState<{ isOpen: boolean; category: string; text: string }>({
    isOpen: false,
    category: '',
    text: ''
  });

  const toggleCategory = (idx: number) => {
    setOpenCategories(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleDraftMessage = async (cat: VendorCategory) => {
    const checkpoints = cat.items.map(i => i.task);
    try {
      const res = await fetch('/api/vendor-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat.category,
          eventName,
          eventType,
          guests,
          location,
          dateOrTiming,
          budgetLineAmount: cat.budgetLineAmount,
          currency,
          checkpoints
        })
      });
      const data = await res.json();
      if (data.ok && data.draftMessage) {
        setDraftModal({ isOpen: true, category: cat.category, text: data.draftMessage });
        return;
      }
    } catch {
      // Fallback
    }

    const fallback = `Subject: Inquiry: Availability & Quote for ${eventName} (${dateOrTiming})\n\nDear [Vendor Contact Name],\n\nI am organizing ${eventName} (${eventType}) in ${location} around ${dateOrTiming} for ~${guests} guests.\n\nWe are currently selecting our ${cat.category} vendor. Please share your packages, baseline inclusions, cancellation terms, and sound/curfew protocols.\n\nLooking forward to your reply.\n\nWarm regards,\n[Your Name]`;
    setDraftModal({ isOpen: true, category: cat.category, text: fallback });
  };

  return (
    <div className="space-y-4">
      {vendorChecklist.map((cat, cIdx) => {
        const completedCount = cat.items.filter(i => i.completed).length;
        const totalCount = cat.items.length;
        const pct = Math.round((completedCount / (totalCount || 1)) * 100);
        const isOpen = openCategories[cIdx] !== false;

        const budgetTarget = cat.budgetLineAmount || 0;
        const quote = cat.quoteAmount;
        const hasQuote = quote !== null && quote !== undefined && quote > 0;
        const diff = hasQuote ? budgetTarget - quote : 0;

        return (
          <div key={cIdx} className="rounded-[20px] bg-white border border-border overflow-hidden transition-all shadow-2xs">
            {/* Category Header */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => toggleCategory(cIdx)}
                    className="font-serif text-base sm:text-lg font-bold text-text hover:text-primary transition cursor-pointer text-left"
                  >
                    {cat.category}
                  </button>

                  {/* Status Dropdown */}
                  <select
                    value={cat.status || 'To contact'}
                    onChange={(e) => onUpdateCategoryStatus(cIdx, e.target.value as VendorCategory['status'])}
                    aria-label={`Status for ${cat.category}`}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                      cat.status === 'Booked'
                        ? 'bg-sage border-sage text-text'
                        : cat.status === 'Quoted'
                        ? 'bg-[#FFF3CD] border-[#FFEEBA] text-[#856404]'
                        : 'bg-surface-soft border-border text-text-muted'
                    }`}
                  >
                    <option value="To contact">To contact</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>

                <div className="text-xs text-text-muted">
                  {completedCount}/{totalCount} checkpoints completed ({pct}%)
                </div>
              </div>

              {/* Actions & Quotes Input */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-surface-soft/60 border border-border px-2.5 py-1.5 rounded-xl">
                  <label htmlFor={`quote-${cIdx}`} className="text-[11px] font-semibold text-text-muted">
                    Quote:
                  </label>
                  <input
                    id={`quote-${cIdx}`}
                    type="number"
                    placeholder="Enter quote"
                    value={cat.quoteAmount || ''}
                    onChange={(e) => {
                      const val = e.target.value ? parseInt(e.target.value, 10) : null;
                      onUpdateQuoteAmount(cIdx, val);
                    }}
                    className="w-24 bg-transparent text-xs font-semibold text-text outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDraftMessage(cat)}
                  className="px-3 py-1.5 rounded-xl bg-blush text-primary-dark hover:bg-primary hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[36px]"
                >
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Draft message</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCategory(cIdx)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text cursor-pointer"
                  aria-label={isOpen ? 'Collapse category' : 'Expand category'}
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Compare Quotes Row */}
            <div className="px-4 py-2 bg-surface-soft/40 border-t border-b border-border/60 text-xs flex flex-wrap items-center justify-between gap-2">
              <span className="text-text-muted">
                Allocated Budget Line: <strong className="text-text">{formatCurrency(budgetTarget, currency)}</strong>
              </span>

              {hasQuote ? (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-text">Lowest Quote: {formatCurrency(quote, currency)}</span>
                  {diff >= 0 ? (
                    <span className="px-2 py-0.5 rounded-md bg-sage text-text text-[11px] font-bold flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>{formatCurrency(diff, currency)} under budget</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-blush text-primary-dark text-[11px] font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{formatCurrency(Math.abs(diff), currency)} over budget</span>
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-text-muted italic text-xs">
                  No quote entered yet. Enter quote above to compare against budget.
                </span>
              )}
            </div>

            {/* Checklist Items */}
            {isOpen && (
              <div className="p-4 space-y-2 border-t border-border/40">
                {cat.items.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => onToggleVendorItem(item.id)}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer min-h-[44px] ${
                      item.completed
                        ? 'bg-sage/40 border-sage text-text-muted'
                        : 'bg-bg/60 border-border hover:border-primary/40 text-text'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-[#7E9F7A]" aria-hidden="true" />
                      ) : (
                        <Square className="w-4 h-4 text-text-muted" aria-hidden="true" />
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

      {/* Advisory Reminder */}
      <div className="p-3.5 rounded-xl bg-surface-soft/70 border border-border text-xs text-text-muted flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-accent-gold shrink-0" aria-hidden="true" />
        <span>PlanPilot never invents vendor names or exact prices. Always request 2–3 written quotes with cancellation terms before signing.</span>
      </div>

      {/* Draft Inquiry Modal */}
      <VendorMessageModal
        isOpen={draftModal.isOpen}
        onClose={() => setDraftModal({ isOpen: false, category: '', text: '' })}
        category={draftModal.category}
        draftText={draftModal.text}
        onCopy={onCopyText}
      />
    </div>
  );
}
