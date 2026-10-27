import React from 'react';
import { Shield, FileCheck, CheckCircle2, Square, CheckSquare } from 'lucide-react';

export default function VendorSection({ vendorChecklist, onToggleVendorItem }) {
  const tagStyles = {
    Ask: 'bg-[#EBF5FB] text-[#2980B9] border-[#AED6F1]',
    Confirm: 'bg-[#FFF3CD] text-[#856404] border-[#FFEEBA]',
    Contract: 'bg-[#DCE8DA] text-[#2B2A33] border-[#DCE8DA]',
    Permit: 'bg-[#FADBD8] text-[#922B21] border-[#F5B7B1]',
    Safety: 'bg-[#F6DFDB] text-[#B9524A] border-[#F6DFDB]'
  };

  return (
    <section id="sec-vendors" className="mb-10 print-card">
      <div className="bg-white rounded-3xl border border-[#EDE4DB] p-6 sm:p-8 shadow-[0_8px_30px_rgba(91,58,87,0.06)]">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EDE4DB]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9695F]">
              Section 4 of 7
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A33]">
              📋 Vendor Due Diligence &amp; Contracts
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F7EFE8] text-[#5B3A57] border border-[#EDE4DB]">
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
              <div key={cIdx} className="p-5 rounded-2xl bg-[#F7EFE8]/40 border border-[#EDE4DB]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-serif text-base font-bold text-[#2B2A33]">
                    {cat.category}
                  </h3>
                  <span className="text-xs font-bold text-[#6E6A78]">
                    {completedCount}/{totalCount} Done
                  </span>
                </div>

                {/* Progress bar per category */}
                <div className="h-1.5 rounded-full bg-[#EDE4DB] mb-3.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#D9695F] transition-all duration-300"
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
                          ? 'bg-[#DCE8DA]/40 border-[#DCE8DA] text-[#6E6A78]'
                          : 'bg-white border-[#EDE4DB] hover:border-[#D9695F]/30 text-[#2B2A33]'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.completed ? (
                          <CheckSquare className="w-3.5 h-3.5 text-[#7E9F7A]" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-[#6E6A78]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`inline-block px-1.5 py-0.2 mr-1.5 rounded text-[10px] font-bold border uppercase ${
                          tagStyles[item.tag] || 'bg-[#F7EFE8] text-[#6E6A78]'
                        }`}>
                          {item.tag}
                        </span>
                        <span className={item.completed ? 'line-through text-[#6E6A78]' : 'text-[#2B2A33]'}>
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
        <div className="p-4 rounded-2xl bg-[#FBF8F3] border border-[#EDE4DB] text-xs text-[#6E6A78] flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#C9A25B] shrink-0" />
          <span>
            <strong>Vendor Truth Policy:</strong> Prices are estimates. Never commit without getting <strong>2–3 written quotes</strong>, confirming written cancellation policies, and inspecting noise curfews &amp; electrical backup.
          </span>
        </div>
      </div>
    </section>
  );
}
