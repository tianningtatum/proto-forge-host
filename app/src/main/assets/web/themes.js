// Technopreneurship Programs / Tracks for ProtoForge
var FIXTHEMES = {
  ideation: {
    id: 'ideation',
    title: 'IDEA SPARK',
    program: 'Divergent Ideation',
    machine: 'Venture Ideation Board',
    tagline: 'A messy real-world pain point needs a breakthrough concept. One of you runs the Venture Board. Everyone else holds a piece of the Ideation Playbook.',
    mods: {
      wires: 'Pain-Point Filter',
      gauge: 'Market Feasibility',
      keypad: 'SCAMPER Matrix',
      switches: 'Assumption Gates',
      procedure: 'Ideation Sprint'
    },
    gaugeUnit: '%',
    gaugePrefix: 'TAM',
    posWord: 'Tier',
    steps: ['Frame Pain', 'SCAMPER Twist', 'Analogy Shift', 'Crazy-8s Pick', 'Value Hook', 'Kill Bias'],
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
      'The Product Lead had to describe messy customer pain points without seeing the playbook rules. How did your team avoid jumping straight to a gadget or app before confirming the root problem?',
      'Playbook holders couldn\'t see the Venture Board. When someone said "that\'s not on my playbook page," how quickly did the team route the question to the right teammate?',
      'In early ideation, every founder holds a different bias (tech-first, cost-first, user-first). How did rotating the Product Lead role change how quieter members contributed?'
    ]
  },
  mvp: {
    id: 'mvp',
    title: 'MVP FORGE',
    program: 'Product Development',
    machine: 'Prototype Bench',
    tagline: 'A hardware-software prototype is hitting field constraints. One of you operates the Prototype Bench. Everyone else holds the DFM & Validation Manual.',
    mods: {
      wires: 'BOM Trade-Offs',
      gauge: 'Unit Economics',
      keypad: 'TRL Milestones',
      switches: 'Design-for-Mfg',
      procedure: 'Validation Loop'
    },
    gaugeUnit: 'PHP',
    gaugePrefix: 'BOM',
    posWord: 'Spec',
    steps: ['Define MVP', 'Cut Scope', 'Bench Test', 'User Trial', 'Measure KPI', 'Pivot Gate'],
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
      'BOM Trade-Offs and Unit Economics forced hard cuts under time pressure. Which feature did your team want to keep that the manual forced you to strip out?',
      'Design-for-Manufacturing switches depended on the Prototype Serial Code. What happened when someone acted before checking the serial condition?',
      'Real engineering startups fail when teams build full tooling before testing their riskiest assumption. How does this sprint mirror Lean Startup Build-Measure-Learn?'
    ]
  },
  pivot: {
    id: 'pivot',
    title: 'PIVOT LAB',
    program: 'Customer & Market Fit',
    machine: 'Discovery Console',
    tagline: 'Field interviews just contradicted your assumptions. One of you faces the Discovery Console. Everyone else holds the Customer Validation Rules.',
    mods: {
      wires: 'Channel Mix',
      gauge: 'CAC / LTV Ratio',
      keypad: 'Persona Signals',
      switches: 'Pivot Triggers',
      procedure: 'Discovery Gate'
    },
    gaugeUnit: 'x',
    gaugePrefix: 'LTV',
    posWord: 'Move',
    steps: ['Interview', 'Spot Bias', 'Test Price', 'Log Churn', 'Re-Segment', 'Lock Fit'],
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
      'When field signals flipped (even vs. odd serial rule), did your Product Lead pause to verify or rush ahead and burn a spare iteration?',
      'Which Persona Signal symbols caused confusion when describing them verbally, and how did your team standardize your vocabulary?',
      'In Technopreneurship, falling in love with your first engineering design is fatal. What is one assumption in your own team\'s project that you need to test this week?'
    ]
  },
  launch: {
    id: 'launch',
    title: 'SCALE RUN',
    program: 'Full Venture Sprint',
    machine: 'Launch Readiness Rig',
    tagline: 'Combined Idea-to-Launch pressure test across ideation, BOM feasibility, and customer validation. Communicate fast—3 mistakes end the run.',
    mods: {
      wires: 'Value Stream',
      gauge: 'Burn & Margin',
      keypad: 'IP & Moat Icons',
      switches: 'Compliance Rig',
      procedure: 'Go-To-Market'
    },
    gaugeUnit: '%',
    gaugePrefix: 'ROI',
    posWord: 'Gate',
    steps: ['Validate', 'Freeze BOM', 'File IP', 'Pilot Run', 'Price Tier', 'Ship MVP'],
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
      'Under combined pressure, how did your team balance speed against verification before confirming a gate?',
      'Every member held different playbook rules and couldn\'t look at the Product Lead\'s screen. How does that mirror real cross-functional engineering startups?',
      'What single communication habit made the biggest difference between your fastest and slowest round?'
    ]
  }
};
