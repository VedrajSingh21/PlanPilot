import { useState } from 'react';
import { ChevronDown, ChevronUp, Scale, Check, History, ArrowRight } from 'lucide-react';
import { TradeOffCard, TradeOffDecision, formatCurrency } from '../../lib/schema';

interface TradeOffsSectionProps {
  tradeOffs: TradeOffCard[];
  decisions: TradeOffDecision[];
  currency: string;
  onChooseTradeOff: (cardId: string, optionId: string, costDelta: number, label: string) => void;
}

/**
 * Collapsed Trade-offs section in Budget Tab
 * Enables hosts to evaluate realistic event trade-offs and live-rebalance budgets
 */
export default function TradeOffsSection({
  tradeOffs,
  decisions,
  currency,
  onChooseTradeOff
}: TradeOffsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!tradeOffs || tradeOffs.length === 0) return null;

  return (
    <div className="rounded-[20px] bg-white border border-border shadow-2xs overflow-hidden">
      {/* Header Accordion Toggle */}
      <button
        type="button"
        id="tradeoffs-accordion-btn"
        aria-expanded={isOpen}
        aria-controls="tradeoffs-panel"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-bg transition cursor-pointer min-h-[44px]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blush text-primary flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base sm:text-lg font-bold text-text">
                Budget Trade-Offs &amp; Decision Cards
              </h3>
              {decisions.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sage text-text">
                  {decisions.length} Active
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Compare strategic cost shifts (e.g. venue vs guest count, plated vs live food stations)
            </p>
          </div>
        </div>

        <div className="text-text-muted shrink-0">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div id="tradeoffs-panel" role="region" aria-labelledby="tradeoffs-accordion-btn" className="p-4 sm:p-5 pt-0 space-y-5 border-t border-border/60">
          {/* Decision Cards Grid */}
          <div className="grid grid-cols-1 gap-4 pt-3">
            {tradeOffs.map(card => {
              const activeDecision = decisions.find(d => d.cardId === card.id);

              return (
                <div
                  key={card.id}
                  className="p-4 rounded-xl bg-surface-soft/40 border border-border space-y-3"
                >
                  <div>
                    <h4 className="font-serif text-base font-bold text-text">
                      {card.title}
                    </h4>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      {card.impactDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {card.options.map(opt => {
                      const isSelected = activeDecision?.chosenOptionId === opt.id;
                      const hasSavings = opt.costDeltaAmount < 0;
                      const hasUpgrade = opt.costDeltaAmount > 0;

                      return (
                        <div
                          key={opt.id}
                          className={`p-3.5 rounded-xl border transition flex flex-col justify-between gap-3 ${
                            isSelected
                              ? 'bg-white border-primary shadow-xs ring-1 ring-primary'
                              : 'bg-white/80 border-border hover:border-primary/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-bold text-xs text-text">
                                {opt.label}
                              </span>
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                  hasSavings
                                    ? 'bg-sage text-text'
                                    : hasUpgrade
                                    ? 'bg-blush text-primary-dark'
                                    : 'bg-surface-soft text-text-muted'
                                }`}
                              >
                                {opt.costDeltaAmount === 0
                                  ? 'Baseline'
                                  : `${opt.costDeltaAmount > 0 ? '+' : ''}${formatCurrency(opt.costDeltaAmount, currency)}`}
                              </span>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed">
                              {opt.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => onChooseTradeOff(card.id, opt.id, opt.costDeltaAmount, opt.label)}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[38px] ${
                              isSelected
                                ? 'bg-primary text-white shadow-2xs'
                                : 'bg-surface-soft text-text hover:bg-blush'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Selected Choice</span>
                              </>
                            ) : (
                              <>
                                <span>Choose Option</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decisions History Log */}
          {decisions.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-border">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-text">
                <History className="w-3.5 h-3.5 text-primary" />
                <span>Recorded Decisions Log ({decisions.length})</span>
              </div>
              <ul className="divide-y divide-border text-xs text-text-muted">
                {decisions.map(d => (
                  <li key={d.id} className="py-2 flex items-center justify-between gap-3">
                    <span className="text-text font-medium">{d.chosenLabel}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-primary">
                        {d.costDelta > 0 ? `+${formatCurrency(d.costDelta, currency)}` : d.costDelta < 0 ? `-${formatCurrency(Math.abs(d.costDelta), currency)}` : 'Neutral'}
                      </span>
                      <span className="text-xs text-text-muted">{d.timestamp}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
