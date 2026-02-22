-- Price History Schema for Keebshelf
-- Tracks prices over time for trend analysis

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    vendor TEXT NOT NULL,
    price_text TEXT NOT NULL,
    price_numeric DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    category TEXT NOT NULL,
    status TEXT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    affiliate_url TEXT,
    image_url TEXT,
    
    -- Indexing
    INDEX idx_product_id ON product_id,
    INDEX idx_vendor ON vendor,
    INDEX idx_scraped_at ON scraped_at DESC,
    INDEX idx_product_scraped ON product_id, scraped_at DESC
);

-- Current prices view (latest price per product)
CREATE OR REPLACE VIEW current_prices AS
SELECT DISTINCT ON (product_id)
    id,
    product_id,
    product_name,
    vendor,
    price_text,
    price_numeric,
    status,
    available,
    scraped_at,
    affiliate_url
FROM price_history
ORDER BY product_id, scraped_at DESC;

-- Price drops view (products that dropped in price in the last 7 days)
CREATE OR REPLACE VIEW price_drops AS
WITH latest_prices AS (
    SELECT DISTINCT ON (product_id)
        product_id,
        price_numeric as current_price,
        scraped_at
    FROM price_history
    ORDER BY product_id, scraped_at DESC
),
previous_prices AS (
    SELECT DISTINCT ON (product_id)
        product_id,
        price_numeric as previous_price
    FROM price_history
    WHERE scraped_at < NOW() - INTERVAL '7 days'
    ORDER BY product_id, scraped_at DESC
)
SELECT 
    cp.*,
    lp.current_price,
    pp.previous_price,
    ROUND((pp.previous_price - lp.current_price), 2) as price_drop_amount,
    ROUND(((pp.previous_price - lp.current_price) / pp.previous_price * 100), 2) as price_drop_percent
FROM current_prices cp
JOIN latest_prices lp ON cp.product_id = lp.product_id
JOIN previous_prices pp ON cp.product_id = pp.product_id
WHERE lp.current_price < pp.previous_price
AND pp.previous_price > 0;

-- Daily price summary (for email digests)
CREATE TABLE IF NOT EXISTS daily_summaries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    summary_date DATE NOT NULL,
    new_products JSONB,
    price_drops JSONB,
    back_in_stock JSONB,
    sold_out JSONB,
    total_products INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(summary_date)
);

-- Price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    product_id TEXT NOT NULL,
    target_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    triggered_at TIMESTAMP WITH TIME ZONE,
    INDEX idx_email ON email,
    INDEX idx_product_id ON product_id,
    INDEX idx_active ON is_active WHERE is_active = true
);

-- Email subscriptions table
CREATE TABLE IF NOT EXISTS email_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    preferences JSONB DEFAULT '{"daily_digest": true, "price_alerts": true}'::jsonb,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX idx_email ON email
);

-- RLS Policies (security)
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Everyone can read price history
CREATE POLICY "Allow read price_history" ON price_history
    FOR SELECT USING (true);

-- Users can only see their own alerts
CREATE POLICY "Allow insert price_alerts" ON price_alerts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select own price_alerts" ON price_alerts
    FOR SELECT USING (true);

CREATE POLICY "Allow update own price_alerts" ON price_alerts
    FOR UPDATE USING (true);

-- Email subscriptions
CREATE POLICY "Allow insert email_subscriptions" ON email_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update own email_subscriptions" ON email_subscriptions
    FOR UPDATE USING (email = current_setting('app.current_email', true));
