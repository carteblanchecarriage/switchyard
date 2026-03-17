const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');
const PUBLIC_DATA_FILE = path.join(__dirname, '..', 'public', 'data.json');

// =============================================
// SIZE CLASSIFICATION - single source of truth
// =============================================
function classifySize(name, description, tags = []) {
  const text = (name + ' ' + (description || '') + ' ' + tags.join(' ')).toLowerCase();

  // Explicit percentage in name/description
  if (/\b40\s*%/.test(text)) return '40%';
  if (/\b50\s*%/.test(text)) return '50%';
  if (/\b60\s*%/.test(text)) return '60%';
  if (/\b65\s*%/.test(text)) return '65%';
  if (/\b70\s*%/.test(text)) return '70%';
  if (/\b75\s*%/.test(text)) return '75%';
  if (/\b80\s*%/.test(text)) return '80%';
  if (/\b96\s*%/.test(text)) return '96%';
  if (/\b100\s*%/.test(text)) return '100%';

  // TKL keywords
  if (/\btkl\b|\btenkeyless\b/.test(text)) return 'TKL';

  // Full-size keywords
  if (/\bfull[- ]size\b/.test(text)) return 'Full';

  // Key count in name (e.g. "87-key", "104 keys")
  const keyCountMatch = text.match(/\b(40|50|61|64|65|67|68|75|76|80|82|83|84|87|88|96|98|100|104|108)[- ]?key/i);
  if (keyCountMatch) {
    const n = parseInt(keyCountMatch[1]);
    if (n <= 50) return '50%';
    if (n <= 65) return '65%';
    if (n <= 75) return '75%';
    if (n <= 88) return 'TKL';
    if (n <= 100) return '96%';
    return 'Full';
  }

  // Keychron model numbers (most important vendor)
  const keychronMatch = name.match(/\b([qvkbc])(\d{1,2})\b/i);
  if (keychronMatch) {
    const series = keychronMatch[1].toUpperCase();
    const num = parseInt(keychronMatch[2]);
    // Verified against Keychron product pages
    const keychron = {
      K: { 1:'75%', 2:'75%', 3:'75%', 4:'96%', 5:'Full', 6:'65%', 7:'65%', 8:'TKL', 9:'40%', 10:'Full', 11:'65%', 12:'60%', 13:'75%', 14:'96%', 15:'Full' },
      Q: { 1:'75%', 2:'65%', 3:'TKL', 4:'60%', 5:'TKL', 6:'Full', 7:'Full', 8:'TKL', 9:'40%', 10:'Full' },
      V: { 1:'75%', 2:'65%', 3:'TKL', 4:'60%', 5:'TKL', 6:'Full', 7:'Full' },
      C: { 1:'TKL', 2:'65%', 3:'60%' },
      B: { 1:'75%' },
    };
    if (keychron[series]?.[num]) return keychron[series][num];
  }

  // Epomaker TH/EP model numbers
  const epoMatch = name.match(/\b(?:th|ep|rt|g)(\d{2,3})\b/i);
  if (epoMatch) {
    const prefix = name.match(/\b(th|ep|rt|g)(\d{2,3})\b/i)?.[1].toLowerCase();
    const num = parseInt(epoMatch[1]);
    if (prefix === 'rt') return 'Full'; // RT100 = full
    if (num <= 61) return '60%';
    if (num <= 68) return '65%';
    if (num <= 80) return '75%';
    if (num <= 88) return 'TKL';
    return 'Full';
  }

  // KBDfans named models
  if (/\bd60\b|\btofu60\b/.test(text)) return '60%';
  if (/\bd65\b|\btofu65\b|\bkbd67\b/.test(text)) return '65%';
  if (/\bd84\b|\bkbd75\b/.test(text)) return '75%';
  if (/\bfreebird\b|\bd100\b/.test(text)) return 'TKL';
  if (/\bodin\b|\bbella\b|\bd108\b/.test(text)) return 'Full';

  // NovelKeys
  if (/\bnk65\b/.test(text)) return '65%';
  if (/\bnk87\b|\bhope\b/.test(text)) return 'TKL';

  // Drop named models
  if (/\bdrop\s+alt\b|\balt\s+keyboard\b/.test(text)) return '65%';
  if (/\bdrop\s+ctrl\b|\bctrl\s+keyboard\b/.test(text)) return 'TKL';
  if (/\bdrop\s+shift\b/.test(text)) return '96%';
  if (/\bplanck\b/.test(text)) return '40%';
  if (/\bpreonic\b/.test(text)) return '50%';
  if (/\bsense75\b/.test(text)) return '75%';

  // Glorious
  if (/\bgmmk\s*pro\b/.test(text)) return '75%';
  if (/\bgmmk\s*2\b/.test(text)) return 'Full';
  if (/\bgmmk\b/.test(text)) return 'TKL';

  // RK / Royal Kludge
  if (/\brk61\b/.test(text)) return '60%';
  if (/\brk68\b|\brk71\b/.test(text)) return '65%';
  if (/\brk84\b/.test(text)) return '75%';

  // Nuphy
  if (/\bnuphy\s+air60\b/.test(text)) return '60%';
  if (/\bnuphy\s+air75\b/.test(text)) return '75%';
  if (/\bnuphy\s+halo75\b/.test(text)) return '75%';

  // Numpad implies full-size keyboard context
  if (/\bnumpad\b/.test(text) && /\bkeyboard\b/.test(text)) return 'Full';
  if (/\b1800\s*layout\b|\b1800\s*compact\b/.test(text)) return '96%';

  return null;
}

// Affiliate tracking codes
const AFFILIATE_CODES = {
  'Epomaker': { param: 'sca_ref', value: '10691179.cOO0hJ6jvi' },
  'KBDfans': { param: 'ref', value: 'switchyard' },
  'NovelKeys': { param: 'ref', value: 'switchyard' },
  'Keychron': { param: 'ref', value: 'switchyard' },
  'Drop': { param: 'referer', value: 'switchyard' },
  'Qwerkywriter': { param: 'sca_ref', value: '10713146.AiDf5cQpby' },
  'CannonKeys': { param: 'ref', value: 'switchyard' },
  'DiviniKey': { param: 'ref', value: 'switchyard' },
  'Glorious': { param: 'ref', value: 'switchyard' },
  'Boardsource': { param: 'ref', value: 'switchyard' }
};

// Vendor priority order (affiliate vendors first - sorted by confirmed referral value)
const VENDOR_PRIORITY = {
  'Keychron': 1,      // 8% commission, 405 products, confirmed working
  'Qwerkywriter': 2,  // Unique products, 9 products, confirmed working
  'Epomaker': 3,      // 6% commission, 88 products, confirmed working
  'KBDfans': 10,
  'NovelKeys': 11,
  'Drop': 12,
  'CannonKeys': 20,
  'DiviniKey': 21,
  'Glorious': 22,
  'Boardsource': 23,
  'Kono.store': 24
};

// Regex patterns that indicate a product is a PART, not a complete keyboard.
// Using word boundaries (\b) to avoid false positives like "midnight" matching "mid",
// "topping" matching "top", "heavyweight" matching "weight", etc.
const PART_PATTERNS = [
  /\bpcb\b/,
  /\bplate\b/,
  /\bbrass weight\b|\baluminum weight\b|\bsteel weight\b|\bback weight\b/,
  /\bdaughterboard\b/,
  /\bjst cable\b/,
  /\bporon\b/,
  /\bpe foam\b|\bcase foam\b|\bswitch foam\b|\bpcb foam\b/,
  /\bgasket mount kit\b|\bgasket strip\b/,
  /\bbump ?ons\b/,
  /\bstandoffs?\b/,
  /\bo-?ring\b/,
  /\bhardware pack\b/,
  /\bpcb mount\b/,
  /\btop (?:case|housing)\b/,
  /\bbottom (?:case|housing)\b/,
  /\bmid (?:layer|piece|section)\b/,
  // Reservation/placeholder listings — not real purchasable products
  /\breservation card\b/,
  /\bslot reservation\b/,
  /\bgroup buy slot\b/,
  /\bplaceholder\b/,
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
  'sold out', 'out of stock', 'unavailable', 'discontinued', 'ended', 'archived'
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
  if (!url) return url;
  const aff = AFFILIATE_CODES[vendor];
  if (!aff) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}${aff.param}=${aff.value}`;
}

// Check if product is a part/assembly component, not a complete keyboard
function isPart(name, description, vendor) {
  const text = (name + ' ' + (description || '')).toLowerCase();

  for (const pattern of PART_PATTERNS) {
    if (pattern.test(text)) return true;
  }

  // NovelKeys: Keycult kits are sold as parts (PCB + plate bundles)
  if (vendor === 'NovelKeys' && text.includes('keycult')) {
    if (/\bpcb\b|\bplate\b|\bhardware\b/.test(text)) return true;
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
  const tags = product.tags || [];
  const tagsLower = tags.map(t => t.toLowerCase());
  
  // Check for archived/discontinued tags first
  if (tagsLower.includes('archived') || tagsLower.includes('discontinued') || tagsLower.includes('nonreturnable')) {
    return { available: false, quantity: 0, archived: true };
  }
  
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
  
  // Check inventory policy - but don't override if explicitly unavailable
  const firstVariant = variants[0];
  if (firstVariant?.inventory_policy === 'continue' && anyAvailable) {
    // Can continue ordering if actually available
    anyAvailable = true;
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
        // Check product name for keycap indicators across all vendors
        const titleLower = p.title.toLowerCase();
        const tagsLower = tags.map(t => t.toLowerCase()).join(' ');
        const nameHasKeycaps = titleLower.includes('gmk') ||
                              titleLower.includes('cyl') ||
                              titleLower.includes('sa ') ||
                              titleLower.includes('dsa ') ||
                              titleLower.includes('kat ') ||
                              titleLower.includes('mt3') ||
                              titleLower.includes('mtnu') ||
                              titleLower.includes('pbtfans') ||
                              titleLower.includes('cherry profile') ||
                              titleLower.includes('oem profile') ||
                              titleLower.includes('keycap') ||
                              titleLower.includes('keycaps') ||
                              titleLower.includes('keyset') ||
                              tagsLower.includes('keycap') ||
                              tagsLower.includes('keycaps') ||
                              tagsLower.includes('gmk keycaps');
        
        // Check tags for additional categorization hints
        const hasKeyboardTag = tagsLower.includes('keyboard') || tagsLower.includes('diy kit');
        const hasPCBTag = tagsLower.includes('pcb');
        const hasSwitchTag = tagsLower.includes('switches') || tagsLower.includes('switch');
        
        // NovelKeys specific categorization
        const isNovelKeysKeycapSet = vendorName === 'NovelKeys' && 
                                      (type === 'keycap set' || 
                                       type === 'artisan keycaps' ||
                                       type === 'mechs & co.');
        
        const isNovelKeysSwitches = vendorName === 'NovelKeys' && type === 'switches';
        
        const isMechsAndCoKeycaps = vendorName === 'NovelKeys' && 
                                     type === 'mechs & co.' &&
                                     (titleLower.includes('cyl') || titleLower.includes('mw '));
        
        let category = type.includes('keycap') || nameHasKeycaps || isMechsAndCoKeycaps || isNovelKeysKeycapSet ? 'keycaps' :
                      type.includes('switch') || hasSwitchTag || isNovelKeysSwitches ? 'switches' :
                      type.includes('cable') ? 'accessories' :
                      type.includes('deskmat') ? 'accessories' :
                      type.includes('case') && !type.includes('keyboard') ? 'accessories' :
                      hasPCBTag ? 'accessories' :
                      hasKeyboardTag ? 'keyboard' :
                      'keyboard';
        
        // Check description for additional categorization hints
        const description = p.body_html?.replace(/<[^>]*>/g, '').trim() || '';
        const descLower = description.toLowerCase();
        if (category === 'keyboard') {
          if (descLower.includes('only keycaps included') || 
              descLower.includes('profile: cherry') ||
              descLower.includes('profile: oem') ||
              (descLower.includes('material: pbt') && descLower.includes('keys') && !descLower.includes('keyboard'))) {
            category = 'keycaps';
          } else if (descLower.includes('switch type') || 
                     (descLower.includes('linear') && descLower.includes('switch')) ||
                     (descLower.includes('tactile') && descLower.includes('switch'))) {
            category = 'switches';
          }
        }
        
        // Check if it's a part (PCB, plate, etc.) - description already defined above
        if (isPart(p.title, description, vendorName)) {
          category = 'parts';
          partCount++;
          skippedParts++;
          return; // Skip parts entirely - they're not full products
        }
        
        // Skip redirect-only products
        const isRedirectOnly = description.toLowerCase().includes('redirect to') ||
                                description.toLowerCase().includes('order placed will be canceled') ||
                                description.toLowerCase().includes('only exists to redirect');
        if (isRedirectOnly) {
          return; // Skip this product
        }

        // Determine item type and availability status
        const itemType = isGroupBuy(p.title, description, vendorName, tags) ? 'group_buy' :
                        isInterestCheck(p.title, description) ? 'interest_check' :
                        'product';
        
        const status = availability.available ? 'in_stock' : 
                      availability.quantity > 0 ? 'low_stock' : 'out_of_stock';
        
        const size = category === 'keyboard' ? classifySize(p.title, description, tags) : null;

        items.push({
          id: `${vendorName.toLowerCase()}-${p.handle}-${p.id}`.slice(0, 80),
          name: p.title,
          type: itemType,
          platform: vendorName,
          vendor: vendorName,
          category: category,
          size: size,
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

async function scrapeQwerkywriter() {
  console.log('🔍 Qwerkywriter...');
  const allItems = [];
  
  try {
    const url = 'https://www.qwerkywriter.com/products.json?limit=250';
    const res = await axios.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    });
    
    const products = res.data?.products || [];
    const seenIds = new Set();
    
    products.forEach(p => {
      // Skip duplicates
      if (seenIds.has(p.id)) return;
      seenIds.add(p.id);
      
      // Skip sold out or unavailable
      const variants = p.variants || [];
      const hasAvailable = variants.some(v => v.available);
      if (!hasAvailable) return;
      
      // Skip accessories that aren't keyboards
      const type = (p.product_type || '').toLowerCase();
      const titleLower = p.title.toLowerCase();
      
      // Skip warranties, cases, and replacement parts
      if (titleLower.includes('warranty') || 
          titleLower.includes('carrying case') ||
          titleLower.includes('wrist pad') ||
          titleLower.includes('desk mat') ||
          titleLower.includes('replacement') ||
          titleLower.includes('battery') ||
          titleLower.includes('numpad') ||
          titleLower.includes('numkey') ||
          titleLower.includes('keycap') ||
          titleLower.includes('accessories')) {
        return;
      }
      
      // Categorize - they're primarily keyboards
      let category = 'keyboard';
      
      const productUrl = `https://www.qwerkywriter.com/products/${p.handle}`;
      const price = p.variants?.[0]?.price || 'See site';
      const img = p.images?.[0]?.src || '';
      
      const descText = p.body_html?.replace(/<[^>]*>/g, '') || '';
      allItems.push({
        id: `qwerkywriter-${p.handle}-${p.id}`.slice(0, 80),
        name: p.title,
        type: 'product',
        platform: 'Qwerkywriter',
        vendor: 'Qwerkywriter',
        category: category,
        size: classifySize(p.title, descText, p.tags || []),
        url: productUrl,
        affiliateUrl: addAffiliateLink(productUrl, 'Qwerkywriter'),
        price: `$${price}`,
        image: img,
        description: descText.slice(0, 200),
        scrapedAt: new Date().toISOString(),
        status: 'in_stock'
      });
    });
    
  } catch (e) {
    console.log(`   ⚠️ Qwerkywriter: ${e.message.slice(0, 50)}`);
  }
  
  console.log(`   ✅ Qwerkywriter: ${allItems.length} keyboards`);
  return allItems;
}

// ====================
// CANNONKEYS SCRAPER
// ====================
async function scrapeCannonKeys() {
  console.log('🔍 CannonKeys...');
  const allItems = [];

  try {
    const url = 'https://cannonkeys.com/products.json?limit=250';
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    const products = res.data?.products || [];
    const seenIds = new Set();

    for (const p of products) {
      if (seenIds.has(p.id)) continue;
      seenIds.add(p.id);

      // Skip if not available
      const variants = p.variants || [];
      const hasAvailable = variants.some(v => v.available);
      if (!hasAvailable) continue;

      // Check for redirect/unavailability
      const description = (p.body_html || '').toLowerCase();
      if (description.includes('redirect to') || description.includes('canceled')) continue;

      // Check tags for archived indicators
      const tags = p.tags || [];
      const tagsLower = tags.map(t => t.toLowerCase());
      if (tagsLower.includes('archived') || tagsLower.includes('discontinued') || tagsLower.includes('nonreturnable')) continue;

      // Determine category
      const titleLower = p.title.toLowerCase();
      const type = (p.product_type || '').toLowerCase();

      const nameHasKeycaps = titleLower.includes('gmk') ||
                            titleLower.includes('pbt') ||
                            titleLower.includes('keycap') ||
                            titleLower.includes('sa ') ||
                            tagsLower.includes('keycaps') ||
                            tagsLower.includes('gmk keycaps');

      const hasSwitchTag = tagsLower.includes('switches');
      const hasPCBTag = tagsLower.includes('pcb');

      let category = type.includes('keycap') || nameHasKeycaps ? 'keycaps' :
                    type.includes('switch') || hasSwitchTag ? 'switches' :
                    hasPCBTag ? 'accessories' :
                    'keyboard';

      // Check if part
      if (isPart(p.title, description, 'CannonKeys')) {
        category = 'accessories';
      }

      const productUrl = `https://cannonkeys.com/products/${p.handle}`;
      const price = p.variants?.[0]?.price || 'See site';
      const img = p.images?.[0]?.src || '';

      allItems.push({
        id: `cannonkeys-${p.handle}-${p.id}`.slice(0, 80),
        name: p.title,
        type: 'product',
        platform: 'CannonKeys',
        vendor: 'CannonKeys',
        category: category,
        size: category === 'keyboard' ? classifySize(p.title, description, p.tags || []) : null,
        url: productUrl,
        affiliateUrl: addAffiliateLink(productUrl, 'CannonKeys'),
        price: `$${price}`,
        image: img,
        description: description.replace(/<[^>]*>/g, '').slice(0, 200),
        scrapedAt: new Date().toISOString(),
        status: 'in_stock'
      });
    }

  } catch (e) {
    console.log(`   ⚠️ CannonKeys: ${e.message.slice(0, 50)}`);
  }

  console.log(`   ✅ CannonKeys: ${allItems.length} products`);
  return allItems;
}

// ====================
// DIVINIKEY SCRAPER
// ====================
async function scrapeDivinikey() {
  console.log('🔍 DiviniKey...');
  const allItems = [];

  try {
    const url = 'https://divinikey.com/products.json?limit=250';
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    const products = res.data?.products || [];
    const seenIds = new Set();

    for (const p of products) {
      if (seenIds.has(p.id)) continue;
      seenIds.add(p.id);

      const variants = p.variants || [];
      const hasAvailable = variants.some(v => v.available);
      if (!hasAvailable) continue;

      const description = (p.body_html || '').toLowerCase();
      if (description.includes('redirect to') || description.includes('canceled')) continue;

      const tags = p.tags || [];
      const tagsLower = tags.map(t => t.toLowerCase());
      if (tagsLower.includes('archived') || tagsLower.includes('discontinued')) continue;

      const titleLower = p.title.toLowerCase();
      const type = (p.product_type || '').toLowerCase();

      const nameHasKeycaps = titleLower.includes('gmk') ||
                            titleLower.includes('pbt') ||
                            titleLower.includes('keycap') ||
                            titleLower.includes('epbt') ||
                            tagsLower.includes('keycaps');

      const hasSwitchTag = tagsLower.includes('switches');
      const hasPCBTag = tagsLower.includes('pcb');

      let category = type.includes('keycap') || nameHasKeycaps ? 'keycaps' :
                    type.includes('switch') || hasSwitchTag ? 'switches' :
                    hasPCBTag ? 'accessories' :
                    'keyboard';

      if (isPart(p.title, description, 'DiviniKey')) {
        category = 'accessories';
      }

      const productUrl = `https://divinikey.com/products/${p.handle}`;
      const price = p.variants?.[0]?.price || 'See site';
      const img = p.images?.[0]?.src || '';

      allItems.push({
        id: `divinikey-${p.handle}-${p.id}`.slice(0, 80),
        name: p.title,
        type: 'product',
        platform: 'DiviniKey',
        vendor: 'DiviniKey',
        category: category,
        size: category === 'keyboard' ? classifySize(p.title, description, p.tags || []) : null,
        url: productUrl,
        affiliateUrl: addAffiliateLink(productUrl, 'DiviniKey'),
        price: `$${price}`,
        image: img,
        description: description.replace(/<[^>]*>/g, '').slice(0, 200),
        scrapedAt: new Date().toISOString(),
        status: 'in_stock'
      });
    }

  } catch (e) {
    console.log(`   ⚠️ DiviniKey: ${e.message.slice(0, 50)}`);
  }

  console.log(`   ✅ DiviniKey: ${allItems.length} products`);
  return allItems;
}

// ====================
// GLORIOUS SCRAPER
// ====================
async function scrapeGlorious() {
  console.log('🔍 Glorious...');
  const allItems = [];

  try {
    const url = 'https://www.gloriousgaming.com/products.json?limit=250';
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    const products = res.data?.products || [];
    const seenIds = new Set();

    for (const p of products) {
      if (seenIds.has(p.id)) continue;
      seenIds.add(p.id);

      const variants = p.variants || [];
      const hasAvailable = variants.some(v => v.available);
      if (!hasAvailable) continue;

      const description = (p.body_html || '').toLowerCase();
      if (description.includes('redirect to') || description.includes('canceled')) continue;

      const tags = p.tags || [];
      const tagsLower = tags.map(t => t.toLowerCase());
      if (tagsLower.includes('archived') || tagsLower.includes('discontinued')) continue;

      const titleLower = p.title.toLowerCase();
      const type = (p.product_type || '').toLowerCase();

      // Glorious focuses on keyboards, mice, and accessories
      const isMouse = titleLower.includes('mouse') || titleLower.includes('model d') || titleLower.includes('model o');
      const isKeyboard = titleLower.includes('keyboard') || titleLower.includes('gmmk') || titleLower.includes('keycap');
      const isAccessory = titleLower.includes('wrist') || titleLower.includes('mat') || titleLower.includes('cable');

      let category = isMouse ? 'mice' :
                    isAccessory ? 'accessories' :
                    'keyboard';

      const productUrl = `https://www.gloriousgaming.com/products/${p.handle}`;
      const price = p.variants?.[0]?.price || 'See site';
      const img = p.images?.[0]?.src || '';

      allItems.push({
        id: `glorious-${p.handle}-${p.id}`.slice(0, 80),
        name: p.title,
        type: 'product',
        platform: 'Glorious',
        vendor: 'Glorious',
        category: category,
        size: category === 'keyboard' ? classifySize(p.title, description, p.tags || []) : null,
        url: productUrl,
        affiliateUrl: addAffiliateLink(productUrl, 'Glorious'),
        price: `$${price}`,
        image: img,
        description: description.replace(/<[^>]*>/g, '').slice(0, 200),
        scrapedAt: new Date().toISOString(),
        status: 'in_stock'
      });
    }

  } catch (e) {
    console.log(`   ⚠️ Glorious: ${e.message.slice(0, 50)}`);
  }

  console.log(`   ✅ Glorious: ${allItems.length} products`);
  return allItems;
}

// ====================
// BOARDSOURCE SCRAPER
// ====================
async function scrapeBoardsource() {
  console.log('🔍 Boardsource...');
  const allItems = [];

  try {
    const url = 'https://boardsource.xyz/products.json?limit=250';
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    const products = res.data?.products || [];
    const seenIds = new Set();

    for (const p of products) {
      if (seenIds.has(p.id)) continue;
      seenIds.add(p.id);

      const variants = p.variants || [];
      const hasAvailable = variants.some(v => v.available);
      if (!hasAvailable) continue;

      const description = (p.body_html || '').toLowerCase();
      if (description.includes('redirect to') || description.includes('canceled')) continue;

      const tags = p.tags || [];
      const tagsLower = tags.map(t => t.toLowerCase());
      if (tagsLower.includes('archived') || tagsLower.includes('discontinued')) continue;

      const titleLower = p.title.toLowerCase();
      const type = (p.product_type || '').toLowerCase();

      // Boardsource focuses on split/ergonomic keyboards
      const nameHasKeycaps = titleLower.includes('keycap') || tagsLower.includes('keycaps');
      const isSplit = titleLower.includes('split') || titleLower.includes('corne') || titleLower.includes('lily58');

      let category = nameHasKeycaps ? 'keycaps' :
                    isSplit ? 'keyboard' :
                    'accessories';

      const productUrl = `https://boardsource.xyz/products/${p.handle}`;
      const price = p.variants?.[0]?.price || 'See site';
      const img = p.images?.[0]?.src || '';

      allItems.push({
        id: `boardsource-${p.handle}-${p.id}`.slice(0, 80),
        name: p.title,
        type: 'product',
        platform: 'Boardsource',
        vendor: 'Boardsource',
        category: category,
        size: category === 'keyboard' ? classifySize(p.title, description, p.tags || []) : null,
        url: productUrl,
        affiliateUrl: addAffiliateLink(productUrl, 'Boardsource'),
        price: `$${price}`,
        image: img,
        description: description.replace(/<[^>]*>/g, '').slice(0, 200),
        scrapedAt: new Date().toISOString(),
        status: 'in_stock'
      });
    }

  } catch (e) {
    console.log(`   ⚠️ Boardsource: ${e.message.slice(0, 50)}`);
  }

  console.log(`   ✅ Boardsource: ${allItems.length} products`);
  return allItems;
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
  console.log('🚀 Starting Switchyard Scraper v3 - Full Refresh\n');
  const startTime = Date.now();

  // Full re-scrape every run: prices, availability, and size all stay current.
  // We do NOT merge with old data — a complete fresh snapshot is written each time.
  const seenUrls = new Set();
  const freshItems = [];

  // ── Vendor products ──────────────────────────────────────────────────────────
  console.log('📦 VENDOR PRODUCTS (In-Stock Only)');
  console.log('=====================================');
  const productScrapers = [
    scrapeKeychron, scrapeEpomaker, scrapeKBDfans, scrapeNovelKeys,
    scrapeDrop, scrapeQwerkywriter, scrapeCannonKeys, scrapeDivinikey,
    scrapeGlorious, scrapeBoardsource
  ];

  for (const scraper of productScrapers) {
    try {
      const items = await scraper();
      for (const item of items) {
        if (!seenUrls.has(item.url)) {
          seenUrls.add(item.url);
          freshItems.push(item);
        }
      }
    } catch (e) {
      console.log(`   Error: ${e.message.slice(0, 80)}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // ── Group buys & interest checks ─────────────────────────────────────────────
  console.log('\n🎯 GROUP BUYS & INTEREST CHECKS');
  console.log('================================');
  const gbScrapers = [scrapeGeekhack, scrapeReddit];

  for (const scraper of gbScrapers) {
    try {
      const items = await scraper();
      for (const item of items) {
        if (!seenUrls.has(item.url)) {
          seenUrls.add(item.url);
          freshItems.push(item);
        }
      }
    } catch (e) {
      console.log(`   Error: ${e.message.slice(0, 80)}`);
    }
  }

  // ── Organise ─────────────────────────────────────────────────────────────────
  console.log('\n📊 PROCESSING & ORGANIZING DATA');
  console.log('=================================');

  const allProducts = freshItems.filter(i =>
    (i.type === 'product' || i.type === 'group_buy') && i.category !== 'parts'
  );
  const inStock    = freshItems.filter(i => i.status === 'in_stock' || i.status === 'active');
  const groupBuys  = freshItems.filter(i => i.type === 'group_buy' && i.status !== 'ended');
  const interestChecks = freshItems.filter(i => i.type === 'interest_check');
  const parts      = freshItems.filter(i => i.category === 'parts');

  // Log size coverage for keyboards
  const keyboards = allProducts.filter(i => i.category === 'keyboard');
  const withSize  = keyboards.filter(i => i.size);
  console.log(`   Size field coverage: ${withSize.length}/${keyboards.length} keyboards (${Math.round(withSize.length/keyboards.length*100)||0}%)`);

  const data = {
    items: freshItems,
    allProducts,
    inStock,
    groupBuys,
    interestChecks,
    parts,
    metadata: {
      scrapedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duration: ((Date.now() - startTime) / 1000).toFixed(2),
      totalItems: freshItems.length,
      products: allProducts.length,
      inStock: inStock.length,
      groupBuys: groupBuys.length,
      interestChecks: interestChecks.length,
      parts: parts.length,
    }
  };

  saveData(data);

  console.log('\n📋 FINAL RESULTS');
  console.log('=================');
  console.log(`   Total Items:      ${freshItems.length}`);
  console.log(`   Products:         ${allProducts.length}`);
  console.log(`   In Stock:         ${inStock.length}`);
  console.log(`   Active Group Buys:${groupBuys.length}`);
  console.log(`   Interest Checks:  ${interestChecks.length}`);
  console.log(`   Parts (hidden):   ${parts.length}`);
  console.log(`   ⏱️  ${data.metadata.duration}s`);

  return data;
}

// Run if called directly
if (require.main === module) {
  runScraper().catch(console.error);
}

module.exports = { runScraper };
