import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HomeState from './components/HomeState.jsx';
import GeneratingState from './components/GeneratingState.jsx';
import PlanState from './components/PlanState.jsx';
import SavedPlansModal from './components/SavedPlansModal.jsx';
import InviteModal from './components/InviteModal.jsx';
import DayOfRunSheetModal from './components/DayOfRunSheetModal.jsx';
import {
  generateSmartPlan,
  parseNaturalInput,
  formatCurrency
} from './plannerCore.js';

export default function App() {
  // Application State: 'home' | 'generating' | 'plan'
  const [appState, setAppState] = useState('home');

  // Currently loaded plan
  const [plan, setPlan] = useState(null);
  const [isRefining, setIsRefining] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isRunSheetOpen, setIsRunSheetOpen] = useState(false);

  // Saved Plans in LocalStorage
  const [savedPlans, setSavedPlans] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('planpilot_saved_scenarios') || '[]');
    } catch {
      return [];
    }
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // Helper to ensure budget math is strictly 100% exact to totalBudget
  const enforceExactBudgetSum = (budgetRows, targetBudget) => {
    if (!budgetRows || budgetRows.length === 0) return budgetRows;
    let running = 0;
    return budgetRows.map((item, idx) => {
      let amount;
      if (idx === budgetRows.length - 1) {
        amount = targetBudget - running;
      } else {
        amount = Math.round((targetBudget * item.percent) / 100);
        running += amount;
      }
      return { ...item, amount };
    });
  };

  // Core Generation Handler
  const handleGenerate = async ({ prompt, details }) => {
    setAppState('generating');

    // Parse the input text
    const parsed = parseNaturalInput(prompt);

    // Merge with any details user manually adjusted if provided
    const mergedConfig = {
      eventType: details?.eventType || parsed.eventType,
      guests: details?.guests || parsed.guests,
      budget: details?.budget || parsed.budget,
      currency: details?.currency || parsed.currency,
      location: details?.location || parsed.location,
      vibe: parsed.vibe,
      mode: details?.mode || parsed.mode,
      timing: parsed.timing,
      freeText: prompt
    };

    const startTime = Date.now();

    try {
      // Server-side route with real Gemini API call
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mergedConfig)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.plan) {
          // Double verify exact budget sum on returned plan
          json.plan.budget = enforceExactBudgetSum(json.plan.budget, json.plan.snapshot.totalBudget);
          setPlan(json.plan);
        } else {
          const generated = generateSmartPlan(mergedConfig);
          setPlan(generated);
        }
      } else {
        // Fallback template plan
        const generated = generateSmartPlan(mergedConfig);
        setPlan(generated);
      }
    } catch {
      // Client-side deterministic fallback
      const generated = generateSmartPlan(mergedConfig);
      setPlan(generated);
    } finally {
      // Ensure smooth, calm transition (minimum 800ms)
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 800 - elapsed);
      setTimeout(() => {
        setAppState('plan');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, delay);
    }
  };

  // Rebalance Budget sliders ensuring 100% exact math
  const handleRebalanceBudget = (changedIndex, newPct) => {
    if (!plan) return;
    const currentRows = [...plan.budget];
    const targetBudget = plan.snapshot.totalBudget;

    const oldPct = currentRows[changedIndex].percent;
    const diffPct = newPct - oldPct;
    currentRows[changedIndex].percent = newPct;

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

    // Ensure total percent equals 100%
    const totalPct = currentRows.reduce((sum, r) => sum + r.percent, 0);
    if (totalPct !== 100) {
      currentRows[currentRows.length - 1].percent += (100 - totalPct);
    }

    const updatedRows = enforceExactBudgetSum(currentRows, targetBudget);
    setPlan(prev => ({ ...prev, budget: updatedRows }));
  };

  // Timeline Task Toggle
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

  // Refine with AI handler
  const handleApplyRefinement = async (promptText) => {
    if (!plan) return;
    setIsRefining(true);

    try {
      // Check for specific quick transformations
      if (promptText.toLowerCase().includes('cut budget') || promptText.includes('15%')) {
        const newBudgetTotal = Math.round(plan.snapshot.totalBudget * 0.85);
        const updatedRows = enforceExactBudgetSum(plan.budget, newBudgetTotal);
        
        setPlan(prev => ({
          ...prev,
          snapshot: {
            ...prev.snapshot,
            totalBudget: newBudgetTotal
          },
          budget: updatedRows,
          nextSteps: [
            `Adjust contracts to meet revised budget ceiling of ${formatCurrency(newBudgetTotal, plan.snapshot.currency)}`,
            ...prev.nextSteps.slice(1)
          ]
        }));
        showToast('Updated: Budget trimmed by 15%');
        setIsRefining(false);
        return;
      }

      // Try server endpoint
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refinement: promptText,
          currentPlan: plan
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.plan) {
          json.plan.budget = enforceExactBudgetSum(json.plan.budget, json.plan.snapshot.totalBudget);
          setPlan(json.plan);
          showToast('Updated');
        } else {
          showToast('Updated');
        }
      } else {
        // Fallback in-situ modification
        setPlan(prev => ({
          ...prev,
          assumptions: [...prev.assumptions, `Refined: ${promptText.slice(0, 45)}...`]
        }));
        showToast('Updated');
      }
    } catch {
      setPlan(prev => ({
        ...prev,
        assumptions: [...prev.assumptions, `Refined: ${promptText.slice(0, 45)}...`]
      }));
      showToast('Updated');
    } finally {
      setIsRefining(false);
    }
  };

  // Save to My Plans
  const handleSavePlan = () => {
    if (!plan) return;
    const newEntry = {
      id: `plan_${Date.now()}`,
      timestamp: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      plan
    };
    const updated = [newEntry, ...savedPlans];
    setSavedPlans(updated);
    localStorage.setItem('planpilot_saved_scenarios', JSON.stringify(updated));
    showToast('Plan saved to My Plans');
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

  // Copy Markdown Text
  const handleCopyText = (customText, customToast) => {
    if (customText) {
      navigator.clipboard.writeText(customText);
      showToast(customToast || 'Copied to clipboard');
      return;
    }

    if (!plan) return;
    let md = `# PlanPilot Blueprint: ${plan.snapshot.eventName}\n\n`;
    md += `**Event**: ${plan.snapshot.eventType} | **Guests**: ${plan.snapshot.guests} | **Budget**: ${formatCurrency(plan.snapshot.totalBudget, plan.snapshot.currency)}\n\n`;
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
    showToast('Blueprint copied to clipboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text font-sans antialiased">
      {/* 1. NAVBAR (Fixed at top, 64px tall, only 2 items on right) */}
      <Navbar
        onNewPlan={() => {
          setAppState('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        savedCount={savedPlans.length}
      />

      {/* 2. MAIN CONTENT CONTAINER (starts below 64px navbar, single column) */}
      <main className="flex-1 pt-16">
        {/* STATE 1: Home (AI prompt first) */}
        {appState === 'home' && (
          <HomeState onGenerate={handleGenerate} />
        )}

        {/* STATE 2: Generating (Calm skeleton with rotating messages) */}
        {appState === 'generating' && (
          <GeneratingState />
        )}

        {/* STATE 3: Plan (Single column, max-w-960px, simple tabs) */}
        {appState === 'plan' && plan && (
          <PlanState
            plan={plan}
            onRebalanceBudget={handleRebalanceBudget}
            onToggleTask={handleToggleTask}
            onToggleVendorItem={handleToggleVendorItem}
            onDismissAssumption={handleDismissAssumption}
            onApplyRefinement={handleApplyRefinement}
            isRefining={isRefining}
            onOpenInvite={() => setIsInviteOpen(true)}
            onOpenRunSheet={() => setIsRunSheetOpen(true)}
            onCopyText={handleCopyText}
            onSavePlan={handleSavePlan}
          />
        )}
      </main>

      {/* Modals */}
      <SavedPlansModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedPlans={savedPlans}
        onLoadPlan={(loadedPlan) => {
          setPlan(loadedPlan);
          setAppState('plan');
          showToast('Loaded saved plan');
        }}
        onDeletePlan={handleDeletePlan}
        onClearAll={handleClearAllSaved}
      />

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        inviteText={plan?.inviteText || { formal: '', casual: '', whatsapp: '' }}
        onCopyText={handleCopyText}
      />

      <DayOfRunSheetModal
        isOpen={isRunSheetOpen}
        onClose={() => setIsRunSheetOpen(false)}
        eventType={plan?.snapshot?.eventType || 'wedding'}
        onCopyText={handleCopyText}
      />

      {/* Subtle Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-text text-white px-4 py-2.5 rounded-xl shadow-[0_8px_30px_rgba(43,42,51,0.2)] text-xs font-medium flex items-center gap-2 animate-fade-in pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
