// A/B Tester Agent: ENTHUSIAST
// Profile: Already owns mechs, building collection
// Goal: Test what drives enthusiasts to bookmark/return

const PERSONA = {
  name: 'Enthusiast Tester',
  avatar: '⚙️',
  traits: ['owns_multiple', 'into_customizing', 'wait_for_gb', 'quality_over_price'],
  knowledge: {
    knows_gmk: true,
    knows_kbd: true,
    understands_mounts: true,
    follows_ic: true
  },
  pain_points: [
    'scattered info across sites',
    'missing GB deadlines',
    'price tracking',
    'availability alerts'
  ]
};

const VARIANT_A = {
  name: 'Comprehensive aggregator',
  description: 'Emphasizes breadth of products tracked',
  hypothesis: 'Enthusiasts want everything in one place',
  expected_ctr: 0.62
};

const VARIANT_B = {
  name: 'Curated drops',
  description: 'Only highlights interesting/rare items',
  hypothesis: 'Enthusiasts want filtering, noise reduction',
  expected_ctr: 0.71
};

const TEST_MATRIX = [
  // Dashboard features
  { element: 'filters', a: 'Show all 1,247 keyboards', b: 'Filter: Hotswap + Under $200' },
  { element: 'notification_cta', a: 'Track prices', b: 'Get alerts on your wishlist' },
  { element: 'gb_tab', a: 'Group Buys', b: 'Active GBs ending soon' },
  { element: 'ic_section', a: 'Interest Checks', b: 'Upcoming drops worth watching' }
];

function runTest(elementId, variant) {
  const timestamp = new Date().toISOString();
  const result = {
    agent: PERSONA.name,
    element: elementId,
    variant: variant,
    timestamp: timestamp,
    predicted_engagement: variant === 'A' ? VARIANT_A.expected_ctr : VARIANT_B.expected_ctr,
    reasoning: VARIANT_B.hypothesis,
    notes: 'Enthusiasts value signal over noise - curated > comprehensive'
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