import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Share2,
  FileText,
  Copy,
  Mail,
  Printer,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  Info,
  X,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  DollarSign
} from 'lucide-react';
import BudgetTab from './tabs/BudgetTab.jsx';
import TimelineTab from './tabs/TimelineTab.jsx';
import VendorsTab from './tabs/VendorsTab.jsx';
import IdeasTab from './tabs/IdeasTab.jsx';
import RisksTab from './tabs/RisksTab.jsx';
import { formatCurrency } from '../plannerCore.js';

export default function PlanState({
  plan,
  onRebalanceBudget,
  onToggleTask,
  onToggleVendorItem,
  onDismissAssumption,
  onApplyRefinement,
  isRefining,
  onOpenInvite,
  onOpenRunSheet,
  onCopyText,
  onSavePlan
}) {
  const [activeTab, setActiveTab] = useState('budget');
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [refineInput, setRefineInput] = useState('');
  const exportRef = useRef(null);

  // Close export dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!plan) return null;

  const { snapshot, assumptions, budget, timeline, vendorChecklist, ideas, savingIdeas, risks, nextSteps } = plan;

  // Single Slim Edge-Case Notice logic (ONE banner only, highest priority first)
  let singleEdgeNotice = null;
  if (snapshot.realityCheck?.isUnrealistic) {
    singleEdgeNotice = {
      icon: '⚠️',
      title: 'Reality Check:',
      text: `${snapshot.realityCheck.message} Consider: ${snapshot.realityCheck.suggestions?.[0] || 'adjusting guest count or budget.'}`,
      style: 'bg-[#FFF3CD] border-[#FFEEBA] text-[#856404]'
    };
  } else if (snapshot.isVolunteersOnly) {
    singleEdgeNotice = {
      icon: '🤝',
      title: 'Grassroots Event:',
      text: 'Commercial vendor allocations swapped for volunteer coordinator pods and community sponsorships.',
      style: 'bg-[#DCE8DA]/60 border-[#DCE8DA] text-[#2B2A33]'
    };
  } else if (snapshot.alcoholNotice) {
    singleEdgeNotice = {
      icon: '🍷',
      title: 'Permit Flag:',
      text: snapshot.alcoholNotice,
      style: 'bg-[#F6DFDB]/60 border-[#D9695F]/30 text-[#B9524A]'
    };
  } else if (snapshot.culturalNotice) {
    singleEdgeNotice = {
      icon: '🪔',
      title: 'Cultural Timing:',
      text: snapshot.culturalNotice,
      style: 'bg-[#FBF8F3] border-[#C9A25B]/40 text-[#2B2A33]'
    };
  }

  // Refine prompt submit
  const handleRefineSubmit = (e) => {
    e.preventDefault();
    if (!refineInput.trim() || isRefining) return;
    onApplyRefinement(refineInput.trim());
    setRefineInput('');
  };

  const handleChipClick = (chipText) => {
    if (chipText === 'Add day-of run sheet') {
      onOpenRunSheet();
    } else if (chipText === 'Write invitation text') {
      onOpenInvite();
    } else {
      onApplyRefinement(chipText);
    }
  };

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 pt-6 pb-20">
      {/* 1. PAGE HEADER */}
      <div className="mb-6 pb-5 border-b border-[#EDE4DB]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2B2A33] mb-1.5">
              {snapshot.eventName || 'Your Event Blueprint'}
            </h1>

            {/* One-line snapshot */}
            <p className="text-xs sm:text-sm text-[#6E6A78] flex flex-wrap items-center gap-1.5 font-medium">
              <span className="capitalize">{snapshot.eventType}</span>
              <span>•</span>
              <span>{snapshot.location || 'Local'}</span>
              <span>•</span>
              <span>{snapshot.guests} guests</span>
              <span>•</span>
              <span className="font-semibold text-[#D9695F]">{formatCurrency(snapshot.totalBudget, snapshot.currency)}</span>
              <span>•</span>
              <span>{snapshot.timingText || 'Upcoming'}</span>
            </p>
          </div>

          {/* Right side: Single Export Dropdown Button */}
          <div className="relative shrink-0" ref={exportRef}>
            <button
              type="button"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EDE4DB] text-xs sm:text-sm font-semibold text-[#2B2A33] hover:bg-[#F7EFE8] shadow-2xs transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#D9695F]" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E6A78]" />
            </button>

            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-[20px] bg-white border border-[#EDE4DB] shadow-[0_8px_30px_rgba(91,58,87,0.12)] p-2 z-50 animate-fade-in text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setExportMenuOpen(false);
                    window.print();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-medium text-[#2B2A33] hover:bg-[#F7EFE8] transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#6E6A78]" />
                  <span>Print / Save as PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExportMenuOpen(false);
                    onCopyText();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-medium text-[#2B2A33] hover:bg-[#F7EFE8] transition cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-[#6E6A78]" />
                  <span>Copy Markdown text</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExportMenuOpen(false);
                    onOpenInvite();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-medium text-[#2B2A33] hover:bg-[#F7EFE8] transition cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#6E6A78]" />
                  <span>Copy invitation copy</span>
                </button>

                <div className="border-t border-[#EDE4DB] my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setExportMenuOpen(false);
                    onSavePlan();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-medium text-[#D9695F] hover:bg-[#F6DFDB]/50 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D9695F]" />
                  <span>Save to My Plans</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Small Editable Assumption Chips */}
        {assumptions && assumptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6A78] mr-1">
              Assumptions:
            </span>
            {assumptions.map((assump, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F7EFE8] text-[11px] font-medium text-[#2B2A33] border border-[#EDE4DB]"
              >
                <span>{assump}</span>
                <button
                  type="button"
                  onClick={() => onDismissAssumption(idx)}
                  className="text-[#6E6A78] hover:text-[#D9695F] ml-0.5 cursor-pointer"
                  title="Remove assumption"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. ONE SLIM BANNER (Under header, never stacked) */}
      {singleEdgeNotice && (
        <div className={`mb-5 px-4 py-2.5 rounded-xl border text-xs flex items-center gap-2 leading-relaxed ${singleEdgeNotice.style}`}>
          <span className="shrink-0">{singleEdgeNotice.icon}</span>
          <span>
            <strong>{singleEdgeNotice.title}</strong> {singleEdgeNotice.text}
          </span>
        </div>
      )}

      {/* 3. NEXT 3 STEPS (Single soft card ABOVE the tabs) */}
      {nextSteps && nextSteps.length > 0 && (
        <div className="mb-6 p-4 sm:p-5 rounded-[20px] bg-[#F7EFE8]/70 border border-[#EDE4DB] shadow-2xs">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="font-serif text-sm sm:text-base font-bold text-[#2B2A33] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D9695F]" />
              <span>Next 3 Steps (Execute this week)</span>
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6E6A78]">
              High Impact
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {nextSteps.slice(0, 3).map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-[#EDE4DB] flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-md bg-[#F6DFDB] text-[#B9524A] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-[#2B2A33] font-medium leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ONE ROW OF SIMPLE TABS */}
      <div className="mb-6 border-b border-[#EDE4DB]">
        <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'budget', label: 'Budget' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'vendors', label: 'Vendors' },
            { id: 'ideas', label: 'Ideas' },
            { id: 'risks', label: 'Risks' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#D9695F] text-[#D9695F]'
                    : 'border-transparent text-[#6E6A78] hover:text-[#2B2A33] hover:border-[#EDE4DB]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 5. TAB CONTENT (Only active tab shown) */}
      <div className="mb-12">
        {activeTab === 'budget' && (
          <BudgetTab
            budgetRows={budget}
            totalBudget={snapshot.totalBudget}
            currency={snapshot.currency}
            isVolunteersOnly={snapshot.isVolunteersOnly}
            volunteerTracker={plan.volunteerTracker}
            onRebalanceBudget={onRebalanceBudget}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab
            timeline={timeline}
            onToggleTask={onToggleTask}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorsTab
            vendorChecklist={vendorChecklist}
            onToggleVendorItem={onToggleVendorItem}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasTab
            ideas={ideas}
            savingIdeas={savingIdeas}
          />
        )}

        {activeTab === 'risks' && (
          <RisksTab
            risks={risks}
          />
        )}
      </div>

      {/* 6. REFINE WITH AI (Docked at BOTTOM of plan, in line with content) */}
      <div className="p-5 sm:p-6 rounded-[20px] bg-white border border-[#EDE4DB] shadow-[0_8px_30px_rgba(91,58,87,0.06)]">
        {/* 3 Quick Chips Above Input */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold text-[#6E6A78] uppercase tracking-wider mr-1">
            Quick Refinements:
          </span>
          {[
            { label: '✂️ Cut budget 15%', text: 'Cut budget by 15% while keeping core essentials' },
            { label: '📋 Add day-of run sheet', text: 'Add day-of run sheet' },
            { label: '💌 Write invitation text', text: 'Write invitation text' }
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isRefining}
              onClick={() => handleChipClick(chip.text)}
              className="px-3 py-1.5 rounded-full bg-[#F7EFE8] hover:bg-[#F6DFDB] border border-[#EDE4DB] text-xs font-medium text-[#2B2A33] transition cursor-pointer disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleRefineSubmit} className="relative flex items-center">
          <input
            type="text"
            value={refineInput}
            onChange={(e) => setRefineInput(e.target.value)}
            disabled={isRefining}
            placeholder="Ask AI to change anything (e.g. swap live band for DJ, add halal catering)..."
            className="w-full py-3 pl-4 pr-24 rounded-xl bg-[#FBF8F3] border border-[#EDE4DB] focus:border-[#D9695F] focus:ring-2 focus:ring-[#F6DFDB] text-xs sm:text-sm text-[#2B2A33] placeholder:text-[#6E6A78]/70 outline-none transition"
          />
          <button
            type="submit"
            disabled={!refineInput.trim() || isRefining}
            className="absolute right-2 px-4 py-1.5 rounded-lg bg-[#D9695F] hover:bg-[#B9524A] text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center gap-1 shadow-2xs"
          >
            {isRefining ? (
              <span>Updating...</span>
            ) : (
              <>
                <span>Update</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
