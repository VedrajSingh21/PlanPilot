import React from 'react';
import { Shield, FileCheck, CheckCircle2, Square, CheckSquare } from 'lucide-react';

export default function VendorSection({ vendorChecklist, onToggleVendorItem }) {
  const tagStyles = {
    Ask: 'bg-[#EBF5FB] text-[#2980B9] border-[#AED6F1]',
    Confirm: 'bg-[#FFF3CD] text-[#856404] border-[#FFEEBA]',
    Contract: 'bg-sage text-text border-sage',
    Permit: 'bg-[#FADBD8] text-[#922B21] border-[#F5B7B1]',
    Safety: 'bg-blush text-primary-dark border-blush'
  };

  return (
    <section id="sec-vendors" className="mb-10 print-card">
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-[0_8px_30px_rgba(91,58,87,0.06)]">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Section 4 of 7
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text">
              📋 Vendor Due Diligence &amp; Contracts
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-soft text-plum border border-border">
            What to Ask · Confirm · Contract
          </span>
        </div>

        {/* Vendor Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {vendorChecklist.map((cat, cIdx) => {
            const completedCount = cat.items.filter(i => i.completed).length;
            const totalCount = cat.items.length;
            const pct = Math.round((completedCount / (totalCount || 1)) * 100);

            return (
              <div key={cIdx} className="p-5 rounded-2xl bg-surface-soft/40 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif text-base font-bold text-text">
                    {cat.category}
                  </h3>
                  <span className="text-xs font-bold text-text-muted">
                    {completedCount}/{totalCount} Done
                  </span>
                </div>

                {/* Progress bar per category */}
                <div className="h-1.5 rounded-full bg-border mb-3.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Category Tasks */}
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onToggleVendorItem(item.id)}
                      className={`p-2.5 rounded-xl border text-xs sm:text-sm transition flex items-start gap-2.5 cursor-pointer ${
                        item.completed
                          ? 'bg-sage/40 border-sage text-text-muted'
                          : 'bg-white border-border hover:border-primary/30 text-text'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.completed ? (
                          <CheckSquare className="w-3.5 h-3.5 text-[#7E9F7A]" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-text-muted" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`inline-block px-1.5 py-0.2 mr-1.5 rounded text-[10px] font-bold border uppercase ${
                          tagStyles[item.tag] || 'bg-surface-soft text-text-muted'
                        }`}>
                          {item.tag}
                        </span>
                        <span className={item.completed ? 'line-through text-text-muted' : 'text-text'}>
                          {item.task}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-4 rounded-2xl bg-bg border border-border text-xs text-text-muted flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-accent-gold shrink-0" />
          <span>
            <strong>Vendor Truth Policy:</strong> Prices are estimates. Never commit without getting <strong>2–3 written quotes</strong>, confirming written cancellation policies, and inspecting noise curfews &amp; electrical backup.
          </span>
        </div>
      </div>
    </section>
  );
}
