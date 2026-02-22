// Price History Tracker for Keebshelf
// Records prices over time for trend analysis
// Usage: node price-tracker.js

const fs = require('fs');
const path = require('path');

const { createClient } = require('@supabase/supabase-js');

// Load data
const DATA_FILE = path.join(__dirname, '..', 'data', 'keyboard-data.json');

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('⚠️  SUPABASE_URL and SUPABASE_SERVICE_KEY required for price tracking');
    console.log('   Price tracking will be skipped. Set env vars to enable.');
    process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Parse price string to number
function parsePrice(priceStr) {
    if (!priceStr || priceStr === 'N/A' || priceStr === 'TBA') return 0;
    const match = priceStr.match(/[\d,]+\.?\d*/);
    if (!match) return 0;
    return parseFloat(match[0].replace(/,/g, ''));
}

// Generate consistent product ID
function generateProductId(product) {
    return `${product.vendor}-${product.id}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

async function trackPrices() {
    console.log('📊 Price History Tracker Starting...\n');
    
    let data;
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        data = JSON.parse(raw);
    } catch (err) {
        console.error('❌ Could not read data file:', err.message);
        process.exit(1);
    }
    
    const products = data.allProducts || [];
    const timestamp = new Date().toISOString();
    
    console.log(`Found ${products.length} products to track\n`);
    
    let inserted = 0;
    let errors = 0;
    
    for (const product of products) {
        try {
            const productId = generateProductId(product);
            const priceNumeric = parsePrice(product.price);
            
            // Skip invalid prices
            if (priceNumeric === 0) {
                console.log(`⚠️  Skipping ${product.name} - no valid price (${product.price})`);
                continue;
            }
            
            const record = {
                product_id: productId,
                product_name: product.name.slice(0, 200), // truncate if needed
                vendor: product.vendor,
                price_text: product.price,
                price_numeric: priceNumeric,
                category: product.category || 'unknown',
                status: product.status || 'active',
                available: product.status !== 'sold_out' && product.status !== 'unavailable',
                scraped_at: timestamp,
                affiliate_url: product.affiliateUrl || product.url,
                image_url: product.image || null
            };
            
            const { error } = await supabase
                .from('price_history')
                .upsert(record, {
                    onConflict: 'product_id, scraped_at',
                    ignoreDuplicates: true
                });
            
            if (error) {
                console.error(`❌ Error inserting ${product.name}:`, error.message);
                errors++;
            } else {
                inserted++;
                process.stdout.write(`✓ `);
                if (inserted % 50 === 0) {
                    process.stdout.write(` ${inserted}\n`);
                }
            }
            
        } catch (err) {
            console.error(`❌ Error processing ${product.name}:`, err.message);
            errors++;
        }
    }
    
    console.log(`\n✅ Price tracking complete: ${inserted} inserted, ${errors} errors`);
    
    // Generate daily summary
    await generateDailySummary();
}

async function generateDailySummary() {
    console.log('\n📈 Generating daily summary...');
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
        // Get new products from today
        const { data: newProducts, error: newError } = await supabase
            .from('price_history')
            .select('*')
            .gte('scraped_at', today)
            .limit(50);
        
        if (newError) throw newError;
        
        // Get price drops (this would need previous day's data)
        const { data: priceDrops } = await supabase
            .rpc('get_price_drops', { days: 7 })
            .or(await supabase.from('price_drops').select('*').limit(20));
        
        const summary = {
            summary_date: today,
            new_products: newProducts || [],
            price_drops: priceDrops || [],
            back_in_stock: [], // Would need comparison logic
            sold_out: [],
            total_products: (newProducts || []).length,
            created_at: new Date().toISOString()
        };
        
        const { error } = await supabase
            .from('daily_summaries')
            .upsert(summary, { onConflict: 'summary_date' });
        
        if (error) {
            console.error('❌ Error saving summary:', error.message);
        } else {
            console.log(`✅ Summary saved for ${today}`);
        }
        
    } catch (err) {
        console.error('❌ Summary generation failed:', err.message);
    }
}

// Check price alerts and notify users
async function checkPriceAlerts() {
    console.log('\n🔔 Checking price alerts...\n');
    
    try {
        // Get active alerts where current price <= target
        const { data: alerts, error } = await supabase
            .from('price_alerts')
            .select(`
                id,
                email,
                product_id,
                target_price
            `)
            .eq('is_active', true)
            .lte('target_price', supabase.rpc('get_current_price', { pid: 'price_alerts.product_id' }));
        
        if (error) throw error;
        
        if (!alerts || alerts.length === 0) {
            console.log('No price alerts triggered');
            return;
        }
        
        console.log(`🎯 ${alerts.length} price alerts triggered`);
        
        // Send emails (would integrate with SendGrid here)
        for (const alert of alerts) {
            console.log(`✉️  Would email ${alert.email} about ${alert.product_id}`);
            
            // Mark as triggered
            await supabase
                .from('price_alerts')
                .update({ triggered_at: new Date().toISOString() })
                .eq('id', alert.id);
        }
        
    } catch (err) {
        console.error('❌ Price alert check failed:', err.message);
    }
}

// Main
if (require.main === module) {
    trackPrices()
        .then(() => checkPriceAlerts())
        .then(() => {
            console.log('\n✨ Price tracking complete');
            process.exit(0);
        })
        .catch(err => {
            console.error('💥 Fatal error:', err);
            process.exit(1);
        });
}

module.exports = { trackPrices, checkPriceAlerts, parsePrice };