/**
 * Keebshelf Wishlist API Routes
 * 
 * Add these routes to your Express app:
 * 
 * const wishlistRoutes = require('./wishlist-routes');
 * app.use('/api/wishlist', wishlistRoutes);
 */

const express = require('express');
const router = express.Router();
const wishlistService = require('./wishlist-service');

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Middleware to validate email
function validateEmail(req, res, next) {
  const email = req.body.email || req.query.email;
  
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_EMAIL',
        message: 'Please provide a valid email address'
      }
    });
  }
  
  req.validatedEmail = email.toLowerCase().trim();
  next();
}

/**
 * POST /api/wishlist/add
 * Add product to wishlist
 * Body: { email, productId }
 */
router.post('/add', validateEmail, (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PRODUCT_ID',
          message: 'Product ID is required'
        }
      });
    }
    
    const result = wishlistService.addToWishlist(req.validatedEmail, productId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: result.success ? {
        message: result.message,
        item: result.item
      } : undefined,
      error: !result.success ? {
        code: 'ADD_FAILED',
        message: result.error
      } : undefined
    });
    
  } catch (error) {
    console.error('Wishlist add error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to add to wishlist'
      }
    });
  }
});

/**
 * POST /api/wishlist/remove
 * Remove product from wishlist
 * Body: { email, productId }
 */
router.post('/remove', validateEmail, (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PRODUCT_ID',
          message: 'Product ID is required'
        }
      });
    }
    
    const result = wishlistService.removeFromWishlist(req.validatedEmail, productId);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      data: { removed: result.removed },
      error: !result.success ? {
        code: 'REMOVE_FAILED',
        message: result.error
      } : undefined
    });
    
  } catch (error) {
    console.error('Wishlist remove error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to remove from wishlist'
      }
    });
  }
});

/**
 * GET /api/wishlist?email=user@example.com
 * Get user's wishlist
 */
router.get('/', validateEmail, (req, res) => {
  try {
    const wishlist = wishlistService.getWishlist(req.validatedEmail);
    
    res.json({
      success: true,
      data: {
        email: req.validatedEmail,
        items: wishlist.items || [],
        preferences: wishlist.preferences || {
          daily_digest: true,
          price_alerts: true,
          restock_alerts: true
        },
        itemCount: (wishlist.items || []).length
      }
    });
    
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get wishlist'
      }
    });
  }
});

/**
 * POST /api/wishlist/preferences
 * Update user preferences
 * Body: { email, preferences: { daily_digest, price_alerts, restock_alerts } }
 */
router.post('/preferences', validateEmail, (req, res) => {
  try {
    const { preferences } = req.body;
    
    const result = wishlistService.updatePreferences(req.validatedEmail, preferences);
    
    res.status(result.success ? 200 : 400).json({
      success: result.success,
      error: !result.success ? {
        code: 'UPDATE_FAILED',
        message: result.error
      } : undefined
    });
    
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update preferences'
      }
    });
  }
});

/**
 * GET /api/wishlist/stats
 * Get wishlist service stats (admin only)
 */
router.get('/stats', (req, res) => {
  try {
    const stats = wishlistService.getStats();
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get stats'
      }
    });
  }
});

module.exports = router;
