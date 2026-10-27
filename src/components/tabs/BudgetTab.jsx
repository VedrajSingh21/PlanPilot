import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, Sliders, HeartHandshake } from 'lucide-react';
import { formatCurrency } from '../../plannerCore.js';

const PALETTE = [
  '#D9695F', // Warm coral
  '#C9A25B', // Gold
  '#5B3A57', // Plum
  '#7E9F7A', // Sage
  '#E07A5F', // Terra cotta
  '#8198A5', // Slate
  '#A0717F'  // Mauve
];

export default function BudgetTab({
  budgetRows,
  totalBudget,
  currency,
  isVolunteersOnly,
  volunteerTracker,
  onRebalanceBudget
}) {
  const [showAdjust, setShowAdjust] = useState(false);

  // Verification sum
  const liveSum = budgetRows.reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  const isExact = liveSum === totalBudget;

  return (
    <div className="space-y-6">
      {/* Volunteers-Only Tracker if grassroots event */}
      {isVolunteersOnly && volunteerTracker && (
        <div className="p-5 rounded-[20px] bg-sage/40 border border-sage">
          <div className="flex items-center gap-2 mb-2">
            <HeartHandshake className="w-5 h-5 text-plum" />
            <h4 className="font-serif text-base font-bold text-text">
              Community In-Kind Donations &amp; Volunteer Pods
            </h4>
          </div>
          <p className="text-xs text-text-muted mb-4">
            Zero/tiny budget event: commercial fees are replaced with community sponsorships and volunteer task forces.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {volunteerTracker.map((v) => (
              <div key={v.id} className="p-3.5 rounded-xl bg-white border border-border">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-plum uppercase tracking-wide">{v.category}</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-soft font-bold text-text">
                    {v.confirmed}/{v.volunteersNeeded} Volunteers
                  </span>
                </div>
                <div className="text-sm font-semibold text-text">{v.role}</div>
                <div className="text-xs text-text-muted mt-0.5">Target: {v.inKindTarget}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Budget Grid: Donut (left) + Simple Table (right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Clean Donut Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-[20px] bg-surface-soft/40 border border-border">
          <div className="w-full h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetRows}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {budgetRows.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(value, currency), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#EDE4DB',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(91,58,87,0.08)',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Total Budget</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-text">
                {formatCurrency(totalBudget, currency)}
              </span>
              <span className="text-[10px] font-bold text-[#7E9F7A]">100% Balanced</span>
            </div>
          </div>

          {/* Quiet Check Indicator */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#7E9F7A] font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Total matches your budget exactly</span>
          </div>
        </div>

        {/* Right: Simple Table */}
        <div className="md:col-span-7 overflow-x-auto rounded-[20px] border border-border">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
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
                    />
                    <span>{row.category}</span>
                  </td>
                  <td className="py-2.5 px-2 text-text-muted font-mono text-xs">
                    {row.percent}%
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-text">
                    {formatCurrency(row.amount, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-text-muted leading-relaxed">
                    {row.tip}
                  </td>
                </tr>
              ))}
              <tr className="bg-surface-soft/70 font-bold text-text border-t border-border">
                <td className="py-3 px-3">Total (Exact Sum)</td>
                <td className="py-3 px-2 text-xs">100%</td>
                <td className="py-3 px-3 text-primary font-serif text-base">
                  {formatCurrency(totalBudget, currency)}
                </td>
                <td className="py-3 px-3 text-xs text-[#7E9F7A] font-normal">
                  Includes 8-10% contingency reserve
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Collapsed Adjust Sliders Toggle */}
      <div className="pt-2 text-right">
        <button
          type="button"
          onClick={() => setShowAdjust(!showAdjust)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary transition cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdjust ? 'Hide adjustments' : 'Adjust percentages'}</span>
        </button>

        {showAdjust && (
          <div className="mt-3 p-4 rounded-[20px] bg-surface-soft/60 border border-border text-left grid grid-cols-1 sm:grid-cols-2 gap-3">
            {budgetRows.map((row, idx) => (
              <div key={row.id || idx} className="p-2.5 rounded-xl bg-white border border-border">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-text">{row.category}</span>
                  <span className="font-bold text-primary">{row.percent}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="70"
                  value={row.percent}
                  onChange={(e) => onRebalanceBudget(idx, parseInt(e.target.value, 10))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
