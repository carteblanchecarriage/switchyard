# Keebshelf A/B Testing Agents

Multi-agent testing system with hardcoded personas and variant predictions.

## Agents

### 1. Novice Tester (`tester-novice.js`)
- **Profile**: First-time buyer, overwhelmed
- **Key insight**: Plain English > jargon
- **Expected winner**: Variant B (simplified messaging)

### 2. Gamer Tester (`tester-gamer.js`)
- **Profile**: Competitive player, latency-focused
- **Key insight**: Technical specs > hype
- **Expected winner**: Variant A (performance data)

### 3. Enthusiast Tester (`tester-enthusiast.js`)
- **Profile**: Multiple keebs, follows GBs
- **Key insight**: Curated > comprehensive
- **Expected winner**: Variant B (signal over noise)

### 4. Writer Tester (`tester-writer.js`)
- **Profile**: Heavy typist, aesthetic-driven
- **Key insight**: Visuals > ergonomics
- **Expected winner**: Variant B (lifestyle focused)

## Usage

```bash
# Run all agents
node agents/orchestrator.js all

# Run specific agent
node agents/orchestrator.js novice

# Output
ab-test-logs/orchestrator-{timestamp}.json
```

## Output Format

```json
{
  "timestamp": "2025-02-21...",
  "tests": [
    {
      "agent": "Novice Tester",
      "element": "home_hero_1",
      "winner": "B",
      "confidence": 0.94
    }
  ],
  "winners": {
    "home_hero_1": { "variant": "B", "confidence": 0.94 }
  },
  "insights": [...]
}
```

## Hardcoded vs Real

These are **simulation agents** — they predict outcomes based on persona research rather than actual user data. When you have real traffic, swap `predicted_engagement` for actual analytics.

## Adding New Agents

1. Copy `tester-template.js` (if exists) or any existing tester
2. Update PERSONA with traits
3. Define variants A and B
4. Write test matrix (what elements to test)
5. Export module
6. Add to `orchestrator.js` TESTERS array
