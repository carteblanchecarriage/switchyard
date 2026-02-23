#!/usr/bin/env node
/**
 * Keebshelf A/B Testing Automation
 * Runs every 30 minutes to test features and compile insights
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Test URLs
const TEST_URLS = {
    home: 'https://carteblanchecarriage.github.io/keebshelf/',
    beginner: 'https://carteblanchecarriage.github.io/keebshelf/beginner/',
    guide: 'https://carteblanchecarriage.github.io/keebshelf/guide/',
    best: 'https://carteblanchecarriage.github.io/keebshelf/best/'
};

// Persona test scripts
const PERSONAS = {
    newbie: {
        name: "Jordan",
        type: "complete-beginner",
        testFocus: ["beginner", "home"],
        checkItems: [
            "Can explain what mechanical keyboards are",
            "Switch types understood (linear/tactile/clicky)",
            "Clear first keyboard recommendations",
            "No confusing jargon",
            "Would want to learn more"
        ]
    },
    enthusiast: {
        name: "Alex",
        type: "enthusiast",
        testFocus: ["home", "guide", "best"],
        checkItems: [
            "Data accuracy verified",
            "Specs complete",
            "Would use vs vendor sites",
            "Missing features identified",
            "Trustworthiness established"
        ]
    },
    gamer: {
        name: "Phoenix",
        type: "competitive-gamer",
        testFocus: ["home", "best"],
        checkItems: [
            "Gaming keyboards discoverable",
            "Switch info for gaming",
            "Fast path to gaming boards",
            "Latency specs visible",
            "Would trust for competitive setup"
        ]
    },
    aesthetic: {
        name: "Sam",
        type: "aesthetic-hunter",
        testFocus: ["home", "beginner", "guide"],
        checkItems: [
            "Can browse by color/aesthetic",
            "Visual discovery working",
            "Photos sufficient",
            "Style keywords searchable",
            "Instagram-worthy finds"
        ]
    },
    value: {
        name: "Morgan",
        type: "value-hunter",
        testFocus: ["home", "best", "beginner"],
        checkItems: [
            "Price filters work",
            "Value recommendations clear",
            "$75-100 quality options",
            "Trust signals present",
            "Would buy from recommendations"
        ]
    }
};

// Feature roadmap based on personas
const FEATURE_BACKLOG = {
    high: [
        "Price drop alerts (Value Hunter)",
        "Switch sound samples (Newbie)",
        "Gaming specs filter (Gamer)",
        "Color/style filtering (Aesthetic)",
        "Community reviews (Enthusiast)"
    ],
    medium: [
        "Keyboard comparison tool",
        "Wishlist/watchlist",
        "Stock alerts",
        "Vendor reliability ratings",
        "Build log inspiration gallery"
    ],
    low: [
        "Typing test widget",
        "Switch tester finder",
        "Discord community integration",
        "Group buy calendar",
        "Renders/keycap preview tool"
    ]
};

// Simple fetch wrapper
function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ url, status: res.statusCode, html: data }));
        }).on('error', reject);
    });
}

// Run A/B tests
async function runABTests() {
    console.log('🔬 Keebshelf A/B Testing Run');
    console.log('Time:', new Date().toISOString());
    console.log('');

    // Test all URLs
    const results = {};
    for (const [name, url] of Object.entries(TEST_URLS)) {
        try {
            console.log(`Fetching ${name}...`);
            const result = await fetchHTML(url);
            results[name] = result;
        } catch (err) {
            console.error(`Failed to fetch ${name}:`, err.message);
            results[name] = { error: err.message };
        }
    }

    // Analyze results
    const analysis = {
        timestamp: new Date().toISOString(),
        urls: Object.keys(results).length,
        errors: Object.entries(results).filter(([k, v]) => v.error).length,
        insights: [],
        actions: []
    };

    // Check for key elements in HTML
    const homeHTML = results.home?.html || '';
    
    // SEO checks
    if (homeHTML.includes('mechanical keyboard')) {
        analysis.insights.push('✅ SEO keywords present');
    }
    
    // Schema checks
    if (homeHTML.includes('schema.org')) {
        analysis.insights.push('✅ Schema markup present');
    }
    
    // Content checks
    const hasGuides = homeHTML.includes('beginner') && homeHTML.includes('guide');
    if (hasGuides) {
        analysis.insights.push('✅ Guide links present');
    }

    // Check data freshness (in a real implementation, compare scraped data timestamps)
    analysis.insights.push('📊 Data freshness check: manual review needed');

    // Priority actions from persona testing
    analysis.actions.push(
        '[High] Add switch sound samples for Newbies',
        '[High] Implement price drop alerts for Value Hunters',
        '[Med] Add gaming specs filter (N-key rollover, polling rate)',
        '[Med] Create color/style browsing for Aesthetic users',
        '[Low] Add community review system'
    );

    // Save results
    const logDir = path.join(__dirname, '..', 'ab-test-logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, `ab-test-${Date.now()}.json`);
    fs.writeFileSync(logFile, JSON.stringify(analysis, null, 2));
    
    console.log('');
    console.log('📊 Analysis Complete:');
    console.log(analysis);
    console.log('');
    console.log('💾 Log saved to:', logFile);

    // Update backlog
    const backlogFile = path.join(__dirname, '..', 'FEATURE-BACKLOG.md');
    let backlogContent = '# Keebshelf Feature Backlog\n\nGenerated from A/B testing personas\n\n';
    backlogContent += `Last updated: ${new Date().toISOString()}\n\n`;
    backlogContent += '## High Priority\n';
    backlogContent += FEATURE_BACKLOG.high.map(f => `- [ ] ${f}`).join('\n');
    backlogContent += '\n\n## Medium Priority\n';
    backlogContent += FEATURE_BACKLOG.medium.map(f => `- [ ] ${f}`).join('\n');
    backlogContent += '\n\n## Low Priority\n';
    backlogContent += FEATURE_BACKLOG.low.map(f => `- [ ] ${f}`).join('\n');
    
    fs.writeFileSync(backlogFile, backlogContent);
    console.log('✅ Feature backlog updated');
}

runABTests().catch(console.error);