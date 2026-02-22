# Keebshelf Launch Marketing Plan

**Target Date:** TBD (Soft launch ready NOW)  
**Primary Channels:** Reddit, Discord, Twitter/X, Hacker News, Product Hunt  
**Goal:** 1000 users in Month 1

---

## Target Audience

### Primary: Keyboard Enthusiasts (80%)
**Who:** People actively building/ buying mechanical keyboards  
**Pain Points:**
- Missing group buy windows
- Checking 5+ sites for stock
- Not knowing what's currently available
- No price comparison across vendors

**Where They Hang Out:**
- r/MechanicalKeyboards (850k+ members)
- r/CustomKeyboards (150k+ members)
- Geekhack forums
- Discord: Keychron, KBDfans, NovelKeys servers
- YouTube: Hipyo Tech, BadSeed Tech, Glarses

### Secondary: First-Time Buyers (20%)
**Who:** People who want their first mechanical keyboard  
**Pain Points:**
- Overwhelmed by options
- Don't know vendors exist
- Confused by switches/layouts
- Don't know what's in stock

---

## Launch Strategy

### Phase 1: Soft Launch (Week 1) - THIS WEEK
**Goal:** Get feedback from friends, fix critical bugs

**Actions:**
1. Share personal network (done ✓)
2. Post to small Discord servers
3. Get 5-10 real user feedback responses
4. Fix any breaking issues

**Expected Traffic:** 50-100 visitors

### Phase 2: Community Launch (Week 2-3)
**Goal:** Reach keyboard enthusiasts

## CHANNEL 1: Reddit

### r/MechanicalKeyboards Post
**When to Post:** Tuesday 11AM EST (high engagement time)
**Title:** [GB] Keebshelf – Live group buy tracker for Keychron, Drop, KBDfans, NovelKeys

**Body:**
```
I built Keebshelf because I kept missing group buy windows and got tired of checking 5+ vendor sites every day.

**What it does:**
- Tracks 276 keyboards, cases, switches, keycaps
- Auto-updates every 2 hours (no stale listings)
- Filters by vendor, category, price
- Hides sold-out items by default
- Mobile-friendly, no signup

**Vendors currently tracked:**
Keychron, Drop, KBDfans, NovelKeys, Epomaker, plus Geekhack interest checks

**Tech:** Static site, Node.js scraper, GitHub Pages. Data updates via cron.

**Affiliate disclosure:** Links are affiliate where available. No ads, no tracking.

[https://carteblanchecarriage.github.io/keebshelf/dashboard/](https://carteblanchecarriage.github.io/keebshelf/dashboard/)

Lmk if: vendors I'm missing, broken links, features you'd want (email alerts?)

Happy building 🛠️
```

**Follow-up Comments:**
- Reply to questions within 1 hour
- Update post with new vendors if requested
- If positive reception: "Should I add email alerts for specific boards?"

---

### r/CustomKeyboards Post
**When:** Thursday 11AM EST
**Title:** [Interest Check] Keebshelf – group buy dashboard (Keychron, Drop, KBDfans, etc.)

**Body:** (Same as above, slightly more DIY focused)

---

## CHANNEL 2: Discord

### Servers to Post In:
1. **Keychron Official** - #general (ask permission first)
2. **KeebTalk** - #show-and-tell
3. **KBDfans** - #general (ask permission)
4. **MechKeys** - #projects
5. **Smaller servers** (50-500 members)

### Message Template:
```
Hey all – made something that might be useful for tracking group buys.

Keebshelf aggregates live keyboard inventory from Keychron, Drop, KBDfans, NovelKeys, and Geekhack interest checks.

Features:
- 276 items tracked, auto-updating every 2 hours
- Filter by vendor, sort by price
- Sold-out items hidden by default
- Mobile-friendly, no signup

https://carteblanchecarriage.github.io/keebshelf/dashboard/

Has affiliate links (full disclosure). Built it because I needed it.

Lmk what vendors I should add or if anything looks broken!
```

**Note:** Always check server rules. Some ban self-promo. Others require approval.

---

## CHANNEL 3: Twitter/X

### Launch Thread (5 Tweets)

**Tweet 1:**
I got tired of checking 5 different sites to find mechanical keyboard group buys.

So I built a dashboard that tracks Keychron, Drop, KBDfans, NovelKeys, and Geekhack interest checks in one place.

276 keyboards. Auto-updates every 2 hours.

Thread 🧵

[Image: Screenshot of dashboard]

---

**Tweet 2:**
The problem: Group buys get announced on Discord, interest checks live in Google Docs, and in-stock alerts are vendor-specific.

You miss stuff. Or you have 20 tabs open comparing a Tofu60 to a Keychron Q1.

Keebshelf just shows what's actually available right now.

---

**Tweet 3:**
Features I built because I needed them:

✓ Filter by vendor (just show me KBDfans)
✓ Price sorting
✓ Sold-out items hidden
✓ Mobile-friendly
✓ No signup required

https://carteblanchecarriage.github.io/keebshelf/dashboard/

---

**Tweet 4:**
Tech details: Static site, Node.js scraper on homelab, pulls via APIs + web scraping.

Yes there are affiliate links. Full transparency: if you buy through one, I get coffee money.

Code is open. Data is live.

---

**Tweet 5:**
What's missing?

- Kono.store (API being weird)
- More Geekhack interest checks
- Email alerts (coming if people want it)

If you have vendor suggestions or find broken links, reply here.

Built this for myself first, but happy to make it useful for others.

RTs appreciated 🤙

---

## CHANNEL 4: Hacker News (Show HN)

**When:** Tuesday 10AM PST (best for Show HN)
**Title:** Show HN: Keebshelf – A group buy tracker for mechanical keyboards

**Body:**
```
I got tired of missing keyboard group buys because I forgot which Discord server announced them. Or finding out a board I wanted dropped yesterday and sold out.

Built Keebshelf: a dashboard aggregating live inventory from Keychron, Drop, KBDfans, NovelKeys, and Geekhack interest checks.

**Features:**
- 276 items tracked
- Auto-updates every 2 hours
- Filter by vendor, sort by price
- Sold-out items hidden by default
- Mobile-friendly, static site

**Stack:**
- Node.js scraper (Puppeteer)
- Vanilla JS frontend
- GitHub Pages hosting
- Data served as static JSON

**Business:**
- Affiliate links where available (full disclosure)
- No ads, no signup required

Would love feedback on what other features would be useful. Plan to add email alerts for specific boards if there's interest.

URL: https://carteblanchecarriage.github.io/keebshelf/dashboard/
```

**Expected Response:** Mixed (HN loves productivity tools, but mechanical keyboards is niche. Might get 50 upvotes if lucky.)

**Respond to:**
- Technical questions about scraping
- Questions about sustainability (affiliate revenue enough?)
- Feature suggestions (definitely respond to these)

---

## CHANNEL 5: Product Hunt

**Best Day:** Tuesday
**Time:** 12AM PST (launch at midnight for max visibility)

**Name:** Keebshelf
**Tagline:** One dashboard to track every mechanical keyboard group buy
**Category:** Productivity / Shopping

**Description:**
```
Stop checking five sites to find your next build. Keebshelf aggregates live group buys and in-stock keyboards from Keychron, Drop, KBDfans, NovelKeys, and Geekhack.

Features:
• 276+ keyboards, cases, switches, keycaps tracked
• Auto-updating every 2 hours (no stale listings)
• Filter by vendor, category, or price
• Sort by price (low/high), newest, name
• Sold-out items auto-hidden
• Mobile-friendly, no signup required

I built this because I kept missing group buys announced on Discord and buried in vendor newsletters. Now it's one bookmark.

Tech: Static site, Node.js scraper, GitHub Pages
Notes: Affiliate links included. Data is open.
```

**Gallery Images Need:**
1. Dashboard screenshot (hero)
2. Mobile view screenshot
3. Filter demo GIF
4. Product detail view
5. Maker comment/intro

**First Comment (as maker):**
```
Hey Product Hunt! 👋

Built Keebshelf because I hate missing group buy windows. I'm a mechanical keyboard hobbyist and was checking 5+ vendor sites daily. Got annoying.

Current stats:
- 276 items tracked
- Updates every 2 hours
- 6 vendors + Geekhack ICs

What I'd love feedback on:
- What vendors should I add?
- Is anyone interested in email alerts?
- Any broken links I missed?

Happy to answer questions about the scraping setup or why mechanical keyboards are an expensive hobby 🙃

- Alex (solo dev, keyboard nerd)
```

**Expected Result:** 50-100 upvotes (mechanical keyboards are niche on PH)

---

## Launch Week Schedule

### Week 1 Goals: Validation
| Day | Platform | Action | Expected |
|-----|----------|--------|----------|
| Mon | Personal | Share with 3 friends, get feedback | 10 visits |
| Tue | Reddits | Post r/MechanicalKeyboards | 200 visits |
| Wed | Discord | Post to 3 small servers | 50 visits |
| Thu | Twitter | Launch thread | 100 visits |
| Fri | Hacker News | Show HN | 50 visits |

### Week 2 Goals: Growth
| Day | Platform | Action | Expected |
|-----|----------|--------|----------|
| Mon | Product Hunt | Launch | 150 visits |
| Tue | Reddit | Post r/CustomKeyboards | 100 visits |
| Wed | Discord | More server posts | 50 visits |
| Thu | Twitter | "Week in review" thread | 80 visits |
| Fri | Blog | Publish "Cost of first build" post | 50 visits |

**Week 1 Total:** ~460 visitors  
**Week 2 Total:** ~430 visitors  
**Month 1 Target:** 1000 visitors

---

## Content Calendar (Month 1)

### Week 1: Launch
- [ ] Launch posts on all channels
- [ ] Monitor feedback
- [ ] Fix critical issues

### Week 2: Engagement
- [ ] Reply to all comments
- [ ] Add requested vendors if possible
- [ ] Tweet about new features

### Week 3: Content
- [ ] Blog post: "My Mechanical Keyboard Obsession"
- [ ] Reddit: Comment helpful links
- [ ] Twitter: Daily deals highlights

### Week 4: Iterate
- [ ] Add most requested feature
- [ ] "Month 1 recap" thread
- [ ] Start planning v2 features

---

## Success Metrics

### Track Weekly:
- Website visitors (Plausible Analytics)
- Referrers (which channels work)
- Most viewed vendors/products
- Conversion rate (affiliate clicks)
- Email signups (if added)

### Targets:
- Week 1: 500 visitors
- Week 4: 1000 total visitors
- Month 2: 5000 visitors (from SEO)
- Month 6: 10,000 visitors/month

---

## Follow-up Content Ideas

### Twitter/X:
- Daily "Deal of the Day"
- Vendor spotlight threads
- "Building my first keyboard" journey
- Switch comparison content

### Reddit:
- Weekly "what's in stock" summary
- Comment on help threads: "have you seen [product] on Keebshelf?"
- r/bapcsalescanada style deals posts

### Blog:
- "My First Custom Keyboard: Hidden Costs"
- "Linear vs Tactile vs Clicky: Switches Explained"
- "Best Keyboards Under $100"
- "Group Buy Survival Guide"

---

## Risk Mitigation

### If Reddit Post Gets Removed:
- Don't repost immediately
- Adjust title to be less promotional
- Post as "Feedback wanted" instead

### If HN Response is Negative:
- Focus on technical implementation details
- Be humble about being a weekend project
- Don't defend affiliate links, just be transparent

### If Affiliate Clicks are Low:
- Not the main metric (user value matters more)
- Consider Patreon or voluntary donations
- Focus on user acquisition first

---

## What's Next After Launch Month?

1. **SEO Content:** Write 2-3 blog posts targeting long-tail keywords
2. **Email Alerts:** Most requested feature, implement if traction
3. **User Feedback:** Survey frequent users
4. **Vendor Outreach:** Contact vendors for official partnerships
5. **Discord Bot:** Automated group buy alerts
6. **Mobile App:** If web gets traction

---

**Decision Needed:**
- When do you want to launch?
- Do you want me to schedule all these posts?
- Should I set up Plausible Analytics first?
