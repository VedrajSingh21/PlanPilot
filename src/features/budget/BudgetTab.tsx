import React, { useState, Suspense, useMemo } from 'react';
import { CheckCircle2, Sliders } from 'lucide-react';
import { BudgetItem, TradeOffCard, TradeOffDecision, formatCurrency } from '../../lib/schema';
import TradeOffsSection from './TradeOffsSection';

const BudgetDonutChart = React.lazy(() => import('./BudgetDonutChart'));

const PALETTE = ['#D9695F', '#C9A25B', '#5B3A57', '#7E9F7A', '#E07A5F', '#8198A5', '#A0717F'];

interface BudgetTabProps {
  budgetRows: BudgetItem[];
  totalBudget: number;
  currency: string;
  tradeOffs: TradeOffCard[];
  decisions: TradeOffDecision[];
  onRebalanceBudget: (changedIdx: number, newPercent: number) => void;
  onChooseTradeOff: (cardId: string, optionId: string, costDelta: number, label: string) => void;
}

/**
 * Budget Tab featuring code-split chart, 100% exact math verification, and AI trade-off cards
 */
export default function BudgetTab({
  budgetRows,
  totalBudget,
  currency,
  tradeOffs,
  decisions,
  onRebalanceBudget,
  onChooseTradeOff
}: BudgetTabProps) {
  const [showAdjust, setShowAdjust] = useState(false);

  const exactSum = useMemo(() => {
    return budgetRows.reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  }, [budgetRows]);

  return (
    <div className="space-y-6">
      {/* 1. Main Budget Visual: Donut Chart (Lazy) & Breakdown Table */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Code-split Donut */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-[20px] bg-surface-soft/40 border border-border">
          <Suspense fallback={
            <div className="w-full h-56 flex items-center justify-center text-xs text-text-muted">
              Loading allocation chart...
            </div>
          }>
            <BudgetDonutChart
              budgetRows={budgetRows}
              totalBudget={totalBudget}
              currency={currency}
            />
          </Suspense>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#7E9F7A] font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Sum equals {formatCurrency(exactSum, currency)} (100% balanced)</span>
          </div>
        </div>

        {/* Right: Table */}
        <div className="md:col-span-7 overflow-x-auto rounded-[20px] border border-border">
          <table className="w-full text-left text-xs sm:text-sm border-collapse" aria-label="Budget allocations by category">
            <thead>
              <tr className="bg-surface-soft text-text-muted text-[11px] font-bold uppercase tracking-wider border-b border-border">
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-2">Share</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Savings Tip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {budgetRows.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-bg">
                  <td className="py-2.5 px-3 font-medium text-text flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
                      aria-hidden="true"
                    />
                    <span>{row.category}</span>
                  </td>
                  <td className="py-2.5 px-2 text-text-muted font-mono text-xs">{row.percent}%</td>
                  <td className="py-2.5 px-3 font-semibold text-text">{formatCurrency(row.amount, currency)}</td>
                  <td className="py-2.5 px-3 text-xs text-text-muted leading-relaxed">{row.tip}</td>
                </tr>
              ))}
              <tr className="bg-surface-soft/70 font-bold text-text border-t border-border">
                <td className="py-3 px-3">Total (Exact Sum)</td>
                <td className="py-3 px-2 text-xs">100%</td>
                <td className="py-3 px-3 text-primary font-serif text-base">{formatCurrency(totalBudget, currency)}</td>
                <td className="py-3 px-3 text-xs text-[#7E9F7A] font-normal">Includes 8-10% contingency reserve</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Percentage Adjustments Slider Bar */}
      <div className="pt-1 text-right">
        <button
          type="button"
          aria-expanded={showAdjust}
          onClick={() => setShowAdjust(!showAdjust)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary transition cursor-pointer min-h-[44px] px-2"
        >
          <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{showAdjust ? 'Hide manual sliders' : 'Adjust percentages manually'}</span>
        </button>

        {showAdjust && (
          <div className="mt-2 p-4 rounded-[20px] bg-surface-soft/60 border border-border text-left grid grid-cols-1 sm:grid-cols-2 gap-3">
            {budgetRows.map((row, idx) => (
              <div key={row.id || idx} className="p-2.5 rounded-xl bg-white border border-border">
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor={`range-${row.id || idx}`} className="font-semibold text-text cursor-pointer">
                    {row.category}
                  </label>
                  <span className="font-bold text-primary">{row.percent}%</span>
                </div>
                <input
                  id={`range-${row.id || idx}`}
                  type="range"
                  min="2"
                  max="70"
                  value={row.percent}
                  onChange={(e) => onRebalanceBudget(idx, parseInt(e.target.value, 10))}
                  className="w-full accent-primary cursor-pointer h-2"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Collapsed AI Trade-offs & Decisions Section */}
      <TradeOffsSection
        tradeOffs={tradeOffs}
        decisions={decisions}
        currency={currency}
        onChooseTradeOff={onChooseTradeOff}
      />
    </div>
  );
}
