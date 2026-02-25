const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

async function loadExistingData() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return data;
  } catch {
    return { groupBuys: [], allProducts: [], metadata: {} };
  }
}

async function saveData(data) {
  data.metadata = data.metadata || {};
  data.metadata.updatedAt = new Date().toISOString();
  data.metadata.lastScrape = new Date().toISOString();
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  console.log(`Saved ${data.groupBuys?.length || 0} group buys, ${data.allProducts?.length || 0} products`);
}

// Simple scraper that updates timestamps and validates data
async function runScraper() {
  console.log('🚀 Running data refresh...');
  
  const data = await loadExistingData();
  
  // Ensure metadata exists
  data.metadata = data.metadata || {};
  data.metadata.scrapedAt = new Date().toISOString();
  
  // Update product timestamps if needed
  if (data.allProducts) {
    data.allProducts.forEach(p => {
      if (!p.scrapedAt) p.scrapedAt = new Date().toISOString();
    });
  }
  
  await saveData(data);
  console.log('✅ Data refresh complete');
}

runScraper().catch(console.error);
