import { useState, useRef } from 'react';
import {
  Wallet,
  Clock,
  Briefcase,
  Users,
  Sparkles,
  ShieldAlert,
  Copy,
  Bookmark,
  Calendar,
  Mail
} from 'lucide-react';
import { Plan, VendorCategory, Guest, formatCurrency } from '../../lib/schema';
import SnapshotHeader from './SnapshotHeader';
import BudgetTab from '../budget/BudgetTab';
import TimelineTab from '../../components/tabs/TimelineTab';
import VendorsTab from '../vendors/VendorsTab';
import GuestsTab from '../guests/GuestsTab';
import IdeasTab from '../../components/tabs/IdeasTab';
import RisksTab from '../../components/tabs/RisksTab';

interface PlanStateProps {
  plan: Plan;
  onRebalanceBudget: (changedIdx: number, newPercent: number) => void;
  onChooseTradeOff: (cardId: string, optionId: string, costDelta: number, label: string) => void;
  onToggleTask: (taskId: string) => void;
  onToggleVendorItem: (itemId: string) => void;
  onUpdateVendorStatus: (catIdx: number, status: VendorCategory['status']) => void;
  onUpdateVendorQuote: (catIdx: number, amount: number | null) => void;
  onAddGuest: (guest: Omit<Guest, 'id'>) => void;
  onUpdateGuest: (id: string, updated: Partial<Guest>) => void;
  onRemoveGuest: (id: string) => void;
  onImportGuests: (guests: Guest[]) => void;
  onSaveGuestAiNotes: (notes: string) => void;
  onApplyRefinement: (refinementText: string) => void;
  isRefining: boolean;
  onOpenInvite: () => void;
  onOpenRunSheet: () => void;
  onCopyText: (text: string, msg: string) => void;
  onSavePlan: () => void;
}

type TabType = 'budget' | 'timeline' | 'vendors' | 'guests' | 'ideas' | 'risks';

const TABS: Array<{ id: TabType; label: string; icon: React.ElementType }> = [
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'vendors', label: 'Vendors', icon: Briefcase },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'ideas', label: 'Ideas', icon: Sparkles },
  { id: 'risks', label: 'Risks', icon: ShieldAlert }
];

export default function PlanState({
  plan,
  onRebalanceBudget,
  onChooseTradeOff,
  onToggleTask,
  onToggleVendorItem,
  onUpdateVendorStatus,
  onUpdateVendorQuote,
  onAddGuest,
  onUpdateGuest,
  onRemoveGuest,
  onImportGuests,
  onSaveGuestAiNotes,
  onApplyRefinement,
  isRefining,
  onOpenInvite,
  onOpenRunSheet,
  onCopyText,
  onSavePlan
}: PlanStateProps) {
  const [activeTab, setActiveTab] = useState<TabType>('budget');
  const [refineInput, setRefineInput] = useState('');
  const tabRefs = useRef<Record<TabType, HTMLButtonElement | null>>({
    budget: null,
    timeline: null,
    vendors: null,
    guests: null,
    ideas: null,
    risks: null
  });

  const handleTabKeyDown = (e: React.KeyboardEvent, currentId: TabType) => {
    const currentIndex = TABS.findIndex(t => t.id === currentId);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    }

    if (nextIndex !== currentIndex) {
      e.preventDefault();
      const nextTab = TABS[nextIndex];
      if (nextTab) {
        setActiveTab(nextTab.id);
        tabRefs.current[nextTab.id]?.focus();
      }
    }
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineInput.trim() || isRefining) return;
    onApplyRefinement(refineInput.trim());
    setRefineInput('');
  };

  return (
    <div className="max-w-240 mx-auto px-4 py-6 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-text-muted">
          Showing personalized blueprint for <strong className="text-text">{plan.snapshot.eventName}</strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenRunSheet}
            className="px-3 py-1.5 rounded-xl bg-white border border-border text-xs font-semibold text-text hover:bg-surface-soft transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <Calendar className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span>Run Sheet</span>
          </button>

          <button
            type="button"
            onClick={onOpenInvite}
            className="px-3 py-1.5 rounded-xl bg-white border border-border text-xs font-semibold text-text hover:bg-surface-soft transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <Mail className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span>Invites</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const fullMd = `# ${plan.snapshot.eventName}\n\nBudget: ${formatCurrency(plan.snapshot.totalBudget, plan.snapshot.currency)}\nHeadcount: ${plan.snapshot.guests} guests\n\n## Next Steps\n${plan.nextSteps.map(s => `- [ ] ${s}`).join('\n')}`;
              onCopyText(fullMd, 'Complete plan copied to clipboard!');
            }}
            className="px-3 py-1.5 rounded-xl bg-white border border-border text-xs font-semibold text-text hover:bg-surface-soft transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <Copy className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
            <span>Copy</span>
          </button>

          <button
            type="button"
            onClick={onSavePlan}
            className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition flex items-center gap-1.5 cursor-pointer shadow-2xs min-h-[44px]"
          >
            <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Save Plan</span>
          </button>
        </div>
      </div>

      {/* 1. Event Snapshot Header */}
      <SnapshotHeader snapshot={plan.snapshot} />

      {/* 2. Pinned Next 3 Steps Card */}
      {plan.nextSteps && plan.nextSteps.length > 0 && (
        <div className="p-5 rounded-[20px] bg-surface-soft/60 border border-border shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            <h3 className="font-serif text-base font-bold text-text">
              Next 3 Steps to Take This Week
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {plan.nextSteps.slice(0, 3).map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-border flex items-start gap-2.5 text-xs text-text shadow-2xs leading-relaxed"
              >
                <span className="font-mono font-bold text-primary shrink-0">
                  0{idx + 1}.
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Accessible ARIA Tab Bar */}
      <div className="border-b border-border">
        <div
          role="tablist"
          aria-label="Event Plan Sections"
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-px"
        >
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                ref={el => { tabRefs.current[tab.id] = el; }}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs sm:text-sm font-semibold transition border-b-2 min-h-[44px] cursor-pointer shrink-0 ${
                  isSelected
                    ? 'border-primary text-primary bg-white shadow-2xs'
                    : 'border-transparent text-text-muted hover:text-text hover:bg-surface-soft'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tab Panels */}
      <div className="pt-2">
        {/* Budget Tab Panel */}
        <div
          role="tabpanel"
          id="panel-budget"
          aria-labelledby="tab-budget"
          tabIndex={0}
          hidden={activeTab !== 'budget'}
        >
          {activeTab === 'budget' && (
            <BudgetTab
              budgetRows={plan.budget}
              totalBudget={plan.snapshot.totalBudget}
              currency={plan.snapshot.currency}
              tradeOffs={plan.tradeOffs}
              decisions={plan.tradeOffDecisions}
              onRebalanceBudget={onRebalanceBudget}
              onChooseTradeOff={onChooseTradeOff}
            />
          )}
        </div>

        {/* Timeline Tab Panel */}
        <div
          role="tabpanel"
          id="panel-timeline"
          aria-labelledby="tab-timeline"
          tabIndex={0}
          hidden={activeTab !== 'timeline'}
        >
          {activeTab === 'timeline' && (
            <TimelineTab
              timeline={plan.timeline}
              onToggleTask={onToggleTask}
            />
          )}
        </div>

        {/* Vendors Tab Panel */}
        <div
          role="tabpanel"
          id="panel-vendors"
          aria-labelledby="tab-vendors"
          tabIndex={0}
          hidden={activeTab !== 'vendors'}
        >
          {activeTab === 'vendors' && (
            <VendorsTab
              vendorChecklist={plan.vendorChecklist}
              currency={plan.snapshot.currency}
              eventName={plan.snapshot.eventName}
              eventType={plan.snapshot.eventType}
              guests={plan.snapshot.guests}
              location={plan.snapshot.location}
              dateOrTiming={plan.snapshot.timingText}
              onToggleVendorItem={onToggleVendorItem}
              onUpdateCategoryStatus={onUpdateVendorStatus}
              onUpdateQuoteAmount={onUpdateVendorQuote}
              onCopyText={onCopyText}
            />
          )}
        </div>

        {/* Guests Tab Panel */}
        <div
          role="tabpanel"
          id="panel-guests"
          aria-labelledby="tab-guests"
          tabIndex={0}
          hidden={activeTab !== 'guests'}
        >
          {activeTab === 'guests' && (
            <GuestsTab
              guests={plan.guests}
              eventName={plan.snapshot.eventName}
              eventType={plan.snapshot.eventType}
              onAddGuest={onAddGuest}
              onUpdateGuest={onUpdateGuest}
              onRemoveGuest={onRemoveGuest}
              onImportCsv={onImportGuests}
              guestAiNotes={plan.guestAiNotes}
              onSaveAiNotes={onSaveGuestAiNotes}
            />
          )}
        </div>

        {/* Ideas Tab Panel */}
        <div
          role="tabpanel"
          id="panel-ideas"
          aria-labelledby="tab-ideas"
          tabIndex={0}
          hidden={activeTab !== 'ideas'}
        >
          {activeTab === 'ideas' && (
            <IdeasTab
              ideas={plan.ideas}
              savingIdeas={plan.savingIdeas}
            />
          )}
        </div>

        {/* Risks Tab Panel */}
        <div
          role="tabpanel"
          id="panel-risks"
          aria-labelledby="tab-risks"
          tabIndex={0}
          hidden={activeTab !== 'risks'}
        >
          {activeTab === 'risks' && (
            <RisksTab risks={plan.risks} />
          )}
        </div>
      </div>

      {/* 5. Bottom-Docked AI Refinement Bar */}
      <div className="pt-4 pb-8">
        <div className="p-4 rounded-[22px] bg-white border border-border shadow-[0_8px_30px_rgba(91,58,87,0.06)] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="font-serif text-sm font-bold text-text">Refine with AI</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {['Cut budget by 15%', 'Make it last-minute', 'More DIY options'].map((chip) => (
                <button
                  type="button"
                  key={chip}
                  disabled={isRefining}
                  onClick={() => onApplyRefinement(chip)}
                  className="px-2.5 py-1 rounded-lg bg-surface-soft text-[11px] font-medium text-text hover:bg-blush border border-border transition cursor-pointer min-h-[32px]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRefineSubmit} className="flex gap-2">
            <input
              type="text"
              value={refineInput}
              disabled={isRefining}
              onChange={(e) => setRefineInput(e.target.value)}
              placeholder="e.g. Prioritize indoor spaces for rainy season, trim decor fees..."
              aria-label="Refine plan prompt"
              className="flex-1 px-3 py-2.5 rounded-xl bg-bg border border-border text-xs text-text placeholder:text-text-muted/70 outline-none focus:border-primary focus:ring-1 focus:ring-blush"
            />
            <button
              type="submit"
              disabled={isRefining || !refineInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition cursor-pointer shadow-2xs disabled:opacity-50 min-h-[44px]"
            >
              {isRefining ? 'Refining...' : 'Refine'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
