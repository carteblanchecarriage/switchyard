const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');
const PUBLIC_DATA_FILE = path.join(__dirname, '..', 'public', 'data.json');

// Affiliate tracking codes
const AFFILIATE_CODES = {
  'Epomaker': { param: 'sca_ref', value: '10691179.cOO0hJ6jvi' },
  'KBDfans': { param: 'ref', value: 'keyboardtracker' },
  'NovelKeys': { param: 'ref', value: 'keyboardtracker' },
  'Keychron': { param: 'ref', value: 'switchyard' },
  'Drop': { param: 'referer', value: 'keyboardtracker' }
};

// Keywords that indicate a product is a PART, not a complete keyboard
const PART_KEYWORDS = [
  'pcb', 'plate', 'weight', 'top', 'bottom', 'mid', 'hardware pack',
  'daughterboard', 'jst cable', 'poron', 'foam', 'gasket', 'feet', 'bump ons',
  'screws', 'standoffs', 'o-ring'
];

// Group buy indicators in product names
const GB_INDICATORS = [
  'group buy', 'groupbuy', 'gb ', 'pre-order', 'preorder', 'kickstarter',
  'indiegogo', 'crowdfunding'
];

// Interest check indicators
const IC_INDICATORS = [
  'interest check', '[ic]', 'ic ', 'prototype', 'coming soon', 'in development'
];

// Sold out indicators
const SOLD_OUT_INDICATORS = [
  'sold out', 'out of stock', 'unavailable', 'discontinued', 'ended'
];

function loadData() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!data.items && data.allProducts) {
      data.items = data.allProducts;
    }
    if (!data.items) data.items = [];
    if (!data.allProducts) data.allProducts = [];
    if (!data.groupBuys) data.groupBuys = [];
    if (!data.interestChecks) data.interestChecks = [];
    if (!data.inStock) data.inStock = [];
    return data;
  } catch {
    return { items: [], allProducts: [], groupBuys: [], interestChecks: [], inStock: [], metadata: {} };
  }
}

function saveData(data) {
  data.metadata.updatedAt = new Date().toISOString();
  data.metadata.scrapedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  // Also save to public for GitHub Pages
  try {
    fs.writeFileSync(PUBLIC_DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('   ⚠️ Could not write to public/data.json');
  }
}

function addAffiliateLink(url, vendor) {
  if (!url || url.includes('?')) return url;
  const aff = AFFILIATE_CODES[vendor];
  if (aff) return `${url}?${aff.param}=${aff.value}`;
  return url;
}

// Check if product is a part/assembly component, not a complete keyboard
function isPart(name, description, vendor) {
  const text = (name + ' ' + (description || '')).toLowerCase();
  
  // Check against part keywords
  for (const keyword of PART_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      return true;
    }
  }
  
  // Novel Keys specific: Keycult parts
  if (vendor === 'NovelKeys' && text.includes('keycult')) {
    if (text.includes('pcb') || text.includes('plate') || 
        text.includes('weight') || text.includes('hardware') ||
        text.includes('top') || text.includes('bottom') || text.includes('mid')) {
      return true;
    }
  }
  
  return false;
}

// Determine if product is a group buy
function isGroupBuy(name, description, vendor, tags = []) {
  const text = (name + ' ' + (description || '')).toLowerCase();
  
  for (const indicator of GB_INDICATORS) {
    if (text.includes(indicator.toLowerCase())) {
      return true;
    }
  }
  
  // Check tags
  for (const tag of tags) {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes('group buy') || tagLower.includes('pre-order')) {
      return true;
    }
  }
  
  // Drop products with "joins" are typically group buys
  if (vendor === 'Drop') {
    return true; // Drop is primarily group buy platform
  }
  
  return false;
}

// Determine if product is an interest check
function isInterestCheck(name, description) {
  const text = (name + ' ' + (description || '')).toLowerCase();
  
  for (const indicator of IC_INDICATORS) {
    if (text.includes(indicator.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

// Check inventory status from Shopify variant data
function getAvailability(product) {
  const variants = product.variants || [];
  
  if (variants.length === 0) {
    return { available: true, quantity: 0 }; // Assume available if no variants
  }
  
  // Check if any variant is available
  let totalQuantity = 0;
  let anyAvailable = false;
  
  for (const variant of variants) {
    if (variant.available === true) {
      anyAvailable = true;
    }
    if (variant.inventory_quantity) {
      totalQuantity += variant.inventory_quantity;
    }
  }
  
  // Check inventory policy
  const firstVariant = variants[0];
  if (firstVariant?.inventory_policy === 'continue') {
    anyAvailable = true; // Can always order even if 0 inventory
  }
  
  return { 
    available: anyAvailable, 
    quantity: totalQuantity,
    inventoryPolicy: firstVariant?.inventory_policy || 'deny'
  };
}

// Check if sold out based on various indicators
function isSoldOut(name, availability) {
  const nameLower = name.toLowerCase();
  
  for (const indicator of SOLD_OUT_INDICATORS) {
    if (nameLower.includes(indicator)) {
      return true;
    }
  }
  
  // If explicitly not available and quantity is 0
  if (!availability.available && availability.quantity === 0) {
    return true;
  }
  
  return false;
}

// Shopify JSON API scraper with PAGINATION and QUALITY improvements
async function scrapeShopifyStore(baseUrl, collectionPath, vendorName, maxProducts = 1000) {
  const items = [];
  let page = 1;
  let hasMore = true;
  const seenIds = new Set();
  let soldOutCount = 0;
  let partCount = 0;
  
  try {
    while (hasMore && items.length < maxProducts && page <= 10) {
      const url = `${baseUrl}${collectionPath}/products.json?page=${page}&limit=250`;
      console.log(`      📄 Page ${page}...`);
      
      const res = await axios.get(url, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        timeout: 15000
      });
      
      const products = res.data?.products || [];
      
      if (products.length === 0) {
        hasMore = false;
        break;
      }
      
      let newProductsCount = 0;
      let skippedSoldOut = 0;
      let skippedParts = 0;
      
      products.forEach(p => {
        // Deduplicate
        if (seenIds.has(p.id)) return;
        seenIds.add(p.id);
        
        const productUrl = `${baseUrl}/products/${p.handle}`;
        const price = p.variants?.[0]?.price || 'See site';
        const img = p.images?.[0]?.src || '';
        const tags = p.tags || [];
        const type = (p.product_type || '').toLowerCase();
        
        // Check availability
        const availability = getAvailability(p);
        
        // Skip sold out items
        if (isSoldOut(p.title, availability)) {
          soldOutCount++;
          skippedSoldOut++;
          return;
        }
        
        // Determine category
        let category = type.includes('keycap') ? 'keycaps' :
                      type.includes('switch') ? 'switches' :
                      type.includes('cable') ? 'accessories' :
                      type.includes('deskmat') ? 'accessories' :
                      type.includes('case') && !type.includes('keyboard') ? 'accessories' :
                      'keyboard';
        
        // Check if it's a part (PCB, plate, etc.)
        const description = p.body_html?.replace(/<[^>]*>/g, '').trim() || '';
        if (isPart(p.title, description, vendorName)) {
          category = 'parts';
          partCount++;
          skippedParts++;
          return; // Skip parts entirely - they're not full products
        }
        
        // Determine item type and availability status
        const itemType = isGroupBuy(p.title, description, vendorName, tags) ? 'group_buy' :
                        isInterestCheck(p.title, description) ? 'interest_check' :
                        'product';
        
        const status = availability.available ? 'in_stock' : 
                      availability.quantity > 0 ? 'low_stock' : 'out_of_stock';
        
        items.push({
          id: `${vendorName.toLowerCase()}-${p.handle}-${p.id}`.slice(0, 80),
          name: p.title,
          type: itemType,
          platform: vendorName,
          vendor: vendorName,
          category: category,
          url: productUrl,
          affiliateUrl: addAffiliateLink(productUrl, vendorName),
          price: price.startsWith('$') ? price : `$${price}`,
          image: img,
          description: description.slice(0, 300).trim(),
          status: status,
          availability: {
            inStock: availability.available,
            quantity: availability.quantity,
            inventoryPolicy: availability.inventoryPolicy
          },
          tags: tags,
          scrapedAt: new Date().toISOString(),
          source: 'vendor'
        });
        newProductsCount++;
      });
      
      console.log(`         ✓ ${newProductsCount} new products (skipped ${skippedSoldOut} sold out, ${skippedParts} parts)`);
      
      if (products.length < 250) {
        hasMore = false;
      }
      
      page++;
      
      if (hasMore) {
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
  } catch (e) {
    console.log(`   ⚠️ ${vendorName}: ${e.message.slice(0, 80)}`);
  }
  
  console.log(`   ✅ ${vendorName}: ${items.length} in-stock products (${soldOutCount} sold out skipped, ${partCount} parts skipped)`);
  return items;
}

// Individual scrapers with multiple collections
async function scrapeKeychron() {
  console.log('🔍 Keychron...');
  const allItems = [];
  const seenIds = new Set();
  
  const collections = [
    '/collections/all-keyboards',
    '/collections/all-products',
    '/collections/keychron-keyboards',
    '/collections/lemokey',
    '/collections/switches',
    '/collections/keycaps'
  ];
  
  for (const collection of collections) {
    const items = await scrapeShopifyStore('https://keychron.com', collection, 'Keychron', 1000);
    items.forEach(item => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        allItems.push(item);
      }
    });
  }
  
  console.log(`   ✅ Keychron total: ${allItems.length} unique in-stock products`);
  return allItems;
}

async function scrapeEpomaker() {
  console.log('🔍 Epomaker...');
  const allItems = [];
  const seenIds = new Set();
  
  const collections = [
    '/collections/all',
    '/collections/keyboards',
    '/collections/switches',
    '/collections/keycaps',
    '/collections/accessories'
  ];
  
  for (const collection of collections) {
    const items = await scrapeShopifyStore('https://epomaker.com', collection, 'Epomaker', 1000);
    items.forEach(item => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        allItems.push(item);
      }
    });
  }
  
  console.log(`   ✅ Epomaker total: ${allItems.length} unique in-stock products`);
  return allItems;
}

async function scrapeKBDfans() {
  console.log('🔍 KBDfans...');
  const allItems = [];
  const seenIds = new Set();
  
  const collections = [
    '/collections/keyboard',
    '/collections/keycaps',
    '/collections/switches',
    '/collections/diy-kit',
    '/collections/accessories'
  ];
  
  for (const collection of collections) {
    const items = await scrapeShopifyStore('https://kbdfans.com', collection, 'KBDfans', 1000);
    items.forEach(item => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        allItems.push(item);
      }
    });
  }
  
  console.log(`   ✅ KBDfans total: ${allItems.length} unique in-stock products`);
  return allItems;
}

async function scrapeNovelKeys() {
  console.log('🔍 NovelKeys...');
  const allItems = [];
  const seenIds = new Set();
  
  const collections = [
    '/collections/keyboards',
    '/collections/switches-1',
    '/collections/keycaps'
  ]; // Removed accessories - too many parts
  
  for (const collection of collections) {
    const items = await scrapeShopifyStore('https://novelkeys.com', collection, 'NovelKeys', 1000);
    items.forEach(item => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        allItems.push(item);
      }
    });
  }
  
  console.log(`   ✅ NovelKeys total: ${allItems.length} unique in-stock products`);
  return allItems;
}

async function scrapeDrop() {
  console.log('🔍 Drop (Group Buy Platform)...');
  const items = [];
  const seenIds = new Set();
  
  try {
    const collections = [
      'https://drop.com/mechanical-keyboards',
      'https://drop.com/keyboards',
      'https://drop.com/switches'
    ];
    
    for (const url of collections) {
      try {
        const res = await axios.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          timeout: 10000
        });
        const $ = cheerio.load(res.data);
        
        $('a[href*="/buy/"]').each((i, el) => {
          const $el = $(el);
          const name = $el.find('h3, .title, [data-testid="product-title"]').first().text().trim();
          const href = $el.attr('href');
          const priceText = $el.find('[data-testid="price"], .price').first().text().trim();
          const joins = $el.text().match(/(\d+) joined/)?.[1];
          const statusText = $el.text().toLowerCase();
          
          // Skip sold out items on Drop
          if (statusText.includes('sold out') || statusText.includes('ended')) {
            return;
          }
          
          if (name && href && name.length > 2) {
            const fullUrl = href.startsWith('http') ? href : `https://drop.com${href}`;
            const id = `drop-${href.split('/').pop()?.slice(0, 30) || i}`;
            
            if (!seenIds.has(id)) {
              seenIds.add(id);
              
              // Determine if it's a current GB or past drop
              const isActiveGB = joins && !statusText.includes('ended');
              const itemType = isActiveGB ? 'group_buy' : 'product';
              
              items.push({
                id,
                name: name.slice(0, 100),
                type: itemType,
                platform: 'Drop',
                vendor: 'Drop',
                category: 'keyboard',
                url: fullUrl,
                affiliateUrl: addAffiliateLink(fullUrl, 'Drop'),
                price: priceText || 'See site',
                joins: joins ? parseInt(joins) : 0,
                status: isActiveGB ? 'group_buy_active' : 'active',
                scrapedAt: new Date().toISOString(),
                source: 'vendor'
              });
            }
          }
        });
      } catch (e) {
        console.log(`   ⚠️ Drop ${url}: ${e.message.slice(0, 50)}`);
      }
    }
  } catch (e) {
    console.log(`   ⚠️ Drop: ${e.message.slice(0, 50)}`);
  }
  
  console.log(`   ✅ Drop: ${items.length} current drops/group buys`);
  return items;
}

// Group Buy scrapers
async function scrapeGeekhack() {
  console.log('\n🎯 Geekhack Group Buys...');
  const items = [];
  try {
    const res = await axios.get('https://geekhack.org/index.php?board=70.0', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });
    const $ = cheerio.load(res.data);
    
    // Get current date for end date estimation
    const now = new Date();
    
    $('.topic_row').each((i, el) => {
      const title = $(el).find('.subject a').first().text().trim();
      const href = $(el).find('.subject a').attr('href');
      const author = $(el).find('.poster a').text().trim();
      const replies = $(el).find('.stats').text().match(/(\d+) replies?/)?.[1];
      const lastPost = $(el).find('.lastpost').text().trim();
      
      if (title && href) {
        const url = href.startsWith('http') ? href : `https://geekhack.org${href}`;
        const id = `geekhack-${title.slice(0, 30).replace(/[^a-z0-9]+/gi, '-')}-${i}`.slice(0, 80);
        
        // Determine if it's a GB, IC, or vendor post
        const titleLower = title.toLowerCase();
        let type = 'group_buy';
        let status = 'live';
        
        if (titleLower.includes('[ic]') || titleLower.includes('interest check')) {
          type = 'interest_check';
          status = 'interest_check';
        } else if (titleLower.includes('[gb]') || titleLower.includes('group buy')) {
          type = 'group_buy';
          status = 'live';
        } else if (replies && parseInt(replies) > 50) {
          // High reply count usually indicates active GB
          type = 'group_buy';
        }
        
        // Check if it's an old thread (inactive)
        if (lastPost && (lastPost.includes('2023') || lastPost.includes('2024') && now.getMonth() > 6)) {
          status = 'ended';
        }
        
        items.push({
          id,
          name: title,
          type,
          platform: 'Geekhack',
          url,
          author: author || 'Unknown',
          replies: parseInt(replies) || 0,
          status,
          scrapedAt: now.toISOString(),
          source: 'geekhack'
        });
      }
    });
  } catch (e) { 
    console.log(`   ⚠️ Geekhack: ${e.message.slice(0, 50)}`); 
  }
  
  // Filter out ended group buys
  const activeItems = items.filter(i => i.status !== 'ended');
  console.log(`   ✅ ${activeItems.length} active group buys/ICs (${items.length - activeItems.length} ended filtered)`);
  return activeItems;
}

async function scrapeReddit() {
  console.log('🔍 Reddit r/mechmarket...');
  const items = [];
  try {
    const res = await axios.get('https://www.reddit.com/r/mechmarket/new.json?limit=50', {
      headers: { 'User-Agent': 'Switchyard/1.0 (Educational)' },
      timeout: 10000
    });
    const posts = res.data?.data?.children || [];
    
    posts.forEach(post => {
      const p = post.data;
      const title = p.title || '';
      const titleLower = title.toLowerCase();
      
      // Look for GB or IC tags
      const gbMatch = title.match(/\[GB\]/i);
      const icMatch = title.match(/\[IC\]/i);
      
      if (gbMatch || icMatch) {
        const type = icMatch ? 'interest_check' : 'group_buy';
        
        items.push({
          id: `reddit-${p.id}`,
          name: title,
          type,
          platform: 'Reddit r/mechmarket',
          url: `https://reddit.com${p.permalink}`,
          author: p.author,
          upvotes: p.ups || 0,
          comments: p.num_comments || 0,
          status: 'live',
          scrapedAt: new Date().toISOString(),
          source: 'reddit'
        });
      }
    });
  } catch (e) {
    if (e.response?.status === 403) {
      console.log('   ⚠️ Reddit rate limited (403)');
    } else {
      console.log(`   ⚠️ ${e.message.slice(0, 50)}`);
    }
  }
  console.log(`   ✅ ${items.length} GB/IC posts`);
  return items;
}

// Main
async function runScraper() {
  console.log('🚀 Starting Switchyard Scraper v2 - Quality Focus\n');
  const startTime = Date.now();
  const data = loadData();
  
  const existingUrls = new Set(data.items?.map(i => i.url) || []);
  const newItems = [];
  let totalSkippedSoldOut = 0;
  let totalSkippedParts = 0;
  
  // Products
  console.log('📦 VENDOR PRODUCTS (In-Stock Only)');
  console.log('=====================================');
  const productScrapers = [scrapeKeychron, scrapeEpomaker, scrapeKBDfans, scrapeNovelKeys, scrapeDrop];
  
  for (const scraper of productScrapers) {
    try {
      const items = await scraper();
      items.forEach(item => {
        if (!existingUrls.has(item.url)) {
          newItems.push(item);
          existingUrls.add(item.url);
        }
      });
    } catch (e) {
      console.log(`   Error: ${e.message.slice(0, 50)}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Group Buys
  console.log('\n🎯 GROUP BUYS & INTEREST CHECKS');
  console.log('================================');
  const gbScrapers = [scrapeGeekhack, scrapeReddit];
  
  for (const scraper of gbScrapers) {
    try {
      const items = await scraper();
      items.forEach(item => {
        if (!existingUrls.has(item.url)) {
          newItems.push(item);
          existingUrls.add(item.url);
        }
      });
    } catch (e) {
      console.log(`   Error: ${e.message.slice(0, 50)}`);
    }
  }
  
  // Merge and organize data
  console.log('\n📊 PROCESSING & ORGANIZING DATA');
  console.log('=================================');
  
  const allItems = [...(data.items || []), ...newItems];
  
  // Filter out old data (items not updated in 30 days are stale)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const freshItems = allItems.filter(item => {
    const itemDate = new Date(item.scrapedAt || 0);
    return itemDate > thirtyDaysAgo || item.type === 'group_buy' || item.type === 'interest_check';
  });
  
  console.log(`   Filtered ${allItems.length - freshItems.length} stale items (>30 days old)`);
  
  // Organize by type
  data.items = freshItems;
  data.allProducts = freshItems.filter(i => i.type === 'product' && i.category !== 'parts');
  data.inStock = freshItems.filter(i => i.status === 'in_stock' || i.status === 'active');
  data.groupBuys = freshItems.filter(i => i.type === 'group_buy' && i.status !== 'ended');
  data.interestChecks = freshItems.filter(i => i.type === 'interest_check');
  
  // Remove parts from main view but keep them accessible
  data.parts = freshItems.filter(i => i.category === 'parts');
  
  data.metadata = {
    scrapedAt: new Date().toISOString(),
    duration: ((Date.now() - startTime) / 1000).toFixed(2),
    totalItems: freshItems.length,
    newItems: newItems.length,
    products: data.allProducts.length,
    inStock: data.inStock.length,
    groupBuys: data.groupBuys.length,
    interestChecks: data.interestChecks.length,
    parts: data.parts?.length || 0,
    filteredStale: allItems.length - freshItems.length
  };
  
  saveData(data);
  
  console.log('\n📋 FINAL RESULTS');
  console.log('=================');
  console.log(`   Total Items: ${freshItems.length} (${newItems.length} new today)`);
  console.log(`   In Stock Products: ${data.allProducts.length}`);
  console.log(`   Active Group Buys: ${data.groupBuys.length}`);
  console.log(`   Interest Checks: ${data.interestChecks.length}`);
  console.log(`   Parts (separate): ${data.parts?.length || 0}`);
  console.log(`   Stale Items Removed: ${allItems.length - freshItems.length}`);
  console.log(`   ⏱️  ${data.metadata.duration}s`);
  
  console.log(newItems.length > 0 ? '\n✅ New items found and added!' : '\n📊 No new items today');
  
  return data;
}

// Run if called directly
if (require.main === module) {
  runScraper().catch(console.error);
}

module.exports = { runScraper };
