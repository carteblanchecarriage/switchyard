const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Data storage
const DATA_FILE = path.join(__dirname, '..', 'data', 'scraped-data.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Scrape Geekhack Group Buys
async function scrapeGeekhack() {
  console.log('🔍 Scraping Geekhack...');
  
  try {
    // Geekhack Group Buy forum
    const response = await axios.get('https://geekhack.org/index.php?board=70.0', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const groupBuys = [];
    
    // Parse topic rows
    $('.topic_row').each((i, elem) => {
      const $row = $(elem);
      const title = $row.find('.subject a').text().trim();
      const url = $row.find('.subject a').attr('href');
      const author = $row.find('.poster a').text().trim();
      const replies = $row.find('.stats .replies').text().trim();
      const views = $row.find('.stats .views').text().trim();
      
      if (title && url) {
        groupBuys.push({
          id: `gh-${i}`,
          name: title,
          platform: 'Geekhack',
          url: url.startsWith('http') ? url : `https://geekhack.org${url}`,
          author,
          replies: parseInt(replies) || 0,
          views: parseInt(views) || 0,
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
  console.log('🔍 Scraping Reddit r/mechmarket...');
  
  try {
    // Use Reddit's JSON API (no auth needed for public posts)
    const response = await axios.get('https://www.reddit.com/r/mechmarket/new.json?limit=25', {
      headers: {
        'User-Agent': 'KeyboardTracker/1.0'
      },
      timeout: 10000
    });
    
    const posts = response.data.data.children;
    const listings = [];
    
    posts.forEach((post, i) => {
      const data = post.data;
      
      // Filter for [GB] (Group Buy) and [IC] (Interest Check) posts
      if (data.title && (data.title.includes('[GB]') || data.title.includes('[IC]'))) {
        listings.push({
          id: `reddit-${data.id}`,
          name: data.title,
          platform: 'Reddit r/mechmarket',
          url: `https://reddit.com${data.permalink}`,
          author: data.author,
          upvotes: data.ups,
          comments: data.num_comments,
          type: data.title.includes('[GB]') ? 'group_buy' : 'interest_check',
          createdAt: new Date(data.created_utc * 1000).toISOString(),
          scrapedAt: new Date().toISOString()
        });
      }
    });
    
    console.log(`✅ Found ${listings.length} Reddit [GB]/[IC] posts`);
    return listings;
    
  } catch (error) {
    console.error('❌ Reddit error:', error.message);
    return [];
  }
}

// Re-export the enhanced scraper
const { runEnhancedScraper, scrapeShopify, scrapeDrop: scrapeDropV2 } = require('./scraper-v2');

// Enhanced Drop scraper that extracts actual product URLs
async function scrapeDrop() {
  console.log('🔍 Scraping Drop.com...');
  
  try {
    const products = [];
    const collections = [
      { path: '/mechanical-keyboards', category: 'keyboard' },
      { path: '/switches', category: 'switches' },
      { path: '/keycaps', category: 'keycaps' }
    ];
    
    for (const collection of collections) {
      try {
        const response = await axios.get(`https://drop.com${collection.path}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 15000
        });
        
        const $ = cheerio.load(response.data);
        
        // Extract product links - Drop uses specific URL patterns
        $('a[href*="/buy/"]').each((i, elem) => {
          const $link = $(elem);
          const href = $link.attr('href');
          const title = $link.find('h3, .title, span').first().text().trim() || 
                       $link.text().trim().split('\n')[0];
          
          // Get price if available
          const priceElem = $link.find('[data-testid="price"], .price').text().trim();
          
          if (href && title && title.length > 2) {
            const fullUrl = href.startsWith('http') ? href : `https://drop.com${href}`;
            // Only include if it's an actual product page (/buy/ path)
            if (fullUrl.includes('/buy/')) {
              products.push({
                id: `drop-${collection.category}-${i}`,
                name: title,
                vendor: 'Drop',
                platform: 'Drop.com',
                url: fullUrl,
                affiliateUrl: `${fullUrl}?referer=keyboardtracker`,
                price: priceElem || 'See site',
                category: collection.category,
                status: 'active',
                scrapedAt: new Date().toISOString()
              });
            }
          }
        });
        
      } catch (e) {
        console.log(`  ⚠️ Drop ${collection.path}: ${e.message}`);
      }
    }
    
    console.log(`✅ Found ${products.length} Drop products with real URLs`);
    return products;
    
  } catch (error) {
    console.error('❌ Drop error:', error.message);
    return [];
  }
}

// Backward compatible scraper - can run in legacy or enhanced mode
async function runScraper(enhanced = true) {
  if (enhanced) {
    console.log('🚀 Starting Keyboard Tracker Scraper (Enhanced Mode)...');
    console.log('   Fetching real product URLs from vendor sites...\n');
    return await runEnhancedScraper();
  }
  
  // Legacy mode - simple scrapers
  console.log('🚀 Starting Keyboard Tracker Scraper (Legacy Mode)...\n');
  const startTime = Date.now();
  
  // Run all scrapers in parallel
  const [geekhackData, redditData, dropData] = await Promise.allSettled([
    scrapeGeekhack(),
    scrapeReddit(),
    scrapeDrop()
  ]);
  
  // Combine results
  const allData = {
    geekhack: geekhackData.status === 'fulfilled' ? geekhackData.value : [],
    reddit: redditData.status === 'fulfilled' ? redditData.value : [],
    drop: dropData.status === 'fulfilled' ? dropData.value : [],
    metadata: {
      scrapedAt: new Date().toISOString(),
      totalSources: 3,
      successfulSources: [
        geekhackData.status === 'fulfilled' ? 'geekhack' : null,
        redditData.status === 'fulfilled' ? 'reddit' : null,
        dropData.status === 'fulfilled' ? 'drop' : null
      ].filter(Boolean)
    }
  };
  
  // Calculate totals
  const totalItems = allData.geekhack.length + allData.reddit.length + allData.drop.length;
  
  // Save to file
  fs.writeFileSync(DATA_FILE, JSON.stringify(allData, null, 2));
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n📊 Scraping Complete:');
  console.log(`   Duration: ${duration}s`);
  console.log(`   Total items: ${totalItems}`);
  console.log(`   Geekhack: ${allData.geekhack.length}`);
  console.log(`   Reddit: ${allData.reddit.length}`);
  console.log(`   Drop: ${allData.drop.length}`);
  console.log(`   Data saved to: ${DATA_FILE}`);
  
  return allData;
}

// Run if called directly
if (require.main === module) {
  runScraper().catch(console.error);
}

// Export all scraper functions
module.exports = { 
  runScraper, 
  scrapeGeekhack, 
  scrapeReddit, 
  scrapeDrop,
  // Re-export enhanced scraper
  runEnhancedScraper,
  scrapeShopify: () => { /* delegated to scraper-v2 */ },
  scrapeDropV2
};
