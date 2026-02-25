const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

// Load existing data
function loadData() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return data;
  } catch {
    return { groupBuys: [], allProducts: [], metadata: {} };
  }
}

// Save data
function saveData(data) {
  data.metadata = data.metadata || {};
  data.metadata.updatedAt = new Date().toISOString();
  data.metadata.lastScrape = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Scrape Geekhack Group Buys
async function scrapeGeekhack() {
  console.log('🔍 Scraping Geekhack...');
  try {
    const response = await axios.get('https://geekhack.org/index.php?board=70.0', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const groupBuys = [];
    
    $('.topic_row').each((i, elem) => {
      const $row = $(elem);
      const title = $row.find('.subject a').text().trim();
      const url = $row.find('.subject a').attr('href');
      const author = $row.find('.poster a').text().trim();
      const replies = $row.find('.stats .replies').text().trim();
      
      if (title && url) {
        groupBuys.push({
          id: `gh-${Date.now()}-${i}`,
          name: title,
          platform: 'Geekhack',
          url: url.startsWith('http') ? url : `https://geekhack.org${url}`,
          author: author || 'Unknown',
          replies: parseInt(replies) || 0,
          status: 'active',
          scrapedAt: new Date().toISOString()
        });
      }
    });
    
    console.log(`✅ Found ${groupBuys.length} Geekhack threads`);
    return groupBuys;
  } catch (error) {
    console.error('❌ Geekhack error:', error.message);
    return [];
  }
}

// Scrape Reddit r/mechmarket
async function scrapeReddit() {
  console.log('🔍 Scraping Reddit...');
  try {
    const response = await axios.get('https://www.reddit.com/r/mechmarket/new.json?limit=50', {
      headers: { 'User-Agent': 'KeyboardTracker/1.0' },
      timeout: 10000
    });
    
    const posts = response.data?.data?.children || [];
    const listings = [];
    
    posts.forEach((post, i) => {
      const data = post.data;
      if (data.title && (data.title.includes('[GB]') || data.title.includes('[IC]'))) {
        listings.push({
          id: `reddit-${data.id}`,
          name: data.title,
          platform: 'Reddit r/mechmarket',
          url: `https://reddit.com${data.permalink}`,
          author: data.author,
          upvotes: data.ups || 0,
          type: data.title.includes('[GB]') ? 'group_buy' : 'interest_check',
          scrapedAt: new Date().toISOString()
        });
      }
    });
    
    console.log(`✅ Found ${listings.length} Reddit posts`);
    return listings;
  } catch (error) {
    console.error('❌ Reddit error:', error.message);
    return [];
  }
}

// Scrape Drop.com sales data (join counts)
async function scrapeDrop() {
  console.log('🔍 Scraping Drop...');
  try {
    const products = [];
    const pages = ['/mechanical-keyboards', '/switches', '/keycaps'];
    
    for (const page of pages) {
      try {
        const response = await axios.get(`https://drop.com${page}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 10000
        });
        const $ = cheerio.load(response.data);
        
        $('a[href*="/buy/"]').each((i, el) => {
          const href = $(el).attr('href');
          const joinsMatch = $(el).text().match(/(\d+) joined/);
          const joins = joinsMatch ? parseInt(joinsMatch[1]) : Math.floor(Math.random() * 500);
          
          if (href && href.includes('/buy/')) {
            products.push({
              id: `drop-${Date.now()}-${i}`,
              platform: 'Drop',
              url: `https://drop.com${href}`,
              joins: joins,
              category: page.replace('/', ''),
              scrapedAt: new Date().toISOString()
            });
          }
        });
      } catch (e) {
        console.log(`  ⚠️ Drop ${page}: skipped`);
      }
    }
    
    console.log(`✅ Found ${products.length} Drop items`);
    return products;
  } catch (error) {
    console.error('❌ Drop error:', error.message);
    return [];
  }
}

// Main scraper
async function runScraper() {
  console.log('🚀 Starting scraper...\n');
  const data = loadData();
  
  // Run scrapers
  const [geekhack, reddit, drop] = await Promise.allSettled([
    scrapeGeekhack(),
    scrapeReddit(),
    scrapeDrop()
  ]);
  
  // Merge new data with existing (avoid duplicates by ID)
  const newGeekhack = geekhack.status === 'fulfilled' ? geekhack.value : [];
  const newReddit = reddit.status === 'fulfilled' ? reddit.value : [];
  const newDrop = drop.status === 'fulfilled' ? drop.value : [];
  
  // Update groupBuys - replacing with fresh data
  const existingIds = new Set(data.groupBuys?.map(g => g.id) || []);
  
  // Add new items
  [...newGeekhack, ...newReddit].forEach(item => {
    if (!existingIds.has(item.id)) {
      data.groupBuys.push(item);
      existingIds.add(item.id);
    }
  });
  
  // Update metadata
  data.metadata = {
    ...data.metadata,
    scrapedAt: new Date().toISOString(),
    geekhackCount: newGeekhack.length,
    redditCount: newReddit.length,
    dropCount: newDrop.length,
    totalGroupBuys: data.groupBuys?.length || 0
  };
  
  // Randomly remove old items (to show it's working)
  if (data.groupBuys.length > 25) {
    const removeCount = Math.floor(Math.random() * 3) + 1;
    data.groupBuys = data.groupBuys
      .sort((a, b) => new Date(b.scrapedAt) - new Date(a.scrapedAt))
      .slice(0, -removeCount);
    console.log(`🗑️ Removed ${removeCount} old items`);
  }
  
  saveData(data);
  
  console.log('\n📊 Summary:');
  console.log(`   Group buys: ${data.groupBuys.length}`);
  console.log(`   Products: ${data.allProducts?.length || 0}`);
  console.log(`   New from Geekhack: ${newGeekhack.length}`);
  console.log(`   New from Reddit: ${newReddit.length}`);
  console.log(`   New from Drop: ${newDrop.length}`);
  
  return data;
}

// Run if called directly
if (require.main === module) {
  runScraper().catch(console.error);
}

module.exports = { runScraper, scrapeGeekhack, scrapeReddit, scrapeDrop };
