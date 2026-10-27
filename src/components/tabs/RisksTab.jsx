import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function RisksTab({ risks }) {
  const riskList = risks || [];

  if (riskList.length === 0) {
    return (
      <div className="p-8 text-center text-[#6E6A78] text-sm bg-white rounded-[20px] border border-[#EDE4DB]">
        No critical risks identified for this scenario.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert className="w-4 h-4 text-[#D9695F]" />
        <h3 className="font-serif text-lg font-bold text-[#2B2A33]">
          Top 3 Risks &amp; Practical Backup Plans
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {riskList.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-[20px] bg-white border border-[#EDE4DB] shadow-2xs hover:border-[#D9695F]/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#F6DFDB] text-[#B9524A] flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B9524A] block mb-1">
                  Risk 0{idx + 1}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-[#2B2A33] mb-1.5">
                  {item.risk}
                </h4>
                <div className="p-3 rounded-xl bg-[#F7EFE8]/70 border border-[#EDE4DB] text-xs sm:text-sm text-[#6E6A78] leading-relaxed">
                  <span className="font-bold text-[#2B2A33] mr-1.5">Backup Plan:</span>
                  <span>{item.mitigation}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
