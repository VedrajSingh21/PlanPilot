// PlanPilot Core Planning & Calculation Engine

export const EVENT_TYPES = {
  wedding: {
    id: 'wedding',
    name: 'Wedding & Reception',
    icon: '💍',
    tagline: 'Timeless, romantic, and beautifully choreographed celebration',
    defaultBudgetINR: 600000,
    defaultGuests: 150,
    allocation: {
      balanced: [
        { key: 'venue_catering', name: 'Venue & Catering', pct: 48, tip: 'Combine venue and in-house catering to eliminate outside corkage or kitchen buyout fees.' },
        { key: 'photo_video', name: 'Photography & Cinema', pct: 11, tip: 'Book 1 lead photographer + 1 traditional shooter instead of a large 5-person crew.' },
        { key: 'attire_beauty', name: 'Attire & Bridal Styling', pct: 9, tip: 'Schedule bridal trials together and consider rental jewellery for statement pieces.' },
        { key: 'decor_florals', name: 'Decor, Mandap & Florals', pct: 9, tip: 'Use seasonal, locally sourced blooms and reusable LED fairy/ambient lighting.' },
        { key: 'music_entertainment', name: 'Music, Sound & DJ', pct: 7, tip: 'Ask if the venue has built-in acoustic compliance to save on separate sound rigging.' },
        { key: 'stationery_logistics', name: 'Stationery, Invites & Favors', pct: 6, tip: 'Send animated interactive digital invites and prioritize edible artisanal favors.' },
        { key: 'contingency', name: 'Contingency & Buffer', pct: 10, tip: 'Essential safety net for unexpected headcount surges, overtime, and vendor tips.' }
      ],
      budgetSaver: [
        { key: 'venue_catering', name: 'Venue & Catering', pct: 45, tip: 'Opt for an afternoon tea or brunch reception; lunch packages are 25-35% cheaper.' },
        { key: 'photo_video', name: 'Photography & Cinema', pct: 10, tip: 'Hire for 6 core hours covering ceremony and highlights rather than 12-hour continuous.' },
        { key: 'attire_beauty', name: 'Attire & Styling', pct: 8, tip: 'Buy off-the-rack designer sample sales or opt for bespoke local artisans.' },
        { key: 'decor_florals', name: 'Decor & Florals (DIY Blend)', pct: 8, tip: 'Focus decor budget entirely on the photo backdrop and stage; use candle clusters on tables.' },
        { key: 'music_entertainment', name: 'Music & Sound', pct: 5, tip: 'Rent a premium sound system with a curated collaborative Spotify playlist & emcee friend.' },
        { key: 'stationery_logistics', name: 'Stationery & Favors', pct: 4, tip: '100% digital RSVP tracking; give seed-paper favor tags guests can plant.' },
        { key: 'contingency', name: 'Contingency Buffer', pct: 20, tip: 'Higher buffer keeps your overall spend locked down and stress-free.' }
      ],
      luxury: [
        { key: 'venue_catering', name: 'Heritage Venue & Gourmet Dining', pct: 46, tip: 'Curate bespoke live gourmet counters with signature chef pairings.' },
        { key: 'photo_video', name: 'Fine-Art Cinema & Drone Coverage', pct: 13, tip: 'Drone videography, same-day highlight reel, and heirloom leather photo albums.' },
        { key: 'attire_beauty', name: 'Couture Attire & Editorial Styling', pct: 10, tip: 'Custom couture garments, on-site touchup artist, and personalized vanity lounge.' },
        { key: 'decor_florals', name: 'Bespoke Floral Installations & Lighting', pct: 12, tip: 'Ceiling floral canopies, architectural uplighting, and custom stage design.' },
        { key: 'music_entertainment', name: 'Live Symphony/Band & Headline DJ', pct: 8, tip: 'Live instrumentalists for guest welcome, followed by high-energy DJ set.' },
        { key: 'stationery_logistics', name: 'Luxury Box Invites & Curated Hampers', pct: 5, tip: 'Embossed wax-sealed stationery and custom fragrance or brass keepsake favors.' },
        { key: 'contingency', name: 'Contingency & Concierge Reserve', pct: 6, tip: 'Discretionary fund for valet surges, luxury hospitality, and extended permits.' }
      ]
    }
  },
  birthday: {
    id: 'birthday',
    name: 'Birthday / Milestone Party',
    icon: '🎂',
    tagline: 'Vibrant, memorable celebration honoring age, milestone, or personality',
    defaultBudgetINR: 200000,
    defaultGuests: 50,
    allocation: {
      balanced: [
        { key: 'venue_catering', name: 'Venue & Food/Beverage', pct: 52, tip: 'Choose a rooftop lounge or private dining room that waives rental with F&B minimum.' },
        { key: 'decor_theme', name: 'Decor, Theme & Backdrop', pct: 15, tip: 'Invest in one striking focal photo wall (neon sign + balloon garland) for Instagram photos.' },
        { key: 'entertainment_activities', name: 'Entertainment & Games/DJ', pct: 15, tip: 'Hire an energetic host/emcee with trivia or curated live musician.' },
        { key: 'cake_favors', name: 'Custom Cake & Return Favors', pct: 8, tip: 'Get a signature designer tier cake paired with sheet cake slices in the kitchen for serving.' },
        { key: 'contingency', name: 'Contingency Fund', pct: 10, tip: 'Covers overtime fees, extra bar tabs, and unexpected guests.' }
      ],
      budgetSaver: [
        { key: 'venue_catering', name: 'Venue & Food/Beverage', pct: 50, tip: 'Host at a club house or residential lawn; hire a trusted local live chaat/taco caterer.' },
        { key: 'decor_theme', name: 'Decor & Theme (DIY)', pct: 12, tip: 'DIY balloon arch kits and ambient fairy lights create massive impact under ₹3,000.' },
        { key: 'entertainment_activities', name: 'Entertainment & Audio', pct: 10, tip: 'Crowdsourced party playlist on a rented portable JBL PartyBox speaker with party games.' },
        { key: 'cake_favors', name: 'Cake & Favors', pct: 8, tip: 'Single tier photo-worthy cake + customized gourmet brownies or cookie boxes.' },
        { key: 'contingency', name: 'Contingency Buffer', pct: 20, tip: 'Protects total savings by preventing unexpected expense leakage.' }
      ],
      luxury: [
        { key: 'venue_catering', name: 'Exclusive Venue & Mixology Bar', pct: 50, tip: 'Private club terrace with bespoke mixologist crafting customized cocktails.' },
        { key: 'decor_theme', name: 'Immersive Theme Styling & Glow Decor', pct: 18, tip: '3D acrylic installations, personalized neon art, and custom floral centerpieces.' },
        { key: 'entertainment_activities', name: 'Live Band / Celebrity DJ & Photo Booth', pct: 16, tip: 'Interactive 360-degree video booth and live saxophonist or headline DJ.' },
        { key: 'cake_favors', name: 'Showstopper Cake & Luxury Gifts', pct: 8, tip: 'Sculpted confectionery masterpiece and premium personalized fragrance or leather gifts.' },
        { key: 'contingency', name: 'Contingency Fund', pct: 8, tip: 'Buffer for late-night bar extensions and luxury transport service.' }
      ]
    }
  },
  community: {
    id: 'community',
    name: 'Community, Fundraiser or Meetup',
    icon: '🤝',
    tagline: 'High-impact gathering focused on purpose, connection, and community',
    defaultBudgetINR: 350000,
    defaultGuests: 150,
    allocation: {
      balanced: [
        { key: 'venue_permits', name: 'Venue & Civic Permits', pct: 22, tip: 'Partner with universities, municipal auditoriums, or public parks for discounted non-profit rates.' },
        { key: 'food_refreshments', name: 'Food & Refreshments', pct: 25, tip: 'Boxed meals or buffet finger foods keep lines moving fast and control per-head portions.' },
        { key: 'equipment_av', name: 'Stage, AV & Sound Rigging', pct: 16, tip: 'Ensure dual cordless mics, monitor speaker, and high-lumen projector for presentations.' },
        { key: 'safety_volunteers', name: 'Safety, Volunteers & Insurance', pct: 15, tip: 'First aid kits, event liability coverage, crowd barricades, and volunteer hospitality.' },
        { key: 'marketing_outreach', name: 'Outreach & Signage', pct: 12, tip: 'Directional standees, QR code registration badges, and hyper-local social media boosting.' },
        { key: 'contingency', name: 'Contingency & Reserve', pct: 10, tip: 'Mandatory buffer for unexpected municipal compliance, weather gear, and cabling.' }
      ],
      budgetSaver: [
        { key: 'venue_permits', name: 'Venue & Permits', pct: 20, tip: 'Seek a community sponsor to donate auditorium space in exchange for title branding.' },
        { key: 'food_refreshments', name: 'Refreshments & Tea/Water', pct: 22, tip: 'High-tea format with coffee/tea and artisanal baked snacks instead of full lunch.' },
        { key: 'equipment_av', name: 'AV & Sound Equipment', pct: 15, tip: 'Rent basic PA system with built-in Bluetooth audio and bring your own presentation laptops.' },
        { key: 'safety_volunteers', name: 'Safety & Volunteer Support', pct: 15, tip: 'Enlist local first-aid certified volunteers and provide branded pin badges.' },
        { key: 'marketing_outreach', name: 'Digital Outreach & PR', pct: 10, tip: 'Use free community WhatsApp groups, alumni networks, and organic LinkedIn/Instagram.' },
        { key: 'contingency', name: 'Contingency Buffer', pct: 18, tip: 'Guarantees the non-profit or meetup does not operate at a deficit.' }
      ],
      luxury: [
        { key: 'venue_permits', name: 'Grand Ballroom / Amphitheater', pct: 25, tip: 'Premium hotel ballroom or modern amphitheater with climate control and security staff.' },
        { key: 'food_refreshments', name: 'Gourmet Gala Dinner & Drinks', pct: 28, tip: 'Multi-course seated dinner or premium international buffet with sommelier stations.' },
        { key: 'equipment_av', name: 'Concert-Grade Sound & LED Wall', pct: 18, tip: 'Full P3 LED video wall for immersive sponsor presentations and pristine line-array sound.' },
        { key: 'marketing_outreach', name: 'VIP Welcome Kits & Press PR', pct: 11, tip: 'Embossed lanyards, delegate welcome gifts, and dedicated event photography.' },
        { key: 'safety_volunteers', name: 'Professional Security & EMTs', pct: 10, tip: 'Licensed on-site paramedics, private security guards, and event liability underwriting.' },
        { key: 'contingency', name: 'Contingency Fund', pct: 8, tip: 'Quick-access cash reserve for keynote speaker logistics or emergency changes.' }
      ]
    }
  }
};

export const QUICK_CODES = {
  1: { A: 'wedding', B: 'birthday', C: 'community' },
  2: { A: 25, B: 60, C: 150, D: 300 },
  3: { A: 80000, B: 200000, C: 500000, D: 1200000 },
  4: { A: 'under_3_weeks', B: '1_3_months', C: '3_6_months', D: '6_plus_months' }
};

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$'
};

export function formatCurrency(amount, currency = 'INR') {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  const num = Math.round(Number(amount) || 0);

  if (currency === 'INR') {
    // Format in Indian numbering system
    return `${symbol}${num.toLocaleString('en-IN')}`;
  }
  return `${symbol}${num.toLocaleString('en-US')}`;
}

export function parseQuickCode(inputString) {
  if (!inputString) return null;
  const cleaned = inputString.toUpperCase().replace(/[^1-4A-D]/g, ' ');
  const tokens = cleaned.split(/\s+/).filter(Boolean);

  let result = {};
  tokens.forEach(tok => {
    if (tok.length === 2) {
      const q = tok[0];
      const opt = tok[1];
      if (QUICK_CODES[q] && QUICK_CODES[q][opt]) {
        result[q] = opt;
      }
    }
  });

  if (Object.keys(result).length >= 2) {
    return {
      eventType: QUICK_CODES[1][result['1']] || 'birthday',
      guests: QUICK_CODES[2][result['2']] || 50,
      budget: QUICK_CODES[3][result['3']] || 200000,
      timing: QUICK_CODES[4][result['4']] || '1_3_months',
      rawCode: Object.entries(result).map(([k, v]) => `${k}${v}`).join(' ')
    };
  }
  return null;
}

export function calculateBudgetTable(totalBudget, eventTypeKey, modeKey = 'balanced') {
  const eventConfig = EVENT_TYPES[eventTypeKey] || EVENT_TYPES.birthday;
  let allocationRules = eventConfig.allocation[modeKey] || eventConfig.allocation.balanced;

  // Verify percentages add up to 100%
  let totalPct = allocationRules.reduce((sum, item) => sum + item.pct, 0);

  // If not exactly 100%, adjust the contingency line
  if (totalPct !== 100) {
    const diff = 100 - totalPct;
    allocationRules = allocationRules.map(item => {
      if (item.key === 'contingency') {
        return { ...item, pct: item.pct + diff };
      }
      return item;
    });
  }

  // Calculate exact currency values ensuring total equals exactly totalBudget
  let runningTotal = 0;
  const rows = allocationRules.map((item, index) => {
    let amount;
    if (index === allocationRules.length - 1) {
      // Last item absorbs any rounding difference to ensure exact budget match
      amount = totalBudget - runningTotal;
    } else {
      amount = Math.round((totalBudget * item.pct) / 100);
      runningTotal += amount;
    }
    return {
      ...item,
      amount
    };
  });

  return {
    rows,
    totalBudget,
    totalPct: 100,
    contingencyRow: rows.find(r => r.key.includes('contingency'))
  };
}

export function generateTimeline(eventType, timing, eventDate = null) {
  // If last-minute or under 3 weeks
  if (timing === 'under_3_weeks') {
    return [
      {
        phase: 'Sprint Phase 1 (Days 1–3: Immediate Locks)',
        items: [
          'Lock venue with verified kitchen/sound availability and pay booking deposit in writing.',
          'Issue digital RSVPs with a strict 48-hour confirmation cutoff.',
          'Hire key anchor vendor (caterer or core entertainer) and lock cancellation terms.',
          'Order cake and emergency rental decor items (lighting, backdrop).'
        ]
      },
      {
        phase: 'Sprint Phase 2 (Days 4–7: Assembly & RSVPs)',
        items: [
          'Tally confirmed headcounts and submit exact dietary requirements to caterer.',
          'Compile music playlist / AV cue sheet onto an offline USB flash drive + phone.',
          'Design and print directional signage / table welcome cards on local rush print.',
          'Confirm delivery arrival windows with all 2–3 engaged vendors.'
        ]
      },
      {
        phase: 'Sprint Phase 3 (24–48 Hours Prior)',
        items: [
          'Pack "Day-Of Emergency Kit" (chargers, first aid, safety pins, gaffer tape, cash).',
          'Touch base with venue manager regarding load-in access time and power outlets.',
          'Verify weather forecast and verify rain backup / indoor contingency readiness.'
        ]
      },
      {
        phase: 'Day-Of Event: Execution',
        items: [
          'Arrive at venue 2.5 hours prior for soundcheck and lighting ambiance.',
          'Greet catering lead and confirm buffet setup and water station positioning.',
          'Place welcome signs, guestbook, and table decor before early arrivals.',
          'Designate one trusted co-host to handle vendor arrival phone calls while you host.'
        ]
      }
    ];
  }

  if (timing === '1_3_months') {
    return [
      {
        phase: 'Month 1 (6–8 Weeks Out: Strategy & Venue)',
        items: [
          'Tour top 2–3 venues, compare written quotes, and sign contract with cancellation clause.',
          'Draft master guest list and broadcast "Save The Date" digital announcements.',
          'Define the central vibe/theme and create a visual mood board for decor alignment.',
          'Obtain 2–3 quotes for catering and key entertainment (DJ / photographer).'
        ]
      },
      {
        phase: 'Month 2 (3–4 Weeks Out: Vendor Commitments)',
        items: [
          'Conduct food tasting and lock finalized menu with clear vegetarian/allergen options.',
          'Book photographer and sound/DJ; confirm insurance requirements and equipment power.',
          'Order customized cake, party favors, and branded or personalized decor elements.',
          'Send formal invitations with a clear RSVP deadline 2 weeks before the event.'
        ]
      },
      {
        phase: '2 Weeks Out: Logistics & Numbers',
        items: [
          'Close RSVP list; contact pending guests for final headcount confirmation.',
          'Provide final numbers to venue & caterer (contractually lock price per head).',
          'Create detailed minute-by-minute run sheet and share with family or co-hosts.',
          'Prepare vendor payment envelopes or bank schedules for agreed balances.'
        ]
      },
      {
        phase: 'Event Week & Day-Of',
        items: [
          '72 Hours: Final vendor confirmation calls confirming exact load-in time & parking.',
          '24 Hours: Pack event supply box (decor, extra cables, emergency kit, guestbook).',
          'Day-Of: 2 hours prior load-in, test microphones & sound levels, light candles, celebrate!'
        ]
      }
    ];
  }

  // 3-6 months or 6+ months (Standard Full backward planning)
  return [
    {
      phase: 'Phase 1: Foundations & Venue Lock (4–6+ Months Out)',
      items: [
        'Establish firm budget cap, guest count range, and prioritized wish-list.',
        'Tour venues; review sound curfew, external catering policies, and parking capacity.',
        'Sign venue contract with clear force-majeure and written refund schedules.',
        'Send Save-The-Dates to out-of-town guests.'
      ]
    },
    {
      phase: 'Phase 2: Core Vendor Booking (2–3 Months Out)',
      items: [
        'Secure high-priority unique vendors: Photographer/Videographer, Caterer, and DJ/Band.',
        'Always obtain 2–3 written quotes before locking deposits.',
        'Finalize decor concepts, floral specifications, and stage backdrop dimensions.',
        'Source event attire, bridal or milestone garments, and schedule alterations.'
      ]
    },
    {
      phase: 'Phase 3: Invitations & Logistics (4–6 Weeks Out)',
      items: [
        'Dispatch formal digital or print invitations with RSVP tracking and meal selection.',
        'Select custom cake designer; sample flavors and specify delivery time.',
        'Confirm municipal permits if applicable (sound clearance, public park permissions).',
        'Purchase guest favors, keepsake books, and personalized styling accents.'
      ]
    },
    {
      phase: 'Phase 4: Final Sprint (1–2 Weeks Out)',
      items: [
        'Submit guaranteed guest count and dietary matrix to catering team.',
        'Draft and distribute master run sheet with vendor contact sheet to key stakeholders.',
        'Conduct final outfit fittings and test event day shoe comfort.',
        'Confirm scheduled arrival time and vehicle parking permits for all vendors.'
      ]
    },
    {
      phase: 'Phase 5: Day-Of Choreography',
      items: [
        'Morning: Venue handover, decor setup supervision, and floral water replenishment.',
        'Midday: AV and sound engineering check, test mic frequencies and background playlist.',
        'Pre-Event (T-minus 60 mins): Food prep check, ambient lighting check, team huddle.',
        'Showtime: Welcome guests, follow run sheet, and let PlanPilot contingency handle surprises.'
      ]
    }
  ];
}

export function generateVendorChecklist(eventType) {
  const base = [
    {
      category: 'Venue & Facilities',
      items: [
        { task: 'Confirm total rental hours (including setup and teardown load-out window)', tag: 'Ask' },
        { task: 'Check noise curfew rules and maximum permissible decibel levels', tag: 'Confirm' },
        { task: 'Verify in writing: air conditioning capacity, dedicated power backup/generator, clean restrooms', tag: 'Contract' },
        { task: 'Ensure written cancellation policy, deposit schedule, and weather backup room', tag: 'Contract' }
      ]
    },
    {
      category: 'Catering & Hospitality',
      items: [
        { task: 'Request sample tasting menu and get itemized per-plate quote including service staff & tableware', tag: 'Ask' },
        { task: 'Confirm vegetarian, vegan, and strict allergy protocols (nut, gluten, dairy)', tag: 'Confirm' },
        { task: 'Ensure beverage policy (outside alcohol corkage fee, ice supply, glassware count)', tag: 'Confirm' },
        { task: 'Lock in writing: minimum guaranteed headcount deadline and extra plate cushion (usually 5%)', tag: 'Contract' }
      ]
    },
    {
      category: 'Decor & Floral Styling',
      items: [
        { task: 'Ask for photos of real past setups in your exact venue room or similar layout', tag: 'Ask' },
        { task: 'Confirm whether setup uses fresh blooms, artificial silk, or hybrid installations', tag: 'Confirm' },
        { task: 'Verify teardown responsibility: Does the decor quote include post-event midnight removal?', tag: 'Contract' }
      ]
    },
    {
      category: 'Photography & Cinema',
      items: [
        { task: 'Confirm exactly WHO will shoot on the day (lead artist vs junior associate)', tag: 'Ask' },
        { task: 'Specify exact delivery timeline: teaser clip (48h), online gallery (2-3 weeks), album (6 weeks)', tag: 'Contract' },
        { task: 'Ensure full high-resolution digital image rights and raw video backup retention policy', tag: 'Contract' }
      ]
    },
    {
      category: 'Sound, DJ & Entertainment',
      items: [
        { task: 'Confirm power requirements (dedicated 16A circuits) and compatibility with venue sound system', tag: 'Confirm' },
        { task: 'Share "Must Play" and "Do Not Play" playlist guidelines 1 week in advance', tag: 'Ask' },
        { task: 'Lock in writing: backup audio gear in case of amplifier or laptop failure', tag: 'Contract' }
      ]
    }
  ];

  if (eventType === 'community') {
    base.push({
      category: 'Civic Permits, Safety & Crowd Control',
      items: [
        { task: 'Check local municipal sound permit / loudspeaker license with city police department', tag: 'Permit' },
        { task: 'Confirm venue fire-safety inspection certificate and clearly marked emergency exit routes', tag: 'Safety' },
        { task: 'Establish crowd management perimeter, volunteer first-aid booth, and lost-and-found station', tag: 'Safety' },
        { task: 'Acquire general event liability insurance policy covering public attendees', tag: 'Contract' }
      ]
    });
  }

  return base;
}

export function generatePersonalizedIdeas(eventType, vibe, guests, budget, currency = 'INR') {
  const isINR = currency === 'INR';
  const isBudgetFriendly = budget < (isINR ? 150000 : 2500);
  const isLuxury = budget > (isINR ? 800000 : 15000);

  if (eventType === 'wedding') {
    return {
      ideas: [
        {
          title: 'Interactive Guest Welcome Wall',
          desc: 'Replace traditional guestbooks with an audio guestbook phone or framed vintage map where guests pin handwritten advice.'
        },
        {
          title: 'Signature Couple Mocktails / Cocktails',
          desc: 'Create two curated drinks named after your first date spot or mutual running jokes with custom acrylic stirrers.'
        },
        {
          title: 'Acoustic Golden-Hour Transition',
          desc: 'Hire a solo violinist, flautist, or acoustic guitarist to play contemporary romantic covers during the sunset cocktail hour.'
        },
        {
          title: 'Live Artisan Dessert Counter',
          desc: 'A live jalebi-rabri, churro, or gelato rolling station that turns dessert into an interactive spectator experience.'
        },
        {
          title: 'Sustainable Edible / Seeded Favors',
          desc: 'Artisanal local spice jars, raw organic honey pots, or seed balls wrapped in recyclable jute bags.'
        },
        {
          title: 'The "Wow" Moment: Cold-Spark & Confetti Reveal',
          desc: 'Synchronize indoor-safe cold spark fountains and low-lying dry ice fog during the couple entrance or first dance for cinematic photos.'
        }
      ],
      budgetSavers: [
        {
          title: 'Lunch or Brunch Reception Timing',
          desc: 'Hosting a celebration between 11 AM – 3 PM cuts venue hire fees by 25–40% and reduces alcohol consumption naturally.'
        },
        {
          title: 'Architectural Lighting over Floral Density',
          desc: 'Warm amber uplighting and fairy light canopies transform an entire room for a fraction of the price of heavy exotic floral arches.'
        }
      ]
    };
  }

  if (eventType === 'birthday') {
    return {
      ideas: [
        {
          title: 'The Decade / Memory Photo Gallery',
          desc: 'Hang vintage childhood and funny candid milestone photos on suspended fairy lights across the entrance corridor.'
        },
        {
          title: 'Customized Trivia Roast & Kahoot Game',
          desc: 'A 15-minute interactive smartphone trivia game with questions about the guest of honor, complete with playful gag prizes.'
        },
        {
          title: 'Selfie Corner with Instant Polaroid Prints',
          desc: 'Rent an instant camera with metallic markers and metallic tape where guests snap two photos—one to take home, one for the memory book.'
        },
        {
          title: 'Themed Signature Mocktail/Drink Tower',
          desc: 'A cascading glassware tower poured with sparkling cider or champagne as an energetic toast before cake cutting.'
        },
        {
          title: 'Late-Night Comfort Snack Box',
          desc: 'Hand out mini sliders, hot samosas, or gourmet fries in customized paper sleeves at the end of the party.'
        },
        {
          title: 'The "Wow" Moment: Surprise Video Tribute or Flash Highlight',
          desc: 'Project a 3-minute crowdsourced video tribute from friends across the world, followed by a dramatic birthday confetti drop.'
        }
      ],
      budgetSavers: [
        {
          title: 'Interactive DIY Food Station',
          desc: 'Set up a build-your-own taco, chaat, or pasta counter. It reduces catering labor costs while being universally loved by guests.'
        },
        {
          title: 'Rental Neon Sign with Balloon Garland',
          desc: 'Rent a "Happy Birthday" or "Better Together" LED neon sign for ₹1,500 and build a balloon arch using a ₹600 DIY kit.'
        }
      ]
    };
  }

  // Community Event
  return {
    ideas: [
      {
        title: 'Community Story & Impact Wall',
        desc: 'A large interactive chalkboard or banner where participants write their hopes for the cause or neighborhood.'
      },
      {
        title: 'Local Artisan & Food Truck Alley',
        desc: 'Invite local homegrown vendors to sell snacks and merchandise on a rev-share model, reducing your upfront catering overhead.'
      },
      {
        title: 'Live Mural or Collaborative Art Piece',
        desc: 'Hire a local student artist to sketch a community canvas that attendees can contribute brushstrokes to throughout the day.'
      },
      {
        title: 'Digital Fast-Checkin with Branded Badges',
        desc: 'QR-code phone scanning at the welcome desk with compostable recycled paper badges and seed-paper lanyards.'
      },
      {
        title: 'Eco-Friendly Hydration Hub',
        desc: 'Branded water refilling stations encouraging attendees to bring their own bottles, eliminating hundreds of single-use plastic cups.'
      },
      {
        title: 'The "Wow" Moment: Collective Lighting or Community Drum Circle',
        desc: 'A 20-minute synchronized community percussion workshop or lantern illumination ceremony that creates unforgettable unity.'
      }
    ],
    budgetSavers: [
      {
        title: 'In-Kind Community Sponsorships',
        desc: 'Approach local bakeries and beverage distributors for donated refreshments in exchange for flyer logos and social shoutouts.'
      },
      {
        title: 'University / NGO Venue Partnerships',
        desc: 'Colleges and municipal halls frequently waive venue fees for registered causes, saving up to 70% of baseline rental costs.'
      }
    ]
  };
}

export function generateRisksAndMitigations(eventType, guests, timing) {
  return [
    {
      risk: 'Unpredictable Weather (Sudden Rain / Extreme Heat / Wind)',
      mitigation: 'Lock an indoor standby hall or waterproof German pagoda tent in your contract with a 48-hour go/no-go call. Never rely on an open lawn without a verified covered backup.'
    },
    {
      risk: 'RSVP Fluctuation & Headcount Surges / No-Shows',
      mitigation: 'Implement a 3-tier RSVP follow-up (digital invite, personal WhatsApp reminder at 10 days, final dietary text at 4 days). Guarantee only 85-90% of RSVPs to caterer with a 10% standby plate buffer.'
    },
    {
      risk: 'Crucial Vendor Cancellation or Equipment Failure',
      mitigation: 'Never hire single-operator vendors without an explicit replacement backup clause in the contract. Require written confirmation of duplicate DJ audio laptops and spare photography camera bodies.'
    }
  ];
}

export function generateNextThreeSteps(timing) {
  if (timing === 'under_3_weeks') {
    return [
      '1. Lock and contract the venue and catering immediately today; get written confirmation on setup access times.',
      '2. Send digital invitations via WhatsApp/Email with a firm 48-hour RSVP deadline to lock numbers.',
      '3. Book your anchor entertainment (DJ/sound or photographer) and order the custom cake.'
    ];
  }
  return [
    '1. Finalize your firm budget ceiling and guest headcount target using the PlanPilot budget table.',
    '2. Shortlist 3 venues matching your guest count and request written itemized quotes (including taxes & service charges).',
    '3. Gather digital inspiration for your core theme and assign one designated planning co-host.'
  ];
}

export function generateDayOfRunSheet(eventType) {
  if (eventType === 'wedding') {
    return [
      { time: '09:00 AM', event: 'Venue Handover & Decor Setup load-in begins' },
      { time: '11:00 AM', event: 'Bridal & Groom hair, styling, and makeup session starts' },
      { time: '02:00 PM', event: 'Photographer arrives; bridal details, portraits & couple first-look photos' },
      { time: '04:00 PM', event: 'AV & Sound Engineer test microphones, ceremony music cues & lighting' },
      { time: '05:00 PM', event: 'Guest Arrival & Welcome Drink / Acoustic music begins' },
      { time: '05:45 PM', event: 'Ceremony / Processional begins' },
      { time: '07:00 PM', event: 'Sunset Cocktail Hour & Appetizer tray service' },
      { time: '08:15 PM', event: 'Grand Entrance, Welcome Speeches & Cake Cutting' },
      { time: '08:45 PM', event: 'Buffet Dinner Stations opened' },
      { time: '09:30 PM', event: 'Dance Floor Opens / DJ set begins' },
      { time: '11:30 PM', event: 'Late Night send-off & Venue load-out begins' }
    ];
  }

  if (eventType === 'birthday') {
    return [
      { time: '04:00 PM', event: 'Decor team arrives: balloon arch, backdrop setup & lighting' },
      { time: '05:30 PM', event: 'Cake delivered and safely refrigerated; sound system tested' },
      { time: '06:30 PM', event: 'Host & guest of honor arrive for candid family photos' },
      { time: '07:00 PM', event: 'Guests arrive; welcome mocktails and background music' },
      { time: '07:45 PM', event: 'Interactive game / Milestone trivia roast' },
      { time: '08:30 PM', event: 'Gather around cake, birthday toast & celebratory cutting' },
      { time: '09:00 PM', event: 'Dinner buffet open; music transitions to upbeat dance party' },
      { time: '10:30 PM', event: 'Return gifts handed out; heartfelt thank-you farewell' }
    ];
  }

  // Community
  return [
    { time: '07:00 AM', event: 'Site access, safety barriers & stage rigging setup' },
    { time: '08:00 AM', event: 'Sound check, registration desk setup, volunteer briefing' },
    { time: '09:00 AM', event: 'Doors open: Registration, QR scanning & welcome tea/coffee' },
    { time: '09:45 AM', event: 'Opening Keynote & Community Welcome Address' },
    { time: '11:15 AM', event: 'Interactive workshops / breakout community sessions' },
    { time: '01:00 PM', event: 'Networking lunch & sponsor booth engagement' },
    { time: '02:30 PM', event: 'Community Panel / Showcase & Live Performances' },
    { time: '04:30 PM', event: 'Closing awards, thank you address & community photo' },
    { time: '05:30 PM', event: 'Volunteer debrief and venue cleanup & load-out' }
  ];
}

export function generateInvitationWording(eventType, vibe = 'Festive') {
  if (eventType === 'wedding') {
    return {
      formal: `Together with their families\n[Partner 1] & [Partner 2]\njoyfully invite you to celebrate their wedding.\n\nDate: [Insert Date]\nTime: [Insert Time]\nVenue: [Insert Venue Name, City]\n\nRSVP by [Date] at [Website/Phone].\nDress Code: Festive Elegant`,
      casual: `We're getting married!\nCome celebrate love, laughter, and great food with [Partner 1] & [Partner 2].\n\nWhen: [Date] at [Time]\nWhere: [Venue, City]\n\nBring your dancing shoes! Please let us know if you can make it by [RSVP Date].`,
      whatsapp: `✨ Save the Date! ✨\n[Partner 1] & [Partner 2] are tying the knot!\n\n📅 Date: [Date]\n📍 Location: [Venue, City]\n\nWe would love to have you with us as we start this new chapter. Tap the link to view details & RSVP: [Link]`
    };
  }

  if (eventType === 'birthday') {
    return {
      formal: `Please join us to celebrate the milestone birthday of\n[Name]\nfor an evening of celebration, fine dining, and cheer.\n\nDate: [Date] at [Time]\nLocation: [Venue, City]\n\nKindly RSVP to [Host Phone] by [Date].`,
      casual: `Cheers to another year! 🥳\nJoin us for [Name]'s Birthday Bash with great food, drinks, and music.\n\nWhen: [Date] at [Time]\nWhere: [Venue]\nRSVP: [Contact]`,
      whatsapp: `🎉 Party Alert! 🎉\nIt's [Name]'s birthday and we're celebrating big!\n\n📅 Date: [Date] at [Time]\n📍 Venue: [Venue, City]\n\nDrop in for food, fun, and cake! Let us know if you can make it by replying here: [Phone]`
    };
  }

  return {
    formal: `You are cordially invited to the annual [Event/Fundraiser Name]\nhosted by [Organization].\n\nJoin us for an inspiring gathering dedicated to [Mission/Cause].\n\nDate: [Date] | Time: [Time]\nVenue: [Venue, City]\nRSVP / Tickets: [URL]`,
    casual: `Let's come together! Join us for [Event Name]—a day of community, great ideas, and good company.\n\nWhen: [Date], [Time]\nWhere: [Venue]\nFree Registration: [Link]`,
    whatsapp: `🤝 Join us at [Event Name]!\nWe're bringing together neighbors, creators, and advocates for a day of impact.\n\n📅 [Date] from [Time]\n📍 [Venue]\n\nReserve your free spot here: [Link]`
  };
}

export function exportPlanAsMarkdown(planData) {
  const { snapshot, budgetTable, timeline, vendorChecklist, ideas, risks, nextSteps, currency } = planData;
  const currSym = CURRENCY_SYMBOLS[currency] || '₹';

  let md = `# PlanPilot Event Plan: ${snapshot.eventName || 'Custom Event'}\n\n`;
  md += `> Generated by PlanPilot — Expert Event Planner\n\n`;

  md += `## 1. Event Snapshot\n`;
  md += `- **Event Type**: ${snapshot.eventType}\n`;
  md += `- **Date / Timing**: ${snapshot.timingText}\n`;
  md += `- **Guest Count**: ${snapshot.guests} guests\n`;
  md += `- **Total Budget**: ${formatCurrency(snapshot.totalBudget, currency)}\n`;
  md += `- **City / Location**: ${snapshot.location || 'Local'}\n`;
  md += `- **Vibe / Theme**: ${snapshot.vibe || 'Festive and Celebratory'}\n`;
  md += `- **Planning Mode**: ${snapshot.mode}\n`;
  md += `- **Key Assumptions**: ${snapshot.assumptions}\n\n`;

  md += `## 2. Budget Breakdown (100% Balanced with Contingency)\n\n`;
  md += `| Category | % | Amount | Notes / Savings Tip |\n`;
  md += `| :--- | :---: | :---: | :--- |\n`;
  budgetTable.rows.forEach(r => {
    md += `| **${r.name}** | ${r.pct}% | ${formatCurrency(r.amount, currency)} | ${r.tip} |\n`;
  });
  md += `| **Total** | **100%** | **${formatCurrency(budgetTable.totalBudget, currency)}** | *Guaranteed exact sum* |\n\n`;

  md += `## 3. Backward-Planned Timeline\n\n`;
  timeline.forEach(phase => {
    md += `### ${phase.phase}\n`;
    phase.items.forEach(item => {
      md += `- [ ] ${item}\n`;
    });
    md += `\n`;
  });

  md += `## 4. Vendor Checklist\n\n`;
  vendorChecklist.forEach(cat => {
    md += `### ${cat.category}\n`;
    cat.items.forEach(item => {
      md += `- [ ] [${item.tag}] ${item.task}\n`;
    });
    md += `\n`;
  });

  md += `## 5. Personalized Ideas\n\n`;
  ideas.ideas.forEach((idea, i) => {
    md += `**${i + 1}. ${idea.title}**: ${idea.desc}\n\n`;
  });
  md += `### Budget-Saving Alternatives\n\n`;
  ideas.budgetSavers.forEach((bs, i) => {
    md += `* **Option ${i + 1} (${bs.title})**: ${bs.desc}\n`;
  });
  md += `\n`;

  md += `## 6. Risks & Backup Plan\n\n`;
  risks.forEach((r, i) => {
    md += `**Risk ${i + 1}: ${r.risk}**\n- *Mitigation*: ${r.mitigation}\n\n`;
  });

  md += `## 7. Next 3 Steps (This Week)\n\n`;
  nextSteps.forEach(step => {
    md += `- ${step}\n`;
  });

  return md;
}
