import { useState } from 'react';
import Navbar from './components/Navbar';
import HomeState from './components/HomeState';
import GeneratingState from './components/GeneratingState';
import PlanState from './features/plan/PlanState';
import SavedPlansModal from './components/SavedPlansModal';
import InviteModal from './components/InviteModal';
import DayOfRunSheetModal from './components/DayOfRunSheetModal';
import { Plan, PlanSchema, PlanRequest, VendorCategory, Guest } from './lib/schema';
import { enforceTotal, rebalance, applyTradeOff } from './lib/budget';
import { parseNaturalInput, generateSmartPlan } from './lib/plannerDeterministic';
import {
  loadSavedScenarios,
  saveScenario,
  deleteScenario,
  clearAllUserData,
  SavedScenario
} from './lib/storage';

export default function App() {
  const [appState, setAppState] = useState<'home' | 'generating' | 'plan'>('home');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [fallbackBanner, setFallbackBanner] = useState('');

  // Modals
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isRunSheetOpen, setIsRunSheetOpen] = useState(false);

  // Saved Plans in LocalStorage
  const [savedPlans, setSavedPlans] = useState<SavedScenario[]>(() => loadSavedScenarios());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // Generation Handler
  const handleGenerate = async ({
    prompt,
    details
  }: {
    prompt: string;
    details: PlanRequest | null;
  }) => {
    setAppState('generating');
    setFallbackBanner('');

    // Parse natural language from prompt
    const parsed = parseNaturalInput(prompt);

    const mergedPayload: PlanRequest = {
      eventType: details?.eventType || parsed.eventType || 'wedding',
      guests: details?.guests || parsed.guests || 100,
      budget: details?.budget !== undefined ? details.budget : parsed.budget,
      currency: details?.currency || parsed.currency || 'INR',
      location: details?.location || parsed.location || 'Local area',
      timing: details?.timing || parsed.timing || 'In 3 months',
      mode: details?.mode || parsed.mode || 'balanced',
      freeText: prompt
    };

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedPayload)
      });

      const data = await res.json();

      if (data.ok && data.plan) {
        const validated = PlanSchema.safeParse(data.plan);
        if (validated.success) {
          const reconciledPlan: Plan = {
            ...validated.data,
            budget: enforceTotal(validated.data.budget, validated.data.snapshot.totalBudget)
          };
          setPlan(reconciledPlan);
          if (data.source === 'template' && data.error) {
            setFallbackBanner('Deterministic template planner applied (AI service unavailable or parsing fallback).');
          }
          setAppState('plan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    } catch {
      // Offline or network error fallback
    }

    // Direct client fallback to deterministic engine
    const fallbackPlan = generateSmartPlan(mergedPayload);
    setPlan(fallbackPlan);
    setFallbackBanner('Structured template plan generated offline.');
    setAppState('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Budget Rebalance Slider
  const handleRebalanceBudget = (changedIdx: number, newPercent: number) => {
    if (!plan) return;
    const updatedRows = rebalance(plan.budget, changedIdx, newPercent, plan.snapshot.totalBudget);
    setPlan({
      ...plan,
      budget: updatedRows
    });
  };

  // Trade-off Decision Selection
  const handleChooseTradeOff = (
    cardId: string,
    optionId: string,
    costDelta: number,
    label: string
  ) => {
    if (!plan) return;
    const { updatedRows, updatedTotal } = applyTradeOff(
      plan.budget,
      plan.snapshot.totalBudget,
      costDelta
    );

    const newDecision = {
      id: `dec-${Date.now()}`,
      cardId,
      title: label,
      chosenOptionId: optionId,
      chosenLabel: label,
      costDelta,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const existingDecisions = plan.tradeOffDecisions.filter(d => d.cardId !== cardId);

    setPlan({
      ...plan,
      snapshot: {
        ...plan.snapshot,
        totalBudget: updatedTotal
      },
      budget: updatedRows,
      tradeOffDecisions: [...existingDecisions, newDecision]
    });

    showToast(`Trade-off applied: ${label}`);
  };

  // Toggle Task in Timeline
  const handleToggleTask = (taskId: string) => {
    if (!plan) return;
    const updatedTimeline = plan.timeline.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    }));
    setPlan({ ...plan, timeline: updatedTimeline });
  };

  // Toggle Vendor Item
  const handleToggleVendorItem = (itemId: string) => {
    if (!plan) return;
    const updatedVendors = plan.vendorChecklist.map(cat => ({
      ...cat,
      items: cat.items.map(item => (item.id === itemId ? { ...item, completed: !item.completed } : item))
    }));
    setPlan({ ...plan, vendorChecklist: updatedVendors });
  };

  // Update Vendor Category Status
  const handleUpdateVendorStatus = (catIdx: number, status: VendorCategory['status']) => {
    if (!plan) return;
    const updated = plan.vendorChecklist.map((cat, idx) => (idx === catIdx ? { ...cat, status } : cat));
    setPlan({ ...plan, vendorChecklist: updated });
    showToast(`Vendor status updated to ${status}`);
  };

  // Update Vendor Category Quote
  const handleUpdateVendorQuote = (catIdx: number, amount: number | null) => {
    if (!plan) return;
    const updated = plan.vendorChecklist.map((cat, idx) => (idx === catIdx ? { ...cat, quoteAmount: amount } : cat));
    setPlan({ ...plan, vendorChecklist: updated });
  };

  // Guest Management Handlers
  const handleAddGuest = (guestData: Omit<Guest, 'id'>) => {
    if (!plan) return;
    const newGuest: Guest = {
      ...guestData,
      id: `g-${Date.now()}`
    };
    setPlan({ ...plan, guests: [...plan.guests, newGuest] });
    showToast(`Added ${newGuest.name}`);
  };

  const handleUpdateGuest = (id: string, updatedFields: Partial<Guest>) => {
    if (!plan) return;
    const updatedGuests = plan.guests.map(g => (g.id === id ? { ...g, ...updatedFields } : g));
    setPlan({ ...plan, guests: updatedGuests });
  };

  const handleRemoveGuest = (id: string) => {
    if (!plan) return;
    const updatedGuests = plan.guests.filter(g => g.id !== id);
    setPlan({ ...plan, guests: updatedGuests });
    showToast('Guest removed');
  };

  const handleImportGuests = (imported: Guest[]) => {
    if (!plan) return;
    const existingIds = new Set(plan.guests.map(g => g.id));
    const toAdd = imported.filter(g => !existingIds.has(g.id));
    setPlan({ ...plan, guests: [...plan.guests, ...toAdd] });
    showToast(`Imported ${toAdd.length} guests from CSV`);
  };

  const handleSaveGuestAiNotes = (notes: string) => {
    if (!plan) return;
    setPlan({ ...plan, guestAiNotes: notes });
  };

  // Refinement Handler
  const handleApplyRefinement = async (refinementText: string) => {
    if (!plan) return;
    setIsRefining(true);

    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refinement: refinementText, currentPlan: plan })
      });
      const data = await res.json();
      if (data.ok && data.plan) {
        const validated = PlanSchema.safeParse(data.plan);
        if (validated.success) {
          setPlan(validated.data);
          showToast('Refinement applied');
          setIsRefining(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    setPlan({
      ...plan,
      assumptions: [...plan.assumptions, `Refined: ${refinementText}`]
    });
    showToast('Refinement noted');
    setIsRefining(false);
  };

  // Save Plan
  const handleSavePlan = () => {
    if (!plan) return;
    const updated = saveScenario(plan);
    setSavedPlans(updated);
    showToast('Blueprint saved to My Plans');
  };

  // Delete Plan
  const handleDeletePlan = (id: string) => {
    const updated = deleteScenario(id);
    setSavedPlans(updated);
    showToast('Plan deleted');
  };

  // Clear All Data
  const handleClearAllData = () => {
    clearAllUserData();
    setSavedPlans([]);
    showToast('All stored data cleared');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text font-sans antialiased">
      {/* Accessibility: Skip to Content Landmark */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-primary text-white px-4 py-2 rounded-xl shadow-lg font-bold outline-none"
      >
        Skip to main content
      </a>

      {/* 1. TOP NAVBAR (64px fixed, 2 items on right) */}
      <Navbar
        onNewPlan={() => {
          setAppState('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        savedCount={savedPlans.length}
      />

      {/* 2. MAIN CONTENT (Starts below 64px header) */}
      <main id="main-content" tabIndex={-1} className="flex-1 pt-16 outline-none">
        {/* Subtle Fallback Banner if applicable */}
        {fallbackBanner && appState === 'plan' && (
          <div className="max-w-240 mx-auto px-4 pt-3" role="status" aria-live="polite">
            <div className="p-2.5 rounded-xl bg-surface-soft border border-border text-xs text-text-muted flex items-center justify-between gap-2">
              <span>{fallbackBanner}</span>
              <button
                type="button"
                onClick={() => setFallbackBanner('')}
                className="text-text font-bold hover:underline cursor-pointer"
                aria-label="Dismiss banner"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* STATE 1: Home State */}
        {appState === 'home' && (
          <HomeState onGenerate={handleGenerate} />
        )}

        {/* STATE 2: Generating State */}
        {appState === 'generating' && (
          <GeneratingState />
        )}

        {/* STATE 3: Plan State */}
        {appState === 'plan' && plan && (
          <PlanState
            plan={plan}
            onRebalanceBudget={handleRebalanceBudget}
            onChooseTradeOff={handleChooseTradeOff}
            onToggleTask={handleToggleTask}
            onToggleVendorItem={handleToggleVendorItem}
            onUpdateVendorStatus={handleUpdateVendorStatus}
            onUpdateVendorQuote={handleUpdateVendorQuote}
            onAddGuest={handleAddGuest}
            onUpdateGuest={handleUpdateGuest}
            onRemoveGuest={handleRemoveGuest}
            onImportGuests={handleImportGuests}
            onSaveGuestAiNotes={handleSaveGuestAiNotes}
            onApplyRefinement={handleApplyRefinement}
            isRefining={isRefining}
            onOpenInvite={() => setIsInviteOpen(true)}
            onOpenRunSheet={() => setIsRunSheetOpen(true)}
            onCopyText={(text, msg) => {
              navigator.clipboard.writeText(text);
              showToast(msg);
            }}
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
          showToast('Loaded saved blueprint');
        }}
        onDeletePlan={handleDeletePlan}
        onClearAll={handleClearAllData}
      />

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        inviteText={plan?.inviteText || { formal: '', casual: '', whatsapp: '' }}
        onCopyText={(text, msg) => {
          navigator.clipboard.writeText(text);
          showToast(msg);
        }}
      />

      <DayOfRunSheetModal
        isOpen={isRunSheetOpen}
        onClose={() => setIsRunSheetOpen(false)}
        eventType={plan?.snapshot?.eventType || 'wedding'}
        onCopyText={(text, msg) => {
          navigator.clipboard.writeText(text);
          showToast(msg);
        }}
      />

      {/* Toast Announcement with aria-live */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-text text-white px-4 py-2.5 rounded-xl shadow-[0_8px_30px_rgba(43,42,51,0.2)] text-xs font-medium flex items-center gap-2 animate-fade-in pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
