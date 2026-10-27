import {
  Plan,
  Snapshot,
  TradeOffCard,
  VendorCategory,
  Guest,
  Idea,
  SavingIdea,
  Risk,
  InviteText,
  formatCurrency
} from './schema.js';
import { allocate } from './budget.js';

/**
 * Natural language parser for quick prompt extraction
 */
export function parseNaturalInput(query: string = ''): {
  eventType?: string;
  guests?: number;
  budget?: number;
  currency?: string;
  location?: string;
  timing?: string;
  mode?: 'balanced' | 'budgetSaver' | 'luxury' | 'lastMinute';
  vibe?: string;
} {
  const q = query.trim().toLowerCase();
  const result: ReturnType<typeof parseNaturalInput> = {};

  // Event Type
  if (q.includes('wed') || q.includes('marriage') || q.includes('shaadi') || q.includes('reception') || q.includes('sangeet')) {
    result.eventType = 'wedding';
  } else if (q.includes('birth') || q.includes('bday') || q.includes('sweet 16') || q.includes('30th') || q.includes('50th')) {
    result.eventType = 'birthday';
  } else if (q.includes('fundrais') || q.includes('charity') || q.includes('gala') || q.includes('ngo') || q.includes('meetup') || q.includes('hackathon') || q.includes('communit')) {
    result.eventType = 'community';
  }

  // Currency
  if (q.includes('$') || q.includes('usd') || q.includes('dollar')) {
    result.currency = 'USD';
  } else if (q.includes('€') || q.includes('eur')) {
    result.currency = 'EUR';
  } else if (q.includes('£') || q.includes('gbp')) {
    result.currency = 'GBP';
  } else if (q.includes('₹') || q.includes('inr') || q.includes('lakh') || q.includes('crore') || q.includes('rupee')) {
    result.currency = 'INR';
  }

  // Budget
  const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)/i);
  if (lakhMatch && lakhMatch[1]) {
    result.budget = Math.round(parseFloat(lakhMatch[1]) * 100000);
    result.currency = 'INR';
  } else {
    const currBudgetMatch = q.match(/(?:[$₹€£]|inr|usd|budget\s*(?:of|is|:)?\s*)\s*(\d[\d,]*)/i);
    if (currBudgetMatch && currBudgetMatch[1]) {
      const parsed = parseInt(currBudgetMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) result.budget = parsed;
    } else {
      const genericBudgetMatch = q.match(/(?:budget|cost|price|spend|for)\s*(?:is|of|about|approx)?\s*(\d[\d,]*)/i);
      if (genericBudgetMatch && genericBudgetMatch[1]) {
        const parsed = parseInt(genericBudgetMatch[1].replace(/,/g, ''), 10);
        if (!isNaN(parsed) && parsed > 50) result.budget = parsed;
      }
    }
  }

  // Guests
  const guestMatch = q.match(/(\d+)\s*(?:guests?|people|pax|attendees?|persons?|members?)/i);
  if (guestMatch && guestMatch[1]) {
    result.guests = parseInt(guestMatch[1], 10);
  }

  // Mode
  if (q.includes('saver') || q.includes('frugal') || q.includes('tight') || q.includes('cheap') || q.includes('diy') || q.includes('budget-saver')) {
    result.mode = 'budgetSaver';
  } else if (q.includes('luxur') || q.includes('premium') || q.includes('lavish') || q.includes('high-end') || q.includes('royal')) {
    result.mode = 'luxury';
  } else if (q.includes('urgent') || q.includes('last minute') || q.includes('quick') || q.includes('2 weeks') || q.includes('this weekend')) {
    result.mode = 'lastMinute';
  }

  // Timing
  if (q.includes('december') || q.includes('dec')) result.timing = 'December 2026';
  else if (q.includes('november') || q.includes('nov')) result.timing = 'November 2026';
  else if (q.includes('january') || q.includes('jan')) result.timing = 'January 2027';
  else if (q.includes('3 months')) result.timing = 'In 3 months';
  else if (q.includes('6 months')) result.timing = 'In 6 months';

  // Location
  const cities = ['jaipur', 'mumbai', 'delhi', 'goa', 'bangalore', 'bengaluru', 'udaipur', 'pune', 'hyderabad', 'chennai', 'kolkata', 'new york', 'london', 'paris', 'san francisco'];
  for (const city of cities) {
    if (q.includes(city)) {
      result.location = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  return result;
}

/**
 * Deterministic Trade-off Cards generator
 */
function generateTradeOffs(eventType: string, _currency: string, totalBudget: number): TradeOffCard[] {
  if (eventType === 'wedding') {
    return [
      {
        id: 'to-1',
        title: 'Heritage Palace Banquet vs. Boutique Open Lawn',
        impactDescription: 'Trading indoor luxury ballroom for scenic lawn reduces venue fees by 20%, reallocatable to premium floral decor.',
        options: [
          {
            id: 'opt-1a',
            label: 'Keep Heritage Indoor Palace',
            costDeltaPercent: 0,
            costDeltaAmount: 0,
            description: 'All-inclusive air conditioned ballroom with dedicated green rooms and sound curfews extended to 11 PM.'
          },
          {
            id: 'opt-1b',
            label: 'Switch to Boutique Open Lawn (Save 15%)',
            costDeltaPercent: -15,
            costDeltaAmount: Math.round(-totalBudget * 0.15),
            description: 'Open air under the stars. Eliminates indoor banquet rental fees; frees funds for fairy light canopy.'
          }
        ]
      },
      {
        id: 'to-2',
        title: '7-Course Plated Service vs. Royal Live Food Stations',
        impactDescription: 'Live culinary counters create interactive celebratory energy and cut serving staffing by 30%.',
        options: [
          {
            id: 'opt-2a',
            label: 'Royal Live Food Stations (Neutral)',
            costDeltaPercent: 0,
            costDeltaAmount: 0,
            description: 'Chaat bazaar, woodfire sourdough pizza, and regional tandoor counters with high guest mingling.'
          },
          {
            id: 'opt-2b',
            label: 'Upgrade to 7-Course Plated Fine Dining (+10%)',
            costDeltaPercent: 10,
            costDeltaAmount: Math.round(totalBudget * 0.10),
            description: 'Synchronized synchronized silver service with dedicated table sommeliers and printed place-card menus.'
          }
        ]
      },
      {
        id: 'to-3',
        title: 'Full Day 14h Cinema Crew vs. 8h Peak Party Coverage',
        impactDescription: 'Focusing cinematic videographers strictly on ceremony and sangeet party cuts crew overtime charges.',
        options: [
          {
            id: 'opt-3a',
            label: '8h Peak Coverage (Save 8%)',
            costDeltaPercent: -8,
            costDeltaAmount: Math.round(-totalBudget * 0.08),
            description: 'Captures first look, main ceremony, and high-energy dance floor without paying for downtime.'
          },
          {
            id: 'opt-3b',
            label: '14h Full Documentary + Drone (+8%)',
            costDeltaPercent: 8,
            costDeltaAmount: Math.round(totalBudget * 0.08),
            description: 'Complete morning getting-ready coverage, drone aerial establishing shots, and 4K feature film.'
          }
        ]
      }
    ];
  }

  // Birthday / Community generic trade-offs
  return [
    {
      id: 'to-1',
      title: 'Commercial Venue vs. Private Clubhouse / Lawn',
      impactDescription: 'Using a private clubhouse or scenic park lawn cuts baseline rental cost dramatically.',
      options: [
        {
          id: 'opt-1a',
          label: 'Commercial Lounge / Banquet',
          costDeltaPercent: 0,
          costDeltaAmount: 0,
          description: 'Turnkey venue with in-house sound, lighting and cleaning staff.'
        },
        {
          id: 'opt-1b',
          label: 'Private Lawn / Community Hall (Save 20%)',
          costDeltaPercent: -20,
          costDeltaAmount: Math.round(-totalBudget * 0.20),
          description: 'Minimal venue fee. Allows spending more on DIY entertainment and gourmet grazing tables.'
        }
      ]
    },
    {
      id: 'to-2',
      title: 'Curated Open Bar vs. Signature Cocktails & Craft Mocktails',
      impactDescription: 'Focusing on 2 signature drinks rather than a full open bar reduces liquor variance and bartender fees.',
      options: [
        {
          id: 'opt-2a',
          label: '2 Signature Cocktails + Craft Sodas (Save 12%)',
          costDeltaPercent: -12,
          costDeltaAmount: Math.round(-totalBudget * 0.12),
          description: 'Two Instagrammable signature recipes with botanical garnishes.'
        },
        {
          id: 'opt-2b',
          label: 'Full Premium Open Bar (+15%)',
          costDeltaPercent: 15,
          costDeltaAmount: Math.round(totalBudget * 0.15),
          description: 'Unlimited top-shelf spirits, sparkling wine, and dedicated cocktail mixologists.'
        }
      ]
    },
    {
      id: 'to-3',
      title: 'Live Acoustic Duo vs. Curated Sound System & DJ',
      impactDescription: 'A live acoustic performer elevates the cocktail hour while sound rental covers the dance floor.',
      options: [
        {
          id: 'opt-3a',
          label: 'Curated Playlist + Sound System (Save 10%)',
          costDeltaPercent: -10,
          costDeltaAmount: Math.round(-totalBudget * 0.10),
          description: 'Professional high-definition speakers with guest-contributed Spotify queue.'
        },
        {
          id: 'opt-3b',
          label: 'Live Musician Set (+10%)',
          costDeltaPercent: 10,
          costDeltaAmount: Math.round(totalBudget * 0.10),
          description: 'Live saxophone or acoustic singer performing 90 minutes of guest favorite anthems.'
        }
      ]
    }
  ];
}

/**
 * Generates initial seed guests so the Guests tab is rich and interactive out of the box
 */
function generateSeedGuests(eventType: string): Guest[] {
  if (eventType === 'wedding') {
    return [
      { id: 'g-1', name: 'Aarav & Meera Sharma', group: 'Family', rsvp: 'Yes', dietary: 'Vegetarian', plusOnes: 1 },
      { id: 'g-2', name: 'Kabir Mehta', group: 'Friends', rsvp: 'Yes', dietary: 'None', plusOnes: 1 },
      { id: 'g-3', name: 'Ananya Verma', group: 'Friends', rsvp: 'Maybe', dietary: 'Gluten-Free', plusOnes: 0 },
      { id: 'g-4', name: 'Uncle Rajesh & Family', group: 'VIP', rsvp: 'Yes', dietary: 'Jain / No Onion Garlic', plusOnes: 2 },
      { id: 'g-5', name: 'Rohan Deshmukh', group: 'Colleagues', rsvp: 'Invited', dietary: 'None', plusOnes: 0 },
      { id: 'g-6', name: 'Pooja & Siddharth Sen', group: 'Family', rsvp: 'Yes', dietary: 'Vegan', plusOnes: 1 }
    ];
  }
  return [
    { id: 'g-1', name: 'Alex & Sam Chen', group: 'Friends', rsvp: 'Yes', dietary: 'Vegetarian', plusOnes: 1 },
    { id: 'g-2', name: 'Jordan Taylor', group: 'Friends', rsvp: 'Yes', dietary: 'Nut Allergy', plusOnes: 0 },
    { id: 'g-3', name: 'Priya Patel', group: 'VIP', rsvp: 'Yes', dietary: 'Gluten-Free', plusOnes: 1 },
    { id: 'g-4', name: 'Marcus Brody', group: 'Colleagues', rsvp: 'Maybe', dietary: 'None', plusOnes: 0 },
    { id: 'g-5', name: 'Elena Rostova', group: 'Friends', rsvp: 'Invited', dietary: 'Vegan', plusOnes: 0 }
  ];
}

/**
 * Main Deterministic Plan Generator
 */
export function generateSmartPlan(input: {
  eventType?: string;
  eventName?: string;
  guests?: number;
  budget?: number;
  currency?: string;
  location?: string;
  timing?: string;
  mode?: 'balanced' | 'budgetSaver' | 'luxury' | 'lastMinute';
  freeText?: string;
  vibe?: string;
}): Plan {
  const eventType = input.eventType || 'wedding';
  const currency = input.currency || (eventType === 'wedding' ? 'INR' : 'USD');
  const guests = Math.max(10, input.guests || (eventType === 'wedding' ? 150 : 50));
  const rawBudget = input.budget !== undefined ? input.budget : (currency === 'INR' ? 1200000 : 5000);
  const totalBudget = Math.max(0, rawBudget);
  const mode = input.mode || 'balanced';
  const location = input.location || (currency === 'INR' ? 'Jaipur, Rajasthan' : 'Local Area');
  const timing = input.timing || 'In 3 months';

  const isVolunteersOnly = totalBudget === 0;

  // Allocate pure budget rows
  const budgetRows = allocate(totalBudget, eventType, mode);

  // Reality check
  const perHead = guests > 0 ? Math.round(totalBudget / guests) : 0;
  const isUnrealistic = totalBudget > 0 && ((currency === 'INR' && perHead < 1200 && eventType === 'wedding') || (currency === 'USD' && perHead < 25));

  const realityCheck = {
    isUnrealistic,
    perHead,
    message: isUnrealistic
      ? `At ${formatCurrency(perHead, currency)}/guest, standard commercial banquet catering will exceed this budget.`
      : `Healthy budget pacing at ${formatCurrency(perHead, currency)} per guest.`,
    suggestions: isUnrealistic
      ? [
          'Cap in-person guest list and offer interactive livestream for extended circle.',
          'Shift ceremony to morning with high-tea buffet instead of multi-course evening dinner.',
          'Select open-air civic or garden grounds that permit outside self-catering.'
        ]
      : []
  };

  const whyThisPlan = `Tailored for a ${guests}-guest ${eventType} in ${location} with a ${formatCurrency(totalBudget, currency)} budget (${mode} mode). Pacing incorporates an 8-10% contingency reserve, balanced vendor milestones, and realistic per-head allocations.`;

  const snapshot: Snapshot = {
    eventType,
    eventName: input.eventName || `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Celebration`,
    tagline: `Curated ${mode} blueprint designed for ${guests} guests in ${location}`,
    guests,
    totalBudget,
    currency,
    timingText: timing,
    location,
    vibe: input.vibe || 'Warm, elegant, and joyful',
    mode,
    whyThisPlan,
    realityCheck,
    isVolunteersOnly
  };

  const tradeOffs = generateTradeOffs(eventType, currency, totalBudget);
  const seedGuests = generateSeedGuests(eventType);

  // Vendor Categories with Status and Budget Line Amounts
  const vendorChecklist: VendorCategory[] = [
    {
      category: 'Venue & Banquet',
      status: 'Quoted',
      quoteAmount: Math.round(totalBudget * 0.32),
      budgetLineAmount: budgetRows.find(b => b.category.includes('Venue'))?.amount || Math.round(totalBudget * 0.35),
      items: [
        { id: 'v-1', task: 'Confirm curfew hours for outdoor sound amplification', tag: 'Ask', completed: false },
        { id: 'v-2', task: 'Verify in-house generator backup and bridal green room access', tag: 'Confirm', completed: true },
        { id: 'v-3', task: 'Review cancellation policy and weather backup indoor hall', tag: 'Contract', completed: false }
      ]
    },
    {
      category: 'Catering & Dining',
      status: 'To contact',
      quoteAmount: null,
      budgetLineAmount: budgetRows.find(b => b.category.includes('Catering') || b.category.includes('Food'))?.amount || Math.round(totalBudget * 0.30),
      items: [
        { id: 'v-4', task: 'Request dietary breakdown: vegetarian, vegan, and nut-free guarantees', tag: 'Ask', completed: false },
        { id: 'v-5', task: 'Schedule complimentary pre-event food tasting session', tag: 'Confirm', completed: false },
        { id: 'v-6', task: 'Check commercial hygiene certificates and staff uniform dress code', tag: 'Safety', completed: false }
      ]
    },
    {
      category: 'Photography & Cinema',
      status: 'Booked',
      quoteAmount: Math.round(totalBudget * 0.11),
      budgetLineAmount: budgetRows.find(b => b.category.includes('Photo'))?.amount || Math.round(totalBudget * 0.12),
      items: [
        { id: 'v-7', task: 'Provide shot list of VIP family elders and signature moments', tag: 'Ask', completed: true },
        { id: 'v-8', task: 'Agree on raw footage delivery timeline and teaser reel date', tag: 'Contract', completed: false }
      ]
    },
    {
      category: 'Decor & Production',
      status: 'To contact',
      quoteAmount: null,
      budgetLineAmount: budgetRows.find(b => b.category.includes('Decor'))?.amount || Math.round(totalBudget * 0.10),
      items: [
        { id: 'v-9', task: 'Specify warm fairy lights and brass accents over heavy synthetic foam', tag: 'Ask', completed: false },
        { id: 'v-10', task: 'Verify fire-safety clearance on floral mandap / stage fabric draping', tag: 'Safety', completed: false }
      ]
    }
  ];

  const ideas: Idea[] = [
    { title: 'Interactive Audio Guestbook Phone', desc: 'A vintage rotary telephone where guests pick up the receiver to record heartfelt audio messages.', type: 'activity' },
    { title: 'Signature Grazing & Chai Bar', desc: 'An artisan tea bar with personalized kulhads and fresh regional snacks welcoming guests on arrival.', type: 'menu' },
    { title: 'Polaroid Memory Wall with Brass Clips', desc: 'Guests snap instant portraits, write their blessing, and peg them onto an illuminated botanical trellis.', type: 'favor' },
    { title: 'Lantern Lighting Ceremony', desc: 'The signature evening highlight: warm amber lanterns illuminate together as the main celebration commences.', type: 'wow' }
  ];

  const savingIdeas: SavingIdea[] = [
    { title: 'Digital Handcrafted Invitations', desc: 'Switching print paper invites to bespoke video & digital WhatsApp cards saves ₹15,000–₹25,000 and ensures instant RSVP tracking.' },
    { title: 'Local Seasonal Florals', desc: 'Using marigold, tuberose, and bougainvillea instead of imported hydrangeas cuts floral decor expenses by 45%.' }
  ];

  const risks: Risk[] = [
    { risk: 'Sudden rain or unseasonal wind on outdoor lawn', mitigation: 'Pre-book a venue that provides an adjoining indoor banquet room at no extra charge if weather shifts.' },
    { risk: 'Guest headcount exceeding RSVP estimates by 15-20%', mitigation: 'Instruct catering manager to maintain a 15% floating buffet buffer with 45-minute replenishment.' },
    { risk: 'Sound curfew enforced prematurely by local police', mitigation: 'Schedule high-energy DJ party from 7:00 PM to 10:00 PM, transitioning indoors to low-volume acoustic lounge afterwards.' }
  ];

  const timeline = [
    {
      phase: 'Month 1: Foundation & Bookings',
      isThisWeek: true,
      tasks: [
        { id: 't-1', text: 'Lock venue dates and review deposit refund clauses', completed: false },
        { id: 't-2', text: 'Appoint primary family/friend coordinators for logistics and guest relations', completed: true },
        { id: 't-3', text: 'Send digital save-the-date notifications with location details', completed: false }
      ]
    },
    {
      phase: 'Month 2: Vendors & Tasting',
      isThisWeek: false,
      tasks: [
        { id: 't-4', text: 'Complete catering menu tasting and finalize live counter selections', completed: false },
        { id: 't-5', text: 'Confirm decorator layout and lighting schematics', completed: false },
        { id: 't-6', text: 'Finalize master day-of playlist and photographer shot list', completed: false }
      ]
    },
    {
      phase: 'Final 2 Weeks: Execution & Rehearsal',
      isThisWeek: false,
      tasks: [
        { id: 't-7', text: 'Lock final headcount with catering manager (10% safety cushion)', completed: false },
        { id: 't-8', text: 'Distribute master day-of run sheet to venue manager, coordinator, and key family', completed: false }
      ]
    }
  ];

  const nextSteps = [
    'Lock down venue dates and obtain 2-3 quotes for banquet catering.',
    'Send Save-The-Dates to confirmed guest list to establish headcount.',
    'Schedule initial decor walk-through with lighting checklist.'
  ];

  const inviteText: InviteText = {
    formal: `We warmly invite you to share in the joyful celebration of ${snapshot.eventName}.\n\nDate: ${snapshot.timingText}\nVenue: ${snapshot.location}\n\nPlease RSVP by your earliest convenience to assist with seating arrangements.`,
    casual: `Save the date! We're coming together to celebrate ${snapshot.eventName} and would love to have you with us!\n\nWhere: ${snapshot.location}\nWhen: ${snapshot.timingText}\n\nLet us know if you can make it!`,
    whatsapp: `🎉 *Celebration Alert: ${snapshot.eventName}*\n\nHey everyone! Join us for a memorable gathering on *${snapshot.timingText}* at *${snapshot.location}*.\n\nKindly reply with your RSVP (Yes/No/Maybe) so we can ensure great food and hospitality for all!`
  };

  return {
    snapshot,
    assumptions: [
      `Assumed ${guests} guests based on user input`,
      `Estimated at local venue in ${location}`,
      'Includes 8-10% contingency reserve for supplier adjustments',
      'Based on standard seasonal pricing for selected event class'
    ],
    budget: budgetRows,
    tradeOffs,
    tradeOffDecisions: [],
    timeline,
    vendorChecklist,
    guests: seedGuests,
    ideas,
    savingIdeas,
    risks,
    nextSteps,
    inviteText
  };
}
