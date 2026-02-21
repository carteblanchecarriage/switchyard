// A/B Tester Agent: NOVICE
// Profile: First-time mechanical keyboard buyer
// Goal: Test if "beginner-focused" messaging increases engagement

const PERSONA = {
  name: 'Novice Tester',
  avatar: '👤',
  traits: ['new_to_mechanical', 'budget_conscious', 'overwhelmed_by_options'],
  knowledge: {
    knows_switches: false,
    knows_profiles: false,
    knows_layouts: false,
    understands_prices: false
  },
  pain_points: [
    'too many options', 
    'confusing terminology', 
    'afraid of expensive mistake'
  ]
};

const VARIANT_A = {
  name: 'Jargon-Heavy',
  description: 'Uses enthusiast terminology (gasket, lubed, thock)',
  hypothesis: 'Hurts conversion - intimidates novices',
  expected_ctr: 0.15
};

const VARIANT_B = {
  name: 'Plain English',
  description: 'Uses simple language, focuses on "feels good"',
  hypothesis: 'Better conversion - accessible',
  expected_ctr: 0.35
};

const TEST_MATRIX = [
  // Homepage headline tests
  { element: 'home_hero_1', a: 'Find your perfect mechanical switch', b: 'Stop typing on mush - upgrade your day' },
  { element: 'home_hero_2', a: 'TKL, 75%, 65%, 60% layouts', b: 'Full size to ultra-compact - sizes for every desk' },
  { element: 'home_cta', a: 'Browse Group Buys', b: 'See Popular Keyboards' },
  
  // Beginner page tests
  { element: 'beginner_title', a: 'Beginner Guide', b: 'New to Mechanical Keyboards?' },
  { element: 'budget_section', a: 'Budget Options', b: 'Under $100' }
];

function runTest(elementId, variant) {
  const timestamp = new Date().toISOString();
  const result = {
    agent: PERSONA.name,
    element: elementId,
    variant: variant,
    timestamp: timestamp,
    predicted_engagement: VARIANT_B.expected_ctr,
    notes: `Persona: ${JSON.stringify(PERSONA.traits)}`
  };
  
  console.log(`[${PERSONA.avatar} ${PERSONA.name}] Tested ${elementId} → Variant ${variant}`);
  return result;
}

// Export for orchestration
module.exports = {
  persona: PERSONA,
  variants: { A: VARIANT_A, B: VARIANT_B },
  testMatrix: TEST_MATRIX,
  runTest: runTest
};
