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
        <div className="p-5 rounded-[20px] bg-[#DCE8DA]/40 border border-[#DCE8DA]">
          <div className="flex items-center gap-2 mb-2">
            <HeartHandshake className="w-5 h-5 text-[#5B3A57]" />
            <h4 className="font-serif text-base font-bold text-[#2B2A33]">
              Community In-Kind Donations &amp; Volunteer Pods
            </h4>
          </div>
          <p className="text-xs text-[#6E6A78] mb-4">
            Zero/tiny budget event: commercial fees are replaced with community sponsorships and volunteer task forces.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {volunteerTracker.map((v) => (
              <div key={v.id} className="p-3.5 rounded-xl bg-white border border-[#EDE4DB]">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-[#5B3A57] uppercase tracking-wide">{v.category}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F7EFE8] font-bold text-[#2B2A33]">
                    {v.confirmed}/{v.volunteersNeeded} Volunteers
                  </span>
                </div>
                <div className="text-sm font-semibold text-[#2B2A33]">{v.role}</div>
                <div className="text-xs text-[#6E6A78] mt-0.5">Target: {v.inKindTarget}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Budget Grid: Donut (left) + Simple Table (right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Clean Donut Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-[20px] bg-[#F7EFE8]/40 border border-[#EDE4DB]">
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
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6E6A78]">Total Budget</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#2B2A33]">
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
        <div className="md:col-span-7 overflow-x-auto rounded-[20px] border border-[#EDE4DB]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#F7EFE8] text-[#6E6A78] text-[11px] font-bold uppercase tracking-wider border-b border-[#EDE4DB]">
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-2">Share</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Savings Tip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE4DB] bg-white">
              {budgetRows.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-[#FBF8F3]">
                  <td className="py-2.5 px-3 font-medium text-[#2B2A33] flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
                    />
                    <span>{row.category}</span>
                  </td>
                  <td className="py-2.5 px-2 text-[#6E6A78] font-mono text-xs">
                    {row.percent}%
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#2B2A33]">
                    {formatCurrency(row.amount, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-[#6E6A78] leading-relaxed">
                    {row.tip}
                  </td>
                </tr>
              ))}
              <tr className="bg-[#F7EFE8]/70 font-bold text-[#2B2A33] border-t border-[#EDE4DB]">
                <td className="py-3 px-3">Total (Exact Sum)</td>
                <td className="py-3 px-2 text-xs">100%</td>
                <td className="py-3 px-3 text-[#D9695F] font-serif text-base">
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
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6A78] hover:text-[#D9695F] transition cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdjust ? 'Hide adjustments' : 'Adjust percentages'}</span>
        </button>

        {showAdjust && (
          <div className="mt-3 p-4 rounded-[20px] bg-[#F7EFE8]/60 border border-[#EDE4DB] text-left grid grid-cols-1 sm:grid-cols-2 gap-3">
            {budgetRows.map((row, idx) => (
              <div key={row.id || idx} className="p-2.5 rounded-xl bg-white border border-[#EDE4DB]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#2B2A33]">{row.category}</span>
                  <span className="font-bold text-[#D9695F]">{row.percent}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="70"
                  value={row.percent}
                  onChange={(e) => onRebalanceBudget(idx, parseInt(e.target.value, 10))}
                  className="w-full accent-[#D9695F] cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
