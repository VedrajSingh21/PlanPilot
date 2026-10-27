import { z } from 'zod';

/**
 * Currency Symbols supported by PlanPilot
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$'
};

/**
 * Formats a monetary number according to currency standard
 */
export function formatCurrency(amount: number | string, currency: string = 'INR'): string {
  const sym = CURRENCY_SYMBOLS[currency] || (currency === 'INR' ? '₹' : '$');
  const num = Math.round(Number(amount) || 0);
  if (currency === 'INR') {
    return `${sym}${num.toLocaleString('en-IN')}`;
  }
  return `${sym}${num.toLocaleString('en-US')}`;
}

/**
 * Reality check payload for budget feasibility analysis
 */
export const RealityCheckSchema = z.object({
  isUnrealistic: z.boolean(),
  perHead: z.number(),
  message: z.string(),
  suggestions: z.array(z.string())
});
export type RealityCheck = z.infer<typeof RealityCheckSchema>;

/**
 * High-level Event Snapshot schema
 */
export const SnapshotSchema = z.object({
  eventType: z.string(),
  eventName: z.string(),
  tagline: z.string(),
  guests: z.number().int().positive(),
  totalBudget: z.number().nonnegative(),
  currency: z.string(),
  timingText: z.string(),
  location: z.string(),
  vibe: z.string(),
  mode: z.enum(['balanced', 'budgetSaver', 'luxury', 'lastMinute']),
  whyThisPlan: z.string().optional(),
  realityCheck: RealityCheckSchema.optional(),
  isVolunteersOnly: z.boolean().optional(),
  culturalNotice: z.string().optional(),
  alcoholNotice: z.string().optional()
});
export type Snapshot = z.infer<typeof SnapshotSchema>;

/**
 * Line item in budget allocation table
 */
export const BudgetItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  percent: z.number().min(0).max(100),
  amount: z.number().int().nonnegative(),
  tip: z.string()
});
export type BudgetItem = z.infer<typeof BudgetItemSchema>;

/**
 * Option in a Trade-off Decision card
 */
export const TradeOffOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  costDeltaPercent: z.number(),
  costDeltaAmount: z.number(),
  description: z.string()
});
export type TradeOffOption = z.infer<typeof TradeOffOptionSchema>;

/**
 * Trade-off Card generated for decision tracking
 */
export const TradeOffCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  impactDescription: z.string(),
  options: z.array(TradeOffOptionSchema)
});
export type TradeOffCard = z.infer<typeof TradeOffCardSchema>;

/**
 * Trade-off Decision made and logged
 */
export const TradeOffDecisionSchema = z.object({
  id: z.string(),
  cardId: z.string(),
  title: z.string(),
  chosenOptionId: z.string(),
  chosenLabel: z.string(),
  costDelta: z.number(),
  timestamp: z.string()
});
export type TradeOffDecision = z.infer<typeof TradeOffDecisionSchema>;

/**
 * Task item in a timeline phase
 */
export const TimelineTaskSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean()
});
export type TimelineTask = z.infer<typeof TimelineTaskSchema>;

/**
 * Timeline phase milestone
 */
export const TimelinePhaseSchema = z.object({
  phase: z.string(),
  isThisWeek: z.boolean().optional(),
  tasks: z.array(TimelineTaskSchema)
});
export type TimelinePhase = z.infer<typeof TimelinePhaseSchema>;

/**
 * Individual checklist task item for a vendor category
 */
export const VendorItemSchema = z.object({
  id: z.string(),
  task: z.string(),
  tag: z.enum(['Ask', 'Confirm', 'Contract', 'Permit', 'Safety']),
  completed: z.boolean()
});
export type VendorItem = z.infer<typeof VendorItemSchema>;

/**
 * Vendor Category with status tracking, quote comparison, and checklist
 */
export const VendorCategorySchema = z.object({
  category: z.string(),
  status: z.enum(['To contact', 'Quoted', 'Booked']).default('To contact'),
  quoteAmount: z.number().nullable().optional(),
  budgetLineAmount: z.number().nonnegative().optional(),
  items: z.array(VendorItemSchema)
});
export type VendorCategory = z.infer<typeof VendorCategorySchema>;

/**
 * Guest list member schema
 */
export const GuestSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  group: z.string().default('General'),
  rsvp: z.enum(['Invited', 'Yes', 'No', 'Maybe']).default('Invited'),
  dietary: z.string().default('None'),
  plusOnes: z.number().int().min(0).default(0)
});
export type Guest = z.infer<typeof GuestSchema>;

/**
 * Guest list state including AI suggestions
 */
export const GuestListStateSchema = z.object({
  guests: z.array(GuestSchema),
  aiSuggestions: z.string().optional()
});
export type GuestListState = z.infer<typeof GuestListStateSchema>;

/**
 * Creative event concept card
 */
export const IdeaSchema = z.object({
  title: z.string(),
  desc: z.string(),
  type: z.enum(['theme', 'activity', 'favor', 'menu', 'wow'])
});
export type Idea = z.infer<typeof IdeaSchema>;

/**
 * Budget-saving alternative idea
 */
export const SavingIdeaSchema = z.object({
  title: z.string(),
  desc: z.string()
});
export type SavingIdea = z.infer<typeof SavingIdeaSchema>;

/**
 * Risk and mitigation contingency
 */
export const RiskSchema = z.object({
  risk: z.string(),
  mitigation: z.string()
});
export type Risk = z.infer<typeof RiskSchema>;

/**
 * Ready-to-send invitation copy text
 */
export const InviteTextSchema = z.object({
  formal: z.string(),
  casual: z.string(),
  whatsapp: z.string()
});
export type InviteText = z.infer<typeof InviteTextSchema>;

/**
 * Volunteer tracker for grassroots/community events
 */
export const VolunteerTrackerSchema = z.object({
  id: z.string(),
  category: z.string(),
  role: z.string(),
  inKindTarget: z.string(),
  volunteersNeeded: z.number().int(),
  confirmed: z.number().int()
});
export type VolunteerTracker = z.infer<typeof VolunteerTrackerSchema>;

/**
 * Complete Plan Blueprint Schema - Single Source of Truth
 */
export const PlanSchema = z.object({
  snapshot: SnapshotSchema,
  assumptions: z.array(z.string()),
  budget: z.array(BudgetItemSchema),
  tradeOffs: z.array(TradeOffCardSchema).default([]),
  tradeOffDecisions: z.array(TradeOffDecisionSchema).default([]),
  timeline: z.array(TimelinePhaseSchema),
  vendorChecklist: z.array(VendorCategorySchema),
  guests: z.array(GuestSchema).default([]),
  guestAiNotes: z.string().optional(),
  ideas: z.array(IdeaSchema),
  savingIdeas: z.array(SavingIdeaSchema),
  risks: z.array(RiskSchema),
  nextSteps: z.array(z.string()),
  inviteText: InviteTextSchema,
  volunteerTracker: z.array(VolunteerTrackerSchema).optional()
});
export type Plan = z.infer<typeof PlanSchema>;

/**
 * Request payload validation for generating a plan
 */
export const PlanRequestSchema = z.object({
  eventType: z.string().max(100).optional(),
  guests: z.number().int().min(1).max(50000).optional(),
  budget: z.number().int().min(0).max(1000000000).optional(),
  currency: z.string().max(10).optional(),
  location: z.string().max(200).optional(),
  timing: z.string().max(100).optional(),
  mode: z.enum(['balanced', 'budgetSaver', 'luxury', 'lastMinute']).optional(),
  freeText: z.string().max(2000).optional(),
  vibe: z.string().max(300).optional()
});
export type PlanRequest = z.infer<typeof PlanRequestSchema>;

/**
 * Request payload validation for plan refinement
 */
export const RefineRequestSchema = z.object({
  refinement: z.string().min(1).max(1000),
  currentPlan: PlanSchema
});
export type RefineRequest = z.infer<typeof RefineRequestSchema>;

/**
 * Request payload validation for drafting a vendor inquiry message
 */
export const VendorMessageRequestSchema = z.object({
  category: z.string().max(100),
  eventName: z.string().max(200),
  eventType: z.string().max(100),
  guests: z.number().int(),
  location: z.string().max(200),
  dateOrTiming: z.string().max(100),
  budgetLineAmount: z.number().optional(),
  currency: z.string().default('INR'),
  checkpoints: z.array(z.string()).default([])
});
export type VendorMessageRequest = z.infer<typeof VendorMessageRequestSchema>;

/**
 * Request payload validation for guest list AI recommendations
 */
export const GuestAIRequestSchema = z.object({
  guests: z.array(GuestSchema),
  eventName: z.string().max(200),
  eventType: z.string().max(100)
});
export type GuestAIRequest = z.infer<typeof GuestAIRequestSchema>;
