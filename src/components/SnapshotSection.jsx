import React from 'react';
import { AlertTriangle, Sparkles, Moon, ShieldAlert, X, Info, Edit3 } from 'lucide-react';
import { formatCurrency } from '../plannerCore.js';

export default function SnapshotSection({
  snapshot,
  assumptions,
  onDismissAssumption,
  onEditAssumption
}) {
  const {
    eventType,
    eventName,
    tagline,
    guests,
    totalBudget,
    currency,
    timingText,
    location,
    vibe,
    mode,
    realityCheck,
    culturalNotice,
    alcoholNotice
  } = snapshot;

  const modeBadgeColors = {
    balanced: 'bg-[#F7EFE8] text-[#5B3A57] border-[#EDE4DB]',
    budgetSaver: 'bg-[#DCE8DA] text-[#2B2A33] border-[#DCE8DA]',
    luxury: 'bg-[#F6DFDB] text-[#B9524A] border-[#F6DFDB]',
    lastMinute: 'bg-[#FFF3CD] text-[#856404] border-[#FFEEBA]'
  };

  return (
    <section id="sec-snapshot" className="mb-10 print-card">
      <div className="bg-white rounded-3xl border border-[#EDE4DB] p-6 sm:p-8 shadow-[0_8px_30px_rgba(91,58,87,0.06)]">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EDE4DB]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9695F]">
              Section 1 of 7
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A33]">
              📌 Event Snapshot
            </h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${modeBadgeColors[mode] || modeBadgeColors.balanced}`}>
            Mode: {mode.toUpperCase()}
          </span>
        </div>

        {/* 1. REALITY CHECK BANNER (If unrealistic budget) */}
        {realityCheck?.isUnrealistic && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#FFF3CD] border border-[#FFEEBA] text-[#856404] shadow-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#856404] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm sm:text-base mb-1">
                  Reality Check: Budget vs Headcount
                </h4>
                <p className="text-xs sm:text-sm mb-2.5 leading-relaxed">
                  {realityCheck.message}
                </p>
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider block">Recommended Alternative Paths:</span>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    {realityCheck.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CULTURAL / AUSPICIOUS NOTICE (Diwali / Eid / Indian Wedding) */}
        {culturalNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FBF8F3] border border-[#C9A25B]/40 text-[#2B2A33] shadow-xs">
            <div className="flex items-start gap-3">
              <span className="text-lg">🪔</span>
              <div>
                <h4 className="font-bold text-sm text-[#C9A25B] mb-0.5">
                  Cultural &amp; Auspicious Timing Notice
                </h4>
                <p className="text-xs text-[#6E6A78] leading-relaxed">
                  {culturalNotice}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. ALCOHOL LICENSING NOTICE */}
        {alcoholNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-[#F6DFDB]/70 border border-[#D9695F]/30 text-[#2B2A33] shadow-xs">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#D9695F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#B9524A] mb-0.5">
                  Alcohol Service &amp; Crowd Safety Permit Flag
                </h4>
                <p className="text-xs text-[#6E6A78] leading-relaxed">
                  {alcoholNotice}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Key Event Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-[#F7EFE8]/70 border border-[#EDE4DB]">
            <span className="text-[11px] font-semibold uppercase text-[#6E6A78] block">Event Type</span>
            <span className="font-bold text-sm text-[#2B2A33] truncate block">{eventName}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7EFE8]/70 border border-[#EDE4DB]">
            <span className="text-[11px] font-semibold uppercase text-[#6E6A78] block">Confirmed Guests</span>
            <span className="font-bold text-sm text-[#2B2A33] block">{guests} Pax</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7EFE8]/70 border border-[#EDE4DB]">
            <span className="text-[11px] font-semibold uppercase text-[#6E6A78] block">Budget Ceiling</span>
            <span className="font-bold text-sm text-[#D9695F] block">{formatCurrency(totalBudget, currency)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7EFE8]/70 border border-[#EDE4DB]">
            <span className="text-[11px] font-semibold uppercase text-[#6E6A78] block">Timing Horizon</span>
            <span className="font-bold text-sm text-[#2B2A33] block">{timingText}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7EFE8]/70 border border-[#EDE4DB]">
            <span className="text-[11px] font-semibold uppercase text-[#6E6A78] block">City / Location</span>
            <span className="font-bold text-sm text-[#2B2A33] truncate block">{location}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7EFE8]/70 border border-[#EDE4DB]">
            <span className="text-[11px] font-semibold uppercase text-[#6E6A78] block">Curated Vibe</span>
            <span className="font-bold text-sm text-[#2B2A33] truncate block">{vibe}</span>
          </div>
        </div>

        {/* Assumptions (Shown as editable / dismissible chips) */}
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-[#6E6A78]">
            <Info className="w-3.5 h-3.5 text-[#5B3A57]" />
            <span>Assumptions Made (Click chip to tweak or dismiss):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {assumptions.map((assump, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F7EFE8] text-xs font-medium text-[#2B2A33] border border-[#EDE4DB] shadow-2xs group"
              >
                <span>{assump}</span>
                {onDismissAssumption && (
                  <button
                    onClick={() => onDismissAssumption(idx)}
                    className="text-[#6E6A78] hover:text-[#D9695F] transition"
                    title="Dismiss assumption"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
