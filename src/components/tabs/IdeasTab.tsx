import { Sparkles, PiggyBank } from 'lucide-react';
import { Idea, SavingIdea } from '../../lib/schema';

interface IdeasTabProps {
  ideas: Idea[];
  savingIdeas: SavingIdea[];
}

export default function IdeasTab({ ideas, savingIdeas }: IdeasTabProps) {
  const ideaList = ideas || [];
  const saverList = savingIdeas || [];

  return (
    <div className="space-y-6">
      {/* 2-Column Grid of Curated Concept Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
          <h3 className="font-serif text-lg font-bold text-text">
            Curated Event Concepts &amp; Signature Moments
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
                    ? 'sm:col-span-2 bg-blush/50 border-primary/40 shadow-xs'
                    : 'bg-white border-border shadow-2xs hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isWow
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-soft text-plum border-border'
                  }`}>
                    {isWow ? '✨ Signature "Wow" Moment' : (idea.type || `Idea 0${idx + 1}`)}
                  </span>
                </div>
                <h4 className={`font-serif text-base font-bold text-text mb-1.5 ${isWow ? 'text-lg text-primary-dark' : ''}`}>
                  {idea.title}
                </h4>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {idea.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 Budget-Saving Alternatives */}
      {saverList.length > 0 && (
        <div className="p-5 rounded-[20px] bg-sage/30 border border-sage">
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank className="w-4 h-4 text-[#7E9F7A]" aria-hidden="true" />
            <h4 className="font-serif text-base font-bold text-text">
              2 Smart Budget-Saving Alternatives
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {saverList.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-border shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9F7A] block mb-1">
                  Budget-Saver #{idx + 1}
                </span>
                <div className="font-semibold text-sm text-text mb-1">
                  {item.title}
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
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
