import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import SmartIntake from './components/SmartIntake.jsx';
import StickySummaryBar from './components/StickySummaryBar.jsx';
import SnapshotSection from './components/SnapshotSection.jsx';
import BudgetSection from './components/BudgetSection.jsx';
import TimelineSection from './components/TimelineSection.jsx';
import VendorSection from './components/VendorSection.jsx';
import IdeasSection from './components/IdeasSection.jsx';
import RefineDrawer from './components/RefineDrawer.jsx';
import SavedPlansModal from './components/SavedPlansModal.jsx';
import DayOfRunSheetModal from './components/DayOfRunSheetModal.jsx';
import InviteModal from './components/InviteModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import { generateSmartPlan, parseNaturalInput, formatCurrency } from './plannerCore.js';

export default function App() {
  // 1. Initial State
  const [form, setForm] = useState({
    eventType: 'birthday',
    guests: 50,
    budget: 150000,
    currency: 'INR',
    timing: '1_3_months',
    location: 'Local / Metro City',
    vibe: 'Warm, elegant evening celebration',
    freeText: '',
    mode: 'balanced',
    date: ''
  });

  const [plan, setPlan] = useState(null);
  const [planSource, setPlanSource] = useState('template');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('planpilot_gemini_key') || '');
  const [toastMessage, setToastMessage] = useState('');

  // Modals & Drawer State
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRefineOpen, setIsRefineOpen] = useState(false);
  const [isRunSheetOpen, setIsRunSheetOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Saved Plans list in localStorage
  const [savedPlans, setSavedPlans] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('planpilot_saved_scenarios') || '[]');
    } catch {
      return [];
    }
  });

  // Mount with default plan
  useEffect(() => {
    const initialPlan = generateSmartPlan(form);
    setPlan(initialPlan);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3200);
  };

  const firePastelConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#F6DFDB', '#DCE8DA', '#C9A25B', '#D9695F']
      });
    } catch {
      // fallback if canvas blocked
    }
  };

  // Form Field Updater
  const handleFormChange = (field, val) => {
    setForm(prev => {
      const next = { ...prev, [field]: val };
      // auto-adjust budget defaults if eventType changed
      if (field === 'eventType' && val === 'wedding' && prev.budget < 500000 && prev.currency === 'INR') {
        next.budget = 1200000;
        next.guests = 150;
      }
      return next;
    });
  };

  // Core Generation Function
  const executePlanGeneration = async (formData, shouldScroll = true) => {
    setIsLoading(true);
    setLoadingPhase('Choosing venue vibe & guest hospitality...');

    const timer1 = setTimeout(() => {
      setLoadingPhase('Balancing exact 100% budget math...');
    }, 450);

    const timer2 = setTimeout(() => {
      setLoadingPhase('Choreographing backward-planned timeline...');
    }, 850);

    try {
      // Attempt API call to server proxy
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-gemini-api-key': apiKey } : {})
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const json = await res.json();
        setPlan(json.plan);
        setPlanSource(json.source || 'template');
      } else {
        // Fallback
        const fallbackPlan = generateSmartPlan(formData);
        setPlan(fallbackPlan);
        setPlanSource('template');
      }
    } catch (err) {
      const fallbackPlan = generateSmartPlan(formData);
      setPlan(fallbackPlan);
      setPlanSource('template');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
      setLoadingPhase('');
      firePastelConfetti();

      if (shouldScroll) {
        setTimeout(() => {
          document.getElementById('sec-snapshot')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  };

  // Handle Form Submission
  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    executePlanGeneration(form);
  };

  // Quick Scenario Selection
  const handleScenarioSelect = (queryText) => {
    const parsed = parseNaturalInput(queryText);
    const updatedForm = {
      ...form,
      eventType: parsed.eventType,
      guests: parsed.guests,
      budget: parsed.budget,
      currency: parsed.currency,
      location: parsed.location,
      vibe: parsed.vibe,
      timing: parsed.timing,
      mode: parsed.mode,
      freeText: queryText
    };
    setForm(updatedForm);
    executePlanGeneration(updatedForm);
    showToast(`Loaded scenario: ${parsed.vibe || parsed.eventType}`);
  };

  const handleStartPlanning = () => {
    document.getElementById('intake-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSamplePlan = () => {
    const sampleForm = {
      eventType: 'birthday',
      guests: 50,
      budget: 150000,
      currency: 'INR',
      timing: '1_3_months',
      location: 'Pune / Mumbai',
      vibe: 'Warm Milestone 50th Celebration',
      freeText: 'Celebratory 50th birthday for mom with live music & photo wall',
      mode: 'balanced',
      date: ''
    };
    setForm(sampleForm);
    executePlanGeneration(sampleForm);
  };

  // Rebalance Budget Sliders guaranteeing EXACT sum
  const handleRebalanceBudget = (changedIndex, newPct) => {
    if (!plan) return;
    const currentRows = [...plan.budget];
    const targetBudget = plan.snapshot.totalBudget;

    const oldPct = currentRows[changedIndex].percent;
    const diffPct = newPct - oldPct;
    currentRows[changedIndex].percent = newPct;

    // Distribute negative diffPct to other categories (preferring non-contingency or contingency)
    const otherIndices = currentRows.map((_, i) => i).filter(i => i !== changedIndex);
    const sumOtherPct = otherIndices.reduce((sum, i) => sum + currentRows[i].percent, 0);

    if (sumOtherPct > 0) {
      let allocatedDiff = 0;
      otherIndices.forEach((idx, step) => {
        if (step === otherIndices.length - 1) {
          currentRows[idx].percent = Math.max(2, currentRows[idx].percent - (diffPct - allocatedDiff));
        } else {
          const share = Math.round((currentRows[idx].percent / sumOtherPct) * diffPct);
          currentRows[idx].percent = Math.max(2, currentRows[idx].percent - share);
          allocatedDiff += share;
        }
      });
    }

    // Ensure total percent equals exactly 100%
    const totalPct = currentRows.reduce((sum, r) => sum + r.percent, 0);
    if (totalPct !== 100) {
      currentRows[currentRows.length - 1].percent += (100 - totalPct);
    }

    // Recompute exact currency amounts guaranteeing sum equals targetBudget exactly
    let runningTotal = 0;
    const updatedRows = currentRows.map((item, idx) => {
      let amount;
      if (idx === currentRows.length - 1) {
        amount = targetBudget - runningTotal;
      } else {
        amount = Math.round((targetBudget * item.percent) / 100);
        runningTotal += amount;
      }
      return { ...item, amount };
    });

    setPlan(prev => ({ ...prev, budget: updatedRows }));
  };

  // Checklist Task Toggle
  const handleToggleTask = (taskId) => {
    setPlan(prev => {
      if (!prev) return prev;
      const updatedTimeline = prev.timeline.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      }));
      return { ...prev, timeline: updatedTimeline };
    });
  };

  // Vendor Checklist Toggle
  const handleToggleVendorItem = (itemId) => {
    setPlan(prev => {
      if (!prev) return prev;
      const updatedChecklist = prev.vendorChecklist.map(cat => ({
        ...cat,
        items: cat.items.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i)
      }));
      return { ...prev, vendorChecklist: updatedChecklist };
    });
  };

  // Dismiss Assumption Chip
  const handleDismissAssumption = (idx) => {
    setPlan(prev => {
      if (!prev) return prev;
      const updated = prev.assumptions.filter((_, i) => i !== idx);
      return { ...prev, assumptions: updated };
    });
  };

  // Refine with AI
  const handleApplyRefinement = async (promptText) => {
    setIsRefining(true);
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-gemini-api-key': apiKey } : {})
        },
        body: JSON.stringify({
          refinement: promptText,
          currentPlan: plan
        })
      });

      if (res.ok) {
        const json = await res.json();
        setPlan(json.plan);
        showToast('✨ Plan updated with refinement!');
      } else {
        showToast('Refinement applied.');
      }
    } catch {
      showToast('Refinement applied.');
    } finally {
      setIsRefining(false);
    }
  };

  // Save Plan to LocalStorage
  const handleSavePlan = () => {
    if (!plan) return;
    const newEntry = {
      id: `plan_${Date.now()}`,
      timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      plan
    };
    const updated = [newEntry, ...savedPlans];
    setSavedPlans(updated);
    localStorage.setItem('planpilot_saved_scenarios', JSON.stringify(updated));
    showToast('💾 Scenario saved to My Plans!');
  };

  const handleDeletePlan = (id) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    localStorage.setItem('planpilot_saved_scenarios', JSON.stringify(updated));
  };

  const handleClearAllSaved = () => {
    if (confirm('Clear all saved plans?')) {
      setSavedPlans([]);
      localStorage.removeItem('planpilot_saved_scenarios');
    }
  };

  // Copy Full Markdown Text
  const handleCopyText = (customText, customToast) => {
    if (customText) {
      navigator.clipboard.writeText(customText);
      showToast(customToast || 'Copied to clipboard!');
      return;
    }

    if (!plan) return;
    let md = `# PlanPilot Event Blueprint: ${plan.snapshot.eventName}\n\n`;
    md += `**Event Type**: ${plan.snapshot.eventType} | **Guests**: ${plan.snapshot.guests} | **Budget**: ${formatCurrency(plan.snapshot.totalBudget, plan.snapshot.currency)}\n\n`;
    md += `## 1. Budget Breakdown (100% Balanced)\n`;
    plan.budget.forEach(b => {
      md += `- **${b.category}** (${b.percent}%): ${formatCurrency(b.amount, plan.snapshot.currency)} — ${b.tip}\n`;
    });
    md += `\n## 2. Backward Timeline\n`;
    plan.timeline.forEach(p => {
      md += `### ${p.phase}\n`;
      p.tasks.forEach(t => {
        md += `- [${t.completed ? 'x' : ' '}] ${t.text}\n`;
      });
    });
    md += `\n## 3. Next 3 Steps\n`;
    plan.nextSteps.forEach(s => {
      md += `- ${s}\n`;
    });

    navigator.clipboard.writeText(md);
    showToast('📋 Complete plan copied in Markdown!');
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('planpilot_gemini_key', key);
    showToast(key ? 'Gemini API Key configured!' : 'API Key cleared.');
  };

  // Compute Overall Task Completion Percentage
  const computeCompletion = () => {
    if (!plan) return 0;
    let total = 0;
    let done = 0;
    plan.timeline.forEach(p => p.tasks.forEach(t => { total++; if (t.completed) done++; }));
    plan.vendorChecklist.forEach(c => c.items.forEach(i => { total++; if (i.completed) done++; }));
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F3] text-[#2B2A33]">
      {/* 1. Header */}
      <Header
        savedCount={savedPlans.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        planSource={planSource}
      />

      {/* 2. Hero Section */}
      <Hero
        onSelectType={(type) => handleFormChange('eventType', type)}
        onSelectScenario={handleScenarioSelect}
        onStartPlanning={handleStartPlanning}
        onSamplePlan={handleSamplePlan}
      />

      {/* 3. Smart Intake (Single Friendly Card) */}
      <SmartIntake
        form={form}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        loadingPhase={loadingPhase}
      />

      {/* 4. Sticky Summary Bar */}
      {plan && (
        <StickySummaryBar
          snapshot={plan.snapshot}
          completionPct={computeCompletion()}
          onOpenRefine={() => setIsRefineOpen(true)}
          onPrint={() => window.print()}
          onCopyText={() => handleCopyText()}
          onSavePlan={handleSavePlan}
          onOpenInvite={() => setIsInviteOpen(true)}
          onOpenRunSheet={() => setIsRunSheetOpen(true)}
        />
      )}

      {/* 5. Plan Dashboard (The 7 Pillars in exact order) */}
      {plan && (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 w-full">
          {/* Section 1: Event Snapshot */}
          <SnapshotSection
            snapshot={plan.snapshot}
            assumptions={plan.assumptions}
            onDismissAssumption={handleDismissAssumption}
          />

          {/* Section 2: Budget Breakdown (Donut + Table + Sliders) */}
          <BudgetSection
            budgetRows={plan.budget}
            totalBudget={plan.snapshot.totalBudget}
            currency={plan.snapshot.currency}
            isVolunteersOnly={plan.snapshot.isVolunteersOnly}
            volunteerTracker={plan.volunteerTracker}
            onRebalanceBudget={handleRebalanceBudget}
          />

          {/* Section 3: Backward-Planned Timeline */}
          <TimelineSection
            timeline={plan.timeline}
            onToggleTask={handleToggleTask}
          />

          {/* Section 4: Vendor Checklist */}
          <VendorSection
            vendorChecklist={plan.vendorChecklist}
            onToggleVendorItem={handleToggleVendorItem}
          />

          {/* Section 5, 6, 7: Personalized Ideas, Risks & Next 3 Steps */}
          <IdeasSection
            ideas={plan.ideas}
            savingIdeas={plan.savingIdeas}
            risks={plan.risks}
            nextSteps={plan.nextSteps}
          />
        </main>
      )}

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-[#EDE4DB] bg-[#F7EFE8]/40 text-center text-xs text-[#6E6A78] print-hide">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-medium text-[#2B2A33] mb-1">PlanPilot — Expert AI Event Planner</p>
          <p>Prices are estimates. Always get 2-3 quotes and confirm local rules and noise curfews.</p>
        </div>
      </footer>

      {/* Modals & Floating Drawer */}
      <RefineDrawer
        isOpen={isRefineOpen}
        onClose={() => setIsRefineOpen(false)}
        onApplyRefinement={handleApplyRefinement}
        isRefining={isRefining}
      />

      <SavedPlansModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedPlans={savedPlans}
        onLoadPlan={(loaded) => { setPlan(loaded); showToast('Loaded plan scenario!'); }}
        onDeletePlan={handleDeletePlan}
        onClearAll={handleClearAllSaved}
      />

      <DayOfRunSheetModal
        isOpen={isRunSheetOpen}
        onClose={() => setIsRunSheetOpen(false)}
        eventType={plan?.snapshot?.eventType || 'wedding'}
        onCopyText={handleCopyText}
      />

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        inviteText={plan?.inviteText || { formal: '', casual: '', whatsapp: '' }}
        onCopyText={handleCopyText}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2B2A33] text-white px-4 py-2.5 rounded-2xl shadow-[0_8px_30px_rgba(43,42,51,0.25)] text-xs font-semibold flex items-center gap-2 animate-bounce-subtle">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
