// A/B Tester Agent: WRITER
// Profile: Author, journalist, heavy typist
// Goal: Test what drives long-form writing tool purchases

const PERSONA = {
  name: 'Writer Tester',
  avatar: '✍️',
  traits: ['heavy_daily_use', 'comfort_priority', 'quiet_env', 'aesthetic_matters'],
  knowledge: {
    knows_switches: 'somewhat',
    cares_tactile: true,
    sound_conscious: true,
    wpm_focused: true
  },
  pain_points: [
    'fatigue',
    'wrist strain',
    'noise in cafes',
    'ugly gamer aesthetic'
  ]
};

const VARIANT_A = {
  name: 'Ergonomics focus',
  description: 'Highlights wrist position, travel distance, fatigue',
  hypothesis: 'Writers prioritize physical comfort',
  expected_ctr: 0.38
};

const VARIANT_B = {
  name: 'Aesthetic focus',
  description: 'Emphasizes clean design, matching setups',
  hypothesis: 'Writers want keyboards that look good in photos',
  expected_ctr: 0.45
};

const TEST_MATRIX = [
  // Homepage
  { element: 'hero', a: 'Comfortable typing for longform work', b: 'Keyboards for creatives' },
  { element: 'switch_recommendation', a: 'Brown - tactile feedback without noise', b: 'The switch that feels like a typewriter' },
  { element: 'layout_rec', a: 'Low-profile for less strain', b: 'Full-size for familiar layout' },
  { element: 'price_filter', a: 'Under $100', b: 'Editor\'s picks' }
];

function runTest(elementId, variant) {
  const timestamp = new Date().toISOString();
  const result = {
    agent: PERSONA.name,
    element: elementId,
    variant: variant,
    timestamp: timestamp,
    predicted_engagement: variant === 'A' ? VARIANT_A.expected_ctr : VARIANT_B.expected_ctr,
    reasoning: 'Writers care about aesthetics and feel, not technical specs'
  };
  
  console.log(`[${PERSONA.avatar} ${PERSONA.name}] Tested ${elementId} → Variant ${variant}`);
  return result;
}

module.exports = {
  persona: PERSONA,
  variants: { A: VARIANT_A, B: VARIANT_B },
  testMatrix: TEST_MATRIX,
  runTest: runTest
};