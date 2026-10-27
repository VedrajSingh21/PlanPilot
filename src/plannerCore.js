// PlanPilot Core Planner Engine & Deterministic Generator
import { z } from 'zod';

export const PlanSchema = z.object({
  snapshot: z.object({
    eventType: z.string(),
    eventName: z.string(),
    tagline: z.string(),
    guests: z.number(),
    totalBudget: z.number(),
    currency: z.string(),
    timingText: z.string(),
    location: z.string(),
    vibe: z.string(),
    mode: z.string(),
    realityCheck: z.object({
      isUnrealistic: z.boolean(),
      perHead: z.number(),
      message: z.string(),
      suggestions: z.array(z.string())
    }).optional(),
    isVolunteersOnly: z.boolean().optional(),
    culturalNotice: z.string().optional(),
    alcoholNotice: z.string().optional()
  }),
  assumptions: z.array(z.string()),
  budget: z.array(z.object({
    id: z.string(),
    category: z.string(),
    percent: z.number(),
    amount: z.number(),
    tip: z.string()
  })),
  volunteerTracker: z.array(z.object({
    id: z.string(),
    category: z.string(),
    role: z.string(),
    inKindTarget: z.string(),
    volunteersNeeded: z.number(),
    confirmed: z.number()
  })).optional(),
  timeline: z.array(z.object({
    phase: z.string(),
    isThisWeek: z.boolean().optional(),
    tasks: z.array(z.object({
      id: z.string(),
      text: z.string(),
      completed: z.boolean()
    }))
  })),
  vendorChecklist: z.array(z.object({
    category: z.string(),
    items: z.array(z.object({
      id: z.string(),
      task: z.string(),
      tag: z.enum(['Ask', 'Confirm', 'Contract', 'Permit', 'Safety']),
      completed: z.boolean()
    }))
  })),
  ideas: z.array(z.object({
    title: z.string(),
    desc: z.string(),
    type: z.enum(['theme', 'activity', 'favor', 'menu', 'wow'])
  })),
  savingIdeas: z.array(z.object({
    title: z.string(),
    desc: z.string()
  })),
  risks: z.array(z.object({
    risk: z.string(),
    mitigation: z.string()
  })),
  nextSteps: z.array(z.string()),
  inviteText: z.object({
    formal: z.string(),
    casual: z.string(),
    whatsapp: z.string()
  })
});

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$'
};

export function formatCurrency(amount, currency = 'INR') {
  const sym = CURRENCY_SYMBOLS[currency] || (currency === 'INR' ? '₹' : '$');
  const num = Math.round(Number(amount) || 0);
  if (currency === 'INR') {
    return `${sym}${num.toLocaleString('en-IN')}`;
  }
  return `${sym}${num.toLocaleString('en-US')}`;
}

export function parseNaturalInput(query = '') {
  const q = query.trim().toLowerCase();
  
  let eventType = 'birthday';
  let guests = 50;
  let budget = 150000;
  let currency = 'INR';
  let location = 'Local / Metro';
  let vibe = 'Warm, elegant celebration';
  let timing = '1_3_months';
  let mode = 'balanced';
  let isVague = false;
  let isVolunteersOnly = false;

  if (!q || q === 'help me plan something' || q.split(/\s+/).length <= 4) {
    isVague = true;
  }

  // Detect event type
  if (/wedding|shaadi|marriage|reception|bride|groom/i.test(q)) {
    eventType = 'wedding';
    budget = 1200000;
    guests = 150;
  } else if (/community|fundrais|meetup|charity|festival|ngo|diwali/i.test(q)) {
    eventType = 'community';
    budget = 50000;
    guests = 200;
  } else if (/birthday|anniversary|milestone|party/i.test(q)) {
    eventType = 'birthday';
    budget = 150000;
    guests = 50;
  }

  // Detect currency
  if (/\$|usd|dollar/i.test(q)) {
    currency = 'USD';
    budget = 2500;
  } else if (/€|eur|euro/i.test(q)) {
    currency = 'EUR';
    budget = 2500;
  } else if (/£|gbp|pound/i.test(q)) {
    currency = 'GBP';
    budget = 2000;
  } else if (/₹|inr|rupee|lakh|crore/i.test(q)) {
    currency = 'INR';
  }

  // Detect guests
  const guestMatch = q.match(/(\d+)\s*(people|guests|pax|heads|members)/i);
  if (guestMatch) {
    guests = parseInt(guestMatch[1], 10);
  }

  // Detect budget amount
  const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lacs|lac|l)\b/i);
  if (lakhMatch) {
    budget = parseFloat(lakhMatch[1]) * 100000;
    currency = 'INR';
  } else {
    // 1. Explicit currency symbol with digits, e.g. $500, ₹50,000, £2000
    const symbolMatch = q.match(/(?:₹|\$|€|£)\s*(\d+[\d,]*)/);
    // 2. Explicit keyword, e.g. "budget is 1000", "budget 50000"
    const keywordMatch = q.match(/budget\s*(?:is|of|around|:)?\s*(?:₹|\$|€|£)?\s*(\d+[\d,]*)/i);
    // 3. Suffix keyword, e.g. "500 dollars", "50000 inr", "2000 bucks"
    const suffixMatch = q.match(/(\d+[\d,]*)\s*(?:dollars?|bucks?|inr|rupees?|rs)/i);

    const budgetCandidate = symbolMatch || keywordMatch || suffixMatch;
    if (budgetCandidate && budgetCandidate[1]) {
      const parsedNum = parseInt(budgetCandidate[1].replace(/,/g, ''), 10);
      if (parsedNum >= 10 && parsedNum <= 100000000) {
        budget = parsedNum;
      }
    }
  }

  // Check tiny budget / volunteers only
  if (/tiny budget|volunteer|zero budget|no budget|sponsors? only/i.test(q)) {
    isVolunteersOnly = true;
    budget = (currency === 'INR' ? 10000 : 250);
  }

  // Detect city/location
  const cityMatch = q.match(/\b(jaipur|delhi|mumbai|bangalore|bengaluru|pune|goa|chennai|hyderabad|new york|london|paris|toronto|sydney)\b/i);
  if (cityMatch) {
    location = cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1).toLowerCase();
  }

  // Detect timing
  if (/2\s*weeks|two\s*weeks|under\s*3\s*weeks|asap|rush|urgent|next week/i.test(q)) {
    timing = 'under_3_weeks';
    mode = 'lastMinute';
  } else if (/december|winter|autumn/i.test(q)) {
    timing = '1_3_months';
  } else if (/6\s*months|next year/i.test(q)) {
    timing = '6_plus_months';
  }

  // Detect vibe
  if (/diwali/i.test(q)) {
    vibe = 'Festive, illuminating Diwali celebration';
  } else if (/surprise/i.test(q)) {
    vibe = 'Intimate & joyful surprise gathering';
  } else if (/luxury|royal|grand/i.test(q)) {
    mode = 'luxury';
    vibe = 'Regal heritage luxury';
  }

  return {
    eventType,
    guests,
    budget,
    currency,
    location,
    vibe,
    timing,
    mode,
    isVague,
    isVolunteersOnly
  };
}

export function generateSmartPlan({
  eventType = 'wedding',
  guests = 150,
  budget = 1200000,
  currency = 'INR',
  timing = '1_3_months',
  mode = 'balanced',
  location = 'Local / Metro',
  vibe = 'Warm, elegant celebration',
  freeText = '',
  assumptionsOverride = null
}) {
  const isINR = currency === 'INR';
  const perHead = guests > 0 ? Math.round(budget / guests) : 0;

  // Check unrealistic budget
  // Wedding minimum benchmark: INR 2,000/head (~$25/head) or USD $50/head
  let isUnrealistic = false;
  let realityCheck = undefined;

  if (eventType === 'wedding') {
    const minBenchmark = isINR ? 1500 : 40;
    if (perHead < minBenchmark) {
      isUnrealistic = true;
      realityCheck = {
        isUnrealistic: true,
        perHead,
        message: `Reality Check: At ${formatCurrency(perHead, currency)} per guest, traditional full-service wedding venues and catering are not feasible.`,
        suggestions: [
          `Option A: Trim guest list to an intimate ${Math.min(25, Math.max(10, Math.floor(budget / (isINR ? 2500 : 60))))} guests for a fine-dining celebration.`,
          `Option B: Host a daytime cake, punch & tea reception at a scenic municipal botanical garden or civic hall.`,
          `Option C: Host a joyful backyard or family home celebration with community potluck or food truck catering.`
        ]
      };
    }
  } else if (eventType === 'birthday') {
    const minBenchmark = isINR ? 400 : 15;
    if (perHead < minBenchmark) {
      isUnrealistic = true;
      realityCheck = {
        isUnrealistic: true,
        perHead,
        message: `Reality Check: At ${formatCurrency(perHead, currency)} per guest, restaurant private dining is restricted.`,
        suggestions: [
          `Option A: Host an interactive picnic at a public park with curated DIY snack boards.`,
          `Option B: Home party with DIY pizza/taco stations and crowdsourced Spotify audio.`
        ]
      };
    }
  }

  // Check Volunteers-only / Tiny Budget Community Event
  const isVolunteersOnly = (eventType === 'community' && (budget <= (isINR ? 25000 : 400) || /volunteer|tiny budget|sponsors? only/i.test(freeText)));

  // Cultural / Religious Notice
  let culturalNotice = undefined;
  if (/diwali/i.test(freeText + vibe)) {
    culturalNotice = 'Cultural Awareness: Diwali Celebration. Note: Ensure auspicious Muhurat timing for Puja/lighting, eco-friendly clay diyas, strictly vegetarian/eggless festive sweets (Mithai), and compliance with municipal 10:00 PM sound curfews.';
  } else if (/eid/i.test(freeText + vibe)) {
    culturalNotice = 'Cultural Awareness: Eid Gathering. Note: Halal certified culinary catering, dedicated prayer space arrangements, and family-friendly alcohol-free mocktail service.';
  } else if (/wedding/i.test(eventType) && (isINR || /jaipur|delhi|mumbai|indian|hindu/i.test(location + freeText))) {
    culturalNotice = 'Auspicious Dates & Traditions: Confirm favorable calendar dates (Shubh Muhurat) with family elders. Account for multi-event logistics (Mehendi, Sangeet, Pheras) and Jain/Vegetarian dietary segregation.';
  }

  // Alcohol licensing note
  let alcoholNotice = undefined;
  if (/alcohol|cocktail|wine|bar|beer|liquor/i.test(freeText + vibe)) {
    alcoholNotice = 'Alcohol & Safety Regulation: Commercial alcohol service requires a temporary single-day liquor permit / license (e.g., Excise L-50/FL-4) and written venue corkage agreements. Provide designated driver / cab shuttle options for guest safety.';
  }

  // Auto-switch to Last-Minute if timing is under 3 weeks
  if (timing === 'under_3_weeks') {
    mode = 'lastMinute';
  }

  // Construct assumptions
  let assumptions = assumptionsOverride || [
    `Event: ${eventType.toUpperCase()}`,
    `Confirmed Headcount: ${guests} guests`,
    `Budget Ceiling: ${formatCurrency(budget, currency)}`,
    `Horizon: ${timing.replace(/_/g, ' ')}`,
    `Location: ${location}`,
    `Contingency: 8-10% reserve built-in`
  ];

  // Budget Allocation Ratios
  let budgetCategories = [];
  if (eventType === 'wedding') {
    budgetCategories = [
      { id: 'b1', category: 'Venue & Banquet Catering', percent: 46, tip: 'Bundle venue with in-house dining to eliminate third-party kitchen buyout fees.' },
      { id: 'b2', category: 'Photography & Cinematic Video', percent: 11, tip: 'Book 1 lead photographer + 1 traditional shooter instead of a large 5-person crew.' },
      { id: 'b3', category: 'Bridal Styling & Attire', percent: 9, tip: 'Schedule bridal trials together and consider rental jewellery for statement pieces.' },
      { id: 'b4', category: 'Decor, Mandap & Floral Styling', percent: 10, tip: 'Use seasonal, locally sourced blooms and reusable LED fairy/ambient lighting.' },
      { id: 'b5', category: 'Music, Sound & Live DJ', percent: 8, tip: 'Verify venue acoustic sound licensing to avoid external generator or curfew penalties.' },
      { id: 'b6', category: 'Invitations, Favors & Logistics', percent: 6, tip: 'Send animated interactive digital invites and prioritize edible artisanal favors.' },
      { id: 'b7', category: 'Emergency Contingency Reserve', percent: 10, tip: 'Essential safety net for unexpected headcount surges, overtime, and vendor tips.' }
    ];
  } else if (eventType === 'birthday') {
    budgetCategories = [
      { id: 'b1', category: 'Venue & Food/Beverage', percent: 52, tip: 'Choose a rooftop lounge or private dining room that waives rental with F&B minimum.' },
      { id: 'b2', category: 'Decor, Theme & Focal Backdrop', percent: 15, tip: 'Invest in one striking photo wall (neon sign + balloon garland) for Instagram photos.' },
      { id: 'b3', category: 'Entertainment, Games & Music', percent: 15, tip: 'Hire an energetic host/emcee with trivia or curated live acoustic musician.' },
      { id: 'b4', category: 'Custom Cake & Return Favors', percent: 8, tip: 'Order a designer photo-cake backed by kitchen sheet cake slices for serving.' },
      { id: 'b5', category: 'Contingency & Incidentals', percent: 10, tip: 'Covers overtime fees, extra bar tabs, and unexpected guests.' }
    ];
  } else {
    // Community Event
    budgetCategories = [
      { id: 'b1', category: 'Venue & Civic Permits', percent: 22, tip: 'Partner with universities or public parks for subsidized community/NGO rates.' },
      { id: 'b2', category: 'Food & Refreshments', percent: 25, tip: 'Boxed meal packs or tea/snack counters keep queues moving and control per-head cost.' },
      { id: 'b3', category: 'Stage, AV & Sound Rigging', percent: 16, tip: 'Ensure dual cordless mics, monitor speaker, and high-lumen projector for presentations.' },
      { id: 'b4', category: 'Safety, Insurance & Volunteer Care', percent: 15, tip: 'First aid kits, event liability coverage, crowd barricades, and volunteer hospitality.' },
      { id: 'b5', category: 'Marketing & Digital Outreach', percent: 12, tip: 'Directional standees, QR registration badges, and local community WhatsApp outreach.' },
      { id: 'b6', category: 'Contingency & Reserve', percent: 10, tip: 'Mandatory buffer for unexpected municipal compliance, weather gear, and cabling.' }
    ];
  }

  // Adjust for mode
  if (mode === 'budgetSaver') {
    budgetCategories = budgetCategories.map(c => {
      if (c.category.includes('Contingency')) return { ...c, percent: 14 };
      if (c.category.includes('Decor') || c.category.includes('Entertainment')) return { ...c, percent: Math.max(5, c.percent - 2) };
      return c;
    });
  } else if (mode === 'luxury') {
    budgetCategories = budgetCategories.map(c => {
      if (c.category.includes('Decor')) return { ...c, percent: c.percent + 3 };
      if (c.category.includes('Contingency')) return { ...c, percent: 8 };
      return c;
    });
  }

  // Ensure percentages sum to exactly 100%
  const currentSumPct = budgetCategories.reduce((sum, item) => sum + item.percent, 0);
  if (currentSumPct !== 100) {
    const diff = 100 - currentSumPct;
    budgetCategories[budgetCategories.length - 1].percent += diff;
  }

  // Calculate exact currency amounts guaranteeing sum equals budget exactly
  let runningTotal = 0;
  const budgetTable = budgetCategories.map((item, index) => {
    let amount;
    if (index === budgetCategories.length - 1) {
      amount = budget - runningTotal;
    } else {
      amount = Math.round((budget * item.percent) / 100);
      runningTotal += amount;
    }
    return {
      id: item.id,
      category: item.category,
      percent: item.percent,
      amount,
      tip: item.tip
    };
  });

  // Volunteer & In-Kind Tracker (for community/volunteers-only events)
  const volunteerTracker = isVolunteersOnly ? [
    { id: 'v1', category: 'Venue & Logistics', role: 'Auditorium Setup & Chair Placement', inKindTarget: 'Donated hall by community school / temple', volunteersNeeded: 6, confirmed: 4 },
    { id: 'v2', category: 'Refreshments & Snacks', role: 'Sweet Box & Chai Distribution', inKindTarget: 'Donated festive sweets & tea urns by local bakeries', volunteersNeeded: 8, confirmed: 6 },
    { id: 'v3', category: 'Ceremony & Cultural Decor', role: 'Rangoli, Diya Placement & Lighting', inKindTarget: 'Donated clay diyas, floral petals & fairy lights', volunteersNeeded: 5, confirmed: 5 },
    { id: 'v4', category: 'Safety & Registration', role: 'Entry Welcome, QR Check-in & First-Aid', inKindTarget: 'Medical kits & crowd barriers from youth club', volunteersNeeded: 4, confirmed: 3 }
  ] : undefined;

  // Timeline backward-planned
  let timeline = [];
  if (timing === 'under_3_weeks' || mode === 'lastMinute') {
    timeline = [
      {
        phase: 'Sprint Phase 1: Days 1–3 (Immediate Vendor Locks)',
        isThisWeek: true,
        tasks: [
          { id: 't1', text: 'Lock venue in writing with deposit and verify kitchen/sound curfew hours.', completed: false },
          { id: 't2', text: 'Send digital WhatsApp invitations with a strict 48-hour RSVP confirmation cutoff.', completed: false },
          { id: 't3', text: 'Secure lead caterer with vegetarian/dietary headcount cushion.', completed: false },
          { id: 't4', text: 'Order custom cake and essential photo backdrop rental.', completed: false }
        ]
      },
      {
        phase: 'Sprint Phase 2: Days 4–8 (Assembly & AV)',
        isThisWeek: false,
        tasks: [
          { id: 't5', text: 'Confirm final headcount with caterer and lock price per plate.', completed: false },
          { id: 't6', text: 'Download music playlist onto offline phone + USB drive.', completed: false },
          { id: 't7', text: 'Print directional signage and welcome table signs.', completed: false }
        ]
      },
      {
        phase: 'Sprint Phase 3: 48 Hours to Day-Of',
        isThisWeek: false,
        tasks: [
          { id: 't8', text: 'Assemble emergency kit (chargers, first aid, pins, gaffer tape, cash).', completed: false },
          { id: 't9', text: 'Venue load-in 2 hours prior; soundcheck mic levels & welcome guests!', completed: false }
        ]
      }
    ];
  } else {
    timeline = [
      {
        phase: 'Phase 1: 4–6+ Months Out (Foundations & Vision)',
        isThisWeek: false,
        tasks: [
          { id: 't1', text: 'Lock overall budget ceiling and target guest count using PlanPilot formula.', completed: true },
          { id: 't2', text: 'Tour 3 shortlisted venues; inspect restrooms, acoustics, and air conditioning.', completed: false },
          { id: 't3', text: 'Sign venue contract with force-majeure and cancellation terms.', completed: false },
          { id: 't4', text: 'Send Save-the-Date announcements to out-of-town guests.', completed: false }
        ]
      },
      {
        phase: 'Phase 2: 2–3 Months Out (Core Vendor Contracts)',
        isThisWeek: true,
        tasks: [
          { id: 't5', text: 'Obtain 2–3 written quotes for catering, photography, and music/DJ.', completed: false },
          { id: 't6', text: 'Conduct tasting session; verify dietary & allergy protocols.', completed: false },
          { id: 't7', text: 'Finalize decor mood board and stage dimensions with decorator.', completed: false },
          { id: 't8', text: 'Purchase or tailor formal event attire and bridal wear.', completed: false }
        ]
      },
      {
        phase: 'Phase 3: 1 Month Out (Invitations & Details)',
        isThisWeek: false,
        tasks: [
          { id: 't9', text: 'Dispatch formal invitations with clear 2-week RSVP deadline.', completed: false },
          { id: 't10', text: 'Confirm civic sound/loudspeaker permits if applicable.', completed: false },
          { id: 't11', text: 'Order custom cake, artisanal return favors, and printed signage.', completed: false }
        ]
      },
      {
        phase: 'Phase 4: 1 Week Out (Headcount Lockdown)',
        isThisWeek: false,
        tasks: [
          { id: 't12', text: 'Submit final guaranteed plate count to caterer with a 5% buffer.', completed: false },
          { id: 't13', text: 'Distribute minute-by-minute run sheet to all vendors and co-hosts.', completed: false },
          { id: 't14', text: 'Prepare vendor balance payment envelopes or scheduled transfers.', completed: false }
        ]
      },
      {
        phase: 'Phase 5: Day-Of Choreography',
        isThisWeek: false,
        tasks: [
          { id: 't15', text: 'Morning: Venue handover, decor supervision & floral hydration check.', completed: false },
          { id: 't16', text: 'T-minus 2 hours: AV soundcheck, mic frequency check & ambient lighting.', completed: false },
          { id: 't17', text: 'Showtime: Execute run sheet and enjoy a stress-free celebration!', completed: false }
        ]
      }
    ];
  }

  // Vendor Checklist with tags
  const vendorChecklist = [
    {
      category: 'Venue & Facilities',
      items: [
        { id: 'vc1', task: 'Confirm load-in setup and midnight teardown hours included in rental quote.', tag: 'Ask', completed: false },
        { id: 'vc2', task: 'Verify backup electrical generator availability for uninterrupted lighting and sound.', tag: 'Confirm', completed: false },
        { id: 'vc3', task: 'Lock in writing: cancellation schedule, weather backup room, and security deposit refund.', tag: 'Contract', completed: false }
      ]
    },
    {
      category: 'Catering & Hospitality',
      items: [
        { id: 'vc4', task: 'Request itemized per-plate quote including service waitstaff, chaffing dishes, and cutlery.', tag: 'Ask', completed: false },
        { id: 'vc5', task: 'Confirm vegetarian, vegan, and severe allergy segregation protocols.', tag: 'Confirm', completed: false },
        { id: 'vc6', task: 'Lock in writing: minimum guaranteed guest count deadline and leftover food packaging policy.', tag: 'Contract', completed: false }
      ]
    },
    {
      category: 'Decor & Ambiance',
      items: [
        { id: 'vc7', task: 'Review photos of real past setups in the exact venue hall.', tag: 'Ask', completed: false },
        { id: 'vc8', task: 'Confirm whether fresh florals or hybrid silk installations are used.', tag: 'Confirm', completed: false },
        { id: 'vc9', task: 'Verify teardown responsibility: Does the quote cover post-event midnight removal?', tag: 'Contract', completed: false }
      ]
    },
    {
      category: 'Photography & Media',
      items: [
        { id: 'vc10', task: 'Confirm lead artist presence rather than junior associate shooters.', tag: 'Ask', completed: false },
        { id: 'vc11', task: 'Contractually specify delivery timeline: teaser (48h), gallery (3 weeks), album (6 weeks).', tag: 'Contract', completed: false }
      ]
    },
    {
      category: 'Sound, DJ & Civic Compliance',
      items: [
        { id: 'vc12', task: 'Share "Must-Play" and "Do-Not-Play" playlist instructions 7 days in advance.', tag: 'Ask', completed: false },
        { id: 'vc13', task: 'Ensure local 10:00 PM sound curfew compliance and acquire police loudspeaker clearance.', tag: 'Permit', completed: false },
        { id: 'vc14', task: 'Confirm backup laptop and secondary audio amplifier on site.', tag: 'Safety', completed: false }
      ]
    }
  ];

  // Ideas & Wow Moment
  let ideas = [];
  let savingIdeas = [];

  if (eventType === 'wedding') {
    ideas = [
      { title: 'Interactive Audio Guestbook', desc: 'A vintage rotary phone where guests pick up the receiver to record heartfelt audio messages.', type: 'activity' },
      { title: 'Signature Couple Cocktails/Mocktails', desc: 'Two custom drinks named after shared travel memories or first date spot, served with monogrammed garnishes.', type: 'menu' },
      { title: 'Acoustic Golden-Hour Transition', desc: 'Live acoustic flute or violin melodies during the sunset transition into the banquet reception.', type: 'activity' },
      { title: 'Live Jalebi & Rabri Rolling Station', desc: 'Fresh hot jalebis prepared live in front of guests paired with chilled saffron rabri.', type: 'menu' },
      { title: 'Botanical Seed-Paper Favors', desc: 'Eco-friendly plantable wildflower seed paper tags paired with artisanal raw honey jars.', type: 'favor' },
      { title: 'The "Wow" Moment: Cold-Spark & Low Fog Grand Entrance', desc: 'Synchronized indoor-safe cold spark fountains and low-lying dry ice fog as the couple makes their entrance.', type: 'wow' }
    ];
    savingIdeas = [
      { title: 'Afternoon / Brunch Reception', desc: 'Hosting between 11 AM – 3 PM cuts venue hire by 25–35% and substantially lowers catering costs.' },
      { title: 'Warm Uplighting over Floral Density', desc: 'Warm amber LED uplighting transforms room ambiance for a fraction of the cost of heavy exotic floral arches.' }
    ];
  } else if (eventType === 'community') {
    ideas = [
      { title: 'Community Impact & Wishes Mural', desc: 'A collaborative painted canvas where every participant adds a brushstroke or written message of hope.', type: 'activity' },
      { title: 'Local Artisan & Home-Chef Alley', desc: 'Partner with neighborhood home-bakers and craftspersons to host pop-up stalls on revenue share.', type: 'menu' },
      { title: 'Digital Fast QR Check-In with Seed Badges', desc: 'Instant smartphone QR scanning at the desk with compostable recycled badges.', type: 'activity' },
      { title: 'Eco-Hydration Refill Station', desc: 'Branded water refill urns encouraging reusable bottles, saving hundreds of plastic cups.', type: 'favor' },
      { title: 'Community Percussion & Drum Circle', desc: 'An energetic 20-minute synchronized percussion circle bringing all attendees together in unity.', type: 'wow' }
    ];
    savingIdeas = [
      { title: 'In-Kind Bakery & Beverage Sponsorships', desc: 'Local shops frequently donate tea, coffee, and cookies in return for banner placement and social shoutouts.' },
      { title: 'University or Municipal Hall Partnerships', desc: 'Educational institutions and civic centers offer heavy non-profit discounts or waived rental fees.' }
    ];
  } else {
    // Birthday
    ideas = [
      { title: 'Milestone Photo Clothesline Gallery', desc: 'Suspend candid childhood and memorable travel photos along fairy lights across the welcome walkway.', type: 'theme' },
      { title: 'Smartphone Trivia Roast & Kahoot', desc: 'A 15-minute interactive quiz with playful questions about the birthday person, with novelty gag prizes.', type: 'activity' },
      { title: 'Instant Polaroid Memory Guestbook', desc: 'Guests snap instant candid photos, paste them into a leather album, and write warm birthday notes.', type: 'activity' },
      { title: 'Late-Night Gourmet Slider & Chaat Boxes', desc: 'Warm comfort snacks served in customized kraft boxes as late-night fuel before departure.', type: 'menu' },
      { title: 'Customized Mini Herb Pots or Treats', desc: 'Personalized mini succulent pots or gourmet cookies with custom milestone branding.', type: 'favor' },
      { title: 'The "Wow" Moment: Surprise Worldwide Video Tribute', desc: 'A high-definition 3-minute video reel from friends and family across the globe projected before cake cutting.', type: 'wow' }
    ];
    savingIdeas = [
      { title: 'Interactive DIY Food Bar', desc: 'Build-your-own taco, chaat, or pasta stations slash catering labor while delighting guests.' },
      { title: 'Rentable Neon Sign with DIY Balloon Garland', desc: 'Rent an LED statement neon sign for $20 and build a high-impact balloon arch with a $15 kit.' }
    ];
  }

  // Top 3 Risks & Mitigations
  const risks = [
    {
      risk: 'Unpredictable Weather (Sudden Rain, Heat, or High Wind)',
      mitigation: 'Never book an open lawn without a contracted indoor standby room or waterproof German pagoda marquee on 48-hour standby.'
    },
    {
      risk: 'RSVP Headcount Surges or No-Shows (15–20% Swing)',
      mitigation: 'Implement a 3-touch RSVP cadence (invite, 10-day WhatsApp reminder, 4-day dietary check). Guarantee only 85-90% to the caterer with a 5% extra plate buffer.'
    },
    {
      risk: 'Key Vendor Delay or Equipment Failure (Audio / Photo)',
      mitigation: 'Require duplicate sound amplifiers and spare camera bodies in vendor contracts. Designate one co-host to manage vendor arrivals.'
    }
  ];

  // Next 3 Steps
  const nextSteps = timing === 'under_3_weeks' || mode === 'lastMinute' ? [
    '1. Lock venue and banquet catering contract today with clear setup access hours.',
    '2. Send digital invitations via WhatsApp/SMS with an urgent 48-hour RSVP confirmation deadline.',
    '3. Book anchor entertainment (DJ or photographer) and order the custom milestone cake.'
  ] : [
    `1. Finalize your firm budget ceiling of ${formatCurrency(budget, currency)} and confirm core planning stakeholders.`,
    '2. Shortlist 3 venues matching your headcount and request itemized written quotes including taxes and overtime.',
    '3. Curate a shared visual mood board for theme alignment and select your Save-the-Date format.'
  ];

  // Invitation text drafts
  const inviteText = {
    formal: `Together with their families,\nyou are cordially invited to celebrate the occasion of\n[Name / Couple]\n\nDate: [Insert Date] | Time: [Insert Time]\nVenue: [Insert Venue Name, ${location}]\n\nRSVP by [Date] to [Contact/Phone]\nDress Code: Festive Elegant`,
    casual: `We're celebrating! 🎉\nJoin us for [Name / Occasion]—an evening of delicious food, great drinks, and wonderful memories.\n\nWhen: [Date] at [Time]\nWhere: [Venue Name, ${location}]\n\nRSVP to [Phone/Email] so we can save you a plate!`,
    whatsapp: `✨ Celebration Alert! ✨\nYou're invited to celebrate with us!\n\n📅 Date: [Date] at [Time]\n📍 Venue: [Venue, ${location}]\n\nDrop in for great food, music, and celebration. Let us know if you can make it: [RSVP Link/Phone]`
  };

  const plan = {
    snapshot: {
      eventType,
      eventName: eventType === 'wedding' ? 'Wedding & Reception' : (eventType === 'birthday' ? 'Birthday / Milestone Celebration' : 'Community Gathering & Fundraiser'),
      tagline: 'Warm, organized, and beautifully coordinated celebration',
      guests,
      totalBudget: budget,
      currency,
      timingText: timing === 'under_3_weeks' ? 'Under 3 Weeks (Sprint Mode)' : (timing === '1_3_months' ? '1–3 Months' : (timing === '3_6_months' ? '3–6 Months' : '6+ Months')),
      location,
      vibe,
      mode,
      realityCheck,
      isVolunteersOnly,
      culturalNotice,
      alcoholNotice
    },
    assumptions,
    budget: budgetTable,
    volunteerTracker,
    timeline,
    vendorChecklist,
    ideas,
    savingIdeas,
    risks,
    nextSteps,
    inviteText
  };

  return plan;
}
