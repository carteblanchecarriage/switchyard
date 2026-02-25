const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

// Load existing data
function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { groupBuys: [], allProducts: [], sources: {}, metadata: {} };
  }
}

// Save data (only if changed)
function saveData(data) {
  data.metadata.updatedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Check if data actually changed
function hasChanges(oldData, newData) {
  const oldJson = JSON.stringify(oldData.groupBuys?.sort((a,b) => a.id?.localeCompare(b.id)));
  const newJson = JSON.stringify(newData.groupBuys?.sort((a,b) => a.id?.localeCompare(b.id)));
  return oldJson !== newJson;
}

// SOURCE 1: Reddit r/mechmarket
async function scrapeReddit() {
  console.log('🔍 Checking Reddit r/mechmarket...');
  const items = [];
  
  try {
    const response = await axios.get('https://www.reddit.com/r/mechmarket/new.json?limit=25', {
      headers: { 'User-Agent': 'SwitchyardBot/1.0 (by /u/switchyard)' },
      timeout: 15000
    });
    
    const posts = response.data?.data?.children || [];
    
    posts.forEach(post => {
      const data = post.data;
      // Get [GB] and [IC] posts
      if (data.title?.match(/\[(GB|IC)\]/i)) {
        items.push({
          id: `reddit-${data.id}`,
          name: data.title,
          platform: 'Reddit r/mechmarket',
          url: `https://reddit.com${data.permalink}`,
          author: data.author,
          upvotes: data.ups || 0,
          comments: data.num_comments || 0,
          type: data.title.toUpperCase().includes('[GB]') ? 'group_buy' : 'interest_check',
          createdAt: new Date(data.created_utc * 1000).toISOString(),
          scrapedAt: new Date().toISOString()
        });
      }
    });
    
    console.log(`   ✅ Found ${items.length} [GB]/[IC] posts`);
    return { success: true, items, count: items.length };
    
  } catch (error) {
    // Reddit often blocks with 403 - this is expected
    if (error.response?.status === 403) {
      console.log('   ⚠️ Reddit blocked (rate limit) - using cached data');
    } else {
      console.log(`   ⚠️ Reddit error: ${error.message}`);
    }
    return { success: false, items: [], count: 0 };
  }
}

// SOURCE 2: Geekhack Group Buy forum
async function scrapeGeekhack() {
  console.log('🔍 Checking Geekhack...');
  const items = [];
  
  try {
    const response = await axios.get('https://geekhack.org/index.php?board=70.0', {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      },
      timeout: 15000
    });
    
    if (!response.data || response.data.length < 1000) {
      console.log('   ⚠️ Geekhack returned empty response');
      return { success: false, items: [], count: 0 };
    }
    
    const $ = cheerio.load(response.data);
    
    $('.topic_row').each((i, elem) => {
      const $row = $(elem);
      const titleEl = $row.find('.subject a');
      const title = titleEl.text().trim();
      const url = titleEl.attr('href');
      const author = $row.find('.poster a').text().trim();
      const stats = $row.find('.stats');
      const replies = stats.find('.replies').text().trim() || stats.text().match(/(\d+) replies?/)?.[1];
      const views = stats.find('.views').text().trim() || stats.text().match(/(\d+) views?/)?.[1];
      
      if (title && url && title.length > 3) {
        items.push({
          id: `geekhack-${title.slice(0, 30).replace(/\W/g, '-')}-${i}`,
          name: title,
          platform: 'Geekhack',
          url: url.startsWith('http') ? url : `https://geekhack.org${url}`,
          author: author || 'Unknown',
          replies: parseInt(replies) || 0,
          views: parseInt(views) || 0,
          scrapedAt: new Date().toISOString()
        });
      }
    });
    
    console.log(`   ✅ Found ${items.length} threads`);
    return { success: true, items, count: items.length };
    
  } catch (error) {
    console.log(`   ⚠️ Geekhack error: ${error.message}`);
    return { success: false, items: [], count: 0 };
  }
}

// SOURCE 3: Drop.com (check for new drops)
async function scrapeDrop() {
  console.log('🔍 Checking Drop...');
  const items = [];
  
  try {
    const response = await axios.get('https://drop.com/all-communities/mechanical-keyboards', {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(response.data);
    
    // Look for drop links
    $('a[href*="/buy/"]').each((i, el) => {
      const href = $(el).attr('href');
      const title = $(el).find('h3, .title, span').first().text().trim() || $(el).text().trim().split('\n')[0].trim();
      
      if (href && title && title.length > 2 && !items.find(x => x.url?.includes(href))) {
        items.push({
          id: `drop-${href.split('/').pop()?.slice(0, 20) || i}`,
          name: title.slice(0, 100),
          platform: 'Drop',
          url: href.startsWith('http') ? href : `https://drop.com${href}`,
          scrapedAt: new Date().toISOString()
        });
      }
    });
    
    // Remove duplicates
    const unique = items.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);
    
    console.log(`   ✅ Found ${unique.length} drops`);
    return { success: unique.length > 0, items: unique, count: unique.length };
    
  } catch (error) {
    console.log(`   ⚠️ Drop error: ${error.message}`);
    return { success: false, items: [], count: 0 };
  }
}

// Main scraper
async function runScraper() {
  console.log('🚀 Starting scraper...\n');
  
  const startTime = Date.now();
  const existingData = loadData();
  const originalGroupBuys = existingData.groupBuys?.length || 0;
  
  // Create new data object starting with existing
  const newData = {
    ...existingData,
    groupBuys: existingData.groupBuys || [],
    sources: {},
    metadata: {
      ...(existingData.metadata || {}),
      lastScrapeAttempt: new Date().toISOString()
    }
  };
  
  // Track source status
  const sources = {
    reddit: { attempted: true },
    geekhack: { attempted: true },
    drop: { attempted: true }
  };
  
  // Run all scrapers in parallel with timeout
  const results = await Promise.allSettled([
    scrapeReddit(),
    scrapeGeekhack(),
    scrapeDrop()
  ]);
  
  // Process Reddit results
  const redditResult = results[0].status === 'fulfilled' ? results[0].value : { success: false, items: [] };
  sources.reddit.success = redditResult.success;
  sources.reddit.items = redditResult.count;
  
  // Process Geekhack results
  const geekhackResult = results[1].status === 'fulfilled' ? results[1].value : { success: false, items: [] };
  sources.geekhack.success = geekhackResult.success;
  sources.geekhack.items = geekhackResult.count;
  
  // Process Drop results
  const dropResult = results[2].status === 'fulfilled' ? results[2].value : { success: false, items: [] };
  sources.drop.success = dropResult.success;
  sources.drop.items = dropResult.count;
  
  // Create ID set of existing items
  const existingIds = new Set(newData.groupBuys.map(g => g.id));
  const existingUrls = new Set(newData.groupBuys.map(g => g.url));
  let newItemsAdded = 0;
  
  // Add new items from each source (only if not duplicate)
  [...redditResult.items, ...geekhackResult.items, ...dropResult.items].forEach(item => {
    if (!existingIds.has(item.id) && !existingUrls.has(item.url)) {
      newData.groupBuys.push(item);
      existingIds.add(item.id);
      existingUrls.add(item.url);
      newItemsAdded++;
    }
  });
  
  // Update metadata
  newData.metadata = {
    ...newData.metadata,
    scrapedAt: new Date().toISOString(),
    duration: ((Date.now() - startTime) / 1000).toFixed(2),
    sources,
    newItemsAdded,
    totalGroupBuys: newData.groupBuys.length
  };
  
  saveData(newData);
  
  console.log('\n📊 Results:');
  console.log(`   Reddit: ${sources.reddit.success ? '✅' : '⚠️'} (${sources.reddit.items})`);
  console.log(`   Geekhack: ${sources.geekhack.success ? '✅' : '⚠️'} (${sources.geekhack.items})`);
  console.log(`   Drop: ${sources.drop.success ? '✅' : '⚠️'} (${sources.drop.items})`);
  console.log(`\n📈 Group Buys: ${originalGroupBuys} → ${newData.groupBuys.length} (${newItemsAdded > 0 ? '+' : ''}${newItemsAdded})`);
  console.log(`   Products: ${newData.allProducts?.length || 0}`);
  console.log(`\n⏱️  Took ${newData.metadata.duration}s`);
  
  // Return whether there were changes
  return {
    changed: newItemsAdded > 0,
    newItems: newItemsAdded,
    data: newData
  };
}

// Run
runScraper().then(result => {
  console.log(result.changed ? '\n✅ New data found!' : '\n📊 No new data (sources may be rate-limited)');
  process.exit(0);
}).catch(error => {
  console.error('Scraper failed:', error.message);
  process.exit(1);
});
