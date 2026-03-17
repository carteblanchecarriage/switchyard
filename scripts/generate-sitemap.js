#!/usr/bin/env node
/**
 * Generates public/sitemap.xml at build time.
 * Run via: node scripts/generate-sitemap.js
 * Called automatically as part of the build script.
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://switchyard.club';
const TODAY = new Date().toISOString().split('T')[0];

const urls = [
  // Core
  { loc: '/',            changefreq: 'daily',   priority: '1.0' },

  // Learn hub + guides
  { loc: '/learn',                       changefreq: 'weekly',  priority: '0.9' },
  { loc: '/learn/beginners-guide',       changefreq: 'monthly', priority: '0.85' },
  { loc: '/learn/layout-sizes',          changefreq: 'monthly', priority: '0.85' },
  { loc: '/learn/switch-guide',          changefreq: 'monthly', priority: '0.9' },
  { loc: '/learn/keycap-profiles',       changefreq: 'monthly', priority: '0.85' },
  { loc: '/learn/artisan-guide',         changefreq: 'monthly', priority: '0.8' },
  { loc: '/learn/group-buys',            changefreq: 'weekly',  priority: '0.8' },
  { loc: '/learn/glossary',              changefreq: 'monthly', priority: '0.8' },
  { loc: '/learn/faq',                   changefreq: 'monthly', priority: '0.8' },

  // Recommendation guides
  { loc: '/learn/best-budget',           changefreq: 'weekly',  priority: '0.9' },
  { loc: '/learn/best-gaming',           changefreq: 'weekly',  priority: '0.9' },
  { loc: '/learn/best-60-percent',       changefreq: 'weekly',  priority: '0.85' },
  { loc: '/learn/best-75-percent',       changefreq: 'weekly',  priority: '0.85' },
  { loc: '/learn/best-tkl',              changefreq: 'weekly',  priority: '0.85' },
  { loc: '/learn/best-programming',      changefreq: 'weekly',  priority: '0.85' },

  // Blog index
  { loc: '/learn',                       changefreq: 'weekly',  priority: '0.9' },

  // Blog posts
  { loc: '/blog/hall-effect-keyboards-2026',          changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/are-keychron-keyboards-worth-it',     changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/cherry-mx2a-vs-original',             changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/what-are-group-buys',                 changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/gasket-mount-keyboards-explained',    changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/wireless-mechanical-keyboards-2026',  changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/hot-swap-vs-soldered-keyboards',      changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/ceramic-keycaps-guide-2026',          changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/keychron-vs-epomaker',                changefreq: 'monthly', priority: '0.8' },
  { loc: '/blog/best-mechanical-keyboards-under-150', changefreq: 'monthly', priority: '0.8' },

  // Legal
  { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/terms',   changefreq: 'yearly', priority: '0.3' },
];

// Deduplicate by loc
const seen = new Set();
const deduped = urls.filter(u => {
  if (seen.has(u.loc)) return false;
  seen.add(u.loc);
  return true;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${deduped.map(u => `  <url>
    <loc>${DOMAIN}${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`✓ sitemap.xml generated (${deduped.length} URLs, lastmod ${TODAY})`);
