#!/usr/bin/env node
/**
 * Keebshelf Price Check Cron Job
 * Run every hour to check for price changes and send alerts
 * 
 * Add to crontab:
 * 0 * * * * /usr/bin/node /home/klondike/Desktop/keyboard-tracker/api/cron-price-check.js >> /home/klondike/Desktop/keyboard-tracker/logs/price-check.log 2>&1
 */

const wishlistService = require('./wishlist-service');
const alertSender = require('./alert-sender');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'logs', 'price-check.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}`;
  console.log(entry);
  
  try {
    fs.appendFileSync(LOG_FILE, entry + '\n');
  } catch (e) {
    // Ignore log write errors
  }
}

async function main() {
  log('Starting price check cron...');
  
  try {
    // Check for price changes
    const alerts = wishlistService.checkPriceChanges();
    log(`Found ${alerts.length} price changes`);
    
    // Send alerts
    let sentCount = 0;
    let errorCount = 0;
    
    for (const alert of alerts) {
      try {
        if (alert.type === 'price_drop') {
          await alertSender.sendPriceDropAlert(alert.email, alert);
          sentCount++;
          log(`Sent price drop alert to ${alert.email} for ${alert.productName}`);
        } else if (alert.type === 'restock') {
          await alertSender.sendRestockAlert(alert.email, alert);
          sentCount++;
          log(`Sent restock alert to ${alert.email} for ${alert.productName}`);
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        errorCount++;
        log(`Failed to send alert to ${alert.email}: ${error.message}`);
      }
    }
    
    // Generate daily digests (only at 9 AM)
    const hour = new Date().getHours();
    if (hour === 9) {
      log('Generating daily digests...');
      const digests = wishlistService.generateDailyDigest();
      const digestEmails = Object.keys(digests);
      
      for (const email of digestEmails) {
        try {
          await alertSender.sendDailyDigest(email, digests[email]);
          log(`Sent daily digest to ${email}`);
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          log(`Failed to send digest to ${email}: ${error.message}`);
        }
      }
      
      log(`Sent ${digestEmails.length} daily digests`);
    }
    
    // Log stats
    const stats = wishlistService.getStats();
    log(`Stats: ${stats.users} users, ${stats.totalTrackedItems} tracked items`);
    log(`Completed: ${sentCount} alerts sent, ${errorCount} errors`);
    
  } catch (error) {
    log(`CRITICAL ERROR: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
