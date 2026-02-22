/**
 * Keebshelf Wishlist & Price Alert Service
 * 
 * Features:
 * - Save products to user wishlist
 * - Track price changes
 * - Send alerts when prices drop
 * - Daily digest of changes
 * 
 * Usage:
 * const wishlist = require('./wishlist-service');
 * await wishlist.addToWishlist(email, productId);
 * await wishlist.checkPriceChanges();
 */

const fs = require('fs');
const path = require('path');

// Data storage paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const WISHLIST_FILE = path.join(DATA_DIR, 'wishlists.json');
const PRICE_HISTORY_FILE = path.join(DATA_DIR, 'price-history.json');
const ALERTS_FILE = path.join(DATA_DIR, 'pending-alerts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load or initialize wishlist data
function loadWishlists() {
  try {
    if (fs.existsSync(WISHLIST_FILE)) {
      return JSON.parse(fs.readFileSync(WISHLIST_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading wishlists:', e);
  }
  return {};
}

// Load or initialize price history
function loadPriceHistory() {
  try {
    if (fs.existsSync(PRICE_HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(PRICE_HISTORY_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading price history:', e);
  }
  return {};
}

// Save wishlists
function saveWishlists(data) {
  try {
    fs.writeFileSync(WISHLIST_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Error saving wishlists:', e);
    return false;
  }
}

// Save price history
function savePriceHistory(data) {
  try {
    fs.writeFileSync(PRICE_HISTORY_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Error saving price history:', e);
    return false;
  }
}

// Parse price string to number
function parsePrice(priceStr) {
  if (!priceStr) return null;
  const match = priceStr.match(/[\d,]+\.?\d*/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : null;
}

// Load current products
function loadProducts() {
  try {
    const dataFile = path.join(DATA_DIR, 'keyboard-data.json');
    if (fs.existsSync(dataFile)) {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      return data.allProducts || data.groupBuys || [];
    }
  } catch (e) {
    console.error('Error loading products:', e);
  }
  return [];
}

class WishlistService {
  constructor() {
    this.wishlists = loadWishlists();
    this.priceHistory = loadPriceHistory();
  }

  /**
   * Add product to user's wishlist
   * @param {string} email - User email
   * @param {string} productId - Product ID
   * @returns {Object} Result with success status
   */
  addToWishlist(email, productId) {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Validate product exists
    const products = loadProducts();
    const product = products.find(p => p.id === productId);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    // Initialize user's wishlist if not exists
    if (!this.wishlists[normalizedEmail]) {
      this.wishlists[normalizedEmail] = {
        email: normalizedEmail,
        items: [],
        preferences: {
          daily_digest: true,
          price_alerts: true,
          restock_alerts: true
        },
        createdAt: new Date().toISOString()
      };
    }

    // Check if already in wishlist
    const existing = this.wishlists[normalizedEmail].items.find(
      item => item.productId === productId
    );
    
    if (existing) {
      return { 
        success: true, 
        message: 'Product already in wishlist',
        isNew: false 
      };
    }

    // Add to wishlist
    const price = parsePrice(product.price);
    this.wishlists[normalizedEmail].items.push({
      productId,
      name: product.name,
      vendor: product.vendor,
      price: product.price,
      priceNumeric: price,
      image: product.image,
      url: product.url,
      addedAt: new Date().toISOString(),
      priceAtAddition: price,
      notifyOnPriceDrop: true,
      notifyOnRestock: true
    });

    saveWishlists(this.wishlists);

    return { 
      success: true, 
      message: 'Added to wishlist',
      isNew: true,
      item: {
        productId,
        name: product.name,
        price: product.price
      }
    };
  }

  /**
   * Remove product from wishlist
   * @param {string} email - User email
   * @param {string} productId - Product ID
   * @returns {Object} Result
   */
  removeFromWishlist(email, productId) {
    const normalizedEmail = email.toLowerCase().trim();
    
    if (!this.wishlists[normalizedEmail]) {
      return { success: false, error: 'No wishlist found' };
    }

    const beforeCount = this.wishlists[normalizedEmail].items.length;
    this.wishlists[normalizedEmail].items = this.wishlists[normalizedEmail].items.filter(
      item => item.productId !== productId
    );
    
    saveWishlists(this.wishlists);

    return { 
      success: true, 
      removed: beforeCount > this.wishlists[normalizedEmail].items.length 
    };
  }

  /**
   * Get user's wishlist
   * @param {string} email - User email
   * @returns {Object} Wishlist data
   */
  getWishlist(email) {
    const normalizedEmail = email.toLowerCase().trim();
    return this.wishlists[normalizedEmail] || { items: [] };
  }

  /**
   * Check for price changes and generate alerts
   * @returns {Array} List of price change alerts
   */
  checkPriceChanges() {
    const products = loadProducts();
    const alerts = [];
    let priceChangesDetected = 0;

    // Iterate through all wishlists
    for (const [email, wishlist] of Object.entries(this.wishlists)) {
      for (const item of wishlist.items) {
        const currentProduct = products.find(p => p.id === item.productId);
        if (!currentProduct) continue;

        const currentPrice = parsePrice(currentProduct.price);
        const previousPrice = item.priceNumeric;

        if (!currentPrice || !previousPrice) continue;

        // Check for price drop (10% threshold for alerts)
        const dropPercent = ((previousPrice - currentPrice) / previousPrice) * 100;
        
        if (currentPrice < previousPrice && dropPercent >= 10) {
          // Significant price drop
          alerts.push({
            type: 'price_drop',
            email,
            productId: item.productId,
            productName: item.name,
            vendor: item.vendor,
            oldPrice: item.price,
            newPrice: currentProduct.price,
            dropPercent: dropPercent.toFixed(1),
            url: item.url,
            image: item.image
          });
          
          // Update stored price
          item.price = currentProduct.price;
          item.priceNumeric = currentPrice;
          item.lastPriceChange = new Date().toISOString();
          
          priceChangesDetected++;
        }

        // Check for stock status change
        const currentStatus = currentProduct.status?.toLowerCase() || '';
        const wasOutOfStock = item.notifyOnRestock && 
          (currentStatus.includes('out') || currentStatus.includes('sold'));
        const isInStock = !wasOutOfStock;
        
        if (wasOutOfStock && isInStock && currentProduct.available !== false) {
          alerts.push({
            type: 'restock',
            email,
            productId: item.productId,
            productName: item.name,
            vendor: item.vendor,
            price: currentProduct.price,
            url: item.url,
            image: item.image
          });
        }
      }
    }

    if (priceChangesDetected > 0) {
      saveWishlists(this.wishlists);
    }

    return alerts;
  }

  /**
   * Get daily digest content
   * @returns {Object} Digest data organized by email
   */
  generateDailyDigest() {
    const products = loadProducts();
    const digest = {};

    for (const [email, wishlist] of Object.entries(this.wishlists)) {
      if (!wishlist.preferences?.daily_digest) continue;

      const items = [];
      
      for (const item of wishlist.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) continue;

        const currentPrice = parsePrice(product.price);
        const addedPrice = item.priceAtAddition;

        items.push({
          productId: item.productId,
          name: item.name,
          vendor: item.vendor,
          currentPrice: product.price,
          addedPrice: item.price,
          priceChange: currentPrice && addedPrice ? 
            (((currentPrice - addedPrice) / addedPrice) * 100).toFixed(1) : null,
          isLower: currentPrice < addedPrice,
          url: item.url,
          image: item.image,
          inStock: product.status?.toLowerCase() === 'active' || product.available !== false
        });
      }

      if (items.length > 0) {
        digest[email] = {
          email,
          itemCount: items.length,
          items: items.slice(0, 10), // Limit to 10 items
          generatedAt: new Date().toISOString()
        };
      }
    }

    return digest;
  }

  /**
   * Get statistics
   * @returns {Object} Service stats
   */
  getStats() {
    const wishlistCount = Object.keys(this.wishlists).length;
    const totalItems = Object.values(this.wishlists).reduce(
      (sum, w) => sum + w.items.length, 0
    );
    
    return {
      users: wishlistCount,
      totalTrackedItems: totalItems,
      avgItemsPerUser: wishlistCount > 0 ? (totalItems / wishlistCount).toFixed(1) : 0,
      dataFile: WISHLIST_FILE
    };
  }

  /**
   * Update user preferences
   * @param {string} email - User email
   * @param {Object} preferences - New preferences
   */
  updatePreferences(email, preferences) {
    const normalizedEmail = email.toLowerCase().trim();
    
    if (!this.wishlists[normalizedEmail]) {
      return { success: false, error: 'No wishlist found' };
    }

    this.wishlists[normalizedEmail].preferences = {
      ...this.wishlists[normalizedEmail].preferences,
      ...preferences
    };

    saveWishlists(this.wishlists);
    
    return { success: true };
  }
}

// Export singleton instance
module.exports = new WishlistService();

// CLI usage
if (require.main === module) {
  const service = new WishlistService();
  
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'stats':
      console.log('Wishlist Stats:', service.getStats());
      break;
      
    case 'check':
      const alerts = service.checkPriceChanges();
      console.log(`Found ${alerts.length} alerts:`);
      alerts.forEach(a => {
        console.log(`- ${a.type}: ${a.productName} (${a.email})`);
      });
      break;
      
    case 'digest':
      const digest = service.generateDailyDigest();
      console.log(`Generated digest for ${Object.keys(digest).length} users`);
      break;
      
    default:
      console.log('Usage: node wishlist-service.js [stats|check|digest]');
  }
}
