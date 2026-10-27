import React from 'react';
import { Sparkles, PiggyBank } from 'lucide-react';

export default function IdeasTab({ ideas, savingIdeas }) {
  const ideaList = ideas || [];
  const saverList = savingIdeas || [];

  return (
    <div className="space-y-6">
      {/* 2-Column Grid of 5-7 Idea Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#D9695F]" />
          <h3 className="font-serif text-lg font-bold text-[#2B2A33]">
            Curated Event Concepts &amp; Wow Moment
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ideaList.map((idea, idx) => {
            const isWow = idea.type === 'wow' || idx === ideaList.length - 1;
            return (
              <div
                key={idx}
                className={`p-5 rounded-[20px] border transition-all ${
                  isWow
                    ? 'sm:col-span-2 bg-[#F6DFDB]/50 border-[#D9695F]/40 shadow-xs'
                    : 'bg-white border-[#EDE4DB] shadow-2xs hover:border-[#D9695F]/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isWow
                      ? 'bg-[#D9695F] text-white border-[#D9695F]'
                      : 'bg-[#F7EFE8] text-[#5B3A57] border-[#EDE4DB]'
                  }`}>
                    {isWow ? '✨ Signature "Wow" Moment' : (idea.type || `Idea 0${idx + 1}`)}
                  </span>
                </div>
                <h4 className={`font-serif text-base font-bold text-[#2B2A33] mb-1.5 ${isWow ? 'text-lg text-[#B9524A]' : ''}`}>
                  {idea.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#6E6A78] leading-relaxed">
                  {idea.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 Budget-Saving Alternatives */}
      {saverList.length > 0 && (
        <div className="p-5 rounded-[20px] bg-[#DCE8DA]/30 border border-[#DCE8DA]">
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank className="w-4 h-4 text-[#7E9F7A]" />
            <h4 className="font-serif text-base font-bold text-[#2B2A33]">
              2 Smart Budget-Saving Alternatives
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {saverList.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-[#EDE4DB] shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9F7A] block mb-1">
                  Budget-Saver #{idx + 1}
                </span>
                <div className="font-semibold text-sm text-[#2B2A33] mb-1">
                  {item.title}
                </div>
                <p className="text-xs text-[#6E6A78] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
