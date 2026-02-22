#!/usr/bin/env node
// Auto-generate sitemap.xml
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://carteblanchecarriage.github.io/keebshelf';
const today = new Date().toISOString().split('T')[0];

const pages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/dashboard/', priority: '1.0', changefreq: 'daily' },
    { path: '/guide/', priority: '0.9', changefreq: 'weekly' },
    { path: '/best/', priority: '0.9', changefreq: 'weekly' },
    { path: '/beginner/', priority: '0.85', changefreq: 'monthly' },
    { path: '/blog.html', priority: '0.8', changefreq: 'monthly' },
];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

pages.forEach(page => {
    sitemap += `    <url>\n`;
    sitemap += `        <loc>${baseUrl}${page.path}</loc>\n`;
    sitemap += `        <lastmod>${today}</lastmod>\n`;
    sitemap += `        <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `        <priority>${page.priority}</priority>\n`;
    sitemap += `    </url>\n`;
});

sitemap += `</urlset>\n`;

fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), sitemap);
console.log('✅ sitemap.xml generated');