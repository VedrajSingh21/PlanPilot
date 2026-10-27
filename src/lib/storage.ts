import { Plan, PlanSchema } from './schema';

const STORAGE_KEY = 'planpilot_saved_scenarios';

export interface SavedScenario {
  id: string;
  timestamp: string;
  plan: Plan;
}

/**
 * Loads all saved plan scenarios safely with schema parsing
 */
export function loadSavedScenarios(): SavedScenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item: unknown): item is SavedScenario => {
      if (!item || typeof item !== 'object') return false;
      const s = item as Partial<SavedScenario>;
      if (!s.id || !s.plan) return false;
      const result = PlanSchema.safeParse(s.plan);
      return result.success;
    });
  } catch {
    return [];
  }
}

/**
 * Saves or updates a plan scenario
 */
export function saveScenario(plan: Plan): SavedScenario[] {
  const current = loadSavedScenarios();
  const id = `plan-${Date.now()}`;
  const now = new Date();
  const timestamp = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const newEntry: SavedScenario = {
    id,
    timestamp,
    plan
  };

  const updated = [newEntry, ...current].slice(0, 20); // Cap at 20 stored plans
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // QuotaExceeded or disabled localStorage
  }
  return updated;
}

/**
 * Deletes a single scenario by ID
 */
export function deleteScenario(id: string): SavedScenario[] {
  const current = loadSavedScenarios();
  const filtered = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
  return filtered;
}

/**
 * Completely clears all user stored scenarios and state
 */
export function clearAllUserData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.clear();
  } catch {
    // ignore
  }
}
