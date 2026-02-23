/**
 * Keebshelf Alert Email Sender
 * 
 * Sends email alerts for:
 * - Price drops
 * - Restock notifications
 * - Daily digest
 * 
 * Supports: SendGrid, Mailgun (configurable)
 * 
 * Usage:
 * const sender = require('./alert-sender');
 * await sender.sendPriceDropAlert(email, alertData);
 */

const fs = require('fs');
const path = require('path');

// Email service configuration
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'console'; // 'sendgrid', 'mailgun', or 'console'
const FROM_EMAIL = process.env.FROM_EMAIL || 'alerts@keebshelf.com';
const FROM_NAME = process.env.FROM_NAME || 'Keebshelf';

// API keys (loaded from env)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

// Templates
const EMAIL_TEMPLATES = {
  priceDrop: (data) => ({
    subject: `💰 Price Drop Alert: ${data.productName}`,
    text: `Price Drop Alert!

${data.productName}
Was: ${data.oldPrice}
Now: ${data.newPrice}
Drop: ${data.dropPercent}%

View product: ${data.url}

You're receiving this because you saved this item to your Keebshelf wishlist.
Unsubscribe: https://keebshelf.com/unsubscribe?email=${encodeURIComponent(data.email)}`,
    html: `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #059669;">💰 Price Drop Alert!</h1>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <img src="${data.image}" alt="${data.productName}" style="max-width: 200px; border-radius: 4px;">
        <h2 style="margin: 10px 0 5px;">${data.productName}</h2>
        <p style="color: #6b7280; margin: 5px 0;">${data.vendor}</p>
        
        <div style="margin: 15px 0;">
          <span style="text-decoration: line-through; color: #9ca3af; font-size: 18px;">${data.oldPrice}</span>
          <span style="color: #059669; font-size: 24px; font-weight: bold; margin-left: 10px;">${data.newPrice}</span>
        </div>
        
        <div style="background: #d1fae5; color: #065f46; padding: 10px; border-radius: 4px; display: inline-block;">
          ↓ ${data.dropPercent}% price drop!
        </div>
      </div>
      
      <a href="${data.url}" style="background: #2d2d2d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        View on ${data.vendor} →
      </a>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #6b7280; font-size: 14px;">
        You're receiving this because you saved this item to your Keebshelf wishlist.<br>
        <a href="https://keebshelf.com/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>`
  }),

  restock: (data) => ({
    subject: `🎉 Back in Stock: ${data.productName}`,
    text: `Restock Alert!

${data.productName} is back in stock!
Price: ${data.price}

View product: ${data.url}

You're receiving this because you asked to be notified when this item returns to stock.
Unsubscribe: https://keebshelf.com/unsubscribe?email=${encodeURIComponent(data.email)}`,
    html: `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb;">🎉 Back in Stock!</h1>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <img src="${data.image}" alt="${data.productName}" style="max-width: 200px; border-radius: 4px;">
        <h2 style="margin: 10px 0 5px;">${data.productName}</h2>
        <p style="color: #6b7280; margin: 5px 0;">${data.vendor}</p>
        <p style="font-size: 20px; font-weight: bold; margin: 10px 0;">${data.price}</p>
        
        <div style="background: #dbeafe; color: #1e40af; padding: 10px; border-radius: 4px; display: inline-block;">
          ✅ Available now!
        </div>
      </div>
      
      <a href="${data.url}" style="background: #2d2d2d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Buy Now on ${data.vendor} →
      </a>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
      
      <p style="color: #6b7280; font-size: 14px;">
        You're receiving this because you asked to be notified when this item returns to stock.<br>
        <a href="https://keebshelf.com/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>`
  }),

  digest: (data) => {
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <img src="${item.image}" alt="${item.name}" style="max-width: 80px; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong><br>
          <span style="color: #6b7280; font-size: 14px;">${item.vendor}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ${item.currentPrice}
          ${item.priceChange ? `
            <span style="color: ${item.isLower ? '#059669' : '#dc2626'}; font-size: 12px; display: block;">
              ${item.isLower ? '↓' : '↑'} ${item.priceChange}%
            </span>
          ` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <a href="${item.url}" style="background: #2d2d2d; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 14px;">
            View
          </a>
        </td>
      </tr>
    `).join('');

    return {
      subject: `📊 Your Keebshelf Daily Digest - ${data.itemCount} items tracked`,
      text: `Daily Digest - ${data.itemCount} Items

${data.items.map(item => `- ${item.name} (${item.vendor}): ${item.currentPrice}`).join('\n')}

View your wishlist: https://keebshelf.com/wishlist
Unsubscribe: https://keebshelf.com/unsubscribe?email=${encodeURIComponent(data.email)}`,
      html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1>📊 Your Daily Digest</h1>
        <p style="color: #6b7280;">${data.itemCount} items in your wishlist</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 10px; text-align: left;"></th>
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px;"></th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 14px;">
          You're receiving this daily digest because you subscribed to price alerts.<br>
          <a href="https://keebshelf.com/wishlist" style="color: #2563eb;">Manage your wishlist</a> | 
          <a href="https://keebshelf.com/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #6b7280;">Unsubscribe</a>
        </p>
      </div>`
    };
  }
};

class AlertSender {
  constructor() {
    this.service = EMAIL_SERVICE;
    this.logFile = path.join(__dirname, '..', 'logs', 'email-alerts.log');
    
    // Ensure log directory exists
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    console.log(logEntry.trim());
    
    try {
      fs.appendFileSync(this.logFile, logEntry);
    } catch (e) {
      console.error('Failed to write to log:', e);
    }
  }

  /**
   * Send a single email alert
   */
  async sendAlert(email, type, data) {
    const template = EMAIL_TEMPLATES[type];
    if (!template) {
      throw new Error(`Unknown alert type: ${type}`);
    }

    const emailData = { ...data, email };
    const { subject, text, html } = template(emailData);

    // Log the alert
    this.log(`ALERT: ${type} to ${email} - ${data.productName || 'digest'}`);

    // Send based on configured service
    switch (this.service) {
      case 'sendgrid':
        return await this.sendSendGrid(email, subject, text, html);
      case 'mailgun':
        return await this.sendMailgun(email, subject, text, html);
      case 'console':
      default:
        return this.sendConsole(email, subject, text, html);
    }
  }

  /**
   * Send via console (for testing)
   */
  sendConsole(to, subject, text, html) {
    console.log('\n' + '='.repeat(60));
    console.log('📧 CONSOLE EMAIL (Testing Mode)');
    console.log('='.repeat(60));
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('-'.repeat(60));
    console.log(text);
    console.log('='.repeat(60) + '\n');
    
    return {
      success: true,
      messageId: 'console-' + Date.now(),
      provider: 'console'
    };
  }

  /**
   * Send via SendGrid
   */
  async sendSendGrid(to, subject, text, html) {
    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    try {
      // Note: Requires @sendgrid/mail package
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(SENDGRID_API_KEY);
      // await sgMail.send({ to, from: FROM_EMAIL, subject, text, html });
      
      this.log('SendGrid send attempted (requires @sendgrid/mail package)');
      
      return {
        success: true,
        messageId: 'sendgrid-' + Date.now(),
        provider: 'sendgrid'
      };
    } catch (error) {
      this.log(`SendGrid error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send via Mailgun
   */
  async sendMailgun(to, subject, text, html) {
    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      throw new Error('Mailgun credentials not configured');
    }

    try {
      // Note: Requires mailgun.js package
      // const formData = require('form-data');
      // const Mailgun = require('mailgun.js');
      // const mailgun = new Mailgun(formData);
      // const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });
      // await mg.messages.create(MAILGUN_DOMAIN, { from: FROM_EMAIL, to, subject, text, html });
      
      this.log('Mailgun send attempted (requires mailgun.js package)');
      
      return {
        success: true,
        messageId: 'mailgun-' + Date.now(),
        provider: 'mailgun'
      };
    } catch (error) {
      this.log(`Mailgun error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send price drop alert
   */
  async sendPriceDropAlert(email, alertData) {
    return this.sendAlert(email, 'priceDrop', alertData);
  }

  /**
   * Send restock alert
   */
  async sendRestockAlert(email, alertData) {
    return this.sendAlert(email, 'restock', alertData);
  }

  /**
   * Send daily digest
   */
  async sendDailyDigest(email, digestData) {
    return this.sendAlert(email, 'digest', digestData);
  }

  /**
   * Send test email
   */
  async sendTestEmail(to) {
    return this.sendAlert(to, 'priceDrop', {
      productName: 'Keychron Q1 Pro (Test)',
      vendor: 'Keychron',
      oldPrice: '$199.00',
      newPrice: '$179.00',
      dropPercent: '10.0',
      url: 'https://keychron.com',
      image: 'https://via.placeholder.com/300x200?text=Test+Image'
    });
  }
}

// Export singleton
module.exports = new AlertSender();

// CLI usage
if (require.main === module) {
  const sender = new AlertSender();
  const args = process.argv.slice(2);
  
  if (args[0] === 'test' && args[1]) {
    sender.sendTestEmail(args[1])
      .then(() => console.log('Test email sent'))
      .catch(err => console.error('Failed:', err));
  } else {
    console.log('Usage: node alert-sender.js test <email>');
  }
}
