import { describe, it, expect } from 'vitest';
import { generateSmartPlan, parseNaturalInput } from '../src/lib/plannerDeterministic';
import { PlanSchema } from '../src/lib/schema';

describe('Deterministic Planner & Schema Compliance', () => {
  it('Scenario 1: Jaipur wedding (12,00,000 INR, 200 guests) satisfies PlanSchema strictly', () => {
    const plan = generateSmartPlan({
      eventType: 'wedding',
      guests: 200,
      budget: 1200000,
      currency: 'INR',
      location: 'Jaipur'
    });

    const validation = PlanSchema.safeParse(plan);
    expect(validation.success).toBe(true);

    // Verify exact budget match
    const sum = plan.budget.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(1200000);

    // Verify Trade-offs present
    expect(plan.tradeOffs.length).toBeGreaterThanOrEqual(3);

    // Verify Seed Guests present
    expect(plan.guests.length).toBeGreaterThan(0);

    // Verify Vendor Categories status and quote amounts
    expect(plan.vendorChecklist.length).toBeGreaterThan(0);
    plan.vendorChecklist.forEach(v => {
      expect(['To contact', 'Quoted', 'Booked']).toContain(v.status);
    });
  });

  it('Scenario 2: $500 surprise birthday satisfies PlanSchema', () => {
    const plan = generateSmartPlan({
      eventType: 'birthday',
      guests: 25,
      budget: 500,
      currency: 'USD'
    });

    const validation = PlanSchema.safeParse(plan);
    expect(validation.success).toBe(true);

    const sum = plan.budget.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(500);
  });

  it('Scenario 3: Volunteers-only / 0-budget event works without failure', () => {
    const plan = generateSmartPlan({
      eventType: 'community',
      guests: 100,
      budget: 0,
      currency: 'INR'
    });

    const validation = PlanSchema.safeParse(plan);
    expect(validation.success).toBe(true);
    expect(plan.snapshot.isVolunteersOnly).toBe(true);
    const sum = plan.budget.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(0);
  });

  it('Scenario 4: Vague input natural parser handles sister wedding query', () => {
    const parsed = parseNaturalInput("Sister's wedding, 200 guests, 12 lakh, Jaipur, December");
    expect(parsed.eventType).toBe('wedding');
    expect(parsed.guests).toBe(200);
    expect(parsed.budget).toBe(1200000);
    expect(parsed.currency).toBe('INR');
    expect(parsed.location).toBe('Jaipur');
  });

  it('Scenario 5: $1000 150-guest wedding triggers realistic warning', () => {
    const plan = generateSmartPlan({
      eventType: 'wedding',
      guests: 150,
      budget: 1000,
      currency: 'USD'
    });

    expect(plan.snapshot.realityCheck?.isUnrealistic).toBe(true);
    const sum = plan.budget.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(1000);
  });
});
