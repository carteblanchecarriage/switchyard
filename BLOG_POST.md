# The Hunt for Group Buys: Why I Built a Single Dashboard to Track Every Mechanical Keyboard Drop

*Posted in r/MechanicalKeyboards*

---

I spent 20 minutes yesterday trying to find if that Keychron Q1 Pro was still available. Checked Keychron's site. Checked Drop. Checked KBDfans. Checked my email for a group buy I swore I joined three months ago. Found nothing, bought nothing, and now I have a browser tab graveyard of keyboard vendors.

This happens every month. Group buys disappear into Discord announcements. Interest checks live as Google Docs with expiration dates. And don't get me started on trying to remember which vendor stocks which switch.

So I built something stupid simple: **One page that aggregates every group buy and interest check from the major vendors.**

## What It Does

[Keebshelf](https://carteblanchecarriage.github.io/keebshelf/dashboard/) pulls live data from:

- **Keychron** (Q-series, K-series, the whole lineup)
- **Drop** (CTRL, ALT, SHIFT, Holy Pandas)
- **KBDfans** (Tofu boards, switches, group buy cases)
- **NovelKeys** (their exclusives, collaborations)
- **Geekhack interest checks** (the stuff that's coming)

Currently tracking **276 keyboards, cases, switches, and keycap sets** that are actually available right now. Not "email me when it's back." Available.

## The Filters That Actually Matter

I added search, category filters (keyboards/cases/switches/keycaps), and sorting by:

- **Price** (low to high for the budget builds)
- **Vendor** (just want to see everything from KBDfans? Done)
- **Newest** (fresh drops first)

And it filters out sold-out stuff automatically. No clickbait.

## Why I Built This For Myself First

I'm tired of:
1. Missing group buy windows because I forgot which Discord server announced it
2. Finding out a board I wanted dropped... yesterday
3. Opening 8 tabs to compare prices on entry-level customs

This is just a better bookmark. Nothing fancy.

## The Data

It scrapes every few hours. If something sells out on Keychron, it disappears from the list within a day. If NovelKeys drops something new, it shows up. No manual updates needed.

And yeah, the affiliate links are there. If you buy through a link, I might get a coffee. Full disclosure.

## Try It

**[keebshelf.github.io](https://carteblanchecarriage.github.io/keebshelf/dashboard/)**

It's free, no signup, works on mobile, and loads fast because it's just a static site pulling JSON.

---

## FAQ

**Q: Is this only for pre-orders/group buys?**  
A: No, it shows in-stock stuff too. Filter by "active" status to see what's shipping now.

**Q: What about vendors you don't support?**  
A: Working on Kono.store (their API structure changed recently). If there's a vendor you want added, comment below.

**Q: I found a dead link.**  
A: Comment here or DM me. The scraper filters most unavailable items, but things slip through.

**Q: This looks like a blog spam site.**  
A: It's literally one HTML file with vanilla JS. No tracking, no ads, just data.

---

**What's missing?** I'd genuinely love feedback on this. I built it because I need it, but I want to know what other keyboard people actually want in a group buy tracker.

Also: if you know of any current interest checks I should watch, drop them below. I manually curate Geekhack threads for now but automation is coming.

---

*Edit: Fixed the price sorting. Should now properly handle "$11/pack" and "$199" formats. Let me know if anything looks janky on mobile.*