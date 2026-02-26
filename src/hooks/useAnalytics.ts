/**
 * useAnalytics Hook
 * Track affiliate clicks, product views, and user engagement
 * 
 * Usage:
 * const { trackClick, trackView, trackSearch, trackVendorFilter } = useAnalytics();
 * 
 * trackClick(product, vendor, category, price);
 * trackView(product, vendor, category);
 */

import { useCallback } from 'react';

export function useAnalytics() {
  // Track affiliate link click
  const trackClick = useCallback((product, vendor, category, price) => {
    if (typeof window === 'undefined') return;
    
    // Track with Google Analytics
    if (window.gtag) {
      window.gtag('event', 'affiliate_click', {
        event_category: 'engagement',
        event_label: `${vendor} - ${product}`,
        vendor: vendor,
        product_name: product,
        product_category: category,
        price_range: price,
        value: parseFloat(price) || 0,
        currency: 'USD'
      });
    }
    
    // Track with custom endpoint
    if (window.trackAffiliateClick) {
      window.trackAffiliateClick(product, vendor, category, price);
    }
    
    // Send to local analytics if available
    try {
      fetch('/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'click',
          product: product.name || product,
          vendor: vendor,
          category: category,
          price: price
        })
      }).catch(() => {});
    } catch (e) {}
  }, []);

  // Track product view
  const trackView = useCallback((product, vendor, category) => {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('event', 'product_view', {
        event_category: 'engagement',
        vendor: vendor,
        product_name: product.name || product,
        product_category: category
      });
    }
    
    if (window.trackProductView) {
      window.trackProductView(product, vendor, category);
    }
  }, []);

  // Track search query
  const trackSearch = useCallback((query, resultCount) => {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('event', 'search', {
        event_category: 'engagement',
        search_term: query,
        result_count: resultCount
      });
    }
    
    if (window.trackSearch) {
      window.trackSearch(query, resultCount);
    }
  }, []);

  // Track vendor filter
  const trackVendorFilter = useCallback((vendor) => {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('event', 'vendor_filter', {
        event_category: 'engagement',
        event_label: vendor,
        vendor: vendor
      });
    }
    
    if (window.trackVendorFilter) {
      window.trackVendorFilter(vendor);
    }
  }, []);

  // Track category filter
  const trackCategoryFilter = useCallback((category) => {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('event', 'category_filter', {
        event_category: 'engagement',
        event_label: category,
        category: category
      });
    }
  }, []);

  // Track page view
  const trackPageView = useCallback((page) => {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
      window.gtag('config', 'G-SWITCHYARD', {
        page_path: page
      });
    }
  }, []);

  return {
    trackClick,
    trackView,
    trackSearch,
    trackVendorFilter,
    trackCategoryFilter,
    trackPageView
  };
}

// Higher-order component for tracking product cards
export function withTracking(Component) {
  return function TrackedComponent(props) {
    const { trackClick, trackView } = useAnalytics();
    
    return (
      <Component
        {...props}
        onTrackClick={trackClick}
        onTrackView={trackView}
      />
    );
  };
}

// Tracking wrapper for links
export function TrackedLink({ 
  href, 
  product, 
  vendor, 
  category, 
  price,
  children,
  className,
  ...props 
}) {
  const { trackClick } = useAnalytics();
  
  const handleClick = (e) => {
    trackClick(product, vendor, category, price);
    // Allow navigation to proceed
  };
  
  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}
