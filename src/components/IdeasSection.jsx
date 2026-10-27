import React from 'react';
import { Sparkles, PiggyBank, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

export default function IdeasSection({ ideas, savingIdeas, risks, nextSteps }) {
  return (
    <>
      {/* SECTION 5: IDEAS & WOW MOMENT */}
      <section id="sec-ideas" className="mb-10 print-card">
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-[0_8px_30px_rgba(91,58,87,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Section 5 of 7
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text">
                💡 Curated Ideas &amp; Signature "Wow" Moment
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-soft text-plum border border-border">
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
                      ? 'md:col-span-2 lg:col-span-3 bg-linear-to-r from-blush/70 via-bg to-surface-soft border-primary/40 shadow-xs'
                      : 'bg-surface-soft/40 border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-primary border border-border">
                      {isWow ? '✨ Signature "Wow" Moment' : `Concept 0${idx + 1} · ${idea.type || 'Activity'}`}
                    </span>
                  </div>
                  <h3 className={`font-serif text-base font-bold text-text mb-1.5 ${isWow ? 'text-lg text-primary-dark' : ''}`}>
                    {idea.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {idea.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 2 Budget-Saving Alternatives */}
          <div className="p-5 rounded-2xl bg-sage/30 border border-sage">
            <div className="flex items-center gap-2 mb-3">
              <PiggyBank className="w-5 h-5 text-plum" />
              <h3 className="font-serif text-base font-bold text-text">
                Strategic Budget-Saving Alternatives
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savingIdeas.map((bs, i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-border shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#7E9F7A] block mb-1">
                    Cost-Cutting Route 0{i + 1}
                  </span>
                  <div className="font-bold text-sm text-text mb-1">{bs.title}</div>
                  <p className="text-xs text-text-muted leading-relaxed">{bs.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: RISKS AND BACKUP PLAN */}
      <section id="sec-risks" className="mb-10 print-card">
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-[0_8px_30px_rgba(91,58,87,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Section 6 of 7
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text">
                ⚠️ Risks &amp; Mitigation Playbook
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blush text-primary-dark border border-blush">
              Top 3 Vulnerabilities Addressed
            </span>
          </div>

          <div className="space-y-3.5">
            {risks.map((r, i) => (
              <div key={i} className="p-4 sm:p-5 rounded-2xl bg-bg border-l-4 border-l-primary border-y border-r border-border">
                <div className="flex items-center gap-2 mb-1.5 font-bold text-sm text-primary-dark">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Risk 0{i + 1}: {r.risk}</span>
                </div>
                <div className="text-xs sm:text-sm text-text-muted pl-6 leading-relaxed">
                  <strong className="text-text">Proactive Mitigation:</strong> {r.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: NEXT 3 STEPS (PINNED & PROMINENT) */}
      <section id="sec-nextsteps" className="mb-10 print-card">
        <div className="bg-linear-to-tr from-white via-bg to-blush/40 rounded-3xl border-2 border-primary/30 p-6 sm:p-8 shadow-[0_12px_36px_rgba(217,105,95,0.1)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Section 7 of 7 · Pinned &amp; Prominent
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text">
                🎯 Next 3 Steps (Execute This Week)
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-xs">
              Immediate Momentum
            </span>
          </div>

          <div className="space-y-3">
            {nextSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-border shadow-xs flex items-center gap-4 hover:border-primary/40 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary to-blush text-white flex items-center justify-center font-serif text-lg font-bold shrink-0 shadow-xs">
                  {idx + 1}
                </div>
                <div className="text-sm sm:text-base font-medium text-text flex-1">
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
