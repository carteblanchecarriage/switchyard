// A/B Tester Agent: GAMER
// Profile: FPS/MOBA player looking for competitive edge
// Goal: Test if performance-focused messaging increases engagement

const PERSONA = {
  name: 'Gamer Tester',
  avatar: '🎮',
  traits: ['competitive', 'latency_sensitive', 'rgb_optimized', 'tournament_ready'],
  knowledge: {
    knows_switches: true,
    knows_actuation: true,
    understands_tkl: true,
    cares_about_ms: true
  },
  pain_points: [
    'desk space for mouse',
    'switch latency',
    'wireless reliability',
    'build quality under rage'
  ]
};

const VARIANT_A = {
  name: 'Performance Specs',
  description: 'Focuses on ms latency, polling rate, actuation distance',
  hypothesis: 'Gamer resonatates with technical specs',
  expected_ctr: 0.55
};

const VARIANT_B = {
  name: 'Competitive Edge',
  description: 'Focuses on esports use, pro player endorsements',
  hypothesis: 'Social proof matters more than specs',
  expected_ctr: 0.48
};

const TEST_MATRIX = [
  // Gaming page
  { element: 'gaming_headline', a: 'Low-latency mechanical keyboards', b: 'The keyboards esports pros trust' },
  { element: '60pct_section', a: '60% for maximum mouse space', b: 'More room to clutch' },
  { element: 'switch_recommendation', a: 'Speed Silver switches (1.2mm actuation)', b: 'Fastest response for gaming' },
  { element: 'wireless_callout', a: '2.4GHz wireless, 1ms latency', b: 'Gaming-grade wireless' }
];

function runTest(elementId, variant) {
  const timestamp = new Date().toISOString();
  const result = {
    agent: PERSONA.name,
    element: elementId,
    variant: variant,
    timestamp: timestamp,
    predicted_engagement: variant === 'A' ? VARIANT_A.expected_ctr : VARIANT_B.expected_ctr,
    reasoning: 'Gamers understand latency, actuation points, polling rates. Performance specs matter.',
    notes: JSON.stringify(PERSONA.traits)
  };
  
  console.log(`[${PERSONA.avatar} ${PERSONA.name}] Tested ${elementId} → Variant ${variant}: "${result.reasoning}"`);
  return result;
}

module.exports = {
  persona: PERSONA,
  variants: { A: VARIANT_A, B: VARIANT_B },
  testMatrix: TEST_MATRIX,
  runTest: runTest
};