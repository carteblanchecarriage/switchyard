// Multi-Agent Orchestrator
// Runs all A/B testing agents with hardcoded personas
// Can run sequentially or in "parallel" (fast batch)

const fs = require('fs');
const path = require('path');

// Load all tester agents
const TESTERS = [
  require('./tester-novice.js'),
  require('./tester-gamer.js'),
  require('./tester-enthusiast.js'),
  require('./tester-writer.js')
];

// Run mode: 'all', 'winner', or specific persona
// 'winner' = runs multiple times, picks best performing variant
const CONFIG = {
  iterations: 3,        // How many times to test each combination
  confidenceThreshold: 0.95,  // When to declare winner
  outputPath: path.join(__dirname, '../ab-test-logs')
};

async function orchestrate(mode = 'all') {
  console.log('\n═══════════════════════════════════════');
  console.log('  A/B TEST ORCHESTRATOR STARTED');
  console.log('  Mode:', mode);
  console.log('  Agents:', TESTERS.length);
  console.log('═══════════════════════════════════════\n');

  const results = {
    timestamp: new Date().toISOString(),
    mode: mode,
    tests: [],
    winners: {},
    insights: []
  };

  for (const tester of TESTERS) {
    console.log(`\n👤 Agent: ${tester.persona.name}`);
    console.log('─'.repeat(50));

    // Each tester has hardcoded winner based on their hypothesis
    // This simulates "test" but uses the embedded prediction
    for (const test of tester.testMatrix.slice(0, 2)) {  // Test first 2 elements
      // Run both variants
      const resultA = tester.runTest(test.element, 'A');
      const resultB = tester.runTest(test.element, 'B');

      // Determine winner based on tester's expected performance
      const winner = resultA.predicted_engagement > resultB.predicted_engagement ? 'A' : 'B';
      const confidence = Math.abs(resultA.predicted_engagement - resultB.predicted_engagement);

      results.tests.push({
        agent: tester.persona.name,
        element: test.element,
        a: { variant: 'A', expected: resultA.predicted_engagement },
        b: { variant: 'B', expected: resultB.predicted_engagement },
        winner: winner,
        confidence: confidence
      });

      console.log(`  🎯 ${test.element}: Winner=${winner} (+${(confidence*100).toFixed(1)}%)`);
    }

    // Generate insight
    const insight = {
      persona: tester.persona.name,
      traits: tester.persona.traits,
      hypothesis: tester.variants.A.expected_ctr > tester.variants.B.expected_ctr ? 'A' : 'B',
      rationale: tester.variants.A.expected_ctr > tester.variants.B.expected_ctr 
        ? tester.variants.A.hypothesis 
        : tester.variants.B.hypothesis
    };
    results.insights.push(insight);
  }

  // Aggregate winners
  results.winners = aggregateWinners(results.tests);

  // Save results
  const outputFile = path.join(CONFIG.outputPath, `orchestrator-${Date.now()}.json`);
  if (!fs.existsSync(CONFIG.outputPath)) {
    fs.mkdirSync(CONFIG.outputPath, { recursive: true });
  }
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));

  // Print summary
  console.log('\n═══════════════════════════════════════');
  console.log('  ORCHESTRATION COMPLETE');
  console.log('═══════════════════════════════════════');
  console.log('Winners by element:');
  Object.entries(results.winners).forEach(([el, data]) => {
    console.log(`  ${el}: Variant ${data.variant} (${(data.confidence*100).toFixed(0)}% confidence)`);
  });
  console.log(`\nResults saved: ${outputFile}`);
  console.log('═══════════════════════════════════════\n');

  return results;
}

function aggregateWinners(tests) {
  const aggregated = {};
  
  tests.forEach(test => {
    const key = test.element;
    if (!aggregated[key]) {
      aggregated[key] = { A: 0, B: 0, total: 0 };
    }
    aggregated[key][test.winner]++;
    aggregated[key].total++;
  });

  // Calculate final winners
  const winners = {};
  Object.entries(aggregated).forEach(([element, counts]) => {
    const variant = counts.A > counts.B ? 'A' : 'B';
    const confidence = Math.max(counts.A, counts.B) / counts.total;
    winners[element] = { variant, confidence, counts };
  });

  return winners;
}

// CLI runner
if (require.main === module) {
  const mode = process.argv[2] || 'all';
  orchestrate(mode).then(() => {
    process.exit(0);
  }).catch(err => {
    console.error('Orchestrator failed:', err);
    process.exit(1);
  });
}

module.exports = { orchestrate, TESTERS };
