import { BudgetItem } from './schema.js';

/**
 * Standard category weights by event type
 */
const CATEGORY_TEMPLATES: Record<string, Array<{ category: string; percent: number; tip: string }>> = {
  wedding: [
    { category: 'Venue & Banquet', percent: 35, tip: 'Ask for weekday or morning ceremony rates for 20-30% venue discounts.' },
    { category: 'Catering & Dining', percent: 25, tip: 'Buffet style with live counters reduces staffing costs vs formal sit-down service.' },
    { category: 'Photography & Cinema', percent: 12, tip: 'Book 8-hour coverage instead of full 14-hour to save on overtime crews.' },
    { category: 'Decor & Florals', percent: 10, tip: 'Use seasonal local flowers and reusable ambient lighting (fairy lights, warm lanterns).' },
    { category: 'Attire & Styling', percent: 5, tip: 'Rental or boutique designer sales save up to 60% compared to custom bridal couture.' },
    { category: 'Sound, DJ & Entertainment', percent: 5, tip: 'Curate your own cocktail playlist and book the live performer only for peak party hours.' },
    { category: 'Contingency Reserve', percent: 8, tip: 'Locked safety cushion for surprise vendor overtime, gratuities, or unexpected transport.' }
  ],
  birthday: [
    { category: 'Food & Beverage', percent: 40, tip: 'Signature cocktail pitcher + craft finger foods is more festive and 35% cheaper than open bar.' },
    { category: 'Venue Rental', percent: 25, tip: 'Clubhouses, scenic parks, or private backyards eliminate expensive commercial venue minimums.' },
    { category: 'Decor & Lighting', percent: 12, tip: 'Balloon arches and paper honeycomb lanterns create maximum photo impact per dollar.' },
    { category: 'Cake & Sweets', percent: 8, tip: 'Order a smaller display centerpiece cake supplemented with sheet cakes for slicing.' },
    { category: 'Music & Games', percent: 7, tip: 'High-power bluetooth sound system + party host trivia or curated DJ playlist.' },
    { category: 'Contingency Reserve', percent: 8, tip: 'Dedicated buffer for extra last-minute guests or broken glassware deposits.' }
  ],
  community: [
    { category: 'Venue & Permits', percent: 30, tip: 'Apply for municipal or NGO community space waivers 6 weeks in advance.' },
    { category: 'Food & Refreshments', percent: 30, tip: 'Partner with local bakeries or bulk community kitchens for cost-price catering.' },
    { category: 'Signage & Production', percent: 15, tip: 'Reusable fabric banners and QR code digital program guides eliminate paper waste.' },
    { category: 'Audio/Visual & Staging', percent: 15, tip: 'Borrow school or civic society PA systems with wireless lapel microphones.' },
    { category: 'Contingency & Sanitation', percent: 10, tip: 'Mandatory reserve for municipal cleaning permits, first-aid, and safety supplies.' }
  ],
  default: [
    { category: 'Venue & Facilities', percent: 35, tip: 'Check inclusive package deals that bundle tables, chairs, and baseline setup.' },
    { category: 'Food & Hospitality', percent: 30, tip: 'Focus on 3 crowd-pleasing signature entrees rather than an oversized confusing spread.' },
    { category: 'Production & Decor', percent: 15, tip: 'Strategic warm lighting transforms any blank canvas space on a tight budget.' },
    { category: 'Logistics & Audio', percent: 10, tip: 'Confirm loading dock access hours early to avoid venue penalty fees.' },
    { category: 'Contingency Reserve', percent: 10, tip: 'Safety buffer protecting your event against unexpected supplier inflation.' }
  ]
};

/**
 * Normalizes percentages to sum to exactly 100
 */
function normalizePercentages(items: Array<{ category: string; percent: number; tip: string }>): Array<{ category: string; percent: number; tip: string }> {
  const sum = items.reduce((acc, it) => acc + it.percent, 0);
  if (sum === 100) return items;

  let running = 0;
  return items.map((it, idx) => {
    if (idx === items.length - 1) {
      return { ...it, percent: 100 - running };
    }
    const scaled = Math.round((it.percent / sum) * 100);
    running += scaled;
    return { ...it, percent: scaled };
  });
}

/**
 * Enforces that budget item amounts sum exactly to totalBudget down to the single unit.
 * Handles rounding, tiny budgets, and zero budgets.
 * Pure function: returns a new array with no mutations.
 */
export function enforceTotal(budgetRows: BudgetItem[], totalBudget: number): BudgetItem[] {
  if (!budgetRows || budgetRows.length === 0) return [];
  const target = Math.max(0, Math.round(Number(totalBudget) || 0));

  if (target === 0) {
    return budgetRows.map(row => ({
      ...row,
      amount: 0
    }));
  }

  let runningAmount = 0;
  const result: BudgetItem[] = [];

  for (let i = 0; i < budgetRows.length; i++) {
    const row = budgetRows[i];
    let amount: number;

    if (i === budgetRows.length - 1) {
      // Final item absorbs any rounding residual
      amount = Math.max(0, target - runningAmount);
    } else {
      amount = Math.round((target * row.percent) / 100);
      runningAmount += amount;
    }

    result.push({
      ...row,
      amount
    });
  }

  return result;
}

/**
 * Allocates initial budget rows for an event type and total budget.
 * Guarantees exact sum and 5-10% contingency reserve.
 */
export function allocate(totalBudget: number, eventType: string = 'wedding', mode: string = 'balanced'): BudgetItem[] {
  const key = eventType.toLowerCase();
  let baseTemplate = CATEGORY_TEMPLATES.default;

  if (key.includes('wed') || key.includes('marriage') || key.includes('reception') || key.includes('anniversary')) {
    baseTemplate = CATEGORY_TEMPLATES.wedding;
  } else if (key.includes('birth') || key.includes('party') || key.includes('dinner') || key.includes('shower')) {
    baseTemplate = CATEGORY_TEMPLATES.birthday;
  } else if (key.includes('fund') || key.includes('communit') || key.includes('fest') || key.includes('meet') || key.includes('gala')) {
    baseTemplate = CATEGORY_TEMPLATES.community;
  }

  // Adjust for modes if applicable
  let template = baseTemplate.map(it => ({ ...it }));
  if (mode === 'budgetSaver') {
    // Increase contingency by 2% for tighter buffer, slightly decrease decor
    template = template.map(it => {
      if (it.category.includes('Contingency')) return { ...it, percent: Math.min(12, it.percent + 2) };
      if (it.category.includes('Decor') || it.category.includes('Production')) return { ...it, percent: Math.max(5, it.percent - 2) };
      return it;
    });
  }

  const normalized = normalizePercentages(template);

  const initialRows: BudgetItem[] = normalized.map((it, idx) => ({
    id: `b-${idx + 1}`,
    category: it.category,
    percent: it.percent,
    amount: 0,
    tip: it.tip
  }));

  return enforceTotal(initialRows, totalBudget);
}

/**
 * Pure function to rebalance budget when one percentage slider changes.
 * Redistributes difference across other categories and recalculates exact integer amounts.
 */
export function rebalance(
  budgetRows: BudgetItem[],
  changedIdx: number,
  newPercent: number,
  totalBudget: number
): BudgetItem[] {
  if (!budgetRows || budgetRows.length === 0) return [];
  if (changedIdx < 0 || changedIdx >= budgetRows.length) return enforceTotal(budgetRows, totalBudget);

  const clampedPercent = Math.max(1, Math.min(90, Math.round(newPercent)));
  const oldPercent = budgetRows[changedIdx].percent;
  const delta = clampedPercent - oldPercent;

  if (delta === 0) return enforceTotal(budgetRows, totalBudget);

  // Other items to absorb the delta
  const otherIndices = budgetRows.map((_, i) => i).filter(i => i !== changedIdx);
  const otherTotalPercent = otherIndices.reduce((sum, i) => sum + budgetRows[i].percent, 0);

  const newPercents = budgetRows.map(r => r.percent);
  newPercents[changedIdx] = clampedPercent;

  let distributedDelta = 0;
  for (let i = 0; i < otherIndices.length; i++) {
    const idx = otherIndices[i];
    if (i === otherIndices.length - 1) {
      // Last other item takes the remainder
      newPercents[idx] = Math.max(1, 100 - (clampedPercent + distributedDelta));
    } else {
      const share = otherTotalPercent > 0 ? budgetRows[idx].percent / otherTotalPercent : 1 / otherIndices.length;
      const deduction = Math.round(delta * share);
      const updated = Math.max(1, budgetRows[idx].percent - deduction);
      distributedDelta += (budgetRows[idx].percent - updated);
      newPercents[idx] = updated;
    }
  }

  // Final sanity check on sum of percents
  const percentSum = newPercents.reduce((a, b) => a + b, 0);
  if (percentSum !== 100) {
    const lastIdx = otherIndices[otherIndices.length - 1];
    newPercents[lastIdx] += (100 - percentSum);
  }

  const updatedRows = budgetRows.map((row, i) => ({
    ...row,
    percent: newPercents[i]
  }));

  return enforceTotal(updatedRows, totalBudget);
}

/**
 * Applies a trade-off cost delta to total budget and rebalances amounts.
 */
export function applyTradeOff(
  budgetRows: BudgetItem[],
  totalBudget: number,
  costDelta: number
): { updatedRows: BudgetItem[]; updatedTotal: number } {
  const updatedTotal = Math.max(0, Math.round(totalBudget + costDelta));
  const updatedRows = enforceTotal(budgetRows, updatedTotal);
  return { updatedRows, updatedTotal };
}
