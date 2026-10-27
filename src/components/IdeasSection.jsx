import React from 'react';
import { Sparkles, PiggyBank, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

export default function IdeasSection({ ideas, savingIdeas, risks, nextSteps }) {
  return (
    <>
      {/* SECTION 5: IDEAS & WOW MOMENT */}
      <section id="sec-ideas" className="mb-10 print-card">
        <div className="bg-white rounded-3xl border border-[#EDE4DB] p-6 sm:p-8 shadow-[0_8px_30px_rgba(91,58,87,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EDE4DB]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9695F]">
                Section 5 of 7
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A33]">
                💡 Curated Ideas &amp; Signature "Wow" Moment
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F7EFE8] text-[#5B3A57] border border-[#EDE4DB]">
              5–7 Bespoke Concepts + 2 Budget Savers
            </span>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {ideas.map((idea, idx) => {
              const isWow = idea.type === 'wow' || idx === ideas.length - 1;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isWow
                      ? 'md:col-span-2 lg:col-span-3 bg-gradient-to-r from-[#F6DFDB]/70 via-[#FBF8F3] to-[#F7EFE8] border-[#D9695F]/40 shadow-xs'
                      : 'bg-[#F7EFE8]/40 border-[#EDE4DB] hover:border-[#D9695F]/30'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#D9695F] border border-[#EDE4DB]">
                      {isWow ? '✨ Signature "Wow" Moment' : `Concept 0${idx + 1} · ${idea.type || 'Activity'}`}
                    </span>
                  </div>
                  <h3 className={`font-serif text-base font-bold text-[#2B2A33] mb-1.5 ${isWow ? 'text-lg text-[#B9524A]' : ''}`}>
                    {idea.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E6A78] leading-relaxed">
                    {idea.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 2 Budget-Saving Alternatives */}
          <div className="p-5 rounded-2xl bg-[#DCE8DA]/30 border border-[#DCE8DA]">
            <div className="flex items-center gap-2 mb-3">
              <PiggyBank className="w-5 h-5 text-[#5B3A57]" />
              <h3 className="font-serif text-base font-bold text-[#2B2A33]">
                Strategic Budget-Saving Alternatives
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savingIdeas.map((bs, i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-[#EDE4DB] shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#7E9F7A] block mb-1">
                    Cost-Cutting Route 0{i + 1}
                  </span>
                  <div className="font-bold text-sm text-[#2B2A33] mb-1">{bs.title}</div>
                  <p className="text-xs text-[#6E6A78] leading-relaxed">{bs.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: RISKS AND BACKUP PLAN */}
      <section id="sec-risks" className="mb-10 print-card">
        <div className="bg-white rounded-3xl border border-[#EDE4DB] p-6 sm:p-8 shadow-[0_8px_30px_rgba(91,58,87,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EDE4DB]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9695F]">
                Section 6 of 7
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A33]">
                ⚠️ Risks &amp; Mitigation Playbook
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F6DFDB] text-[#B9524A] border border-[#F6DFDB]">
              Top 3 Vulnerabilities Addressed
            </span>
          </div>

          <div className="space-y-3.5">
            {risks.map((r, i) => (
              <div key={i} className="p-4 sm:p-5 rounded-2xl bg-[#FBF8F3] border-l-4 border-l-[#D9695F] border-y border-r border-[#EDE4DB]">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-sm text-[#B9524A]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Risk 0{i + 1}: {r.risk}</span>
                </div>
                <div className="text-xs sm:text-sm text-[#6E6A78] pl-6 leading-relaxed">
                  <strong className="text-[#2B2A33]">Proactive Mitigation:</strong> {r.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: NEXT 3 STEPS (PINNED & PROMINENT) */}
      <section id="sec-nextsteps" className="mb-10 print-card">
        <div className="bg-gradient-to-tr from-white via-[#FBF8F3] to-[#F6DFDB]/40 rounded-3xl border-2 border-[#D9695F]/30 p-6 sm:p-8 shadow-[0_12px_36px_rgba(217,105,95,0.1)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EDE4DB]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9695F]">
                Section 7 of 7 · Pinned &amp; Prominent
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2A33]">
                🎯 Next 3 Steps (Execute This Week)
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D9695F] text-white shadow-xs">
              Immediate Momentum
            </span>
          </div>

          <div className="space-y-3">
            {nextSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-[#EDE4DB] shadow-xs flex items-center gap-4 hover:border-[#D9695F]/40 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D9695F] to-[#F6DFDB] text-white flex items-center justify-center font-serif text-lg font-bold shrink-0 shadow-xs">
                  {idx + 1}
                </div>
                <div className="text-sm sm:text-base font-medium text-[#2B2A33] flex-1">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
