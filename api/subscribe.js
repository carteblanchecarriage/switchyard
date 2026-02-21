/**
 * Email Subscription API for Keebshelf
 * POST /api/subscribe
 * 
 * Body: { email: string, preferences: { daily_digest: boolean, price_alerts: boolean } }
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Simple email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { email, preferences } = req.body;
    
    // Validate email
    if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Rate limiting
    // Note: In production, use Redis or similar
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Subscription attempt from ${clientIP}: ${normalizedEmail}`);
    
    try {
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            return res.status(500).json({ 
                error: 'Database not configured',
                message: 'Supabase credentials not set'
            });
        }
        
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        
        // Default preferences
        const prefs = {
            daily_digest: true,
            price_alerts: true,
            ...preferences
        };
        
        // Insert or update subscription
        const { data, error } = await supabase
            .from('email_subscriptions')
            .upsert({
                email: normalizedEmail,
                preferences: prefs,
                created_at: new Date().toISOString()
            }, {
                onConflict: 'email',
                ignoreDuplicates: false
            })
            .select();
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        // TODO: Send confirmation email
        // await sendConfirmationEmail(normalizedEmail, prefs);
        
        // TODO: Add to email service (SendGrid, Mailgun, etc.)
        
        res.status(200).json({
            success: true,
            message: 'Subscribed successfully',
            email: normalizedEmail,
            preferences: prefs
        });
        
    } catch (err) {
        console.error('Subscription error:', err);
        res.status(500).json({ 
            error: 'Failed to subscribe',
            message: err.message
        });
    }
};

// Optional: Send confirmation email
/*
async function sendConfirmationEmail(email, preferences) {
    const confirmUrl = `https://keebshelf.com/confirm?email=${encodeURIComponent(email)}`;
    
    const html = `
        <h1>Welcome to Keebshelf</h1>
        <p>You're subscribed to:</p>
        <ul>
            ${preferences.daily_digest ? '<li>Daily digest (new products, price drops)</li>' : ''}
            ${preferences.price_alerts ? '<li>Price alerts for watched items</li>' : ''}
        </ul>
        <p><a href="${confirmUrl}">Confirm your email</a></p>
        <p><a href="https://keebshelf.com/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a></p>
    `;
    
    // Send via SendGrid, Mailgun, etc.
}
*/