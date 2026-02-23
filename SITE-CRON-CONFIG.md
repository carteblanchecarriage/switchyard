# Site Production Cron Schedule

**File:** `/home/klondike/Desktop/keyboard-tracker/.openclaw/cron-site-production.json`

This cron focuses on getting Switchyard production-ready instead of wizard tasks.

---

## Schedule

```json
{
  "jobs": [
    {
      "name": "site-check-data-loading",
      "schedule": "0 */2 * * *",
      "description": "Check if products load correctly, debug if not"
    },
    {
      "name": "site-mobile-test",
      "schedule": "0 */3 * * *", 
      "description": "Test mobile responsiveness, document issues"
    },
    {
      "name": "site-affiliate-tracking",
      "schedule": "0 10 * * *",
      "description": "Track affiliate program applications and update links"
    },
    {
      "name": "site-uptime-verify",
      "schedule": "*/30 * * * *",
      "description": "Verify site is up, check GitHub Pages status"
    },
    {
      "name": "site-content-improvements",
      "schedule": "0 14 * * *",
      "description": "Work on SEO, meta tags, performance"
    },
    {
      "name": "site-analytics-review",
      "schedule": "0 9 * * 1",
      "description": "Weekly analytics review and reporting"
    }
  ]
}
```

---

## Task Rotations

### Day 1 (Monday) - Data & Deploy
**Tasks:**
- Debug data loading issues
- Test product display
- Fix any broken images
- Document findings

### Day 2 (Tuesday) - Cloudflare Migration  
**Tasks:**
- (If account ready) Set up Cloudflare Pages
- Test deploy pipeline
- Configure custom domain
- Document migration steps

### Day 3 (Wednesday) - Affiliates
**Tasks:**
- Apply to 1-2 affiliate programs
- Update product links
- Add UTM tracking
- Track applications

### Day 4 (Thursday) - Mobile & UX
**Tasks:**
- Test on mobile devices
- Fix wizard mobile issues
- Fix hamburger menu
- Document UX problems

### Day 5 (Friday) - Performance & SEO
**Tasks:**
- Run Lighthouse audit
- Compress images
- Add meta tags  
- Optimize load times

### Weekend - Analysis
- Review week's progress
- Update task priorities
- Document blockers

---

## Priority Order

1. **P0 - Critical:** Data loading, Cloudflare migration
2. **P1 - High:** Affiliates, mobile, uptime monitoring
3. **P2 - Medium:** SEO, analytics, performance
4. **P3 - Low:** Content marketing, user features

---

## Success Metrics

| Task | Success Criteria | Current | Target |
|------|------------------|---------|--------|
| Data Loading | 10/10 loads succeed | 6/10 | 10/10 |
| Deploy Speed | Time from push to live | 10 min | 30 sec |
| Mobile Score | Lighthouse mobile score | ? | 80+ |
| Uptime | Site availability | ? | 99.9% |
| Products | Total visible products | 381 | 400+ |
| Affiliates | Programs approved | 0 | 3+ |

---

## Blockers Log

| Date | Blocker | Owner | Resolution |
|------|---------|-------|------------|
| 2026-02-22 | Cloudflare account needed | Alex | Waiting |
| 2026-02-22 | Data intermittent on GitHub Pages | Dev | Debugging |

---

**Note:** Replace wizard-specific crons with this production-focused schedule.
