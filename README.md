# Switchyard

Mechanical keyboard affiliate tracker and guide site. Aggregates in-stock products from major vendors (Keychron, Epomaker, Drop, KBDfans, NovelKeys, and more) with live inventory updated every 2 hours via a GitHub Actions scraper.

## Stack

- React 19 + TypeScript
- React Router v6
- Deployed on Vercel
- Product data scraped and committed to `public/data.json` on a cron schedule

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in the browser.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |

## Data Pipeline

The scraper runs on a 2-hour GitHub Actions cron (`/.github/workflows/scraper.yml`). It writes fresh product data to `public/data.json` and commits it, which triggers a Vercel redeploy.

## Site Structure

- `/` — Product browse grid (search, filter by category, size sort, wizard)
- `/learn/*` — Buying guides and educational content
- `/blog/*` — Blog posts
