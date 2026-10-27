import React from 'react';
import { Sparkles, ArrowRight, Heart, Cake, Users, Gift, Compass } from 'lucide-react';

export default function Hero({ onSelectType, onSelectScenario, onStartPlanning, onSamplePlan }) {
  const scenarios = [
    {
      id: 's1',
      badge: '👑 Jaipur Wedding',
      query: "Plan my sister's wedding, 200 guests, INR 12 lakh, Jaipur, December."
    },
    {
      id: 's2',
      badge: '⚡ 2-Week Rush Birthday',
      query: "Surprise 30th birthday, $500, 20 people, I have 2 weeks."
    },
    {
      id: 's3',
      badge: '🪔 Diwali Fundraiser',
      query: "Community Diwali fundraiser for 300 people, tiny budget, volunteers only."
    },
    {
      id: 's4',
      badge: '❓ Vague Idea',
      query: "Help me plan something."
    },
    {
      id: 's5',
      badge: '⚠️ Reality Check Wedding',
      query: "Budget is $1000 for a 150-guest wedding."
    }
  ];

  return (
    <section className="relative pt-8 pb-12 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Soft Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6DFDB]/80 border border-[#F6DFDB] text-[#B9524A] text-xs sm:text-sm font-medium mb-6 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#D9695F]" />
          <span>Warm, organized, and realistic event coordination</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#2B2A33] mb-6 leading-[1.15]">
          Plan any celebration in <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#D9695F]">minutes</span>, not months.
        </h1>

        {/* Subline */}
        <p className="text-lg sm:text-xl text-[#6E6A78] max-w-2xl mx-auto mb-9 font-normal leading-relaxed">
          Budgets, timelines, vendor checklists and personalized ideas, powered by AI.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
          <button
            onClick={onStartPlanning}
            className="px-7 py-3.5 rounded-2xl bg-[#D9695F] hover:bg-[#B9524A] text-white font-medium text-base shadow-[0_8px_24px_rgba(217,105,95,0.25)] hover:shadow-[0_12px_28px_rgba(217,105,95,0.35)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
          >
            <span>Start planning</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSamplePlan}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F7EFE8] text-[#2B2A33] font-medium text-base border border-[#EDE4DB] shadow-xs transition-all hover:border-[#D9695F]/30 cursor-pointer"
          >
            See a sample plan
          </button>
        </div>

        {/* Three Event-Type Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 text-left">
          <div
            onClick={() => onSelectType('wedding')}
            className="group p-6 rounded-2xl bg-white border border-[#EDE4DB] hover:border-[#D9695F]/40 shadow-[0_8px_30px_rgba(91,58,87,0.05)] hover:shadow-[0_12px_36px_rgba(91,58,87,0.1)] transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F6DFDB] text-[#D9695F] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              💍
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2B2A33] mb-1.5">
              Wedding &amp; Reception
            </h3>
            <p className="text-sm text-[#6E6A78] leading-relaxed">
              Bespoke elegance, hospitality, mandap styling, and balanced multi-function budgets.
            </p>
          </div>

          <div
            onClick={() => onSelectType('birthday')}
            className="group p-6 rounded-2xl bg-white border border-[#EDE4DB] hover:border-[#D9695F]/40 shadow-[0_8px_30px_rgba(91,58,87,0.05)] hover:shadow-[0_12px_36px_rgba(91,58,87,0.1)] transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-[#F7EFE8] text-[#C9A25B] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🎂
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2B2A33] mb-1.5">
              Birthday / Milestone
            </h3>
            <p className="text-sm text-[#6E6A78] leading-relaxed">
              Vibrant themes, showstopper cakes, custom party games, and photo-ready decor.
            </p>
          </div>

          <div
            onClick={() => onSelectType('community')}
            className="group p-6 rounded-2xl bg-white border border-[#EDE4DB] hover:border-[#D9695F]/40 shadow-[0_8px_30px_rgba(91,58,87,0.05)] hover:shadow-[0_12px_36px_rgba(91,58,87,0.1)] transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-[#DCE8DA] text-[#5B3A57] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🤝
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2B2A33] mb-1.5">
              Community &amp; NGO Event
            </h3>
            <p className="text-sm text-[#6E6A78] leading-relaxed">
              Fundraisers, civic permits, AV equipment, sponsors, and volunteer coordination.
            </p>
          </div>
        </div>

        {/* 5 Scenario Quick-Load Chips */}
        <div className="p-4 rounded-2xl bg-[#F7EFE8]/70 border border-[#EDE4DB] text-left">
          <div className="flex items-center gap-2 mb-2.5">
            <Compass className="w-4 h-4 text-[#D9695F]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6A78]">
              Test Scenarios (Instant 1-Click Verification)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {scenarios.map(s => (
              <button
                key={s.id}
                onClick={() => onSelectScenario(s.query)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F6DFDB] border border-[#EDE4DB] hover:border-[#D9695F]/40 text-xs font-medium text-[#2B2A33] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title={s.query}
              >
                <span>{s.badge}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
