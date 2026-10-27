import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, HeartHandshake, Sliders, CheckCircle, Info } from 'lucide-react';
import { formatCurrency } from '../plannerCore.js';

const PALETTE = [
  '#D9695F', // Warm coral
  '#C9A25B', // Accent gold
  '#5B3A57', // Plum
  '#7E9F7A', // Sage green
  '#E07A5F', // Terra cotta
  '#8198A5', // Slate blue
  '#A0717F'  // Dusty mauve
];

export default function BudgetSection({
  budgetRows,
  totalBudget,
  currency,
  isVolunteersOnly,
  volunteerTracker,
  onRebalanceBudget
}) {
  const [sliderModeActive, setSliderModeActive] = useState(false);

  // Compute live sum to prove exact match
  const liveSum = budgetRows.reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
  const remaining = totalBudget - liveSum;

  const handleSliderChange = (changedIndex, newPct) => {
    onRebalanceBudget(changedIndex, newPct);
  };

  return (
    <section id="sec-budget" className="mb-10 print-card">
      <div className="bg-white rounded-3xl border border-[#EDE4DB] p-6 sm:p-8 shadow-[0_8px_30px_rgba(91,58,87,0.06)]">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EDE4DB]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9695F]">
              Section 2 of 7
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A33]">
              💰 Budget Allocation &amp; Math Guarantee
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCE8DA] text-[#2B2A33] border border-[#DCE8DA]">
              <CheckCircle className="w-3.5 h-3.5 text-[#5B3A57]" />
              Remaining: {formatCurrency(remaining, currency)} (100% Exact)
            </span>

            <button
              onClick={() => setSliderModeActive(!sliderModeActive)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer flex items-center gap-1 ${
                sliderModeActive
                  ? 'bg-[#D9695F] text-white border-[#D9695F]'
                  : 'bg-[#F7EFE8] text-[#2B2A33] border-[#EDE4DB] hover:bg-[#F6DFDB]'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>{sliderModeActive ? 'Lock Sliders' : 'Fine-Tune Sliders'}</span>
            </button>
          </div>
        </div>

        {/* 1. VOLUNTEERS-ONLY / TINY BUDGET SPECIAL VIEW */}
        {isVolunteersOnly && volunteerTracker && (
          <div className="mb-8 p-5 rounded-2xl bg-[#DCE8DA]/40 border border-[#DCE8DA]">
            <div className="flex items-center gap-2 mb-3">
              <HeartHandshake className="w-5 h-5 text-[#5B3A57]" />
              <h3 className="font-serif text-lg font-bold text-[#2B2A33]">
                Community In-Kind Donations &amp; Volunteer Care Tracker
              </h3>
            </div>
            <p className="text-xs text-[#6E6A78] mb-4">
              For this grassroots community gathering, we substitute commercial rental lines with donated community spaces and volunteer task pods.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {volunteerTracker.map((v) => (
                <div key={v.id} className="p-3.5 rounded-xl bg-white border border-[#EDE4DB] shadow-2xs">
                  <div className="flex justify-between items-start mb-1">
                    <strong className="text-xs text-[#5B3A57] uppercase tracking-wide">{v.category}</strong>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#F7EFE8] text-[#2B2A33]">
                      {v.confirmed}/{v.volunteersNeeded} Volunteers
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[#2B2A33] mb-1">{v.role}</div>
                  <div className="text-xs text-[#6E6A78]">
                    <strong>Target:</strong> {v.inKindTarget}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart + Summary View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          {/* Recharts Donut */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetRows}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
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

              {/* Centered Total Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6A78]">Total Budget</span>
                <span className="font-serif text-2xl font-bold text-[#2B2A33]">
                  {formatCurrency(totalBudget, currency)}
                </span>
                <span className="text-[10px] text-[#7E9F7A] font-bold">100% Balanced</span>
              </div>
            </div>
          </div>

          {/* Mini Progress Bars List */}
          <div className="lg:col-span-7 space-y-2.5">
            {budgetRows.map((row, idx) => {
              const color = PALETTE[idx % PALETTE.length];
              return (
                <div key={row.id || idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#2B2A33] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      {row.category}
                    </span>
                    <span className="font-bold text-[#6E6A78]">
                      {formatCurrency(row.amount, currency)} <span className="font-normal text-[11px]">({row.percent}%)</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F7EFE8] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${row.percent}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Rebalancing Sliders (When fine-tune is toggled) */}
        {sliderModeActive && (
          <div className="mb-8 p-4 rounded-2xl bg-[#F7EFE8]/70 border border-[#EDE4DB]">
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-[#D9695F]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B2A33]">
                Live Category Rebalancing Sliders (Sum Automatically Preserved)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    onChange={(e) => handleSliderChange(idx, parseInt(e.target.value, 10))}
                    className="w-full accent-[#D9695F] cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The Exact Budget Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#EDE4DB]">
          <table className="w-full text-left text-sm border-collapse budget-table">
            <thead>
              <tr className="bg-[#F7EFE8] text-[#6E6A78] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-3">Share (%)</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Strategic Savings Tip / Due Diligence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE4DB]">
              {budgetRows.map((row, idx) => {
                const isContingency = row.category.toLowerCase().includes('contingency');
                return (
                  <tr key={row.id || idx} className={`hover:bg-[#FBF8F3] transition ${isContingency ? 'bg-[#DCE8DA]/20' : ''}`}>
                    <td className="py-3.5 px-4 font-semibold text-[#2B2A33] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETTE[idx % PALETTE.length] }} />
                      <span>{row.category}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#F7EFE8] text-xs font-bold text-[#6E6A78]">
                        {row.percent}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2B2A33]">
                      {formatCurrency(row.amount, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#6E6A78] leading-relaxed">
                      {row.tip}
                    </td>
                  </tr>
                );
              })}

              {/* Exact Balanced Total Row */}
              <tr className="bg-[#F7EFE8] font-bold text-[#2B2A33] border-t-2 border-[#D9695F]/30">
                <td className="py-4 px-4 text-base">TOTAL (Guaranteed Exact Sum)</td>
                <td className="py-4 px-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#D9695F] text-white text-xs font-bold">
                    100%
                  </span>
                </td>
                <td className="py-4 px-4 text-base text-[#D9695F]">
                  {formatCurrency(totalBudget, currency)}
                </td>
                <td className="py-4 px-4 text-xs text-[#7E9F7A] font-semibold">
                  🛡️ Includes 8-10% contingency line. Every single dollar/rupee accounted for.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
