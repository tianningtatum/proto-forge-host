var FIXTHEMES = {
  ideation: {
    id: 'ideation',
    title: 'IDEA SPARK',
    program: 'Idea Gen & JTBD (T4-T6)',
    machine: 'Venture Ideation Board',
    tagline: 'Go wide before you narrow: apply SCAMPER, reverse thinking, JTBD opportunity gaps, and NDSB on a shared problem before locking a solution.',
    mods: {
      wires: 'SCAMPER & Reverse',
      gauge: 'JTBD Opportunity',
      keypad: 'Innovation Matrix',
      switches: 'NDSB & SDG Filter',
      procedure: 'Idea Screen Gate'
    },
    gaugeUnit: 'pts',
    gaugePrefix: 'OPP',
    posWord: 'Band',
    steps: ['Frame Job', 'SCAMPER Twist', 'Reverse Problem', 'Score Opportunity', 'State NDSB', 'Pick Runner-Up'],
    symbols: [
      '<circle cx="24" cy="24" r="14"/><path d="M24 10v28M10 24h28"/>',
      '<polygon points="24,6 42,38 6,38"/>',
      '<rect x="10" y="10" width="28" height="28" rx="4"/><circle cx="24" cy="24" r="6"/>',
      '<path d="M8 24h32M24 8l16 16-16 16"/>',
      '<path d="M12 12l24 24M36 12L12 36"/><circle cx="24" cy="24" r="16"/>',
      '<path d="M8 34c4-14 12-20 16-20s12 6 16 20"/><line x1="6" y1="34" x2="42" y2="34"/>',
      '<polygon points="24,6 40,18 34,38 14,38 8,18"/>',
      '<circle cx="17" cy="24" r="9"/><circle cx="31" cy="24" r="9"/>',
      '<path d="M10 14h28l-10 12v10l-8-4v-6z"/>',
      '<path d="M24 6v10M24 32v10M6 24h10M32 24h10"/><circle cx="24" cy="24" r="6"/>',
      '<rect x="8" y="16" width="32" height="16" rx="8"/><circle cx="18" cy="24" r="4"/>',
      '<path d="M12 36L24 10l12 26H12z"/><circle cx="24" cy="28" r="3"/>'
    ],
    colors: {
      bg: '#14161a', plate: '#20242b', plate2: '#2a2f37', edge: '#3d444e',
      ink: '#eef0f2', dim: '#a0a8b2', accent: '#ffc21a', accentInk: '#1a1400', accent2: '#7fd3ff'
    },
    debrief: [
      'Did your team separate divergent idea generation (SCAMPER / reverse thinking) from convergent screening, or did someone judge ideas too early?',
      'How did you distinguish a customer job statement (stable need) from a solution feature, and identify underserved outcomes?',
      'Which idea did you keep as a runner-up in case your primary test fails, and how did you avoid fabricating AI-generated interview data?'
    ]
  },
  mvp: {
    id: 'mvp',
    title: 'PRETOTYPE LAB',
    program: 'Proto & Pretotype (T7)',
    machine: 'Test & Feedback Bench',
    tagline: 'Test "should we build it?" and "can we build it?" cheaply with XYZ hypotheses, pretotypes (Fake Door, Wizard of Oz, Pinocchio), and Feedback Capture Grids.',
    mods: {
      wires: 'Pretotype Method',
      gauge: 'XYZ Target %',
      keypad: 'Fidelity & Rig Icons',
      switches: 'Honest Test Rules',
      procedure: 'Capture & Decide'
    },
    gaugeUnit: '%',
    gaugePrefix: 'XYZ',
    posWord: 'Tier',
    steps: ['Write XYZ', 'Run Pretotype', 'Watch & Quiet', 'Fill 4-Box Grid', 'Check Ethics', 'Keep or Pivot'],
    symbols: [
      '<rect x="8" y="8" width="13" height="13"/><rect x="27" y="8" width="13" height="13"/><rect x="8" y="27" width="13" height="13"/><rect x="27" y="27" width="13" height="13"/>',
      '<path d="M6 24h10l5-12 6 24 5-12h10"/>',
      '<circle cx="24" cy="24" r="15"/><path d="M24 14v10l7 7"/>',
      '<path d="M10 36V12h20l8 8v16H10z"/>',
      '<path d="M8 14h32M8 24h22M8 34h14"/>',
      '<polygon points="24,8 40,24 24,40 8,24"/>',
      '<path d="M14 24l7 7 13-14"/><circle cx="24" cy="24" r="16"/>',
      '<path d="M12 10v28h24"/><path d="M16 30l7-8 6 4 7-11"/>',
      '<circle cx="24" cy="16" r="7"/><path d="M12 38c0-7 5-11 12-11s12 4 12 11"/>',
      '<path d="M8 20h32v16H8z"/><path d="M16 20v-6h16v6"/>',
      '<path d="M24 8l14 8v16l-14 8-14-8V16z"/>',
      '<path d="M10 24h28M24 10v28"/><circle cx="24" cy="24" r="10"/>'
    ],
    colors: {
      bg: '#0c111b', plate: '#172031', plate2: '#1f2b40', edge: '#33445f',
      ink: '#eaeff7', dim: '#97a5bb', accent: '#38bdf8', accentInk: '#061826', accent2: '#ffd400'
    },
    debrief: [
      'Did your test measure real user action (Z) with a clear threshold (X%) for a defined group (Y), rather than asking "do you like it?"',
      'How did you keep pretotyping honest—no fake reviews, clear pre-order terms, and no defending your prototype while watching users?',
      'What did you put in Likes, Criticisms, Questions, and Ideas on your Feedback Capture Grid to change your next iteration?'
    ]
  },
  pivot: {
    id: 'pivot',
    title: 'IP & MARKET FIT',
    program: 'IP, Value & GTM (T8-T10)',
    machine: 'Venture Strategy Board',
    tagline: 'Check IPOPHL/RA 8293 protection and prior art, turn "it" features into "you" value propositions, map competitors + PESTEL, and size TAM-SAM-SOM.',
    mods: {
      wires: 'IP & Prior Art',
      gauge: 'SOM / Pricing',
      keypad: 'Lean & 7Ps Icons',
      switches: 'Ethics & Code Gate',
      procedure: 'Sales & GTM Loop'
    },
    gaugeUnit: 'PHP',
    gaugePrefix: 'SOM',
    posWord: 'Step',
    steps: ['Prior-Art Check', 'Turn "It" to "You"', 'Map Rivals & PESTEL', 'Size TAM-SAM-SOM', 'Pick Price & Channel', 'Follow Up'],
    symbols: [
      '<path d="M10 12h28v18H18l-8 6V12z"/>',
      '<circle cx="24" cy="24" r="15"/><path d="M16 24h16M24 16v16"/>',
      '<path d="M8 34L20 14l8 12 12-16"/>',
      '<polygon points="10,10 38,24 10,38"/>',
      '<rect x="10" y="10" width="28" height="28"/><path d="M10 24h28M24 10v28"/>',
      '<circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="5"/>',
      '<path d="M12 16h24M12 24h24M12 32h16"/>',
      '<path d="M24 8v32M14 18l10-10 10 10M14 30l10 10 10-10"/>',
      '<path d="M8 28c0-9 7-16 16-16s16 7 16 16"/><circle cx="24" cy="28" r="4"/>',
      '<polygon points="24,7 39,16 39,32 24,41 9,32 9,16"/>',
      '<path d="M12 12l24 24M36 12L12 36"/>',
      '<rect x="12" y="8" width="24" height="32" rx="3"/><line x1="18" y1="16" x2="30" y2="16"/>'
    ],
    colors: {
      bg: '#16130f', plate: '#241f19', plate2: '#302921', edge: '#4a4033',
      ink: '#f2ede5', dim: '#ab9f8d', accent: '#ff8a1f', accentInk: '#1f1000', accent2: '#ffd166'
    },
    debrief: [
      'How did you translate technical specs ("it") into customer pain/gain ("you") and separate your business model from your revenue model?',
      'Which IP tool fits your technical solution under RA 8293 (patent, utility model, industrial design, copyright, trademark, or trade secret), and what prior art did you check?',
      'How did you account for "doing nothing" as a competitor, size year-1 SOM realistically, and handle price objections with value?'
    ]
  },
  launch: {
    id: 'launch',
    title: 'FINANCE & PITCH',
    program: 'Finance & Pitch (T11-T12)',
    machine: 'Launch & Pitch Deck Rig',
    tagline: 'Match funding to stage (DOST grants, pre-orders, debt, equity), track cash vs. profit, compute break-even, pick PH legal form, and nail the 12-slide pitch.',
    mods: {
      wires: 'Funding & Legal',
      gauge: 'Break-Even Units',
      keypad: 'Pitch Deck Pillars',
      switches: 'Cash vs Profit Gate',
      procedure: '7-Min Pitch Flow'
    },
    gaugeUnit: 'u',
    gaugePrefix: 'BEP',
    posWord: 'Tier',
    steps: ['Open With Person', 'Show Prototype & XYZ', 'State TAM-SAM-SOM', 'Prove Break-Even', 'Give Legal & Ask', 'Answer With Proof'],
    symbols: [
      '<path d="M24 6l5 12h13l-10 8 4 13-12-8-12 8 4-13-10-8h13z"/>',
      '<circle cx="24" cy="24" r="15"/><path d="M15 24l6 6 12-12"/>',
      '<path d="M12 36L24 8l12 28H12z"/>',
      '<rect x="9" y="9" width="30" height="30" rx="6"/><path d="M17 24h14"/>',
      '<path d="M8 24h32M24 8v32M13 13l22 22M35 13L13 35"/>',
      '<polygon points="24,6 42,24 24,42 6,24"/><circle cx="24" cy="24" r="5"/>',
      '<path d="M10 34h28M14 26h20M18 18h12M22 10h4"/>',
      '<circle cx="16" cy="18" r="6"/><circle cx="32" cy="18" r="6"/><path d="M10 36c2-6 10-6 14 0 4-6 12-6 14 0"/>',
      '<path d="M12 10h24v14c0 8-12 14-12 14S12 32 12 24V10z"/>',
      '<path d="M8 16l16 12 16-12"/><rect x="8" y="14" width="32" height="22" rx="2"/>',
      '<circle cx="24" cy="24" r="14"/><path d="M24 14v20"/>',
      '<path d="M14 14h20v20H14z"/><circle cx="24" cy="24" r="4"/>'
    ],
    colors: {
      bg: '#101815', plate: '#192621', plate2: '#22332c', edge: '#354f45',
      ink: '#eaf4ef', dim: '#95b0a4', accent: '#35c66f', accentInk: '#03210f', accent2: '#ffd166'
    },
    debrief: [
      'Why can a startup show profit on paper (income statement) yet lose cash (cash-flow statement) due to unpaid receivables, inventory, or equipment purchases?',
      'Which Philippine legal form (sole proprietorship, OPC under RA 11232, partnership, or corporation) and funding mix fits your risk and stage?',
      'How will your team keep the pitch deck to 12 slides or fewer with point-stating headlines, cite sources on every number, and answer untested questions honestly?'
    ]
  },
  ece: {
    id: 'ece',
    title: 'ELECTRONICS ENGG',
    program: 'Electronics Engineering',
    machine: 'Smart Sensor & Comms Rig',
    tagline: 'Design low-power electronics, embedded telemetry, RF/IoT links, and field-ready prototypes for Philippine communities, farms, and hazard alerts.',
    mods: {
      wires: 'Signal & Bus Path',
      gauge: 'Power & SNR',
      keypad: 'RF & Sensor Icons',
      switches: 'EMC & Safety Rig',
      procedure: 'Field Pilot Loop'
    },
    gaugeUnit: 'dBm',
    gaugePrefix: 'PWR',
    posWord: 'Tap',
    steps: ['Breadboard Core', 'Test Link Range', 'Log Field Data', 'Cut Power Draw', 'Certify Safety', 'Pilot & Scale'],
    symbols: [
      '<path d="M6 24h10l4-10 6 20 4-10h12"/>',
      '<circle cx="24" cy="24" r="6"/><path d="M14 14a14 14 0 0 0 0 20M34 14a14 14 0 0 1 0 20"/>',
      '<rect x="12" y="12" width="24" height="24" rx="3"/><path d="M18 6v6M30 6v6M18 36v6M30 36v6M6 18h6M6 30h6M36 18h6M36 30h6"/>',
      '<path d="M24 8l12 20H12L24 8z"/><circle cx="24" cy="23" r="2"/>',
      '<path d="M8 34l10-12 8 7 14-17"/><path d="M32 12h8v8"/>',
      '<rect x="8" y="14" width="32" height="20" rx="4"/><line x1="16" y1="24" x2="32" y2="24"/>',
      '<circle cx="24" cy="24" r="14"/><path d="M24 10v14l9 5"/>',
      '<path d="M10 38V16l14-8 14 8v22"/><rect x="19" y="24" width="10" height="14"/>',
      '<path d="M12 12h24v24H12z"/><circle cx="18" cy="18" r="2"/><circle cx="30" cy="30" r="2"/>',
      '<path d="M8 24h12l4-8 4 16 4-8h12"/>',
      '<polygon points="24,7 41,24 24,41 7,24"/>',
      '<path d="M14 34c4-12 10-18 14-18s10 6 14 18"/>'
    ],
    colors: {
      bg: '#0b1320', plate: '#142238', plate2: '#1d2f4b', edge: '#314b73',
      ink: '#edf3fc', dim: '#9cb2d1', accent: '#22d3ee', accentInk: '#041c24', accent2: '#fbbf24'
    },
    debrief: [
      'For an ECE venture (such as landslide/flood telemetry, smart metering, or rural comms), what was the cheapest prototype or pretotype you could test before full PCB/enclosure build?',
      'Which IP protections under RA 8293 apply to circuits, sensor layouts, firmware/software, and brand names, and what prior art (e.g., G08B, H04) should you check?',
      'How do power draw, component lead times, and safety/compliance affect your unit cost, break-even count, and 30-day field pilot milestone?'
    ]
  },
  envi: {
    id: 'envi',
    title: 'ENVI & SANITARY ENGG',
    program: 'Environmental & Sanitary Engg',
    machine: 'Water, Waste & Air Rig',
    tagline: 'Solve water quality, wastewater/septic treatment, solid-waste recovery, and air/flood resilience with compliant, low-cost, sustainable engineering.',
    mods: {
      wires: 'Treatment Train',
      gauge: 'DO / BOD / Flow',
      keypad: 'Sanitation & SDG Icons',
      switches: 'DENR & Health Gate',
      procedure: 'Barangay Pilot Loop'
    },
    gaugeUnit: 'mg/L',
    gaugePrefix: 'WTR',
    posWord: 'Stage',
    steps: ['Check Baseline', 'Test Bench Sample', 'Verify Permit/Code', 'Run LGU/Site Pilot', 'Price & Maintenance', 'Audit Impact'],
    symbols: [
      '<path d="M24 7c8 10 13 16 13 22a13 13 0 0 1-26 0c0-6 5-12 13-22z"/>',
      '<path d="M14 28c3-4 7-4 10 0s7 4 10 0"/><path d="M14 35c3-4 7-4 10 0s7 4 10 0"/>',
      '<rect x="10" y="10" width="28" height="28" rx="6"/><path d="M17 24h14M24 17v14"/>',
      '<path d="M24 8l13 22H11L24 8z"/>',
      '<circle cx="24" cy="24" r="14"/><path d="M16 24l5 5 11-11"/>',
      '<path d="M10 36h28M14 36V20l10-8 10 8v16"/>',
      '<path d="M12 14h24M12 24h18M12 34h12"/>',
      '<circle cx="18" cy="20" r="6"/><circle cx="30" cy="28" r="6"/>',
      '<path d="M9 18l15 10 15-10"/><rect x="9" y="14" width="30" height="20" rx="2"/>',
      '<path d="M24 8v32M15 17l9-9 9 9"/>',
      '<polygon points="24,6 40,16 36,36 12,36 8,16"/>',
      '<path d="M10 30c6-12 22-12 28 0"/>'
    ],
    colors: {
      bg: '#0c1915', plate: '#152b24', plate2: '#1d3b32', edge: '#2f594c',
      ink: '#eaf7f2', dim: '#97bfb2', accent: '#34d399', accentInk: '#032117', accent2: '#fde047'
    },
    debrief: [
      'For Environmental & Sanitary Engineering ventures (like precast septic systems, rainwater harvesting, waste/water treatment, or flood/air monitoring), how do you test demand before building full infrastructure?',
      'How do you balance environmental/SDG impact and regulatory compliance with customer willingness to pay—especially when "doing nothing" or LGU/barangay processes are involved?',
      'What milestone, permit/sign-off, maintenance plan, and honest claim check will convince a panel that your solution works safely in the field?'
    ]
  }
};
