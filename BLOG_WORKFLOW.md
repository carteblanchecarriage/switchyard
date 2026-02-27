# Blog Content Workflow - Switchyard

## Overview
Rapid content production system for capturing search traffic and driving affiliate revenue.

## The Complete Workflow

### Step 1: Research (5-10 min)
**Goal:** Find what people are actually searching for

**Sources to check:**
1. **Reddit** - r/MechanicalKeyboards hot posts
2. **GeekHack** - Active threads and ICs (Interest Checks)
3. **Trending products** in your data.json
4. **Competitor sites** - What's getting traffic?
5. **YouTube search suggestions** - Type "best mechanical keyboard" and see autocomplete

**Key signals:**
- High engagement posts (100+ comments)
- "Should I buy..." questions
- Comparison requests ("X vs Y")
- Hot gaming topics (rapid trigger, low latency)
- New product releases (MX2A, new Keychron models)

**Example research:**
- Search: "hall effect keyboard" → See people asking "is rapid trigger cheating?"
- Search: "keychron" → See "are Keychron keyboards worth it?"
- Search: "cherry mx" → See confusion about "new Cherry vs old Cherry"

### Step 2: Topic Selection (2 min)
**Prioritize based on:**
1. **Search volume** - High intent queries
2. **Product availability** - Do you have affiliate products?
3. **Competition** - Can you rank? (Check current results)
4. **Commission potential** - High-ticket items? ($150+ keyboards)

**Good topics:**
- ✅ Specific product questions ("Is X worth it?")
- ✅ Comparisons ("X vs Y")
- ✅ "How to" / guides ("How to choose...")
- ✅ Trending gaming tech (low latency, hall effect)
- ✅ Brand deep-dives (405 Keychron products in stock)

**Bad topics:**
- ❌ Too broad ("Mechanical keyboards explained")
- ❌ No affiliate angle (pure educational)
- ❌ Saturated ("Top 10 keyboards 2026")

### Step 3: Write the Post (15-30 min)
**Target:** 1,500-2,500 words
**Structure:**
1. **Hook paragraph** - Address pain point/question
2. **TL;DR box** - Quick answer for scanners
3. **Deep dive** - Real analysis, not fluff
4. **Comparison table** - Side-by-side specs
5. **Product cards** - 3-5 keyboards with affiliate links
6. **Final verdict** - Clear recommendation
7. **Related articles** - Internal links

**Writing rules:**
- Be brutally honest (builds trust)
- Include actual complaints from Reddit/reviews
- Grade products honestly (don't recommend everything)
- Use affiliate links on EVERY product mention

### Step 4: Product Linking (Critical)

**Two types of links:**

**1. Direct vendor purchase (external, new tab):**
```tsx
<a href="https://keychron.com/products/[product]?ref=switchyard" 
   className="cta-button" 
   target="_blank" 
   rel="noopener noreferrer">
   Buy on Keychron →
</a>
```

**2. Internal search/browse (SPA navigation, same tab):**
```tsx
<a href="/?search=Cherry+MX2A" 
   onClick={(e) => { 
     e.preventDefault(); 
     window.history.pushState({}, '', '/?search=Cherry+MX2A'); 
     window.dispatchEvent(new PopStateEvent('popstate')); 
   }} 
   style={{cursor: "pointer", color: '#6366f1'}}>
   Compare prices across all vendors in our database →
</a>
```

**Affiliate link format by vendor:**
| Vendor | URL Pattern |
|--------|-------------|
| **Keychron** | `https://keychron.com/products/[product]?ref=switchyard` |
| **Epomaker** | `https://epomaker.com/products/[product]?sca_ref=10691179.cOO0hJ6jvi` |
| **Qwerkywriter** | `https://qwerkywriter.com?sca_ref=10713146.AiDf5cQpby` |
| **KBDfans** | `https://kbdfans.com/products/[product]?ref=switchyard` |
| **Dangkeebs** | Direct link (no affiliate currently) |

**Product card template:**
```tsx
<div className="product-card">
  <div className="product-card-image" style={{background: '#ddd'}}></div>
  <div className="product-card-info">
    <h4>[Product Name]</h4>
    <div className="price">$XXX</div>
    <div className="features">
      ✅ [Feature 1]<br />
      ✅ [Feature 2]<br />
      ⚠️ [Warn about issue]
    </div>
    {/* Direct purchase with affiliate */}
    <a href="[affiliate-url]" className="cta-button" target="_blank" rel="noopener noreferrer">
      Buy on [Vendor] →
    </a>
  </div>
</div>
<p><em>Alternative:</em> <a href="/?search=[product-query]" onClick={...}>Compare prices in database →</a></p>
```

### Step 5: SEO Optimization
**Every post needs:**
- [ ] Title under 60 chars with target keyword
- [ ] Meta description 150-160 chars
- [ ] H1 matches title
- [ ] H2s with related keywords
- [ ] Keyword in first 100 words
- [ ] Internal links (3-5 per post)
- [ ] Image alt tags
- [ ] Schema markup (Article)

**Keyword placement:**
- Primary keyword in: Title, H1, first paragraph, one H2
- Secondary keywords in: Other H2s, body text
- Long-tail: Natural questions in content

### Step 6: Create React Component (NEW)

**We're using React components, not static HTML.** This ensures consistent header/footer/SEO.

**File location:** `/src/pages/blog/[PostName].tsx`

**Naming convention:** PascalCase (e.g., `HallEffectPost.tsx`, `CherryMX2APost.tsx`)

**Component template:**
```tsx
import React from 'react';
import BlogPostLayout from './BlogPostLayout';

export default function [PostName]Post() {
  return (
    <BlogPostLayout
      title="[Post Title]"
      description="[150-160 char SEO description]"
      keywords="[keyword1, keyword2, keyword3]"
      date="[YYYY-MM-DD]"
      readTime="[X min]"
      category="[Guide|Review|Switches|Gaming]"
    >
      <div className="blog-content">
        {/* Content here */}
      </div>
    </BlogPostLayout>
  );
}
```

**Then UPDATE in App.tsx:**
```tsx
// Import at top
import [PostName]Post from './pages/blog/[PostName]Post';

// Add route in App() function
if (currentPath === '/blog/[slug]') {
  return <[PostName]Post />;
}
```

**Update Learn page:** `/src/pages/learn/index.tsx`
```tsx
{ path: '/blog/[slug]', title: '[Title]', desc: '[Desc]', difficulty: '[Easy|Medium]' }
```

**Directory structure:**
```
/src/pages/blog/
├── BlogPostLayout.tsx    # Shared layout component
├── BlogPost.css          # Blog styling
├── HallEffectPost.tsx
├── KeychronReviewPost.tsx
├── CherryMX2APost.tsx
└── GroupBuysPost.tsx
```

**To convert existing HTML to React:**
1. Copy content between body tags
2. Replace `class=` with `className=`
3. Add `/` to self-closing tags: `<br />`, `<img />`
4. Change `"` in JSX to `{'"'}` if needed
5. Wrap in BlogPostLayout component

### Step 7: Build & Deploy
**Commands:**
```bash
cd ~/Desktop/keyboard-tracker
npm run build                    # Compile React app
```

**Verify:**
- ✅ No TypeScript errors
- ✅ Build completes successfully
- ✅ `build/static/js/*.js` includes new blog component
- Check `build/static/js/main.*.js` contains your content

**If build fails:**
- Check for missing imports in `App.tsx`
- Check TypeScript errors: `npx tsc --noEmit`
- Ensure all referenced components exist
- Look for JSX syntax errors (br tags, etc.)

### Step 8: Commit & Push (2 min)
**Commit message format:**
```
Add blog post: [Title]

- [Word count] words on [topic]
- Target keywords: [keyword1], [keyword2]
- [X] affiliate product links
- Adds to blog index and learn page
- SEO optimized with meta tags
```

**Commands:**
```bash
git add -A
git commit -m "Add blog post: Cherry MX2A vs Original

- 2000 words on switch comparison
- Target keywords: cherry mx2a review, cherry vs mx2a, gateron vs cherry
- 4 affiliate product links
- Adds to blog index and learn page
- SEO optimized with meta tags"
git push
```

### Step 9: Deploy (Manual or Auto)
**Current deployment:** Cloudflare Pages

**Manual deploy:**
1. Log in to Cloudflare dashboard
2. Go to Pages → switchyard
3. Upload `build/` folder
4. Confirm live

**Auto-deploy (if enabled):**
- Git push triggers build
- Wait 2-5 minutes
- Verify at `https://switchyard.club/blog/[post-name].html`

**Verify live:**
- Check blog post loads
- Check affiliate links redirect correctly
- Check mobile view
- Verify Learn page shows new post

### Step 10: Track Performance
**Metrics to watch:**
- Search impressions (Google Search Console)
- Page views (analytics)
- Click-through rate on affiliate links
- Conversion rate (purchases from clicks)

**When to update:**
- New products released (update comparisons)
- Prices change
- New info becomes available
- Post ranks but not in top 3 (optimize further)

## Content Calendar Template

| Week | Post Type | Topic | Products Featured | Est. Traffic |
|------|-----------|-------|-------------------|--------------|
| 1 | Comparison | Hall Effect vs Mechanical | Wooting 60HE, Keychron C4 HE | High |
| 1 | Brand Review | Keychron Worth It? | K8, C2, Q1, alternatives | Med |
| 2 | Switch Guide | Cherry MX2A Explained | Cherry MX2A, Gateron Yellow | High |
| 2 | Recommendation | Best 60% Under $100 | 3-4 budget options | Med |
| 3 | Trend | New Release Coverage | Latest Drop/GMK | Low |
| 3 | Guide | How to Choose Switches | Switch sampler packs | Med |

## Quick Reference: Affiliate Links

### Linking Patterns

**Product page (recommended):**
```html
<a href="/?keyboard=[slug]">[Product Name]</a>
```

**Direct vendor with ref code:**
```html
<a href="https://keychron.com/products/[product]?ref=switchyard">Buy on Keychron</a>
```

**Category browse:**
```html
<a href="/?category=keyboards&vendor=Keychron">Browse Keychron</a>
```

### Product Slug Format
- Lowercase
- Hyphens for spaces
- Model numbers included

Examples:
- `keychron-k8` → `/?keyboard=keychron-k8`
- `wooting-60he` → `/?keyboard=wooting-60he`
- `corsair-k70-rgb-pro` → `/?keyboard=corsair-k70-rgb-pro`

## Post Template

See: `/blog/TEMPLATE.html` (create this)

```html
<!-- TEMPLATE -->
<!DOCTYPE html>
...
<!-- Use existing post as starting point -->
<!-- Copy from hall-effect-keyboards-2026.html -->
```

## CRITICAL LEARNINGS (Feb 27, 2026)

### 1. React SPA Navigation for Internal Links
**Old way (breaks):** Regular `<a href="/?search=X">` causes full page reload
**New way (works):** 
```tsx
<a href="/?search=X" onClick={(e) => {
  e.preventDefault();
  window.history.pushState({}, '', '/?search=X');
  window.dispatchEvent(new PopStateEvent('popstate'));
}} style={{cursor: "pointer", color: '#6366f1'}}>Link</a>
```

**Why:** React Router doesn't parse query strings. Need to:
1. Import and use pushState for navigation
2. Add URL parsing in App.tsx useEffect
3. Filter products when URL changes

### 2. URL Parsing in App.tsx Required
Add to App.tsx to make `?search=`, `?vendor=`, `?category=` work:
```tsx
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  if (searchParam) setSearchQuery(searchParam);
}, []);
```

### 3. useScrollToTop Required
Every page must call `useScrollToTop()` to start at top:
```tsx
import { useScrollToTop } from '../../hooks/useScrollToTop';
// ... in component:
useScrollToTop();
```

BlogPostLayout already has this - covers all blog posts.

### 4. Favicon Consistency
Added to usePageSEO hook to ensure favicon on ALL pages:
```tsx
useEffect(() => {
  const faviconSvg = document.querySelector('link[rel="icon"]');
  if (!faviconSvg) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = '/favicon.svg';
    document.head.appendChild(link);
  }
}, []);
```

### 5. Build File Locations Changed
- OLD: `/public/blog/*.html` for static HTML
- NEW: `/src/pages/blog/*.tsx` for React components
- Static HTML files moved to `/public/blog-static/` (backup only)

### 6. Link Types by Use Case
| Type | Example | Behavior |
|------|---------|----------|
| External vendor | `keychron.com?ref=switchyard` | `target="_blank"`, new tab |
| Internal search | `/?search=Cherry+MX2A` | `onClick` with pushState, same page |
| Direct nav | `/blog/post-name` | React Router handles it |

### 7. Product Link Strategy
Every product mention should have TWO options:
1. Direct buy (vendor site with affiliate): `Buy on Keychron →`
2. Browse/compare (your site search): `Compare prices in database →`

This captures both ready-to-buy and comparison shopping traffic.

### 8. Git Commit Message Format
Include key details for tracking:
```
Add blog post: [Title]

- [X] words on [topic]
- Keywords: [key1], [key2]
- [Y] affiliate product links
- Internal search links: [search terms]
- Direct vendor links: [vendors]
- SEO: [title], [desc], [keywords]
```

### Common Build Errors Fixed
- ❌ `<br>` → ✅ `<br />`
- ❌ `class=` → ✅ `className=`
- ❌ Missing `import React from 'react'`
- ❌ Duplicate onClick handlers (sed error)
- ❌ Missing trailing `}` in JSX expressions

## Troubleshooting

**Links not working (404 or reload)?**
- Internal links must use onClick with pushState
- Check App.tsx has query param parsing
- Verify route exists in App.tsx

**Page doesn't scroll to top?**
- Ensure component calls `useScrollToTop()`
- Check BlogPostLayout has it (covers blogs)

**Favicon missing on guides/blogs?**
- usePageSEO hook has favicon injection
- All pages using usePageSEO will show favicon

**Affiliate links not redirecting?**
- Check ref codes are correct
- Verify vendor URLs format
- Ensure `target="_blank" rel="noopener noreferrer"` set

## Tools Used

- **Write:** VS Code / Cursor (create HTML files)
- **Build:** `npm run build`
- **Commit:** `git commit` with descriptive message
- **Deploy:** Cloudflare Pages (manual upload)
- **Verify:** Browser check + web_fetch tool

---

**Document updated:** Feb 27, 2026
**Next review:** Check what content is ranking in 2 weeks
