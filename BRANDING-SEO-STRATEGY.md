# Keebshelf Branding & SEO Strategy

## Current State Analysis

### Brand Identity
**Current Name:** Keebshelf - "Mechanical Keyboard Collection"  
**Strength:** Short, memorable, keyboard-related  
**Weakness:** Sounds like just a collection; doesn't convey expertise/value

### Visual Identity Issues
- Generic "brutalist" design (overused in tech)
- No distinctive logo or mark
- Limited color palette (just paper, ink, accent)
- Missing brand personality

### SEO Issues
- Weak meta descriptions
- No Open Graph images for social sharing
- Missing keywords in titles
- No structured data for products

---

## Recommended Brand Improvements

### 1. New Tagline Options

Better SEO + Value Proposition:

| Current | Recommended |
|---------|-------------|
| "Mechanical Keyboard Collection" | "The Curated Keyboard Marketplace" |
| | "Find Your Perfect Mechanical Keyboard" |
| | "Compare & Buy Mechanical Keyboards" |
| | "Live Prices for Mechanical Keyboards" |

**Winner:** "Find Your Perfect Mechanical Keyboard"  
- **Action-oriented** (find)
- **Personal** (your)
- **Emotional** (perfect)
- **Keyword-rich** (mechanical keyboard)

---

### 2. Elevated Visual Identity

#### Revised Color Palette

```css
/* Primary Brand Colors */
--brand-charcoal: #2d2d2d;      /* Sophisticated dark */
--brand-paper: #faf9f7;         /* Warm white */
--brand-accent: #c9a227;        /* Refined gold (was #c4a35a) */
--brand-copper: #b87333;        /* Secondary accent */

/* Semantic Colors */
--brand-success: #059669;       /* Emerald for "in stock" */
--brand-warning: #d97706;         /* Amber for "low stock" */
--brand-info: #2563eb;            /* Blue for links */

/* Gradients */
--gradient-subtle: linear-gradient(135deg, #faf9f7 0%, #f5f0eb 100%);
--gradient-hover: linear-gradient(135deg, #ffffff 0%, #faf9f7 100%);
```

#### Modern Typography Pairing

```css
/* Primary: Clean + Refined (not "newsreader"-generic) */
--font-heading: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--font-body: 'Inter', system-ui, sans-serif;
```

**Why Inter:** Modern, highly legible, professional. Better than "Newsreader" (too academic).

---

### 3. Brand Assets to Create

#### Logo/Mark Ideas

**Option 1: Icon + Wordmark**
```
⌨️ + Keebshelf
```
- Keyboard icon + custom typography
- Scales well for favicon, app icon, OG image

**Option 2: Monogram**
```
K⌨️
```
- "K" with keyboard key styling
- Modern, minimal

**Option 3: Badge-style**
```
 ┌─────────┐
 │  ⌨️ K   │
 │Keebshelf│
 └─────────┘
```
- Distinctive, badge-like
- Great for social sharing

#### Favicon Package
Need:
- `favicon.ico` (multi-resolution)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

---

## SEO Optimization Plan

### 1. Keyword Research (Target Terms)

**Primary Keywords (High Volume):**
- mechanical keyboard
- custom mechanical keyboard
- mechanical keyboard deals
- buy mechanical keyboard
- best mechanical keyboard 2025

**Long-tail Keywords (High Intent):**
- quiet mechanical keyboard for office
- mechanical keyboard programming
- 75% mechanical keyboard
- hot swappable mechanical keyboard
- cheap mechanical keyboard under $100

**Related Terms:**
- mechanical keyboard switches
- keychron vs drop
- tactile vs linear switches
- keyboard group buy

### 2. Title Tag Optimization

**Current:** "Keebshelf - Mechanical Keyboard Collection"

**Improved Titles:**

| Page | New Title |
|------|-----------|
| Home | "Keebshelf | Find Your Perfect Mechanical Keyboard" |
| | "Buy Mechanical Keyboards - Live Prices & Deals | Keebshelf" |
| Blog | "Building Your First Custom Keyboard (Real Costs 2025)" |
| Beginner | "Mechanical Keyboards 101: Beginner's Guide 2025" |
| Switches | "Mechanical Switch Guide: Linear vs Tactile vs Clicky 2025" |
| | "Best Mechanical Switches for Gaming & Typing | Keebshelf" |
| Programming | "Best Mechanical Keyboards for Programming 2025 | Keebshelf" |
| Lubing | "How to Lube Mechanical Switches: Complete Tutorial 2025" |

**Formula:** [Primary Keyword] | [Benefit/Value Prop] | [Brand]

### 3. Meta Description Optimization

**Template:**
```html
<meta name="description" content="[What the page offers]. [Key benefit]. [Call to action with keyword].">
```

**Examples:**

**Homepage:**
```
Compare 275+ mechanical keyboards from Keychron, Drop, KBDfans & more. Find live prices, in-stock alerts & deals. Buy your perfect keyboard today.
```

**Beginner Guide:**
```
New to mechanical keyboards? Learn switch types, layouts & what to buy first. Complete beginner's guide with honest recommendations & real costs.
```

**Switches Guide:**
```
Choose the right mechanical switch: linear vs tactile vs clicky explained. Compare Cherry MX, Gateron, Holy Pandas & more. 2025 buying guide.
```

**Character limit:** 150-160 max

---

### 4. Open Graph (Social Sharing)

**Missing:** OG images, tags  
**Impact:** Links shared on social look terrible

**To Add:**
```html
<!-- Facebook/Open Graph -->
<meta property="og:title" content="Find Your Perfect Mechanical Keyboard | Keebshelf">
<meta property="og:description" content="Compare 275+ keyboards from Keychron, Drop & More. Live prices & deals.">
<meta property="og:image" content="https://carteblanchecarriage.github.io/keebshelf/images/og-home.jpg">
<meta property="og:url" content="https://carteblanchecarriage.github.io/keebshelf/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Keebshelf">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Find Your Perfect Mechanical Keyboard | Keebshelf">
<meta name="twitter:description" content="Compare 275+ keyboards. Live prices & deals from top brands.">
<meta name="twitter:image" content="https://carteblanchecarriage.github.io/keebshelf/images/og-home.jpg">
```

**OG Image Specs:**
- Size: 1200x630px (1.91:1 ratio)
- Text: Clear, readable at small sizes
- Branding: Keebshelf logo + tagline

**Quick OG Image Template:**
```
┌────────────────────────┐
│  [Keyboard Image]      │
│                        │
│  Find Your Perfect     │
│  Mechanical Keyboard   │
│                        │
│  275+ Products • Live  │
│  Prices    [Keebshelf ⎋]│
└────────────────────────┘
```

---

### 5. Structured Data (JSON-LD)

**Product Schema** for each keyboard:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Keychron Q1 Pro",
  "image": "https://.../keychron-q1-pro.jpg",
  "description": "75% wireless mechanical keyboard with aluminum body",
  "brand": {
    "@type": "Brand",
    "name": "Keychron"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://keychron.com/products/keychron-q1-pro",
    "price": "199.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

**FAQ Schema** for guides (boosts rich snippets):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What's the difference between linear and tactile switches?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Linear switches move smoothly with no bump..."
    }
  }]
}
```

---

### 6. Internal Linking Strategy

**Hub & Spoke Model:**
```
Home (Hub)
├── Switches Guide
│   ├── Linear vs Tactile
│   ├── Best Switches 2025
│   └── Switch Buying Guide
├── Programming
│   ├── Best TKL Keyboards
│   └── Quiet Office Keyboards
├── Beginner
│   ├── First Build Cost
│   └── Layout Guide
└── Lubing
    └── Tools Guide
```

**Action:** Add "Related Guides" section to each page with 2-3 internal links.

---

### 7. Technical SEO

**URL Structure** (good ✅):
```
/keebshelf/
/guides/switches/
/guides/programming/
/blog.html
```

**Improve:**
- Consolidate on `/guides/` URL pattern
- Make blog posts `/blog/[slug]/`
- Add trailing slashes consistently

**Page Speed:**
- ✅ Lazy loading implemented by sub-agent
- Compress images (WebP format)
- Minify CSS (already fairly minimal)
- Add resource hints (preconnect to Unsplash)

---

## Action Plan for Sub-Agent

Add these tasks to the 15-minute improvement rotation:

### Branding Tasks
1. **Create OG Image Template** - Design 1200x630 social share image
2. **Create Favicon Package** - Generate all icon sizes
3. **Update Meta Tags** - Add OG, Twitter cards to all pages
4. **Refine Typography** - Switch to Inter for cleaner look
5. **Create Logo Mark** - Simple SVG keyboard icon

### SEO Tasks
6. **Add Structured Data** - JSON-LD product/FAQ schema
7. **Internal Links** - "Related Guides" sections
8. **Alt Text Audit** - Add descriptive alt text
9. **Compress Images** - Convert hero images to WebP
10. **Resource Hints** - Preconnect external domains

### Content Tasks
11. **Add FAQ Sections** - Rich snippet opportunities
12. **Create Comparison Tables** - "vs" content performs well
13. **Add Buying Guides** - Long-tail keyword targeting
14. **Update Titles** - SEO-optimized page titles

---

## Quick Wins (Do First)

**15 minutes each:**
1. ✅ Update homepage title to: "Find Your Perfect Mechanical Keyboard | Keebshelf"
2. ✅ Add OG tags to homepage
3. ✅ Create simple SVG logo mark
4. ✅ Optimize one blog post title (target long-tail keyword)
5. ✅ Add "Related Guides" section to one guide page

---

## Brand Voice Guidelines

**Tone:** Knowledgeable, helpful, not gatekeeping  
**Style:** Direct, concise, professional but friendly  
**Avoid:** Jargon without explanation, elitism, "gaming aesthetic"  
**Embrace:** Education, honest opinions, beginner-friendly

**Example Copy:**
```
❌ "Cherry MX Reds have a 45cN actuation force with 2mm pre-travel"
✅ "Cherry MX Reds are light and smooth—easy to press, great for rapid typing"
```

---

## Summary

**Brand:** Solid name (Keebshelf), needs better tagline + visual identity  
**SEO:** Weak at start, major opportunity with structured data + content  
**Low Hanging Fruit:** OG images, meta descriptions, internal linking, alt text  
**Long-term:** Content hub strategy, comparison tools, user reviews

**Expected Impact:** 2-3x organic search traffic in 3 months with consistent improvements.
