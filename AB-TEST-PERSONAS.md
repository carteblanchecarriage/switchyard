# Keebshelf A/B Testing - User Personas

## Overview
Multi-persona testing framework for Keebshelf feature validation and UX optimization.

## User Personas

### Persona 1: The Complete Newbie "Jordan"
- **Background:** Just heard about mechanical keyboards from a friend
- **Knowledge Level:** Zero. Doesn't know switches exist.
- **Goals:** Understand what the fuss is about, buy something nice without wasting money
- **Pain Points:** Jargon, too many options, fear of buying wrong thing
- **Behaviors:** Skims, looks for "best" lists, wants simple recommendations
- **Test Focus:** Beginner page clarity, CTA effectiveness, confusion points

### Persona 2: The Enthusiast "Alex"
- **Background:** Has 3+ custom boards, browses r/MK daily
- **Knowledge Level:** High. Knows switch manufacturers, gasket mounts, plate materials
- **Goals:** Find rare drops, compare prices across vendors, discover new stuff
- **Pain Points:** Inaccurate data, missing specs, stale information
- **Test Focus:** Data accuracy, advanced filtering, trustworthiness

### Persona 3: The Competitive Gamer "Phoenix"
- **Background:** FPS esports player, values performance over everything
- **Knowledge Level:** Medium. Knows polling rates, N-key rollover, latency
- **Goals:** Lowest latency, most reliable, competitive advantage
- **Pain Points:** Can't find gaming-specific info, RGB marketing fluff, lack of hard specs
- **Test Focus:** Gaming filters, performance specs, conversion path

### Persona 4: The Aesthetic Hunter "Sam"
- **Background:** Designer/architect, cares about desk setup
- **Knowledge Level:** Low-Medium. Knows colorways and aesthetics, not electronics
- **Goals:** Beautiful board that matches their vibe
- **Pain Points:** Can't browse by color/style, insufficient photos
- **Test Focus:** Visual discovery, aesthetic filters, inspiration

### Persona 5: The Value Hunter "Morgan"
- **Background:** Student/professional on a budget
- **Knowledge Level:** Low. Just wants something better than membrane
- **Goals:** Best bang for buck, durability, will it last?
- **Pain Points:** Overwhelmed by $400+ boards, wants quality at $75-100
- **Test Focus:** Price filters, value recommendations, trust signals

## A/B Test Framework

### Test 1: Hero Section Variants
- **Variant A:** Current hero with search + description
- **Variant B:** "Just browsing" vs "I know what I want" split
- **Variant C:** Category cards (Switches, Keyboards, Keycaps)
- **Success Metric:** Click-through to keyboard listings

### Test 2: Navigation Structure
- **Variant A:** Current footer links
- **Variant B:** Top nav with dropdowns
- **Variant C:** Wizard-style "Find your perfect board"
- **Success Metric:** Time to first keyboard view

### Test 3: Product Card Design
- **Variant A:** Current minimal cards
- **Variant B:** Spec-forward with badges
- **Variant C:** Price-priority with savings callout
- **Success Metric:** Click-through rate on cards

### Test 4: Beginner Page CTA
- **Variant A:** "Browse Current Deals" button
- **Variant B:** Video embed explaining keyboards
- **Variant C:** Interactive switch tester widget
- **Success Metric:** Beginner → Dashboard conversion

## Feedback Collection

Each persona should document:
1. First impression (0-5 seconds)
2. Where they got stuck
3. What they would do next
4. Missing features discovered
5. Comparison to competitors

## Implementation

Run these tests via:
```bash
# Schedule 30-min cron for continuous feedback
openclaw sessions:crons:create --name "Keebshelf-AB-Testing" \
  --task "Run A/B tests with all 5 personas and compile recommendations" \
  --interval "*/30 * * * *"
```