# Content Workflow for Switchyard

## Quick Reference: Where to Put Content

### Blog Posts (Static HTML)
**Location:** `/public/blog/`
**URL:** `https://switchyard.club/blog/[post-name].html`
**Type:** Static HTML files (standalone, not React)

| File | URL | Status |
|------|-----|--------|
| `blog/index.html` | `/blog/index.html` | ✅ Live |
| `blog/hall-effect-keyboards-2026.html` | `/blog/hall-effect-keyboards-2026.html` | ✅ Live |
| `blog/are-keychron-keyboards-worth-it.html` | `/blog/are-keychron-keyboards-worth-it.html` | ✅ Live |
| `blog/cherry-mx2a-vs-original.html` | `/blog/cherry-mx2a-vs-original.html` | ✅ Live |
| `blog/what-are-group-buys.html` | `/blog/what-are-group-buys.html` | ✅ Live |

### Learn Guides (React Components)
**Location:** `/src/pages/learn/`
**URL:** `https://switchyard.club/learn/[guide-name]`
**Type:** React TSX components

| Component | URL | Status |
|-----------|-----|--------|
| `index.tsx` | `/learn` | ✅ Main hub |
| `BeginnersGuide.tsx` | `/learn/beginners-guide` | ✅ Live |
| `SwitchGuide.tsx` | `/learn/switch-guide` | ✅ Combined with /switches/ |
| `FAQ.tsx` | `/learn/faq` | ✅ Live |
| `BestGamingGuide.tsx` | `/learn/best-gaming` | ✅ Live |
| `BestBudgetGuide.tsx` | `/learn/best-budget` | ✅ Live |
| `LayoutSizesGuide.tsx` | `/learn/layout-sizes` | ✅ Live |
| `GroupBuysGuide.tsx` | `/learn/group-buys` | ✅ Live |
| `ArtisanGuide.tsx` | `/learn/artisan-guide` | ✅ Live |
| `KeycapProfilesGuide.tsx` | `/learn/keycap-profiles` | ✅ Live |
| `Best60PercentGuide.tsx` | `/learn/best-60-percent` | ✅ Live |
| `Best75PercentGuide.tsx` | `/learn/best-75-percent` | ✅ Live |
| `BestTKLGuide.tsx` | `/learn/best-tkl` | ✅ Live |
| `BestProgrammingGuide.tsx` | `/learn/best-programming` | ✅ Live |

### Static HTML Guides
**Location:** `/guides/`
**URL:** `https://switchyard.club/guides/[topic]/`
**Type:** Static HTML (separate from React app)

| Folder | URL | Status |
|--------|-----|--------|
| `guides/complete/` | `/guides/complete/` | ✅ Live |
| `guides/lubing/` | `/guides/lubing/` | ✅ Live |
| `guides/programming/` | `/guides/programming/` | ✅ Live |
| `guides/switches/` | `/guides/switches/` | ✅ Live |

## How to Add New Content

### Adding a Blog Post

1. **Write the post** as HTML in `/blog/[post-name].html`
2. **Update `/blog/index.html`** - add card to blog-grid
3. **Update `/public/blog/index.html`** - same as above
4. **Add to Learn page** - edit `/src/pages/learn/index.tsx` and add to guideCategories
5. **Run build:** `npm run build`
6. **Commit & push:** `git add -A && git commit -m "..." && git push`

### Adding a Learn Guide (React)

1. **Create component** in `/src/pages/learn/[GuideName].tsx`
2. **Update `index.tsx`** - add to appropriate guideCategories
3. **Update App.tsx** - add route import and Route component
4. **Run build:** `npm run build`
5. **Commit & push**

### Adding a Static Guide

1. **Create folder** in `/guides/[topic-name]/`
2. **Add index.html** with guide content
3. **Update navigation** - add link in relevant places
4. **Copy to public:** `cp -r guides/[topic-name]/ public/guides/`
5. **Commit & push**

## Content Pipeline Status

### Published (Live on Site)
- ✅ Hall Effect Keyboards Explained
- ✅ Are Keychron Keyboards Worth It?
- ✅ Cherry MX2A vs Original
- ✅ All existing learn guides

### In Build (Ready to Deploy)
- ✅ Blog posts in `build/blog/`
- ✅ Learn page with blog integration

### Deployment Status
- Build: ✅ Compiled successfully
- Blog files: ✅ In `build/blog/`
- Learn component: ✅ Built with blog links
- Next step: Deploy to Cloudflare Pages

## Remember

**Static vs React:**
- Blog = Static HTML (in `/public/blog/` → copies to `/build/blog/`)
- Learn = React components (in `/src/` → compiles to `/build/`)

**To see Learn page changes:** MUST run `npm run build` and deploy
**To see Blog changes:** Files are copied as-is, just needs deploy

## Affiliate Integration

Blog posts should include:
- 3-5 product cards with affiliate links
- Links to `/` (product search) pre-filtered by keyword
- "Related Products" sections
- Clear CTAs on comparison tables

## SEO Checklist

Every new post needs:
- [ ] Unique title tag (under 60 chars)
- [ ] Meta description (150-160 chars)
- [ ] OG tags for social sharing
- [ ] Canonical URL
- [ ] Keywords in H1, H2s, and first paragraph
- [ ] Internal links to other guides/products
- [ ] Sitemap update (for major pages)
